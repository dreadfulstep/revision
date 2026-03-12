import env from "@/utils/env";
import { Router } from "express";
import crypto from "crypto";
import redis from "@/lib/redis";
import fetch from "node-fetch";
import db from "@/db";
import { sessions } from "@/db/tables/sessions";
import { users } from "@/db/tables/users";
import { encrypt } from "@/lib/crypto";
import { DiscordUser } from "@/types/discord";

type DiscordTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: "Bearer";
};

const router = Router();

router.get("/", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 10 * 60 * 1000),
  });
  redis.set(`oauth_state:${state}`, "valid", { EX: 10 * 60 });

  const { local } = req.query;

  const redirectUrl = local ? env.localDiscordRedirectUrl : env.discordRedirectUrl 

  const params = new URLSearchParams({
    client_id: env.discordClientId,
    redirect_uri: redirectUrl,
    response_type: "code",
    scope: "identify email",
    state: state,
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

router.get("/discord", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }

    if ((await redis.get(`oauth_state:${state}`)) !== "valid") {
      return res.status(400).json({ error: "Invalid state" });
    }

    if ((await redis.get(`invalid-code:${code}`)) === "TRUE") {
      return res.status(400).json({ error: "Invalid code" });
    }

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.discordClientId,
        client_secret: env.discordClientSecret,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: env.discordRedirectUrl,
      }),
    });

    const tokenData = (await tokenRes.json()) as DiscordTokenResponse;

    if (!tokenData.access_token) {
      redis.set(`invalid-code:${code}`, "TRUE", { EX: 60 * 60 });
      return res.status(400).json({ error: "Failed to get access token" });
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const discordUser = (await userRes.json()) as DiscordUser;

    await db
      .insert(users)
      .values({
        id: discordUser.id,
        username: discordUser.username,
        avatar: discordUser.avatar,
        email: discordUser.email,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: discordUser.username,
          avatar: discordUser.avatar,
          email: discordUser.email,
        },
      });

    const sessionId = crypto.randomUUID();
    await db.insert(sessions).values({
      id: sessionId,
      userId: discordUser.id,
      accessToken: encrypt(tokenData.access_token),
      refreshToken: tokenData.refresh_token
        ? encrypt(tokenData.refresh_token)
        : null,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });

    await redis.set(`user:${discordUser.id}`, JSON.stringify(discordUser), {
      EX: 30 * 60,
    });

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in * 1000,
    });

    res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_SUCCESS", user: ${JSON.stringify(discordUser)} }, "${env.frontendUrl}");
        window.close();
      </script>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

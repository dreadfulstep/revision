import { Discord } from "arctic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { createSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const discord = new Discord(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
  process.env.DISCORD_REDIRECT_URI!,
);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();

  const storedState = cookieStore.get("discord_state")?.value;
  const codeVerifier = cookieStore.get("discord_code_verifier")?.value;
  cookieStore.delete("discord_state");
  cookieStore.delete("discord_code_verifier");

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const tokens = await discord.validateAuthorizationCode(code, codeVerifier);

  const discordUser = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokens.accessToken()}` },
  }).then((r) => r.json());

  const providerUserId = String(discordUser.id);

  const existing = await db
    .select()
    .from(accounts)
    .where(eq(accounts.providerUserId, providerUserId))
    .limit(1);

  let userId: string;

  if (existing[0]) {
    userId = existing[0].userId;
  } else {
    userId = nanoid();
    await db.insert(users).values({
      id: userId,
      username: discordUser.username,
      avatar: discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : null,
    });
    await db.insert(accounts).values({
      provider: "discord",
      providerUserId,
      userId,
      accessToken: tokens.accessToken(),
      expiresAt: tokens.accessTokenExpiresAt(),
    });
  }

  await createSession(userId);
  return NextResponse.redirect(new URL("/dashboard", req.url));
}

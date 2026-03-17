import { GitHub } from "arctic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { createSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
  process.env.GITHUB_REDIRECT_URI!
);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_state")?.value;
  cookieStore.delete("github_state");

  if (!code || !state || state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUser = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    }).then((r) => r.json());

    const providerUserId = String(githubUser.id);

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
        username: githubUser.login,
        avatar: githubUser.avatar_url,
      });

      await db.insert(accounts).values({
        provider: "github",
        providerUserId,
        userId,
        accessToken: tokens.accessToken(),
        expiresAt: tokens.accessTokenExpiresAt() || null, 
      });
    }

    await createSession(userId);
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
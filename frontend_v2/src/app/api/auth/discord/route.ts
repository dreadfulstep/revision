import { Discord, generateCodeVerifier } from "arctic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const discord = new Discord(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
  process.env.DISCORD_REDIRECT_URI!,
);

export async function GET() {
  const state = nanoid();
  const codeVerifier = generateCodeVerifier();

  const url = discord.createAuthorizationURL(state, codeVerifier, ["identify"]);

  const cookieStore = await cookies();
  cookieStore.set("discord_state", state, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 10,
    path: "/",
  });
  cookieStore.set("discord_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 10,
    path: "/",
  });

  return NextResponse.redirect(url);
}

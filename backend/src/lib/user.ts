import { sessions } from "@/db/schema";
import redis from "./redis";
import db from "@/db";
import { eq } from "drizzle-orm";
import { decrypt } from "./crypto";
import { DiscordUser } from "@/types/discord";

export async function getUser(userId: string) {
  const cacheKey = `user:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .limit(1)
    .execute()
    .then((rows) => rows[0]);

  const accessToken = decrypt(session.accessToken);

  const userRes = await fetch(`https://discord.com/api/v10/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userJson = await userRes.json() as DiscordUser;

  await redis.set(cacheKey, JSON.stringify(userJson), { EX: 30 * 60 });

  return userJson;
}

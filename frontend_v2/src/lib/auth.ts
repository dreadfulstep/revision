import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import { sessions, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { syncStreak } from "./streak";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "session";

export async function createSession(userId: string) {
  const sessionId = nanoid();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

  await db.insert(sessions).values({ id: sessionId, userId, expiresAt });

  const token = await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const sessionId = payload.sessionId as string;

    const result = await db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1);

    const user = result[0]?.user ?? null;
    if (!user) return null;

    await syncStreak(user.id);

    return user;
  } catch (e) {
    console.error("getSession error:", e);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return;

  try {
    const { payload } = await jwtVerify(token, secret);
    await db
      .delete(sessions)
      .where(eq(sessions.id, payload.sessionId as string));
  } catch {}

  cookieStore.delete(COOKIE);
}

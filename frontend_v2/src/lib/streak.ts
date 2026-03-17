import { eq } from "drizzle-orm";
import { db } from "./db";
import { streaks } from "./db/schema";

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0]!;
}

export async function incrementStreak(userId: string) {
  const today = todayStr();

  const streak = await db.query.streaks.findFirst({
    where: eq(streaks.userId, userId),
  });

  if (!streak) {
    await db.insert(streaks).values({
      userId,
      current: 1,
      longest: 1,
      lastActivityDate: today,
    });
    return;
  }

  if (streak.lastActivityDate === today) return;

  const yesterday = yesterdayStr();
  const continued = streak.lastActivityDate === yesterday;
  const newCurrent = continued ? streak.current + 1 : 1;
  const newLongest = Math.max(newCurrent, streak.longest);

  await db.update(streaks)
    .set({
      current: newCurrent,
      longest: newLongest,
      lastActivityDate: today,
    })
    .where(eq(streaks.userId, userId));
}

export async function syncStreak(userId: string) {
  const streak = await db.query.streaks.findFirst({
    where: eq(streaks.userId, userId),
  });

  if (!streak) return;

  const today = todayStr();
  const yesterday = yesterdayStr();
  const last = streak.lastActivityDate;

  if (last && last !== today && last !== yesterday) {
    await db.update(streaks)
      .set({ current: 0 })
      .where(eq(streaks.userId, userId));
  }
}
import db from "@/db";
import { streaks } from "@/db/tables/streaks";
import { eq } from "drizzle-orm";

type StreakResult = {
  current: number;
  longest: number;
}

export async function updateStreak(userId: string): Promise<StreakResult> {
  const today = new Date().toISOString().split("T")[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const streak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  // first ever quiz
  if (!streak) {
    await db.insert(streaks).values({
      userId,
      current: 1,
      longest: 1,
      lastActivityDate: today,
    });
    return { current: 1, longest: 1 };
  }

  // already quizzed today, no change
  if (streak.lastActivityDate === today) {
    return { current: streak.current, longest: streak.longest };
  }

  const newCurrent = streak.lastActivityDate === yesterdayStr ? streak.current + 1 : 1;
  const newLongest = Math.max(newCurrent, streak.longest);

  await db
    .update(streaks)
    .set({ current: newCurrent, longest: newLongest, lastActivityDate: today })
    .where(eq(streaks.userId, userId));

  return { current: newCurrent, longest: newLongest };
}
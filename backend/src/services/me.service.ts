import db from "@/db";
import { users } from "@/db/tables/users";
import { quizAttemptsTable } from "@/db/tables/quizzes";
import { eq } from "drizzle-orm";
import { getLevel, getXPBreakdown } from "@/utils/xp";
import { streaks } from "@/db/schema";

type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; meta?: object };

export async function getStats(userId: string): Promise<ServiceResult<UserStats>> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then((r) => r[0]);

  if (!user) return { ok: false, status: 404, error: "User not found" };

  const streak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  const levelInfo = getLevel(user.xp);

  return {
    ok: true,
    data: {
      xp: user.xp,
      level: levelInfo,
      quizzesCompleted: user.quizzesCompleted,
      questionsAnswered: user.questionsAnswered,
      streak: streak
        ? { current: streak.current, longest: streak.longest }
        : { current: 0, longest: 0 },
    },
  };
}

export async function getStreak(userId: string): Promise<ServiceResult<StreakInfo>> {
  const streak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  return {
    ok: true,
    data: streak
      ? { current: streak.current, longest: streak.longest, lastActivityDate: streak.lastActivityDate }
      : { current: 0, longest: 0, lastActivityDate: null },
  };
}

type UserStats = {
  xp: number;
  level: ReturnType<typeof getLevel>;
  quizzesCompleted: number;
  questionsAnswered: number;
  streak: { current: number; longest: number };
};

type StreakInfo = {
  current: number;
  longest: number;
  lastActivityDate: string | null;
};
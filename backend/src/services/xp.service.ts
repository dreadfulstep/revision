import db from "@/db";
import { users } from "@/db/tables/users";
import { eq, sql } from "drizzle-orm";

export function calculateXP(score: number, questionCount: number, streakDays: number): number {
  const base = questionCount * 10;
  const scoreBonus = Math.round((score / 100) * questionCount * 15);
  const streakBonus = Math.min(streakDays * 5, 50);
  return base + scoreBonus + streakBonus;
}

export async function awardXP(userId: string, score: number, questionCount: number, streakDays: number): Promise<number> {
  const earned = calculateXP(score, questionCount, streakDays);

  await db.update(users)
    .set({
      xp: sql`${users.xp} + ${earned}`,
      quizzesCompleted: sql`${users.quizzesCompleted} + 1`,
      questionsAnswered: sql`${users.questionsAnswered} + ${questionCount}`,
    })
    .where(eq(users.id, userId));

  return earned;
}
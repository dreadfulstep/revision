import { calculateXP } from "@/utils/xp";
import db from "@/db";
import { users } from "@/db/tables/users";
import { sql, eq } from "drizzle-orm";

export async function awardXP(userId: string, score: number, questionCount: number, streakDays: number) {
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
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizAttempts, quizAnswers, quizzes, streaks } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getRank, xpInLevel, xpProgress } from "@/lib/xp";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const recentAttempts = await db
    .select()
    .from(quizAttempts)
    .where(
      and(
        eq(quizAttempts.userId, user.id),
        eq(quizAttempts.status, "completed"),
      ),
    )
    .orderBy(desc(quizAttempts.completedAt))
    .limit(5);

  const enriched = await Promise.all(
    recentAttempts.map(async (attempt) => {
      const quiz = await db.query.quizzes.findFirst({
        where: eq(quizzes.id, attempt.quizId),
      });
      const answers = await db
        .select()
        .from(quizAnswers)
        .where(eq(quizAnswers.attemptId, attempt.id));
      const correct = answers.filter((a) => a.correct).length;
      return {
        id: attempt.id,
        subjectId: quiz?.subjectId ?? "unknown",
        topics: (quiz?.topics as string[]) ?? [],
        total: attempt.totalQuestions,
        correct,
        percentage: Math.round((correct / attempt.totalQuestions) * 100),
        completedAt: attempt.completedAt?.toISOString() ?? "",
      };
    }),
  );

  const streak = await db.query.streaks.findFirst({
    where: eq(streaks.userId, user.id),
  });

  const inProgress = await db
    .select()
    .from(quizAttempts)
    .where(
      and(
        eq(quizAttempts.userId, user.id),
        eq(quizAttempts.status, "in_progress"),
      ),
    )
    .orderBy(desc(quizAttempts.lastActivityAt))
    .limit(3);

  const rank = getRank(user.level);
  const { current: xpCurrent, needed: xpNeeded } = xpInLevel(user.xp);
  const progress = xpProgress(user.xp);

  return (
    <DashboardClient
      user={{
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        xpCurrent,
        xpNeeded,
        xpProgress: progress,
        quizzesCompleted: user.quizzesCompleted,
        questionsAnswered: user.questionsAnswered,
        rank,
      }}
      streak={
        streak
          ? {
              current: streak.current,
              longest: streak.longest,
              lastActivityDate: streak.lastActivityDate,
            }
          : { current: 0, longest: 0, lastActivityDate: null }
      }
      recentAttempts={enriched}
      inProgress={inProgress.map((a) => ({
        id: a.id,
        currentIndex: a.currentIndex,
        total: a.totalQuestions,
        lastActivityAt: a.lastActivityAt?.toISOString() ?? "",
      }))}
    />
  );
}

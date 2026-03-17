import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizAttempts, quizAnswers, quizzes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getQuestions, resolveTemplate, resolveAnswer } from "@/lib/content";
import { xpForLevel } from "@/lib/xp";

type ResolvedVarsMap = Record<string, Record<string, string | number>>;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> },
) {
  const { attemptId } = await params;
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const attemptWithQuiz = await db
    .select({
      attempt: quizAttempts,
      quiz: quizzes,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .where(eq(quizAttempts.id, attemptId))
    .then((rows) => rows[0]);

  if (!attemptWithQuiz || attemptWithQuiz.attempt.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { attempt, quiz } = attemptWithQuiz;

  const userAnswers = await db
    .select()
    .from(quizAnswers)
    .where(eq(quizAnswers.attemptId, attemptId));

  const allQuestions = getQuestions(quiz.subjectId);

  const review = userAnswers.map((ua) => {
    const originalQuestion = allQuestions.find((q) => q.id === ua.questionId);

    const varsMap = attempt.resolvedVars as ResolvedVarsMap;
    const vars = varsMap?.[ua.questionId] || {};

    return {
      id: ua.id,
      questionId: ua.questionId,
      userAnswer: ua.answer,
      isCorrect: ua.correct,
      template: originalQuestion
        ? resolveTemplate(originalQuestion.template, vars)
        : "Question missing",
      correctAnswer: originalQuestion
        ? resolveAnswer(originalQuestion, vars)
        : "N/A",
      explanation: originalQuestion?.explanation
        ? resolveTemplate(originalQuestion.explanation, vars)
        : null,
    };
  });

  const correctCount = review.filter((r) => r.isCorrect).length;
  const totalXp =
    correctCount * 10 + (attempt.totalQuestions - correctCount) * 2;

  return NextResponse.json({
    correct: correctCount,
    total: attempt.totalQuestions,
    percentage: Math.round((correctCount / attempt.totalQuestions) * 100),
    totalXp: totalXp,
    userLevel: user.level ?? 1,
    currentLevelXp: user.xp ?? 0,
    xpToNextLevel: xpForLevel(user.level + 1),
    review,
  });
}

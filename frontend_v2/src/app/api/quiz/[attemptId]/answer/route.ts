import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizAttempts, quizAnswers, quizzes, users } from "@/lib/db/schema";
import { getQuestions, resolveAnswer, resolveTemplate } from "@/lib/content";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { levelFromXp, XP_VALUES, getRank } from "@/lib/xp";
import { incrementStreak } from "@/lib/streak";
import { checkAnswer, norm } from "@/lib/answerHelpers";

function getMatchingResults(
  submitted: string,
  correct: string,
): Record<string, boolean> | null {
  try {
    const sub: Record<string, string> = JSON.parse(submitted);
    const cor: Record<string, string> = JSON.parse(correct);
    return Object.fromEntries(
      Object.keys(cor).map((k) => [
        k,
        norm(sub[k] ?? "") === norm(cor[k] ?? ""),
      ]),
    );
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> },
) {
  const { attemptId } = await params;
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionId, answer } = await req.json();

  const attempt = await db.query.quizAttempts.findFirst({
    where: eq(quizAttempts.id, attemptId),
  });
  if (!attempt || attempt.userId !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, attempt.quizId),
  });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allQuestions = getQuestions(quiz.subjectId);
  const question = allQuestions.find((q) => q.id === questionId);
  if (!question)
    return NextResponse.json({ error: "Question not found" }, { status: 404 });

  const resolvedVars =
    (attempt.resolvedVars as Record<string, Record<string, number>>)[
      questionId
    ] ?? {};
  const correctAnswer = resolveAnswer(question, resolvedVars);
  const explanation = resolveTemplate(question.explanation, resolvedVars);
  const answerType = question.answerConfig.type;

  const acceptedAnswers: string[] = [correctAnswer];
  if (question.answerConfig.type === "text") {
    if (question.answerConfig.acceptedAnswers) {
      for (const a of question.answerConfig.acceptedAnswers) {
        acceptedAnswers.push(resolveTemplate(a, resolvedVars));
      }
    }
  }

  const correct = acceptedAnswers.some((accepted) =>
    checkAnswer(answerType, answer, accepted),
  );

  const matchingResults =
    answerType === "matching"
      ? getMatchingResults(answer, correctAnswer)
      : null;

  const newIndex = attempt.currentIndex + 1;
  const isLast = newIndex >= attempt.totalQuestions;

  let xpGained = correct ? XP_VALUES.correctAnswer : XP_VALUES.incorrectAnswer;
  if (isLast) {
    const previousAnswers = await db
      .select()
      .from(quizAnswers)
      .where(eq(quizAnswers.attemptId, attempt.id));
    const perfectQuiz = correct && previousAnswers.every((a) => a.correct);
    xpGained += XP_VALUES.quizComplete;
    if (perfectQuiz) xpGained += XP_VALUES.perfectQuiz;
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });
  if (!currentUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const newXp = currentUser.xp + xpGained;
  const newLevel = levelFromXp(newXp);
  const leveledUp = newLevel > currentUser.level;
  const newRank = getRank(newLevel);
  const oldRank = getRank(currentUser.level);
  const rankedUp = newRank.title !== oldRank.title;

  await db.insert(quizAnswers).values({
    id: nanoid(),
    attemptId: attempt.id,
    questionId,
    answer,
    correct,
    answeredAt: new Date(),
  });

  await db
    .update(quizAttempts)
    .set({
      currentIndex: newIndex,
      lastActivityAt: new Date(),
      ...(isLast ? { status: "completed", completedAt: new Date() } : {}),
    })
    .where(eq(quizAttempts.id, attempt.id));

  await db
    .update(users)
    .set({
      questionsAnswered: eq(users.id, user.id)
        ? currentUser.questionsAnswered + 1
        : 0,
      xp: newXp,
      level: newLevel,
      ...(isLast ? { quizzesCompleted: currentUser.quizzesCompleted + 1 } : {}),
    })
    .where(eq(users.id, user.id));

  if (isLast) {
    await incrementStreak(user.id);
  }

  return NextResponse.json({
    correct,
    correctAnswer,
    explanation,
    isLast,
    xpGained,
    matchingResults,
    leveledUp,
    newLevel,
    rankedUp,
    newRank: rankedUp ? newRank : null,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizAttempts, quizAnswers, quizzes, users } from "@/lib/db/schema";
import { getQuestions, resolveAnswer, resolveTemplate } from "@/lib/content";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { levelFromXp, XP_VALUES, getRank } from "@/lib/xp";
import { incrementStreak } from "@/lib/streak";
import { checkAnswer, getMatchingResults } from "@/lib/answerHelpers";
import { getAnswerTier, markLongForm, markShortForm } from "@/lib/aiMarker";

function parseCorrectAnswer(type: string, correctAnswer: string) {
  switch (type) {
    case "matching": {
      try {
        return JSON.parse(correctAnswer) as Record<string, string>;
      } catch {
        return {};
      }
    }
    case "ordering": {
      try {
        return JSON.parse(correctAnswer) as string[];
      } catch {
        return [];
      }
    }
    case "multi_select": {
      try {
        return JSON.parse(correctAnswer) as string[];
      } catch {
        return [];
      }
    }
    case "multi_part": {
      try {
        return JSON.parse(correctAnswer) as {
          label: string;
          answer: string;
          unit?: string;
        }[];
      } catch {
        return [];
      }
    }
    case "fill_blank": {
      try {
        return JSON.parse(correctAnswer) as string[][];
      } catch {
        return [];
      }
    }
    default:
      return correctAnswer;
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
  if (
    question.answerConfig.type === "text" &&
    question.answerConfig.acceptedAnswers
  ) {
    for (const a of question.answerConfig.acceptedAnswers) {
      acceptedAnswers.push(resolveTemplate(a, resolvedVars));
    }
  }
  if (
    question.answerConfig.type === "fill_blank" &&
    question.answerConfig.acceptedAnswers
  ) {
    for (const row of question.answerConfig.acceptedAnswers) {
      acceptedAnswers.push(
        JSON.stringify(row.map((a) => resolveTemplate(a, resolvedVars))),
      );
    }
  }

  const tier = getAnswerTier(answerType);
  let correct = false;
  let aiFeedback: string | null = null;
  let aiMarks: number | null = null;

  if (tier === "deterministic") {
    correct = acceptedAnswers.some((a) => checkAnswer(answerType, answer, a));
  } else if (tier === "short") {
    const exactPass = acceptedAnswers.some((a) =>
      checkAnswer(answerType, answer, a),
    );
    if (exactPass) {
      correct = true;
    } else {
      const result = await markShortForm(
        question.id,
        quiz.subjectId,
        resolveTemplate(question.template, resolvedVars),
        correctAnswer,
        acceptedAnswers,
        answer,
      );
      correct = result.correct;
      aiFeedback = result.feedback || null;
    }
  } else if (tier === "long") {
    const cfg = question.answerConfig as {
      type: "long_form";
      marks: number;
      markScheme: string;
    };
    const result = await markLongForm(
      question.id,
      quiz.subjectId,
      resolveTemplate(question.template, resolvedVars),
      cfg.markScheme,
      cfg.marks,
      answer,
    );
    correct = result.correct;
    aiFeedback = result.feedback;
    aiMarks = result.marks;
  }

  const matchingResults =
    answerType === "matching"
      ? getMatchingResults(answer, correctAnswer)
      : null;

  const parsedCorrect =
    answerType === "long_form"
      ? (aiFeedback ?? "See explanation")
      : parseCorrectAnswer(answerType, correctAnswer);

  const newIndex = attempt.currentIndex + 1;
  const isLast = newIndex >= attempt.totalQuestions;
  let xpGained: number;

  if (answerType === "long_form") {
    xpGained = Math.max(2, (aiMarks ?? 0) * 5);
  } else {
    xpGained = correct ? XP_VALUES.correctAnswer : XP_VALUES.incorrectAnswer;
  }

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
      questionsAnswered: currentUser.questionsAnswered + 1,
      xp: newXp,
      level: newLevel,
      ...(isLast ? { quizzesCompleted: currentUser.quizzesCompleted + 1 } : {}),
    })
    .where(eq(users.id, user.id));

  if (isLast) await incrementStreak(user.id);

  return NextResponse.json({
    correct,
    correctAnswer: parsedCorrect,
    explanation,
    isLast,
    xpGained,
    matchingResults,
    leveledUp,
    newLevel,
    rankedUp,
    newRank: rankedUp ? newRank : null,
    aiFeedback,
    aiMarks,
  });
}

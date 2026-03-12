import db from "@/db";
import { quizAnswersTable, quizAttemptsTable, quizzesTable } from "@/db/schema";
import {
  AnswerQuestionParams,
  AnswerResult,
  AttemptDetails,
  AttemptSummary,
  CompletedAttempt,
  Question,
  StartedAttempt,
} from "@/types/quiz";
import {
  generateQuestionsFromTemplates,
  getQuestions,
  getSubject,
  hasTemplates,
  isGeneratedId,
  resolveGeneratedQuestion,
  subjects,
} from "@/utils/content";
import { generateSeed, seedArray } from "@/utils/seed";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { checkAnswer } from "@/utils/answer";
import { updateStreak } from "./streak.service";
import { awardXP } from "./xp.service";
import { GeneratedQuestion } from "@/types/template";

type GenerateQuizParams = {
  subjectId: string;
  topics?: string[];
  count?: number;
  seed?: string;
};

type QuestionPreview = Omit<Question, "answer" | "explanation"> | Omit<GeneratedQuestion, "answer" | "explanation" | "vars">;

type GeneratedQuiz = {
  seed: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  count: number;
  questions: QuestionPreview[];
};

type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; meta?: object };

export async function generateQuiz(
  params: GenerateQuizParams,
): Promise<ServiceResult<GeneratedQuiz>> {
  const subject = getSubject(params.subjectId);
  if (!subject) return { ok: false, status: 404, error: "Subject not found" };

  const count = Math.min(Math.max(1, params.count ?? 20), 50);
  const seed = params.seed ?? generateSeed(subject.id);
  const templateBased = hasTemplates(subject.id);

  // Validate topics
  if (params.topics && params.topics.length > 0) {
    const validIds = subject.topics.map((t) => t.id);
    const invalid = params.topics.filter((t) => !validIds.includes(t));
    if (invalid.length > 0) {
      return {
        ok: false, status: 400, error: "Invalid topic(s)",
        meta: { invalid, valid: validIds },
      };
    }
  }

  let questions: QuestionPreview[];
  let questionIds: string[];

  if (templateBased) {
    // Template-based: generate as many as requested, cycle through templates
    const generated = generateQuestionsFromTemplates(
      subject.id, seed, count, params.topics?.length ? params.topics : undefined,
    );

    if (generated.length === 0) {
      return { ok: false, status: 400, error: "No templates found for the given filters" };
    }

    // IDs encode enough info to re-generate the same question later
    questionIds = generated.map((_, i) => `gen:${subject.id}:${seed}:${i}`);
    questions = generated.map(({ answer: _a, explanation: _e, vars: _v, ...q }, i) => ({
      ...q,
      id: questionIds[i],
    }));
  } else {
    const pool = getQuestions(
      subject.id,
      params.topics?.length ? params.topics : undefined,
    );

    if (pool.length === 0) {
      return { ok: false, status: 400, error: "No questions found for the given filters" };
    }
    if (count > pool.length) {
      return {
        ok: false, status: 400,
        error: `Not enough questions, only ${pool.length} available`,
        meta: { available: pool.length },
      };
    }

    const seeded = seedArray(pool, seed).slice(0, count);
    questionIds = seeded.map((q) => q.id);
    questions = seeded.map(({ answer: _a, explanation: _e, ...q }) => q) as QuestionPreview[];
  }

  // Upsert quiz row
  const existing = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, seed))
    .limit(1)
    .then((r) => r[0]);

  if (!existing) {
    await db.insert(quizzesTable).values({
      id: seed,
      subjectId: subject.id,
      topics: params.topics ?? [],
      questionIds,
      count: questions.length,
    });
  }

  return {
    ok: true,
    data: {
      seed,
      subjectId: subject.id,
      subjectName: subject.name,
      topics: params.topics?.length ? params.topics : subject.topics.map((t) => t.id),
      count: questions.length,
      questions,
    },
  };
}

// ── Get existing quiz ──────────────────────────────────────────────────────

export async function getQuiz(seed: string): Promise<ServiceResult<GeneratedQuiz>> {
  const quiz = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, seed))
    .limit(1)
    .then((r) => r[0]);

  if (!quiz) return { ok: false, status: 404, error: "Quiz not found" };

  const subject = getSubject(quiz.subjectId);
  if (!subject) return { ok: false, status: 404, error: "Subject no longer exists" };

  const templateBased = hasTemplates(quiz.subjectId);
  let questions: QuestionPreview[];

  if (templateBased) {
    const generated = generateQuestionsFromTemplates(
      quiz.subjectId, seed, quiz.count,
      quiz.topics.length > 0 ? quiz.topics : undefined,
    );
    questions = generated.map(({ answer: _a, explanation: _e, vars: _v, ...q }, i) => ({
      ...q,
      id: quiz.questionIds[i] ?? `gen:${quiz.subjectId}:${seed}:${i}`,
    }));
  } else {
    const pool = getQuestions(
      quiz.subjectId,
      quiz.topics.length > 0 ? quiz.topics : undefined,
    );
    questions = seedArray(pool, seed)
      .slice(0, quiz.count)
      .map(({ answer: _a, explanation: _e, ...q }) => q) as QuestionPreview[];
  }

  return {
    ok: true,
    data: {
      seed,
      subjectId: subject.id,
      subjectName: subject.name,
      topics: quiz.topics.length > 0 ? quiz.topics : subject.topics.map((t) => t.id),
      count: questions.length,
      questions,
    },
  };
}

// ── Attempt ────────────────────────────────────────────────────────────────

export async function startAttempt(
  userId: string,
  seed: string,
): Promise<ServiceResult<StartedAttempt>> {
  const quiz = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, seed))
    .limit(1)
    .then((r) => r[0]);
  if (!quiz) return { ok: false, status: 404, error: "Quiz not found" };

  const attemptId = randomUUID();
  await db.insert(quizAttemptsTable).values({
    id: attemptId, userId, quizId: seed,
    score: null, completedAt: null,
  });

  return { ok: true, data: { attemptId, quizId: seed, questionCount: quiz.count } };
}

export async function answerQuestion(
  params: AnswerQuestionParams,
): Promise<ServiceResult<AnswerResult>> {
  const attempt = await db
    .select()
    .from(quizAttemptsTable)
    .where(and(
      eq(quizAttemptsTable.id, params.attemptId),
      eq(quizAttemptsTable.userId, params.userId),
    ))
    .limit(1)
    .then((r) => r[0]);

  if (!attempt) return { ok: false, status: 404, error: "Attempt not found" };
  if (attempt.completedAt) return { ok: false, status: 400, error: "Attempt already completed" };

  const alreadyAnswered = await db
    .select()
    .from(quizAnswersTable)
    .where(and(
      eq(quizAnswersTable.attemptId, params.attemptId),
      eq(quizAnswersTable.questionId, params.questionId),
    ))
    .limit(1)
    .then((r) => r[0]);

  if (alreadyAnswered) return { ok: false, status: 400, error: "Question already answered" };

  const quiz = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, attempt.quizId))
    .limit(1)
    .then((r) => r[0]);

  if (!quiz.questionIds.includes(params.questionId)) {
    return { ok: false, status: 400, error: "Question not part of this quiz" };
  }

  let question: Question | GeneratedQuestion | undefined;

  if (isGeneratedId(params.questionId)) {
    const resolved = resolveGeneratedQuestion(params.questionId, quiz.subjectId);
    if (!resolved) return { ok: false, status: 404, error: "Question not found" };
    question = resolved;
  } else {
    const pool = getQuestions(quiz.subjectId);
    question = pool.find((q) => q.id === params.questionId);
    if (!question) return { ok: false, status: 404, error: "Question not found" };
  }

  const result = checkAnswer(question as Question, params.answer);

  await db.insert(quizAnswersTable).values({
    id: randomUUID(),
    attemptId: params.attemptId,
    questionId: params.questionId,
    answer: JSON.stringify(params.answer),
    correct: result.correct,
  });

  return { ok: true, data: result };
}

export async function completeAttempt(
  userId: string,
  attemptId: string,
): Promise<ServiceResult<CompletedAttempt>> {
  const attempt = await db
    .select()
    .from(quizAttemptsTable)
    .where(and(
      eq(quizAttemptsTable.id, attemptId),
      eq(quizAttemptsTable.userId, userId),
    ))
    .limit(1)
    .then((r) => r[0]);

  if (!attempt) return { ok: false, status: 404, error: "Attempt not found" };
  if (attempt.completedAt) return { ok: false, status: 400, error: "Attempt already completed" };

  const quiz = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, attempt.quizId))
    .limit(1)
    .then((r) => r[0]);

  const answers = await db
    .select()
    .from(quizAnswersTable)
    .where(eq(quizAnswersTable.attemptId, attemptId));

  if (answers.length < quiz.count) {
    return {
      ok: false, status: 400, error: "Not all questions answered",
      meta: { answered: answers.length, total: quiz.count },
    };
  }

  const correct = answers.filter((a) => a.correct).length;
  const score = Math.round((correct / quiz.count) * 100);

  await db
    .update(quizAttemptsTable)
    .set({ score, completedAt: new Date() })
    .where(eq(quizAttemptsTable.id, attemptId));

  const streak = await updateStreak(userId);
  const xpEarned = await awardXP(userId, score, quiz.count, streak.current);

  return { ok: true, data: { score, correct, total: quiz.count, xpEarned, streak } };
}

export async function getAttempt(
  userId: string,
  attemptId: string,
): Promise<ServiceResult<AttemptDetails>> {
  const attempt = await db
    .select()
    .from(quizAttemptsTable)
    .where(and(
      eq(quizAttemptsTable.id, attemptId),
      eq(quizAttemptsTable.userId, userId),
    ))
    .limit(1)
    .then((r) => r[0]);

  if (!attempt) return { ok: false, status: 404, error: "Attempt not found" };
  if (!attempt.completedAt || attempt.score === null)
    return { ok: false, status: 400, error: "Attempt not completed yet" };

  const answers = await db
    .select()
    .from(quizAnswersTable)
    .where(eq(quizAnswersTable.attemptId, attemptId));

  const quiz = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, attempt.quizId))
    .limit(1)
    .then((r) => r[0]);

  const subject = quiz ? subjects.find((s) => s.id === quiz.subjectId) : undefined;

  return {
    ok: true,
    data: {
      attemptId: attempt.id,
      seed: attempt.quizId,
      subjectId: quiz?.subjectId || attempt.quizId.split("-")[0],
      subjectName: subject?.name,
      topics: quiz?.topics || [],
      accuracy: attempt.score,
      completedAt: attempt.completedAt,
      duration: (attempt.completedAt.getTime() - attempt.createdAt.getTime()) / 1000,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        answer: JSON.parse(a.answer),
        correct: a.correct,
      })),
    },
  };
}

export async function getUserHistory(
  userId: string,
  subjectId?: string,
): Promise<ServiceResult<AttemptSummary[]>> {
  const attempts = await db
    .select()
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.userId, userId));

  const completed = attempts.filter((a) => a.completedAt !== null && a.score !== null);
  const quizIds = completed.map((a) => a.quizId);

  const quizzes = await db
    .select()
    .from(quizzesTable)
    .where(inArray(quizzesTable.id, quizIds));

  const summaries: AttemptSummary[] = completed
    .filter((a) => {
      if (!subjectId) return true;
      const quiz = quizzes.find((q) => q.id === a.quizId);
      return quiz?.subjectId === subjectId;
    })
    .map((a) => {
      const quiz = quizzes.find((q) => q.id === a.quizId);
      const subject = quiz ? subjects.find((s) => s.id === quiz.subjectId) : undefined;
      return {
        attemptId: a.id,
        seed: a.quizId,
        subjectId: quiz?.subjectId || a.quizId.split("-")[0],
        subjectName: subject?.name || "Unknown",
        topics: quiz?.topics || [],
        questionsAnswered: quiz?.questionIds.length || 0,
        accuracy: a.score!,
        completedAt: a.completedAt!,
        duration: quiz ? (a.completedAt!.getTime() - a.createdAt.getTime()) / 1000 : undefined,
      };
    });

  return { ok: true, data: summaries };
}
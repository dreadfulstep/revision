import db from "@/db";
import { quizAnswersTable, quizAttemptsTable, quizzesTable } from "@/db/schema";
import { AnswerQuestionParams, AnswerResult, AttemptDetails, AttemptSummary, CompletedAttempt, Question, StartedAttempt } from "@/types/quiz";
import { getQuestions, getSubject, subjects } from "@/utils/content";
import { generateSeed, seedArray } from "@/utils/seed";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { checkAnswer } from "@/utils/answer";

type GenerateQuizParams = {
  subjectId: string;
  topics?: string[];
  count?: number;
  seed?: string;
};

type GeneratedQuiz = {
  seed: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  count: number;
  questions: Omit<Question, "answer" | "explanation">[];
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

  if (params.topics && params.topics.length > 0) {
    const validIds = subject.topics.map((t) => t.id);
    const invalid = params.topics.filter((t) => !validIds.includes(t));
    if (invalid.length > 0) {
      return {
        ok: false,
        status: 400,
        error: "Invalid topic(s)",
        meta: { invalid, valid: validIds },
      };
    }
  }

  const seed = params.seed ?? generateSeed(subject.id);

  const pool = getQuestions(
    subject.id,
    params.topics?.length ? params.topics : undefined,
  );

  if (pool.length === 0)
    return {
      ok: false,
      status: 400,
      error: "No questions found for the given filters",
    };
  if (count > pool.length)
    return {
      ok: false,
      status: 400,
      error: `Not enough questions, only ${pool.length} available`,
      meta: { available: pool.length },
    };

  const seeded = seedArray(pool, seed).slice(0, count);
  const questions = seeded.map(
    ({ answer: _a, explanation: _e, ...q }) => q,
  ) as Omit<Question, "answer" | "explanation">[];

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
      questionIds: seeded.map((q) => q.id),
      count: seeded.length,
    });
  }

  return {
    ok: true,
    data: {
      seed,
      subjectId: subject.id,
      subjectName: subject.name,
      topics: params.topics?.length
        ? params.topics
        : subject.topics.map((t) => t.id),
      count: questions.length,
      questions,
    },
  };
}

export async function startAttempt(userId: string, seed: string): Promise<ServiceResult<StartedAttempt>> {
  const quiz = await db.select().from(quizzesTable).where(eq(quizzesTable.id, seed)).limit(1).then((r) => r[0]);
  if (!quiz) return { ok: false, status: 404, error: "Quiz not found" };

  const attemptId = randomUUID();
  await db.insert(quizAttemptsTable).values({
    id: attemptId,
    userId,
    quizId: seed,
    score: null,
    completedAt: null,
  });

  return {
    ok: true,
    data: { attemptId, quizId: seed, questionCount: quiz.count },
  };
}

export async function answerQuestion(params: AnswerQuestionParams): Promise<ServiceResult<AnswerResult>> {
  // verify attempt exists and belongs to user
  const attempt = await db
    .select()
    .from(quizAttemptsTable)
    .where(and(eq(quizAttemptsTable.id, params.attemptId), eq(quizAttemptsTable.userId, params.userId)))
    .limit(1)
    .then((r) => r[0]);

  if (!attempt) return { ok: false, status: 404, error: "Attempt not found" };
  if (attempt.completedAt) return { ok: false, status: 400, error: "Attempt already completed" };

  // check not already answered
  const alreadyAnswered = await db
    .select()
    .from(quizAnswersTable)
    .where(and(eq(quizAnswersTable.attemptId, params.attemptId), eq(quizAnswersTable.questionId, params.questionId)))
    .limit(1)
    .then((r) => r[0]);

  if (alreadyAnswered) return { ok: false, status: 400, error: "Question already answered" };

  // get quiz to verify question belongs to it
  const quiz = await db.select().from(quizzesTable).where(eq(quizzesTable.id, attempt.quizId)).limit(1).then((r) => r[0]);
  if (!quiz.questionIds.includes(params.questionId)) return { ok: false, status: 400, error: "Question not part of this quiz" };

  // get the real question from content
  const pool = getQuestions(quiz.subjectId);
  const question = pool.find((q) => q.id === params.questionId);
  if (!question) return { ok: false, status: 404, error: "Question not found" };

  const result = checkAnswer(question, params.answer);

  await db.insert(quizAnswersTable).values({
    id: randomUUID(),
    attemptId: params.attemptId,
    questionId: params.questionId,
    answer: JSON.stringify(params.answer),
    correct: result.correct,
  });

  return { ok: true, data: result };
}

export async function completeAttempt(userId: string, attemptId: string): Promise<ServiceResult<CompletedAttempt>>

export async function getQuiz(seed: string): Promise<ServiceResult<GeneratedQuiz>>

export async function getAttempt(userId: string, attemptId: string): Promise<ServiceResult<AttemptDetails>>

export async function getUserHistory(userId: string, subjectId?: string): Promise<ServiceResult<AttemptSummary[]>>


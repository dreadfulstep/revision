import db from "@/db";
import { quizzesTable } from "@/db/schema";
import { AnswerQuestionParams, AnswerResult, AttemptDetails, AttemptSummary, CompletedAttempt, Question, StartedAttempt } from "@/types/quiz";
import { getQuestions, getSubject, subjects } from "@/utils/content";
import { generateSeed, seedArray } from "@/utils/seed";
import { eq } from "drizzle-orm";

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

export async function startAttempt(userId: string, seed: string): Promise<ServiceResult<StartedAttempt>>

export async function answerQuestion(params: AnswerQuestionParams): Promise<ServiceResult<AnswerResult>>

export async function completeAttempt(userId: string, attemptId: string): Promise<ServiceResult<CompletedAttempt>>

export async function getQuiz(seed: string): Promise<ServiceResult<GeneratedQuiz>>

export async function getAttempt(userId: string, attemptId: string): Promise<ServiceResult<AttemptDetails>>

export async function getUserHistory(userId: string, subjectId?: string): Promise<ServiceResult<AttemptSummary[]>>


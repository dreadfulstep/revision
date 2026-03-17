import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getQuestions, ResolvedVars, resolveVars } from "@/lib/content";
import { db } from "@/lib/db";
import { quizzes, quizAttempts } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId, topics, count = 10 } = await req.json();

  if (!subjectId) {
    return NextResponse.json({ error: "subjectId required" }, { status: 400 });
  }

  const allQuestions = getQuestions(
    subjectId,
    topics?.length === 1 ? topics[0] : undefined,
  );
  const filtered =
    topics?.length > 1
      ? allQuestions.filter((q) => topics.includes(q.topic))
      : allQuestions;

  if (filtered.length === 0) {
    return NextResponse.json({ error: "No questions found" }, { status: 404 });
  }

  const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, count);

  const resolvedVars: Record<string, ResolvedVars> = {};
  for (const q of shuffled) {
    resolvedVars[q.id] = resolveVars(q);
  }

  const quizId = nanoid();
  const attemptId = nanoid();
  const now = new Date();
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db
    .insert(quizzes)
    .values({
      id: quizId,
      subjectId,
      topics: topics ?? [],
      questionIds: shuffled.map((q) => q.id),
      count: shuffled.length,
    })
    .onConflictDoNothing();

  await db.insert(quizAttempts).values({
    id: attemptId,
    userId: user.id,
    quizId,
    status: "in_progress",
    currentIndex: 0,
    resolvedVars: resolvedVars as Record<string, Record<string, number>>,
    totalQuestions: shuffled.length,
    expiresAt: expires,
    lastActivityAt: now,
  });

  return NextResponse.json({ attemptId });
}

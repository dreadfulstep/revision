import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizAttempts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params;
  const user = await getSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const originalAttempt = await db.query.quizAttempts.findFirst({
    where: eq(quizAttempts.id, attemptId),
  });

  if (!originalAttempt || originalAttempt.userId !== user.id) {
    return NextResponse.json({ error: "Original attempt not found" }, { status: 404 });
  }

  const newAttemptId = nanoid();
  
  const expiresAt = new Date(Date.now() + 30 * 60000);

  await db.insert(quizAttempts).values({
    id: newAttemptId,
    userId: user.id,
    quizId: originalAttempt.quizId,
    totalQuestions: originalAttempt.totalQuestions,
    resolvedVars: originalAttempt.resolvedVars,
    status: "in_progress",
    currentIndex: 0,
    expiresAt: expiresAt,
  });

  return NextResponse.json({ id: newAttemptId });
}
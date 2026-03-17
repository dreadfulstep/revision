import { db } from "@/lib/db";
import { quizAttempts, quizzes, quizAnswers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import {
  getQuestions,
  Question,
  renderers,
  resolveTemplate,
} from "@/lib/content";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import QuizClient, {
  ClientImage,
  ClientQuestion,
  DisplayConfig,
} from "./QuizClient";
import { ImageConfig } from "@/lib/content/types";

export default async function QuizPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const { attemptId } = await params;

  const user = await getSession();
  if (!user) redirect("/login");

  const attempt = await db.query.quizAttempts.findFirst({
    where: eq(quizAttempts.id, attemptId),
  });

  if (!attempt || attempt.userId !== user.id) notFound();
  if (attempt.status === "completed")
    redirect(`/dashboard/quiz/${attemptId}/results`);

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, attempt.quizId),
  });
  if (!quiz) notFound();

  const answered = await db
    .select()
    .from(quizAnswers)
    .where(eq(quizAnswers.attemptId, attempt.id));
  const answeredIds = new Set(answered.map((a) => a.questionId));

  const allQuestions = getQuestions(quiz.subjectId);
  const questions = quiz.questionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const resolvedVars = attempt.resolvedVars as Record<
    string,
    Record<string, number>
  >;

  const clientQuestions: ClientQuestion[] = questions.map((q) => {
    const vars = resolvedVars[q.id] ?? {};
    const cfg = q.answerConfig;

    let displayConfig: DisplayConfig;
    if (cfg.type === "multiple_choice") {
      displayConfig = {
        type: "multiple_choice",
        options: cfg.options.map((o) => resolveTemplate(o, vars)),
      };
    } else if (cfg.type === "multi_select") {
      displayConfig = {
        type: "multi_select",
        options: cfg.options.map((o) => resolveTemplate(o, vars)),
      };
    } else if (cfg.type === "true_false") {
      displayConfig = { type: "true_false" };
    } else if (cfg.type === "matching") {
      displayConfig = { type: "matching", pairs: cfg.pairs };
    } else if (cfg.type === "ordering") {
      displayConfig = { type: "ordering", items: cfg.items };
    } else if (cfg.type === "fill_blank") {
      displayConfig = { type: "fill_blank" };
    } else if (cfg.type === "multi_part") {
      displayConfig = {
        type: "multi_part",
        parts: cfg.parts.map((p) => ({ label: p.label, unit: p.unit })),
      };
    } else if (cfg.type === "long_form") {
      displayConfig = {
        type: "long_form",
        marks: cfg.marks,
        minWords: cfg.minWords,
      };
    } else {
      displayConfig = {
        type: cfg.type,
        ...("unit" in cfg && cfg.unit ? { unit: cfg.unit } : {}),
      };
    }

    let clientImage: ClientImage | null = null;
    if (q.image) {
      const img = q.image as ImageConfig;
      if (img.type === "rendered" || img.type === "generated") {
        const renderer = renderers[img.renderer];
        if (renderer) {
          try {
            clientImage = { type: "svg", content: renderer(vars) };
          } catch {
            clientImage = null;
          }
        }
      } else if (img.type === "svg") {
        clientImage = { type: "svg", content: img.content };
      } else if (img.type === "url") {
        clientImage = {
          type: "url",
          src: img.src,
          alt: img.alt,
          attribution: img.attribution,
        };
      }
    }

    return {
      id: q.id,
      template: resolveTemplate(q.template, vars),
      answerConfig: displayConfig,
      image: clientImage,
      resolvedVars: vars,
      answered: answeredIds.has(q.id),
    };
  });

  return (
    <QuizClient
      attemptId={attempt.id}
      questions={clientQuestions}
      startIndex={attempt.currentIndex}
      total={attempt.totalQuestions}
    />
  );
}

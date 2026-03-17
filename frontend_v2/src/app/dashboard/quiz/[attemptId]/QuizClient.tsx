"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, CheckCircle2, XCircle, Sparkles } from "lucide-react";

import TrueFalse from "@/components/quiz/answers/TrueFalse";
import MultipleChoice from "@/components/quiz/answers/MultipleChoice";
import TextNumber from "@/components/quiz/answers/TextNumber";
import MultiSelect from "@/components/quiz/answers/MultiSelect";
import Matching from "@/components/quiz/answers/Matching";
import Ordering from "@/components/quiz/answers/Ordering";
import MultiPart from "@/components/quiz/answers/MultiPart";
import QuestionImage from "@/components/quiz/QuizImage";

export type DisplayConfig =
  | { type: "number"; unit?: string }
  | { type: "text" }
  | { type: "fill_blank" }
  | { type: "true_false" }
  | { type: "multiple_choice"; options: string[] }
  | { type: "multi_select"; options: string[] }
  | { type: "matching"; pairs: { left: string; right: string }[] }
  | { type: "ordering"; items: string[] }
  | { type: "multi_part"; parts: { label: string; unit?: string }[] }
  | { type: "long_form"; marks: number; minWords?: number };

export type ClientImage =
  | { type: "svg"; content: string }
  | { type: "url"; src: string; alt: string; attribution?: string };

export type ClientQuestion = {
  id: string;
  template: string;
  answerConfig: DisplayConfig;
  image: ClientImage | null;
  resolvedVars: Record<string, string | number>;
  answered: boolean;
};

type FeedbackState = {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  xpGained: number;
  isLast: boolean;
  matchingResults: Record<string, boolean> | null;
  leveledUp: boolean;
  newLevel: number;
  rankedUp: boolean;
  newRank: { title: string; colour: string } | null;
};

export default function QuizClient({
  attemptId,
  questions,
  startIndex,
  total,
}: {
  attemptId: string;
  questions: ClientQuestion[];
  startIndex: number;
  total: number;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(startIndex);
  const [answer, setAnswer] = useState("");
  const [multiAnswer, setMultiAnswer] = useState<string[]>([]);
  const [multiPartAnswer, setMultiPartAnswer] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const question = questions[index];
  if (!question) return null;
  const cfg = question.answerConfig;

  async function submit(overrideAnswer?: string) {
    if (loading || feedback) return;

    const submitAnswer =
      overrideAnswer ??
      (cfg.type === "multi_select"
        ? JSON.stringify([...multiAnswer].sort())
        : cfg.type === "multi_part"
          ? JSON.stringify(
              cfg.parts.map((p) => ({
                label: p.label,
                answer: multiPartAnswer[p.label] ?? "",
              })),
            )
          : answer);

    if (!submitAnswer) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, answer: submitAnswer }),
      });
      const data = await res.json();
      setFeedback(data);
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (feedback?.isLast) {
      router.push(`/dashboard/quiz/${attemptId}/results`);
      return;
    }
    setFeedback(null);
    setAnswer("");
    setMultiAnswer([]);
    setMultiPartAnswer({});
    setIndex((i) => i + 1);
  }

  const canSubmit =
    cfg.type === "multi_part"
      ? cfg.parts.every((p) => (multiPartAnswer[p.label] ?? "").trim() !== "")
      : cfg.type === "multi_select"
        ? multiAnswer.length > 0
        : answer !== "";

  const progress = (index / total) * 100;

  return (
    <div className="bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4 px-4 py-4 max-w-lg mx-auto w-full">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </Link>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums text-muted-foreground">
            {index + 1} of {total}
          </span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-40">
        <div className="max-w-lg mx-auto space-y-6">
          {question.image && <QuestionImage image={question.image} />}

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">
              Question {index + 1}
            </p>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">
              {question.template}
            </h1>
          </div>

          <div
            className={`transition-all duration-300 ${feedback ? "opacity-50 pointer-events-none scale-[0.98]" : "opacity-100"}`}
          >
            {cfg.type === "true_false" && (
              <TrueFalse
                value={answer}
                onChange={(v) => {
                  setAnswer(v);
                  submit(v);
                }}
                disabled={loading}
              />
            )}
            {cfg.type === "multiple_choice" && (
              <MultipleChoice
                options={cfg.options}
                value={answer}
                onChange={(v) => {
                  setAnswer(v);
                  submit(v);
                }}
                disabled={loading}
              />
            )}
            {(cfg.type === "number" ||
              cfg.type === "text" ||
              cfg.type === "fill_blank") && (
              <TextNumber
                value={answer}
                onChange={setAnswer}
                onSubmit={submit}
                unit={"unit" in cfg ? cfg.unit : undefined}
                type={cfg.type}
                disabled={loading}
              />
            )}
            {cfg.type === "multi_select" && (
              <MultiSelect
                options={cfg.options}
                value={multiAnswer}
                onChange={setMultiAnswer}
                disabled={loading}
              />
            )}
            {cfg.type === "matching" && (
              <Matching
                pairs={cfg.pairs}
                key={question.id}
                onChange={setAnswer}
                disabled={loading}
              />
            )}
            {cfg.type === "ordering" && (
              <Ordering
                items={cfg.items}
                key={question.id}
                onChange={setAnswer}
                disabled={loading}
              />
            )}
            {cfg.type === "multi_part" && (
              <MultiPart
                parts={cfg.parts}
                value={multiPartAnswer}
                onChange={setMultiPartAnswer}
                disabled={loading}
              />
            )}
          </div>

          {feedback && (
            <div
              className={`p-6 animate-in slide-in-from-bottom-4 duration-300 border-2 bg-card`}
            >
              <div className="flex items-center gap-3 mb-3">
                {feedback.correct ? (
                  <CheckCircle2 className="text-green-500" size={24} />
                ) : (
                  <XCircle className="text-red-500" size={24} />
                )}
                <span
                  className={`font-bold text-lg ${feedback.correct ? "text-green-600" : "text-red-600"}`}
                >
                  {feedback.correct ? "Spot on!" : "Not quite"}
                </span>
                {feedback.correct && (
                  <div className="ml-auto flex items-center gap-1 border-2 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <Sparkles size={12} /> +{feedback.xpGained} XP
                  </div>
                )}
              </div>

              {!feedback.correct && (
                <div className="mb-4">
                  <p className="text-xs uppercase font-bold opacity-60 mb-1">
                    Correct Answer
                  </p>
                  <p className="text-sm font-semibold">
                    {feedback.correctAnswer}
                  </p>
                </div>
              )}

              {feedback.explanation && (
                <div>
                  <p className="text-xs uppercase font-bold opacity-60 mb-1">
                    Explanation
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feedback.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-25 left-0 right-0 p-4 bg-background border-t backdrop-blur-lg">
        <div className="max-w-lg mx-auto">
          {!feedback ? (
            !["true_false", "multiple_choice"].includes(cfg.type) && (
              <Button
                onClick={() => submit()}
                disabled={loading || !canSubmit}
                className="w-full h-14 text-base font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
              >
                {loading ? "Checking..." : "Check Answer"}
              </Button>
            )
          ) : (
            <Button
              onClick={next}
              className={`w-full h-14 text-base font-bold rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300 ${
                feedback.correct
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary"
              }`}
            >
              {feedback.isLast ? "View Results" : "Next Question"}
              <ArrowRight className="ml-2" size={18} />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

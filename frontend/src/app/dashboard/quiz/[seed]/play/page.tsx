/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Check, X, Lightbulb, Share2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type Question = {
  id: string;
  type: "multi-choice" | "true-false" | "text" | "number";
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  options?: string[];
  image?:
    | { type: "svg"; data: string }
    | { type: "static"; src: string }
    | null;
};

type Quiz = {
  seed: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  count: number;
  questions: Question[];
};

type AnswerResult = {
  correct: boolean;
  exact?: boolean;
  correctAnswer: number | string | boolean;
  explanation?: string;
};

type CompletedResult = {
  score: number;
  correct: number;
  total: number;
  xpEarned: number;
  streak: { current: number; longest: number };
};

export default function QuizPlay() {
  const router = useRouter();
  const { seed } = useParams<{ seed: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    number | string | boolean | null
  >(null);
  const [textInput, setTextInput] = useState("");
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<CompletedResult | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    {
      question: Question;
      result: AnswerResult;
      given: number | string | boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const quizData: any = await api.quiz.getBySeed(seed);
        setQuiz(quizData);

        const storedAttemptId = sessionStorage.getItem(`attempt:${seed}`);

        if (storedAttemptId) {
          setAttemptId(storedAttemptId);
        } else {
          const attempt: any = await api.quiz.startAttempt(seed);
          sessionStorage.setItem(`attempt:${seed}`, attempt.attemptId);
          setAttemptId(attempt.attemptId);
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, seed]);

  const currentQuestion = quiz?.questions[currentIndex];
  const isLastQuestion = quiz ? currentIndex === quiz.count - 1 : false;
  const progress = quiz ? (currentIndex / quiz.count) * 100 : 0;

  async function submitAnswer(answer: number | string | boolean) {
    if (!quiz || !attemptId || submitting || feedback) return;
    setSubmitting(true);
    try {
      const result: any = await api.quiz.answer(seed, attemptId, {
        questionId: currentQuestion!.id,
        answer,
      });
      setFeedback(result);
      setSelectedAnswer(answer);
      setAnsweredQuestions((prev) => [
        ...prev,
        { question: currentQuestion!, result, given: answer },
      ]);
    } catch (e: any) {
      if (e?.status === 400) {
        sessionStorage.removeItem(`attempt:${seed}`);
        router.push("/dashboard");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (!quiz || !attemptId) return;
    if (isLastQuestion) {
      try {
        const result: any = await api.quiz.complete(seed, attemptId);
        sessionStorage.removeItem(`attempt:${seed}`);
        setCompleted(result);
      } catch (e) {
        console.error(e);
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setFeedback(null);
      setSelectedAnswer(null);
      setTextInput("");
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/quiz/${seed}/play`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading || !quiz) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (completed) {
    const scoreLabel =
      completed.score >= 80
        ? "Excellent!"
        : completed.score >= 60
          ? "Good effort!"
          : "Keep practising!";

    return (
      <div className="px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Score circle */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary">
              {completed.score}%
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{scoreLabel}</h1>
          <p className="text-sm text-muted-foreground">
            {completed.correct} / {completed.total} correct
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border bg-card p-4 text-center">
            <p className="text-xl font-bold text-primary">
              +{completed.xpEarned}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">XP earned</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 text-center">
            <p className="text-xl font-bold text-orange-500">
              {completed.streak.current}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">day streak</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 text-center">
            <p className="text-xl font-bold">{completed.total}</p>
            <p className="text-xs text-muted-foreground mt-0.5">questions</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <Button className="flex-1 rounded-xl gap-1.5" asChild>
            <Link href={`/dashboard/subjects/${quiz.subjectId}`}>
              New quiz <ArrowRight size={13} />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl gap-1.5"
            onClick={handleShare}
          >
            <Share2 size={13} />
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>

        <p className="text-sm font-semibold mb-24">Question breakdown</p>
        <div className="space-y-2">
          {answeredQuestions.map(({ question, result, given }) => (
            <div
              key={question.id}
              className={`rounded-2xl border p-4 ${
                result.correct
                  ? "border-primary/20 bg-primary/5"
                  : "border-destructive/20 bg-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    result.correct ? "bg-primary/15" : "bg-destructive/15"
                  }`}
                >
                  {result.correct ? (
                    <Check size={11} className="text-primary" />
                  ) : (
                    <X size={11} className="text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-2">{question.question}</p>
                  {!result.correct && (
                    <div className="space-y-0.5 mb-2">
                      <p className="text-xs text-destructive">
                        Your answer:{" "}
                        {question.options
                          ? question.options[given as number]
                          : String(given)}
                      </p>
                      <p className="text-xs text-primary">
                        Correct:{" "}
                        {question.options
                          ? question.options[result.correctAnswer as number]
                          : String(result.correctAnswer)}
                      </p>
                    </div>
                  )}
                  {result.explanation && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <Lightbulb
                        size={11}
                        className="text-yellow-500 shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-muted-foreground">
                        {result.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto w-full">
        <span className="text-xs text-muted-foreground">
          {quiz.subjectName}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {currentIndex + 1} / {quiz.count}
        </span>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-8">
        {currentQuestion && (
          <>
            <span className="text-xs text-muted-foreground capitalize">
              {currentQuestion.topic}
            </span>

            <h2 className="text-lg font-semibold leading-relaxed mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.image && (
              <div className="rounded-2xl border bg-card p-4 mb-6 flex items-center justify-center">
                {currentQuestion.image.type === "svg" ? (
                  <div
                    className="max-w-full"
                    dangerouslySetInnerHTML={{
                      __html: currentQuestion.image.data,
                    }}
                  />
                ) : (
                  <Image
                    src={currentQuestion.image.src}
                    alt="Question diagram"
                    className="max-w-full"
                  />
                )}
              </div>
            )}

            {currentQuestion.type === "multi-choice" &&
              currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = feedback?.correctAnswer === i;
                    const isWrong = isSelected && !feedback?.correct;

                    let cls =
                      "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground";
                    if (feedback) {
                      if (isCorrect)
                        cls = "border-primary/40 bg-primary/5 text-foreground";
                      else if (isWrong)
                        cls =
                          "border-destructive/40 bg-destructive/5 text-foreground";
                      else
                        cls = "border-border bg-card text-muted-foreground/50";
                    } else if (isSelected) {
                      cls = "border-primary/40 bg-primary/5 text-foreground";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => !feedback && submitAnswer(i)}
                        disabled={!!feedback || submitting}
                        className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all disabled:cursor-default ${cls}`}
                      >
                        <span className="w-6 h-6 rounded-lg border border-current/20 flex items-center justify-center text-xs font-medium shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {feedback && isCorrect && (
                          <Check size={13} className="text-primary shrink-0" />
                        )}
                        {feedback && isWrong && (
                          <X size={13} className="text-destructive shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

            {currentQuestion.type === "true-false" && (
              <div className="grid grid-cols-2 gap-3">
                {([true, false] as const).map((val) => {
                  const isSelected = selectedAnswer === val;
                  const isCorrect = feedback?.correctAnswer === val;
                  const isWrong = isSelected && !feedback?.correct;

                  let cls =
                    "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground";
                  if (feedback) {
                    if (isCorrect)
                      cls = "border-primary/40 bg-primary/5 text-foreground";
                    else if (isWrong)
                      cls =
                        "border-destructive/40 bg-destructive/5 text-foreground";
                    else cls = "border-border bg-card text-muted-foreground/50";
                  } else if (isSelected) {
                    cls = "border-primary/40 bg-primary/5 text-foreground";
                  }

                  return (
                    <button
                      key={String(val)}
                      onClick={() => !feedback && submitAnswer(val)}
                      disabled={!!feedback || submitting}
                      className={`rounded-xl border px-4 py-5 text-sm font-medium transition-all disabled:cursor-default ${cls}`}
                    >
                      {val ? "True" : "False"}
                    </button>
                  );
                })}
              </div>
            )}

            {(currentQuestion.type === "text" ||
              currentQuestion.type === "number") && (
              <div className="space-y-2">
                <input
                  type={currentQuestion.type === "number" ? "number" : "text"}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && textInput.trim() && !feedback) {
                      submitAnswer(
                        currentQuestion.type === "number"
                          ? Number(textInput)
                          : textInput,
                      );
                    }
                  }}
                  disabled={!!feedback}
                  placeholder="Type your answer..."
                  className="w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40 disabled:opacity-60 transition-colors placeholder:text-muted-foreground/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {!feedback && (
                  <Button
                    onClick={() =>
                      textInput.trim() &&
                      submitAnswer(
                        currentQuestion.type === "number"
                          ? Number(textInput)
                          : textInput,
                      )
                    }
                    disabled={!textInput.trim() || submitting}
                    className="w-full rounded-xl"
                  >
                    Submit
                  </Button>
                )}
              </div>
            )}

            {feedback && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  feedback.correct
                    ? "border-primary/20 bg-primary/5"
                    : "border-destructive/20 bg-destructive/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {feedback.correct ? (
                    <>
                      <Check size={14} className="text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Correct
                        {feedback.exact === false ? " (close match)" : ""}!
                      </span>
                    </>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 justify-center">
                        <X size={14} className="text-destructive" />
                        <span className="text-sm font-medium text-destructive">
                          Incorrect
                        </span>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        Answer:{" "}
                        {currentQuestion.options
                          ? currentQuestion.options[
                              feedback.correctAnswer as number
                            ]
                          : String(feedback.correctAnswer)}
                      </span>
                    </div>
                  )}
                </div>
                {feedback.explanation && (
                  <div className="flex items-start gap-1.5">
                    <Lightbulb
                      size={11}
                      className="text-yellow-500 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-muted-foreground">
                      {feedback.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {feedback && (
              <Button
                onClick={handleNext}
                size={"lg"}
                className="mt-3 w-full rounded-xl gap-2"
              >
                {isLastQuestion ? "See results" : "Next question"}
                <ArrowRight size={13} />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

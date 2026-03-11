/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Check, X, Lightbulb, Share2 } from "lucide-react";
import { api } from "@/lib/api";

type Question = {
  id: string;
  type: "multi-choice" | "true-false" | "text" | "number";
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  options?: string[];
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | boolean | null>(null);
  const [textInput, setTextInput] = useState("");
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<CompletedResult | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ question: Question; result: AnswerResult; given: number | string | boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [q, a]: any = await Promise.all([
          api.quiz.getBySeed(seed),
          api.quiz.startAttempt(seed),
        ]);
        setQuiz(q);
        setAttemptId(a.attemptId);
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
  const progress = quiz ? ((currentIndex) / quiz.count) * 100 : 0;

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
      setAnsweredQuestions((prev) => [...prev, { question: currentQuestion!, result, given: answer }]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (!quiz || !attemptId) return;
    if (isLastQuestion) {
      // complete
      try {
        const result: any = await api.quiz.complete(seed, attemptId);
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
    navigator.clipboard.writeText(`${window.location.origin}/quiz/${seed}/play`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading || !quiz) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Results screen
  if (completed) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div
          className="fixed inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
          {/* Score */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-indigo-500/30 bg-indigo-500/5 mb-4">
              <span className="text-3xl font-bold text-indigo-400">{completed.score}%</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">
              {completed.score >= 80 ? "Excellent!" : completed.score >= 60 ? "Good effort!" : "Keep practising!"}
            </h1>
            <p className="text-zinc-500 text-sm">
              {completed.correct} / {completed.total} correct
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="text-xl font-bold text-indigo-400">+{completed.xpEarned}</p>
              <p className="text-xs text-zinc-500 mt-0.5">XP earned</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="text-xl font-bold text-orange-400">{completed.streak.current}</p>
              <p className="text-xs text-zinc-500 mt-0.5">day streak</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <p className="text-xl font-bold">{completed.total}</p>
              <p className="text-xs text-zinc-500 mt-0.5">questions</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-10">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <Share2 size={14} />
              {copied ? "Copied!" : "Share quiz"}
            </button>
            <button
              onClick={() => router.push(`/quiz/${quiz.subjectId}`)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-3 text-sm font-semibold transition-all"
            >
              New quiz
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              Dashboard
            </button>
          </div>

          {/* Per-question breakdown */}
          <h2 className="text-sm font-medium text-zinc-300 mb-3">Question breakdown</h2>
          <div className="space-y-3">
            {answeredQuestions.map(({ question, result, given }) => (
              <div
                key={question.id}
                className={`rounded-xl border p-4 ${
                  result.correct
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    result.correct ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    {result.correct
                      ? <Check size={11} className="text-emerald-400" />
                      : <X size={11} className="text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white mb-2">{question.question}</p>
                    {!result.correct && (
                      <div className="space-y-1 mb-2">
                        <p className="text-xs text-red-400">
                          Your answer: {question.options
                            ? question.options[given as number]
                            : String(given)}
                        </p>
                        <p className="text-xs text-emerald-400">
                          Correct: {question.options
                            ? question.options[result.correctAnswer as number]
                            : String(result.correctAnswer)}
                        </p>
                      </div>
                    )}
                    {result.explanation && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <Lightbulb size={11} className="text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-400">{result.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <div
        className="fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Progress bar */}
      <div className="relative z-10 w-full h-1 bg-zinc-900">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
        <span className="text-xs text-zinc-500">{quiz.subjectName}</span>
        <span className="text-xs text-zinc-500">{currentIndex + 1} / {quiz.count}</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 pb-10">
        {currentQuestion && (
          <>
            {/* Difficulty pips */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < currentQuestion.difficulty ? "bg-indigo-400" : "bg-zinc-800"
                  }`}
                />
              ))}
              <span className="text-xs text-zinc-600 ml-2">{currentQuestion.topic}</span>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold leading-relaxed mb-8">
              {currentQuestion.question}
            </h2>

            {/* Answers */}
            {currentQuestion.type === "multi-choice" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = feedback?.correctAnswer === i;
                  const isWrong = isSelected && !feedback?.correct;

                  let style = "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700 hover:text-white";
                  if (feedback) {
                    if (isCorrect) style = "border-emerald-500/50 bg-emerald-500/10 text-white";
                    else if (isWrong) style = "border-red-500/50 bg-red-500/10 text-white";
                    else style = "border-zinc-800 bg-zinc-900/20 text-zinc-600";
                  } else if (isSelected) {
                    style = "border-indigo-500/50 bg-indigo-500/10 text-white";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => !feedback && submitAnswer(i)}
                      disabled={!!feedback || submitting}
                      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all disabled:cursor-default ${style}`}
                    >
                      <span className="w-6 h-6 rounded-lg border border-current/20 flex items-center justify-center text-xs font-medium shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                      {feedback && isCorrect && <Check size={14} className="text-emerald-400 ml-auto shrink-0" />}
                      {feedback && isWrong && <X size={14} className="text-red-400 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "true-false" && (
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((val) => {
                  const isSelected = selectedAnswer === val;
                  const isCorrect = feedback?.correctAnswer === val;
                  const isWrong = isSelected && !feedback?.correct;

                  let style = "border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700";
                  if (feedback) {
                    if (isCorrect) style = "border-emerald-500/50 bg-emerald-500/10 text-white";
                    else if (isWrong) style = "border-red-500/50 bg-red-500/10 text-white";
                    else style = "border-zinc-800 bg-zinc-900/20 text-zinc-600";
                  } else if (isSelected) {
                    style = "border-indigo-500/50 bg-indigo-500/10 text-white";
                  }

                  return (
                    <button
                      key={String(val)}
                      onClick={() => !feedback && submitAnswer(val)}
                      disabled={!!feedback || submitting}
                      className={`rounded-xl border px-4 py-5 text-sm font-medium transition-all disabled:cursor-default ${style}`}
                    >
                      {val ? "True" : "False"}
                    </button>
                  );
                })}
              </div>
            )}

            {(currentQuestion.type === "text" || currentQuestion.type === "number") && (
              <div className="space-y-3">
                <input
                  type={currentQuestion.type === "number" ? "number" : "text"}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && textInput.trim() && !feedback) {
                      submitAnswer(currentQuestion.type === "number" ? Number(textInput) : textInput);
                    }
                  }}
                  disabled={!!feedback}
                  placeholder="Type your answer..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500/50 focus:outline-none disabled:opacity-60 transition-colors"
                />
                {!feedback && (
                  <button
                    onClick={() => textInput.trim() && submitAnswer(currentQuestion.type === "number" ? Number(textInput) : textInput)}
                    disabled={!textInput.trim() || submitting}
                    className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 px-4 py-3 text-sm font-semibold transition-all"
                  >
                    Submit
                  </button>
                )}
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`mt-6 rounded-xl border p-4 ${
                feedback.correct
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {feedback.correct ? (
                    <>
                      <Check size={15} className="text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">
                        Correct{feedback.exact === false ? " (close match)" : ""}!
                      </span>
                    </>
                  ) : (
                    <>
                      <X size={15} className="text-red-400" />
                      <span className="text-sm font-medium text-red-400">Incorrect</span>
                      <span className="text-sm text-zinc-400 ml-1">
                        — correct answer:{" "}
                        {currentQuestion.options
                          ? currentQuestion.options[feedback.correctAnswer as number]
                          : String(feedback.correctAnswer)}
                      </span>
                    </>
                  )}
                </div>
                {feedback.explanation && (
                  <div className="flex items-start gap-1.5">
                    <Lightbulb size={12} className="text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400">{feedback.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Next button */}
            {feedback && (
              <button
                onClick={handleNext}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-3.5 text-sm font-semibold transition-all"
              >
                {isLastQuestion ? "See results" : "Next question"}
                <ArrowRight size={14} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
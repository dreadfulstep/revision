"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Square,
  Minus,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";

type Subject = {
  id: string;
  name: string;
  colour: string;
  examBoard: string;
  questionCount: number;
  topics: { id: string; name: string; questionCount: number }[];
};

export default function QuizBuilder() {
  const router = useRouter();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(20);

  useEffect(() => {
    api.subjects
      .getOne(subjectId)
      .then((s: any) => {
        setSubject(s);
        setSelectedTopics(s.topics.map((t: any) => t.id)); // all selected by default
      })
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [subjectId]);

  function toggleTopic(id: string) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    if (!subject) return;
    const allIds = subject.topics.map((t) => t.id);
    setSelectedTopics(selectedTopics.length === allIds.length ? [] : allIds);
  }

  const availableQuestions = subject
    ? selectedTopics.length === 0
      ? subject.questionCount
      : subject.topics
          .filter((t) => selectedTopics.includes(t.id))
          .reduce((sum, t) => sum + t.questionCount, 0)
    : 0;

  const clampedCount = Math.min(count, availableQuestions);

  async function handleGenerate() {
    if (!subject || selectedTopics.length === 0) return;
    setGenerating(true);
    try {
      const quiz: any = await api.quiz.generate({
        subjectId: subject.id,
        topics:
          selectedTopics.length === subject.topics.length ? [] : selectedTopics,
        count: clampedCount,
      });
      router.push(`/quiz/${quiz.seed}/play`);
    } catch (e) {
      setGenerating(false);
    }
  }

  if (loading || !subject) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        className="fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: subject.colour }}
          />
          <div>
            <h1 className="text-xl font-semibold">{subject.name}</h1>
            <p className="text-xs text-zinc-500">
              {subject.examBoard} · {subject.questionCount} questions
            </p>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-300">Topics</h2>
            <button
              onClick={toggleAll}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {selectedTopics.length === subject.topics.length
                ? "Deselect all"
                : "Select all"}
            </button>
          </div>
          <div className="space-y-2">
            {subject.topics.map((topic) => {
              const selected = selectedTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    selected
                      ? "border-indigo-500/50 bg-indigo-500/5 text-white"
                      : "border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selected ? (
                      <CheckSquare
                        size={15}
                        className="text-indigo-400 shrink-0"
                      />
                    ) : (
                      <Square size={15} className="shrink-0" />
                    )}
                    <span className="text-sm">{topic.name}</span>
                  </div>
                  <span className="text-xs text-zinc-600">
                    {topic.questionCount}q
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question count */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-300">Questions</h2>
            <span className="text-xs text-zinc-500">
              {availableQuestions} available
            </span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCount((c) => Math.max(5, c - 5))}
                className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min={5}
                  max={Math.min(50, availableQuestions)}
                  step={5}
                  value={clampedCount}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <button
                onClick={() =>
                  setCount((c) =>
                    Math.min(50, Math.min(availableQuestions, c + 5)),
                  )
                }
                className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
              >
                <Plus size={14} />
              </button>
              <span className="text-2xl font-bold w-10 text-right">
                {clampedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={
            generating ||
            selectedTopics.length === 0 ||
            availableQuestions === 0
          }
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          {generating ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              Start quiz
              <ArrowRight size={15} />
            </>
          )}
        </button>

        {selectedTopics.length === 0 && (
          <p className="text-center text-xs text-zinc-600 mt-3">
            Select at least one topic
          </p>
        )}
      </div>
    </div>
  );
}

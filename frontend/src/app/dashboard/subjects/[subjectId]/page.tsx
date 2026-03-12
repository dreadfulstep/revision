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
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Topic = {
  id: string;
  name: string;
  questionCount: number | null;
  templateBased: boolean;
};

type Subject = {
  id: string;
  name: string;
  colour: string;
  examBoard: string;
  questionCount: number | null;
  templateBased: boolean;
  topics: Topic[];
};

type GenerateQuizResponse = {
  seed: string;
  subjectId: string;
  subjectName: string;
  topics: string[];
  count: number;
};

const MIN_COUNT = 5;
const MAX_COUNT = 50;
const STEP = 5;

export default function QuizBuilder() {
  const router = useRouter();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(20);
  const [countInput, setCountInput] = useState("20");
  const [editingCount, setEditingCount] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.subjects
      .getOne(subjectId)
      .then((s) => {
        const subject = s as Subject;
        setSubject(subject);
        setSelectedTopics(subject.topics.map((t) => t.id));
      })
      .catch((e) => {
        const msg = e?.message ?? JSON.stringify(e) ?? "Unknown error";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [subjectId, router]);

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

  function applyCount(val: number) {
    const clamped = Math.max(MIN_COUNT, Math.min(maxCount, val));
    setCount(clamped);
    setCountInput(String(clamped));
  }

  function handleCountInputBlur() {
    const parsed = parseInt(countInput, 10);
    applyCount(isNaN(parsed) ? count : parsed);
    setEditingCount(false);
  }

  const isTemplateBased = subject?.templateBased ?? false;

  const availableCount: number | null = isTemplateBased
    ? null
    : subject
      ? selectedTopics.length === 0
        ? (subject.questionCount ?? 0)
        : subject.topics
            .filter((t) => selectedTopics.includes(t.id))
            .reduce((sum, t) => sum + (t.questionCount ?? 0), 0)
      : 0;

  const maxCount = isTemplateBased
    ? MAX_COUNT
    : Math.min(MAX_COUNT, availableCount ?? 0);
  const clampedCount = Math.min(count, maxCount);

  const filteredTopics =
    subject?.topics.filter((t) =>
      t.name.toLowerCase().includes(topicSearch.toLowerCase()),
    ) ?? [];

  async function handleGenerate() {
    if (!subject || selectedTopics.length === 0) return;
    setGenerating(true);
    try {
      const quiz = (await api.quiz.generate({
        subjectId: subject.id,
        topics:
          selectedTopics.length === subject.topics.length ? [] : selectedTopics,
        count: clampedCount,
      })) as GenerateQuizResponse;
      router.push(`/dashboard/quiz/${quiz.seed}/play`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      setError(msg);
      setGenerating(false);
    }
  }

    if (error) {
  return (
    <div className="px-4 py-10 max-w-md mx-auto text-center space-y-3">
      <p className="text-sm font-semibold text-destructive">Something went wrong</p>
      <p className="text-xs text-muted-foreground font-mono break-all">{error}</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}>Go back</Button>
    </div>
  );
}

  if (loading || !subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const allSelected = selectedTopics.length === subject.topics.length;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w- px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full gap-1.5 -ml-2 mb-6 text-muted-foreground"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft size={14} />
            Dashboard
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{subject.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subject.examBoard}
            {!isTemplateBased && subject.questionCount !== null && (
              <> · {subject.questionCount} questions</>
            )}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">
              Topics
              {selectedTopics.length > 0 &&
                selectedTopics.length < subject.topics.length && (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    {selectedTopics.length}/{subject.topics.length} selected
                  </span>
                )}
            </p>
            <button
              onClick={toggleAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          {subject.topics.length > 6 && (
            <div className="relative mb-2">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search topics..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full rounded-xl border bg-card pl-8 pr-3 py-2 text-sm outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>
          )}

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
            {filteredTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No topics match &quot;{topicSearch}&quot;
              </p>
            ) : (
              filteredTopics.map((topic) => {
                const selected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${
                      selected
                        ? "border-primary/40 bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {selected ? (
                        <CheckSquare
                          size={14}
                          className="text-primary shrink-0"
                        />
                      ) : (
                        <Square size={14} className="shrink-0" />
                      )}
                      <span className="text-sm">{topic.name}</span>
                    </div>
                    {topic.questionCount !== null && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {topic.questionCount}q
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Questions</p>
            {!isTemplateBased && (
              <span className="text-xs text-muted-foreground">
                {availableCount} available
              </span>
            )}
          </div>
          <div className="rounded-2xl border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => applyCount(clampedCount - STEP)}
                className="w-8 h-8 rounded-xl border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shrink-0"
              >
                <Minus size={13} />
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min={MIN_COUNT}
                  max={maxCount}
                  step={STEP}
                  value={clampedCount}
                  onChange={(e) => applyCount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <button
                onClick={() => applyCount(clampedCount + STEP)}
                className="w-8 h-8 rounded-xl border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shrink-0"
              >
                <Plus size={13} />
              </button>

              {editingCount ? (
                <input
                  type="number"
                  min={MIN_COUNT}
                  max={maxCount}
                  value={countInput}
                  onChange={(e) => setCountInput(e.target.value)}
                  onBlur={handleCountInputBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleCountInputBlur()}
                  autoFocus
                  className="w-12 text-xl font-bold text-right bg-transparent border-b border-primary outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingCount(true);
                    setCountInput(String(clampedCount));
                  }}
                  className="w-12 text-xl font-bold text-right tabular-nums hover:text-primary transition-colors"
                  title="Click to type a specific number"
                >
                  {clampedCount}
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Tap the number to enter a specific amount
            </p>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generating || selectedTopics.length === 0 || maxCount === 0}
          className="w-full rounded-xl gap-2 h-12 text-sm font-semibold shadow-lg shadow-primary/15"
        >
          {generating ? (
            <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
          ) : (
            <>
              Start quiz
              <ArrowRight size={15} />
            </>
          )}
        </Button>

        {selectedTopics.length === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            Select at least one topic to continue
          </p>
        )}
      </div>
    </div>
  );
}

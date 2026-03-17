"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronDown,
  Check,
  ArrowLeft,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Topic = { id: string; name: string; count?: number };
type Subject = {
  id: string;
  name: string;
  colour: string;
  exam_board: string;
  topics: Topic[];
};

export default function CreateQuizClient({
  subjects,
}: {
  subjects: Subject[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<"subject" | "configure">("subject");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");

  const filteredSubjects = useMemo(
    () =>
      subjects.filter(
        (s) =>
          s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
          s.exam_board.toLowerCase().includes(subjectSearch.toLowerCase()),
      ),
    [subjects, subjectSearch],
  );

  const filteredTopics = useMemo(
    () =>
      selectedSubject?.topics.filter((t) =>
        t.name.toLowerCase().includes(topicSearch.toLowerCase()),
      ) ?? [],
    [selectedSubject, topicSearch],
  );

  function selectSubject(subject: Subject) {
    setSelectedSubject(subject);
    setSelectedTopics(subject.topics.map((t) => t.id));
    setStep("configure");
  }

  function toggleTopic(id: string) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    if (!selectedSubject) return;
    const allIds = filteredTopics.map((t) => t.id);
    const allSelected = allIds.every((id) => selectedTopics.includes(id));
    if (allSelected) {
      setSelectedTopics((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedTopics((prev) => [...new Set([...prev, ...allIds])]);
    }
  }

  async function create() {
    if (!selectedSubject || selectedTopics.length === 0) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/quiz/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId: selectedSubject.id,
        topics: selectedTopics,
        count,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/quiz/${data.attemptId}`);
  }

  const allFilteredSelected =
    filteredTopics.length > 0 &&
    filteredTopics.every((t) => selectedTopics.includes(t.id));

  if (step === "subject") {
    return (
      <div className="px-4 pt-6 pb-28 space-y-4">
        <div className="pb-1">
          <h1 className="text-2xl font-bold tracking-tight">New Quiz</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick a subject to get started
          </p>
        </div>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search subjects..."
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className="pl-8 bg-muted border-0 rounded-xl h-10"
          />
        </div>

        <div className="space-y-2">
          {filteredSubjects.map((s) => (
            <Card
              key={s.id}
              className="cursor-pointer hover:border-foreground/20 transition-all active:scale-[0.99]"
              onClick={() => selectSubject(s)}
            >
              <CardContent className="px-4 py-3 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${s.colour}20` }}
                >
                  <BookOpen size={15} style={{ color: s.colour }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.exam_board}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {s.topics.length} topics
                  </Badge>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSubjects.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No subjects found
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center gap-3 pb-1">
        <button
          onClick={() => setStep("subject")}
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight truncate">
            {selectedSubject!.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {selectedSubject!.exam_board}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
            <div
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <span className="text-sm font-semibold">Topics</span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {selectedTopics.length}/{selectedSubject!.topics.length}
              </Badge>
            </div>
            <button
              onClick={toggleAll}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-4 shrink-0"
            >
              {allFilteredSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Filter topics..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="pl-7 h-8 text-xs bg-muted border-0 rounded-lg"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filteredTopics.map((t, i) => {
              const isSelected = selectedTopics.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTopic(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/40",
                    i < filteredTopics.length - 1 &&
                      "border-b border-border/40",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "border-foreground bg-foreground"
                        : "border-border",
                    )}
                  >
                    {isSelected && (
                      <Check
                        size={10}
                        className="text-background"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <span className="text-sm flex-1">{t.name}</span>
                  {t.count !== undefined && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {t.count}q
                    </span>
                  )}
                </button>
              );
            })}

            {filteredTopics.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                No topics found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Questions</span>
            <span className="font-bold font-mono text-xl tabular-nums">
              {count}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={(value) =>
              value !== undefined && setCount((value as unknown) as number[][0])
            }
            min={5}
            max={30}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono px-0.5">
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <span
                key={n}
                className={cn(count === n && "text-foreground font-bold")}
              >
                {n}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {selectedTopics.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Select at least one topic to continue
        </p>
      )}

      <Button
        onClick={create}
        disabled={loading || selectedTopics.length === 0}
        className="w-full h-14 text-base font-semibold rounded-2xl"
      >
        {loading ? "Creating..." : `Start Quiz`}
        <ArrowRight />
      </Button>
    </div>
  );
}

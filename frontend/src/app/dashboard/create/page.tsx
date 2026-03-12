"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Subject = {
  id: string;
  name: string;
  colour: string;
  examBoard: string;
  questionCount: number | null;
  templateBased: boolean;
  topics: { id: string; name: string }[];
};

export default function CreateQuiz() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.subjects
      .getAll()
      .then((s) => setSubjects(s as Subject[]))
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : JSON.stringify(e);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (error) {
    return (
      <div className="px-4 py-10 max-w-md mx-auto text-center space-y-3">
        <p className="text-sm font-semibold text-destructive">
          Failed to load subjects
        </p>
        <p className="text-xs text-muted-foreground font-mono break-all bg-muted rounded-xl px-3 py-2">
          {error}
        </p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-md md:max-w-full mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">New quiz</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pick a subject to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/dashboard/subjects/${subject.id}`}
            className="group flex items-center justify-between rounded-xl border bg-card px-4 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: subject.colour }}
              />
              <div>
                <p className="text-sm font-medium">{subject.name}</p>
                <p className="text-xs text-muted-foreground">
                  {subject.examBoard}
                  {!subject.templateBased && subject.questionCount !== null && (
                    <> · {subject.questionCount} questions</>
                  )}
                  {" · "}
                  {subject.topics.length} topics
                </p>
              </div>
            </div>
            <ChevronRight
              size={14}
              className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

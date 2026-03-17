import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Attempt = {
  id: string;
  subjectId: string;
  topics: string[];
  total: number;
  correct: number;
  percentage: number;
  completedAt: string;
};

function ScoreText({ pct }: { pct: number }) {
  const cls =
    pct >= 80
      ? "text-score-high"
      : pct >= 50
        ? "text-score-mid"
        : "text-score-low";
  return <span className={`font-bold font-mono text-sm ${cls}`}>{pct}%</span>;
}

export default function RecentActivity({ attempts }: { attempts: Attempt[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </h2>
      </div>

      {attempts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No quizzes completed yet.
            </p>
            <Link href="/dashboard/create">
              <Button variant="link" className="text-xs flex items-center justify-center h-auto p-0">
                Start your first quiz <ArrowRight />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0!">
          <CardContent className="p-0">
            {attempts.map((a, i) => (
              <Link key={a.id} href={`/quiz/${a.id}/results`}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors
                  ${i < attempts.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold capitalize">
                      {a.subjectId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.completedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      {" · "}
                      {a.total} questions
                      {a.topics.length > 0 && ` · ${a.topics[0]}`}
                    </p>
                  </div>
                  <ScoreText pct={a.percentage} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

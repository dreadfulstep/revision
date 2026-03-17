import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";

type Attempt = {
  id: string;
  currentIndex: number;
  total: number;
  lastActivityAt: string;
};

export default function InProgress({ attempts }: { attempts: Attempt[] }) {
  if (attempts.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Continue
      </h2>
      <div className="flex flex-col gap-2">
        {attempts.map((a) => (
          <Link key={a.id} href={`/dashboard/quiz/${a.id}`}>
            <Card className="hover:border-foreground/20 transition-colors">
              <CardContent className="px-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <BookOpen size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Quiz in progress</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground rounded-full"
                        style={{
                          width: `${(a.currentIndex / a.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      {a.currentIndex}/{a.total}
                    </span>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm">
                  <ArrowRight />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

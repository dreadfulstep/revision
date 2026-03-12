"use client"

import { BookOpen, ChevronRight, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { History } from "@/lib/dashboard-data"

function getScoreColor(score: number) {
  if (score >= 80) return "text-primary"
  if (score >= 60) return "text-amber-500"
  return "text-destructive"
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-primary/10"
  if (score >= 60) return "bg-amber-500/10"
  return "bg-destructive/10"
}

export function RecentActivity({ history }: { history: History[] }) {
  if (history.length === 0) {
    return (
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="mb-4 text-lg font-semibold">
          Recent Activity
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <Clock className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No attempts yet</p>
            <p className="text-sm text-muted-foreground">
              Start a quiz to see your activity here
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="activity-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="activity-heading" className="text-lg font-semibold">
          Recent Activity
        </h2>
        <Button variant="ghost" size="sm" className="gap-1 rounded-xl text-xs">
          View all
          <ArrowRight className="size-3" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {history.map((attempt, index) => (
          <article
            key={attempt.attemptId}
            className={cn(
              "flex items-center gap-4 p-4 transition-colors hover:bg-accent/50 cursor-pointer",
              index !== history.length - 1 && "border-b border-border"
            )}
          >
            <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", getScoreBg(attempt.accuracy))}>
              <BookOpen className={cn("size-5", getScoreColor(attempt.accuracy))} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{attempt.subjectName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {attempt.topics}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{attempt.questionsAnswered} questions</span>
                <span>·</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn("text-lg font-bold", getScoreColor(attempt.accuracy))}
              >
                {attempt.accuracy}%
              </span>
              <ChevronRight className="size-4 text-muted-foreground/30" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

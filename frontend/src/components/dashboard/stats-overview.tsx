"use client"

import { UserStats } from "@/lib/dashboard-data"

export function StatsOverview({ stats }: { stats: UserStats | undefined }) {
  const statsArray = [
    {
      label: "Quizzes Completed",
      value: stats?.quizzesCompleted.toLocaleString() || "0",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: "Questions Answered",
      value: stats?.questionsAnswered.toLocaleString()|| "0",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      label: "Accuracy Rate",
      value: stats ? `${stats.accuracy}%` : "0%",
      change: "+3%",
      changeType: "positive" as const,
    },
    {
      label: "Total XP",
      value: stats?.xp.toLocaleString() || "0",
      change: `+${stats?.level.xpIntoLevel}`,
      changeType: "positive" as const,
    },
  ]

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Performance Statistics
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statsArray.map((stat) => (
          <article
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-primary">{stat.change}</span>
              </div>

              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
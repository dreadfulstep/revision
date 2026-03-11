"use client";

import { Progress } from "@/components/ui/progress";
import { UserStats } from "@/lib/dashboard-data";

export function LevelProgressCard({ stats }: { stats?: UserStats }) {
  const actStats: UserStats = stats || {
    level: {
      icon: "🎓",
      name: "Learner",
      level: 0,
      xpNeeded: 100,
      progress: 0,
      currentXp: 0,
      thisLevelXp: 0,
      nextLevelXp: 100,
      xpIntoLevel: 0,
      isMaxLevel: false,
    },
    xp: 0,
    quizzesCompleted: 0,
    questionsAnswered: 0,
    streak: { current: 0, longest: 0 },
    accuracy: 0
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            {actStats.level.icon}
          </div>
          <div>
            <h3 className="font-semibold">{actStats.level.name}</h3>
            <p className="text-xs text-muted-foreground">
              Level {actStats.level.level}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-accent-foreground">
            {actStats.xp.toLocaleString()} XP
          </p>
          <p className="text-[10px] text-muted-foreground">
            {actStats.level.xpNeeded} to next level
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress
          value={actStats.level.progress}
          className="h-3 rounded-full"
        />
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Level {actStats.level.level}</span>
          <span>{actStats.level.progress}%</span>
          <span>Level {actStats.level.level + 1}</span>
        </div>
      </div>
    </article>
  );
}

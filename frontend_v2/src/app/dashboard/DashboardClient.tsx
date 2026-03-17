"use client";

import { type Rank } from "@/lib/xp";
import BottomNav from "@/components/dashboard/BottomNav";
import LevelCard from "@/components/dashboard/LevelCard";
import StreakCard from "@/components/dashboard/StreakCard";
import StatCards from "@/components/dashboard/StatsCard";
import InProgress from "@/components/dashboard/InProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";

type Props = {
  user: {
    username: string;
    avatar: string | null;
    level: number;
    xp: number;
    xpCurrent: number;
    xpNeeded: number;
    xpProgress: number;
    quizzesCompleted: number;
    questionsAnswered: number;
    rank: Rank;
  };
  streak: { current: number; longest: number, lastActivityDate: string | null };
  recentAttempts: {
    id: string;
    subjectId: string;
    topics: string[];
    total: number;
    correct: number;
    percentage: number;
    completedAt: string;
  }[];
  inProgress: {
    id: string;
    currentIndex: number;
    total: number;
    lastActivityAt: string;
  }[];
};

export default function DashboardClient({
  user,
  streak,
  recentAttempts,
  inProgress,
}: Props) {
  const accuracyRate =
    recentAttempts.length > 0
      ? Math.round(
          recentAttempts.reduce((s, a) => s + a.percentage, 0) /
            recentAttempts.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-4 pt-5 pb-28 space-y-3">
        <div className="pt-1 pb-1">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-[1.65rem] font-bold tracking-tight leading-tight">
            {user.username}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {streak.current > 0
              ? `${streak.current} day streak, Keep it up!`
              : "Complete a quiz today to start your streak!"}
          </p>
        </div>

        <LevelCard
          level={user.level}
          xp={user.xp}
          xpCurrent={user.xpCurrent}
          xpNeeded={user.xpNeeded}
          xpProgress={user.xpProgress}
          rank={user.rank}
        />

        <StreakCard
          streak={{
            current: streak.current,
            longest: streak.longest,
            lastActivityDate: streak.lastActivityDate,
          }}
        />

        <StatCards
          quizzesCompleted={user.quizzesCompleted}
          questionsAnswered={user.questionsAnswered}
          accuracyRate={accuracyRate}
          totalXp={user.xp}
        />

        <InProgress attempts={inProgress} />

        <RecentActivity attempts={recentAttempts} />
      </div>
      <BottomNav />
    </div>
  );
}

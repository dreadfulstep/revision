"use client";

import { Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Card, CardContent } from "@/components/ui/card";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDays(streakCount: number, lastActivityDate: string | null) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]!;
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const completedToday = lastActivityDate === todayStr;

  return Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6;
    const dayIndex = (todayIndex + offset + 7) % 7;
    const daysAgo = -offset;
    const isToday = offset === 0;
    const isFuture = offset > 0;

    const active =
      !isFuture &&
      (completedToday
        ? daysAgo < streakCount
        : daysAgo >= 1 && daysAgo <= streakCount);

    return { label: DAYS[dayIndex]!, isToday, isFuture, active };
  });
}

function dayColor(i: number) {
  const hue = 30 + (i / 6) * 20;
  const chroma = 0.18 - (i / 6) * 0.02;
  return `oklch(0.72 ${chroma.toFixed(3)} ${hue})`;
}

type Props = {
  streak: { current: number; longest: number; lastActivityDate: string | null };
};

export default function StreakCard({ streak }: Props) {
  const days = getWeekDays(streak.current, streak.lastActivityDate);

  return (
    <Card>
      <CardContent className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">Daily Streak</p>
              <p className="text-xs text-muted-foreground mt-1">
                {streak.current > 0 ? "Keep it going!" : "Start today"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold font-mono text-2xl text-streak leading-none">
              {streak.current}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Best: {streak.longest}
            </p>
          </div>
        </div>

        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "repeat(13, auto)",
          }}
        >
          {days.map((day, i) => {
            const color = dayColor(i);
            const nextColor = dayColor(i + 1);
            const isActive = day.active;
            const isTodayActive = day.isToday && day.active;
            const isTodayEmpty = day.isToday && !day.active;

            return (
              <Fragment key={i}>
                <div className="flex justify-center">
                  <div
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center transition-all",
                      isTodayActive && "shadow-lg",
                      isTodayEmpty && "border-2 border-dashed border-muted-foreground/30 bg-muted/40",
                      !isActive && !day.isToday && "bg-muted/50",
                    )}
                    style={{
                      backgroundColor: isActive ? color : undefined,
                      boxShadow: isTodayActive ? `0 4px 14px ${color}55` : undefined,
                    }}
                  >
                    {isActive && (
                      <Check
                        size={16}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                    )}
                  </div>
                </div>

                {i < 6 && (
                  <div
                    className="h-0.5 w-full"
                    style={{
                      background:
                        isActive && days[i + 1]?.active
                          ? `linear-gradient(to right, ${color}, ${nextColor})`
                          : "hsl(var(--muted))",
                    }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(13, auto)" }}
        >
          {days.map((day, i) => (
            <span
              key={i}
              style={{ gridColumn: i * 2 + 1 }}
              className={cn(
                "text-center text-[10px] font-medium w-9",
                day.isToday ? "text-streak" : "text-muted-foreground",
                !day.active && !day.isToday && "text-muted-foreground/40",
              )}
            >
              {day.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
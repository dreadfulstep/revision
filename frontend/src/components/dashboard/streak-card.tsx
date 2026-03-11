"use client";

import { Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

function getWeekDays(streakCount: number) {
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6;
    const dayIndex = (todayIndex + offset + 7) % 7;
    const daysAgo = -offset;
    const isToday = offset === 0;
    const isFuture = offset > 0;
    const active = !isFuture && daysAgo < streakCount;

    return { label: labels[dayIndex], isToday, isFuture, active };
  });
}

export function StreakCard({
  streak,
}: {
  streak: { current: number; longest: number };
}) {
  const weekDays = getWeekDays(streak.current);

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Flame className="size-5 text-orange-500" />
          </div>

          <div>
            <h3 className="font-semibold">Daily Streak</h3>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-orange-500">{streak.current}</p>
          <p className="text-[10px] text-muted-foreground">
            Best: {streak.longest}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto] items-center">
        {weekDays.map((day, i) => {
          const isPast = day.active && !day.isToday;
          const isCurrent = day.isToday;

          const hue = 65 + (i / 6) * 25;
          const color = `oklch(80% 0.45 ${hue})`;

          return (
            <Fragment key={i}>
              <div className="flex justify-center">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full sm:size-10",
                    isCurrent && day.active && "shadow-md shadow-orange-500/30",
                    isCurrent &&
                      !day.active &&
                      "border-2 border-dashed border-muted-foreground/40 bg-muted",
                    !day.active && !isCurrent && "bg-muted",
                  )}
                  style={{
                    backgroundColor:
                      isPast || (isCurrent && day.active) ? color : undefined,
                  }}
                >
                  {day.active && (
                    <Check className="size-4 sm:size-5 text-white" />
                  )}
                </div>
              </div>

              {i < 6 && (
                <div
                  className="h-0.5"
                  style={{
                    background: day.active
                      ? `linear-gradient(to right, ${color}, oklch(80% 0.45 ${
                          65 + ((i + 1) / 6) * 25
                        }))`
                      : undefined,
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-[2rem_1fr_2rem_1fr_2rem_1fr_2rem_1fr_2rem_1fr_2rem_1fr_2rem] sm:grid-cols-[2.5rem_1fr_2.5rem_1fr_2.5rem_1fr_2.5rem_1fr_2.5rem_1fr_2.5rem_1fr_2.5rem] mt-2">
        {weekDays.map((day, i) => (
          <span
            key={i}
            style={{ gridColumn: i * 2 + 1 }}
            className={cn(
              "text-center text-[10px] font-medium sm:text-xs",
              day.isToday ? "text-orange-500" : "text-muted-foreground",
            )}
          >
            {day.label}
          </span>
        ))}
      </div>
    </article>
  );
}
"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { api } from "@/lib/api";

type Exam = {
  subject: string;
  paper: string;
  title: string;
  date: string;
  time: string;
  duration: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
};

export type CalendarResponse = {
  nextExam: Exam | null;
  countdown: Countdown | null;
  schedule: Exam[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function CalendarPage() {
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.calendar
      .get()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="px-4 py-6 max-w-md mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays size={16} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold">Exam Schedule</h1>
      </div>

      {data.nextExam && data.countdown && (
        <div className="rounded-2xl border bg-card p-5 mb-6">
          <p className="text-xs text-muted-foreground mb-2">Next Exam</p>

          <p className="text-lg font-semibold">{data.nextExam.subject}</p>

          <p className="text-sm text-muted-foreground mb-4">
            {data.nextExam.paper} • {data.nextExam.title}
          </p>

          <div className="flex items-center gap-2 text-primary font-semibold">
            <Clock size={16} />
            {data.countdown.days}d {data.countdown.hours}h{" "}
            {data.countdown.minutes}m
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            {formatDate(data.nextExam.date)} • {data.nextExam.time}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {data.schedule.map((exam, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card px-4 py-3 flex items-center gap-3"
          >
            <div className="w-12 flex flex-col items-center justify-center h-full shrink-0 text-center border-r border-border pr-3">
              <p className="text-sm font-semibold">
                {new Date(exam.date).getDate()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase">
                {new Date(exam.date).toLocaleDateString("en-GB", {
                  month: "short",
                })}
              </p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">{exam.subject}</p>

              <p className="text-xs text-muted-foreground">
                {exam.paper} • {exam.title}
              </p>

              <p className="text-xs text-primary font-medium mt-1">
                {exam.time} • {exam.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

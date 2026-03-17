import { getUpcomingExams, getNextExam, getCountdown } from "@/lib/content";
import { Clock, CalendarDays } from "lucide-react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function SchedulePage() {
  const exams = await getUpcomingExams();
  const next = await getNextExam();
  const countdown = next ? getCountdown(next.date) : null;

  return (
    <div className="px-4 md:px-8 py-6 space-y-4 max-w-md md:max-w-full mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <CalendarDays size={16} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold">Exam Schedule</h1>
      </div>

      {next && countdown && (
        <div className="rounded-2xl border bg-card p-5 px-4 py-4 mb-6 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Next Exam</p>
            <p className="text-lg font-semibold">
              {next.subject
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </p>
            <p className="text-sm text-muted-foreground">
              {next.paper
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}{" "}
              - {next.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(next.date)} - {next.durationLabel}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:text-right shrink-0">
            <div className="flex items-center gap-2 text-primary font-semibold md:justify-end">
              <Clock size={16} />
              {countdown.days}d {countdown.hours}h {countdown.minutes}m
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exams.map((exam, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card px-4 py-3 flex items-center gap-3"
          >
            <div className="w-12 flex flex-col items-center justify-center shrink-0 text-center border-r border-border pr-3">
              <p className="text-sm font-semibold">
                {new Date(exam.date).getDate()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase">
                {new Date(exam.date).toLocaleDateString("en-GB", {
                  month: "short",
                })}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{exam.subject
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}</p>
              <p className="text-xs text-muted-foreground truncate">
                {exam.paper
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")} - {exam.name}
              </p>
              <p className="text-xs text-primary font-medium mt-1">
                {exam.time} - {exam.durationLabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

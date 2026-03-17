import fs from "fs/promises";
import path from "path";

export type Exam = {
  id: string;
  subject: string;
  paper: string;
  name: string;
  date: Date;
  durationMinutes: number;
  endDate: Date;
  time: string;
  durationLabel: string;
};

type RawExam = {
  name: string;
  date: string | null;
  durationMinutes: number;
};

type Schedule = {
  [board: string]: {
    [subject: string]: {
      [paper: string]: RawExam;
    };
  };
};

function flattenSchedule(data: Schedule): Exam[] {
  const exams: Exam[] = [];

  for (const board of Object.keys(data)) {
    const subjects = data[board];

    for (const subject of Object.keys(subjects)) {
      const papers = subjects[subject];

      for (const paper of Object.keys(papers)) {
        const entry: RawExam = papers[paper];

        if (!entry?.date) continue;

        const start = new Date(entry.date);
        const duration = entry.durationMinutes ?? 90;

        const end = new Date(start.getTime() + duration * 60000);

        exams.push({
          id: `${board}-${subject}-${paper}`,
          subject,
          paper,
          name: entry.name,
          date: start,
          durationMinutes: duration,
          endDate: end,
          time: start.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          durationLabel: formatDuration(duration),
        });
      }
    }
  }

  return exams.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function getSchedule(): Promise<Exam[]> {
  const file = path.join(process.cwd(), "content", "schedule.json");

  const raw = await fs.readFile(file, "utf-8");
  const json : Schedule = JSON.parse(raw);

  return flattenSchedule(json);
}

export async function getUpcomingExams(): Promise<Exam[]> {
  const exams = await getSchedule();
  const now = new Date();

  return exams.filter((e) => e.date.getTime() > now.getTime());
}

export async function getNextExam(): Promise<Exam | null> {
  const upcoming = await getUpcomingExams();
  return upcoming[0] ?? null;
}

export function getCountdown(target: Date) {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) return null;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
  };
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

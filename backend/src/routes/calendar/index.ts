import { Router } from "express";
import fs from "fs";
import path from "path";

const schedule = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content/schedule.json"), "utf-8"),
);

const router = Router();

type Paper = {
  paper: string;
  title: string;
  examCode?: string;
  date: string;
  time: string;
  duration: string;
};

type Exam = {
  subject: string;
  examBoard: string;
  specCode: string;
  paper: string;
  title: string;
  date: string;
  time: string;
  duration: string;
};

function flattenSchedule(): Exam[] {
  const exams: Exam[] = [];

  for (const subject of schedule.exams) {
    for (const paper of subject.papers) {
      exams.push({
        subject: subject.subject,
        examBoard: subject.examBoard,
        specCode: subject.specCode,
        paper: paper.paper,
        title: paper.title,
        date: paper.date,
        time: paper.time,
        duration: paper.duration,
      });
    }
  }

  return exams.sort((a, b) => {
    const d1 = new Date(`${a.date}T${a.time}`);
    const d2 = new Date(`${b.date}T${b.time}`);
    return d1.getTime() - d2.getTime();
  });
}

function getCountdown(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;

  return { days, hours, minutes };
}

router.get("/", (req, res) => {
  const exams = flattenSchedule();
  const now = new Date();

  const nextExam = exams.find((e) => {
    const examDate = new Date(`${e.date}T${e.time}`);
    return examDate > now;
  });

  if (!nextExam) {
    return res.json({
      nextExam: null,
      countdown: null,
      schedule: exams,
    });
  }

  const examDate = new Date(`${nextExam.date}T${nextExam.time}`);

  res.json({
    nextExam: {
      ...nextExam,
      dateTime: examDate.toISOString(),
    },
    countdown: getCountdown(examDate),
    schedule: exams,
  });
});

export default router;

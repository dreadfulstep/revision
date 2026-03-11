import { Request, Response } from "express";
import { subjects, getSubject, getQuestions } from "@/utils/content";

export function getAll(req: Request, res: Response) {
  const data = subjects.map((subject) => {
    const questions = getQuestions(subject.id);
    return {
      ...subject,
      questionCount: questions.length,
      topics: subject.topics.map((topic) => ({
        ...topic,
        questionCount: questions.filter((q) => q.topic === topic.id).length,
      })),
    };
  });

  res.json(data);
}

export function getOne(req: Request, res: Response) {
  const subject = getSubject(req.params.id as string);
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }

  const questions = getQuestions(subject.id);

  res.json({
    ...subject,
    questionCount: questions.length,
    topics: subject.topics.map((topic) => ({
      ...topic,
      questionCount: questions.filter((q) => q.topic === topic.id).length,
      difficulties: {
        easy:   questions.filter((q) => q.topic === topic.id && q.difficulty <= 2).length,
        medium: questions.filter((q) => q.topic === topic.id && q.difficulty === 3).length,
        hard:   questions.filter((q) => q.topic === topic.id && q.difficulty >= 4).length,
      },
    })),
  });
}
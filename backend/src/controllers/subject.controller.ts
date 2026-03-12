import { Request, Response } from "express";
import { subjects, getSubject, getQuestions, getTemplates, hasTemplates } from "@/utils/content";

function buildSubjectData(subject: ReturnType<typeof getSubject> & object) {
  const questions = getQuestions(subject.id);
  const templates = getTemplates(subject.id);
  const templateBased = hasTemplates(subject.id);

  return {
    ...subject,
    templateBased,
    questionCount: templateBased ? null : questions.length,
    topics: subject.topics.map((topic) => {
      const topicQuestions = questions.filter((q) => q.topic === topic.id);
      const topicTemplates = templates.filter((t) => t.topic === topic.id);
      return {
        ...topic,
        templateBased: topicTemplates.length > 0,
        questionCount: topicTemplates.length > 0 ? null : topicQuestions.length,
        templateCount: topicTemplates.length,
      };
    }),
  };
}

export function getAll(req: Request, res: Response) {
  res.json(subjects.map((subject) => buildSubjectData(subject as any)));
}

export function getOne(req: Request, res: Response) {
  const subject = getSubject(req.params.id as string);
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  res.json(buildSubjectData(subject as any));
}
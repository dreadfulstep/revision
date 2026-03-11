import { Router, Request, Response } from "express";
import { subjects, getSubject, getQuestions } from "@/utils/content";

const router = Router();

// GET /subjects
// Returns all subjects with their topics and question counts
router.get("/", (_req: Request, res: Response) => {
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
});

// GET /subjects/:id
// Returns a single subject with topic breakdown
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const subject = getSubject(id);
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
        easy: questions.filter((q) => q.topic === topic.id && q.difficulty <= 2)
          .length,
        medium: questions.filter(
          (q) => q.topic === topic.id && q.difficulty === 3,
        ).length,
        hard: questions.filter((q) => q.topic === topic.id && q.difficulty >= 4)
          .length,
      },
    })),
  });
});

export default router;

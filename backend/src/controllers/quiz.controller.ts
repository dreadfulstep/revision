import { Request, Response } from "express";
import * as quizService from "@/services/quiz.service";

export async function generate(req: Request, res: Response) {
  const { subjectId, topics, count, seed } = req.body;

  if (!subjectId) {
    res.status(400).json({ error: "subjectId is required" });
    return;
  }

  const result = await quizService.generateQuiz({
    subjectId,
    topics,
    count,
    seed,
  });

  if (!result.ok) {
    res.status(result.status).json({ error: result.error, ...result.meta });
    return;
  }

  res.json(result.data);
}

export async function getBySeeed(req: Request, res: Response) {
  const seed = req.params.seed as string;

  const result = await quizService.getQuiz(seed);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

export async function startAttempt(req: Request, res: Response) {
  const seed = req.params.seed as string;

  const result = await quizService.startAttempt(req.user!.id, seed);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

export async function answerQuestion(req: Request, res: Response) {
  const attemptId = req.params.attemptId as string;
  const { questionId, answer } = req.body;

  if (!questionId || answer === undefined) {
    res.status(400).json({ error: "questionId and answer are required" });
    return;
  }

  const result = await quizService.answerQuestion({
    userId: req.user!.id,
    attemptId,
    questionId,
    answer,
  });

  if (!result.ok) {
    res.status(result.status).json({ error: result.error, ...result.meta });
    return;
  }

  res.json(result.data);
}

export async function completeAttempt(req: Request, res: Response) {
  const attemptId = req.params.attemptId as string;

  const result = await quizService.completeAttempt(req.user!.id, attemptId);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error, ...result.meta });
    return;
  }

  res.json(result.data);
}
import { Request, Response } from "express";
import * as meService from "@/services/me.service";
import * as quizService from "@/services/quiz.service";

export async function getStats(req: Request, res: Response) {
  const result = await meService.getStats(req.user!.id);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

export async function getStreak(req: Request, res: Response) {
  const result = await meService.getStreak(req.user!.id);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

export async function getHistory(req: Request, res: Response) {
  const subjectId = req.query.subjectId as string | undefined;

  const result = await quizService.getUserHistory(req.user!.id, subjectId);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

export async function getAttempt(req: Request, res: Response) {
  const attemptId = req.params.attemptId as string;

  const result = await quizService.getAttempt(req.user!.id, attemptId);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}
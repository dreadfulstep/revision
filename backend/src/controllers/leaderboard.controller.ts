import { Request, Response } from "express";
import * as leaderboardService from "@/services/leaderboard.service";

export async function getLeaderboard(req: Request, res: Response) {
  const result = await leaderboardService.getLeaderboard();

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

export async function getMyRank(req: Request, res: Response) {
  const result = await leaderboardService.getUserRank(req.user!.id);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json(result.data);
}
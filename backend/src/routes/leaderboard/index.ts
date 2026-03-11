import { Router } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import * as leaderboard from "@/controllers/leaderboard.controller";

const router = Router();

router.get("/", leaderboard.getLeaderboard);
router.get("/me", requireAuth, leaderboard.getMyRank);

export default router;
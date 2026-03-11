import { Router } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import * as me from "@/controllers/me.controller";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(req.user)
});

router.get("/stats", me.getStats);
router.get("/streak", me.getStreak);
router.get("/history", me.getHistory);
router.get("/history/:attemptId", me.getAttempt);

export default router;

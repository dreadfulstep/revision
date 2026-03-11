import { Router } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import * as quiz from "@/controllers/quiz.controller";

const router = Router();

router.post("/generate", requireAuth, quiz.generate);
router.get("/:seed", requireAuth, quiz.getBySeeed);
router.post("/:seed/attempt", requireAuth, quiz.startAttempt);
router.post("/:seed/attempt/:attemptId/answer", requireAuth, quiz.answerQuestion);
router.post("/:seed/attempt/:attemptId/complete", requireAuth, quiz.completeAttempt);

export default router;
import { Router } from "express";
import * as subject from "@/controllers/subject.controller";

const router = Router();

router.get("/", subject.getAll);
router.get("/:id", subject.getOne);

export default router;
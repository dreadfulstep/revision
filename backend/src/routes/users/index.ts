import { Router } from "express";

const router = Router();

router.get("/@me", (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: `Unauthenticated` });
  };

  res.json(req.user)
});

export default router;

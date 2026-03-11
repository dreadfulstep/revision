import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(403).json({ error: "Unauthenticated" });
    return;
  }
  next();
}
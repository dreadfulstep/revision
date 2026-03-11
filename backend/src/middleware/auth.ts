import { Request, Response, NextFunction } from "express";
import db from "../db";
import { sessions } from "@/db/tables/sessions";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/user";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionId = req.cookies.session;
  if (!sessionId) {
    req.user = null;
    next();
    return;
  }

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1)
    .execute()
    .then((rows) => rows[0]);

  if (!session) {
    req.user = null;
    next();
    return;
  };

  const user = await getUser(session.userId)

  req.user = user;
  next();
}

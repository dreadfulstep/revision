import db from "@/db";
import { streaks } from "@/db/tables/streaks";
import { eq } from "drizzle-orm";

export async function updateStreak(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  // ... all the streak logic lives here, imported by quiz.service
}
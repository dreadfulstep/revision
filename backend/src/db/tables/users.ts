import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 32 }).primaryKey(), // Discord ID
  username: varchar("username", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(0),
  
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  questionsAnswered: integer("questions_answered").notNull().default(0),
});

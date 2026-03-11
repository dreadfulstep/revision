import { pgTable, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const quizzesTable = pgTable("quizzes", {
  id: varchar("id", { length: 255 }).primaryKey(), // same as seed
  subjectId: varchar("subject_id", { length: 255 }).notNull(),
  topics: jsonb("topics").notNull().$type<string[]>(), // [] = all topics
  questionIds: jsonb("question_ids").notNull().$type<string[]>(), // ordered by seed
  count: integer("count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One row per quiz attempt (a user can retake the same seed)
export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 32 })
    .notNull()
    .references(() => users.id),
  quizId: varchar("quiz_id", { length: 255 })
    .notNull()
    .references(() => quizzesTable.id),
  score: integer("score"), // null until completed
  completedAt: timestamp("completed_at"), // null until completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One row per question answer within an attempt
export const quizAnswersTable = pgTable("quiz_answers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  attemptId: varchar("attempt_id", { length: 255 })
    .notNull()
    .references(() => quizAttemptsTable.id),
  questionId: varchar("question_id", { length: 255 }).notNull(),
  answer: integer("answer").notNull(), // index the user chose
  correct: boolean("correct").notNull(),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
});
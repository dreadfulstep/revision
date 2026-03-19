import {
  pgTable,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  text,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider", ["discord", "github"]);
export const attemptStatusEnum = pgEnum("attempt_status", [
  "in_progress",
  "completed",
  "abandoned",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  questionsAnswered: integer("questions_answered").notNull().default(0),
});

export const accounts = pgTable("accounts", {
  provider: providerEnum("provider").notNull(),
  providerUserId: text("provider_user_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: text("id").primaryKey(),
  subjectId: varchar("subject_id", { length: 255 }).notNull(),
  topics: jsonb("topics").notNull().$type<string[]>(),
  questionIds: jsonb("question_ids").notNull().$type<string[]>(),
  count: integer("count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quizId: text("quiz_id")
    .notNull()
    .references(() => quizzes.id),

  status: attemptStatusEnum("status").notNull().default("in_progress"),

  currentIndex: integer("current_index").notNull().default(0),

  resolvedVars: jsonb("resolved_vars")
    .notNull()
    .$type<Record<string, Record<string, number>>>()
    .default({}),

  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),

  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),

  expiresAt: timestamp("expires_at").notNull(),
});

export const quizAnswers = pgTable("quiz_answers", {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id")
    .notNull()
    .references(() => quizAttempts.id, { onDelete: "cascade" }),
  questionId: varchar("question_id", { length: 255 }).notNull(),
  answer: text("answer").notNull(),
  correct: boolean("correct").notNull(),
  timeTaken: integer("time_taken"),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
});

export const streaks = pgTable("streaks", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
});

export const subjectProgress = pgTable("subject_progress", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id", { length: 255 }).notNull(),
  topicId: varchar("topic_id", { length: 255 }).notNull(),
  questionsAnswered: integer("questions_answered").notNull().default(0),
  questionsCorrect: integer("questions_correct").notNull().default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
});

export const paperAttempts = pgTable("paper_attempts", {
  id:          text("id").primaryKey(),
  userId:      text("user_id").notNull().references(() => users.id),
  paperId:     text("paper_id").notNull(),
  status:      text("status").notNull().default("in_progress"),
  answers:     jsonb("answers").notNull().$type<Record<string, string>>().default({}),
  marks:       jsonb("marks").$type<Record<string, number>>(),
  feedback:    jsonb("feedback").$type<Record<string, string>>(),
  totalMarks:  integer("total_marks"),
  startedAt:   timestamp("started_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  markedAt:    timestamp("marked_at"),
});

export const aiMarkingCache = pgTable("ai_marking_cache", {
  key:       text("key").primaryKey(),
  marks:     integer("marks").notNull(),
  feedback:  text("feedback").notNull(),
  correct:   boolean("correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
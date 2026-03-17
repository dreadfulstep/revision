CREATE TYPE "public"."attempt_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TABLE "quiz_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"answer" text NOT NULL,
	"correct" boolean NOT NULL,
	"time_taken" integer,
	"answered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"quiz_id" text NOT NULL,
	"status" "attempt_status" DEFAULT 'in_progress' NOT NULL,
	"current_index" integer DEFAULT 0 NOT NULL,
	"resolved_vars" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"score" integer,
	"total_questions" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_id" varchar(255) NOT NULL,
	"topics" jsonb NOT NULL,
	"question_ids" jsonb NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "streaks" (
	"user_id" text PRIMARY KEY NOT NULL,
	"current" integer DEFAULT 0 NOT NULL,
	"longest" integer DEFAULT 0 NOT NULL,
	"last_activity_date" date
);
--> statement-breakpoint
CREATE TABLE "subject_progress" (
	"user_id" text NOT NULL,
	"subject_id" varchar(255) NOT NULL,
	"topic_id" varchar(255) NOT NULL,
	"questions_answered" integer DEFAULT 0 NOT NULL,
	"questions_correct" integer DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."provider";--> statement-breakpoint
CREATE TYPE "public"."provider" AS ENUM('discord', 'github');--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider" SET DATA TYPE "public"."provider" USING "provider"::"public"."provider";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "quizzes_completed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "questions_answered" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_progress" ADD CONSTRAINT "subject_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
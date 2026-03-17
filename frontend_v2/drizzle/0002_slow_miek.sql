CREATE TABLE "paper_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"paper_id" text NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"marks" jsonb,
	"feedback" jsonb,
	"total_marks" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp,
	"marked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "paper_attempts" ADD CONSTRAINT "paper_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"avatar" varchar(255),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"access_token" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
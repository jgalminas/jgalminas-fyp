CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"email" varchar(360) NOT NULL,
	"password" varchar(72) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_index" ON "user" ("email");
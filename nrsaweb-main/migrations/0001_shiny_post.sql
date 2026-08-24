ALTER TABLE "admins" ADD COLUMN "role" text DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "protected" boolean DEFAULT false NOT NULL;
ALTER TABLE "scheduled_posts" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" boolean DEFAULT false;
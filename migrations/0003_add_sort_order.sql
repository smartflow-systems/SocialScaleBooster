ALTER TABLE "scheduled_posts" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;

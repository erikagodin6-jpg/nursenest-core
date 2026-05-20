-- Safe reschedule window for blog_article_generation_jobs (retry backoff without hot-looping).
ALTER TABLE "blog_article_generation_jobs" ADD COLUMN IF NOT EXISTS "next_attempt_at" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "blog_article_generation_jobs_stage_next_attempt_at_idx"
  ON "blog_article_generation_jobs"("stage", "next_attempt_at");

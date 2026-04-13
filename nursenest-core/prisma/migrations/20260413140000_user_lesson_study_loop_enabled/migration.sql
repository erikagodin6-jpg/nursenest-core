-- Optional learner preference: guided lesson study loop (bank-backed pre/post on lesson pages).
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lesson_study_loop_enabled" BOOLEAN;

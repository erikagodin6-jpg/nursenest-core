-- CAT (computer adaptive testing) state for practice tests
ALTER TABLE "practice_tests" ADD COLUMN IF NOT EXISTS "adaptiveState" JSONB;

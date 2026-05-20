-- AlterEnum: add ALLIED to TierCode (idempotent; safe if migration is re-tried after partial apply)
DO $tiercode_allied$ BEGIN
  ALTER TYPE "TierCode" ADD VALUE 'ALLIED';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $tiercode_allied$;

-- AlterTable User: onboarding + freemium counters
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "examFocus" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "studyGoal" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dailyStudyMinutes" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "learnerPath" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingCompletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "freeQuestionViews" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "freeLessonOpens" INTEGER NOT NULL DEFAULT 0;

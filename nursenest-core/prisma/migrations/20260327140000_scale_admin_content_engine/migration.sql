-- Enums
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ExamFamily" AS ENUM ('NCLEX_RN', 'NCLEX_PN', 'REX_PN', 'NP', 'ALLIED', 'GENERIC');
CREATE TYPE "DifficultyBand" AS ENUM ('FOUNDATION', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Extend QuestionType (ignore if re-run)
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE 'NGN_CASE'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE 'ORDERING'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE 'FIB_NUMERIC'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Category
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "topicCode" TEXT;

-- Lesson: add columns, migrate published -> status
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
UPDATE "Lesson" SET "status" = 'PUBLISHED' WHERE "published" = true;
UPDATE "Lesson" SET "status" = 'DRAFT' WHERE "published" = false;
ALTER TABLE "Lesson" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Lesson" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC';
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "difficulty" "DifficultyBand";
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "topicTag" TEXT;
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "systemTag" TEXT;
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "sourceNotes" TEXT;
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "published";

-- Question
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
UPDATE "Question" SET "status" = 'PUBLISHED' WHERE "published" = true;
UPDATE "Question" SET "status" = 'DRAFT' WHERE "published" = false;
ALTER TABLE "Question" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Question" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC';
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "difficulty" "DifficultyBand";
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "topicTag" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "systemTag" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "sourceNotes" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "generationBatchId" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "needsReview" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "duplicateOfId" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "stemHash" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "lessonId" TEXT;
ALTER TABLE "Question" DROP COLUMN IF EXISTS "published";

-- Exam
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
UPDATE "Exam" SET "status" = 'PUBLISHED' WHERE "published" = true;
UPDATE "Exam" SET "status" = 'DRAFT' WHERE "published" = false;
ALTER TABLE "Exam" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Exam" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC';
ALTER TABLE "Exam" DROP COLUMN IF EXISTS "published";

-- FKs for Question self-dup + lesson
ALTER TABLE "Question" ADD CONSTRAINT "Question_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Lesson_status_country_tier_idx" ON "Lesson"("status", "country", "tier");
CREATE INDEX IF NOT EXISTS "Lesson_categoryId_idx" ON "Lesson"("categoryId");
CREATE INDEX IF NOT EXISTS "Question_status_country_tier_idx" ON "Question"("status", "country", "tier");
CREATE INDEX IF NOT EXISTS "Question_categoryId_idx" ON "Question"("categoryId");
CREATE INDEX IF NOT EXISTS "Question_lessonId_idx" ON "Question"("lessonId");
CREATE INDEX IF NOT EXISTS "Question_examFamily_idx" ON "Question"("examFamily");
CREATE INDEX IF NOT EXISTS "Question_stemHash_idx" ON "Question"("stemHash");

CREATE INDEX IF NOT EXISTS "Exam_status_country_tier_idx" ON "Exam"("status", "country", "tier");

CREATE INDEX IF NOT EXISTS "ExamAttempt_examId_idx" ON "ExamAttempt"("examId");
CREATE INDEX IF NOT EXISTS "ExamAttempt_userId_createdAt_idx" ON "ExamAttempt"("userId", "createdAt");

-- Flashcard
CREATE TABLE IF NOT EXISTS "Flashcard" (
    "id" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,
    "tier" "TierCode" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC',
    "categoryId" TEXT NOT NULL,
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Flashcard_status_country_tier_idx" ON "Flashcard"("status", "country", "tier");
CREATE INDEX IF NOT EXISTS "Flashcard_lessonId_idx" ON "Flashcard"("lessonId");
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Background jobs
CREATE TABLE IF NOT EXISTS "BackgroundJob" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastError" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "BackgroundJob_status_scheduledFor_idx" ON "BackgroundJob"("status", "scheduledFor");
CREATE INDEX IF NOT EXISTS "BackgroundJob_type_idx" ON "BackgroundJob"("type");

-- Enums (idempotent — production DBs may already have these from partial / out-of-band applies)
DO $$ BEGIN CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ExamFamily" AS ENUM ('NCLEX_RN', 'NCLEX_PN', 'REX_PN', 'NP', 'ALLIED', 'GENERIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "DifficultyBand" AS ENUM ('FOUNDATION', 'INTERMEDIATE', 'ADVANCED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend QuestionType (ignore if type or value missing / duplicate)
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE 'NGN_CASE'; EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE 'ORDERING'; EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE 'FIB_NUMERIC'; EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;

-- Category (import / partial DBs may omit this table)
DO $$ BEGIN
  IF to_regclass('public."Category"') IS NOT NULL THEN
    ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "topicCode" TEXT;
  END IF;
END $$;

-- Lesson (skip entire block when table absent — e.g. exam_questions–only databases)
DO $$ BEGIN
  IF to_regclass('public."Lesson"') IS NOT NULL THEN
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
    IF EXISTS (
      SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'Lesson' AND a.attname = 'published' AND NOT a.attisdropped
    ) THEN
      UPDATE "Lesson" SET "status" = 'PUBLISHED' WHERE "published" = true;
      UPDATE "Lesson" SET "status" = 'DRAFT' WHERE "published" = false;
    END IF;
    UPDATE "Lesson" SET "status" = 'DRAFT' WHERE "status" IS NULL;
    ALTER TABLE "Lesson" ALTER COLUMN "status" SET NOT NULL;
    ALTER TABLE "Lesson" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC';
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "difficulty" "DifficultyBand";
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "topicTag" TEXT;
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "systemTag" TEXT;
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
    ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "sourceNotes" TEXT;
    ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "published";
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Question"') IS NOT NULL THEN
    ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
    IF EXISTS (
      SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'published' AND NOT a.attisdropped
    ) THEN
      UPDATE "Question" SET "status" = 'PUBLISHED' WHERE "published" = true;
      UPDATE "Question" SET "status" = 'DRAFT' WHERE "published" = false;
    END IF;
    UPDATE "Question" SET "status" = 'DRAFT' WHERE "status" IS NULL;
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
    IF EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'status' AND NOT a.attisdropped)
       AND EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'country' AND NOT a.attisdropped)
       AND EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'tier' AND NOT a.attisdropped) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "Question_status_country_tier_idx" ON "Question"("status", "country", "tier")';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'categoryId' AND NOT a.attisdropped) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "Question_categoryId_idx" ON "Question"("categoryId")';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'lessonId' AND NOT a.attisdropped) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "Question_lessonId_idx" ON "Question"("lessonId")';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'examFamily' AND NOT a.attisdropped) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "Question_examFamily_idx" ON "Question"("examFamily")';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Question' AND a.attname = 'stemHash' AND NOT a.attisdropped) THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "Question_stemHash_idx" ON "Question"("stemHash")';
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Exam"') IS NOT NULL THEN
    ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "status" "ContentStatus";
    IF EXISTS (
      SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'Exam' AND a.attname = 'published' AND NOT a.attisdropped
    ) THEN
      UPDATE "Exam" SET "status" = 'PUBLISHED' WHERE "published" = true;
      UPDATE "Exam" SET "status" = 'DRAFT' WHERE "published" = false;
    END IF;
    UPDATE "Exam" SET "status" = 'DRAFT' WHERE "status" IS NULL;
    ALTER TABLE "Exam" ALTER COLUMN "status" SET NOT NULL;
    ALTER TABLE "Exam" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
    ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC';
    ALTER TABLE "Exam" DROP COLUMN IF EXISTS "published";
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Question"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "Question" ADD CONSTRAINT "Question_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Question"') IS NOT NULL AND to_regclass('public."Lesson"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Lesson"') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "Lesson_status_country_tier_idx" ON "Lesson"("status", "country", "tier")';
    EXECUTE 'CREATE INDEX IF NOT EXISTS "Lesson_categoryId_idx" ON "Lesson"("categoryId")';
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Exam"') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "Exam_status_country_tier_idx" ON "Exam"("status", "country", "tier")';
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."ExamAttempt"') IS NOT NULL THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "ExamAttempt_examId_idx" ON "ExamAttempt"("examId")';
    EXECUTE 'CREATE INDEX IF NOT EXISTS "ExamAttempt_userId_createdAt_idx" ON "ExamAttempt"("userId", "createdAt")';
  END IF;
END $$;

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
DO $$ BEGIN
  IF to_regclass('public."Flashcard"') IS NOT NULL THEN
    ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "lessonId" TEXT;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS "Flashcard_status_country_tier_idx" ON "Flashcard"("status", "country", "tier");
DO $$ BEGIN
  IF to_regclass('public."Flashcard"') IS NOT NULL AND EXISTS (
    SELECT 1 FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'Flashcard' AND a.attname = 'lessonId' AND NOT a.attisdropped
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "Flashcard_lessonId_idx" ON "Flashcard"("lessonId")';
  END IF;
END $$;
DO $$ BEGIN
  IF to_regclass('public."Flashcard"') IS NOT NULL AND to_regclass('public."Category"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;
DO $$ BEGIN
  IF to_regclass('public."Flashcard"') IS NOT NULL AND to_regclass('public."Lesson"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

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

-- CreateEnum
DO $$ BEGIN CREATE TYPE "DraftReviewStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PROMOTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "AiGenerationJob" (
    "id" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'COMPLETED',
    "model" TEXT,
    "sourcePrompt" TEXT NOT NULL,
    "inputPayload" JSONB NOT NULL,
    "resultSummary" JSONB,
    "error" TEXT,
    "tokensUsed" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiGenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AiGenerationLog" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "GeneratedQuestionDraft" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "tool" TEXT NOT NULL,
    "batchId" TEXT,
    "payloadJson" JSONB NOT NULL,
    "normalizedJson" JSONB,
    "validationJson" JSONB NOT NULL,
    "reviewStatus" "DraftReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "promotedEntityId" TEXT,
    "promotedAt" TIMESTAMP(3),
    "stemHash" TEXT,
    "stemPreview" TEXT,
    "lessonId" TEXT,
    "categoryId" TEXT,
    "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC',
    "tier" "TierCode" NOT NULL,
    "country" "CountryCode" NOT NULL,
    "sourcePrompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedQuestionDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "GeneratedFlashcardDraft" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "tool" TEXT NOT NULL,
    "batchId" TEXT,
    "payloadJson" JSONB NOT NULL,
    "normalizedJson" JSONB,
    "validationJson" JSONB NOT NULL,
    "reviewStatus" "DraftReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "promotedEntityId" TEXT,
    "promotedAt" TIMESTAMP(3),
    "frontPreview" TEXT,
    "lessonId" TEXT,
    "categoryId" TEXT,
    "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC',
    "tier" "TierCode" NOT NULL,
    "country" "CountryCode" NOT NULL,
    "sourcePrompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedFlashcardDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "GeneratedLessonDraft" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "tool" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "normalizedJson" JSONB,
    "validationJson" JSONB NOT NULL,
    "reviewStatus" "DraftReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "promotedEntityId" TEXT,
    "promotedAt" TIMESTAMP(3),
    "titlePreview" TEXT,
    "targetLessonId" TEXT,
    "sourcePrompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedLessonDraft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "AiGenerationJob" ADD CONSTRAINT "AiGenerationJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "AiGenerationLog" ADD CONSTRAINT "AiGenerationLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF to_regclass('public."Lesson"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Category"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF to_regclass('public."Lesson"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."Category"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF to_regclass('public."Lesson"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_targetLessonId_fkey" FOREIGN KEY ("targetLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AiGenerationJob_tool_createdAt_idx" ON "AiGenerationJob"("tool", "createdAt");

CREATE INDEX IF NOT EXISTS "AiGenerationJob_createdById_idx" ON "AiGenerationJob"("createdById");

CREATE INDEX IF NOT EXISTS "AiGenerationLog_jobId_idx" ON "AiGenerationLog"("jobId");

CREATE INDEX IF NOT EXISTS "GeneratedQuestionDraft_reviewStatus_createdAt_idx" ON "GeneratedQuestionDraft"("reviewStatus", "createdAt");

CREATE INDEX IF NOT EXISTS "GeneratedQuestionDraft_stemHash_idx" ON "GeneratedQuestionDraft"("stemHash");

CREATE INDEX IF NOT EXISTS "GeneratedQuestionDraft_jobId_idx" ON "GeneratedQuestionDraft"("jobId");

CREATE INDEX IF NOT EXISTS "GeneratedQuestionDraft_lessonId_idx" ON "GeneratedQuestionDraft"("lessonId");

CREATE INDEX IF NOT EXISTS "GeneratedFlashcardDraft_reviewStatus_createdAt_idx" ON "GeneratedFlashcardDraft"("reviewStatus", "createdAt");

CREATE INDEX IF NOT EXISTS "GeneratedFlashcardDraft_jobId_idx" ON "GeneratedFlashcardDraft"("jobId");

CREATE INDEX IF NOT EXISTS "GeneratedFlashcardDraft_lessonId_idx" ON "GeneratedFlashcardDraft"("lessonId");

CREATE INDEX IF NOT EXISTS "GeneratedLessonDraft_reviewStatus_createdAt_idx" ON "GeneratedLessonDraft"("reviewStatus", "createdAt");

CREATE INDEX IF NOT EXISTS "GeneratedLessonDraft_jobId_idx" ON "GeneratedLessonDraft"("jobId");

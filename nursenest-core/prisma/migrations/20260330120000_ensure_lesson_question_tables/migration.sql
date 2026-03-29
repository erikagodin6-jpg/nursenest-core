-- Repair DBs where core learner tables were never created.
-- Historical migrations only ALTER "Lesson"/"Question" and assumed an unpublished baseline migration.
-- Safe when tables already exist (IF NOT EXISTS). FK/index names match Prisma schema.

CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,
    "tier" "TierCode" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC',
    "difficulty" "DifficultyBand",
    "topicTag" TEXT,
    "systemTag" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceNotes" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT NOT NULL,
    "stem" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answerKey" JSONB NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "country" "CountryCode" NOT NULL,
    "tier" "TierCode" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC',
    "difficulty" "DifficultyBand",
    "topicTag" TEXT,
    "systemTag" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceNotes" TEXT,
    "generationBatchId" TEXT,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "duplicateOfId" TEXT,
    "stemHash" TEXT,
    "categoryId" TEXT NOT NULL,
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Lesson_slug_key" ON "Lesson"("slug");
CREATE INDEX IF NOT EXISTS "Lesson_status_country_tier_idx" ON "Lesson"("status", "country", "tier");
CREATE INDEX IF NOT EXISTS "Lesson_categoryId_idx" ON "Lesson"("categoryId");
CREATE INDEX IF NOT EXISTS "Question_status_country_tier_idx" ON "Question"("status", "country", "tier");
CREATE INDEX IF NOT EXISTS "Question_categoryId_idx" ON "Question"("categoryId");
CREATE INDEX IF NOT EXISTS "Question_lessonId_idx" ON "Question"("lessonId");
CREATE INDEX IF NOT EXISTS "Question_examFamily_idx" ON "Question"("examFamily");
CREATE INDEX IF NOT EXISTS "Question_stemHash_idx" ON "Question"("stemHash");

DO $$ BEGIN
  ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Question" ADD CONSTRAINT "Question_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

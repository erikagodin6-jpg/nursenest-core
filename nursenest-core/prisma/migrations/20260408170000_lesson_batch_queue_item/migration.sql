-- CreateEnum
DO $$ BEGIN CREATE TYPE "LessonBatchQueueItemStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED', 'SKIPPED_DUPLICATE', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "lesson_batch_queue_item" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "publicItemId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "normalizedTopic" TEXT NOT NULL,
    "batchTopicKey" VARCHAR(40) NOT NULL,
    "status" "LessonBatchQueueItemStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "lastAttemptAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "skippedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "claimedByRequestId" VARCHAR(128),
    "revivedAt" TIMESTAMP(3),
    "revivalCount" INTEGER NOT NULL DEFAULT 0,
    "generatedDraftId" TEXT,
    "existingDraftId" TEXT,
    "generatedDraftTitle" TEXT,

    CONSTRAINT "lesson_batch_queue_item_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "lesson_batch_queue_item_publicItemId_key" ON "lesson_batch_queue_item"("publicItemId");
CREATE INDEX IF NOT EXISTS "lesson_batch_queue_item_jobId_status_position_idx" ON "lesson_batch_queue_item"("jobId", "status", "position");
CREATE INDEX IF NOT EXISTS "lesson_batch_queue_item_jobId_position_idx" ON "lesson_batch_queue_item"("jobId", "position");
CREATE INDEX IF NOT EXISTS "lesson_batch_queue_item_batchTopicKey_idx" ON "lesson_batch_queue_item"("batchTopicKey");

DO $$ BEGIN
  ALTER TABLE "lesson_batch_queue_item" ADD CONSTRAINT "lesson_batch_queue_item_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "lesson_batch_queue_item" ADD CONSTRAINT "lesson_batch_queue_item_generatedDraftId_fkey" FOREIGN KEY ("generatedDraftId") REFERENCES "GeneratedLessonDraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AlterTable
ALTER TABLE "GeneratedLessonDraft" ADD COLUMN IF NOT EXISTS "lessonBatchTopicKey" VARCHAR(40);

CREATE INDEX IF NOT EXISTS "GeneratedLessonDraft_lessonBatchTopicKey_idx" ON "GeneratedLessonDraft"("lessonBatchTopicKey");

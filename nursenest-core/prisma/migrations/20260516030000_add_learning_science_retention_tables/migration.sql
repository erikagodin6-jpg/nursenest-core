-- Learning science persistence layer
-- Adds event-level and concept-level tables for adaptive retention, confidence calibration,
-- misconception repair, and review scheduling.

CREATE TABLE IF NOT EXISTS "LearningRetentionEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "conceptId" TEXT NOT NULL,
  "surface" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "responseTimeMs" INTEGER,
  "misconception" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LearningMemoryState" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "conceptId" TEXT NOT NULL,
  "memoryStrength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "confidenceCalibration" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "correctStreak" INTEGER NOT NULL DEFAULT 0,
  "incorrectStreak" INTEGER NOT NULL DEFAULT 0,
  "overconfidenceMisses" INTEGER NOT NULL DEFAULT 0,
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "recommendedAction" TEXT NOT NULL DEFAULT '',
  "lastReviewedAt" TIMESTAMP(3),
  "nextReviewAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearningMemoryState_userId_conceptId_key" UNIQUE ("userId", "conceptId")
);

CREATE TABLE IF NOT EXISTS "LearningMisconceptionEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "conceptId" TEXT NOT NULL,
  "misconception" TEXT NOT NULL,
  "failureType" TEXT,
  "severity" TEXT NOT NULL DEFAULT 'moderate',
  "surface" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LearningReviewQueueItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "conceptId" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "nextSurface" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "dueAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "LearningRetentionEvent_userId_createdAt_idx"
  ON "LearningRetentionEvent" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "LearningRetentionEvent_conceptId_createdAt_idx"
  ON "LearningRetentionEvent" ("conceptId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "LearningMemoryState_userId_nextReviewAt_idx"
  ON "LearningMemoryState" ("userId", "nextReviewAt");

CREATE INDEX IF NOT EXISTS "LearningMemoryState_userId_priority_idx"
  ON "LearningMemoryState" ("userId", "priority");

CREATE INDEX IF NOT EXISTS "LearningMisconceptionEvent_userId_createdAt_idx"
  ON "LearningMisconceptionEvent" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "LearningReviewQueueItem_userId_dueAt_idx"
  ON "LearningReviewQueueItem" ("userId", "dueAt");

CREATE INDEX IF NOT EXISTS "LearningReviewQueueItem_userId_completedAt_idx"
  ON "LearningReviewQueueItem" ("userId", "completedAt");

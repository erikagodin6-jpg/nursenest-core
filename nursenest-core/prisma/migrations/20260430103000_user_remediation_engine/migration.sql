-- Remediation engine (feature-flagged at runtime via NN_ENABLE_REMEDIATION_ENGINE)

CREATE TYPE "RemediationMistakeType" AS ENUM (
  'knowledge_gap',
  'prioritization',
  'pharmacology',
  'safety',
  'delegation',
  'misread_question'
);

CREATE TYPE "RemediationQueueSource" AS ENUM (
  'question',
  'lesson',
  'flashcard'
);

CREATE TABLE "UserRemediationEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "questionId" VARCHAR(64) NOT NULL,
  "pathwayId" VARCHAR(64),
  "topic" VARCHAR(200),
  "bodySystem" VARCHAR(128),
  "examMeta" JSONB,
  "mistakeType" "RemediationMistakeType" NOT NULL,
  "confidence" VARCHAR(16),
  "catDifficultyHint" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserRemediationEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UserRemediationEvent_userId_createdAt_idx" ON "UserRemediationEvent" ("userId", "createdAt");
CREATE INDEX "UserRemediationEvent_userId_topic_idx" ON "UserRemediationEvent" ("userId", "topic");

CREATE TABLE "UserRemediationQueue" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "pathwayId" VARCHAR(64),
  "topic" VARCHAR(200),
  "bodySystem" VARCHAR(128),
  "pathwayKey" VARCHAR(64) NOT NULL DEFAULT '',
  "topicKey" VARCHAR(200) NOT NULL DEFAULT '',
  "bodySystemKey" VARCHAR(128) NOT NULL DEFAULT '',
  "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "nextReviewAt" TIMESTAMP(3) NOT NULL,
  "source" "RemediationQueueSource" NOT NULL DEFAULT 'question',
  "resolved" BOOLEAN NOT NULL DEFAULT false,
  "resolvedAt" TIMESTAMP(3),
  "mistakeCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserRemediationQueue_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserRemediationQueue_user_slot_key" ON "UserRemediationQueue" ("userId", "pathwayKey", "topicKey", "bodySystemKey");

CREATE INDEX "UserRemediationQueue_user_resolved_review_idx" ON "UserRemediationQueue" ("userId", "resolved", "nextReviewAt");
CREATE INDEX "UserRemediationQueue_user_resolved_priority_idx" ON "UserRemediationQueue" ("userId", "resolved", "priorityScore");

ALTER TABLE "UserRemediationEvent" ADD CONSTRAINT "UserRemediationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserRemediationQueue" ADD CONSTRAINT "UserRemediationQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "BaselineAssessmentAttemptStatus" AS ENUM ('OPEN', 'SUBMITTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "baselineAssessmentSkippedAt" TIMESTAMP(3),
ADD COLUMN "baselineAssessmentCompletedAt" TIMESTAMP(3),
ADD COLUMN "baselineAssessmentSummary" JSONB;

-- CreateTable
CREATE TABLE "BaselineAssessmentAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionIds" JSONB NOT NULL,
    "status" "BaselineAssessmentAttemptStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "BaselineAssessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BaselineAssessmentAttempt_userId_status_idx" ON "BaselineAssessmentAttempt"("userId", "status");

-- CreateIndex
CREATE INDEX "BaselineAssessmentAttempt_createdAt_idx" ON "BaselineAssessmentAttempt"("createdAt");

-- AddForeignKey
ALTER TABLE "BaselineAssessmentAttempt" ADD CONSTRAINT "BaselineAssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Existing users: do not show baseline prompt (treat as skipped at account creation)
UPDATE "User"
SET "baselineAssessmentSkippedAt" = "createdAt"
WHERE "baselineAssessmentSkippedAt" IS NULL
  AND "baselineAssessmentCompletedAt" IS NULL;

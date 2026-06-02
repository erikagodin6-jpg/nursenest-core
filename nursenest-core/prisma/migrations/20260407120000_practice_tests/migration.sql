-- Custom practice test bank (saved sessions + tier-scoped question pools).

CREATE TYPE "PracticeTestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

CREATE TABLE "practice_tests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "config" JSONB NOT NULL,
    "questionIds" JSONB NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "cursorIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "PracticeTestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "timedMode" BOOLEAN NOT NULL DEFAULT false,
    "timeLimitSec" INTEGER,
    "elapsedMs" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "results" JSONB,
    "adaptiveState" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_tests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "practice_tests_userId_status_updatedAt_idx" ON "practice_tests"("userId", "status", "updatedAt");

ALTER TABLE "practice_tests" ADD CONSTRAINT "practice_tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

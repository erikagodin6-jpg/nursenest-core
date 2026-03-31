DO $$ BEGIN CREATE TYPE "ExamSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "ExamSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT,
    "questionIds" JSONB NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ExamSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "attemptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ExamSession_attemptId_key" ON "ExamSession"("attemptId");

CREATE INDEX IF NOT EXISTS "ExamSession_userId_status_idx" ON "ExamSession"("userId", "status");

CREATE INDEX IF NOT EXISTS "ExamSession_examId_idx" ON "ExamSession"("examId");

DO $$ BEGIN
  ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF to_regclass('public."Exam"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public."ExamAttempt"') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

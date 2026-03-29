CREATE TYPE "ExamSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

CREATE TABLE "ExamSession" (
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

CREATE UNIQUE INDEX "ExamSession_attemptId_key" ON "ExamSession"("attemptId");

CREATE INDEX "ExamSession_userId_status_idx" ON "ExamSession"("userId", "status");

CREATE INDEX "ExamSession_examId_idx" ON "ExamSession"("examId");

ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "DraftReviewStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PROMOTED');

-- CreateTable
CREATE TABLE "AiGenerationJob" (
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
CREATE TABLE "AiGenerationLog" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedQuestionDraft" (
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
CREATE TABLE "GeneratedFlashcardDraft" (
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
CREATE TABLE "GeneratedLessonDraft" (
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
ALTER TABLE "AiGenerationJob" ADD CONSTRAINT "AiGenerationJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGenerationLog" ADD CONSTRAINT "AiGenerationLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedQuestionDraft" ADD CONSTRAINT "GeneratedQuestionDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFlashcardDraft" ADD CONSTRAINT "GeneratedFlashcardDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiGenerationJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_targetLessonId_fkey" FOREIGN KEY ("targetLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedLessonDraft" ADD CONSTRAINT "GeneratedLessonDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "AiGenerationJob_tool_createdAt_idx" ON "AiGenerationJob"("tool", "createdAt");

-- CreateIndex
CREATE INDEX "AiGenerationJob_createdById_idx" ON "AiGenerationJob"("createdById");

-- CreateIndex
CREATE INDEX "AiGenerationLog_jobId_idx" ON "AiGenerationLog"("jobId");

-- CreateIndex
CREATE INDEX "GeneratedQuestionDraft_reviewStatus_createdAt_idx" ON "GeneratedQuestionDraft"("reviewStatus", "createdAt");

-- CreateIndex
CREATE INDEX "GeneratedQuestionDraft_stemHash_idx" ON "GeneratedQuestionDraft"("stemHash");

-- CreateIndex
CREATE INDEX "GeneratedQuestionDraft_jobId_idx" ON "GeneratedQuestionDraft"("jobId");

-- CreateIndex
CREATE INDEX "GeneratedQuestionDraft_lessonId_idx" ON "GeneratedQuestionDraft"("lessonId");

-- CreateIndex
CREATE INDEX "GeneratedFlashcardDraft_reviewStatus_createdAt_idx" ON "GeneratedFlashcardDraft"("reviewStatus", "createdAt");

-- CreateIndex
CREATE INDEX "GeneratedFlashcardDraft_jobId_idx" ON "GeneratedFlashcardDraft"("jobId");

-- CreateIndex
CREATE INDEX "GeneratedFlashcardDraft_lessonId_idx" ON "GeneratedFlashcardDraft"("lessonId");

-- CreateIndex
CREATE INDEX "GeneratedLessonDraft_reviewStatus_createdAt_idx" ON "GeneratedLessonDraft"("reviewStatus", "createdAt");

-- CreateIndex
CREATE INDEX "GeneratedLessonDraft_jobId_idx" ON "GeneratedLessonDraft"("jobId");

-- Depends on BlogPostTemplate, BlogPostIntent, BlogFunnelStage from 20260412120000; originally mis-ordered as 20260408210000.
-- CreateEnum
CREATE TYPE "BlogDraftGenerationBatchStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BlogDraftGenerationBatchItemStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "BlogDraftGenerationBatch" (
    "id" TEXT NOT NULL,
    "status" "BlogDraftGenerationBatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "exam" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'unspecified',
    "defaultTemplate" "BlogPostTemplate" NOT NULL DEFAULT 'TOPIC_EXPLAINED',
    "defaultIntent" "BlogPostIntent",
    "funnelStage" "BlogFunnelStage",
    "tone" VARCHAR(32) NOT NULL DEFAULT 'professional',
    "keywords" TEXT,
    "keywordCluster" TEXT,
    "countryTarget" "CountryCode",
    "includeImage" BOOLEAN NOT NULL DEFAULT true,
    "includeAiImage" BOOLEAN NOT NULL DEFAULT false,
    "allowDuplicateCanonicalTopic" BOOLEAN NOT NULL DEFAULT false,
    "totalItems" INTEGER NOT NULL,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogDraftGenerationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogDraftGenerationBatchItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "topicRaw" TEXT NOT NULL,
    "canonicalTopicKey" TEXT,
    "status" "BlogDraftGenerationBatchItemStatus" NOT NULL DEFAULT 'PENDING',
    "blogPostId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogDraftGenerationBatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogDraftGenerationBatch_status_createdAt_idx" ON "BlogDraftGenerationBatch"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogDraftGenerationBatchItem_batchId_ordinal_key" ON "BlogDraftGenerationBatchItem"("batchId", "ordinal");

-- CreateIndex
CREATE INDEX "BlogDraftGenerationBatchItem_batchId_status_ordinal_idx" ON "BlogDraftGenerationBatchItem"("batchId", "status", "ordinal");

-- AddForeignKey
ALTER TABLE "BlogDraftGenerationBatch" ADD CONSTRAINT "BlogDraftGenerationBatch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogDraftGenerationBatchItem" ADD CONSTRAINT "BlogDraftGenerationBatchItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BlogDraftGenerationBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogDraftGenerationBatchItem" ADD CONSTRAINT "BlogDraftGenerationBatchItem_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

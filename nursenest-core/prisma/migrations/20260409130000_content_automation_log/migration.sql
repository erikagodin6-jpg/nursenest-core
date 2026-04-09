-- CreateEnum
CREATE TYPE "ContentAutomationLogCategory" AS ENUM (
  'BLOG_AI_SIMPLE',
  'BLOG_AI_BATCH_ITEM',
  'BLOG_CONTROL_PANEL_PIPELINE',
  'BLOG_CONTROL_PANEL_PERSIST',
  'BLOG_PUBLISH',
  'BLOG_PUBLISH_BLOCKED',
  'BLOG_MARK_FAILED',
  'BLOG_REFERENCE_GATE',
  'BLOG_INTERNAL_LINK_CHECK'
);

-- CreateEnum
CREATE TYPE "ContentAutomationLogStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'SKIPPED', 'WARNING');

-- CreateTable
CREATE TABLE "ContentAutomationLog" (
    "id" TEXT NOT NULL,
    "category" "ContentAutomationLogCategory" NOT NULL,
    "jobType" VARCHAR(96) NOT NULL,
    "status" "ContentAutomationLogStatus" NOT NULL,
    "topic" TEXT,
    "summary" VARCHAR(480),
    "error" TEXT,
    "metadata" JSONB,
    "blogPostId" TEXT,
    "correlationId" VARCHAR(64),
    "sourceItemId" VARCHAR(64),
    "retryOfId" VARCHAR(64),
    "completedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAutomationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentAutomationLog_category_status_createdAt_idx" ON "ContentAutomationLog"("category", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ContentAutomationLog_createdAt_idx" ON "ContentAutomationLog"("createdAt");

-- CreateIndex
CREATE INDEX "ContentAutomationLog_blogPostId_idx" ON "ContentAutomationLog"("blogPostId");

-- CreateIndex
CREATE INDEX "ContentAutomationLog_correlationId_idx" ON "ContentAutomationLog"("correlationId");

-- AddForeignKey
ALTER TABLE "ContentAutomationLog" ADD CONSTRAINT "ContentAutomationLog_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAutomationLog" ADD CONSTRAINT "ContentAutomationLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

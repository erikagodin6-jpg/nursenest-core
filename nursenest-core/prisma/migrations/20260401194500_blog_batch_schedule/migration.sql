-- CreateEnum
CREATE TYPE "BlogBatchScheduleStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BlogBatchScheduleItemStatus" AS ENUM ('PENDING', 'GENERATING', 'PUBLISHED', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "BlogBatchSchedule" (
    "id" TEXT NOT NULL,
    "status" "BlogBatchScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "cadencePerDay" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "nextRunAt" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),
    "totalItems" INTEGER NOT NULL,
    "publishedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "exam" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'unspecified',
    "defaultTemplate" "BlogPostTemplate" NOT NULL DEFAULT 'TOPIC_EXPLAINED',
    "defaultIntent" "BlogPostIntent",
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogBatchSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogBatchScheduleItem" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "topicRaw" TEXT NOT NULL,
    "canonicalTopicKey" TEXT,
    "plannedPublishAt" TIMESTAMP(3) NOT NULL,
    "status" "BlogBatchScheduleItemStatus" NOT NULL DEFAULT 'PENDING',
    "blogPostId" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogBatchScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogBatchSchedule_status_nextRunAt_idx" ON "BlogBatchSchedule"("status", "nextRunAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogBatchScheduleItem_scheduleId_ordinal_key" ON "BlogBatchScheduleItem"("scheduleId", "ordinal");

-- CreateIndex
CREATE INDEX "BlogBatchScheduleItem_scheduleId_status_plannedPublishAt_idx" ON "BlogBatchScheduleItem"("scheduleId", "status", "plannedPublishAt");

-- CreateIndex
CREATE INDEX "BlogBatchScheduleItem_plannedPublishAt_status_idx" ON "BlogBatchScheduleItem"("plannedPublishAt", "status");

-- AddForeignKey
ALTER TABLE "BlogBatchSchedule" ADD CONSTRAINT "BlogBatchSchedule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogBatchScheduleItem" ADD CONSTRAINT "BlogBatchScheduleItem_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "BlogBatchSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogBatchScheduleItem" ADD CONSTRAINT "BlogBatchScheduleItem_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

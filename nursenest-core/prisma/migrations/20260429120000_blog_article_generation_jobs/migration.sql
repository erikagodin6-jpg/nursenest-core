-- CreateTable
CREATE TABLE "blog_article_generation_jobs" (
    "id" TEXT NOT NULL,
    "createdById" TEXT,
    "stage" VARCHAR(40) NOT NULL DEFAULT 'queued',
    "requestPayload" JSONB NOT NULL,
    "planSnapshot" JSONB,
    "bodyHtmlSnapshot" TEXT,
    "blogPostId" TEXT,
    "lastError" TEXT,
    "failureCode" VARCHAR(64),
    "repairable" BOOLEAN NOT NULL DEFAULT false,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "resultWarnings" JSONB,
    "resultSlug" VARCHAR(200),
    "resultTitle" VARCHAR(300),
    "resultPostStatus" VARCHAR(32),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_article_generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blog_article_generation_jobs_stage_createdAt_idx" ON "blog_article_generation_jobs"("stage", "createdAt");

-- AddForeignKey
ALTER TABLE "blog_article_generation_jobs" ADD CONSTRAINT "blog_article_generation_jobs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_article_generation_jobs" ADD CONSTRAINT "blog_article_generation_jobs_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

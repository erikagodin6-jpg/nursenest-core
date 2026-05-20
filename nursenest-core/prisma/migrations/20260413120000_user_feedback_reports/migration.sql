-- User-facing bug reports and product feedback (admin triage; optional user link).

CREATE TYPE "UserFeedbackCategory" AS ENUM (
  'BUG',
  'BROKEN_CONTENT',
  'CONFUSING_QUESTION',
  'LESSON_ISSUE',
  'BILLING_SUBSCRIPTION',
  'PERFORMANCE',
  'FEATURE_REQUEST',
  'GENERAL'
);

CREATE TYPE "UserFeedbackSeverity" AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

CREATE TYPE "UserFeedbackStatus" AS ENUM (
  'NEW',
  'UNDER_REVIEW',
  'FIXED',
  'DISMISSED'
);

CREATE TABLE "UserFeedbackReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "UserFeedbackStatus" NOT NULL DEFAULT 'NEW',
    "category" "UserFeedbackCategory" NOT NULL,
    "severity" "UserFeedbackSeverity" NOT NULL DEFAULT 'MEDIUM',
    "summary" VARCHAR(500) NOT NULL,
    "details" TEXT,
    "pageUrl" VARCHAR(2048) NOT NULL,
    "routeKey" VARCHAR(512),
    "userId" TEXT,
    "pathwayId" VARCHAR(64),
    "examContextJson" JSONB,
    "userAgent" VARCHAR(512),
    "deviceHint" VARCHAR(120),
    "screenshotDataUrl" TEXT,
    "clientMetaJson" JSONB,

    CONSTRAINT "UserFeedbackReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UserFeedbackReport_status_createdAt_idx" ON "UserFeedbackReport"("status", "createdAt");
CREATE INDEX "UserFeedbackReport_category_createdAt_idx" ON "UserFeedbackReport"("category", "createdAt");
CREATE INDEX "UserFeedbackReport_severity_createdAt_idx" ON "UserFeedbackReport"("severity", "createdAt");
CREATE INDEX "UserFeedbackReport_userId_createdAt_idx" ON "UserFeedbackReport"("userId", "createdAt");
CREATE INDEX "UserFeedbackReport_routeKey_idx" ON "UserFeedbackReport"("routeKey");

ALTER TABLE "UserFeedbackReport" ADD CONSTRAINT "UserFeedbackReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

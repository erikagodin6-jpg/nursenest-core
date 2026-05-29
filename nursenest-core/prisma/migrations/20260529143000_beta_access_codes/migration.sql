CREATE TYPE "BetaFeatureKey" AS ENUM (
  'FLASHCARDS_V2',
  'CLINICAL_SKILLS_EXPANSION',
  'PHARMACOLOGY_EXPANSION',
  'FRIEND_CODE_SYSTEM',
  'ADVANCED_ANALYTICS',
  'ECG_ENHANCEMENTS',
  'CNPLE_SIMULATION_UPDATES'
);

CREATE TYPE "BetaFeedbackKind" AS ENUM (
  'BUG',
  'SUGGESTION',
  'QUALITY_RATING',
  'GENERAL'
);

CREATE TABLE "beta_access_codes" (
  "id" TEXT NOT NULL,
  "codeHash" VARCHAR(128) NOT NULL,
  "displayCode" VARCHAR(80) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "description" VARCHAR(800),
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "features" "BetaFeatureKey"[] NOT NULL DEFAULT ARRAY[]::"BetaFeatureKey"[],
  "maxRedemptions" INTEGER,
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "beta_access_codes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "beta_access_grants" (
  "id" TEXT NOT NULL,
  "codeId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "features" "BetaFeatureKey"[] NOT NULL DEFAULT ARRAY[]::"BetaFeatureKey"[],
  "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  "revokedByUserId" TEXT,
  "revokeReason" VARCHAR(500),
  CONSTRAINT "beta_access_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "beta_feedback_reports" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "feature" "BetaFeatureKey" NOT NULL,
  "kind" "BetaFeedbackKind" NOT NULL DEFAULT 'GENERAL',
  "rating" INTEGER,
  "summary" VARCHAR(500) NOT NULL,
  "details" TEXT,
  "pageUrl" VARCHAR(2048),
  "browser" VARCHAR(512),
  "screenshotDataUrl" TEXT,
  "status" "UserFeedbackStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "beta_feedback_reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "beta_activity_events" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "feature" "BetaFeatureKey",
  "eventType" VARCHAR(80) NOT NULL,
  "pageUrl" VARCHAR(2048),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "beta_activity_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "beta_invitation_email_logs" (
  "id" TEXT NOT NULL,
  "codeId" TEXT NOT NULL,
  "targetEmail" VARCHAR(320) NOT NULL,
  "sentByUserId" TEXT,
  "status" VARCHAR(40) NOT NULL DEFAULT 'PENDING',
  "failureReason" VARCHAR(500),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "beta_invitation_email_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "beta_access_codes_codeHash_key" ON "beta_access_codes"("codeHash");
CREATE UNIQUE INDEX "beta_access_codes_displayCode_key" ON "beta_access_codes"("displayCode");
CREATE INDEX "beta_access_codes_enabled_expiresAt_idx" ON "beta_access_codes"("enabled", "expiresAt");
CREATE INDEX "beta_access_codes_createdAt_idx" ON "beta_access_codes"("createdAt");

CREATE UNIQUE INDEX "beta_access_grants_codeId_userId_key" ON "beta_access_grants"("codeId", "userId");
CREATE INDEX "beta_access_grants_userId_revokedAt_idx" ON "beta_access_grants"("userId", "revokedAt");
CREATE INDEX "beta_access_grants_codeId_redeemedAt_idx" ON "beta_access_grants"("codeId", "redeemedAt");

CREATE INDEX "beta_feedback_reports_feature_createdAt_idx" ON "beta_feedback_reports"("feature", "createdAt");
CREATE INDEX "beta_feedback_reports_userId_createdAt_idx" ON "beta_feedback_reports"("userId", "createdAt");
CREATE INDEX "beta_feedback_reports_status_createdAt_idx" ON "beta_feedback_reports"("status", "createdAt");

CREATE INDEX "beta_activity_events_userId_createdAt_idx" ON "beta_activity_events"("userId", "createdAt");
CREATE INDEX "beta_activity_events_feature_eventType_createdAt_idx" ON "beta_activity_events"("feature", "eventType", "createdAt");
CREATE INDEX "beta_activity_events_eventType_createdAt_idx" ON "beta_activity_events"("eventType", "createdAt");

CREATE INDEX "beta_invitation_email_logs_codeId_createdAt_idx" ON "beta_invitation_email_logs"("codeId", "createdAt");
CREATE INDEX "beta_invitation_email_logs_targetEmail_createdAt_idx" ON "beta_invitation_email_logs"("targetEmail", "createdAt");

ALTER TABLE "beta_access_codes"
  ADD CONSTRAINT "beta_access_codes_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "beta_access_grants"
  ADD CONSTRAINT "beta_access_grants_codeId_fkey"
  FOREIGN KEY ("codeId") REFERENCES "beta_access_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "beta_access_grants"
  ADD CONSTRAINT "beta_access_grants_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "beta_access_grants"
  ADD CONSTRAINT "beta_access_grants_revokedByUserId_fkey"
  FOREIGN KEY ("revokedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "beta_feedback_reports"
  ADD CONSTRAINT "beta_feedback_reports_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "beta_activity_events"
  ADD CONSTRAINT "beta_activity_events_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "beta_invitation_email_logs"
  ADD CONSTRAINT "beta_invitation_email_logs_codeId_fkey"
  FOREIGN KEY ("codeId") REFERENCES "beta_access_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "beta_invitation_email_logs"
  ADD CONSTRAINT "beta_invitation_email_logs_sentByUserId_fkey"
  FOREIGN KEY ("sentByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

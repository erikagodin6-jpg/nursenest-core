-- Aggregated premium protection / API abuse telemetry (UTC day rollups; no note bodies).
CREATE TABLE "premium_protection_rollups" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "metric_key" VARCHAR(96) NOT NULL,
    "segment" VARCHAR(96) NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "premium_protection_rollups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "premium_protection_rollups_day_metric_key_segment_key" ON "premium_protection_rollups"("day", "metric_key", "segment");
CREATE INDEX "premium_protection_rollups_day_idx" ON "premium_protection_rollups"("day");

CREATE TABLE "premium_protection_user_days" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "metric_key" VARCHAR(96) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "premium_protection_user_days_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "premium_protection_user_days_userId_day_metric_key_key" ON "premium_protection_user_days"("userId", "day", "metric_key");
CREATE INDEX "premium_protection_user_days_day_idx" ON "premium_protection_user_days"("day");
CREATE INDEX "premium_protection_user_days_userId_day_idx" ON "premium_protection_user_days"("userId", "day");

ALTER TABLE "premium_protection_user_days" ADD CONSTRAINT "premium_protection_user_days_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "protection_abuse_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" VARCHAR(80) NOT NULL,
    "score" INTEGER NOT NULL,
    "evidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissedAt" TIMESTAMP(3),

    CONSTRAINT "protection_abuse_reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "protection_abuse_reviews_dismissedAt_createdAt_idx" ON "protection_abuse_reviews"("dismissedAt", "createdAt");
CREATE INDEX "protection_abuse_reviews_userId_createdAt_idx" ON "protection_abuse_reviews"("userId", "createdAt");

ALTER TABLE "protection_abuse_reviews" ADD CONSTRAINT "protection_abuse_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

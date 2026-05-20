-- Blog batch: publish mode + optional localization JSON (admin-only batch workflow).
CREATE TYPE "BlogBatchPublishMode" AS ENUM ('STAGGERED_PUBLISH', 'DRAFT_ONLY', 'PUBLISH_IMMEDIATE', 'CUSTOM_DATES');

ALTER TABLE "BlogBatchSchedule" ADD COLUMN "publishMode" "BlogBatchPublishMode" NOT NULL DEFAULT 'STAGGERED_PUBLISH';
ALTER TABLE "BlogBatchSchedule" ADD COLUMN "localizationOptions" JSONB;

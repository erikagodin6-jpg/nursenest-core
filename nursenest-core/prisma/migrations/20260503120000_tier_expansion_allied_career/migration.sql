-- Add PRE_NURSING and NEW_GRAD to TierCode enum
ALTER TYPE "TierCode" ADD VALUE IF NOT EXISTS 'PRE_NURSING';
ALTER TYPE "TierCode" ADD VALUE IF NOT EXISTS 'NEW_GRAD';

-- Add alliedCareer to Subscription for career-specific allied entitlements
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "alliedCareer" VARCHAR(64);

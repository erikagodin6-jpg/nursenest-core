-- Persist checkout plan identity + optional global billing region on Subscription (user subscription row).
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "planCode" VARCHAR(96);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "billingRegionSlug" VARCHAR(32);

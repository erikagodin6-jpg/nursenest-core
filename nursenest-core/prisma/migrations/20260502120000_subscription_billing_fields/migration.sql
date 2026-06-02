-- Add billing lifecycle fields to Subscription for local display without Stripe API calls.
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "planDuration" VARCHAR(20);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "trialEnd" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;

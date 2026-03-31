-- AlterTable
DO $$ BEGIN ALTER TABLE "Subscription" ADD COLUMN "planTier" "TierCode"; EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Subscription" ADD COLUMN "planCountry" "CountryCode"; EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

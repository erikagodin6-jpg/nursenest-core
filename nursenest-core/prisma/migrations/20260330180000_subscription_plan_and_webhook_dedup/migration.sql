-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "planTier" "TierCode",
ADD COLUMN     "planCountry" "CountryCode";

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

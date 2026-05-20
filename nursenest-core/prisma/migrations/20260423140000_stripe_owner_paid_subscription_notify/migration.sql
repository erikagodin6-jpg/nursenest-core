-- Dedupe internal owner notifications for paid checkout subscription webhooks (one row per Stripe event id).
CREATE TABLE "StripeOwnerPaidSubscriptionNotify" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StripeOwnerPaidSubscriptionNotify_pkey" PRIMARY KEY ("id")
);

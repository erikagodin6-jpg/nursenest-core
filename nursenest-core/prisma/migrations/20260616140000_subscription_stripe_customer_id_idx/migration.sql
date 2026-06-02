-- Support lookups by Stripe customer id (billing portal, support, reconciliation).
CREATE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");

import type Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";
import type { BillingSubscriptionRow } from "@/lib/learner/billing-page-payload-types";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import {
  firstSubscriptionPriceId,
  mapStripeSubscriptionStatus,
} from "@/lib/stripe/stripe-subscription-field-map";

/**
 * When Postgres is stale but Stripe has a controlling subscription, billing UI should reflect Stripe
 * for status / cancel-at-end / ids (entitlements still follow DB until persist succeeds).
 * Pure helper — safe for unit tests; never runs Stripe API calls.
 */
export function mergeBillingSubscriptionRowWithStripe(
  row: BillingSubscriptionRow,
  sub: Stripe.Subscription,
): BillingSubscriptionRow {
  const mapped = mapStripeSubscriptionStatus(sub.status);
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
  return {
    ...row,
    status: mapped ?? row.status,
    cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
    stripeCustomerId: customerId?.trim() || row.stripeCustomerId,
    stripeSubscriptionId: sub.id?.trim() || row.stripeSubscriptionId,
  };
}

/** Stripe-only row for billing chrome when DB has no row but Stripe lists an active subscription. */
export function billingSubscriptionRowFromStripeSubscription(sub: Stripe.Subscription): BillingSubscriptionRow | null {
  const mapped = mapStripeSubscriptionStatus(sub.status);
  if (!mapped || mapped === SubscriptionStatus.CANCELLED) return null;
  const priceId = firstSubscriptionPriceId(sub);
  const mappedPlan = priceId ? findTierCountryByPriceId(priceId) : undefined;
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
  const createdSec = (sub as unknown as { created?: number }).created;
  const createdAt =
    typeof createdSec === "number" && createdSec > 0 ? new Date(createdSec * 1000) : new Date();
  return {
    status: mapped,
    stripeSubscriptionId: sub.id,
    stripeCustomerId: customerId?.trim() ?? null,
    planTier: mappedPlan?.tier ?? null,
    planCountry: mappedPlan?.country ?? null,
    alliedCareer: mappedPlan?.alliedCareer ?? null,
    cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
    createdAt,
    updatedAt: new Date(),
  };
}

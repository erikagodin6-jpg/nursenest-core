import type Stripe from "stripe";
import { SubscriptionStatus, type TierCode } from "@prisma/client";
import { isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";

export type OwnerCheckoutNotifyEligibilityInput = {
  sessionMode: Stripe.Checkout.Session.Mode | null | undefined;
  amountTotal: number | null;
  statusForDb: SubscriptionStatus;
  stripeSubStatus: Stripe.Subscription.Status | null;
  stripeSubscription: Stripe.Subscription | null;
  eventLivemode: boolean;
  /** When known from checkout metadata; free Stripe-billing tiers never trigger owner paid alerts. */
  planTier: TierCode | null | undefined;
};

function includeTestModeOwnerNotifies(): boolean {
  const v = process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Exported for unit tests — Stripe `trialing` is not a paid activation for owner alerts. */
export function shouldOwnerNotifyPaidSubscriptionCheckout(input: OwnerCheckoutNotifyEligibilityInput): boolean {
  if (input.sessionMode !== "subscription") return false;
  if (!input.stripeSubscription || input.stripeSubStatus !== "active") return false;
  if (input.statusForDb !== SubscriptionStatus.ACTIVE) return false;
  if (input.amountTotal == null || input.amountTotal <= 0) return false;
  if (input.planTier != null && isFreeStripeBillingNursingTier(input.planTier)) return false;
  if (!input.eventLivemode && !includeTestModeOwnerNotifies()) return false;
  return true;
}

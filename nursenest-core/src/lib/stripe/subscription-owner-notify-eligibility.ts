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

/**
 * Owner alerts after checkout: Stripe `trialing` maps to ACTIVE in our DB but often has
 * `amount_total === 0` (trial start). Previously we required `active` + positive amount only,
 * which skipped every trial checkout and left only `invoice.payment_succeeded` — which also
 * required `amount_paid > 0`, so **no notification** went out for common trial-first flows.
 */
export function shouldOwnerNotifyPaidSubscriptionCheckout(input: OwnerCheckoutNotifyEligibilityInput): boolean {
  if (input.sessionMode !== "subscription") return false;
  if (!input.stripeSubscription) return false;
  if (input.stripeSubStatus !== "active" && input.stripeSubStatus !== "trialing") return false;
  if (input.statusForDb !== SubscriptionStatus.ACTIVE) return false;
  if (input.planTier != null && isFreeStripeBillingNursingTier(input.planTier)) return false;
  if (!input.eventLivemode && !includeTestModeOwnerNotifies()) return false;

  const hasPositiveCheckoutTotal = input.amountTotal != null && input.amountTotal > 0;
  const trialingZeroOrUnsetTotal =
    input.stripeSubStatus === "trialing" && (input.amountTotal == null || input.amountTotal === 0);
  if (!hasPositiveCheckoutTotal && !trialingZeroOrUnsetTotal) return false;
  if (input.stripeSubStatus === "active" && !hasPositiveCheckoutTotal) return false;

  return true;
}

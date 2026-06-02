import type Stripe from "stripe";

const CONTROLLING_STATUS_PRIORITY: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
  "past_due",
  "unpaid",
];

/** Stripe states that allow end-of-period cancellation from our app. */
export function canUserCancelStripeSubscription(sub: Stripe.Subscription): boolean {
  if (sub.cancel_at_period_end) return false;
  return (
    sub.status === "active" ||
    sub.status === "trialing" ||
    sub.status === "past_due" ||
    sub.status === "unpaid"
  );
}

/** Stripe states that allow a scheduled end-of-period cancellation to be reversed. */
export function canUserReactivateStripeSubscription(sub: Stripe.Subscription): boolean {
  if (!sub.cancel_at_period_end) return false;
  return (
    sub.status === "active" ||
    sub.status === "trialing" ||
    sub.status === "past_due" ||
    sub.status === "unpaid"
  );
}

/**
 * Prefer the subscription the learner can still manage, in Stripe's business priority order.
 */
export function pickControllingStripeSubscription(subs: Stripe.Subscription[]): Stripe.Subscription | null {
  if (!subs.length) return null;
  for (const st of CONTROLLING_STATUS_PRIORITY) {
    const match = subs.find((s) => s.status === st);
    if (match) return match;
  }
  return null;
}

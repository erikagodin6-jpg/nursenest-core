import { SubscriptionStatus } from "@prisma/client";

/**
 * Stable clock for past-due grace (see {@link pastDueSubscriptionGrantsPremium}).
 * Call when applying a subscription status change from Stripe webhook or reconciliation.
 */
export function pastDueSinceForStatusTransition(
  nextStatus: SubscriptionStatus,
  previousStatus: SubscriptionStatus | null | undefined,
): { pastDueSince: Date | null } | undefined {
  const prev = previousStatus ?? null;
  if (nextStatus === SubscriptionStatus.PAST_DUE && prev !== SubscriptionStatus.PAST_DUE) {
    return { pastDueSince: new Date() };
  }
  if (nextStatus !== SubscriptionStatus.PAST_DUE && prev === SubscriptionStatus.PAST_DUE) {
    return { pastDueSince: null };
  }
  return undefined;
}

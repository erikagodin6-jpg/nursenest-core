import { SubscriptionStatus } from "@prisma/client";

/** Stripe/DB anchors used to decide paid-through vs expired. */
export type SubscriptionPaidAccessAnchors = {
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
};

/**
 * Latest instant where paid or trial access may end (max of period end and trial end).
 * Returns null when neither anchor is set.
 */
/** Prefer the later paid-through instant when Stripe and DB disagree (e.g. `customer.subscription.deleted`). */
export function mergeSubscriptionCurrentPeriodEnds(
  a: Date | null | undefined,
  b: Date | null | undefined,
): Date | null {
  const cands = [a, b].filter((d): d is Date => d instanceof Date && !Number.isNaN(d.getTime()));
  if (cands.length === 0) return null;
  return new Date(Math.max(...cands.map((d) => d.getTime())));
}

export function subscriptionEntitlementEndMs(row: {
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
}): number | null {
  const ms: number[] = [];
  if (row.currentPeriodEnd) ms.push(row.currentPeriodEnd.getTime());
  if (row.trialEnd) ms.push(row.trialEnd.getTime());
  if (ms.length === 0) return null;
  return Math.max(...ms);
}

/**
 * ACTIVE / GRACE: allow access when no end timestamps yet (sync gap) or when any end is still in the future.
 */
export function activeLikePaidWindowOpen(row: { currentPeriodEnd: Date | null; trialEnd: Date | null }, nowMs: number): boolean {
  const end = subscriptionEntitlementEndMs(row);
  if (end === null) return true;
  return end > nowMs;
}

/** CANCELLED: paid access only when we have a concrete end and it is still in the future. */
export function cancelledPaidThroughActive(row: SubscriptionPaidAccessAnchors, nowMs: number): boolean {
  if (row.status !== SubscriptionStatus.CANCELLED) return false;
  const end = subscriptionEntitlementEndMs(row);
  return end !== null && end > nowMs;
}

export function subscriptionRowGrantsPremiumAfterStatus(
  row: SubscriptionPaidAccessAnchors,
  nowMs: number,
): boolean {
  if (row.status === SubscriptionStatus.ACTIVE || row.status === SubscriptionStatus.GRACE) {
    return activeLikePaidWindowOpen(row, nowMs);
  }
  if (row.status === SubscriptionStatus.CANCELLED) {
    return cancelledPaidThroughActive(row, nowMs);
  }
  if (row.status === SubscriptionStatus.PAST_DUE) {
    return true;
  }
  return false;
}

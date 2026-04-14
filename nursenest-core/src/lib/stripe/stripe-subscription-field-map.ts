import type Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";

/**
 * Maps Stripe subscription status to Prisma `SubscriptionStatus`.
 * Returns `null` when the webhook/reconciler should **not** overwrite an existing row
 * (e.g. `incomplete` during Checkout can arrive after checkout already set ACTIVE).
 *
 * Kept in one module so `scripts/reconcile-stripe-subscriptions.ts` and
 * `/api/subscriptions/webhook` stay aligned with entitlement expectations (`get-user-access.ts`).
 */
export function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus | null {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "incomplete_expired":
      return SubscriptionStatus.CANCELLED;
    case "incomplete":
    case "paused":
      return null;
    default:
      return SubscriptionStatus.CANCELLED;
  }
}

export function firstSubscriptionPriceId(sub: Stripe.Subscription): string | undefined {
  const item = sub.items?.data?.[0];
  if (!item?.price) return undefined;
  return typeof item.price === "string" ? item.price : item.price.id;
}

export type BillingLifecycleFields = {
  currentPeriodEnd?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
};

export function billingLifecycleFields(sub: Stripe.Subscription): BillingLifecycleFields {
  const fields: BillingLifecycleFields = { cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end) };
  const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
  if (typeof periodEnd === "number" && periodEnd > 0) {
    fields.currentPeriodEnd = new Date(periodEnd * 1000);
  }
  const trialEnd = (sub as unknown as { trial_end?: number }).trial_end;
  if (typeof trialEnd === "number" && trialEnd > 0) {
    fields.trialEnd = new Date(trialEnd * 1000);
  }
  return fields;
}

/** Reconciliation: ignore period-end noise under this delta (ms). */
export const STRIPE_RECONCILE_PERIOD_DRIFT_MS = 120_000;

/** Internal / QA subscription ids that should not drive reconciliation. */
export function isDemoStripeSubscriptionId(id: string): boolean {
  return id.startsWith("demo_sub_");
}

/**
 * DB rows in ACTIVE or GRACE while Stripe has definitively ended or paused collection.
 * PAST_DUE in DB is handled by past-due policy elsewhere — do not treat Stripe `unpaid` as automatic false entitlement here.
 */
export function isDbActiveLike(status: SubscriptionStatus): boolean {
  return status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.GRACE;
}

export function isHighRiskDbActiveStripeEndedOrPaused(
  dbStatus: SubscriptionStatus,
  stripeStatus: Stripe.Subscription.Status,
): boolean {
  if (!isDbActiveLike(dbStatus)) return false;
  return (
    stripeStatus === "canceled" ||
    stripeStatus === "incomplete_expired" ||
    stripeStatus === "paused"
  );
}

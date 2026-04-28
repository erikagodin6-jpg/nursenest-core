import "server-only";

import type Stripe from "stripe";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import {
  guardSubscriptionCreateCustomerConsistency,
  isTrustedStripeReconciliationUserId,
} from "@/lib/stripe/stripe-reconcile-metadata";
import {
  billingLifecycleFields,
  firstSubscriptionPriceId,
  isDemoStripeSubscriptionId,
  mapStripeSubscriptionStatus,
} from "@/lib/stripe/stripe-subscription-field-map";
import { pastDueSinceForStatusTransition } from "@/lib/stripe/subscription-past-due-since";
import { syncUserFromStripePriceId } from "@/lib/stripe/sync-user-from-stripe-subscription";
import {
  canUserCancelStripeSubscription,
  pickControllingStripeSubscription,
} from "@/lib/subscriptions/stripe-subscription-eligibility";
import type { BillingSubscriptionRow } from "@/lib/learner/billing-page-payload-types";

export { canUserCancelStripeSubscription, pickControllingStripeSubscription } from "@/lib/subscriptions/stripe-subscription-eligibility";

async function resolveStripeCustomerIdForUser(userId: string): Promise<string | null> {
  /** Newest row may lack `stripeCustomerId` while an older row still has it — scan recent history. */
  const rows = await prisma.subscription.findMany({
    where: { userId, stripeCustomerId: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 24,
    select: { stripeCustomerId: true },
  });
  for (const r of rows) {
    const c = r.stripeCustomerId?.trim();
    if (c) return c;
  }
  return null;
}

async function latestStripeSubscriptionIdForUser(userId: string): Promise<string | null> {
  /** Newest row may omit `stripeSubscriptionId` while an older row still has it. */
  const rows = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 24,
    select: { stripeSubscriptionId: true },
  });
  for (const r of rows) {
    const id = r.stripeSubscriptionId?.trim();
    if (id && !isDemoStripeSubscriptionId(id)) return id;
  }
  return null;
}

/**
 * Returns the Stripe subscription object that should drive billing UI and cancellation, if any.
 */
export async function getStripeSubscriptionForUser(userId: string): Promise<Stripe.Subscription | null> {
  const stripe = await getStripeClient();
  if (!stripe || !isDatabaseUrlConfigured()) return null;

  let customerId = await resolveStripeCustomerIdForUser(userId);
  if (customerId) {
    try {
      const list = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 10,
      });
      const picked = pickControllingStripeSubscription(list.data);
      if (picked) return picked;
    } catch (e) {
      safeServerLog("subscription_reconcile", "stripe_list_subscriptions_failed", {
        userIdPrefix: userId.slice(0, 8),
        customerIdPrefix: customerId.slice(0, 10),
        message: e instanceof Error ? e.message.slice(0, 160) : "unknown",
        severity: "warning",
      });
    }
  }

  const fallbackSubId = await latestStripeSubscriptionIdForUser(userId);
  if (!fallbackSubId) return null;
  try {
    const sub = await stripe.subscriptions.retrieve(fallbackSubId);
    if (pickControllingStripeSubscription([sub])) return sub;
    const cid =
      typeof sub.customer === "string" ? sub.customer : sub.customer && "id" in sub.customer ? sub.customer.id : null;
    if (cid && cid !== customerId) {
      const list = await stripe.subscriptions.list({
        customer: cid,
        status: "all",
        limit: 10,
      });
      return pickControllingStripeSubscription(list.data);
    }
  } catch (e) {
    safeServerLog("subscription_reconcile", "stripe_retrieve_subscription_failed", {
      userIdPrefix: userId.slice(0, 8),
      stripeSubscriptionIdPrefix: fallbackSubId.slice(0, 14),
      message: e instanceof Error ? e.message.slice(0, 160) : "unknown",
      severity: "warning",
    });
  }
  return null;
}

export type ReconcileUserSubscriptionFromStripeResult = {
  stripeSubscription: Stripe.Subscription | null;
  /** True when a `Subscription` row was written or updated from Stripe. */
  dbUpdated: boolean;
};

/**
 * Loads Stripe for this user and mirrors the controlling subscription into Postgres when it differs or was missing.
 * Safe to call from billing page load and cancel route; does not grant client-side trust.
 */
export async function reconcileUserSubscriptionFromStripe(
  userId: string,
  logContext?: { surface?: string },
): Promise<ReconcileUserSubscriptionFromStripeResult> {
  const stripe = await getStripeClient();
  if (!stripe || !isDatabaseUrlConfigured()) {
    return { stripeSubscription: null, dbUpdated: false };
  }

  const localBefore = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      stripeSubscriptionId: true,
      status: true,
      cancelAtPeriodEnd: true,
      stripeCustomerId: true,
    },
  });

  const stripeSub = await getStripeSubscriptionForUser(userId);
  if (!stripeSub) {
    safeServerLog("subscription_reconcile", "no_active_stripe_subscription_for_user", {
      userIdPrefix: userId.slice(0, 8),
      surface: logContext?.surface,
      localRowsSampleJson: JSON.stringify(
        localBefore.map((r) => ({
          stripeSubscriptionIdPrefix: r.stripeSubscriptionId.slice(0, 12),
          status: r.status,
          cancelAtPeriodEnd: r.cancelAtPeriodEnd,
        })),
      ).slice(0, 900),
      severity: "info",
    });
    return { stripeSubscription: null, dbUpdated: false };
  }

  safeServerLog("subscription_reconcile", "stripe_subscription_found_for_reconcile", {
    userIdPrefix: userId.slice(0, 8),
    surface: logContext?.surface,
    stripeSubscriptionIdPrefix: stripeSub.id.slice(0, 14),
    stripeStatus: stripeSub.status,
    cancelAtPeriodEnd: stripeSub.cancel_at_period_end ? 1 : 0,
    localBeforeJson: JSON.stringify(
      localBefore.map((r) => ({
        stripeSubscriptionIdPrefix: r.stripeSubscriptionId.slice(0, 12),
        status: r.status,
      })),
    ).slice(0, 900),
    severity: "info",
  });

  const persisted = await persistStripeSubscriptionMirrorForUser(userId, stripeSub);
  return { stripeSubscription: stripeSub, dbUpdated: persisted };
}

/**
 * Upserts the `Subscription` row for this Stripe subscription id, enforcing `userId` ownership on existing rows.
 */
/**
 * Resolves which NurseNest user should receive webhook-driven writes when no `Subscription` row exists yet for `sub.id`.
 */
export async function resolveUserIdForOrphanStripeSubscription(sub: Stripe.Subscription): Promise<string | null> {
  const stripeMeta = (sub.metadata && typeof sub.metadata === "object" ? sub.metadata : {}) as Record<string, string>;
  const metaUserId = typeof stripeMeta.userId === "string" ? stripeMeta.userId.trim() : "";
  if (isTrustedStripeReconciliationUserId(metaUserId)) {
    const u = await prisma.user.findUnique({ where: { id: metaUserId }, select: { id: true } });
    if (u) return u.id;
  }
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
  if (!customerId) return null;
  const sibling = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    orderBy: { createdAt: "desc" },
    select: { userId: true },
  });
  return sibling?.userId ?? null;
}

export async function persistStripeSubscriptionMirrorForUser(userId: string, sub: Stripe.Subscription): Promise<boolean> {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: sub.id },
    select: { id: true, userId: true, status: true },
  });
  if (existing && existing.userId !== userId) {
    safeServerLog("subscription_reconcile", "persist_skipped_wrong_user", {
      stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
      userIdPrefix: userId.slice(0, 8),
      severity: "warning",
    });
    return false;
  }

  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
  const mappedStatus = mapStripeSubscriptionStatus(sub.status);
  const lifecycle = billingLifecycleFields(sub);
  const priceId = firstSubscriptionPriceId(sub);
  const mapped = priceId ? findTierCountryByPriceId(priceId) : undefined;
  const stripeMeta = (sub.metadata && typeof sub.metadata === "object" ? sub.metadata : {}) as Record<string, string>;
  const planCodeMeta = stripeMeta.planCode?.trim();
  const billingRegionMeta = stripeMeta.region?.trim();

  if (mappedStatus === null) {
    safeServerLog("subscription_reconcile", "persist_skip_incomplete_paused", {
      userIdPrefix: userId.slice(0, 8),
      stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
      stripeStatus: sub.status,
      severity: "info",
    });
    return false;
  }

  const dataUpdate: Prisma.SubscriptionUpdateInput = {
    currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
    trialEnd: lifecycle.trialEnd ?? null,
    cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
    status: mappedStatus,
    stripeCustomerId: customerId,
  };
  const pastPatch = existing ? pastDueSinceForStatusTransition(mappedStatus, existing.status) : null;
  if (pastPatch) Object.assign(dataUpdate, pastPatch);

  if (mapped) {
    dataUpdate.planTier = mapped.tier;
    dataUpdate.planCountry = mapped.country;
    if (mapped.alliedCareer) dataUpdate.alliedCareer = mapped.alliedCareer;
  }
  if (planCodeMeta) dataUpdate.planCode = planCodeMeta;
  if (billingRegionMeta) dataUpdate.billingRegionSlug = billingRegionMeta;

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: dataUpdate,
    });
  } else {
    const guard = await guardSubscriptionCreateCustomerConsistency(prisma, userId, customerId);
    if (!guard.allow) {
      safeServerLog("subscription_reconcile", "persist_create_guard_blocked", {
        userIdPrefix: userId.slice(0, 8),
        reason: guard.reason,
        severity: "warning",
      });
      return false;
    }
    await prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: sub.id,
        stripeCustomerId: customerId,
        status: mappedStatus,
        currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
        trialEnd: lifecycle.trialEnd ?? null,
        cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
        planTier: mapped?.tier ?? undefined,
        planCountry: mapped?.country ?? undefined,
        planCode: planCodeMeta || undefined,
        billingRegionSlug: billingRegionMeta || undefined,
        alliedCareer: mapped?.alliedCareer ?? undefined,
        ...(mappedStatus === SubscriptionStatus.PAST_DUE ? { pastDueSince: new Date() } : { pastDueSince: null }),
      },
    });
  }

  if (priceId) {
    const rowForSync = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: sub.id },
      select: { userId: true },
    });
    if (rowForSync) await syncUserFromStripePriceId(rowForSync.userId, priceId);
  }

  return true;
}

/**
 * When Postgres is stale but Stripe has a controlling subscription, billing UI should reflect Stripe
 * for status / cancel-at-end / ids (entitlements still follow DB until persist succeeds).
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
  if (!mapped) return null;
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

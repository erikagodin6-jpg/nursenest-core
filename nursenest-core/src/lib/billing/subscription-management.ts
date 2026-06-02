import "server-only";

import type Stripe from "stripe";
import { SubscriptionStatus, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import {
  emitBillingAudit,
  prefixStripeId,
  prefixUserId,
  tierToAuditString,
} from "@/lib/observability/billing-entitlement-audit";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { findTierCountryByPriceId, type BillingDuration, type PriceEntry } from "@/lib/stripe/pricing-map";
import {
  eachStripePriceMatrixRow,
} from "@/lib/stripe/pricing-map";
import { billingLifecycleFields } from "@/lib/stripe/stripe-subscription-field-map";
import {
  persistStripeSubscriptionMirrorForUser,
  reconcileUserSubscriptionFromStripe,
} from "@/lib/subscriptions/stripe-subscription-reconcile";
import { isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";

export type ManagedBillingPlan = {
  planCode: string;
  priceId: string;
  tier: TierCode;
  country: "CA" | "US";
  duration: BillingDuration;
  alliedCareer?: string;
  label: string;
};

export type BillingChangeKind = "upgrade" | "downgrade" | "switch";

export type BillingChangePreview = {
  ok: true;
  kind: BillingChangeKind;
  currentPlanCode: string | null;
  targetPlan: ManagedBillingPlan;
  immediate: boolean;
  prorationDate: number;
  amountDue: number | null;
  currency: string | null;
  currentPeriodEnd: string | null;
};

type ActiveSubscriptionContext = {
  stripe: Stripe;
  stripeSubscription: Stripe.Subscription;
  item: Stripe.SubscriptionItem;
};

const TIER_WEIGHT: Partial<Record<TierCode, number>> = {
  PRE_NURSING: 0,
  NEW_GRAD: 1,
  ALLIED: 2,
  RPN: 3,
  LVN_LPN: 3,
  RN: 4,
  NP: 5,
};

function tierLabel(tier: TierCode): string {
  switch (tier) {
    case "NEW_GRAD":
      return "New Grad";
    case "LVN_LPN":
      return "LPN / LVN";
    case "ALLIED":
      return "Allied Health";
    case "PRE_NURSING":
      return "Pre-Nursing";
    default:
      return tier;
  }
}

function durationLabel(duration: BillingDuration): string {
  switch (duration) {
    case "monthly":
      return "Monthly";
    case "3-month":
      return "3 months";
    case "6-month":
      return "6 months";
    case "yearly":
      return "Yearly";
  }
}

function planLabel(row: Pick<ManagedBillingPlan, "tier" | "country" | "duration" | "alliedCareer">): string {
  const career = row.alliedCareer ? ` · ${row.alliedCareer.replace(/-/g, " ")}` : "";
  return `${tierLabel(row.tier)}${career} · ${durationLabel(row.duration)} · ${row.country}`;
}

export function listManagedBillingPlans(): ManagedBillingPlan[] {
  const seen = new Set<string>();
  return eachStripePriceMatrixRow()
    .filter((row): row is ReturnType<typeof eachStripePriceMatrixRow>[number] & { priceId: string } => {
      return Boolean(row.priceId) && !isFreeStripeBillingNursingTier(row.tier);
    })
    .filter((row) => {
      const key = `${row.planCode}:${row.priceId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((row) => ({
      planCode: row.planCode,
      priceId: row.priceId,
      tier: row.tier,
      country: row.country,
      duration: row.duration,
      alliedCareer: row.alliedCareer,
      label: planLabel(row),
    }));
}

export function resolveManagedBillingPlan(planCode: string): ManagedBillingPlan | null {
  const normalized = planCode.trim();
  if (!normalized) return null;
  return listManagedBillingPlans().find((p) => p.planCode === normalized) ?? null;
}

export function classifyBillingPlanChange(args: {
  currentTier: TierCode | null;
  currentAmountMonthlyEquivalent: number | null;
  targetTier: TierCode;
  targetAmountMonthlyEquivalent: number | null;
}): BillingChangeKind {
  const currentWeight = args.currentTier ? TIER_WEIGHT[args.currentTier] ?? 0 : 0;
  const targetWeight = TIER_WEIGHT[args.targetTier] ?? 0;
  if (targetWeight < currentWeight) return "downgrade";
  if (targetWeight > currentWeight) return "upgrade";
  if (
    args.currentAmountMonthlyEquivalent != null &&
    args.targetAmountMonthlyEquivalent != null &&
    args.targetAmountMonthlyEquivalent < args.currentAmountMonthlyEquivalent
  ) {
    return "downgrade";
  }
  if (
    args.currentAmountMonthlyEquivalent != null &&
    args.targetAmountMonthlyEquivalent != null &&
    args.targetAmountMonthlyEquivalent > args.currentAmountMonthlyEquivalent
  ) {
    return "upgrade";
  }
  return "switch";
}

function monthlyEquivalent(price: Stripe.Price | null | undefined): number | null {
  const amount = price?.unit_amount ?? null;
  const interval = price?.recurring?.interval ?? null;
  const count = price?.recurring?.interval_count ?? 1;
  if (amount == null || !interval) return null;
  if (interval === "year") return amount / Math.max(count * 12, 1);
  if (interval === "month") return amount / Math.max(count, 1);
  if (interval === "week") return (amount * 52) / Math.max(count * 12, 1);
  if (interval === "day") return (amount * 365) / Math.max(count * 12, 1);
  return null;
}

function subscriptionItemForBasePlan(sub: Stripe.Subscription): Stripe.SubscriptionItem | null {
  return sub.items.data[0] ?? null;
}

async function loadActiveSubscriptionContext(userId: string): Promise<ActiveSubscriptionContext | null> {
  const stripe = await getStripeClient();
  if (!stripe) return null;
  const { stripeSubscription } = await reconcileUserSubscriptionFromStripe(userId, {
    surface: "subscription_management",
  });
  if (!stripeSubscription) return null;
  if (!["active", "trialing", "past_due"].includes(stripeSubscription.status)) return null;
  const item = subscriptionItemForBasePlan(stripeSubscription);
  if (!item) return null;
  return { stripe, stripeSubscription, item };
}

function invoiceAmountDue(invoice: Stripe.Invoice): { amountDue: number | null; currency: string | null } {
  const amountDue = typeof invoice.amount_due === "number" ? invoice.amount_due : null;
  const currency = typeof invoice.currency === "string" ? invoice.currency : null;
  return { amountDue, currency };
}

async function retrievePrice(stripe: Stripe, priceId: string): Promise<Stripe.Price | null> {
  try {
    return await stripe.prices.retrieve(priceId);
  } catch (e) {
    safeServerLog("billing_management", "stripe_price_retrieve_failed", {
      priceIdPrefix: priceId.slice(0, 14),
      detail: e instanceof Error ? e.message.slice(0, 160) : "unknown",
      severity: "warn",
    });
    return null;
  }
}

export async function previewManagedSubscriptionChange(userId: string, planCode: string): Promise<BillingChangePreview | { ok: false; error: string; code: string }> {
  const targetPlan = resolveManagedBillingPlan(planCode);
  if (!targetPlan) return { ok: false, error: "Selected plan is not configured for billing.", code: "PLAN_NOT_CONFIGURED" };

  const ctx = await loadActiveSubscriptionContext(userId);
  if (!ctx) return { ok: false, error: "No active Stripe subscription found.", code: "NO_ACTIVE_SUBSCRIPTION" };

  const currentPriceId = ctx.item.price?.id ?? null;
  if (currentPriceId === targetPlan.priceId) {
    return { ok: false, error: "You are already on this plan.", code: "SAME_PLAN" };
  }

  const [targetPrice, currentPrice] = await Promise.all([
    retrievePrice(ctx.stripe, targetPlan.priceId),
    currentPriceId ? retrievePrice(ctx.stripe, currentPriceId) : Promise.resolve(null),
  ]);
  const currentMapping = currentPriceId ? findTierCountryByPriceId(currentPriceId) : undefined;
  const kind = classifyBillingPlanChange({
    currentTier: currentMapping?.tier ?? null,
    currentAmountMonthlyEquivalent: monthlyEquivalent(currentPrice),
    targetTier: targetPlan.tier,
    targetAmountMonthlyEquivalent: monthlyEquivalent(targetPrice),
  });
  const prorationDate = Math.floor(Date.now() / 1000);

  let amountDue: number | null = null;
  let currency: string | null = targetPrice?.currency ?? null;
  if (kind !== "downgrade") {
    try {
      const invoice = await ctx.stripe.invoices.createPreview({
        customer: typeof ctx.stripeSubscription.customer === "string" ? ctx.stripeSubscription.customer : ctx.stripeSubscription.customer.id,
        subscription: ctx.stripeSubscription.id,
        subscription_details: {
          items: [{ id: ctx.item.id, price: targetPlan.priceId, quantity: ctx.item.quantity ?? 1 }],
          billing_cycle_anchor: "unchanged",
          proration_behavior: "always_invoice",
          proration_date: prorationDate,
        },
      });
      const due = invoiceAmountDue(invoice);
      amountDue = due.amountDue;
      currency = due.currency ?? currency;
    } catch (e) {
      safeServerLogCritical(
        "billing_management",
        "stripe_proration_preview_failed",
        { userIdPrefix: prefixUserId(userId), targetPlanCode: targetPlan.planCode },
        e,
      );
      return { ok: false, error: "Could not preview the plan change.", code: "STRIPE_PREVIEW_FAILED" };
    }
  }

  const lifecycle = billingLifecycleFields(ctx.stripeSubscription);
  emitBillingAudit("subscription_change_previewed", {
    source: "checkout",
    userIdPrefix: prefixUserId(userId),
    subscriptionIdPrefix: prefixStripeId(ctx.stripeSubscription.id),
    priorState: currentMapping?.tier,
    newState: targetPlan.tier,
    operation: kind,
    tier: tierToAuditString(targetPlan.tier),
    currency: currency ?? undefined,
  });

  return {
    ok: true,
    kind,
    currentPlanCode: ctx.stripeSubscription.metadata?.planCode ?? null,
    targetPlan,
    immediate: kind !== "downgrade",
    prorationDate,
    amountDue,
    currency,
    currentPeriodEnd: lifecycle.currentPeriodEnd?.toISOString() ?? null,
  };
}

export async function applyManagedSubscriptionChange(userId: string, planCode: string): Promise<
  | { ok: true; code: "PLAN_CHANGED_IMMEDIATELY"; kind: BillingChangeKind; currentPeriodEnd: string | null; amountDue: number | null; currency: string | null }
  | { ok: true; code: "DOWNGRADE_SCHEDULED"; kind: "downgrade"; effectiveAt: string | null }
  | { ok: false; error: string; code: string }
> {
  const preview = await previewManagedSubscriptionChange(userId, planCode);
  if (!preview.ok) return preview;
  const ctx = await loadActiveSubscriptionContext(userId);
  if (!ctx) return { ok: false, error: "No active Stripe subscription found.", code: "NO_ACTIVE_SUBSCRIPTION" };
  const customerId = typeof ctx.stripeSubscription.customer === "string" ? ctx.stripeSubscription.customer : ctx.stripeSubscription.customer.id;
  const currentQuantity = ctx.item.quantity ?? 1;
  const metadata: Record<string, string> = {
    ...(ctx.stripeSubscription.metadata ?? {}),
    userId,
    tier: preview.targetPlan.tier,
    duration: preview.targetPlan.duration,
    planCode: preview.targetPlan.planCode,
    country: preview.targetPlan.country,
    app: "nursenest-core",
  };
  if (preview.targetPlan.alliedCareer) metadata.alliedCareer = preview.targetPlan.alliedCareer;

  if (preview.kind === "downgrade") {
    const currentEnd = billingLifecycleFields(ctx.stripeSubscription).currentPeriodEnd;
    const effectiveAt = currentEnd ? Math.floor(currentEnd.getTime() / 1000) : undefined;
    if (!effectiveAt) {
      return { ok: false, error: "Cannot schedule a downgrade without a known renewal date.", code: "MISSING_PERIOD_END" };
    }
    try {
      const schedule = await ctx.stripe.subscriptionSchedules.create({
        from_subscription: ctx.stripeSubscription.id,
        metadata: {
          userId,
          pendingPlanCode: preview.targetPlan.planCode,
          pendingTier: preview.targetPlan.tier,
          requestedBy: "learner",
        },
      });
      await ctx.stripe.subscriptionSchedules.update(schedule.id, {
        end_behavior: "release",
        phases: [
          {
            items: [{ price: ctx.item.price.id, quantity: currentQuantity }],
            start_date: "now",
            end_date: effectiveAt,
            proration_behavior: "none",
            metadata: ctx.stripeSubscription.metadata ?? {},
          },
          {
            items: [{ price: preview.targetPlan.priceId, quantity: 1 }],
            proration_behavior: "none",
            metadata,
          },
        ],
      });
      emitBillingAudit("subscription_downgrade_scheduled", {
        source: "checkout",
        userIdPrefix: prefixUserId(userId),
        subscriptionIdPrefix: prefixStripeId(ctx.stripeSubscription.id),
        customerIdPrefix: prefixStripeId(customerId, 12),
        priorState: findTierCountryByPriceId(ctx.item.price.id)?.tier,
        newState: preview.targetPlan.tier,
        operation: "downgrade_scheduled",
        tier: tierToAuditString(preview.targetPlan.tier),
      });
      return { ok: true, code: "DOWNGRADE_SCHEDULED", kind: "downgrade", effectiveAt: preview.currentPeriodEnd };
    } catch (e) {
      safeServerLogCritical(
        "billing_management",
        "stripe_downgrade_schedule_failed",
        { userIdPrefix: prefixUserId(userId), targetPlanCode: preview.targetPlan.planCode },
        e,
      );
      return { ok: false, error: "Could not schedule the downgrade.", code: "STRIPE_SCHEDULE_FAILED" };
    }
  }

  try {
    const updated = await ctx.stripe.subscriptions.update(ctx.stripeSubscription.id, {
      cancel_at_period_end: false,
      billing_cycle_anchor: "unchanged",
      payment_behavior: "allow_incomplete",
      proration_behavior: "always_invoice",
      proration_date: preview.prorationDate,
      items: [{ id: ctx.item.id, price: preview.targetPlan.priceId, quantity: 1 }],
      metadata,
    });
    await persistStripeSubscriptionMirrorForUser(userId, updated);
    emitBillingAudit(preview.kind === "upgrade" ? "subscription_upgrade_applied" : "subscription_tier_switch_applied", {
      source: "checkout",
      userIdPrefix: prefixUserId(userId),
      subscriptionIdPrefix: prefixStripeId(updated.id),
      customerIdPrefix: prefixStripeId(customerId, 12),
      priorState: findTierCountryByPriceId(ctx.item.price.id)?.tier,
      newState: preview.targetPlan.tier,
      operation: preview.kind,
      tier: tierToAuditString(preview.targetPlan.tier),
      currency: preview.currency ?? undefined,
    });
    const lifecycle = billingLifecycleFields(updated);
    return {
      ok: true,
      code: "PLAN_CHANGED_IMMEDIATELY",
      kind: preview.kind,
      currentPeriodEnd: lifecycle.currentPeriodEnd?.toISOString() ?? null,
      amountDue: preview.amountDue,
      currency: preview.currency,
    };
  } catch (e) {
    safeServerLogCritical(
      "billing_management",
      "stripe_subscription_update_failed",
      { userIdPrefix: prefixUserId(userId), targetPlanCode: preview.targetPlan.planCode },
      e,
    );
    return { ok: false, error: "Could not apply the plan change.", code: "STRIPE_UPDATE_FAILED" };
  }
}

export async function applyAdminSubscriptionAction(args: {
  actorUserId: string;
  actorTier: string;
  userId: string;
  action: "cancel" | "reactivate" | "gift_month" | "apply_credit" | "apply_coupon";
  amountCents?: number;
  couponId?: string;
  reason: string;
}): Promise<{ ok: true; code: string } | { ok: false; error: string; code: string }> {
  const ctx = await loadActiveSubscriptionContext(args.userId);
  if (!ctx) return { ok: false, error: "No active Stripe subscription found.", code: "NO_ACTIVE_SUBSCRIPTION" };
  const customerId = typeof ctx.stripeSubscription.customer === "string" ? ctx.stripeSubscription.customer : ctx.stripeSubscription.customer.id;

  try {
    if (args.action === "cancel") {
      const updated = await ctx.stripe.subscriptions.update(ctx.stripeSubscription.id, { cancel_at_period_end: true });
      await persistStripeSubscriptionMirrorForUser(args.userId, updated);
    } else if (args.action === "reactivate") {
      const updated = await ctx.stripe.subscriptions.update(ctx.stripeSubscription.id, { cancel_at_period_end: false });
      await persistStripeSubscriptionMirrorForUser(args.userId, updated);
    } else if (args.action === "gift_month") {
      const currentEnd = billingLifecycleFields(ctx.stripeSubscription).currentPeriodEnd;
      const nextEnd = new Date((currentEnd?.getTime() ?? Date.now()) + 30 * 24 * 60 * 60 * 1000);
      const updated = await ctx.stripe.subscriptions.update(ctx.stripeSubscription.id, {
        trial_end: Math.floor(nextEnd.getTime() / 1000),
      });
      await persistStripeSubscriptionMirrorForUser(args.userId, updated);
    } else if (args.action === "apply_credit") {
      const amount = Math.max(0, Math.trunc(args.amountCents ?? 0));
      if (amount <= 0) return { ok: false, error: "Credit amount is required.", code: "INVALID_AMOUNT" };
      await ctx.stripe.customers.createBalanceTransaction(customerId, {
        amount: -amount,
        currency: ctx.item.price.currency,
        description: `NurseNest admin credit: ${args.reason.slice(0, 120)}`,
      });
    } else if (args.action === "apply_coupon") {
      const couponId = args.couponId?.trim();
      if (!couponId) return { ok: false, error: "Coupon ID is required.", code: "INVALID_COUPON" };
      await ctx.stripe.subscriptions.update(ctx.stripeSubscription.id, {
        discounts: [{ coupon: couponId }],
      });
    }

    emitBillingAudit("admin_subscription_action_applied", {
      source: "admin",
      userIdPrefix: prefixUserId(args.userId),
      subscriptionIdPrefix: prefixStripeId(ctx.stripeSubscription.id),
      customerIdPrefix: prefixStripeId(customerId, 12),
      actorStaffTier: args.actorTier,
      operation: args.action,
      reason: args.reason,
      newState: `actor=${prefixUserId(args.actorUserId)}`,
    });
    return { ok: true, code: "ADMIN_SUBSCRIPTION_ACTION_APPLIED" };
  } catch (e) {
    safeServerLogCritical(
      "billing_management",
      "admin_subscription_action_failed",
      { userIdPrefix: prefixUserId(args.userId), action: args.action },
      e,
    );
    return { ok: false, error: "Could not apply admin subscription action.", code: "STRIPE_ADMIN_ACTION_FAILED" };
  }
}

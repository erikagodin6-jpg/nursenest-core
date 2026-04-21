import "server-only";

import { SubscriptionStatus, TrialStatus, type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { deriveBillingSurface, type BillingStatusSurface } from "@/lib/learner/derive-billing-page-surface";
import type { BillingSubscriptionRow, BillingUserRow } from "@/lib/learner/billing-page-payload-types";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  pastDueGraceWindowEndMs,
  readPastDueEntitlementPolicy,
  readPastDueGraceDays,
} from "@/lib/entitlements/past-due-policy";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";

export type { BillingStatusSurface, BillingSubscriptionRow, BillingUserRow };

/** Stripe subscription fields when live API read succeeds — never guessed from DB alone. */
export type StripeRenewalSnapshot = {
  billingInterval: "day" | "week" | "month" | "year" | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

export type BillingPagePayload = {
  user: BillingUserRow;
  subscription: BillingSubscriptionRow | null;
  entitlement: PageEntitlementResult;
  /** Pathways unlocked by current entitlement (empty if no access). */
  pathwayLabels: string[];
  /** Stripe-backed renewal/interval; null when API unavailable or missing id. */
  stripeRenewal: StripeRenewalSnapshot | null;
  surface: BillingStatusSurface;
  showBillingPortal: boolean;
  effectiveTier: TierCode;
  effectiveCountry: CountryCode | null;
  /** Trial end callout when trial is active, not expired, and no paid ACTIVE row. */
  showTrialEndCallout: boolean;
  /** When `surface` is `past_due_grace`, when premium access ends if payment is not fixed (min of grace anchor+days and period end). */
  pastDueGraceEndsAt: Date | null;
  /** Best-effort current period end (Stripe API, else DB) for “access until” copy. */
  billingPeriodEndDisplay: Date | null;
};

function tierHuman(tier: TierCode): string {
  switch (tier) {
    case "RN":
      return "RN (NCLEX-RN)";
    case "RPN":
      return "RPN";
    case "LVN_LPN":
      return "LPN / LVN";
    case "NP":
      return "NP";
    case "ALLIED":
      return "Allied health";
    default:
      return String(tier).replace(/_/g, " ");
  }
}

export function formatBillingTierLabel(tier: TierCode, country: CountryCode | string | null | undefined): string {
  const t = tierHuman(tier);
  const c = country != null && String(country).trim() !== "" ? String(country) : null;
  return c ? `${t} · ${c}` : t;
}

async function loadStripeRenewalSnapshot(stripeSubscriptionId: string | null | undefined): Promise<StripeRenewalSnapshot | null> {
  const sid = stripeSubscriptionId?.trim();
  if (!sid) return null;
  try {
    const { getStripeClient } = await import("@/lib/stripe/stripe-client");
    const stripe = await getStripeClient();
    if (!stripe) return null;
    const sub = await stripe.subscriptions.retrieve(sid);
    const item = sub.items.data[0];
    const rawInterval = item?.price?.recurring?.interval ?? (item?.plan as { interval?: string } | undefined)?.interval;
    const billingInterval =
      rawInterval === "day" || rawInterval === "week" || rawInterval === "month" || rawInterval === "year"
        ? rawInterval
        : null;
    const endSec = item?.current_period_end;
    const currentPeriodEnd = typeof endSec === "number" && endSec > 0 ? new Date(endSec * 1000) : null;
    return {
      billingInterval,
      currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
    };
  } catch {
    return null;
  }
}

export async function loadBillingPagePayload(userId: string): Promise<BillingPagePayload | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const [userRow, subscriptionRow, entitlement] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        tier: true,
        country: true,
        role: true,
        trialStatus: true,
        trialEndsAt: true,
        trialStartedAt: true,
        learnerPath: true,
        passwordHash: true,
      },
    }),
    prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        status: true,
        stripeSubscriptionId: true,
        stripeCustomerId: true,
        planTier: true,
        planCountry: true,
        alliedCareer: true,
        planDuration: true,
        currentPeriodEnd: true,
        trialEnd: true,
        cancelAtPeriodEnd: true,
        createdAt: true,
        updatedAt: true,
        pastDueSince: true,
      },
    }),
    resolveEntitlementForPage(userId),
  ]);

  if (!userRow) return null;

  const user: BillingUserRow = {
    tier: userRow.tier,
    country: String(userRow.country),
    role: userRow.role,
    trialStatus: userRow.trialStatus,
    trialEndsAt: userRow.trialEndsAt,
    trialStartedAt: userRow.trialStartedAt,
    learnerPath: userRow.learnerPath,
    passwordHash: userRow.passwordHash,
  };

  const subscription: BillingSubscriptionRow | null = subscriptionRow
    ? {
        status: subscriptionRow.status,
        stripeSubscriptionId: subscriptionRow.stripeSubscriptionId,
        stripeCustomerId: subscriptionRow.stripeCustomerId,
        planTier: subscriptionRow.planTier,
        planCountry: subscriptionRow.planCountry,
        alliedCareer: subscriptionRow.alliedCareer ?? null,
        cancelAtPeriodEnd: subscriptionRow.cancelAtPeriodEnd ?? false,
        createdAt: subscriptionRow.createdAt,
        updatedAt: subscriptionRow.updatedAt,
      }
    : null;

  const subForEffective =
    subscription &&
    (subscription.status === SubscriptionStatus.ACTIVE || subscription.status === SubscriptionStatus.GRACE)
      ? {
          planTier: subscription.planTier,
          planCountry: subscription.planCountry,
        }
      : null;

  const { tier: effectiveTier, country: effectiveCountry } = effectiveTierCountryForAccess(
    { tier: user.tier, country: userRow.country },
    subForEffective,
  );

  const hasAccess = entitlement !== "error" && entitlement.hasAccess;
  const pathwayLabels =
    entitlement !== "error" && entitlement.hasAccess
      ? (await listPathwaysCompatibleWithSubscription(entitlement)).map((p) => p.shortName || p.displayName)
      : [];

  let stripeRenewal = await loadStripeRenewalSnapshot(subscription?.stripeSubscriptionId);
  if (!stripeRenewal && subscriptionRow?.currentPeriodEnd) {
    stripeRenewal = {
      billingInterval: null,
      currentPeriodEnd: subscriptionRow.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptionRow.cancelAtPeriodEnd ?? false,
    };
  }

  const billingPeriodEndDisplay =
    stripeRenewal?.currentPeriodEnd ?? subscriptionRow?.currentPeriodEnd ?? null;

  const entitlementReason: AccessScope["reason"] | "error" =
    entitlement === "error" ? "error" : entitlement.reason;

  const surface = deriveBillingSurface({
    user,
    subscription,
    hasAccess,
    entitlementReason,
    trialEndsAt: user.trialEndsAt,
  });

  let pastDueGraceEndsAt: Date | null = null;
  if (
    subscription?.status === SubscriptionStatus.PAST_DUE &&
    hasAccess &&
    entitlementReason === "past_due_grace" &&
    subscriptionRow &&
    readPastDueEntitlementPolicy() === "grace"
  ) {
    const endMs = pastDueGraceWindowEndMs(
      {
        updatedAt: subscriptionRow.updatedAt,
        currentPeriodEnd: subscriptionRow.currentPeriodEnd,
        pastDueSince: subscriptionRow.pastDueSince,
      },
      readPastDueGraceDays(),
    );
    pastDueGraceEndsAt = new Date(endMs);
  }

  const portalEligibleSub =
    subscription &&
    (subscription.status === SubscriptionStatus.ACTIVE ||
      subscription.status === SubscriptionStatus.GRACE ||
      subscription.status === SubscriptionStatus.PAST_DUE ||
      subscription.status === SubscriptionStatus.CANCELLED);
  const showBillingPortal = Boolean(portalEligibleSub && subscription.stripeCustomerId?.trim());

  const now = Date.now();
  const showTrialEndCallout =
    user.trialStatus === TrialStatus.ACTIVE &&
    Boolean(user.trialEndsAt && user.trialEndsAt.getTime() > now) &&
    subscription?.status !== SubscriptionStatus.ACTIVE;

  return {
    user,
    subscription,
    entitlement,
    pathwayLabels,
    stripeRenewal,
    surface,
    showBillingPortal,
    effectiveTier,
    effectiveCountry,
    showTrialEndCallout,
    pastDueGraceEndsAt,
    billingPeriodEndDisplay,
  };
}

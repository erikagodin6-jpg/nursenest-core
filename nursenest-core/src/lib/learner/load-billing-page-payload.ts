import "server-only";

import { SubscriptionStatus, TrialStatus, UserRole, type CountryCode, type TierCode } from "@prisma/client";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  pastDueGraceWindowEndMs,
  readPastDueEntitlementPolicy,
  readPastDueGraceDays,
} from "@/lib/entitlements/past-due-policy";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";

export type BillingSubscriptionRow = {
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  stripeCustomerId: string | null;
  planTier: TierCode | null;
  planCountry: CountryCode | null;
  alliedCareer: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BillingUserRow = {
  tier: TierCode;
  country: string;
  role: UserRole;
  trialStatus: TrialStatus;
  trialEndsAt: Date | null;
  trialStartedAt: Date | null;
  learnerPath: string | null;
  passwordHash: string | null;
};

/** Stripe subscription fields when live API read succeeds — never guessed from DB alone. */
export type StripeRenewalSnapshot = {
  billingInterval: "day" | "week" | "month" | "year" | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

export type BillingStatusSurface =
  | "active_paid"
  | "grace"
  | "past_due"
  | "cancelled"
  | "trial"
  | "trial_ending"
  | "inactive"
  | "admin";

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

/** Exported for unit tests — mirrors billing page banner selection. */
export function deriveBillingSurface(args: {
  user: BillingUserRow;
  subscription: BillingSubscriptionRow | null;
  hasAccess: boolean;
  entitlementReason: AccessScope["reason"] | "error";
  trialEndsAt: Date | null;
}): BillingStatusSurface {
  if (isLearnerEntitlementStaffBypassRole(args.user.role)) return "admin";

  const sub = args.subscription;
  const now = Date.now();
  const trialActive = args.user.trialStatus === TrialStatus.ACTIVE && args.trialEndsAt && args.trialEndsAt.getTime() > now;
  const reason = args.entitlementReason === "error" ? ("no_access" as const) : args.entitlementReason;

  if (sub?.status === SubscriptionStatus.ACTIVE && args.hasAccess) {
    return "active_paid";
  }
  if (sub?.status === SubscriptionStatus.GRACE && args.hasAccess) {
    return "grace";
  }

  if (sub?.status === SubscriptionStatus.PAST_DUE) {
    if (args.hasAccess && reason === "past_due_grace") {
      return "past_due_grace";
    }
    if (args.hasAccess && reason === "active_trial" && trialActive && args.trialEndsAt) {
      const daysLeft = (args.trialEndsAt.getTime() - now) / 86400000;
      if (daysLeft <= 14) return "trial_ending";
      return "trial";
    }
    return "past_due";
  }

  if (sub?.status === SubscriptionStatus.CANCELLED) {
    return "cancelled";
  }

  if (trialActive && args.trialEndsAt) {
    const daysLeft = (args.trialEndsAt.getTime() - now) / 86400000;
    if (daysLeft <= 14) return "trial_ending";
    return "trial";
  }

  if (args.hasAccess) return "active_paid";

  return "inactive";
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
      ? listPathwaysCompatibleWithSubscription(entitlement).map((p) => p.shortName || p.displayName)
      : [];

  let stripeRenewal = await loadStripeRenewalSnapshot(subscription?.stripeSubscriptionId);
  if (!stripeRenewal && subscriptionRow?.currentPeriodEnd) {
    stripeRenewal = {
      billingInterval: null,
      currentPeriodEnd: subscriptionRow.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptionRow.cancelAtPeriodEnd ?? false,
    };
  }

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
  };
}

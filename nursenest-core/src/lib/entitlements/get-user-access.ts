import { SubscriptionStatus, TrialStatus, type CountryCode, type TierCode } from "@prisma/client";
import { isLearnerEntitlementAdminOverrideRole } from "@/lib/auth/staff-roles";
import { normalizeCountryCodeForEntitlement } from "@/lib/entitlements/country-code";
import {
  pastDueSubscriptionGrantsPremium,
  readPastDueEntitlementPolicy,
} from "@/lib/entitlements/past-due-policy";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";

/** Narrow legacy shape for question/lesson SQL helpers (shared type; avoid circular imports). */
export type AccessScope = {
  hasAccess: boolean;
  reason:
    | "active_subscription"
    | "admin_override"
    | "grace_period"
    | "past_due_grace"
    | "active_trial"
    | "no_access";
  tier: TierCode | null;
  country: CountryCode | null;
  /** When tier is ALLIED, the specific career line the user purchased. */
  alliedCareer: AlliedCareerKey | null;
};

/** Normalized subscription lifecycle for product UI and server gates. */
export type SubscriptionPlanStatus = "none" | "active" | "canceled" | "grace" | "past_due";

/**
 * Canonical access snapshot for a learner: mirrors Stripe `Subscription` + `User` profile.
 * Use {@link accessScopeFromUserAccess} / `resolveEntitlement` when only tier/country/`hasAccess` is needed.
 */
export type UserAccess = {
  userId: string;
  /** True when the learner may use premium lessons, bank, CAT, etc. */
  hasPremium: boolean;
  /** Same semantics as {@link AccessScope.reason}. */
  reason: AccessScope["reason"];
  allowedRegion: {
    country: CountryCode | null;
    /** Global pricing region from checkout metadata, when set. */
    billingRegionSlug: string | null;
  };
  allowedProfession: {
    tier: TierCode | null;
    alliedCareer: AlliedCareerKey | null;
  };
  allowedExam: {
    /** Learner goal pathway; optional future hard-lock from subscription metadata. */
    pathwayId: string | null;
  };
  plan: {
    planCode: string | null;
    duration: string | null;
    status: SubscriptionPlanStatus;
    /** Best-effort access end: current period end, else trial end. */
    expiresAt: Date | null;
    cancelAtPeriodEnd: boolean;
  };
};

function mapSubscriptionPlanStatus(status: SubscriptionStatus | undefined | null): SubscriptionPlanStatus {
  if (!status) return "none";
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return "active";
    case SubscriptionStatus.CANCELLED:
      return "canceled";
    case SubscriptionStatus.GRACE:
      return "grace";
    case SubscriptionStatus.PAST_DUE:
      return "past_due";
    default:
      return "none";
  }
}

const ACTIVE_LIKE: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.GRACE,
  SubscriptionStatus.PAST_DUE,
];

type SubscriptionSelect = {
  status: SubscriptionStatus;
  planTier: TierCode | null;
  planCountry: CountryCode | null;
  alliedCareer: string | null;
  planDuration: string | null;
  planCode: string | null;
  billingRegionSlug: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: Date;
};

function emptyAccess(userId: string): UserAccess {
  return {
    userId,
    hasPremium: false,
    reason: "no_access",
    allowedRegion: { country: null, billingRegionSlug: null },
    allowedProfession: { tier: null, alliedCareer: null },
    allowedExam: { pathwayId: null },
    plan: {
      planCode: null,
      duration: null,
      status: "none",
      expiresAt: null,
      cancelAtPeriodEnd: false,
    },
  };
}

/**
 * Resolves subscription-backed access for billing, gating, and upgrade flows.
 * Server-only; never trust client-sent tier/country over this for protected content.
 */
export async function getUserAccess(userId: string): Promise<UserAccess> {
  const base = emptyAccess(userId);
  if (!isDatabaseUrlConfigured()) return base;

  const user = await withRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        tier: true,
        country: true,
        trialStatus: true,
        trialEndsAt: true,
        alliedProfessionKey: true,
        targetExamPathwayId: true,
      },
    }),
  );

  if (!user) return base;

  const pathwayId = user.targetExamPathwayId?.trim() || null;

  const [activeSubscription, latestSubscription] = await Promise.all([
    withRetry(() =>
      prisma.subscription.findFirst({
        where: { userId, status: { in: ACTIVE_LIKE } },
        orderBy: { createdAt: "desc" },
        select: {
          status: true,
          planTier: true,
          planCountry: true,
          alliedCareer: true,
          planDuration: true,
          planCode: true,
          billingRegionSlug: true,
          currentPeriodEnd: true,
          trialEnd: true,
          cancelAtPeriodEnd: true,
          updatedAt: true,
        },
      }),
    ),
    withRetry(() =>
      prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          status: true,
          planTier: true,
          planCountry: true,
          alliedCareer: true,
          planDuration: true,
          planCode: true,
          billingRegionSlug: true,
          currentPeriodEnd: true,
          trialEnd: true,
          cancelAtPeriodEnd: true,
          updatedAt: true,
        },
      }),
    ),
  ]);

  const planRow: SubscriptionSelect | null = activeSubscription ?? latestSubscription;
  const billingRegionSlug = planRow?.billingRegionSlug?.trim() || null;
  const planCode = activeSubscription?.planCode?.trim() || latestSubscription?.planCode?.trim() || null;
  const planDuration = activeSubscription?.planDuration ?? latestSubscription?.planDuration ?? null;
  const cancelAtPeriodEnd =
    activeSubscription?.cancelAtPeriodEnd ?? latestSubscription?.cancelAtPeriodEnd ?? false;
  const expiresAt =
    activeSubscription?.currentPeriodEnd ??
    activeSubscription?.trialEnd ??
    latestSubscription?.currentPeriodEnd ??
    latestSubscription?.trialEnd ??
    null;

  const baseCountry = normalizeCountryCodeForEntitlement(user.country);

  if (isLearnerEntitlementAdminOverrideRole(user.role)) {
    return {
      userId,
      hasPremium: true,
      reason: "admin_override",
      allowedRegion: { country: baseCountry, billingRegionSlug },
      allowedProfession: {
        tier: user.tier,
        alliedCareer: (user.alliedProfessionKey as AlliedCareerKey) ?? null,
      },
      allowedExam: { pathwayId },
      plan: {
        planCode,
        duration: planDuration,
        status: mapSubscriptionPlanStatus(activeSubscription?.status ?? latestSubscription?.status),
        expiresAt,
        cancelAtPeriodEnd,
      },
    };
  }

  const effectiveAlliedFromSub = (activeSubscription?.alliedCareer as AlliedCareerKey | null)
    ?? (user.alliedProfessionKey as AlliedCareerKey)
    ?? null;

  const { tier: effectiveTier, country: effectiveCountry } = effectiveTierCountryForAccess(
    user,
    activeSubscription,
  );

  if (activeSubscription?.planTier && activeSubscription.planTier !== user.tier) {
    safeServerLog("entitlement", "user_tier_subscription_plan_mismatch", {
      userTier: String(user.tier),
      planTier: String(activeSubscription.planTier),
    });
  }

  if (activeSubscription?.status === SubscriptionStatus.ACTIVE) {
    return {
      userId,
      hasPremium: true,
      reason: "active_subscription",
      allowedRegion: { country: effectiveCountry, billingRegionSlug },
      allowedProfession: {
        tier: effectiveTier,
        alliedCareer: effectiveTier === "ALLIED" ? effectiveAlliedFromSub : null,
      },
      allowedExam: { pathwayId },
      plan: {
        planCode,
        duration: planDuration,
        status: "active",
        expiresAt,
        cancelAtPeriodEnd,
      },
    };
  }

  if (activeSubscription?.status === SubscriptionStatus.GRACE) {
    return {
      userId,
      hasPremium: true,
      reason: "grace_period",
      allowedRegion: { country: effectiveCountry, billingRegionSlug },
      allowedProfession: {
        tier: effectiveTier,
        alliedCareer: effectiveTier === "ALLIED" ? effectiveAlliedFromSub : null,
      },
      allowedExam: { pathwayId },
      plan: {
        planCode,
        duration: planDuration,
        status: mapSubscriptionPlanStatus(activeSubscription.status),
        expiresAt,
        cancelAtPeriodEnd,
      },
    };
  }

  if (activeSubscription?.status === SubscriptionStatus.PAST_DUE) {
    const pastDuePolicy = readPastDueEntitlementPolicy();
    const grantPastDue = pastDueSubscriptionGrantsPremium(pastDuePolicy, {
      updatedAt: activeSubscription.updatedAt,
      currentPeriodEnd: activeSubscription.currentPeriodEnd,
    });
    if (grantPastDue) {
      return {
        userId,
        hasPremium: true,
        reason: "past_due_grace",
        allowedRegion: { country: effectiveCountry, billingRegionSlug },
        allowedProfession: {
          tier: effectiveTier,
          alliedCareer: effectiveTier === "ALLIED" ? effectiveAlliedFromSub : null,
        },
        allowedExam: { pathwayId },
        plan: {
          planCode,
          duration: planDuration,
          status: "past_due",
          expiresAt,
          cancelAtPeriodEnd,
        },
      };
    }
  }

  if (
    user.trialStatus === TrialStatus.ACTIVE &&
    user.trialEndsAt &&
    user.trialEndsAt.getTime() > Date.now()
  ) {
    return {
      userId,
      hasPremium: true,
      reason: "active_trial",
      allowedRegion: { country: baseCountry, billingRegionSlug },
      allowedProfession: {
        tier: user.tier,
        alliedCareer: user.tier === "ALLIED" ? effectiveAlliedFromSub : null,
      },
      allowedExam: { pathwayId },
      plan: {
        planCode,
        duration: planDuration,
        status: "active",
        expiresAt: user.trialEndsAt,
        cancelAtPeriodEnd,
      },
    };
  }

  return {
    userId,
    hasPremium: false,
    reason: "no_access",
    allowedRegion: { country: baseCountry, billingRegionSlug },
    allowedProfession: {
      tier: user.tier,
      alliedCareer: user.tier === "ALLIED" ? effectiveAlliedFromSub : null,
    },
    allowedExam: { pathwayId },
    plan: {
      planCode,
      duration: planDuration,
      status: mapSubscriptionPlanStatus(latestSubscription?.status),
      expiresAt,
      cancelAtPeriodEnd,
    },
  };
}

/**
 * Maps DB-backed access to a coarse session flag for UI (JWT / sync-session).
 * Server gates still use {@link getUserAccess} / {@link resolveEntitlement}.
 */
export function subscriptionStatusForSession(
  ua: UserAccess,
): "active" | "grace" | "none" | "past_due" {
  if (ua.hasPremium) {
    if (ua.reason === "grace_period" || ua.reason === "past_due_grace") return "grace";
    return "active";
  }
  if (ua.plan.status === "past_due") return "past_due";
  return "none";
}

/** Narrow legacy shape for question/lesson SQL helpers. */
export function accessScopeFromUserAccess(ua: UserAccess): AccessScope {
  return {
    hasAccess: ua.hasPremium,
    reason: ua.reason,
    tier: ua.allowedProfession.tier,
    country: ua.allowedRegion.country,
    alliedCareer: ua.allowedProfession.alliedCareer,
  };
}

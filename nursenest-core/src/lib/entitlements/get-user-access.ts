import { SubscriptionStatus, TrialStatus, type CountryCode, type TierCode } from "@prisma/client";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import { normalizeCountryCodeForEntitlement } from "@/lib/entitlements/country-code";
import {
  pastDueSubscriptionGrantsPremium,
  readPastDueEntitlementPolicy,
} from "@/lib/entitlements/past-due-policy";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";
import type { AccessScope, SubscriptionPlanStatus, UserAccess } from "./user-access-types";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";

export type { AccessScope, SubscriptionPlanStatus, UserAccess } from "./user-access-types";
export { subscriptionStatusForSession, type SessionSubscriptionStatus } from "./subscription-session-status";

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
  pastDueSince: Date | null;
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
  const baseCountry = normalizeCountryCodeForEntitlement(user.country);

  /** Staff roles: full internal product access — do not run subscription queries or imply a paid Stripe plan. */
  if (isLearnerEntitlementStaffBypassRole(user.role)) {
    return {
      userId,
      hasPremium: true,
      reason: "admin_override",
      allowedRegion: { country: baseCountry, billingRegionSlug: null },
      allowedProfession: {
        tier: user.tier,
        alliedCareer: (user.alliedProfessionKey as AlliedCareerKey) ?? null,
      },
      allowedExam: { pathwayId },
      plan: {
        planCode: null,
        duration: null,
        status: "none",
        expiresAt: null,
        cancelAtPeriodEnd: false,
      },
    };
  }

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
          pastDueSince: true,
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
          pastDueSince: true,
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
      pastDueSince: activeSubscription.pastDueSince,
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

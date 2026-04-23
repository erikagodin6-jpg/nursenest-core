import { cache } from "react";
import { SubscriptionStatus, TrialStatus, type CountryCode, type TierCode, type UserRole } from "@prisma/client";
import {
  buildUserAccessForAdminLearnerQa,
  getVerifiedAdminLearnerQaSimulation,
} from "@/lib/admin/admin-learner-qa-simulation";
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

/** Attach JWT sync fields from the loaded `User` row (see {@link UserAccess.sessionJwt}). */
function withSessionJwt(
  partial: Omit<UserAccess, "sessionJwt">,
  user: { role: UserRole; credentialVersion: number },
): UserAccess {
  return {
    ...partial,
    sessionJwt: { role: user.role, credentialVersion: user.credentialVersion },
  };
}
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

/** Single Prisma select for both subscription entitlement queries — avoids drift between parallel reads. */
const SUBSCRIPTION_ENTITLEMENT_SELECT = {
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
} as const;

/**
 * Max rows read in one round-trip (newest first). If no ACTIVE_LIKE row appears in this window,
 * a narrow fallback query loads the newest ACTIVE_LIKE row (rare accounts with long cancellation history).
 */
const SUBSCRIPTION_HISTORY_WINDOW = 80;

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
 *
 * **Audit matrix** (Stripe ↔ DB ↔ premium ↔ content gates): `entitlement-state-matrix.ts`.
 */
const getUserAccessCached = cache(async function getUserAccessCached(userId: string): Promise<UserAccess> {
  const t0 = performance.now();
  const telemetry = {
    userFound: false,
    subscriptionRowsRead: 0,
    subscriptionQueries: 0,
  };
  try {
    const ua = await getUserAccessCore(userId, telemetry);
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("entitlement", "get_user_access_timing", {
      durationMs,
      slowRead: durationMs >= 400 ? 1 : 0,
      userFound: telemetry.userFound,
      subscriptionRowsRead: telemetry.subscriptionRowsRead,
      subscriptionQueries: telemetry.subscriptionQueries,
      outcome: ua.reason,
    });
    return ua;
  } catch (e) {
    safeServerLog("entitlement", "get_user_access_error", {
      durationMs: Math.round(performance.now() - t0),
      errorName: e instanceof Error ? e.name : typeof e,
    });
    throw e;
  }
});

/**
 * Subscription + trial access for gating. Deduplicated per React request via `cache()` when the same `userId`
 * is resolved multiple times (e.g. `resolveEntitlement` + layout).
 */
export async function getUserAccess(userId: string): Promise<UserAccess> {
  return getUserAccessCached(userId);
}

type EntitlementReadTelemetry = {
  userFound: boolean;
  subscriptionRowsRead: number;
  subscriptionQueries: number;
};

async function getUserAccessCore(
  userId: string,
  telemetry: EntitlementReadTelemetry,
): Promise<UserAccess> {
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
        credentialVersion: true,
      },
    }),
  );

  if (!user) return base;
  telemetry.userFound = true;

  const pathwayId = user.targetExamPathwayId?.trim() || null;
  const baseCountry = normalizeCountryCodeForEntitlement(user.country);

  /** Staff roles: full internal product access — do not run subscription queries or imply a paid Stripe plan. */
  if (isLearnerEntitlementStaffBypassRole(user.role)) {
    const qaSim = await getVerifiedAdminLearnerQaSimulation(userId);
    if (qaSim) {
      safeServerLog("admin_learner_qa", "entitlement_overlay", {
        userIdPrefix: userId.slice(0, 8),
        track: qaSim.track,
        lifecycle: qaSim.lifecycle,
        country: qaSim.country,
        admin_learner_qa_simulated: 1,
        npSpecialty: qaSim.npSpecialty,
        alliedCareer: qaSim.alliedCareer,
        planVariant: qaSim.planVariant,
      });
      return withSessionJwt(buildUserAccessForAdminLearnerQa(qaSim), user);
    }
    return withSessionJwt(
      {
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
      },
      user,
    );
  }

  telemetry.subscriptionQueries = 1;
  const subscriptionRows = await withRetry(() =>
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: SUBSCRIPTION_HISTORY_WINDOW,
      select: SUBSCRIPTION_ENTITLEMENT_SELECT,
    }),
  );
  telemetry.subscriptionRowsRead = subscriptionRows.length;

  let activeSubscription =
    subscriptionRows.find((s) => ACTIVE_LIKE.includes(s.status)) ?? null;
  const latestSubscription: SubscriptionSelect | null = subscriptionRows[0] ?? null;

  if (subscriptionRows.length === SUBSCRIPTION_HISTORY_WINDOW && activeSubscription === null) {
    telemetry.subscriptionQueries = 2;
    const fallbackRows = await withRetry(() =>
      prisma.subscription.findMany({
        where: { userId, status: { in: ACTIVE_LIKE } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: SUBSCRIPTION_ENTITLEMENT_SELECT,
      }),
    );
    const fallbackActive = fallbackRows[0] ?? null;
    if (fallbackActive) {
      activeSubscription = fallbackActive;
    }
  }

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
    return withSessionJwt(
      {
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
      },
      user,
    );
  }

  if (activeSubscription?.status === SubscriptionStatus.GRACE) {
    return withSessionJwt(
      {
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
      },
      user,
    );
  }

  if (activeSubscription?.status === SubscriptionStatus.PAST_DUE) {
    const pastDuePolicy = readPastDueEntitlementPolicy();
    const grantPastDue = pastDueSubscriptionGrantsPremium(pastDuePolicy, {
      updatedAt: activeSubscription.updatedAt,
      currentPeriodEnd: activeSubscription.currentPeriodEnd,
      pastDueSince: activeSubscription.pastDueSince,
    });
    if (grantPastDue) {
      return withSessionJwt(
        {
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
        },
        user,
      );
    }
  }

  if (
    user.trialStatus === TrialStatus.ACTIVE &&
    user.trialEndsAt &&
    user.trialEndsAt.getTime() > Date.now()
  ) {
    return withSessionJwt(
      {
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
      },
      user,
    );
  }

  return withSessionJwt(
    {
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
    },
    user,
  );
}

/** Narrow legacy shape for question/lesson SQL helpers. */
export function accessScopeFromUserAccess(ua: UserAccess): AccessScope {
  return {
    hasAccess: ua.hasPremium,
    reason: ua.reason,
    tier: ua.allowedProfession.tier,
    country: ua.allowedRegion.country,
    alliedCareer: ua.allowedProfession.alliedCareer,
    ...(ua.adminLearnerQaSimulation === true ? { adminLearnerQaSimulation: true as const } : {}),
  };
}

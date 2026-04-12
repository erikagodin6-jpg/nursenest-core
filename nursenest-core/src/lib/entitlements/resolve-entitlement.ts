import { SubscriptionStatus, TrialStatus, type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isLearnerEntitlementAdminOverrideRole } from "@/lib/auth/staff-roles";
import { normalizeCountryCodeForEntitlement } from "@/lib/entitlements/country-code";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";

export type AccessScope = {
  hasAccess: boolean;
  reason: "active_subscription" | "admin_override" | "grace_period" | "active_trial" | "no_access";
  tier: TierCode | null;
  country: CountryCode | null;
  /** When tier is ALLIED, the specific career line the user purchased. */
  alliedCareer: AlliedCareerKey | null;
};

export async function resolveEntitlement(userId: string): Promise<AccessScope> {
  const noAccess: AccessScope = { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null };
  if (!isDatabaseUrlConfigured()) return noAccess;

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
      },
    }),
  );

  if (!user) return noAccess;

  if (isLearnerEntitlementAdminOverrideRole(user.role)) {
    return {
      hasAccess: true,
      reason: "admin_override",
      tier: user.tier,
      country: normalizeCountryCodeForEntitlement(user.country),
      alliedCareer: (user.alliedProfessionKey as AlliedCareerKey) ?? null,
    };
  }

  const subscription = await withRetry(() =>
    prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE] },
      },
      orderBy: { createdAt: "desc" },
      select: { status: true, planTier: true, planCountry: true, alliedCareer: true },
    }),
  );

  const baseCountry = normalizeCountryCodeForEntitlement(user.country);
  const { tier: effectiveTier, country: effectiveCountry } = effectiveTierCountryForAccess(user, subscription);
  const effectiveAlliedCareer = (subscription?.alliedCareer as AlliedCareerKey)
    ?? (user.alliedProfessionKey as AlliedCareerKey)
    ?? null;

  if (subscription?.planTier && subscription.planTier !== user.tier) {
    safeServerLog("entitlement", "user_tier_subscription_plan_mismatch", {
      userTier: String(user.tier),
      planTier: String(subscription.planTier),
    });
  }

  if (subscription?.status === SubscriptionStatus.ACTIVE) {
    return {
      hasAccess: true,
      reason: "active_subscription",
      tier: effectiveTier,
      country: effectiveCountry,
      alliedCareer: effectiveTier === "ALLIED" ? effectiveAlliedCareer : null,
    };
  }

  if (subscription?.status === SubscriptionStatus.GRACE || subscription?.status === SubscriptionStatus.PAST_DUE) {
    return {
      hasAccess: true,
      reason: "grace_period",
      tier: effectiveTier,
      country: effectiveCountry,
      alliedCareer: effectiveTier === "ALLIED" ? effectiveAlliedCareer : null,
    };
  }

  if (
    user.trialStatus === TrialStatus.ACTIVE &&
    user.trialEndsAt &&
    user.trialEndsAt.getTime() > Date.now()
  ) {
    return {
      hasAccess: true,
      reason: "active_trial",
      tier: user.tier,
      country: baseCountry,
      alliedCareer: user.tier === "ALLIED" ? effectiveAlliedCareer : null,
    };
  }

  return { hasAccess: false, reason: "no_access", tier: user.tier, country: baseCountry, alliedCareer: null };
}

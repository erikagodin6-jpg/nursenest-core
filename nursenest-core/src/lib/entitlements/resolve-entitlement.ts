import { SubscriptionStatus, TrialStatus, type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isLearnerEntitlementAdminOverrideRole } from "@/lib/auth/staff-roles";
import { normalizeCountryCodeForEntitlement } from "@/lib/entitlements/country-code";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";

export type AccessScope = {
  hasAccess: boolean;
  reason: "active_subscription" | "admin_override" | "grace_period" | "active_trial" | "no_access";
  tier: TierCode | null;
  country: CountryCode | null;
};

export async function resolveEntitlement(userId: string): Promise<AccessScope> {
  if (!isDatabaseUrlConfigured()) {
    return { hasAccess: false, reason: "no_access", tier: null, country: null };
  }

  const user = await withRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, tier: true, country: true, trialStatus: true, trialEndsAt: true },
    }),
  );

  if (!user) {
    return { hasAccess: false, reason: "no_access", tier: null, country: null };
  }

  if (isLearnerEntitlementAdminOverrideRole(user.role)) {
    return {
      hasAccess: true,
      reason: "admin_override",
      tier: user.tier,
      country: normalizeCountryCodeForEntitlement(user.country),
    };
  }

  const subscription = await withRetry(() =>
    prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE] },
      },
      orderBy: { createdAt: "desc" },
      select: { status: true, planTier: true, planCountry: true },
    }),
  );

  const baseCountry = normalizeCountryCodeForEntitlement(user.country);
  const { tier: effectiveTier, country: effectiveCountry } = effectiveTierCountryForAccess(user, subscription);

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
    };
  }

  if (subscription?.status === SubscriptionStatus.GRACE || subscription?.status === SubscriptionStatus.PAST_DUE) {
    return {
      hasAccess: true,
      reason: "grace_period",
      tier: effectiveTier,
      country: effectiveCountry,
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
    };
  }

  return { hasAccess: false, reason: "no_access", tier: user.tier, country: baseCountry };
}

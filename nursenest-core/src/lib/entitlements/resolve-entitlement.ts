import { SubscriptionStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isLearnerEntitlementAdminOverrideRole } from "@/lib/auth/staff-roles";
import { normalizeCountryCodeForEntitlement } from "@/lib/entitlements/country-code";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";

export type AccessScope = {
  hasAccess: boolean;
  reason: "active_subscription" | "admin_override" | "grace_period" | "no_access";
  tier: string | null;
  country: string | null;
};

export async function resolveEntitlement(userId: string): Promise<AccessScope> {
  if (!isDatabaseUrlConfigured()) {
    return { hasAccess: false, reason: "no_access", tier: null, country: null };
  }

  const user = await withRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, tier: true, country: true },
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
      where: { userId, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
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
      tier: effectiveTier as string,
      country: effectiveCountry,
    };
  }

  if (subscription?.status === SubscriptionStatus.GRACE) {
    return {
      hasAccess: true,
      reason: "grace_period",
      tier: effectiveTier as string,
      country: effectiveCountry,
    };
  }

  return { hasAccess: false, reason: "no_access", tier: user.tier as string, country: baseCountry };
}

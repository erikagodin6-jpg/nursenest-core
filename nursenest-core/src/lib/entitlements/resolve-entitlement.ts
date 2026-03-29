import { SubscriptionStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
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

  if (user.role === UserRole.ADMIN) {
    return {
      hasAccess: true,
      reason: "admin_override",
      tier: user.tier,
      country: user.country,
    };
  }

  const subscription = await withRetry(() =>
    prisma.subscription.findFirst({
      where: { userId, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    }),
  );

  if (subscription?.status === SubscriptionStatus.ACTIVE) {
    return { hasAccess: true, reason: "active_subscription", tier: user.tier, country: user.country };
  }

  if (subscription?.status === SubscriptionStatus.GRACE) {
    return { hasAccess: true, reason: "grace_period", tier: user.tier, country: user.country };
  }

  return { hasAccess: false, reason: "no_access", tier: user.tier, country: user.country };
}

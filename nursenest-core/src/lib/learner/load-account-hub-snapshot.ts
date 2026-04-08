import "server-only";

import { TrialStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadPremiumDashboardSnapshot, type PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance, type TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";

export type AccountHubUserRow = {
  email: string | null;
  name: string | null;
  country: string;
  tier: string;
  trialStatus: TrialStatus;
  trialEndsAt: Date | null;
  trialStartedAt: Date | null;
  passwordHash: string | null;
};

export type AccountHubSubscriptionRow = {
  status: string;
  planTier: string | null;
  planCountry: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
} | null;

export type AccountHubBundle = {
  userRow: AccountHubUserRow | null;
  subscription: AccountHubSubscriptionRow;
  entitlement: PageEntitlementResult;
  premiumSnapshot: PremiumDashboardSnapshot | null;
  topicPerf: TopicPerformanceSnapshot | null;
};

export async function loadAccountHubBundle(userId: string): Promise<AccountHubBundle | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const userRow = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      country: true,
      tier: true,
      trialStatus: true,
      trialEndsAt: true,
      trialStartedAt: true,
      passwordHash: true,
    },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      status: true,
      planTier: true,
      planCountry: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      createdAt: true,
    },
  });

  const entitlement = await resolveEntitlementForPage(userId);

  let premiumSnapshot: PremiumDashboardSnapshot | null = null;
  let topicPerf: TopicPerformanceSnapshot | null = null;

  if (entitlement !== "error" && entitlement.hasAccess) {
    try {
      premiumSnapshot = await loadPremiumDashboardSnapshot(userId, entitlement);
    } catch {
      premiumSnapshot = null;
    }
    try {
      topicPerf = await loadUnifiedTopicPerformance(userId, entitlement, 12);
    } catch {
      topicPerf = null;
    }
  }

  return { userRow, subscription, entitlement, premiumSnapshot, topicPerf };
}

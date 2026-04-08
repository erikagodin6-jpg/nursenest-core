import "server-only";

import { type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  listPathwayPicksForProfile,
  subscriptionLocksProfileRegionAndTier,
  type PathwayPickOption,
} from "@/lib/learner/personal-profile-policy";

export type PersonalProfilePathwayPreview = {
  country: CountryCode;
  tier: TierCode;
};

export type PersonalProfilePayload = {
  name: string;
  email: string;
  country: CountryCode;
  tier: TierCode;
  learnerPath: string | null;
  studyGoal: string | null;
  examFocus: string | null;
  examDate: string | null;
  examDatePlanType: string | null;
  targetExamPathwayId: string | null;
  studyCadencePreference: string | null;
  regionTierLocked: boolean;
  lockReason: "subscription_plan" | null;
  pathwayOptions: PathwayPickOption[];
  entitlementVerifyFailed: boolean;
  subscriberAccess: boolean;
};

export async function loadPersonalProfilePayload(
  userId: string,
  pathwayPreview?: PersonalProfilePathwayPreview | null,
): Promise<PersonalProfilePayload | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const [user, subscription, entitlement] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        country: true,
        tier: true,
        learnerPath: true,
        studyGoal: true,
        examFocus: true,
        examDate: true,
        examDatePlanType: true,
        targetExamPathwayId: true,
        studyCadencePreference: true,
      },
    }),
    prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { status: true, planTier: true, planCountry: true },
    }),
    resolveEntitlementForPage(userId),
  ]);

  if (!user) return null;

  const regionTierLocked = subscriptionLocksProfileRegionAndTier(subscription);
  const subscriberAccess = entitlement !== "error" && entitlement.hasAccess;
  const scopeForPathways: AccessScope =
    entitlement !== "error"
      ? entitlement
      : { hasAccess: false, reason: "no_access", tier: user.tier, country: user.country };
  const pathwayTierCountry =
    !regionTierLocked && pathwayPreview ? pathwayPreview : { country: user.country, tier: user.tier };
  const pathwayOptions = listPathwayPicksForProfile(
    scopeForPathways,
    pathwayTierCountry.tier,
    pathwayTierCountry.country,
    subscriberAccess,
  );

  return {
    name: user.name,
    email: user.email,
    country: user.country,
    tier: user.tier,
    learnerPath: user.learnerPath,
    studyGoal: user.studyGoal,
    examFocus: user.examFocus,
    examDate: user.examDate?.toISOString() ?? null,
    examDatePlanType: user.examDatePlanType ? user.examDatePlanType.toLowerCase() : null,
    targetExamPathwayId: user.targetExamPathwayId,
    studyCadencePreference: user.studyCadencePreference,
    regionTierLocked,
    lockReason: regionTierLocked ? "subscription_plan" : null,
    pathwayOptions,
    entitlementVerifyFailed: entitlement === "error",
    subscriberAccess,
  };
}

import "server-only";

import { type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
import {
  listPathwayPicksForProfile,
  subscriptionLocksProfileRegionAndTier,
  type PathwayPickOption,
} from "@/lib/learner/personal-profile-policy";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  parseMeasurementPreference,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";
import { pickLatestBaseSubscription } from "@/lib/subscriptions/subscription-plan-codes";

export type PersonalProfilePathwayPreview = {
  country: CountryCode;
  tier: TierCode;
};

export type PersonalProfilePayload = {
  name: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
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
  /** Daily bank question target; null means product default. */
  dailyQuestionGoal: number | null;
  /** Clinical units preference when set (`metric` | `imperial`). */
  measurementPreference: MeasurementPreference | null;
  regionTierLocked: boolean;
  lockReason: "subscription_plan" | null;
  pathwayOptions: PathwayPickOption[];
  /** Display for `targetExamPathwayId` when not in `pathwayOptions` (server-resolved, no client catalog). */
  targetExamPathwayLabel: string | null;
  entitlementVerifyFailed: boolean;
  subscriberAccess: boolean;
};

export async function loadPersonalProfilePayload(
  userId: string,
  pathwayPreview?: PersonalProfilePathwayPreview | null,
): Promise<PersonalProfilePayload | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const [user, subscriptionRows, entitlement] = await Promise.all([
    loadLearnerRequestUser(userId),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        status: true,
        planTier: true,
        planCountry: true,
        planCode: true,
      },
    }),
    resolveEntitlementForPage(userId),
  ]);

  if (!user) return null;

  const subscription = pickLatestBaseSubscription(subscriptionRows);
  const regionTierLocked = subscriptionLocksProfileRegionAndTier(subscription);
  const subscriberAccess = entitlement !== "error" && entitlement.hasAccess;
  const scopeForPathways: AccessScope =
    entitlement !== "error"
      ? entitlement
      : {
          hasAccess: false,
          reason: "no_access",
          tier: user.tier,
          country: user.country,
          alliedCareer: null,
        };
  const pathwayTierCountry =
    !regionTierLocked && pathwayPreview
      ? pathwayPreview
      : { country: user.country, tier: user.tier };
  const pathwayOptions = await listPathwayPicksForProfile(
    scopeForPathways,
    pathwayTierCountry.tier,
    pathwayTierCountry.country,
    subscriberAccess,
  );

  const targetId = user.targetExamPathwayId?.trim() ?? null;
  let targetExamPathwayLabel: string | null = null;
  if (targetId) {
    const hit = pathwayOptions.find((o) => o.id === targetId);
    if (hit) targetExamPathwayLabel = hit.label;
    else {
      const p = getExamPathwayById(targetId);
      targetExamPathwayLabel = p ? p.shortName || p.displayName : targetId;
    }
  }

  const measurementPreference = parseMeasurementPreference(
    user.measurementPreference,
  );

  return {
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    email: user.email,
    country: user.country,
    tier: user.tier,
    learnerPath: user.learnerPath,
    studyGoal: user.studyGoal,
    examFocus: user.examFocus,
    examDate: user.examDate?.toISOString() ?? null,
    examDatePlanType: user.examDatePlanType
      ? user.examDatePlanType.toLowerCase()
      : null,
    targetExamPathwayId: user.targetExamPathwayId,
    studyCadencePreference: user.studyCadencePreference,
    dailyQuestionGoal: user.dailyQuestionGoal,
    measurementPreference,
    regionTierLocked,
    lockReason: regionTierLocked ? "subscription_plan" : null,
    pathwayOptions,
    targetExamPathwayLabel,
    entitlementVerifyFailed: entitlement === "error",
    subscriberAccess,
  };
}

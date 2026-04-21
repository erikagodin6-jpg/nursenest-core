import { ExamFamily, type CountryCode, type TierCode } from "@prisma/client";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export { pathwayAllowsCatAdaptiveStart, subscriptionCoversPathwayBase } from "./pathway-entitlements-policy";

/**
 * Phase 1: subscription still uses Prisma `TierCode` + `CountryCode`.
 * Pathway compatibility = same stripe tier + same country + active subscription (or admin).
 * NP specialties share the NP tier until Stripe supports per-pathway prices — use `User.learnerPath` = pathway.id to pick content.
 */
export async function listPathwaysCompatibleWithSubscription(scope: AccessScope): Promise<ExamPathwayDefinition[]> {
  const { EXAM_PATHWAYS } = await import("@/lib/exam-pathways/exam-pathways-catalog");
  if (!scope.hasAccess || scope.reason === "no_access") return [];
  const tier = scope.tier as TierCode | null;
  const country = scope.country as CountryCode | null;
  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    if (!country) return EXAM_PATHWAYS.filter((p) => p.status !== "hidden");
    return EXAM_PATHWAYS.filter((p) => p.status !== "hidden" && p.countryCode === country);
  }
  if (!tier || !country) return [];
  const allowedTiers = accessibleTiersForUserTier(tier);
  return EXAM_PATHWAYS.filter(
    (p) => allowedTiers.includes(p.stripeTier) && p.countryCode === country && p.status !== "hidden",
  );
}

/**
 * When User.learnerPath is set to a registry id, scope NP (and other) content to that track.
 * Returns null if unset or unknown id.
 */
export async function pathwayFromLearnerPath(
  learnerPath: string | null | undefined,
): Promise<ExamPathwayDefinition | undefined> {
  if (!learnerPath || learnerPath.trim().length === 0) return undefined;
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-pathways-catalog");
  return getExamPathwayById(learnerPath.trim());
}

/**
 * Default pathway for practice-test builder: profile pathway if entitled, else RN NCLEX-RN for country, else first compatible.
 */
export async function defaultPracticeTestPathwayId(
  compatible: ExamPathwayDefinition[],
  learnerPath: string | null | undefined,
  countryHint: string | null,
): Promise<string | null> {
  if (compatible.length === 0) return null;
  const fromLp = await pathwayFromLearnerPath(learnerPath);
  if (fromLp && compatible.some((p) => p.id === fromLp.id)) {
    return fromLp.id;
  }
  const nclexRn = compatible.find(
    (p) =>
      p.examFamily === ExamFamily.NCLEX_RN &&
      p.roleTrack === "rn" &&
      (countryHint ? p.countryCode === countryHint : true),
  );
  if (nclexRn) return nclexRn.id;
  return compatible[0]!.id;
}

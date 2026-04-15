import { ExamFamily, type CountryCode, type TierCode } from "@prisma/client";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Whether pathway-scoped adaptive (CAT) **practice** may be started for this catalog row.
 * Waitlist / upcoming tracks stay discoverable for lessons and the question bank, but CAT stays off until the product is ready.
 */
export function pathwayAllowsCatAdaptiveStart(pathway: ExamPathwayDefinition): boolean {
  if (pathway.status === "hidden") return false;
  if (pathway.acquisitionMode === "info_only") return false;
  if (pathway.status === "upcoming" && pathway.acquisitionMode === "waitlist") return false;
  return true;
}

/**
 * Phase 1: subscription still uses Prisma `TierCode` + `CountryCode`.
 * Pathway compatibility = same stripe tier + same country + active subscription (or admin).
 * NP specialties share the NP tier until Stripe supports per-pathway prices — use `User.learnerPath` = pathway.id to pick content.
 */
export function listPathwaysCompatibleWithSubscription(scope: AccessScope): ExamPathwayDefinition[] {
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
 * True if the learner may access this pathway hub: same country, active subscription (or admin),
 * and pathway tier is within the learner's ladder (e.g. RN may open RPN or LVN/LPN hubs, not vice versa).
 * NP includes all nursing tiers; allied stays isolated to allied pathways.
 *
 * If `scope.country` is null or not CA/US (see {@link resolveEntitlement}), access is denied.
 * That avoids false matches when profile country is missing or malformed.
 */
export function subscriptionCoversPathwayBase(scope: AccessScope, pathway: ExamPathwayDefinition): boolean {
  if (!scope.hasAccess) return false;
  if (pathway.status === "hidden") return false;
  const tier = scope.tier as TierCode | null;
  const country = scope.country as CountryCode | null;
  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    if (!country) return true;
    return pathway.countryCode === country;
  }
  if (!tier || !country) return false;
  if (country !== pathway.countryCode) return false;
  return accessibleTiersForUserTier(tier).includes(pathway.stripeTier);
}

/**
 * When User.learnerPath is set to a registry id, scope NP (and other) content to that track.
 * Returns null if unset or unknown id.
 */
export function pathwayFromLearnerPath(learnerPath: string | null | undefined): ExamPathwayDefinition | undefined {
  if (!learnerPath || learnerPath.trim().length === 0) return undefined;
  return getExamPathwayById(learnerPath.trim());
}

/**
 * Default pathway for practice-test builder: profile pathway if entitled, else RN NCLEX-RN for country, else first compatible.
 */
export function defaultPracticeTestPathwayId(
  compatible: ExamPathwayDefinition[],
  learnerPath: string | null | undefined,
  countryHint: string | null,
): string | null {
  if (compatible.length === 0) return null;
  const fromLp = pathwayFromLearnerPath(learnerPath);
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

import { type CountryCode, type TierCode } from "@prisma/client";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
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
 * True if the learner may access this pathway hub: same country, active subscription (or admin),
 * and pathway tier is within the learner's ladder (e.g. RN may open RPN or LVN/LPN hubs, not vice versa).
 * NP includes all nursing tiers; allied stays isolated to allied pathways.
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

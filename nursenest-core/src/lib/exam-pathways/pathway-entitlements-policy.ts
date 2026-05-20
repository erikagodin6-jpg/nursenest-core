import { type CountryCode, type TierCode } from "@prisma/client";
import { accessibleTiersForUserTier } from "@/lib/entitlements/content-access-scope";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayUsesCatEngine } from "@/lib/testing/testing-model-pathway-map";

/**
 * Whether pathway-scoped adaptive (CAT) **practice** may be started for this catalog row.
 * LOFT pathways (CNPLE) never use the CAT engine — simulation is case/linear only.
 */
export function pathwayAllowsCatAdaptiveStart(pathway: ExamPathwayDefinition): boolean {
  if (!pathwayUsesCatEngine(pathway.id)) return false;
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
  /** Staff/admin: inspect any visible pathway worldwide (tier/country profile must not shrink the catalog). */
  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) {
    return true;
  }
  if (!tier || !country) return false;
  if (country !== pathway.countryCode) return false;
  return accessibleTiersForUserTier(tier).includes(pathway.stripeTier);
}

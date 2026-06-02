import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";

export type NpCatGuardResult =
  | { ok: true; isAdminOverride: boolean }
  | { ok: false; code: "pathway_not_in_plan" };

/**
 * NP CAT session entitlement check — second gate after requireSubscriberSession().
 *
 * A passing generic subscriber check is necessary but not sufficient: the user must also hold an
 * NP-tier subscription. RN, RPN, and Allied active subscribers are denied with pathway_not_in_plan.
 * Staff admin_override bypasses the tier check; caller is responsible for logging the bypass.
 */
export function assertNpCatPathwayEntitlement(entitlement: AccessScope): NpCatGuardResult {
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return { ok: true, isAdminOverride: true };
  }
  if (entitlement.tier === "NP") {
    return { ok: true, isAdminOverride: false };
  }
  return { ok: false, code: "pathway_not_in_plan" };
}

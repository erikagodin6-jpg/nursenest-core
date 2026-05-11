import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { RT_VENTILATOR_BANK_TAG } from "@/lib/rt-ventilator/rt-ventilator-content-taxonomy";
import {
  canAccessRtVentilatorModuleForTierAndProfession,
  isRtVentilatorLearnerModuleEnabled,
} from "@/lib/rt-ventilator/rt-ventilator-module-config";

/**
 * Exclude `module:rt-ventilator` bank rows from general CAT/practice/flashcard pools unless the learner
 * may use the premium RT ventilator module (paid allied RRT / respiratory entitlement), or staff QA bypass.
 * When the learner module feature flag is off, tagged rows never appear in general pools.
 */
export function rtVentilatorPremiumBankGateWhere(entitlement: AccessScope): Prisma.ExamQuestionWhereInput {
  if (!isRtVentilatorLearnerModuleEnabled()) {
    return { NOT: { tags: { has: RT_VENTILATOR_BANK_TAG } } };
  }
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) {
    return {};
  }
  const allowVentilatorBank =
    entitlement.hasAccess &&
    canAccessRtVentilatorModuleForTierAndProfession({
      tier: entitlement.tier ?? null,
      alliedCareer: entitlement.alliedCareer,
    });
  if (allowVentilatorBank) return {};
  return { NOT: { tags: { has: RT_VENTILATOR_BANK_TAG } } };
}

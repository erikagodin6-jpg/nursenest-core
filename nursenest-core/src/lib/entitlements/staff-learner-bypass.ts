import type { AccessScope } from "./user-access-types";

/**
 * Legacy reason string from {@link getUserAccess} when the user qualifies via
 * {@link isLearnerEntitlementStaffBypassRole} — not a paid Stripe subscription.
 */
export const STAFF_LEARNER_ENTITLEMENT_REASON = "admin_override" as const;

/**
 * Single check for “staff/student-ops bypass” on resolved {@link AccessScope} / entitlement objects.
 * Prefer this over scattered `reason === "admin_override"` string comparisons.
 */
export function accessScopeIsStaffLearnerEntitlementBypass(
  entitlement: Pick<AccessScope, "reason" | "hasAccess"> | null | undefined,
): boolean {
  return Boolean(entitlement?.hasAccess && entitlement.reason === STAFF_LEARNER_ENTITLEMENT_REASON);
}

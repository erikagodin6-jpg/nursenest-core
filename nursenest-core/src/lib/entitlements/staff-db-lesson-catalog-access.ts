import type { StaffSession } from "@/lib/auth/staff-session";
import type { PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

/**
 * Verified DB-backed staff/admin session (see {@link getStaffSession}).
 * Anonymous users never receive a staff session object.
 */
export function staffDbSessionGrantsFullLessonCatalogAccess(staff: StaffSession | null | undefined): boolean {
  return Boolean(staff);
}

/**
 * Learner lesson catalog (pathway + legacy app lessons): paid or trial entitlement, or verified staff.
 * Aligns `/app/lessons` detail with marketing pathway lessons, which already ORs `staffFullLessonAccess`.
 *
 * Supersedes Admin Learner QA unpaid simulation for lesson read surfaces only: staff still see full lessons
 * while QA continues to shape other subscriber-scoped UX where wired separately.
 */
export function effectiveLessonCatalogHasAccess(
  entitlement: PageEntitlementResult | AccessScope | "error",
  staff: StaffSession | null | undefined,
): boolean {
  if (staffDbSessionGrantsFullLessonCatalogAccess(staff)) return true;
  if (entitlement === "error") return false;
  return entitlement.hasAccess;
}

/**
 * Normalizes {@link resolveEntitlementForPage} output for **lesson catalog / detail** routes.
 * - Non-staff + `"error"` stays `"error"` (verify-failed UI).
 * - Verified staff + `"error"` → synthetic `admin_override` scope so downstream code never dereferences `"error"`.
 * - Verified staff + unpaid `AccessScope` → `hasAccess: true` with `admin_override` (read-only catalog parity with marketing).
 */
export function accessScopeForLessonCatalogPages(
  entitlement: PageEntitlementResult,
  staff: StaffSession | null | undefined,
): AccessScope | "error" {
  if (entitlement === "error") {
    return staffDbSessionGrantsFullLessonCatalogAccess(staff)
      ? {
          hasAccess: true,
          reason: "admin_override",
          tier: null,
          country: null,
          alliedCareer: null,
        }
      : "error";
  }
  if (staffDbSessionGrantsFullLessonCatalogAccess(staff) && !entitlement.hasAccess) {
    return { ...entitlement, hasAccess: true, reason: "admin_override" };
  }
  return entitlement;
}

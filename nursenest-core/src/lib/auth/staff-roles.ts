import { UserRole } from "@prisma/client";

/** Resolved tier for RBAC (legacy `ADMIN` maps to `super`). */
export type StaffTier = "super" | "content" | "support";

/** String keys only — avoids Prisma enum object identity issues in `Set.has`. */
const STAFF_ROLE_STRINGS = new Set([
  "ADMIN",
  "SUPER_ADMIN",
  "CONTENT_ADMIN",
  "SUPPORT_ADMIN",
]);

export function isStaffRole(role: UserRole | string | null | undefined): boolean {
  if (role == null || role === "") return false;
  const normalized = String(role).trim().toUpperCase();
  return STAFF_ROLE_STRINGS.has(normalized);
}

export function staffTierFromRole(role: UserRole): StaffTier {
  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return "super";
    case UserRole.CONTENT_ADMIN:
      return "content";
    case UserRole.SUPPORT_ADMIN:
      return "support";
    case UserRole.LEARNER:
      // Should never be used for staff session — narrowest tier if mis-invoked.
      return "support";
  }
}

/**
 * Staff roles bypass learner subscription/paywall checks for QA, support, and internal preview.
 * This is **not** a paid subscription — {@link getUserAccess} sets `reason: "admin_override"` (legacy name).
 *
 * Use {@link isStaffRole} for route RBAC; use this only where learner **entitlement** must mirror subscribers.
 */
export function isLearnerEntitlementStaffBypassRole(role: UserRole | string | null | undefined): boolean {
  return isStaffRole(role);
}

/**
 * @deprecated Prefer {@link isLearnerEntitlementStaffBypassRole} — behavior is identical (all staff roles).
 */
export function isLearnerEntitlementAdminOverrideRole(role: UserRole | string | null | undefined): boolean {
  return isLearnerEntitlementStaffBypassRole(role);
}

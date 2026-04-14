import { UserRole } from "@prisma/client";

/** Resolved tier for RBAC (legacy `ADMIN` maps to `super`). */
export type StaffTier = "super" | "content" | "support";

const STAFF_ROLES: ReadonlySet<UserRole> = new Set([
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.CONTENT_ADMIN,
  UserRole.SUPPORT_ADMIN,
]);

export function isStaffRole(role: UserRole | string | null | undefined): boolean {
  if (role == null || role === "") return false;
  const normalized = String(role).trim().toUpperCase();
  return STAFF_ROLES.has(normalized as UserRole);
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
    default:
      return "super";
  }
}

/**
 * Learner-app entitlement bypass (full preview / subscriber surfaces) — same as legacy ADMIN.
 * Support staff do not get automatic premium; they use normal subscription for learner routes.
 */
export function isLearnerEntitlementAdminOverrideRole(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN || role === UserRole.CONTENT_ADMIN;
}

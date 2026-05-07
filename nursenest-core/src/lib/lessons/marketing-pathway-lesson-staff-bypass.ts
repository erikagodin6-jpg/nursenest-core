import type { DbUserRoleRecord } from "@/lib/auth/admin-role-source";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";

/**
 * Marketing pathway lesson detail: full canonical lesson bodies for DB-backed staff/admin roles.
 * Matches {@link isLearnerEntitlementStaffBypassRole} — same role set as `/app` staff surfaces.
 *
 * Production resolves staff via {@link getStaffSession} (retry + DB source of truth). This helper stays pure for tests.
 */
export function marketingPathwayLessonStaffFullBodyAccess(roleRow: DbUserRoleRecord | null): boolean {
  return roleRow != null && isLearnerEntitlementStaffBypassRole(roleRow.role);
}

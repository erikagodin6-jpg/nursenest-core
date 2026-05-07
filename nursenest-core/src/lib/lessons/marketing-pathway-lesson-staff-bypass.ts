import type { DbUserRoleRecord } from "@/lib/auth/admin-role-source";

/**
 * Marketing pathway lesson detail: full canonical lesson bodies for DB-backed staff/admin roles.
 * Matches {@link loadUserRoleFromDbIdentity} / {@link isLearnerEntitlementStaffBypassRole} — same role set as `/app` staff surfaces.
 *
 * Kept pure for unit tests; server loaders resolve {@link DbUserRoleRecord} from the signed-in user id or email.
 */
export function marketingPathwayLessonStaffFullBodyAccess(roleRow: DbUserRoleRecord | null): boolean {
  return Boolean(roleRow?.isAdmin);
}

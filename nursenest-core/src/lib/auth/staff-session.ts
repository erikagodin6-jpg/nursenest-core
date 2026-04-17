import "server-only";
import { cache } from "react";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { loadUserRoleFromDbIdentity } from "@/lib/auth/admin-role-source";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { StaffTier } from "@/lib/auth/staff-roles";

export type StaffSession = {
  userId: string;
  role: UserRole;
  tier: StaffTier;
};

function adminAccessDebug(): boolean {
  return process.env.ADMIN_ACCESS_DEBUG === "1" || process.env.ADMIN_ACCESS_DEBUG === "true";
}

/**
 * Database is source of truth for staff role (JWT may lag after promotion).
 * Resolves `userId` from `session.user.id`, or from email when id is missing (legacy / partial JWT).
 */
async function loadStaffSession(): Promise<StaffSession | null> {
  const session = await auth();
  const su = session?.user as { id?: string; email?: string | null } | undefined;
  let userId = typeof su?.id === "string" && su.id.trim().length > 0 ? su.id.trim() : undefined;
  const emailRaw = typeof su?.email === "string" && su.email.trim().length > 0 ? su.email.trim() : null;

  if (!userId) {
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "staff_session_no_user_id", {
        hasEmail: Boolean(emailRaw),
      });
    }
    return null;
  }

  try {
    const row = await loadUserRoleFromDbIdentity({ userId, email: emailRaw });
    if (!row?.isAdmin || !row.tier) {
      if (adminAccessDebug()) {
        safeServerLog("admin_access", "staff_session_not_staff", {
          userIdPrefix: userId.slice(0, 8),
          role: row?.role ?? "missing",
        });
      }
      return null;
    }
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "staff_session_ok", {
        userIdPrefix: userId.slice(0, 8),
        role: row.role,
        tier: row.tier,
      });
    }
    return {
      userId: row.userId,
      role: row.role,
      tier: row.tier,
    };
  } catch {
    return null;
  }
}

/** One Prisma read per request when `requireAdmin` + admin pages both need staff tier. */
export const getStaffSession = cache(loadStaffSession);

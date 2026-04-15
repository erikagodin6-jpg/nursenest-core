import "server-only";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isStaffRole, staffTierFromRole, type StaffTier } from "@/lib/auth/staff-roles";

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
export async function getStaffSession(): Promise<StaffSession | null> {
  const session = await auth();
  const su = session?.user as { id?: string; email?: string | null } | undefined;
  let userId = typeof su?.id === "string" && su.id.trim().length > 0 ? su.id.trim() : undefined;
  const emailRaw = typeof su?.email === "string" && su.email.trim().length > 0 ? su.email.trim() : null;

  if (!userId && emailRaw && isDatabaseUrlConfigured()) {
    try {
      const byEmail = await prisma.user.findFirst({
        where: { email: { equals: emailRaw, mode: "insensitive" } },
        select: { id: true },
      });
      userId = byEmail?.id;
      if (adminAccessDebug() && userId) {
        safeServerLog("admin_access", "staff_session_id_from_email", { userIdPrefix: userId.slice(0, 8) });
      }
    } catch {
      /* ignore */
    }
  }

  if (!userId) {
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "staff_session_no_user_id", {
        hasEmail: Boolean(emailRaw),
      });
    }
    return null;
  }
  if (!isDatabaseUrlConfigured()) return null;

  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!row || !isStaffRole(row.role)) {
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
        tier: staffTierFromRole(row.role),
      });
    }
    return {
      userId,
      role: row.role,
      tier: staffTierFromRole(row.role),
    };
  } catch {
    return null;
  }
}

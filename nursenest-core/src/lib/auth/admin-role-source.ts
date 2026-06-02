import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isAdminRole, staffTierFromRole, type StaffTier } from "@/lib/auth/staff-roles";

export type DbUserRoleRecord = {
  userId: string;
  role: UserRole;
  isAdmin: boolean;
  tier: StaffTier | null;
};

type RoleIdentity = {
  userId?: string | null;
  email?: string | null;
};

export async function loadUserRoleFromDbIdentity(identity: RoleIdentity): Promise<DbUserRoleRecord | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const userId = identity.userId?.trim() || null;
  const emailRaw = identity.email?.trim() || null;
  const email = emailRaw ? emailRaw.toLowerCase() : null;

  const byId = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      })
    : null;

  const row =
    byId ??
    (email
      ? await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          select: { id: true, role: true },
        })
      : null);

  if (!row) return null;

  const isAdmin = isAdminRole(row.role);
  return {
    userId: row.id,
    role: row.role,
    isAdmin,
    tier: isAdmin ? staffTierFromRole(row.role) : null,
  };
}

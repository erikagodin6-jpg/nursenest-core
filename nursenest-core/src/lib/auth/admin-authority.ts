import "server-only";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isStaffRole } from "@/lib/auth/staff-roles";

/**
 * JWT `role` can lag behind Prisma after promotion until the next sign-in.
 * Single primary-key lookup when session token still shows LEARNER.
 */
export async function userHasStaffRoleInDatabase(userId: string): Promise<boolean> {
  if (!isDatabaseUrlConfigured()) return false;
  try {
    const row = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    return row != null && isStaffRole(row.role);
  } catch {
    return false;
  }
}

/** @deprecated Use userHasStaffRoleInDatabase */
export const userHasAdminRoleInDatabase = userHasStaffRoleInDatabase;

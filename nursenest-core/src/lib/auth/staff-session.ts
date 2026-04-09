import "server-only";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isStaffRole, staffTierFromRole, type StaffTier } from "@/lib/auth/staff-roles";

export type StaffSession = {
  userId: string;
  role: UserRole;
  tier: StaffTier;
};

/**
 * Database is source of truth for staff role (JWT may lag after promotion).
 */
export async function getStaffSession(): Promise<StaffSession | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  if (!isDatabaseUrlConfigured()) return null;

  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!row || !isStaffRole(row.role)) return null;
    return {
      userId,
      role: row.role,
      tier: staffTierFromRole(row.role),
    };
  } catch {
    return null;
  }
}

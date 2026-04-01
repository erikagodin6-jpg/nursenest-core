import "server-only";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

/**
 * JWT `role` can lag behind Prisma after promotion (`ensure-admin`, scripts) until the next sign-in.
 * Single primary-key lookup for admin pages and `/api/admin/*` when the session still shows LEARNER.
 */
export async function userHasAdminRoleInDatabase(userId: string): Promise<boolean> {
  if (!isDatabaseUrlConfigured()) return false;
  try {
    const row = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    return row?.role === UserRole.ADMIN;
  } catch {
    return false;
  }
}

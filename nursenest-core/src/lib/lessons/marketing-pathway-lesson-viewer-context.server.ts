import { loadUserRoleFromDbIdentity } from "@/lib/auth/admin-role-source";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { marketingPathwayLessonStaffFullBodyAccess } from "@/lib/lessons/marketing-pathway-lesson-staff-bypass";

export type MarketingPathwayLessonViewerContext = {
  userId: string;
  entitlement: PageEntitlementResult;
  /**
   * DB-backed staff/admin row — unlocks full marketing lesson bodies when entitlement resolution fails
   * (same trust model as `/app` staff surfaces). Anonymous users never receive this flag.
   */
  staffFullLessonAccess: boolean;
  learnerPathResolved: string | null;
};

/**
 * Marketing pathway lesson detail: resolve signed-in user id, entitlement, learnerPath, and staff bypass.
 * Centralizes session reads so public lesson pages are not forced through an anonymous entitlement path.
 *
 * Staff/admin full-lesson access uses **DB role** (`loadUserRoleFromDbIdentity`), not only {@link getStaffSession}:
 * when `auth()` is slow or flaky, JWT fallback can still yield `userId`/email while a separate `getStaffSession()`
 * read returns null — staff would incorrectly see the marketing paywall. Entitlement resolution already trusts the
 * same role row for `admin_override`.
 */
export async function loadMarketingPathwayLessonViewerContext(
  surface: string,
): Promise<MarketingPathwayLessonViewerContext> {
  const session = await getProtectedRouteSession(surface);
  const su = session?.user as { id?: string; email?: string | null } | undefined;
  const userId = typeof su?.id === "string" && su.id.trim().length > 0 ? su.id.trim() : "";
  const emailRaw =
    typeof su?.email === "string" && su.email.trim().length > 0 ? su.email.trim().toLowerCase() : null;

  const [entitlement, staffRoleRow] = await Promise.all([
    resolveEntitlementForPage(userId),
    userId || emailRaw
      ? loadUserRoleFromDbIdentity({ userId: userId || null, email: emailRaw }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const staffFullLessonAccess = marketingPathwayLessonStaffFullBodyAccess(staffRoleRow);

  let learnerPathResolved: string | null = null;
  if (userId && isDatabaseUrlConfigured()) {
    try {
      const u = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
      learnerPathResolved = u?.learnerPath ?? null;
    } catch {
      learnerPathResolved = null;
    }
  }

  return { userId, entitlement, staffFullLessonAccess, learnerPathResolved };
}

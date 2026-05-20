import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession } from "@/lib/auth/staff-session";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

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
 * Staff/admin full-lesson access uses {@link getStaffSession()} — same DB-backed role resolution as staff chrome,
 * including a **retry** when the first Prisma read times out (cold pool). A bare single-shot role lookup here caused
 * intermittent paywalls for signed-in staff under load.
 */
export async function loadMarketingPathwayLessonViewerContext(
  surface: string,
): Promise<MarketingPathwayLessonViewerContext> {
  const session = await getProtectedRouteSession(surface);
  const su = session?.user as { id?: string; email?: string | null } | undefined;
  const userId = typeof su?.id === "string" && su.id.trim().length > 0 ? su.id.trim() : "";

  const [entitlement, staffSession] = await Promise.all([
    resolveEntitlementForPage(userId),
    getStaffSession(),
  ]);

  const staffFullLessonAccess = Boolean(staffSession);

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

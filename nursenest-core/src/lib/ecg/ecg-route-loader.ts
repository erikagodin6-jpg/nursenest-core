import "server-only";

import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession } from "@/lib/auth/staff-session";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { accessScopeForLessonCatalogPages } from "@/lib/entitlements/staff-db-lesson-catalog-access";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { ecgSegmentMatchesPathway, ecgUrlSegmentFromPathwayId } from "@/lib/ecg/ecg-pathway";
import type { EcgUrlSegment } from "@/lib/ecg/ecg-types";

export type EcgRouteLoadResult =
  | { kind: "signin" }
  | { kind: "forbidden_pathway"; correctSegment: EcgUrlSegment }
  | {
      kind: "ok";
      userId: string;
      entitlement: PageEntitlementResult;
      lessonAccess: AccessScope | "error";
      segment: EcgUrlSegment;
      pathwayId: string | null;
    };

export async function loadEcgRouteContext(routeKey: string, segment: EcgUrlSegment): Promise<EcgRouteLoadResult> {
  const session = await getProtectedRouteSession(routeKey);
  const userId = (session?.user as { id?: string })?.id ?? "";
  if (!userId) return { kind: "signin" };

  const [entitlement, staff, pathwayRow] = await Promise.all([
    resolveEntitlementForPage(userId),
    getStaffSession().catch(() => null),
    withDatabaseFallback(
      () => prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } }),
      null,
    ),
  ]);

  const pathwayId = pathwayRow?.learnerPath?.trim() || null;
  const staffPreview = Boolean(staff);
  if (!staffPreview && !ecgSegmentMatchesPathway(segment, pathwayId)) {
    return { kind: "forbidden_pathway", correctSegment: ecgUrlSegmentFromPathwayId(pathwayId) };
  }

  const lessonAccess = accessScopeForLessonCatalogPages(entitlement, staff);
  return {
    kind: "ok",
    userId,
    entitlement,
    lessonAccess,
    segment,
    pathwayId,
  };
}

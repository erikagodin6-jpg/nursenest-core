import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { medCalcTrackFromTier, type MedCalcTrack } from "@/lib/med-calculations/med-calculations-engine";

export type MedCalculationsRouteContext = {
  userId: string;
  entitlement: PageEntitlementResult;
  hasAccess: boolean;
  track: MedCalcTrack;
  trackLabel: string;
  pathwayId: string | null;
};

function trackLabel(track: MedCalcTrack): string {
  switch (track) {
    case "np":
      return "NP";
    case "pn":
      return "PN / RPN";
    default:
      return "RN";
  }
}

export async function loadMedCalculationsRouteContext(routeKey: string): Promise<MedCalculationsRouteContext> {
  const session = await getProtectedRouteSession(routeKey);
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const track = medCalcTrackFromTier(entitlement !== "error" ? entitlement.tier : null);
  const pathwayRow =
    userId.length > 0
      ? await withDatabaseFallback(
          () =>
            prisma.user.findUnique({
              where: { id: userId },
              select: { learnerPath: true },
            }),
          null,
        )
      : null;

  return {
    userId,
    entitlement,
    hasAccess: entitlement !== "error" && entitlement.hasAccess,
    track,
    trackLabel: trackLabel(track),
    pathwayId: pathwayRow?.learnerPath?.trim() || null,
  };
}

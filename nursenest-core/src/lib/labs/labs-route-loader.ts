import { withDatabaseFallback } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { labTrackFromTier, type LabTrack } from "@/lib/labs/labs-engine";

export type LabsRouteContext = {
  userId: string;
  entitlement: PageEntitlementResult;
  hasAccess: boolean;
  track: LabTrack;
  trackLabel: string;
  pathwayId: string | null;
};

function trackLabelFromTrack(track: LabTrack) {
  switch (track) {
    case "allied":
      return "Allied";
    case "np":
      return "NP";
    case "pn":
      return "PN / RPN";
    default:
      return "RN";
  }
}

export async function loadLabsRouteContext(routeKey: string): Promise<LabsRouteContext> {
  const session = await getProtectedRouteSession(routeKey);
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const track = labTrackFromTier(entitlement !== "error" ? entitlement.tier : null);
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
    trackLabel: trackLabelFromTrack(track),
    pathwayId: pathwayRow?.learnerPath?.trim() || null,
  };
}

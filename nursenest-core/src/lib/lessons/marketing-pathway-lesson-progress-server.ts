import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  canShowPaidPathwayLessonProgress,
  type MarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-gate";

export type { MarketingPathwayLessonProgressSessionContext } from "@/lib/lessons/marketing-pathway-lesson-progress-gate";
export { canShowPaidPathwayLessonProgress } from "@/lib/lessons/marketing-pathway-lesson-progress-gate";

function entitlementToScope(entitlement: PageEntitlementResult): AccessScope {
  if (entitlement === "error") {
    return { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null };
  }
  return entitlement;
}

/**
 * Optional session + entitlement + learnerPath — shared by category-first hub, category lesson lists,
 * and the paginated marketing lesson library (`/lessons` on exam pathways).
 */
export async function loadMarketingPathwayLessonProgressSessionContext(args: {
  sessionPathname: string;
  sessionSurface: string;
}): Promise<MarketingPathwayLessonProgressSessionContext> {
  const session = await getOptionalPublicSession({
    pathname: args.sessionPathname,
    surface: args.sessionSurface,
  });
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  let learnerPath: string | null = null;
  if (userId && isDatabaseUrlConfigured()) {
    try {
      const u = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
      learnerPath = u?.learnerPath ?? null;
    } catch {
      learnerPath = null;
    }
  }
  return {
    userId,
    learnerPath,
    scope: entitlementToScope(entitlement),
  };
}

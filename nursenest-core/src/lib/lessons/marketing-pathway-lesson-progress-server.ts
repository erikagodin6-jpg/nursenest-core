import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";

/**
 * Paid lesson progress on **marketing** pathway lesson surfaces is implemented in this order:
 * **1. RN → 2. RPN/PN → 3. NP → 4. Allied Health** — same components and Prisma `Progress` keys for all tiers;
 * tier differences stay in pathway metadata, catalog, and copy (not in the progress gate).
 */

export type MarketingPathwayLessonProgressSessionContext = {
  userId: string;
  learnerPath: string | null;
  scope: AccessScope;
};

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

/** True when Prisma-backed lesson progress may be shown for this pathway (subscriber + pathway match). */
export function canShowPaidPathwayLessonProgress(
  ctx: MarketingPathwayLessonProgressSessionContext,
  pathway: ExamPathwayDefinition,
): boolean {
  return Boolean(ctx.userId) && ctx.scope.hasAccess && canViewFullPathwayLesson(ctx.scope, pathway, ctx.learnerPath);
}

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadPathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import {
  buildNotFoundRecoveryModel,
  resolveNotFoundRouteContext,
  type NotFoundRecoveryModel,
} from "@/lib/routing/not-found-route-context";

export type { NotFoundRecoveryCta, NotFoundRouteKind, NotFoundRouteContext, NotFoundRecoveryModel };
export { buildNotFoundRecoveryModel, resolveNotFoundRouteContext } from "@/lib/routing/not-found-route-context";

export async function loadNotFoundRecovery(): Promise<NotFoundRecoveryModel> {
  const headerList = await headers();
  const context = await resolveNotFoundRouteContext(headerList.get("x-nn-pathname") ?? "");
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";

  if (!userId) {
    return buildNotFoundRecoveryModel(context);
  }

  const options: Parameters<typeof buildNotFoundRecoveryModel>[1] = {
    signedIn: true,
    dashboardHref: "/app",
  };

  if (!context.pathway || !context.pathwayLessonsHref) {
    return buildNotFoundRecoveryModel(context, options);
  }

  try {
    const entitlement = await resolveEntitlementForPage(userId);
    if (entitlement === "error" || !entitlement.hasAccess) {
      return buildNotFoundRecoveryModel(context, options);
    }

    let learnerPath: string | null = null;
    if (isDatabaseUrlConfigured()) {
      const userRow = await prisma.user.findUnique({
        where: { id: userId },
        select: { learnerPath: true },
      });
      learnerPath = userRow?.learnerPath ?? null;
    }

    const resume = await loadPathwayHubResumePayload(
      userId,
      entitlement,
      learnerPath,
      context.pathway,
      context.pathwayLessonsHref,
    );
    const resumeTarget = resume.nextRecommended ?? resume.lastTouched;
    if (resumeTarget?.href) {
      options.resumeHref = resumeTarget.href;
      options.resumeLabel = "Resume Studying";
    }
  } catch {
    // Recovery pages must stay resilient — if subscriber lookups fail, fall back to safe static CTAs.
  }

  return buildNotFoundRecoveryModel(context, options);
}

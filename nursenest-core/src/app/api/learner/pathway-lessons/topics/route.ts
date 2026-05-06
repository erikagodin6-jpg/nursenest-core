import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { pathwayLessonAppHubSafetyPrismaWhere } from "@/lib/lessons/app-lessons-hub-pathway-safety-where";
import { pathwayLessonsAppListWhereWithTopicFilter } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { TierCode } from "@prisma/client";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";

export const dynamic = "force-dynamic";

const TOPIC_ROWS_CAP = 200;
const HUB_DB_TIMEOUT_MS = 1800;

/**
 * GET /api/learner/pathway-lessons/topics?pathwayId=…
 *
 * Distinct topic chips for mobile category navigation (bounded).
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/pathway-lessons/topics", "content", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let entitlement;
    try {
      entitlement = await resolveEntitlement(userId);
    } catch {
      return NextResponse.json({ error: "Unable to verify access." }, { status: 503 });
    }

    if (!entitlement.hasAccess) {
      return NextResponse.json({ error: "Subscription required", code: "not_subscribed" }, { status: 403 });
    }

    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/pathway-lessons/topics",
      feature: SERVER_FEATURE.lesson,
      userId: gate.userId,
    });

    const url = new URL(req.url);
    const pathwayId = url.searchParams.get("pathwayId")?.trim() ?? "";
    if (pathwayId.length < 3) {
      return NextResponse.json({ error: "pathwayId is required" }, { status: 400 });
    }

    const learnerPathRow = await withDatabaseFallbackTimeout(
      async () =>
        prisma.user.findUnique({
          where: { id: gate.userId },
          select: { learnerPath: true, alliedProfessionKey: true, tier: true },
        }),
      null,
      HUB_DB_TIMEOUT_MS,
      { scope: "api_pathway_lesson_topics", label: "learner_path" },
    );

    const learnerPath = learnerPathRow?.learnerPath ?? null;
    const effectivePathwayForAlliedScope = pathwayId;
    const alliedProfessionForAppList =
      learnerPathRow?.tier === TierCode.ALLIED &&
      learnerPathRow.alliedProfessionKey?.trim() &&
      effectivePathwayForAlliedScope &&
      isAlliedMarketingCorePathwayId(effectivePathwayForAlliedScope)
        ? learnerPathRow.alliedProfessionKey.trim().toLowerCase()
        : null;

    await getMarketingLocaleForDefaultRoute();

    const pathwayWhere = await pathwayLessonsAppListWhereWithTopicFilter(entitlement, learnerPath, {
      pathwayId,
      alliedProfessionKey: alliedProfessionForAppList,
    });

    const pathwayWhereWithSafety = {
      AND: [pathwayWhere, pathwayLessonAppHubSafetyPrismaWhere()],
    };

    const rows = await withDatabaseFallbackTimeout(
      async () =>
        prisma.pathwayLesson.findMany({
          where: pathwayWhereWithSafety,
          select: { topicSlug: true, topic: true },
          distinct: ["topicSlug"],
          orderBy: { topicSlug: "asc" },
          take: TOPIC_ROWS_CAP,
        }),
      [],
      HUB_DB_TIMEOUT_MS,
      { scope: "api_pathway_lesson_topics", label: "distinct_topics" },
    );

    return NextResponse.json({
      pathwayId,
      topics: rows.map((r) => ({ topicSlug: r.topicSlug, label: r.topic })),
    });
  });
}

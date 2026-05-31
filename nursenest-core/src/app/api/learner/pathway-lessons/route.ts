import { NextResponse } from "next/server";
import { TierCode } from "@prisma/client";
import { auth } from "@/lib/auth";
import { maxSafeOffsetPage, parseLessonLibraryLimit, parseListPage } from "@/lib/api/api-pagination-limits";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { pathwayLessonAppHubSafetyPrismaWhere } from "@/lib/lessons/app-lessons-hub-pathway-safety-where";
import { paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver } from "@/lib/lessons/app-lessons-hub-row-renderability";
import { pickAppLessonsHubListSource } from "@/lib/lessons/app-lessons-hub-list-source";
import { getPathwayLessonExamMetadata } from "@/lib/lessons/pathway-lesson-exam-metadata";
import {
  pathwayLessonsAppListWhereWithTopicFilter,
  visiblePathwayIdsForAppLessons,
} from "@/lib/lessons/app-pathway-lesson-list-scope";
import { loadPathwayLessonProgressMap } from "@/lib/lessons/pathway-lesson-progress";
import { LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT } from "@/lib/lessons/pathway-lesson-scale";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { buildAppLessonsCatalogFallbackBlock } from "@/lib/lessons/app-lessons-catalog-fallback";

export const dynamic = "force-dynamic";

const HUB_DB_TIMEOUT_MS = 1800;

function pathwayLessonCardSummary(row: {
  seoDescription: string;
  topic: string;
  bodySystem: string;
}): string | null {
  const d = row.seoDescription?.trim();
  if (d) return d.length > 220 ? `${d.slice(0, 217)}…` : d;
  const parts = [row.topic?.trim(), row.bodySystem?.trim()].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

/**
 * GET /api/learner/pathway-lessons
 *
 * Subscriber pathway lesson hub slice for native shells — mirrors `/app/lessons` pathway branch
 * (PathwayLesson rows + same renderability resolver as `/app/lessons/[id]`).
 *
 * Query: pathwayId (optional filter), topicSlug?, topic?, q?, page?, limit?, includeProgress?
 * Progress fields are only populated for active subscribers (`entitlement.hasAccess`).
 * `includeProgress=0` skips per-row progress aggregation for speculative prefetch
 * and first-content list refreshes.
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/pathway-lessons", "content", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let entitlement;
    try {
      entitlement = await resolveEntitlement(userId);
    } catch {
      return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
    }

    if (!entitlement.hasAccess) {
      return NextResponse.json(
        { error: "Subscription required", code: "not_subscribed" },
        { status: 403 },
      );
    }

    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/pathway-lessons",
      feature: SERVER_FEATURE.lesson,
      userId: gate.userId,
    });

    const url = new URL(req.url);
    const limitParsed = parseLessonLibraryLimit(url.searchParams.get("limit") ?? undefined);
    const maxOffsetPage = maxSafeOffsetPage(limitParsed);

    const topicSlugFilter =
      typeof url.searchParams.get("topicSlug") === "string" && url.searchParams.get("topicSlug")!.trim().length > 0
        ? url.searchParams.get("topicSlug")!.trim().toLowerCase()
        : null;
    const topicFilter =
      !topicSlugFilter && typeof url.searchParams.get("topic") === "string" && url.searchParams.get("topic")!.trim().length > 0
        ? url.searchParams.get("topic")!.trim()
        : null;
    const pathwayIdFilter =
      typeof url.searchParams.get("pathwayId") === "string" && url.searchParams.get("pathwayId")!.trim().length > 0
        ? url.searchParams.get("pathwayId")!.trim()
        : null;
    const qRaw = url.searchParams.get("q") ?? "";
    const qEffective = qRaw.trim().length > 0 ? qRaw.trim() : null;
    const includeProgress = url.searchParams.get("includeProgress") !== "0";

    const pageParsed = parseListPage(url.searchParams.get("page"));
    if (!pageParsed.ok) {
      return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
    }
    const pageRequested = Math.min(pageParsed.page, maxOffsetPage);

    const learnerPathRow = await withDatabaseFallbackTimeout(
      async () =>
        prisma.user.findUnique({
          where: { id: gate.userId },
          select: { learnerPath: true, alliedProfessionKey: true, tier: true },
        }),
      null,
      HUB_DB_TIMEOUT_MS,
      { scope: "api_pathway_lessons", label: "learner_path" },
    );

    const learnerPath = learnerPathRow?.learnerPath ?? null;
    const effectivePathwayForAlliedScope = (pathwayIdFilter ?? learnerPath ?? "").trim();
    const alliedProfessionForAppList =
      learnerPathRow?.tier === TierCode.ALLIED &&
      learnerPathRow.alliedProfessionKey?.trim() &&
      effectivePathwayForAlliedScope &&
      isAlliedMarketingCorePathwayId(effectivePathwayForAlliedScope)
        ? learnerPathRow.alliedProfessionKey.trim().toLowerCase()
        : null;

    const marketingLocale = await getMarketingLocaleForDefaultRoute();
    const visiblePathwayIds = await visiblePathwayIdsForAppLessons(entitlement, learnerPath);

    const catalogFallback = () =>
      buildAppLessonsCatalogFallbackBlock({
        visiblePathwayIds,
        pathwayIdFilter,
        learnerPath,
        qEffective,
        topicSlugFilter,
        topicFilter,
        alliedProfessionKey: alliedProfessionForAppList,
        pageRequested,
        pageSize: limitParsed,
      });

    const pathwayWhere = await pathwayLessonsAppListWhereWithTopicFilter(entitlement, learnerPath, {
      topic: topicFilter,
      topicSlug: topicSlugFilter,
      pathwayId: pathwayIdFilter,
      alliedProfessionKey: alliedProfessionForAppList,
    });

    const pathwayWhereWithSafety = {
      AND: [
        pathwayWhere,
        pathwayLessonAppHubSafetyPrismaWhere(),
        ...(qEffective
          ? [
              {
                OR: [
                  { title: { contains: qEffective, mode: "insensitive" as const } },
                  { topic: { contains: qEffective, mode: "insensitive" as const } },
                  { bodySystem: { contains: qEffective, mode: "insensitive" as const } },
                  { slug: { contains: qEffective, mode: "insensitive" as const } },
                  { seoTitle: { contains: qEffective, mode: "insensitive" as const } },
                ],
              },
            ]
          : []),
      ],
    };

    const contentWhere = lessonAccessWhere(entitlement);
    const [pathwaySample, contentTotal] = await Promise.all([
      withDatabaseFallbackTimeout(
        async () =>
          prisma.pathwayLesson.findFirst({
            where: pathwayWhereWithSafety,
            select: { id: true },
          }),
        null,
        HUB_DB_TIMEOUT_MS,
        { scope: "api_pathway_lessons", label: "pathway_sample" },
      ),
      withDatabaseFallbackTimeout(
        async () => prisma.contentItem.count({ where: contentWhere }),
        0,
        HUB_DB_TIMEOUT_MS,
        { scope: "api_pathway_lessons", label: "content_total" },
      ),
    ]);

    const listSource = pickAppLessonsHubListSource({
      pathwaySampleExists: Boolean(pathwaySample),
      contentTotal,
      pathwayIdFilter,
    });

    if (listSource !== "pathway_lessons") {
      const fallback = catalogFallback();
      if (fallback) {
        return NextResponse.json({
          source: "pathway_lessons" as const,
          inventory: "bundled_catalog_fallback" as const,
          total: fallback.total,
          page: fallback.page,
          pageCount: fallback.pageCount,
          pageSize: limitParsed,
          defaultPageSize: LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT,
          scanCapped: false,
          rows: fallback.rows,
          progressByPathwaySlug: null,
          includeProgress,
          entitlement: {
            hasAccess: entitlement.hasAccess,
            canShowLessonProgress: entitlement.hasAccess === true,
          },
          visiblePathwayIds,
        });
      }

      return NextResponse.json(
        {
          error: "Pathway lesson list unavailable for this account filter (legacy hub mode).",
          code: "pathway_list_unsupported",
          listSource,
        },
        { status: 409 },
      );
    }

    let paginated = await withDatabaseFallbackTimeout(
      async () =>
        paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver({
          where: pathwayWhereWithSafety,
          page: pageRequested,
          pageSize: limitParsed,
          entitlement,
          learnerPath,
          marketingLocale,
        }),
      null,
      HUB_DB_TIMEOUT_MS,
      { scope: "api_pathway_lessons", label: "pathway_paginated" },
    );

    if (!paginated) {
      const fallback = catalogFallback();
      if (!fallback) {
        safeServerLog("api_pathway_lessons", "lesson_system_query_failed", {
          user_id: gate.userId,
          pathway_id: pathwayIdFilter ?? undefined,
          topic_slug: topicSlugFilter ?? undefined,
          topic: topicFilter ?? undefined,
          reason: "pathway_paginated_timeout_no_fallback",
        });
        return NextResponse.json({ error: "Lesson list temporarily unavailable", code: "lesson_list_timeout" }, { status: 503 });
      }
      return NextResponse.json({
        source: "pathway_lessons" as const,
        inventory: "bundled_catalog_fallback" as const,
        total: fallback.total,
        page: fallback.page,
        pageCount: fallback.pageCount,
        pageSize: limitParsed,
        defaultPageSize: LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT,
        scanCapped: false,
        rows: fallback.rows,
        progressByPathwaySlug: null,
        includeProgress,
        entitlement: {
          hasAccess: entitlement.hasAccess,
          canShowLessonProgress: entitlement.hasAccess === true,
        },
        visiblePathwayIds,
      });
    }

    const pathwayTotal = paginated.totalResolvable;
    const pageCount = Math.max(1, Math.ceil(pathwayTotal / limitParsed) || 1);
    const safePage = Math.min(pageRequested, pageCount);

    if (paginated.rows.length === 0 && pathwayTotal > 0 && safePage !== pageRequested) {
      paginated = await paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver({
        where: pathwayWhereWithSafety,
        page: safePage,
        pageSize: limitParsed,
        entitlement,
        learnerPath,
        marketingLocale,
      });
    }

    if (paginated.scanCapped) {
      safeServerLog("api_pathway_lessons", "hub_pathway_total_may_be_truncated", {
        dbRowsScanned: String(paginated.dbRowsScanned),
        resolvableTotal: String(pathwayTotal),
      });
    }

    const rows = paginated.rows.map((r) => ({
      id: r.id,
      title: r.title,
      summary: pathwayLessonCardSummary(r),
      topic: r.topic,
      bodySystem: r.bodySystem,
      topicSlug: r.topicSlug,
      pathwayMeta: { pathwayId: r.pathwayId, slug: r.slug },
      examSpecificMetadata: getPathwayLessonExamMetadata(r.pathwayId),
    }));

    let progressByPathwaySlug: Record<string, "not_started" | "in_progress" | "completed"> | null = null;
    if (includeProgress && entitlement.hasAccess && rows.length > 0) {
      const grouped = new Map<string, string[]>();
      for (const r of rows) {
        const pid = r.pathwayMeta.pathwayId;
        const s = r.pathwayMeta.slug;
        if (!pid || !s) continue;
        const g = grouped.get(pid) ?? [];
        g.push(s);
        grouped.set(pid, g);
      }
      progressByPathwaySlug = {};
      for (const [pid, slugs] of grouped) {
        const m = await loadPathwayLessonProgressMap(gate.userId, pid, slugs);
        for (const s of slugs) {
          progressByPathwaySlug[`${pid}:${s}`] = m[s] ?? "not_started";
        }
      }
    }

    return NextResponse.json({
      source: "pathway_lessons" as const,
      inventory: "primary" as const,
      total: pathwayTotal,
      page: safePage,
      pageCount,
      pageSize: limitParsed,
      defaultPageSize: LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT,
      scanCapped: paginated.scanCapped,
      rows,
      progressByPathwaySlug,
      includeProgress,
      entitlement: {
        hasAccess: entitlement.hasAccess,
        /** When true, clients may show per-row progress (server-backed only). */
        canShowLessonProgress: entitlement.hasAccess === true,
      },
      visiblePathwayIds,
    });
  }).catch((error) => {
    safeServerLog("api_pathway_lessons", "lesson_system_api_unhandled_failure", {
      error_message: error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500),
      stack: error instanceof Error ? error.stack?.slice(0, 1200) : undefined,
    });
    return NextResponse.json(
      { error: "Unable to load lessons.", code: "lesson_system_api_failure" },
      { status: 500 },
    );
  });
}

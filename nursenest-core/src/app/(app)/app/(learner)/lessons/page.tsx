import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContentStatus, TierCode } from "@prisma/client";
import { EcgAuthorityLinkBlock } from "@/components/ecg-module/ecg-authority-link-block";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession } from "@/lib/auth/staff-session";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { accessScopeForLessonCatalogPages } from "@/lib/entitlements/staff-db-lesson-catalog-access";
import {
  maxSafeOffsetPage,
  parseLessonLibraryLimit,
} from "@/lib/api/api-pagination-limits";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import {
  pathwayLessonsAppListWhereWithTopicFilter,
  visiblePathwayIdsForAppLessons,
} from "@/lib/lessons/app-pathway-lesson-list-scope";
import { pathwayLessonAppHubSafetyPrismaWhere } from "@/lib/lessons/app-lessons-hub-pathway-safety-where";
import { buildLearnerAppLessonsHubSummary } from "@/lib/lessons/learner-app-lessons-hub-summary";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { FreemiumCrossTrackNudge } from "@/components/student/freemium-cross-track-nudge";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { FreemiumLessonPeek } from "@/components/student/freemium-lesson-peek";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT } from "@/lib/lessons/pathway-lesson-scale";
import { LearnerLessonsResponsiveResults } from "@/components/student/learner-lessons-responsive-results";
import {
  loadPathwayLessonProgressMap,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  freemiumLessonsExhausted,
  freemiumQuestionsExhausted,
} from "@/lib/conversion/freemium-gates";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  paginateContentItemsForAppSubscriberHubMatchingDetailResolver,
  paginateLegacyContentMapLessonsForAppSubscriberHubMatchingDetailResolver,
  paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver,
} from "@/lib/lessons/app-lessons-hub-row-renderability";
import { pickAppLessonsHubListSource } from "@/lib/lessons/app-lessons-hub-list-source";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import {
  appLessonsHubListOptsForSnapshot,
  lessonsListBlockFromPathwayHubSnapshot,
} from "@/lib/lessons/app-lessons-hub-published-snapshot-fallback";
import { readPathwayLessonsHubPageSnapshot } from "@/lib/study-content-failover/pathway-lessons-hub-snapshot-read";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { snapshotAgeMs as publishedSnapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import { logAppLessonsHubListSource } from "@/lib/observability/content-source-trace";
import { buildAppLessonsCatalogFallbackBlock } from "@/lib/lessons/app-lessons-catalog-fallback";
import { loadLearnerActivityContext } from "@/lib/learner/load-learner-activity-context";

/** Align with lesson detail — list should reflect admin publish without stale RSC cache. */
export const dynamic = "force-dynamic";

type AppLessonListRow = {
  id: string;
  title: string;
  summary: string | null;
  topic?: string | null;
  topicSlug?: string | null;
  bodySystem?: string | null;
  pathwayMeta?: { pathwayId: string; slug: string };
};

const LESSONS_PAGE_DB_TIMEOUT_MS = 900;
const LESSONS_PROGRESS_PERSONALIZATION_BUDGET_MS = 350;

type LessonsListBlock = {
  source: "content_items" | "pathway_lessons" | "legacy_content_map";
  total: number;
  page: number;
  pageCount: number;
  rows: AppLessonListRow[];
};

async function withLessonsStartupBudget<T>(
  work: Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return Promise.race([
    work
      .catch((error) => {
        safeServerLog("page_lessons", "app_lessons_hub_optional_work_failed", {
          label,
          error_message:
            error instanceof Error
              ? error.message.slice(0, 240)
              : String(error).slice(0, 240),
        });
        return fallback;
      })
      .finally(() => {
        if (timeout) clearTimeout(timeout);
      }),
    new Promise<T>((resolve) => {
      timeout = setTimeout(() => {
        safeServerLog("page_lessons", "app_lessons_hub_optional_work_timeout", {
          label,
          budget_ms: LESSONS_PROGRESS_PERSONALIZATION_BUDGET_MS,
        });
        resolve(fallback);
      }, LESSONS_PROGRESS_PERSONALIZATION_BUDGET_MS);
    }),
  ]);
}

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

type Props = {
  searchParams: Promise<{
    page?: string;
    topic?: string;
    topicSlug?: string;
    pathwayId?: string;
    limit?: string;
    q?: string;
    lessonSlug?: string;
  }>;
};

function appLessonsListQuery(
  page: number,
  topic: string | null,
  topicSlug: string | null,
  pathwayId: string | null,
  q: string | null,
  limit: number,
): string {
  const qs = new URLSearchParams();

  if (page > 1) qs.set("page", String(page));

  const ts = topicSlug?.trim().toLowerCase();
  if (ts) qs.set("topicSlug", ts);
  else if (topic?.trim()) qs.set("topic", topic.trim());

  if (pathwayId?.trim()) qs.set("pathwayId", pathwayId.trim());

  const qt = q?.trim();
  if (qt) qs.set("q", qt);

  if (limit !== LEARNER_APP_LESSONS_PAGE_SIZE_DEFAULT)
    qs.set("limit", String(limit));

  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.lessons.list.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/lessons", routeGroup: "student.learner.lessons" },
  );
}

export default async function LessonsPage({ searchParams }: Props) {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession(
    "(student).app.(learner).lessons",
  );
  const userId = (session?.user as { id?: string })?.id ?? "";
  const [entitlementResult, staff] = await Promise.all([
    resolveEntitlementForPage(userId),
    getStaffSession().catch(() => null),
  ]);
  const lessonAccess = accessScopeForLessonCatalogPages(
    entitlementResult,
    staff,
  );

  if (lessonAccess === "error") {
    return (
      <p className="nn-card p-6 text-sm text-muted">
        {t("learner.entitlement.verifyFailed")}
      </p>
    );
  }

  if (!lessonAccess.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;

    return (
      <div>
        <h1 className="text-3xl font-bold">
          {t("learner.lessons.list.title")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {t("learner.lessons.list.freemiumLead")}{" "}
          <Link className="font-medium text-primary underline" href="/lessons">
            {t("learner.lessons.list.freemiumLink")}
          </Link>{" "}
          {t("learner.lessons.list.freemiumTail")}
        </p>

        {userId && snap && !freemiumLessonsExhausted(snap) ? (
          <div className="mt-6">
            <FreemiumLessonPeek />
          </div>
        ) : null}

        <div className="mt-6">
          <SubscriptionPaywall
            context="lessons"
            freemiumRemainingLessons={
              snap != null ? snap.lessonRemaining : undefined
            }
            freemiumRemainingQuestions={
              snap != null ? snap.questionRemaining : undefined
            }
          />
        </div>

        {userId &&
        snap &&
        freemiumQuestionsExhausted(snap) &&
        !freemiumLessonsExhausted(snap) ? (
          <FreemiumCrossTrackNudge variant="questions_exhausted" />
        ) : null}

        {userId && snap && freemiumLessonsExhausted(snap) ? (
          <FreemiumPreviewExhaustedSurface kind="lessons" />
        ) : null}
      </div>
    );
  }

  const entitlement = lessonAccess;

  lessonsPerfMark("route_start", { route: "app_lessons_hub" });
  try {
    const sp = await searchParams;
    const limitParsed = parseLessonLibraryLimit(
      typeof sp.limit === "string" ? sp.limit : undefined,
    );

    const qRaw = typeof sp.q === "string" ? sp.q : "";
    const qEffective = qRaw.trim().length > 0 ? qRaw.trim() : null;

    const rawPage = Math.max(1, Number(sp.page ?? "1") || 1);
    const maxOffsetPage = maxSafeOffsetPage(limitParsed);
    const pageRequested = Math.min(rawPage, maxOffsetPage);

    const topicSlugFilter =
      typeof sp.topicSlug === "string" && sp.topicSlug.trim().length > 0
        ? sp.topicSlug.trim().toLowerCase()
        : null;

    const topicFilter =
      !topicSlugFilter &&
      typeof sp.topic === "string" &&
      sp.topic.trim().length > 0
        ? sp.topic.trim()
        : null;

    const pathwayIdFilter =
      typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 0
        ? sp.pathwayId.trim()
        : null;

    const lessonSlugFilter =
      typeof sp.lessonSlug === "string" && sp.lessonSlug.trim().length > 0
        ? sp.lessonSlug.trim()
        : null;

    const [learnerPathRow, marketingLocale] = await Promise.all([
      withDatabaseFallbackTimeout(
        async () => (userId ? loadLearnerActivityContext(userId) : null),
        null,
        LESSONS_PAGE_DB_TIMEOUT_MS,
        { scope: "page_lessons", label: "learner_path" },
      ),
      getMarketingLocaleForDefaultRoute(),
    ]);

    const learnerPath = learnerPathRow?.learnerPath ?? null;
    const effectivePathwayForAlliedScope = (
      pathwayIdFilter ??
      learnerPath ??
      ""
    ).trim();
    const alliedProfessionForAppList =
      learnerPathRow?.tier === TierCode.ALLIED &&
      learnerPathRow.alliedProfessionKey?.trim() &&
      effectivePathwayForAlliedScope &&
      isAlliedMarketingCorePathwayId(effectivePathwayForAlliedScope)
        ? learnerPathRow.alliedProfessionKey.trim().toLowerCase()
        : null;
    const visiblePathwayIds = await visiblePathwayIdsForAppLessons(
      entitlement,
      learnerPath,
    );

    if (
      lessonSlugFilter &&
      pathwayIdFilter &&
      visiblePathwayIds.includes(pathwayIdFilter)
    ) {
      const hit = await withDatabaseFallbackTimeout(
        async () =>
          prisma.pathwayLesson.findFirst({
            where: {
              AND: [
                { pathwayId: pathwayIdFilter },
                { slug: lessonSlugFilter },
                { status: ContentStatus.PUBLISHED },
                pathwayLessonAppHubSafetyPrismaWhere(),
              ],
            },
            select: { id: true },
          }),
        null,
        LESSONS_PAGE_DB_TIMEOUT_MS,
        { scope: "page_lessons", label: "lesson_slug_redirect" },
      );
      if (hit?.id) {
        redirect(`/app/lessons/${hit.id}`);
      }
    }

    const lessonsBlockFromDb = await withDatabaseFallbackTimeout(
      async () => {
        const contentWhere = lessonAccessWhere(entitlement);
        const contentFilters: (typeof contentWhere)[] = [];

        if (topicFilter || topicSlugFilter) {
          const term = (topicSlugFilter ?? topicFilter ?? "").trim();

          if (term.length > 0) {
            contentFilters.push({
              OR: [
                { title: { contains: term, mode: "insensitive" } },
                { bodySystem: { contains: term, mode: "insensitive" } },
                { category: { contains: term, mode: "insensitive" } },
              ],
            });
          }
        }

        if (qEffective) {
          contentFilters.push({
            OR: [
              { title: { contains: qEffective, mode: "insensitive" } },
              { bodySystem: { contains: qEffective, mode: "insensitive" } },
              { category: { contains: qEffective, mode: "insensitive" } },
            ],
          });
        }

        const contentScopedWhere =
          contentFilters.length > 0
            ? { AND: [contentWhere, ...contentFilters] }
            : contentWhere;

        const contentTotal = await prisma.contentItem.count({
          where: contentScopedWhere,
        });

        const pathwayWhere = await pathwayLessonsAppListWhereWithTopicFilter(
          entitlement,
          learnerPath,
          {
            topic: topicFilter,
            topicSlug: topicSlugFilter,
            pathwayId: pathwayIdFilter,
            alliedProfessionKey: alliedProfessionForAppList,
          },
        );

        const pathwayWhereWithSafety = {
          AND: [
            pathwayWhere,
            pathwayLessonAppHubSafetyPrismaWhere(),
            ...(qEffective
              ? [
                  {
                    OR: [
                      {
                        title: {
                          contains: qEffective,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        topic: {
                          contains: qEffective,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        bodySystem: {
                          contains: qEffective,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        slug: {
                          contains: qEffective,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        seoTitle: {
                          contains: qEffective,
                          mode: "insensitive" as const,
                        },
                      },
                    ],
                  },
                ]
              : []),
          ],
        };

        const pathwaySample = await prisma.pathwayLesson.findFirst({
          where: pathwayWhereWithSafety,
          select: { id: true },
        });

        const listSource = pickAppLessonsHubListSource({
          pathwaySampleExists: Boolean(pathwaySample),
          contentTotal,
          pathwayIdFilter,
        });

        if (listSource === "pathway_lessons") {
          let paginated =
            await paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver(
              {
                where: pathwayWhereWithSafety,
                page: pageRequested,
                pageSize: limitParsed,
                entitlement,
                learnerPath,
                marketingLocale,
              },
            );

          const pathwayTotal = paginated.totalResolvable;
          const pageCount = Math.max(
            1,
            Math.ceil(pathwayTotal / limitParsed) || 1,
          );
          const safePage = Math.min(pageRequested, pageCount);

          if (
            paginated.rows.length === 0 &&
            pathwayTotal > 0 &&
            safePage !== pageRequested
          ) {
            paginated =
              await paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver(
                {
                  where: pathwayWhereWithSafety,
                  page: safePage,
                  pageSize: limitParsed,
                  entitlement,
                  learnerPath,
                  marketingLocale,
                },
              );
          }

          if (paginated.scanCapped) {
            safeServerLog(
              "page_lessons",
              "app_lessons_hub_pathway_total_may_be_truncated",
              {
                dbRowsScanned: String(paginated.dbRowsScanned),
                resolvableTotal: String(pathwayTotal),
              },
            );
          }

          const rows: AppLessonListRow[] = paginated.rows.map((r) => ({
            id: r.id,
            title: r.title,
            summary: pathwayLessonCardSummary(r),
            topic: r.topic,
            topicSlug: r.topicSlug,
            bodySystem: r.bodySystem,
            pathwayMeta: { pathwayId: r.pathwayId, slug: r.slug },
          }));

          return {
            source: "pathway_lessons" as const,
            total: pathwayTotal,
            page: safePage,
            pageCount,
            rows,
          };
        }

        if (listSource === "content_items") {
          let paginated =
            await paginateContentItemsForAppSubscriberHubMatchingDetailResolver(
              {
                where: contentScopedWhere,
                page: pageRequested,
                pageSize: limitParsed,
                entitlement,
              },
            );

          const contentResolvableTotal = paginated.totalResolvable;
          const pageCount = Math.max(
            1,
            Math.ceil(contentResolvableTotal / limitParsed) || 1,
          );
          const safePage = Math.min(pageRequested, pageCount);

          if (
            paginated.rows.length === 0 &&
            contentResolvableTotal > 0 &&
            safePage !== pageRequested
          ) {
            paginated =
              await paginateContentItemsForAppSubscriberHubMatchingDetailResolver(
                {
                  where: contentScopedWhere,
                  page: safePage,
                  pageSize: limitParsed,
                  entitlement,
                },
              );
          }

          if (paginated.scanCapped) {
            safeServerLog(
              "page_lessons",
              "app_lessons_hub_content_total_may_be_truncated",
              {
                dbRowsScanned: String(paginated.dbRowsScanned),
                resolvableTotal: String(contentResolvableTotal),
              },
            );
          }

          const rows: AppLessonListRow[] = paginated.rows.map((r) => ({
            id: r.id,
            title: r.title,
            summary: r.summary ?? null,
          }));

          return {
            source: "content_items" as const,
            total: contentResolvableTotal,
            page: safePage,
            pageCount,
            rows,
          };
        }

        const legacy =
          await paginateLegacyContentMapLessonsForAppSubscriberHubMatchingDetailResolver(
            entitlement,
            pageRequested,
            limitParsed,
            qEffective,
          );

        const rows: AppLessonListRow[] = legacy.rows.map((r) => ({
          id: r.id,
          title: r.title,
          summary: r.summary,
        }));

        return {
          source: "legacy_content_map" as const,
          total: legacy.total,
          page: legacy.page,
          pageCount: legacy.pageCount,
          rows,
        };
      },
      null,
      LESSONS_PAGE_DB_TIMEOUT_MS,
      { scope: "page_lessons", label: "lesson_list_block" },
    );

    let lessonsHubInventorySource:
      | "primary"
      | "degraded_snapshot"
      | "bundled_catalog_fallback" = "primary";
    let lessonsBlock: LessonsListBlock;

    if (lessonsBlockFromDb !== null) {
      lessonsBlock = lessonsBlockFromDb;
    } else {
      safeServerLog("page_lessons", "app_lessons_hub_primary_db_timeout", {
        pathway_id: pathwayIdFilter ?? undefined,
        learner_path: learnerPath ?? undefined,
      });

      const pathwayForSnap =
        (
          pathwayIdFilter?.trim() ||
          learnerPath?.trim() ||
          visiblePathwayIds[0] ||
          ""
        ).trim() || null;

      const listOptsSnap = appLessonsHubListOptsForSnapshot({
        qEffective,
        topicSlugFilter,
        alliedProfessionKey: alliedProfessionForAppList,
      });

      const snap = pathwayForSnap
        ? await readPathwayLessonsHubPageSnapshot(pathwayForSnap, {
            pageRequested,
            pageSizeRequested: limitParsed,
            lessonContentLocale: marketingLocale,
            listOpts: listOptsSnap,
          })
        : null;

      const fromSnap =
        snap && pathwayForSnap
          ? lessonsListBlockFromPathwayHubSnapshot(pathwayForSnap, snap)
          : null;

      if (fromSnap && snap) {
        lessonsHubInventorySource = "degraded_snapshot";
        const age = publishedSnapshotAgeMs(snap.capturedAt);

        safeServerLog("page_lessons", "critical_study_load_diagnostics", {
          event: "critical_study_load_diagnostics",
          operation: "app_lessons_hub_list",
          feature_surface: "learner_app_lessons",
          live_outcome: "timeout",
          snapshot_used: "true",
          snapshot_age_ms: String(Math.round(age >= 0 ? age : -1)),
          final_outcome: fromSnap.total === 0 ? "empty" : "degraded_snapshot",
          fallback_used: "true",
          pathway_id: pathwayForSnap ?? undefined,
          locale: marketingLocale,
          exam: String(entitlement.country ?? ""),
          snapshot_version: snap.version.slice(0, 120),
        });

        lessonsBlock = {
          source: "pathway_lessons",
          total: fromSnap.total,
          page: fromSnap.page,
          pageCount: fromSnap.pageCount,
          rows: fromSnap.rows,
        };
      } else {
        const fromCatalog = buildAppLessonsCatalogFallbackBlock({
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

        if (fromCatalog) {
          lessonsHubInventorySource = "bundled_catalog_fallback";
          safeServerLog("page_lessons", "critical_study_load_diagnostics", {
            event: "critical_study_load_diagnostics",
            operation: "app_lessons_hub_list",
            feature_surface: "learner_app_lessons",
            live_outcome: "timeout",
            snapshot_used: "false",
            final_outcome: "bundled_catalog_fallback",
            fallback_used: "true",
            pathway_id: pathwayForSnap ?? undefined,
            locale: marketingLocale,
            exam: String(entitlement.country ?? ""),
          });

          lessonsBlock = fromCatalog;
        } else {
          safeServerLog("page_lessons", "critical_study_load_diagnostics", {
            event: "critical_study_load_diagnostics",
            operation: "app_lessons_hub_list",
            feature_surface: "learner_app_lessons",
            live_outcome: "timeout",
            snapshot_used: "false",
            final_outcome: "error",
            fallback_used: "false",
            pathway_id: pathwayForSnap ?? undefined,
            locale: marketingLocale,
            exam: String(entitlement.country ?? ""),
          });

          return (
            <div
              className="nn-premium-lessons-system nn-app-lessons-hub-premium nn-premium-lessons-app-list mx-auto w-full max-w-6xl space-y-6 px-4 py-8"
              data-nn-premium-full-platform-convergence=""
              data-nn-premium-platform-family="exam-study"
              data-nn-premium-platform-module="lessons"
              data-nn-premium-lessons-system="app-hub"
            >
              <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">
                {t("learner.lessons.list.title")}
              </h1>
              <ContentEmptyState
                variant="generic"
                headline="Could not load your lesson list"
                body="The live lesson catalog timed out and no last-synced snapshot is available for this view. This is not an empty library — please retry."
                primaryCta={{ label: "Retry", href: "/app/lessons" }}
              />
            </div>
          );
        }
      }
    }

    if (rawPage !== lessonsBlock.page) {
      const q = appLessonsListQuery(
        lessonsBlock.page,
        topicFilter,
        topicSlugFilter,
        pathwayIdFilter,
        qEffective,
        limitParsed,
      );

      redirect(q ? `/app/lessons${q}` : "/app/lessons");
    }

    logAppLessonsHubListSource({
      source: lessonsBlock.source,
      inventory: lessonsHubInventorySource,
      pathwayId: pathwayIdFilter,
      page: lessonsBlock.page,
    });

    const resolvedRenderableLessons: AppLessonListRow[] = [
      ...lessonsBlock.rows,
    ];

    lessonsPerfMark("summary_index_start", { route: "app_lessons_hub" });
    const lessonsHub = buildLearnerAppLessonsHubSummary<AppLessonListRow>({
      rows: resolvedRenderableLessons,
      catalogMatchTotal: lessonsBlock.total,
      qEffective,
      topicFilter,
      topicSlugFilter,
      pathwayIdFilter,
    });
    lessonsPerfMark("summary_index_end", { route: "app_lessons_hub" });

    if (process.env.NODE_ENV !== "production") {
      safeServerLog("page_lessons", "app_lessons_hub_render", {
        pathwayId: pathwayIdFilter ?? undefined,
        totalLessons: String(lessonsHub.catalogMatchTotal),
        renderedLessons: String(resolvedRenderableLessons.length),
        emptyReason: lessonsHub.emptyReason,
      });
    }

    const progressByRowId: Record<string, PathwayLessonProgressStatus> = {};

    if (userId && lessonsBlock.source === "pathway_lessons") {
      lessonsPerfMark("personalization_start", { route: "app_lessons_hub" });
      const byPathway = new Map<string, string[]>();

      for (const row of resolvedRenderableLessons) {
        const pm = row.pathwayMeta;
        if (!pm?.slug) continue;

        const list = byPathway.get(pm.pathwayId) ?? [];
        list.push(pm.slug);
        byPathway.set(pm.pathwayId, list);
      }

      await withLessonsStartupBudget(
        Promise.all(
          Array.from(byPathway.entries()).map(async ([pathwayId, slugs]) => {
            const unique = [...new Set(slugs)];
            const map = await loadPathwayLessonProgressMap(
              userId,
              pathwayId,
              unique,
            );
            for (const row of resolvedRenderableLessons) {
              const pm = row.pathwayMeta;
              if (pm && pm.pathwayId === pathwayId && pm.slug) {
                progressByRowId[row.id] = map[pm.slug] ?? "not_started";
              }
            }
          }),
        ),
        [],
        "progress_personalization",
      );
      lessonsPerfMark("personalization_end", { route: "app_lessons_hub" });
    }

    const listSummaryLine =
      resolvedRenderableLessons.length > 0
        ? t("learner.lessons.list.hubListSummary", {
            shown: String(resolvedRenderableLessons.length),
            total: String(lessonsHub.catalogMatchTotal),
          })
        : lessonsHub.catalogMatchTotal > 0
          ? t("learner.lessons.list.hubListSummary", {
              shown: "0",
              total: String(lessonsHub.catalogMatchTotal),
            })
          : null;

    return (
      <div
        className="nn-premium-lessons-system nn-app-lessons-hub-premium min-w-0 space-y-8 sm:space-y-10"
        data-nn-premium-full-platform-convergence=""
        data-nn-premium-platform-family="exam-study"
        data-nn-premium-platform-module="lessons"
        data-nn-premium-lessons-system="app-hub"
      >
        <div
          className="nn-learner-page-hero nn-premium-lessons-hub-hero"
          data-nn-premium-lessons-hero=""
        >
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            {t("learner.lessons.list.title")}
          </h1>
          <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mt-3">
            {t("learner.lessons.list.subscriberIntro")}
          </p>
        </div>

        {lessonsHubInventorySource === "degraded_snapshot" ||
        lessonsHubInventorySource === "bundled_catalog_fallback" ? (
          <LearnerStudyLiveSyncBanner />
        ) : null}

        <LearnerLessonsResponsiveResults
          initialRows={resolvedRenderableLessons}
          initialProgressByRowId={progressByRowId}
          initialTotal={lessonsHub.catalogMatchTotal}
          initialPage={lessonsBlock.page}
          initialPageCount={lessonsBlock.pageCount}
          initialPageSize={limitParsed}
          initialFilters={{
            q: qEffective ?? "",
            topic: topicFilter,
            topicSlug: topicSlugFilter,
            pathwayId: pathwayIdFilter,
          }}
          openLessonCta={t("learner.lessons.list.openLessonCta")}
          initialListSummaryLine={listSummaryLine}
          clientFilteringEnabled={lessonsBlock.source === "pathway_lessons"}
        />

        {/* ECG authority links — surfaced for RN/NP tiers only.
          ECG module access requires RN or NP tier (canAccessEcgModuleForTier).
          Uses 'banner' variant to show descriptive ECG links with keyword-rich anchors. */}
        {learnerPathRow?.tier === TierCode.RN ||
        learnerPathRow?.tier === TierCode.NP ? (
          <EcgAuthorityLinkBlock
            variant="banner"
            showAdvanced={true}
            className="mt-2"
            data-testid="lessons-hub-ecg-authority-block"
          />
        ) : null}
      </div>
    );
  } catch (error) {
    safeServerLog("page_lessons", "lesson_system_server_render_failed", {
      user_id: userId || undefined,
      error_message:
        error instanceof Error
          ? error.message.slice(0, 500)
          : String(error).slice(0, 500),
      stack: error instanceof Error ? error.stack?.slice(0, 1200) : undefined,
    });
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <ContentEmptyState
          variant="generic"
          headline="Lessons temporarily unavailable"
          body="The lesson library could not load right now. Please try again in a moment."
          primaryCta={{ label: "Retry", href: "/app/lessons" }}
        />
      </div>
    );
  } finally {
    lessonsPerfMark("route_end", { route: "app_lessons_hub" });
  }
}

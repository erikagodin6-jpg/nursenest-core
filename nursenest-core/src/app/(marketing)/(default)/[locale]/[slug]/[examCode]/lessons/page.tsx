import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect, redirect } from "next/navigation";
import { LESSON_SYSTEM_HUB_CARD_PREVIEW_MAX } from "@/components/pathway-lessons/lesson-system-card";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import type { MarketingHubLessonsListOptions } from "@/lib/exam-pathways/marketing-hub-lessons-page-args";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  marketingPathwayLessonsIndexPath,
  marketingExamHubBasePath,
  normalizeMarketingLessonsHubTopicSlug,
} from "@/lib/lessons/lesson-routes";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  getPathwayLessonListWarehouseLocaleForHub,
  listAlliedProfessionTaxonomyClustersForPublicHub,
  listTopicClustersForPublicNavigation,
  normalizePathwayHubSearchQuery,
  PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import {
  PathwayLessonsCurriculumHub,
  prepareLessonsForHubCurriculumWithDiagnostics,
} from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import {
  pathwayCountryLabel,
  pathwayLessonHubMetaDescription,
  pathwayLessonHubMetaTitle,
  pathwayLessonTopicClusterMetaDescription,
  pathwayLessonTopicClusterMetaTitle,
  pathwayRegionAwareExamName,
} from "@/lib/lessons/pathway-lesson-hub-seo";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
import { buildPathwayLessonSystemSections } from "@/lib/lessons/pathway-lesson-body-system-groups";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingHubVerifiedCardHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import {
  probeMarketingHubLessonDetailReachability,
  verifyMarketingHubLessonRowsResolve,
} from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import {
  countStrictMarketingHubInventoryRows,
  fillMarketingHubLessonInventoryToMinimum,
  MARKETING_HUB_MIN_VISIBLE_LESSONS,
} from "@/lib/lessons/marketing-hub-lesson-inventory-fill";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { pathwayLessonsHubBreadcrumbs, pathwayTopicClusterBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  canShowPaidPathwayLessonProgress,
  loadMarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-server";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { loadPathwayHubSubscriberData } from "@/lib/learner/pathway-lesson-continuation";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import type { HubDbFailureCategory } from "@/lib/db/safe-database";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { MarketingLessonsHubRetryableErrorShell } from "@/components/pathway-lessons/marketing-lessons-hub-retryable-error-shell";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubFullLessonLinkNav } from "@/components/pathway-lessons/lesson-hub-full-lesson-link-nav";
import { MarketingLessonsHubCategoryFirstIndex } from "@/components/pathway-lessons/marketing-lessons-hub-category-first-index";
import {
  assessMarketingLessonHubPipelineCollapseGuard,
  shouldShowMarketingLessonHubInvariantErrorShell,
} from "@/lib/lessons/pathway-lesson-hub-pipeline-collapse-guard";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { marketingCatCompletePoolUsable } from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import {
  alliedProfessionTrackChipLabel,
  getAlliedProfessionByProfessionKey,
} from "@/lib/allied/allied-professions-registry";
import { buildAlliedGlobalHubPath, isAlliedHealthPathway } from "@/lib/allied/allied-global-pathway";
import { exclusiveTopicSlugsForAlliedProfession } from "@/lib/allied/allied-profession-lesson-exclusive-scope";
import {
  ALLIED_PROFESSION_QUERY_PARAM,
  isAlliedMarketingCorePathwayId,
} from "@/lib/lessons/canonical-lessons-hubs";
import {
  ALLIED_TAXONOMY_QUERY_PARAM,
  alliedProfessionTaxonomyMetaDescription,
  alliedProfessionTaxonomyMetaTitle,
  getAlliedProfessionTaxonomyCategories,
  normalizeAlliedTaxonomySlugForProfession,
} from "@/lib/allied/allied-profession-taxonomy";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

/** Canonical Canada RN hub path (used for legacy ops grep + optional verbose console). */
const RN_CANADA_NCLEX_LESSONS_HUB_PATH = "/canada/rn/nclex-rn/lessons" as const;

function resolvedMarketingHubVerifySlugCap(): number {
  const raw = process.env.NN_MARKETING_HUB_VERIFY_SLUG_CAP?.trim();
  if (raw && /^\d+$/.test(raw)) {
    const n = Number(raw);
    if (Number.isFinite(n)) return Math.min(2000, Math.max(60, Math.floor(n)));
  }
  return PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP;
}

function marketingHubPipelineVerboseLoggingEnabled(routePathname: string): boolean {
  return (
    routePathname === RN_CANADA_NCLEX_LESSONS_HUB_PATH ||
    process.env.NN_MARKETING_HUB_PIPELINE_DIAGNOSTICS === "1" ||
    process.env.RN_LESSONS_HUB_DIAGNOSTICS === "1"
  );
}

type RnLessonsHubActualCountsPayload = {
  rawDbCount: number | null;
  afterSlugNormalizeCount: number | null;
  afterPathwayContextCount: number | null;
  afterDedupeCount: number | null;
  renderableAllCount: number;
  /** Rows after {@link prepareLessonsForHubCurriculum} (library dedupe + organize + href filter). */
  afterPrepareCount: number | null;
  afterVerifyCount: number | null;
  finalRenderedCardCount: number | null;
  total: number;
  snapshotUsed: boolean;
  verifyCallsCount: number | null;
  topDropReasons: Array<{ reason: string; count: number }>;
};

function hubDiagFinite(n: number | undefined): number | null {
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

function marketingLessonsHubLoadErrorDetail(
  lessonsPageLoad: { reason: string; timedOut: boolean; detail?: string; dbFailureCategory?: HubDbFailureCategory },
): string {
  if (lessonsPageLoad.reason === "invalid_payload") {
    return "Load error: invalid response from the lesson service.";
  }
  const cat = lessonsPageLoad.dbFailureCategory;
  if (cat === "db_missing_url") return "Database is not configured for this deployment (missing DATABASE_URL).";
  if (cat === "db_auth_failure") {
    return "Database authentication failed (check DATABASE_URL user/password and pooler credentials).";
  }
  if (cat === "db_timeout" || lessonsPageLoad.timedOut) {
    return "The database request timed out or was cancelled. Try again in a moment.";
  }
  if (cat === "db_unreachable") return "We could not reach the database server. Try again shortly.";
  if (cat === "db_query_shape_failure") return "Internal query error while loading lessons. Our team has been notified via logs.";
  if (cat === "db_error") return "A database error occurred while loading lessons.";
  return "The lesson list request failed before completion.";
}

function logMarketingHubPipelineActualCounts(
  routePathname: string,
  payload: RnLessonsHubActualCountsPayload,
  extra?: Record<string, string | number | boolean | undefined>,
): void {
  if (!marketingHubPipelineVerboseLoggingEnabled(routePathname)) return;
  const legacyLabel = routePathname === RN_CANADA_NCLEX_LESSONS_HUB_PATH;
  const line = JSON.stringify({ routePathname, ...payload });
  if (legacyLabel || process.env.RN_LESSONS_HUB_DIAGNOSTICS === "1") {
    console.error("RN_LESSONS_HUB_ACTUAL_COUNTS", line);
  } else {
    console.error("MARKETING_HUB_PIPELINE_COUNTS", line);
  }
  safeServerLog("pathway_lessons", legacyLabel ? "RN_LESSONS_HUB_ACTUAL_COUNTS" : "MARKETING_HUB_PIPELINE_COUNTS", {
    stage: "marketing_hub_inventory_audit",
    routePathname,
    counts_json: JSON.stringify(payload),
    ...extra,
  });
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;
/** Aggregates + paginated hub queries can run long on cold DB; avoid hard serverless timeouts under spike load. */
export const maxDuration = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams: Promise<{
    q?: string;
    page?: string;
    pageSize?: string;
    topicSlug?: string;
    alliedProfession?: string;
    alliedTaxonomy?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const hubPath = `${pathname}/lessons`;
  const sp = await searchParams;
  const q = normalizePathwayHubSearchQuery(sp.q);
  const topicSlugNorm = normalizeMarketingLessonsHubTopicSlug(
    typeof sp.topicSlug === "string" ? sp.topicSlug : undefined,
  );
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};
      if (isAlliedHealthPathway(pathway)) {
        const alliedQs = new URLSearchParams();
        if (topicSlugNorm) alliedQs.set("topicSlug", topicSlugNorm);
        if (q) alliedQs.set("q", q);
        if (page > 1) alliedQs.set("page", String(page));
        const apRaw = typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
        if (apRaw) alliedQs.set(ALLIED_PROFESSION_QUERY_PARAM, apRaw);
        const taxRaw = typeof sp.alliedTaxonomy === "string" ? sp.alliedTaxonomy.trim().toLowerCase() : "";
        if (taxRaw) alliedQs.set(ALLIED_TAXONOMY_QUERY_PARAM, taxRaw);
        const canonicalPath = buildAlliedGlobalHubPath("lessons");
        const canonicalHref = alliedQs.toString() ? `${canonicalPath}?${alliedQs.toString()}` : canonicalPath;
        return {
          title: "Allied Health lessons | NurseNest",
          description: "Occupation-scoped Allied Health lessons with global unit switching and shared study surfaces.",
          alternates: { canonical: absoluteUrl(canonicalHref) },
          openGraph: {
            title: "Allied Health lessons | NurseNest",
            description: "Occupation-scoped Allied Health lessons with global unit switching and shared study surfaces.",
            url: absoluteUrl(canonicalHref),
            type: "website",
          },
          ...(q ? { robots: { index: false, follow: true } } : {}),
        };
      }
      const pathOnly = buildExamPathwayPath(pathway, "lessons");
      const qs = new URLSearchParams();
      if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
      if (q) qs.set("q", q);
      if (page > 1) qs.set("page", String(page));
      const apRaw = typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
      let alliedProfForMeta: ReturnType<typeof getAlliedProfessionByProfessionKey> = undefined;
      if (apRaw && isAlliedMarketingCorePathwayId(pathway.id)) {
        alliedProfForMeta = getAlliedProfessionByProfessionKey(apRaw);
        if (alliedProfForMeta) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfForMeta.professionKey);
      }
      const taxNormMeta =
        alliedProfForMeta && typeof sp.alliedTaxonomy === "string"
          ? normalizeAlliedTaxonomySlugForProfession(alliedProfForMeta.professionKey, sp.alliedTaxonomy)
          : null;
      if (taxNormMeta) qs.set(ALLIED_TAXONOMY_QUERY_PARAM, taxNormMeta);
      const pathWithQuery = qs.toString() ? `${pathOnly}?${qs.toString()}` : pathOnly;
      const canonical = absoluteUrl(pathWithQuery);

      let title = pathwayLessonHubMetaTitle(pathway);
      let description = pathwayLessonHubMetaDescription(pathway);
      if (taxNormMeta && alliedProfForMeta) {
        const cat = getAlliedProfessionTaxonomyCategories(alliedProfForMeta.professionKey).find(
          (c) => c.slug === taxNormMeta,
        );
        if (cat) {
          title = alliedProfessionTaxonomyMetaTitle(pathway, alliedProfForMeta.h1, cat.label);
          description = alliedProfessionTaxonomyMetaDescription(pathway, alliedProfForMeta.h1, cat);
        }
      } else if (topicSlugNorm) {
        const loc = await getMarketingLocaleForDefaultRoute();
        try {
          const topicClusters = await listTopicClustersForPublicNavigation(pathway.id, loc);
          const label =
            topicClusters.find((t) => t.topicSlug === topicSlugNorm)?.label ?? topicSlugNorm.replace(/-/g, " ");
          title = pathwayLessonTopicClusterMetaTitle(pathway, label);
          description = pathwayLessonTopicClusterMetaDescription(pathway, label);
        } catch {
          /* keep hub defaults */
        }
      }

      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
        ...(q ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: hubPath, locale: countrySlug, routeGroup: "marketing.exam_hub.lessons" },
  );
}

function buildAlliedLessonsRedirectUrl(searchParams: Awaited<Props["searchParams"]>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value.trim()) qs.set(key, value);
  }
  const dest = buildAlliedGlobalHubPath("lessons");
  return qs.size > 0 ? `${dest}?${qs.toString()}` : dest;
}

export default async function PathwayLessonsHubPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  const sp = await searchParams;
  const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) {
    safeServerLog("pathway_lessons", "marketing_lessons_hub_pathway_unresolved", {
      stage: "pathway_resolution",
      country_slug: countrySlug,
      url_role_slug: roleTrack,
      exam_code: examCode,
      route_pathname: `${pathname}/lessons`,
      lesson_content_locale: lessonContentLocale,
    });
    const devSegments =
      process.env.NODE_ENV === "development"
        ? ` Requested marketing segments: locale=${countrySlug}, slug=${roleTrack}, examCode=${examCode}.`
        : "";
    return (
      <main
        className="mx-auto max-w-2xl px-4 py-16"
        data-nn-qa-pathway-lessons-unavailable="true"
      >
        <h1 className="text-xl font-semibold text-[var(--theme-heading-text)]">
          Lessons hub unavailable for this pathway.
        </h1>
        <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
          The URL does not match a published NurseNest exam pathway. Use the exam overview or browse exams to find
          your track.{devSegments}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/exams"
            className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--semantic-panel-muted)]"
          >
            Browse exams
          </Link>
          <Link href="/" className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Home
          </Link>
        </div>
      </main>
    );
  }
  if (isAlliedHealthPathway(pathway)) {
    permanentRedirect(buildAlliedLessonsRedirectUrl(sp));
  }

  const hubRouteT0 = performance.now();
  lessonsPerfMark("route_start", { pathwayId: pathway.id, surface: "pathway_lessons_hub_page" });
  try {
  const base = marketingPathwayLessonsIndexPath(pathway);
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const rawSize = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;
  const pageSizeRequested = Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(8, Math.floor(rawSize)));
  /** Same normalization as hub list SQL/catalog filters (min length, trim) — avoids listOpts vs loader mismatch. */
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const topicSlugNorm = normalizeMarketingLessonsHubTopicSlug(
    typeof sp.topicSlug === "string" ? sp.topicSlug : undefined,
  );
  const rawAlliedProf =
    typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
  const alliedProfessionResolved =
    isAlliedMarketingCorePathwayId(pathway.id) && rawAlliedProf
      ? getAlliedProfessionByProfessionKey(rawAlliedProf)
      : null;
  const alliedProfessionKey = alliedProfessionResolved?.professionKey ?? "";
  const alliedTaxonomyNorm =
    alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
      ? normalizeAlliedTaxonomySlugForProfession(
          alliedProfessionResolved.professionKey,
          typeof sp.alliedTaxonomy === "string" ? sp.alliedTaxonomy : undefined,
        )
      : null;
  const alliedTaxonomyCategory =
    alliedTaxonomyNorm && alliedProfessionResolved
      ? getAlliedProfessionTaxonomyCategories(alliedProfessionResolved.professionKey).find(
          (c) => c.slug === alliedTaxonomyNorm,
        )
      : undefined;

  const routePathLessons = `${pathname}/lessons`;
  const isDefaultUnfilteredMarketingLessonsHub =
    !qEffective && !topicSlugNorm && !alliedProfessionKey;

  let listOpts: MarketingHubLessonsListOptions | undefined;
  if (alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)) {
    const exclusive = exclusiveTopicSlugsForAlliedProfession(pathway.id, alliedProfessionResolved.professionKey);
    const drill =
      !alliedTaxonomyNorm &&
      topicSlugNorm &&
      exclusive.includes(topicSlugNorm.trim().toLowerCase())
        ? [topicSlugNorm.trim().toLowerCase()]
        : undefined;
    const tax = alliedTaxonomyNorm ? [alliedTaxonomyNorm] : undefined;
    listOpts = qEffective
      ? {
          q: qEffective,
          alliedProfessionKey: alliedProfessionResolved.professionKey,
          ...(drill ? { topicSlugsIn: drill } : {}),
          ...(tax ? { taxonomySlugsIn: tax } : {}),
        }
      : {
          alliedProfessionKey: alliedProfessionResolved.professionKey,
          ...(drill ? { topicSlugsIn: drill } : {}),
          ...(tax ? { taxonomySlugsIn: tax } : {}),
        };
  } else {
    listOpts =
      qEffective && topicSlugNorm
        ? { q: qEffective, topicSlugsIn: [topicSlugNorm] }
        : qEffective
          ? { q: qEffective }
          : topicSlugNorm
            ? { topicSlugsIn: [topicSlugNorm] }
            : undefined;
  }

  if (isDefaultUnfilteredMarketingLessonsHub) {
    return (
      <MarketingLessonsHubCategoryFirstIndex
        pathway={pathway}
        base={base}
        pathname={pathname}
        routePathLessons={routePathLessons}
        countrySlug={countrySlug}
        roleTrack={roleTrack}
        examCode={examCode}
        lessonContentLocale={lessonContentLocale}
      />
    );
  }

  const pageRenderT0 = performance.now();
  console.error(`[lessons-perf] marketing_hub_render_start pathway=${pathway.id} locale=${lessonContentLocale} page=${pageRequested}`);

  const hubLoadT0 = performance.now();
  const taxonomyClustersPromise =
    alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
      ? listAlliedProfessionTaxonomyClustersForPublicHub(
          pathway.id,
          alliedProfessionResolved.professionKey,
          lessonContentLocale,
        )
      : Promise.resolve([]);

  const [alliedTaxonomyClustersRaw, hubAggregatesBundle] = await Promise.all([
    taxonomyClustersPromise,
    loadPathwayLessonsHubAggregates(
      pathway,
      {
        pageRequested,
        pageSizeRequested,
        lessonContentLocale,
        listOpts,
        qEffective: qEffective ?? "",
        skipLaunchBundle: Boolean(qEffective),
        includeLessonCount: false,
        includeLaunchBundle: false,
        includeTopics: false,
      },
      {
        pathname: `${pathname}/lessons`,
        locale: countrySlug,
        country: countrySlug,
        examCode,
        pathwayId: pathway.id,
        roleTrack,
      },
    ),
  ]);

  const {
    pageResult,
    lessonsPageLoad,
    questionSnapshot,
    lessonsPageLoadRejected,
    questionSnapshotLoadRejected,
    lessonsHubSnapshotDiagnostics,
  } = hubAggregatesBundle;

  const alliedTaxonomyChipRows =
    alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
      ? (() => {
          const cats = getAlliedProfessionTaxonomyCategories(alliedProfessionResolved.professionKey);
          const countBy = new Map(alliedTaxonomyClustersRaw.map((c) => [c.slug, c.count]));
          return cats
            .map((c) => ({ slug: c.slug, label: c.label, count: countBy.get(c.slug) ?? 0 }))
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
        })()
      : [];

  const hubAggregatesDurationMs = Math.round(performance.now() - hubLoadT0);
  console.error(`[lessons-perf] hub_aggregates_done pathway=${pathway.id} total=${pageResult.total} ms=${hubAggregatesDurationMs} source=${lessonsPageLoad.status === "ok" ? (lessonsPageLoad.sourceUsed ?? "?") : "error"}`);

  safeServerLog("pathway_lessons", "marketing_lessons_hub_loader_snapshot", {
    stage: "post_aggregates",
    pathway_id: pathway.id,
    country_slug: countrySlug,
    url_role_slug: roleTrack,
    exam_code: examCode,
    route_pathname: `${pathname}/lessons`,
    lesson_content_locale: lessonContentLocale,
    lessons_page_load_status: lessonsPageLoad.status,
    lessons_page_load_reason:
      lessonsPageLoad.status === "error" ? lessonsPageLoad.reason : "",
    lessons_page_source_used:
      lessonsPageLoad.status === "ok" ? (lessonsPageLoad.sourceUsed ?? "") : "",
    loader_total: String(pageResult.total),
    loader_page: String(pageResult.page),
    page_size: String(pageSizeRequested),
    hub_aggregates_ms: String(hubAggregatesDurationMs),
    snapshot_used: lessonsHubSnapshotDiagnostics.snapshotUsed ? "1" : "0",
    question_snapshot_ok: questionSnapshot.status === "ok" ? "1" : "0",
  });

  if (
    isDefaultUnfilteredMarketingLessonsHub &&
    marketingHubPipelineVerboseLoggingEnabled(routePathLessons) &&
    lessonsPageLoad.status === "ok" &&
    pageResult.total > 0 &&
    pageRequested !== pageResult.page
  ) {
    const raEarly = pageResult.renderableAll ?? pageResult.items;
    const ldEarly = pageResult.loadDiagnostics;
    logMarketingHubPipelineActualCounts(
      routePathLessons,
      {
        rawDbCount: hubDiagFinite(ldEarly?.rawDbCount),
        afterSlugNormalizeCount: hubDiagFinite(ldEarly?.afterSlugNormalizeCount),
        afterPathwayContextCount: hubDiagFinite(ldEarly?.afterPathwayContextCount),
        afterDedupeCount: hubDiagFinite(ldEarly?.afterDedupeCount),
        renderableAllCount: raEarly.length,
        afterPrepareCount: null,
        afterVerifyCount: null,
        finalRenderedCardCount: null,
        total: pageResult.total,
        snapshotUsed: lessonsHubSnapshotDiagnostics.snapshotUsed,
        verifyCallsCount: null,
        topDropReasons: [],
      },
      {
        pathway_id: pathway.id,
        phase: "pre_verify_pagination_redirect",
        page_requested: pageRequested,
        page_loader: pageResult.page,
      },
    );
  }

  const hubQuerySuffix = (() => {
    const qs = new URLSearchParams();
    if (qEffective) qs.set("q", qEffective);
    if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
    if (alliedProfessionKey) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfessionKey);
    if (alliedTaxonomyNorm) qs.set(ALLIED_TAXONOMY_QUERY_PARAM, alliedTaxonomyNorm);
    const s = qs.toString();
    return s ? `?${s}` : "";
  })();

  if (pageResult.total > 0 && pageRequested !== pageResult.page) {
    const qs = new URLSearchParams();
    if (pageResult.page > 1) qs.set("page", String(pageResult.page));
    if (qEffective) qs.set("q", qEffective);
    if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
    if (alliedProfessionKey) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfessionKey);
    if (alliedTaxonomyNorm) qs.set(ALLIED_TAXONOMY_QUERY_PARAM, alliedTaxonomyNorm);
    const query = qs.toString();
    redirect(query ? `${base}?${query}` : base);
  }

  if (lessonsPageLoad.status === "error") {
    const topicClusterFallbackLabel = topicSlugNorm ? topicSlugNorm.replace(/-/g, " ") : null;
    const { crumbs, schemaItems } =
      topicSlugNorm && topicClusterFallbackLabel
        ? pathwayTopicClusterBreadcrumbs(pathway, topicSlugNorm, topicClusterFallbackLabel)
        : pathwayLessonsHubBreadcrumbs(pathway);
    const examName = pathwayRegionAwareExamName(pathway);
    const pageTitle =
      alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
        ? alliedTaxonomyCategory
          ? `${alliedTaxonomyCategory.label} — ${alliedProfessionTrackChipLabel(alliedProfessionResolved)}`
          : `${alliedProfessionTrackChipLabel(alliedProfessionResolved)} lessons`
        : "Lessons";
    const headerDescription =
      alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id) && alliedTaxonomyCategory
        ? `Browse ${alliedTaxonomyCategory.label.toLowerCase()} lessons for ${alliedProfessionResolved.h1} on ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
        : alliedProfessionResolved && !topicSlugNorm
          ? `Browse ${alliedProfessionResolved.h1} lessons for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
          : topicClusterFallbackLabel != null
            ? `Lessons in “${topicClusterFallbackLabel}” for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
            : `Browse lessons by clinical area for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`;
    const heroTitle = formatTitleCase(pageTitle);
    const heroSubtitle = formatSentenceCase(headerDescription);
    const overviewHref = marketingExamHubBasePath(pathway);
    const questionsHref = buildExamPathwayPath(pathway, "questions");
    const catHref = buildExamPathwayPath(pathway, "cat");
    const canStartCat =
      !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);
    const lessonHubSurfaceChips = [
      { label: "Practice questions", href: questionsHref },
      {
        label: questionSnapshotLoadRejected
          ? "Adaptive CAT — status unavailable"
          : canStartCat
            ? "Adaptive CAT"
            : "Adaptive CAT unavailable",
        href: catHref,
      },
      { label: "Flashcards", href: pathwayHubAppFlashcardsHref(pathway.id) },
      { label: "Practice exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
      { label: "Exam overview", href: overviewHref },
    ];
    const canadaHref =
      pathway.countrySlug === "canada"
        ? `${base}${hubQuerySuffix}`
        : `${equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base}${hubQuerySuffix}`;
    const usHref =
      pathway.countrySlug === "us"
        ? `${base}${hubQuerySuffix}`
        : `${equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base}${hubQuerySuffix}`;
    const toolbar = (
      <LessonsToolbar
        searchBasePath={base}
        initialQuery={qEffective ?? undefined}
        preservedTopicSlug={topicSlugNorm ?? undefined}
        preservedAlliedProfession={alliedProfessionKey || undefined}
        preservedAlliedTaxonomy={alliedTaxonomyNorm ?? undefined}
        countryOptions={[
          { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
          { label: "US", href: usHref, active: pathway.countrySlug === "us" },
        ]}
      />
    );
    if (marketingHubPipelineVerboseLoggingEnabled(routePathLessons)) {
      const errRenderable = pageResult.renderableAll ?? pageResult.items;
      const errLd = pageResult.loadDiagnostics;
      logMarketingHubPipelineActualCounts(
        routePathLessons,
        {
          rawDbCount: hubDiagFinite(errLd?.rawDbCount),
          afterSlugNormalizeCount: hubDiagFinite(errLd?.afterSlugNormalizeCount),
          afterPathwayContextCount: hubDiagFinite(errLd?.afterPathwayContextCount),
          afterDedupeCount: hubDiagFinite(errLd?.afterDedupeCount),
          renderableAllCount: errRenderable.length,
          afterPrepareCount: null,
          afterVerifyCount: null,
          finalRenderedCardCount: null,
          total: pageResult.total,
          snapshotUsed: lessonsHubSnapshotDiagnostics.snapshotUsed,
          verifyCallsCount: null,
          topDropReasons: [],
        },
        {
          lessons_page_error: "1",
          lessons_page_load_reason: lessonsPageLoad.reason,
          pathway_id: pathway.id,
        },
      );
    }
    safeServerLog("pathway_lessons", "marketing_hub_lessons_page_error_surface", {
      pathway_id: pathway.id,
      country_slug: countrySlug,
      role_track: roleTrack,
      exam_code: examCode,
      lesson_content_locale: lessonContentLocale,
      lessons_page_load_status: lessonsPageLoad.status,
      lessons_page_load_reason: lessonsPageLoad.reason,
      timed_out: lessonsPageLoad.timedOut ? "1" : "0",
      fetch_duration_ms: String(Math.round(lessonsPageLoad.fetchDurationMs)),
      outcome: "error",
      fallback_used: "false",
    });
    const errRenderable = pageResult.renderableAll ?? pageResult.items;
    return (
      <>
        <MarketingHubSmokeDiagnosticsJson
          payload={{
            surface: "marketing_pathway_lessons",
            outcome: "lessons_load_error",
            pathwayId: pathway.id,
            routePathname: `${pathname}/lessons`,
            contentLocale: lessonContentLocale,
            lessonsPageLoadReason: lessonsPageLoad.reason,
            lessonsPageLoadTimedOut: lessonsPageLoad.timedOut,
            lessonsPageLoadDbFailureCategory: lessonsPageLoad.dbFailureCategory ?? null,
            loaderTotal: pageResult.total,
            renderableAllCount: errRenderable.length,
          }}
        />
        <MarketingLessonsHubRetryableErrorShell
          title={heroTitle}
          subtitle={heroSubtitle}
          eyebrow={pathway.shortName.trim() || pathway.displayName}
          pathwayTrack={pathway.roleTrack}
          toolbar={toolbar}
          backLabel={`${examName} overview`}
          backHref={overviewHref}
          crumbs={crumbs}
          schemaItems={schemaItems}
          surfaceChips={lessonHubSurfaceChips}
          errorTitle={"Lessons temporarily unavailable"}
          errorBody={
            "We could not load the lesson library from our database right now. Your progress is safe — please retry in a moment."
          }
          errorDetail={marketingLessonsHubLoadErrorDetail(lessonsPageLoad)}
          retryHref={`${base}${hubQuerySuffix}`}
          secondaryHref={overviewHref}
          secondaryLabel="Back to exam overview"
          supportHref={`/${countrySlug}/contact`}
          supportLabel="Contact support"
        />
      </>
    );
  }

  /** Slug-safe rows from the same loader result used for pagination (`items` / `renderableAll`). */
  const renderableAllIn = pageResult.renderableAll ?? pageResult.items;
  const rawHubLessonRows = renderableAllIn.filter(pathwayLessonHasRenderableHubSlug);
  /** Dedupe + taxonomy guard + linkable href — must match curriculum grid and toolbar count. */
  const prepareT0 = performance.now();
  const { lessons: hubCurriculumPrepared, prepareStages: hubPrepareStages } =
    prepareLessonsForHubCurriculumWithDiagnostics(rawHubLessonRows, {
      pathwayId: pathway.id,
      lessonsBasePath: base,
    });
  const prepareDurationMs = Math.round(performance.now() - prepareT0);
  console.error(`[lessons-perf] prepare_done pathway=${pathway.id} prepared=${hubCurriculumPrepared.length} ms=${prepareDurationMs}`);

  const listWarehouseT0 = performance.now();
  const listWarehouseLocale = await getPathwayLessonListWarehouseLocaleForHub(pathway.id, lessonContentLocale);
  const listWarehouseResolveMs = Math.round(performance.now() - listWarehouseT0);

  /**
   * FIX: Only verify lessons on the current page (not the entire catalog).
   *
   * Previously the verify cap was a flat 400, meaning every hub render fired 400 individual
   * full-row Prisma reads (including heavy sections JSONB), each with a 15-second timeout.
   * At concurrency=8 that produced 50 serial rounds × query-time, causing 5+ minute renders.
   *
   * Now we cap at `effectiveHubPageSize × pageRequested` so:
   *   Page 1: verify  60 lessons  (8 concurrent rounds of 8 queries)
   *   Page 2: verify 120 lessons  (15 rounds)
   *   etc.
   * Lessons beyond the cap are kept as hubMarketingDegraded="unverified_inventory_fill" so
   * the total/pagination counts remain accurate — they are just non-clickable in the card nav.
   */
  const effectiveHubPageSizeForVerify = Math.min(
    PATHWAY_HUB_PAGE_SIZE_MAX,
    Math.max(pageSizeRequested, PATHWAY_HUB_PAGE_SIZE_DEFAULT, 1),
  );
  const pageVerifyCap = Math.min(
    resolvedMarketingHubVerifySlugCap(),
    effectiveHubPageSizeForVerify * pageRequested,
  );

  /** Cross-check list rows with fresh detail loads; soft failures stay as {@link PathwayLessonRecord.hubMarketingDegraded}. */
  const verifyT0 = performance.now();
  console.error(`[lessons-perf] verify_start pathway=${pathway.id} prepared=${hubCurriculumPrepared.length} cap=${pageVerifyCap} page=${pageRequested}`);
  const vr = await verifyMarketingHubLessonRowsResolve(pathway, hubCurriculumPrepared, lessonContentLocale, {
    listWarehouseLocale,
    prepareStages: hubPrepareStages,
    maxUniqueSlugsToVerify: pageVerifyCap,
  });
  const verifyDurationMs = Math.round(performance.now() - verifyT0);
  console.error(`[lessons-perf] verify_done pathway=${pathway.id} kept=${vr.kept.length} excluded=${vr.excluded.length} ms=${verifyDurationMs}`);
  const fillResult = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname: `${pathname}/lessons`,
    lessonContentLocale,
    listWarehouseLocale,
    lessonsBasePath: base,
    minVisible: MARKETING_HUB_MIN_VISIBLE_LESSONS,
    verifiedKept: vr.kept,
    hubCurriculumPrepared,
    loaderRenderable: rawHubLessonRows,
  });
  let hubCurriculumLessons = fillResult.lessons;
  const hubVerifyDiagnostics = vr.diagnostics;
  const fillDiag = fillResult.diagnostics;
  if (fillDiag.filledStrictCount > 0) {
    safeServerLog("pathway_lessons", "marketing_hub_min_visible_inventory_fill", {
      stage: "marketing_hub_inventory_fill_applied",
      pathway_id: pathway.id,
      country_slug: countrySlug,
      role_track: roleTrack,
      exam_code: examCode,
      route: fillDiag.routePathname,
      content_locale: fillDiag.contentLocale,
      list_warehouse_locale: fillDiag.listWarehouseLocale,
      initial_strict: String(fillDiag.initialStrictCount),
      filled_strict: String(fillDiag.filledStrictCount),
      final_strict: String(fillDiag.finalStrictCount),
      final_total: String(fillDiag.finalTotalCount),
      candidate_slugs_discovered: String(fillDiag.candidateSlugsDiscovered),
      candidate_slugs_evaluated: String(fillDiag.candidateSlugsEvaluated),
      rejected_evaluate: String(fillDiag.rejectedEvaluateCount),
      evaluate_reasons_json: JSON.stringify(fillDiag.evaluateRejectionReasons),
      prefilter_json: JSON.stringify(fillDiag.prefilterDropped),
      rejects_by_reason_json: JSON.stringify({
        evaluate: fillDiag.evaluateRejectionReasons,
        prefilter: fillDiag.prefilterDropped,
      }),
      after_verify_before_fill: String(vr.kept.length),
      after_fill: String(hubCurriculumLessons.length),
    });
  }
  if (
    fillDiag.finalStrictCount < MARKETING_HUB_MIN_VISIBLE_LESSONS &&
    pageResult.total >= MARKETING_HUB_MIN_VISIBLE_LESSONS
  ) {
    if (hubCurriculumLessons.length > 0) {
      safeServerLog("pathway_lessons", "marketing_hub_inventory_fill_degraded", {
        stage: "marketing_hub_inventory_fill_degraded",
        pathway_id: pathway.id,
        country_slug: countrySlug,
        role_track: roleTrack,
        exam_code: examCode,
        route_pathname: routePathLessons,
        loader_total: String(pageResult.total),
        strict_before: String(fillDiag.initialStrictCount),
        strict_after: String(fillDiag.finalStrictCount),
        min_visible: String(MARKETING_HUB_MIN_VISIBLE_LESSONS),
        candidates_considered: String(fillDiag.candidateSlugsEvaluated),
        rejects_by_reason_json: JSON.stringify({
          evaluate: fillDiag.evaluateRejectionReasons,
          prefilter: fillDiag.prefilterDropped,
        }),
        note: "below_min_strict_but_rows_rendered",
      });
    } else {
      safeServerLog("pathway_lessons", "marketing_hub_inventory_below_minimum_after_fill_critical", {
        stage: "marketing_hub_inventory_rejected",
        pathway_id: pathway.id,
        country_slug: countrySlug,
        role_track: roleTrack,
        exam_code: examCode,
        loader_total: String(pageResult.total),
        after_fill_strict: String(fillDiag.finalStrictCount),
        after_fill_total: String(hubCurriculumLessons.length),
        min_requested: String(MARKETING_HUB_MIN_VISIBLE_LESSONS),
        evaluate_reasons_json: JSON.stringify(fillDiag.evaluateRejectionReasons),
      });
    }
  }
  if (process.env.NN_MARKETING_HUB_DETAIL_PROBE === "1" && hubCurriculumLessons.length > 0) {
    await probeMarketingHubLessonDetailReachability({
      pathway,
      hubMarketingLocale: lessonContentLocale,
      listWarehouseLocale,
      lessonSlugs: hubCurriculumLessons.map((l) => l.slug),
    });
  }
  if (hubCurriculumPrepared.length > 0 && hubCurriculumLessons.length === 0) {
    safeServerLog("pathway_lessons", "marketing_hub_verify_all_rows_excluded_soft", {
      pathway_id: pathway.id,
      country_slug: countrySlug,
      role_track: roleTrack,
      exam_code: examCode,
      lesson_content_locale: lessonContentLocale,
      prepared_count: String(hubCurriculumPrepared.length),
      verify_kept_count: "0",
      reasons_json: JSON.stringify(hubVerifyDiagnostics.excludedByReason ?? {}),
      outcome: "verify_excluded_all_rows",
      feature_surface: "marketing_lessons_hub",
    });
  }
  /**
   * Pagination slice for the curriculum grid: bounded page size so first paint does not build hundreds of cards.
   * Toolbar / badge counts still use the full verified inventory length (`hubCurriculumLessons.length`).
   */
  const effectiveHubPageSize = Math.min(
    PATHWAY_HUB_PAGE_SIZE_MAX,
    Math.max(pageSizeRequested, PATHWAY_HUB_PAGE_SIZE_DEFAULT, 1),
  );
  const hubVerifiedPage = sliceNormalizedHubLessons(hubCurriculumLessons, pageRequested, effectiveHubPageSize);
  /** Current page only — grouping, progress batching, and diagnostics stay O(page size). */
  const lessonsForCurriculumHub = hubVerifiedPage.items;
  const groupT0 = performance.now();
  const hubSectionModel = buildPathwayLessonSystemSections(lessonsForCurriculumHub, pathway.id);
  const stage6SectionModelLessonRows = hubSectionModel.reduce((n, s) => n + s.lessons.length, 0);
  const stage6LinkableLessonRows = hubSectionModel.reduce(
    (n, s) =>
      n + s.lessons.filter((l) => pathwayLessonMarketingHubVerifiedCardHref(base, l) != null).length,
    0,
  );
  /** Matches {@link LessonSystemCard}: only first N link rows render per section (CASE D vs curl unique hrefs). */
  const finalRenderedVisibleLessonLinkCount = hubSectionModel.reduce((sum, s) => {
    const linkable = s.lessons.filter((l) => pathwayLessonMarketingHubVerifiedCardHref(base, l) != null);
    return sum + Math.min(LESSON_SYSTEM_HUB_CARD_PREVIEW_MAX, linkable.length);
  }, 0);
  const groupingDurationMs = Math.round(performance.now() - groupT0);

  const pageWallClockMs = Math.round(performance.now() - pageRenderT0);
  console.error(`[lessons-perf] render_ready pathway=${pathway.id} page=${pageRequested} grid_rows=${lessonsForCurriculumHub.length} linkable=${stage6LinkableLessonRows} aggregates_ms=${hubAggregatesDurationMs} prepare_ms=${prepareDurationMs} verify_ms=${verifyDurationMs} grouping_ms=${groupingDurationMs} total_ms=${pageWallClockMs}`);

  safeServerLog("pathway_lessons", "marketing_lessons_hub_render_ready", {
    stage: "render_ready",
    pathway_id: pathway.id,
    route_pathname: routePathLessons,
    body_system_section_count: String(hubSectionModel.length),
    curriculum_grid_rows: String(lessonsForCurriculumHub.length),
    linkable_lesson_rows: String(stage6LinkableLessonRows),
    grouping_ms: String(groupingDurationMs),
  });

  const ld = pageResult.loadDiagnostics;
  const rankedReasons = hubVerifyDiagnostics.exclusionReasonsRanked ?? [];
  const topDropReasonsForPayload = rankedReasons
    .slice(0, 8)
    .map((x) => ({ reason: String(x.reason), count: x.count }));

  if (marketingHubPipelineVerboseLoggingEnabled(routePathLessons)) {
    const totalLoaderMs =
      hubAggregatesDurationMs +
      prepareDurationMs +
      listWarehouseResolveMs +
      verifyDurationMs +
      groupingDurationMs;
    logMarketingHubPipelineActualCounts(
      routePathLessons,
      {
        rawDbCount: hubDiagFinite(ld?.rawDbCount),
        afterSlugNormalizeCount: hubDiagFinite(ld?.afterSlugNormalizeCount),
        afterPathwayContextCount: hubDiagFinite(ld?.afterPathwayContextCount),
        afterDedupeCount: hubDiagFinite(ld?.afterDedupeCount),
        renderableAllCount: renderableAllIn.length,
        afterPrepareCount: hubCurriculumPrepared.length,
        afterVerifyCount: hubCurriculumLessons.length,
        finalRenderedCardCount: finalRenderedVisibleLessonLinkCount,
        total: pageResult.total,
        snapshotUsed: lessonsHubSnapshotDiagnostics.snapshotUsed,
        verifyCallsCount: hubDiagFinite(hubVerifyDiagnostics.verifyResolverCallCount),
        topDropReasons: topDropReasonsForPayload,
      },
      {
        pathway_id: pathway.id,
        stage_6_linkable_rows: stage6LinkableLessonRows,
        stage_6_section_rows: stage6SectionModelLessonRows,
        hub_aggregates_ms: hubAggregatesDurationMs,
        prepare_ms: prepareDurationMs,
        list_warehouse_resolve_ms: listWarehouseResolveMs,
        verify_ms: verifyDurationMs,
        grouping_ms: groupingDurationMs,
        total_loader_ms: totalLoaderMs,
        loader_resolve_ms:
          typeof ld?.resolveDurationMs === "number" && Number.isFinite(ld.resolveDurationMs)
            ? String(ld.resolveDurationMs)
            : undefined,
        loader_slice_ms:
          typeof ld?.sliceDurationMs === "number" && Number.isFinite(ld.sliceDurationMs)
            ? String(ld.sliceDurationMs)
            : undefined,
        grid_prepared_row_count: lessonsForCurriculumHub.length,
        section_model_linkable_rows: stage6LinkableLessonRows,
      },
    );
  }

  safeServerLog("pathway_lessons", "marketing_hub_pipeline_snapshot", {
    stage: "marketing_hub_inventory_audit",
    pathway_id: pathway.id,
    route_pathname: `${pathname}/lessons`,
    hub_page: String(pageRequested),
    hub_page_size: String(pageSizeRequested),
    country_slug: countrySlug,
    role_track: roleTrack,
    exam_code: examCode,
    lesson_content_locale: lessonContentLocale,
    list_warehouse_locale_for_verify: listWarehouseLocale ?? "",
    prepare_stages_json: JSON.stringify(hubPrepareStages),
    list_locale_requested: pageResult.locale?.requested ?? "",
    list_locale_effective: pageResult.locale?.effective ?? "",
    list_locale_used_fallback: pageResult.locale?.usedEnglishFallback ? "1" : "0",
    /** From {@link getPathwayLessonsPageFresh} — same contract as pagination `total` before hub-only prepare/verify. */
    loader_renderable_total: String(pageResult.total),
    loader_renderable_all_len: String(renderableAllIn.length),
    loader_page_items_len: String(pageResult.items.length),
    /** Stage 1: slug-safe rows from loader (pathway/locale scoped upstream in {@link resolveMarketingHubRenderableLessonList}). */
    stage_1_raw_slug_safe_rows: String(rawHubLessonRows.length),
    /** Stage 2: after {@link prepareLessonsForHubCurriculum} (dedupe, organize, href-safe). */
    stage_2_after_prepare: String(hubCurriculumPrepared.length),
    /** Stage 3: unique slugs sent to detail verify. */
    stage_3_verify_unique_slugs: String(hubVerifyDiagnostics.uniqueSlugCount),
    /** Stage 4: rows kept after verify (hydration + publicComplete + pathway context). */
    stage_4_after_verify_kept: String(hubCurriculumLessons.length),
    /** Stage 5: rows rendered in the curriculum grid (current hub page slice). */
    stage_5_curriculum_grid_rows: String(lessonsForCurriculumHub.length),
    /** Stage 6: body-system section model (after orphan-bucket merge) — should match stage 5 for verified rows. */
    stage_6_section_model_lesson_rows: String(stage6SectionModelLessonRows),
    stage_6_linkable_lesson_rows: String(stage6LinkableLessonRows),
    effective_hub_page_size: String(effectiveHubPageSize),
    raw_after_slug_filter: String(rawHubLessonRows.length),
    raw_list_rows: String(rawHubLessonRows.length),
    after_prepare: String(hubCurriculumPrepared.length),
    after_verify_kept: String(hubCurriculumLessons.length),
    lessons_page_load_status: lessonsPageLoad.status,
    lessons_page_task_rejected: lessonsPageLoadRejected ? "1" : "0",
    question_snapshot_rejected: questionSnapshotLoadRejected ? "1" : "0",
    verify_drop_reasons_json: JSON.stringify(hubVerifyDiagnostics.excludedByReason ?? {}),
    verify_exclusion_ranked_json: JSON.stringify(hubVerifyDiagnostics.exclusionReasonsRanked ?? []),
    verify_excluded_slug_samples_json: JSON.stringify(hubVerifyDiagnostics.excludedSlugSamples ?? []),
    verify_dropped_prepared_samples_json: JSON.stringify(
      hubVerifyDiagnostics.droppedPreparedRowSamples?.slice(0, 12) ?? [],
    ).slice(0, 6000),
  });

  if (process.env.NN_MARKETING_HUB_PIPELINE_DEBUG === "1") {
    console.error(
      "NN_MARKETING_HUB_PIPELINE_DEBUG",
      JSON.stringify({
        pathwayId: pathway.id,
        routePathname: `${pathname}/lessons`,
        dbPublishedApprox: ld?.rawDbCount ?? null,
        loaderRenderableTotal: pageResult.total,
        loaderRenderableAllLen: renderableAllIn.length,
        prepareStages: hubPrepareStages,
        verify: {
          incomingPrepared: hubVerifyDiagnostics.incomingPreparedRowCount,
          uniqueSlugs: hubVerifyDiagnostics.uniqueSlugCount,
          kept: hubVerifyDiagnostics.keptRowCount,
          excludedByReason: hubVerifyDiagnostics.excludedByReason,
          excludedSlugSamples: hubVerifyDiagnostics.excludedSlugSamples,
        },
      }),
    );
  }
  const hubListCountForChrome = hubCurriculumLessons.length;
  if (hubVerifiedPage.total > 0 && pageRequested !== hubVerifiedPage.page) {
    const qs = new URLSearchParams();
    if (hubVerifiedPage.page > 1) qs.set("page", String(hubVerifiedPage.page));
    if (qEffective) qs.set("q", qEffective);
    if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
    if (alliedProfessionKey) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfessionKey);
    if (alliedTaxonomyNorm) qs.set(ALLIED_TAXONOMY_QUERY_PARAM, alliedTaxonomyNorm);
    const query = qs.toString();
    redirect(query ? `${base}?${query}` : base);
  }
  const hubPageLessons = hubVerifiedPage.items;
  const lessonsOnPageForPagination = hubPageLessons.length;

  let topicClusterLabel: string | null = null;
  if (topicSlugNorm && !alliedTaxonomyNorm) {
    try {
      const topicClusters = await listTopicClustersForPublicNavigation(pathway.id, lessonContentLocale);
      topicClusterLabel =
        topicClusters.find((t) => t.topicSlug === topicSlugNorm)?.label ?? topicSlugNorm.replace(/-/g, " ");
    } catch {
      topicClusterLabel = topicSlugNorm.replace(/-/g, " ");
    }
  }

  const { crumbs, schemaItems } =
    topicClusterLabel && topicSlugNorm
      ? pathwayTopicClusterBreadcrumbs(pathway, topicSlugNorm, topicClusterLabel)
      : pathwayLessonsHubBreadcrumbs(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const pageTitle =
    alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
      ? alliedTaxonomyCategory
        ? `${alliedTaxonomyCategory.label} — ${alliedProfessionTrackChipLabel(alliedProfessionResolved)}`
        : `${alliedProfessionTrackChipLabel(alliedProfessionResolved)} lessons`
      : "Lessons";
  const headerDescription =
    alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id) && alliedTaxonomyCategory
      ? `Browse ${alliedTaxonomyCategory.label.toLowerCase()} lessons for ${alliedProfessionResolved.h1} on ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
      : alliedProfessionResolved && !topicSlugNorm
        ? `Browse ${alliedProfessionResolved.h1} lessons for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
        : topicClusterLabel != null
          ? `Lessons in “${topicClusterLabel}” for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
          : `Browse lessons by clinical area for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`;

  const heroTitle = formatTitleCase(pageTitle);
  const heroSubtitle = formatSentenceCase(headerDescription);

  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat =
    !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);

  const lessonHubSurfaceChips = [
    { label: "Practice questions", href: questionsHref },
    {
      label: questionSnapshotLoadRejected
        ? "Adaptive CAT — status unavailable"
        : canStartCat
          ? "Adaptive CAT"
          : "Adaptive CAT unavailable",
      href: catHref,
    },
    { label: "Flashcards", href: pathwayHubAppFlashcardsHref(pathway.id) },
    { label: "Practice exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
    { label: "Exam overview", href: overviewHref },
  ];

  const canadaHref =
    pathway.countrySlug === "canada"
      ? `${base}${hubQuerySuffix}`
      : `${equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base}${hubQuerySuffix}`;
  const usHref =
    pathway.countrySlug === "us"
      ? `${base}${hubQuerySuffix}`
      : `${equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base}${hubQuerySuffix}`;

  const toolbar = (
    <LessonsToolbar
      searchBasePath={base}
      initialQuery={qEffective ?? undefined}
      preservedTopicSlug={topicSlugNorm ?? undefined}
      preservedAlliedProfession={alliedProfessionKey || undefined}
      preservedAlliedTaxonomy={alliedTaxonomyNorm ?? undefined}
      totalCount={
        alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
          ? pageResult.total
          : hubListCountForChrome
      }
      countryOptions={[
        { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
        { label: "US", href: usHref, active: pathway.countrySlug === "us" },
      ]}
    />
  );

  const pipelineWallClockMs =
    hubAggregatesDurationMs +
    prepareDurationMs +
    listWarehouseResolveMs +
    verifyDurationMs +
    groupingDurationMs;
  if (isDefaultUnfilteredMarketingLessonsHub && lessonsPageLoad.status === "ok") {
    if (pipelineWallClockMs > 45_000) {
      safeServerLog("pathway_lessons", "lesson_hub_slow_load", {
        pathway_id: pathway.id,
        total_loader_ms: String(pipelineWallClockMs),
      });
    }
    const ldGuard = pageResult.loadDiagnostics;
    const collapse = assessMarketingLessonHubPipelineCollapseGuard({
      rawDbCount: ldGuard?.rawDbCount,
      renderableAllCount: renderableAllIn.length,
      afterPrepareCount: hubCurriculumPrepared.length,
      afterVerifyCount: hubCurriculumLessons.length,
      stage6LinkableLessonRows,
    });
    if (collapse.kind === "violation") {
      safeServerLog("pathway_lessons", collapse.metricEvent, {
        stage: "marketing_hub_inventory_audit",
        pathway_id: pathway.id,
        invariant_code: collapse.invariantCode,
        ...collapse.fields,
      });
    }
    if (collapse.kind === "violation" && shouldShowMarketingLessonHubInvariantErrorShell(collapse, hubCurriculumLessons.length)) {
      safeServerLog("pathway_lessons", "marketing_hub_lessons_page_pipeline_invariant_failed", {
        stage: "marketing_hub_inventory_rejected",
        pathway_id: pathway.id,
        route_pathname: routePathLessons,
        content_locale: lessonContentLocale,
        lesson_content_locale: lessonContentLocale,
        verified_row_count: String(hubCurriculumLessons.length),
        strict_count: String(countStrictMarketingHubInventoryRows(hubCurriculumLessons)),
        invariant_code: collapse.invariantCode,
        metric_event: collapse.metricEvent,
        outcome: "error_shell",
      });
      return (
        <>
          <MarketingHubSmokeDiagnosticsJson
            payload={{
              surface: "marketing_pathway_lessons",
              outcome: "pipeline_invariant_failed",
              pathwayId: pathway.id,
              routePathname: `${pathname}/lessons`,
              contentLocale: lessonContentLocale,
              pipelineInvariantCode: collapse.invariantCode,
              pipelineMetricEvent: collapse.metricEvent,
              pipelineFields: collapse.fields,
              preparedLessonCount: hubCurriculumPrepared.length,
              verifiedLessonCount: hubCurriculumLessons.length,
              finalRenderedLessonLinkCount: finalRenderedVisibleLessonLinkCount,
              loaderTotal: pageResult.total,
            }}
          />
          <MarketingLessonsHubRetryableErrorShell
            title={heroTitle}
            subtitle={heroSubtitle}
            eyebrow={pathway.shortName.trim() || pathway.displayName}
            pathwayTrack={pathway.roleTrack}
            toolbar={toolbar}
            backLabel={`${examName} overview`}
            backHref={overviewHref}
            crumbs={crumbs}
            schemaItems={schemaItems}
            surfaceChips={lessonHubSurfaceChips}
            errorTitle={"Lessons temporarily unavailable"}
            errorBody={
              "The lesson library did not pass a safety check: the visible list does not match how many lessons should be available. This is usually temporary — please retry."
            }
            errorDetail={collapse.userFacingDetail}
            retryHref={`${base}${hubQuerySuffix}`}
            secondaryHref={overviewHref}
            secondaryLabel="Back to exam overview"
            supportHref={`/${countrySlug}/contact`}
            supportLabel="Contact support"
          />
        </>
      );
    }
    if (collapse.kind === "violation" && hubCurriculumLessons.length > 0) {
      safeServerLog("pathway_lessons", "marketing_hub_inventory_fill_degraded", {
        stage: "marketing_hub_inventory_fill_degraded",
        pathway_id: pathway.id,
        route_pathname: routePathLessons,
        lesson_content_locale: lessonContentLocale,
        collapse_invariant: collapse.invariantCode,
        collapse_metric: collapse.metricEvent,
        verified_row_count: String(hubCurriculumLessons.length),
        strict_count: String(countStrictMarketingHubInventoryRows(hubCurriculumLessons)),
        note: "pipeline_invariant_triggered_but_hub_has_renderable_lessons",
      });
    }
  }

  if (pageResult.total === 0) {
    if (marketingHubPipelineVerboseLoggingEnabled(routePathLessons) && lessonsPageLoad.status === "ok") {
      const zr = pageResult.renderableAll ?? pageResult.items;
      const zd = pageResult.loadDiagnostics;
      logMarketingHubPipelineActualCounts(
        routePathLessons,
        {
          rawDbCount: hubDiagFinite(zd?.rawDbCount),
          afterSlugNormalizeCount: hubDiagFinite(zd?.afterSlugNormalizeCount),
          afterPathwayContextCount: hubDiagFinite(zd?.afterPathwayContextCount),
          afterDedupeCount: hubDiagFinite(zd?.afterDedupeCount),
          renderableAllCount: zr.length,
          afterPrepareCount: null,
          afterVerifyCount: null,
          finalRenderedCardCount: null,
          total: pageResult.total,
          snapshotUsed: lessonsHubSnapshotDiagnostics.snapshotUsed,
          verifyCallsCount: null,
          topDropReasons: [],
        },
        {
          pathway_id: pathway.id,
          phase: "zero_total_ok",
          hub_aggregates_ms: hubAggregatesDurationMs,
          lessons_page_source: lessonsPageLoad.sourceUsed,
        },
      );
    }
    return (
      <LessonsPageShell
        title={heroTitle}
        subtitle={heroSubtitle}
        eyebrow={pathway.shortName.trim() || pathway.displayName}
        pathwayTrack={pathway.roleTrack}
        toolbar={toolbar}
        backLink={{ label: `${examName} overview`, href: overviewHref }}
      >
        <MarketingHubSmokeDiagnosticsJson
          payload={{
            surface: "marketing_pathway_lessons",
            outcome: "zero_total",
            pathwayId: pathway.id,
            routePathname: `${pathname}/lessons`,
            contentLocale: lessonContentLocale,
            loaderTotal: pageResult.total,
            renderableAllCount: renderableAllIn.length,
            preparedLessonCount: hubCurriculumPrepared.length,
            verifiedLessonCount: hubCurriculumLessons.length,
            curriculumGridRowCount: lessonsForCurriculumHub.length,
            finalRenderedLessonLinkCount: finalRenderedVisibleLessonLinkCount,
            verifyIncomingPrepared: hubVerifyDiagnostics.incomingPreparedRowCount,
            verifyKept: hubVerifyDiagnostics.keptRowCount,
            topRejectionReasons: topDropReasonsForPayload,
            excludedByReason: hubVerifyDiagnostics.excludedByReason ?? {},
            fillEvaluateRejectionReasons: fillDiag.evaluateRejectionReasons,
            fillRejectedEvaluateCount: fillDiag.rejectedEvaluateCount,
            lessonsPageSource: lessonsPageLoad.sourceUsed,
            note: "No #pathway-lesson-library — hub list total is zero for this query.",
          }}
        />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
        <div className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            {qEffective
              ? `No lessons match "${qEffective}".`
              : alliedTaxonomyNorm && alliedTaxonomyCategory
                ? `No lessons match the “${alliedTaxonomyCategory.label}” category filter yet.`
                : topicSlugNorm
                  ? "No lessons match this topic filter yet."
                  : "No lessons are indexed for this pathway yet."}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {qEffective
              ? "Try a broader search or clear the search to view the full lesson library."
              : alliedTaxonomyNorm
                ? "Clear the category filter to see all lessons for this profession, or explore questions and adaptive practice below."
                : topicSlugNorm
                  ? "Clear the topic filter to browse the full lesson library, or explore questions and adaptive practice below."
                  : "If you believe this pathway should already show lessons, refresh once — otherwise explore practice questions and adaptive study below while we expand the library."}
          </p>
          {alliedTaxonomyNorm && alliedProfessionResolved && !qEffective ? (
            <p className="mt-3 text-sm">
              <Link
                href={`${base}?${new URLSearchParams({ [ALLIED_PROFESSION_QUERY_PARAM]: alliedProfessionResolved.professionKey }).toString()}`}
                className="font-semibold text-primary hover:underline"
              >
                View all categories for this profession
              </Link>
            </p>
          ) : null}
          {topicSlugNorm && !qEffective && !alliedTaxonomyNorm ? (
            <p className="mt-3 text-sm">
              <Link href={base} className="font-semibold text-primary hover:underline">
                View all lessons in this pathway
              </Link>
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={buildExamPathwayPath(pathway, "questions")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore available questions
            </Link>
            <Link
              href={buildExamPathwayPath(pathway, "cat")}
              aria-disabled={!canStartCat}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
            >
              {canStartCat ? "Start adaptive exam" : "Adaptive exam unavailable"}
            </Link>
          </div>
        </div>
      </LessonsPageShell>
    );
  }

  const progressCtx = await loadMarketingPathwayLessonProgressSessionContext({
    sessionPathname: `${pathname}/lessons`,
    sessionSurface: "marketing.exam_hub.lessons",
  });

  let progressMap: Record<string, PathwayLessonProgressStatus> = {};

  const canShowResume = canShowPaidPathwayLessonProgress(progressCtx, pathway);
  const canShowProgressMap = canShowResume && lessonsForCurriculumHub.length > 0;

  if (canShowResume) {
    const hubSlugs = canShowProgressMap ? lessonsForCurriculumHub.map((l) => l.slug).filter(Boolean) : [];
    const { progressMap: map } = await loadPathwayHubSubscriberData(
      progressCtx.userId,
      progressCtx.scope,
      progressCtx.learnerPath,
      pathway,
      base,
      hubSlugs,
    );
    progressMap = map;
  }

  return (
    <LessonsPageShell
      title={heroTitle}
      subtitle={heroSubtitle}
      eyebrow={pathway.shortName.trim() || pathway.displayName}
      pathwayTrack={pathway.roleTrack}
      toolbar={toolbar}
      backLink={{ label: `${examName} overview`, href: overviewHref }}
    >
      <MarketingHubSmokeDiagnosticsJson
        payload={{
          surface: "marketing_pathway_lessons",
          outcome: "rendered_library",
          pathwayId: pathway.id,
          routePathname: `${pathname}/lessons`,
          contentLocale: lessonContentLocale,
          loaderTotal: pageResult.total,
          renderableAllCount: renderableAllIn.length,
          preparedLessonCount: hubCurriculumPrepared.length,
          verifiedLessonCount: hubCurriculumLessons.length,
          curriculumGridRowCount: lessonsForCurriculumHub.length,
          finalRenderedLessonLinkCount: finalRenderedVisibleLessonLinkCount,
          verifyIncomingPrepared: hubVerifyDiagnostics.incomingPreparedRowCount,
          verifyUniqueSlugs: hubVerifyDiagnostics.uniqueSlugCount,
          verifyKept: hubVerifyDiagnostics.keptRowCount,
          topRejectionReasons: topDropReasonsForPayload,
          excludedByReason: hubVerifyDiagnostics.excludedByReason ?? {},
          fillEvaluateRejectionReasons: fillDiag.evaluateRejectionReasons,
          fillRejectedEvaluateCount: fillDiag.rejectedEvaluateCount,
          lessonsPageSource: lessonsPageLoad.sourceUsed,
        }}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
      {lessonsPageLoad.status === "ok" && lessonsPageLoad.sourceUsed === "secondary" ? (
        <div className="mt-3">
          <LearnerStudyLiveSyncBanner />
        </div>
      ) : null}
      {questionSnapshotLoadRejected ? (
        <div
          className="mt-3 rounded-xl border border-[var(--semantic-warning)]/40 bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-4 py-3 text-sm text-[var(--theme-heading-text)]"
          role="status"
        >
          We could not load practice-question stats for this hub right now, so adaptive CAT availability may be
          wrong until you retry. Lessons below still load normally.
        </div>
      ) : null}

      <section
        id="pathway-lesson-library"
        className="nn-qa-pathway-lessons-hub mt-2 scroll-mt-24"
        data-nn-qa-pathway-lessons-hub="true"
        aria-labelledby="lesson-library-heading"
      >
        {/* Section toolbar: heading + count badge */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
          <h2 id="lesson-library-heading" className="nn-marketing-h3 max-w-[min(100%,36rem)]">
            {alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
              ? `${alliedProfessionTrackChipLabel(alliedProfessionResolved)} lesson library`
              : "Lesson library"}
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {(
              alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
                ? pageResult.total
                : hubListCountForChrome
            ).toLocaleString()}{" "}
            {(
              alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id)
                ? pageResult.total
                : hubListCountForChrome
            ) === 1
              ? "lesson"
              : "lessons"}
          </span>
        </div>
        {alliedProfessionResolved && isAlliedMarketingCorePathwayId(pathway.id) ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="w-full text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)] sm:w-auto">
              Categories for this track
            </span>
            <Link
              href={`${base}?${new URLSearchParams({ [ALLIED_PROFESSION_QUERY_PARAM]: alliedProfessionResolved.professionKey }).toString()}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                !alliedTaxonomyNorm
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] text-[var(--theme-heading-text)]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--theme-muted-text)] hover:bg-[var(--semantic-panel-muted)]"
              }`}
            >
              All categories
            </Link>
            {alliedTaxonomyChipRows.map((row) => {
              const active = alliedTaxonomyNorm === row.slug;
              const href = `${base}?${new URLSearchParams({
                [ALLIED_PROFESSION_QUERY_PARAM]: alliedProfessionResolved.professionKey,
                [ALLIED_TAXONOMY_QUERY_PARAM]: row.slug,
              }).toString()}`;
              return (
                <Link
                  key={row.slug}
                  href={href}
                  className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_50%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_14%,transparent)] text-[var(--theme-heading-text)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--theme-muted-text)] hover:bg-[var(--semantic-panel-muted)]"
                  }`}
                >
                  <span className="min-w-0 truncate">{row.label}</span>
                  {row.count > 0 ? (
                    <span className="shrink-0 rounded-full bg-[var(--semantic-panel-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--theme-muted-text)]">
                      {row.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ) : null}
        <PathwayLessonsCurriculumHub
          lessons={hubPageLessons}
          preparedLessons={hubPageLessons}
          lessonsBasePath={base}
          pathwayId={pathway.id}
          progressMap={progressMap}
          canShowProgressMap={canShowProgressMap}
          showLockedState={!canShowResume}
          hubVerifyDiagnostics={hubVerifyDiagnostics}
        />
        <LessonHubFullLessonLinkNav lessons={hubCurriculumLessons} lessonsBasePath={base} />
      </section>
      <PathwayLessonPagination
        basePath={base}
        page={hubVerifiedPage.page}
        pageCount={hubVerifiedPage.pageCount}
        total={hubVerifiedPage.total}
        pageSize={hubVerifiedPage.pageSize}
        hubSearch={qEffective}
        topicSlug={topicSlugNorm ?? undefined}
        alliedProfession={alliedProfessionKey || undefined}
        alliedTaxonomy={alliedTaxonomyNorm ?? undefined}
        lessonsOnPage={lessonsOnPageForPagination}
      />

      <StudyBottomNav
        compact
        relatedLinks={[
          { label: "Practice questions", href: questionsHref },
          { label: canStartCat ? "Adaptive CAT" : "Adaptive CAT unavailable", href: catHref },
          { label: "Practice exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
          { label: "Exam overview", href: overviewHref },
        ]}
      />
    </LessonsPageShell>
  );
  } finally {
    lessonsPerfMark("route_end", {
      pathwayId: pathway.id,
      surface: "pathway_lessons_hub_page",
      elapsed_ms: Math.round(performance.now() - hubRouteT0),
    });
  }
}

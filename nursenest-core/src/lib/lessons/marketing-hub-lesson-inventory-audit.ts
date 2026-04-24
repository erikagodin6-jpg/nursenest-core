import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingHubDataLoadContext } from "@/lib/exam-pathways/marketing-hub-data-context";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import {
  countStrictMarketingHubInventoryRows,
  fillMarketingHubLessonInventoryToMinimum,
  MARKETING_HUB_MIN_VISIBLE_LESSONS,
} from "@/lib/lessons/marketing-hub-lesson-inventory-fill";
import {
  getPathwayLessonListWarehouseLocaleForHub,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
} from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type PublicMarketingLessonHubAuditRow = {
  pathwayId: string;
  country: string;
  examCode: string;
  locale: string;
  routePathname: string;
  lessonsPageLoadStatus: string;
  loaderTotal: number;
  loaderRenderableCount: number;
  preparedCount: number;
  verifiedKeptCount: number;
  verifiedStrictCount: number;
  filledStrictCount: number;
  finalStrictCount: number;
  finalTotalCount: number;
  rejectedEvaluateCount: number;
  rejectReasons: Record<string, number | Record<string, number>>;
  firstLessonHrefs: string[];
  passesMinVisible12: boolean;
};

function rejectReasonsRollup(
  fill: Awaited<ReturnType<typeof fillMarketingHubLessonInventoryToMinimum>>["diagnostics"],
): Record<string, number | Record<string, number>> {
  return {
    evaluate: fill.evaluateRejectionReasons as Record<string, number>,
    prefilter: fill.prefilterDropped as unknown as Record<string, number>,
  };
}

/**
 * Runs the same marketing hub lesson pipeline as the page (default hub: no search/topic/allied filters)
 * and returns inventory metrics for audits / CI.
 */
export async function auditPublicMarketingLessonHubForPathway(
  pathway: ExamPathwayDefinition,
  lessonContentLocale: string,
): Promise<PublicMarketingLessonHubAuditRow> {
  const base = buildExamPathwayPath(pathway, "lessons");
  const routePathname = base;
  const ctx: MarketingHubDataLoadContext = {
    pathname: routePathname,
    locale: pathway.countrySlug,
    country: pathway.countrySlug,
    examCode: pathway.examCode,
    pathwayId: pathway.id,
    roleTrack: pathway.roleTrack,
  };

  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubAggregates(
    pathway,
    {
      pageRequested: 1,
      pageSizeRequested: PATHWAY_HUB_PAGE_SIZE_MAX,
      lessonContentLocale,
      listOpts: undefined,
      qEffective: "",
      skipLaunchBundle: true,
      includeLessonCount: false,
      includeLaunchBundle: false,
      includeTopics: false,
    },
    ctx,
  );

  if (lessonsPageLoad.status !== "ok") {
    return {
      pathwayId: pathway.id,
      country: pathway.countrySlug,
      examCode: pathway.examCode,
      locale: lessonContentLocale,
      routePathname,
      lessonsPageLoadStatus: lessonsPageLoad.status,
      loaderTotal: pageResult.total,
      loaderRenderableCount: 0,
      preparedCount: 0,
      verifiedKeptCount: 0,
      verifiedStrictCount: 0,
      filledStrictCount: 0,
      finalStrictCount: 0,
      finalTotalCount: 0,
      rejectedEvaluateCount: 0,
      rejectReasons: {},
      firstLessonHrefs: [],
      passesMinVisible12: false,
    };
  }

  const renderableAllIn = pageResult.renderableAll ?? pageResult.items;
  const rawHubLessonRows = renderableAllIn.filter(pathwayLessonHasRenderableHubSlug);
  const { lessons: hubCurriculumPrepared } = prepareLessonsForHubCurriculumWithDiagnostics(rawHubLessonRows, {
    pathwayId: pathway.id,
    lessonsBasePath: base,
  });
  const listWarehouseLocale = await getPathwayLessonListWarehouseLocaleForHub(pathway.id, lessonContentLocale);
  const vr = await verifyMarketingHubLessonRowsResolve(pathway, hubCurriculumPrepared, lessonContentLocale, {
    listWarehouseLocale,
  });
  const fillResult = await fillMarketingHubLessonInventoryToMinimum({
    pathway,
    routePathname,
    lessonContentLocale,
    listWarehouseLocale,
    lessonsBasePath: base,
    minVisible: MARKETING_HUB_MIN_VISIBLE_LESSONS,
    verifiedKept: vr.kept,
    hubCurriculumPrepared,
    loaderRenderable: rawHubLessonRows,
  });

  const lessons = fillResult.lessons;
  const strict = countStrictMarketingHubInventoryRows(lessons);
  const firstLessonHrefs = lessons
    .slice(0, 20)
    .map((l) => pathwayLessonMarketingDetailHref(base, l.slug))
    .filter((h): h is string => Boolean(h));

  const row: PublicMarketingLessonHubAuditRow = {
    pathwayId: pathway.id,
    country: pathway.countrySlug,
    examCode: pathway.examCode,
    locale: lessonContentLocale,
    routePathname,
    lessonsPageLoadStatus: lessonsPageLoad.status,
    loaderTotal: pageResult.total,
    loaderRenderableCount: rawHubLessonRows.length,
    preparedCount: hubCurriculumPrepared.length,
    verifiedKeptCount: vr.kept.length,
    verifiedStrictCount: countStrictMarketingHubInventoryRows(vr.kept),
    filledStrictCount: fillResult.diagnostics.filledStrictCount,
    finalStrictCount: strict,
    finalTotalCount: lessons.length,
    rejectedEvaluateCount: fillResult.diagnostics.rejectedEvaluateCount,
    rejectReasons: rejectReasonsRollup(fillResult.diagnostics),
    firstLessonHrefs,
    passesMinVisible12: strict >= MARKETING_HUB_MIN_VISIBLE_LESSONS,
  };

  safeServerLog("pathway_lessons", "marketing_hub_inventory_audit", {
    stage: "marketing_hub_inventory_audit",
    pathway_id: pathway.id,
    route_pathname: routePathname,
    content_locale: lessonContentLocale,
    list_warehouse_locale: listWarehouseLocale ?? "",
    loader_total: String(row.loaderTotal),
    loader_renderable: String(row.loaderRenderableCount),
    prepared: String(row.preparedCount),
    verified_kept: String(row.verifiedKeptCount),
    verified_strict: String(row.verifiedStrictCount),
    final_strict: String(row.finalStrictCount),
    final_total: String(row.finalTotalCount),
    passes_min_12: row.passesMinVisible12 ? "1" : "0",
  });

  return row;
}

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingHubDataLoadContext } from "@/lib/exam-pathways/marketing-hub-data-context";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import {
  countStrictMarketingHubInventoryRows,
  fillMarketingHubLessonInventoryToMinimum,
  MARKETING_HUB_MIN_VISIBLE_LESSONS,
  type MarketingHubLessonInventoryFillPrefilterDropped,
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
/** HTTP probe of lesson detail URLs (optional; see `MARKETING_HUB_AUDIT_DETAIL_PROBE`). */
export type PublicMarketingLessonHubAuditDetailStatus = {
  href: string;
  status: number | null;
  ok: boolean;
  note?: string;
};

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
  /** Distinct rows rejected in prefilter buckets plus evaluate/professional-guard rejects during fill. */
  rejectedCount: number;
  rejectedEvaluateCount: number;
  rejectReasons: Record<string, number | Record<string, number>>;
  firstLessonHrefs: string[];
  /** Present when `MARKETING_HUB_AUDIT_DETAIL_PROBE=1` and an origin URL is configured. */
  detailStatus?: PublicMarketingLessonHubAuditDetailStatus[];
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

function sumPrefilterDropped(p: MarketingHubLessonInventoryFillPrefilterDropped): number {
  return (
    p.missingSlug +
    p.missingMarketingHref +
    p.taxonomyReviewRequired +
    p.listRowNotPublicComplete +
    p.pathwayContextMismatchOnListRow
  );
}

function auditOriginFromEnv(): string {
  const a = process.env.MARKETING_HUB_AUDIT_ORIGIN?.trim();
  if (a) return a.replace(/\/$/, "");
  const b = process.env.MARKETING_STUDY_SMOKE_BASE_URL?.trim();
  if (b) return b.replace(/\/$/, "");
  return "";
}

/**
 * Best-effort HEAD, then tiny ranged GET when HEAD is disallowed. Used only when `MARKETING_HUB_AUDIT_DETAIL_PROBE=1`.
 */
async function probeLessonDetailHttpStatuses(
  origin: string,
  relativeHrefs: readonly string[],
  max: number,
): Promise<PublicMarketingLessonHubAuditDetailStatus[]> {
  const out: PublicMarketingLessonHubAuditDetailStatus[] = [];
  for (const rel of relativeHrefs.slice(0, max)) {
    const path = rel.startsWith("/") ? rel : `/${rel}`;
    const href = `${origin}${path}`;
    try {
      const ac = AbortSignal.timeout(12_000);
      let res = await fetch(href, { method: "HEAD", redirect: "follow", signal: ac });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(href, {
          method: "GET",
          redirect: "follow",
          signal: ac,
          headers: { Range: "bytes=0-0", Accept: "*/*" },
        });
        await res.arrayBuffer().catch(() => undefined);
      }
      const status = res.status;
      const ok = (status >= 200 && status < 400) || status === 206;
      out.push({ href, status, ok });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      out.push({ href, status: null, ok: false, note: msg.slice(0, 200) });
    }
  }
  return out;
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
      rejectedCount: 0,
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

  const fillDiag = fillResult.diagnostics;
  const rejectedCount = sumPrefilterDropped(fillDiag.prefilterDropped) + fillDiag.rejectedEvaluateCount;

  let detailStatus: PublicMarketingLessonHubAuditDetailStatus[] | undefined;
  if (process.env.MARKETING_HUB_AUDIT_DETAIL_PROBE === "1") {
    const origin = auditOriginFromEnv();
    if (origin && firstLessonHrefs.length > 0) {
      detailStatus = await probeLessonDetailHttpStatuses(origin, firstLessonHrefs, 5);
    } else {
      detailStatus = [];
    }
  }

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
    rejectedCount,
    rejectedEvaluateCount: fillResult.diagnostics.rejectedEvaluateCount,
    rejectReasons: rejectReasonsRollup(fillResult.diagnostics),
    firstLessonHrefs,
    ...(detailStatus !== undefined ? { detailStatus } : {}),
    passesMinVisible12: strict >= MARKETING_HUB_MIN_VISIBLE_LESSONS,
  };

  return row;
}

import { emptyPathwayLessonsPageResult } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import type { MarketingHubDataLoadContext } from "@/lib/exam-pathways/marketing-hub-data-context";
import { getPathwayLessonsPageFresh, type PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function logHubLessonsPageFailed(ctx: MarketingHubDataLoadContext, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  const isTimeout = /timeout|ETIMEDOUT|hub_optional_task_timeout/i.test(message);
  safeServerLog("exam_pathway_hub", isTimeout ? "hub_data_load_timeout" : "hub_data_load_failed", {
    event: isTimeout ? "hub_data_load_timeout" : "hub_data_load_failed",
    pathname: ctx.pathname,
    locale: ctx.locale,
    country: ctx.country,
    examCode: ctx.examCode,
    pathway_id: ctx.pathwayId,
    role_track: ctx.roleTrack,
    dependency_name: "lessons_page",
    error_message: message.slice(0, 500),
  });
  if (!isTimeout) {
    recordRouteRenderFallback({
      fallbackType: "hub_data_load_failed",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
      dependencyName: "lessons_page",
    });
  }
}

export type PathwayLessonsHubPageLoadState =
  | {
      status: "ok";
      fetchDurationMs: number;
      responseItemCount: number;
      responseTotal: number;
    }
  | {
      status: "error";
      reason: "fetch_failed" | "invalid_payload";
      fetchDurationMs: number;
      timedOut: boolean;
      detail?: string;
    };

export type LoadPathwayLessonsHubPageArgs = {
  pageRequested: number;
  pageSizeRequested: number;
  lessonContentLocale: string;
  listOpts: { q?: string; topicSlugsIn?: string[] } | undefined;
};

/**
 * Critical-path lessons hub list: **no Promise.race timeouts**, no silent “empty inventory”.
 * Failures return {@link PathwayLessonsHubPageLoadState} `status: "error"` with timing metadata.
 *
 * `fetchImpl` is only for tests; production passes {@link getPathwayLessonsPageFresh}.
 */
export async function loadPathwayLessonsHubPageWithTelemetry(
  pathwayId: string,
  args: LoadPathwayLessonsHubPageArgs,
  ctx: MarketingHubDataLoadContext,
  fetchImpl: typeof getPathwayLessonsPageFresh = getPathwayLessonsPageFresh,
): Promise<{
  pageResult: PathwayLessonsPageResult;
  lessonsPageLoad: PathwayLessonsHubPageLoadState;
}> {
  const { pageRequested, pageSizeRequested, lessonContentLocale, listOpts } = args;
  const t0 = performance.now();
  try {
    const raw = await fetchImpl(pathwayId, pageRequested, pageSizeRequested, lessonContentLocale, listOpts);
    const fetchDurationMs = performance.now() - t0;
    const items = raw && typeof raw === "object" && Array.isArray((raw as PathwayLessonsPageResult).items)
      ? (raw as PathwayLessonsPageResult).items
      : [];
    const total =
      raw && typeof raw === "object" && typeof (raw as PathwayLessonsPageResult).total === "number"
        ? (raw as PathwayLessonsPageResult).total
        : items.length;

    if (raw && typeof raw === "object" && "items" in raw && "total" in raw) {
      const pageResult = raw as PathwayLessonsPageResult;
      safeServerLog("exam_pathway_hub", "lessons_hub_page_fetch", {
        event: "lessons_hub_page_fetch",
        outcome: "ok",
        pathway_id: ctx.pathwayId,
        exam_code: ctx.examCode,
        country: ctx.country,
        pathname: ctx.pathname,
        duration_ms: Math.round(fetchDurationMs),
        timed_out: "0",
        response_item_count: items.length,
        response_total: total,
      });
      return {
        pageResult,
        lessonsPageLoad: {
          status: "ok",
          fetchDurationMs,
          responseItemCount: items.length,
          responseTotal: total,
        },
      };
    }

    const err = new Error("invalid_lessons_page_payload_shape");
    logHubLessonsPageFailed(ctx, err);
    safeServerLog("exam_pathway_hub", "lessons_hub_page_fetch", {
      event: "lessons_hub_page_fetch",
      outcome: "error",
      reason: "invalid_payload",
      pathway_id: ctx.pathwayId,
      exam_code: ctx.examCode,
      country: ctx.country,
      pathname: ctx.pathname,
      duration_ms: Math.round(fetchDurationMs),
      timed_out: "0",
      response_item_count: 0,
      response_total: 0,
    });
    recordRouteRenderFallback({
      fallbackType: "hub_lessons_page_load_failed",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
    return {
      pageResult: emptyPathwayLessonsPageResult(pageRequested, pageSizeRequested),
      lessonsPageLoad: {
        status: "error",
        reason: "invalid_payload",
        fetchDurationMs,
        timedOut: false,
        detail: "invalid_lessons_page_payload_shape",
      },
    };
  } catch (reason) {
    const fetchDurationMs = performance.now() - t0;
    const message = reason instanceof Error ? reason.message : String(reason);
    const timedOut = /timeout|ETIMEDOUT|hub_optional_task_timeout/i.test(message);
    logHubLessonsPageFailed(ctx, reason);
    safeServerLog("exam_pathway_hub", "lessons_hub_page_fetch", {
      event: "lessons_hub_page_fetch",
      outcome: "error",
      reason: "fetch_failed",
      pathway_id: ctx.pathwayId,
      exam_code: ctx.examCode,
      country: ctx.country,
      pathname: ctx.pathname,
      duration_ms: Math.round(fetchDurationMs),
      timed_out: timedOut ? "1" : "0",
      response_item_count: 0,
      response_total: 0,
      error_message: message.slice(0, 500),
    });
    recordRouteRenderFallback({
      fallbackType: "hub_lessons_page_load_failed",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
    return {
      pageResult: emptyPathwayLessonsPageResult(pageRequested, pageSizeRequested),
      lessonsPageLoad: {
        status: "error",
        reason: "fetch_failed",
        fetchDurationMs,
        timedOut,
        detail: message.slice(0, 500),
      },
    };
  }
}

import { emptyPathwayLessonsPageResult } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import type { MarketingHubDataLoadContext } from "@/lib/exam-pathways/marketing-hub-data-context";
import type { LoadPathwayLessonsHubPageArgs } from "@/lib/exam-pathways/marketing-hub-lessons-page-args";
import { getPathwayLessonsPageFresh, type PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import { classifyHubDbFailure, type HubDbFailureCategory } from "@/lib/db/safe-database";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { logRouteDataPipeline, routeDataDiagnosticsEnabled } from "@/lib/observability/route-data-pipeline-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logContractLoadDiagnostics } from "@/lib/loading/critical-load-outcome";
import { HubLessonsListDatabaseError } from "@/lib/lessons/hub-lessons-database-error";
import { readPathwayLessonsHubPageSnapshot } from "@/lib/study-content-failover/pathway-lessons-hub-snapshot-read";
import { snapshotAgeMs as computeSnapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";
import type { StudyDataSourceUsed, StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";

export type { LoadPathwayLessonsHubPageArgs } from "@/lib/exam-pathways/marketing-hub-lessons-page-args";

/** Snapshot read outcome for Canada RN hub diagnostics (`RN_LESSONS_HUB_ACTUAL_COUNTS`). */
export type LessonsHubSnapshotDiagnostics = {
  snapshotAttempted: boolean;
  snapshotUsed: boolean;
  snapshotRejected: boolean;
  snapshotRejectReason: string | null;
  snapshotReadDurationMs: number | null;
};

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

function coercePathwayLessonsPageResult(raw: unknown): PathwayLessonsPageResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.items) || typeof o.total !== "number") return null;
  const items = o.items as PathwayLessonsPageResult["items"];
  const total = o.total as number;
  const ra = o.renderableAll;
  if (Array.isArray(ra)) {
    /** `sliceNormalizedHubLessons` guarantees `total === renderableAll.length` — reject stale exports. */
    if (total !== ra.length) {
      safeServerLog("exam_pathway_hub", "lessons_hub_payload_total_renderable_mismatch", {
        event: "lessons_hub_payload_total_renderable_mismatch",
        claimed_total: String(total),
        renderable_len: String(ra.length),
        items_len: String(items.length),
      });
      return null;
    }
    return raw as PathwayLessonsPageResult;
  }
  /** Without `renderableAll`, a paginated `items` slice cannot back the curriculum grid (must reject). */
  if (total > items.length) return null;
  return { ...(raw as PathwayLessonsPageResult), renderableAll: items };
}

export type PathwayLessonsHubPageLoadState =
  | {
      status: "ok";
      fetchDurationMs: number;
      responseItemCount: number;
      responseTotal: number;
      sourceUsed: StudyDataSourceUsed;
      failoverReason?: string;
      snapshotVersion?: string;
      snapshotAgeMs?: number;
    }
  | {
      status: "error";
      reason: "fetch_failed" | "invalid_payload";
      fetchDurationMs: number;
      timedOut: boolean;
      detail?: string;
      /** Present when `reason === "fetch_failed"` — maps to ops categories (`db_auth_failure`, etc.). */
      dbFailureCategory?: HubDbFailureCategory;
    };

function hubLessonsDbFailureCategory(primaryError: unknown): HubDbFailureCategory | undefined {
  if (!primaryError) return undefined;
  if (primaryError instanceof HubLessonsListDatabaseError) return primaryError.category;
  return classifyHubDbFailure(primaryError);
}

function logLessonsHubOk(
  ctx: MarketingHubDataLoadContext,
  args: {
    fetchDurationMs: number;
    itemsLen: number;
    total: number;
    sourceUsed: StudyDataSourceUsed;
    failoverReason?: string;
    snapshotVersion?: string;
    snapshotAgeMs?: number;
  },
): void {
  safeServerLog("exam_pathway_hub", "lessons_hub_page_fetch", {
    event: "lessons_hub_page_fetch",
    outcome: "ok",
    pathway_id: ctx.pathwayId,
    exam_code: ctx.examCode,
    country: ctx.country,
    pathname: ctx.pathname,
    duration_ms: Math.round(args.fetchDurationMs),
    timed_out: "0",
    response_item_count: args.itemsLen,
    response_total: args.total,
    source_used: args.sourceUsed,
    ...(args.failoverReason ? { failover_reason: args.failoverReason.slice(0, 200) } : {}),
    ...(args.snapshotVersion ? { snapshot_version: args.snapshotVersion.slice(0, 120) } : {}),
    ...(args.snapshotAgeMs !== undefined && args.snapshotAgeMs >= 0
      ? { snapshot_age_ms: String(Math.round(args.snapshotAgeMs)) }
      : {}),
  });
}

/**
 * Critical-path lessons hub list: **no Promise.race timeouts**, no silent “empty inventory”.
 * When `STUDY_PUBLISHED_SNAPSHOT_DIR` is set and a matching export exists, primary DB failures fall back
 * to the synchronized snapshot (same normalized {@link PathwayLessonsPageResult} contract).
 */
export async function loadPathwayLessonsHubPageWithTelemetry(
  pathwayId: string,
  args: LoadPathwayLessonsHubPageArgs,
  ctx: MarketingHubDataLoadContext,
  fetchImpl: typeof getPathwayLessonsPageFresh = getPathwayLessonsPageFresh,
  deps?: {
    readHubSnapshot?: (
      pid: string,
      a: LoadPathwayLessonsHubPageArgs,
    ) => Promise<StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult> | null>;
  },
): Promise<{
  pageResult: PathwayLessonsPageResult;
  lessonsPageLoad: PathwayLessonsHubPageLoadState;
  snapshotDiagnostics: LessonsHubSnapshotDiagnostics;
}> {
  const { pageRequested, pageSizeRequested, lessonContentLocale, listOpts } = args;
  const readHubSnapshot = deps?.readHubSnapshot ?? readPathwayLessonsHubPageSnapshot;
  const t0 = performance.now();
  const snapshotDiagnostics: LessonsHubSnapshotDiagnostics = {
    snapshotAttempted: false,
    snapshotUsed: false,
    snapshotRejected: false,
    snapshotRejectReason: null,
    snapshotReadDurationMs: null,
  };

  const returnSecondary = (
    pageResult: PathwayLessonsPageResult,
    envelope: StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult>,
    failoverReason: string,
  ) => {
    snapshotDiagnostics.snapshotUsed = true;
    const fetchDurationMs = performance.now() - t0;
    const items = pageResult.items;
    const age = computeSnapshotAgeMs(envelope.capturedAt);
    logLessonsHubOk(ctx, {
      fetchDurationMs,
      itemsLen: items.length,
      total: pageResult.total,
      sourceUsed: "secondary",
      failoverReason,
      snapshotVersion: envelope.version,
      snapshotAgeMs: age,
    });
    safeServerLog("exam_pathway_hub", "study_content_failover", {
      event: "study_content_failover",
      surface: "pathway_lessons_hub",
      pathway_id: ctx.pathwayId,
      exam_code: ctx.examCode,
      country: ctx.country,
      source_used: "secondary",
      failover_reason: failoverReason.slice(0, 240),
      snapshot_version: envelope.version.slice(0, 120),
      snapshot_age_ms: String(Math.round(age)),
      snapshot_used: "true",
      final_outcome: "degraded_snapshot",
      fallback_used: "true",
    });
    logContractLoadDiagnostics({
      operation: "lessons_hub_page_fetch",
      duration_ms: Math.round(fetchDurationMs),
      pathway_id: ctx.pathwayId,
      exam_code: ctx.examCode,
      country: ctx.country,
      locale: ctx.locale,
      feature: "pathway_lessons_hub",
      feature_surface: "marketing_lessons_hub",
      outcome: "ok",
      final_outcome: "degraded_snapshot",
      live_outcome: primaryError ? "error" : "invalid_payload",
      snapshot_used: "true",
      snapshot_age_ms: String(Math.round(age)),
      fallback_used: "true",
    });
    return {
      pageResult,
      lessonsPageLoad: {
        status: "ok" as const,
        fetchDurationMs,
        responseItemCount: items.length,
        responseTotal: pageResult.total,
        sourceUsed: "secondary" as const,
        failoverReason,
        snapshotVersion: envelope.version,
        snapshotAgeMs: age >= 0 ? age : undefined,
      },
      snapshotDiagnostics,
    };
  };

  let primaryError: unknown | null = null;
  let rawPrimary: unknown = null;
  try {
    rawPrimary = await fetchImpl(pathwayId, pageRequested, pageSizeRequested, lessonContentLocale, listOpts);
  } catch (e) {
    primaryError = e;
  }

  const primaryCoerced = coercePathwayLessonsPageResult(rawPrimary);
  const fetchDurationMsPrimary = performance.now() - t0;

  if (primaryCoerced && !primaryError) {
    logLessonsHubOk(ctx, {
      fetchDurationMs: fetchDurationMsPrimary,
      itemsLen: primaryCoerced.items.length,
      total: primaryCoerced.total,
      sourceUsed: "primary",
    });
    if (routeDataDiagnosticsEnabled()) {
      logRouteDataPipeline({
        route: ctx.pathname,
        stage: "lessons_hub_primary_ok",
        meta: {
          pathwayId: ctx.pathwayId,
          finalItemCount: primaryCoerced.items.length,
          finalTotal: primaryCoerced.total,
          cacheSource: "live_getPathwayLessonsPageFresh",
          fetchDurationMs: Math.round(fetchDurationMsPrimary),
        },
      });
    }
    return {
      pageResult: primaryCoerced,
      lessonsPageLoad: {
        status: "ok",
        fetchDurationMs: fetchDurationMsPrimary,
        responseItemCount: primaryCoerced.items.length,
        responseTotal: primaryCoerced.total,
        sourceUsed: "primary",
      },
      snapshotDiagnostics,
    };
  }

  const failoverReason =
    primaryError != null
      ? `primary_throw:${primaryError instanceof Error ? primaryError.message.slice(0, 160) : String(primaryError).slice(0, 160)}`
      : "primary_invalid_payload";

  const tSnapRead = performance.now();
  const snap = await readHubSnapshot(pathwayId, args);
  snapshotDiagnostics.snapshotReadDurationMs = Math.round(performance.now() - tSnapRead);
  snapshotDiagnostics.snapshotAttempted = true;
  if (snap) {
    const fromSnap = coercePathwayLessonsPageResult(snap.payload);
    if (fromSnap) {
      if (primaryError) {
        logHubLessonsPageFailed(ctx, primaryError);
      } else {
        logHubLessonsPageFailed(ctx, new Error("invalid_lessons_page_payload_shape"));
      }
      return returnSecondary(fromSnap, snap, failoverReason);
    }
    snapshotDiagnostics.snapshotRejected = true;
    snapshotDiagnostics.snapshotRejectReason = "snapshot_coerce_failed_or_total_renderable_mismatch";
    safeServerLog("exam_pathway_hub", "lessons_hub_snapshot_rejected", {
      event: "lessons_hub_snapshot_rejected",
      pathway_id: ctx.pathwayId,
      pathname: ctx.pathname,
      reason: snapshotDiagnostics.snapshotRejectReason,
    });
    safeServerLog("pathway_lessons", "lesson_hub_snapshot_rejected", {
      pathway_id: ctx.pathwayId,
      pathname: ctx.pathname,
      snapshot_reject_reason: snapshotDiagnostics.snapshotRejectReason ?? "",
    });
  }

  if (primaryError) {
    const fetchDurationMs = performance.now() - t0;
    const message = primaryError instanceof Error ? primaryError.message : String(primaryError);
    const timedOut = /timeout|ETIMEDOUT|hub_optional_task_timeout/i.test(message);
    logHubLessonsPageFailed(ctx, primaryError);
    const dbFailureCategory = hubLessonsDbFailureCategory(primaryError);
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
      source_used: "primary",
      ...(dbFailureCategory ? { db_failure_category: dbFailureCategory } : {}),
    });
    recordRouteRenderFallback({
      fallbackType: "hub_lessons_page_load_failed",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
    logContractLoadDiagnostics({
      operation: "lessons_hub_page_fetch",
      duration_ms: Math.round(fetchDurationMs),
      pathway_id: ctx.pathwayId,
      exam_code: ctx.examCode,
      country: ctx.country,
      locale: ctx.locale,
      feature: "pathway_lessons_hub",
      feature_surface: "marketing_lessons_hub",
      outcome: timedOut ? "timeout" : "error",
      final_outcome: timedOut ? "timeout" : "error",
      live_outcome: "error",
      snapshot_used: "false",
      fallback_used: "false",
      error_message: message.slice(0, 500),
    });
    logRouteDataPipeline({
      route: ctx.pathname,
      stage: "lessons_hub_primary_error",
      meta: {
        pathwayId: ctx.pathwayId,
        reasonCode: timedOut ? "PRIMARY_TIMEOUT" : "PRIMARY_THROW",
        finalItemCount: 0,
        finalTotal: 0,
        cacheSource: "none_empty_hub",
      },
    });
    return {
      pageResult: emptyPathwayLessonsPageResult(pageRequested, pageSizeRequested),
      lessonsPageLoad: {
        status: "error",
        reason: "fetch_failed",
        fetchDurationMs,
        timedOut,
        detail: message.slice(0, 500),
        ...(dbFailureCategory ? { dbFailureCategory } : {}),
      },
      snapshotDiagnostics,
    };
  }

  const fetchDurationMs = performance.now() - t0;
  logHubLessonsPageFailed(ctx, new Error("invalid_lessons_page_payload_shape"));
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
    source_used: "primary",
  });
  recordRouteRenderFallback({
    fallbackType: "hub_lessons_page_load_failed",
    pathname: ctx.pathname,
    pathwayId: ctx.pathwayId,
    examCode: ctx.examCode,
    country: ctx.country,
  });
  logContractLoadDiagnostics({
    operation: "lessons_hub_page_fetch",
    duration_ms: Math.round(fetchDurationMs),
    pathway_id: ctx.pathwayId,
    exam_code: ctx.examCode,
    country: ctx.country,
    locale: ctx.locale,
    feature: "pathway_lessons_hub",
    feature_surface: "marketing_lessons_hub",
    outcome: "error",
    final_outcome: "error",
    live_outcome: "invalid_payload",
    snapshot_used: "false",
    fallback_used: "false",
    error_message: "invalid_lessons_page_payload_shape",
  });
  logRouteDataPipeline({
    route: ctx.pathname,
    stage: "lessons_hub_primary_invalid_payload",
    meta: {
      pathwayId: ctx.pathwayId,
      reasonCode: "PRIMARY_INVALID_PAYLOAD",
      finalItemCount: 0,
      finalTotal: 0,
      cacheSource: "none_empty_hub",
    },
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
    snapshotDiagnostics,
  };
}

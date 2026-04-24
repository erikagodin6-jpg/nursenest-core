/**
 * Hard guardrails for the Canada RN NCLEX-RN marketing lessons hub so a large DB inventory
 * cannot silently collapse to a tiny prepared/verified/rendered set without failing the route.
 *
 * Only evaluated on the default hub (no search/topic/allied narrowing) — filtered views can legitimately be small.
 */
export const LESSON_HUB_PIPELINE_MULTILESSON_THRESHOLD = 20;

export type LessonHubPipelineCollapseAssessment =
  | { kind: "ok" }
  | {
      kind: "violation";
      /** Stable metric / log event name for alerts (`lesson_hub_*`). */
      metricEvent: string;
      invariantCode: string;
      userFacingDetail: string;
      fields: Record<string, string>;
    };

function num(n: number | null | undefined): number {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

/**
 * @param stage6LinkableLessonRows — lessons with a valid marketing detail href after body-system grouping (not UI preview cap).
 */
export function assessCanadaRnNclexLessonHubPipelineCollapseGuard(input: {
  rawDbCount?: number | null;
  renderableAllCount: number;
  afterPrepareCount: number;
  afterVerifyCount: number;
  stage6LinkableLessonRows: number;
}): LessonHubPipelineCollapseAssessment {
  const T = LESSON_HUB_PIPELINE_MULTILESSON_THRESHOLD;
  const rawDb = num(input.rawDbCount);
  const renderableAll = input.renderableAllCount;
  const prepare = input.afterPrepareCount;
  const verify = input.afterVerifyCount;
  const linkable = input.stage6LinkableLessonRows;

  /** Best single “how much did the DB think existed” signal for this pathway. */
  const upstreamSignal = Math.max(rawDb, renderableAll);

  if (upstreamSignal <= T) return { kind: "ok" };

  const baseFields: Record<string, string> = {
    raw_db_count: String(rawDb),
    renderable_all_count: String(renderableAll),
    after_prepare_count: String(prepare),
    after_verify_count: String(verify),
    stage6_linkable_rows: String(linkable),
  };

  if (rawDb > T && renderableAll <= 1) {
    return {
      kind: "violation",
      metricEvent: "lesson_hub_inventory_tiny",
      invariantCode: "raw_db_gt_threshold_renderable_le_1",
      userFacingDetail:
        "We detected many published lessons in storage, but the hub list collapsed to almost nothing before cards render. Please retry — if this persists, contact support.",
      fields: baseFields,
    };
  }

  if (renderableAll > T && prepare <= 1) {
    return {
      kind: "violation",
      metricEvent: "lesson_hub_inventory_tiny",
      invariantCode: "renderable_gt_threshold_prepare_le_1",
      userFacingDetail:
        "The lesson library list shrank unexpectedly while preparing cards (dedupe/organize). Please retry shortly.",
      fields: baseFields,
    };
  }

  if (prepare > T && verify <= 1) {
    return {
      kind: "violation",
      metricEvent: "lesson_hub_verify_collapse",
      invariantCode: "prepare_gt_threshold_verify_le_1",
      userFacingDetail:
        "Many lessons were listed, but detail verification dropped almost all rows (list vs public lesson contract drift). Please retry.",
      fields: baseFields,
    };
  }

  if (verify > T && linkable <= 1) {
    return {
      kind: "violation",
      metricEvent: "lesson_hub_render_collapse",
      invariantCode: "verify_gt_threshold_linkable_le_1",
      userFacingDetail:
        "Verified lessons exist, but almost none could be placed into linkable hub sections. Please retry.",
      fields: baseFields,
    };
  }

  return { kind: "ok" };
}

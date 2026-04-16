import { parseAdaptiveState } from "@/lib/exams/cat-engine";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildCatResultsCoach,
  buildFallbackCatResultsCoachSnapshot,
  type CatCoachIncorrectRow,
} from "@/lib/practice-tests/cat-results-coach";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  computeLessonContentSignal,
  type LessonContentSignal,
} from "@/lib/lessons/lesson-content-readiness";

const STEM_PREVIEW = 240;

/** Maximum lessons to sample when computing pathway content readiness (performance cap). */
const LESSON_QUALITY_SAMPLE_LIMIT = 150;

/**
 * Sample published PathwayLesson sections for the given pathway, then compute an
 * aggregate content readiness signal. Returns null when no pathwayId is available
 * or the query fails (callers should treat null as "unknown / conservative").
 */
async function loadLessonContentSignal(pathwayId: string | null | undefined): Promise<LessonContentSignal | null> {
  if (!pathwayId?.trim()) return null;
  try {
    const completeRows = await prisma.pathwayLesson.findMany({
      where: { pathwayId, status: { not: "DRAFT" }, structuralPublicComplete: true },
      select: {
        id: true,
        title: true,
        slug: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        previewSectionCount: true,
        seoTitle: true,
        seoDescription: true,
        sections: true,
        locale: true,
        pathwayId: true,
      },
      take: LESSON_QUALITY_SAMPLE_LIMIT,
    });
    return computeLessonContentSignal(completeRows as Array<{ sections: unknown }>);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("cat_results", "lesson_content_signal_load_failed", {
      error_message: msg.slice(0, 200),
      pathwayId,
    });
    return null;
  }
}

async function loadIncorrectRows(
  ids: string[],
  entitlement: AccessScope,
): Promise<CatCoachIncorrectRow[]> {
  if (ids.length === 0) return [];
  try {
    const base = questionAccessWhere(entitlement);
    const rows = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: ids } }, base] },
      select: { questionType: true, topic: true, subtopic: true, stem: true, tags: true, bodySystem: true },
    });
    return rows.map((r) => ({
      questionType: r.questionType,
      topic: r.topic,
      subtopic: r.subtopic,
      stem:
        typeof r.stem === "string" && r.stem.length > STEM_PREVIEW
          ? `${r.stem.slice(0, STEM_PREVIEW)}…`
          : r.stem,
      tags: r.tags ?? [],
      bodySystem: r.bodySystem,
    }));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("cat_results", "cat_results_coach_fallback_used", {
      reason: "incorrect_rows_load_failed",
      error_message: message.slice(0, 400),
    });
    return [];
  }
}

function finiteNumberArray(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((n): n is number => typeof n === "number" && Number.isFinite(n));
}

/**
 * Attach {@link CatResultsCoachSnapshot} to completed CAT results (UI / analytics only).
 */
export async function enrichPracticeTestResultsWithCatCoach(
  results: PracticeTestResultsJson,
  adaptiveState: unknown,
  config: PracticeTestConfigJson,
  entitlement: AccessScope,
  logContext?: { practiceTestId?: string },
): Promise<PracticeTestResultsJson> {
  if (config.selectionMode !== "cat") return results;

  if (!results.catReport) {
    safeServerLog("cat_results", "cat_results_render_missing_fields", {
      event: "cat_results_render_missing_fields",
      reason: "missing_cat_report",
      practiceTestId: logContext?.practiceTestId?.slice(0, 16),
      pathway: config.pathwayId ?? undefined,
      mode: config.catExamFeedbackMode ?? "test",
    });
    return results;
  }

  try {
    const state = parseAdaptiveState(adaptiveState);
    const difficultyHistory = finiteNumberArray(state?.difficultyHistory);
    const thetaHistory = finiteNumberArray(state?.thetaHistory);

    const incorrectIds = Array.isArray(results.incorrectQuestionIds)
      ? results.incorrectQuestionIds.filter((x): x is string => typeof x === "string" && x.length > 4)
      : [];

    // Load lesson quality signal and incorrect rows in parallel
    const [incorrectRows, lessonContentSignal] = await Promise.all([
      loadIncorrectRows(incorrectIds, entitlement),
      loadLessonContentSignal(config.pathwayId),
    ]);

    const coach = buildCatResultsCoach({
      report: results.catReport,
      presentationMode: state?.catPresentationMode,
      pathwayId: config.pathwayId ?? null,
      difficultyHistory,
      thetaHistory,
      incorrectRows,
      lessonContentSignal,
    });

    return { ...results, catCoach: coach };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("cat_results", "cat_results_coach_fallback_used", {
      event: "cat_results_coach_fallback_used",
      error_message: message.slice(0, 400),
    });
    recordRouteRenderFallback({
      fallbackType: "cat_coach_enrich_failed",
      pathwayId: config.pathwayId ?? undefined,
    });
    return { ...results, catCoach: buildFallbackCatResultsCoachSnapshot() };
  }
}

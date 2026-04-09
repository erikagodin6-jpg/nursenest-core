import { parseAdaptiveState } from "@/lib/exams/cat-engine";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildCatResultsCoach,
  buildFallbackCatResultsCoachSnapshot,
  type CatCoachIncorrectRow,
} from "@/lib/practice-tests/cat-results-coach";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

const STEM_PREVIEW = 240;

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
): Promise<PracticeTestResultsJson> {
  if (config.selectionMode !== "cat" || !results.catReport) return results;

  try {
    const state = parseAdaptiveState(adaptiveState);
    const difficultyHistory = finiteNumberArray(state?.difficultyHistory);
    const thetaHistory = finiteNumberArray(state?.thetaHistory);

    const incorrectIds = Array.isArray(results.incorrectQuestionIds)
      ? results.incorrectQuestionIds.filter((x): x is string => typeof x === "string" && x.length > 4)
      : [];
    const incorrectRows = await loadIncorrectRows(incorrectIds, entitlement);

    const coach = buildCatResultsCoach({
      report: results.catReport,
      presentationMode: state?.catPresentationMode,
      pathwayId: config.pathwayId ?? null,
      difficultyHistory,
      thetaHistory,
      incorrectRows,
    });

    return { ...results, catCoach: coach };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("cat_results", "cat_results_coach_fallback_used", {
      event: "cat_results_coach_fallback_used",
      error_message: message.slice(0, 400),
    });
    return { ...results, catCoach: buildFallbackCatResultsCoachSnapshot() };
  }
}

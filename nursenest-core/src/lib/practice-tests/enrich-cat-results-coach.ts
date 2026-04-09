import { parseAdaptiveState } from "@/lib/exams/cat-engine";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import {
  buildCatResultsCoach,
  type CatCoachIncorrectRow,
  type CatResultsCoachSnapshot,
} from "@/lib/practice-tests/cat-results-coach";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

const STEM_PREVIEW = 240;

async function loadIncorrectRows(
  ids: string[],
  entitlement: AccessScope,
): Promise<CatCoachIncorrectRow[]> {
  if (ids.length === 0) return [];
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

  const state = parseAdaptiveState(adaptiveState);
  const difficultyHistory = state?.difficultyHistory?.length ? state.difficultyHistory : [];
  const thetaHistory = state?.thetaHistory?.length ? state.thetaHistory : [];

  const incorrectIds = results.incorrectQuestionIds ?? [];
  const incorrectRows = await loadIncorrectRows(incorrectIds, entitlement);

  const coach: CatResultsCoachSnapshot = buildCatResultsCoach({
    report: results.catReport,
    presentationMode: state?.catPresentationMode,
    pathwayId: config.pathwayId ?? null,
    difficultyHistory,
    thetaHistory,
    incorrectRows,
  });

  return { ...results, catCoach: coach };
}

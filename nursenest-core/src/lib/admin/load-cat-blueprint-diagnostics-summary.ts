import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { catBlueprintSessionHasQualityWarnings } from "@/lib/exams/cat-blueprint-mapping-quality";
import { getCatBlueprintQualityThresholds } from "@/lib/exams/cat-blueprint-thresholds";
import {
  mapPracticeTestRowToCatBlueprintSession,
  type PracticeTestRowForCatBlueprint,
} from "@/lib/admin/cat-blueprint-sessions-admin";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

const SUMMARY_WINDOW = 80;

export type CatBlueprintDiagnosticsSummary = {
  /** Completed CAT sessions considered (most recently updated first). */
  recentCompletedCatSessions: number;
  /** Sessions in that window with stored blueprint diagnostics (pool/session fractions available). */
  sessionsWithBlueprintDiagnostics: number;
  /** Mean pool mapped % (0–100), only among sessions with `poolMappedFraction`; null if none. */
  avgPoolMappedPct: number | null;
  /** Mean delivered/session mapped % (0–100), only among sessions with `sessionMappedFraction`; null if none. */
  avgSessionMappedPct: number | null;
  /** Count of sessions in the window that meet low-quality rules (same as `lowQualityOnly` filter). */
  lowQualitySessionCount: number;
  qualityThresholds: ReturnType<typeof getCatBlueprintQualityThresholds>;
};

/**
 * Recent completed CAT practice tests only; averages use subsets that have the corresponding fraction stored.
 */
export async function loadCatBlueprintDiagnosticsSummary(): Promise<CatBlueprintDiagnosticsSummary> {
  const rows = await prisma.practiceTest.findMany({
    where: { status: PracticeTestStatus.COMPLETED },
    orderBy: { updatedAt: "desc" },
    take: 400,
    select: {
      id: true,
      userId: true,
      status: true,
      startedAt: true,
      updatedAt: true,
      completedAt: true,
      config: true,
      results: true,
    },
  });

  const catRows = rows
    .filter((r) => (r.config as PracticeTestConfigJson | null)?.selectionMode === "cat")
    .slice(0, SUMMARY_WINDOW)
    .map((r) => mapPracticeTestRowToCatBlueprintSession(r as PracticeTestRowForCatBlueprint));

  const withDiag = catRows.filter((s) => s.hasBlueprintReport);
  const poolVals = withDiag.map((s) => s.poolMappedFraction).filter((x): x is number => typeof x === "number");
  const sessVals = withDiag.map((s) => s.sessionMappedFraction).filter((x): x is number => typeof x === "number");

  const avgPool =
    poolVals.length > 0 ? Math.round((poolVals.reduce((a, b) => a + b, 0) / poolVals.length) * 1000) / 10 : null;
  const avgSess =
    sessVals.length > 0
      ? Math.round((sessVals.reduce((a, b) => a + b, 0) / sessVals.length) * 1000) / 10
      : null;

  const lowQualitySessionCount = catRows.filter((s) =>
    catBlueprintSessionHasQualityWarnings({
      presentationMode: s.catPresentationMode,
      poolMappedFraction: s.poolMappedFraction,
      sessionMappedFraction: s.sessionMappedFraction,
      scoredCount: s.totalQuestions,
      persistedWarnings: s.mappingQualityWarnings,
    }),
  ).length;

  return {
    recentCompletedCatSessions: catRows.length,
    sessionsWithBlueprintDiagnostics: withDiag.length,
    avgPoolMappedPct: avgPool,
    avgSessionMappedPct: avgSess,
    lowQualitySessionCount,
    qualityThresholds: getCatBlueprintQualityThresholds(),
  };
}

/**
 * Admin-only: merges live inventory counts with the synchronous launch-readiness evaluator.
 */

import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { loadAdminPathwayInventory } from "@/lib/admin/load-admin-pathway-inventory";
import {
  evaluateGlobalRegionLaunchReadiness,
  evaluatePathwayLaunchReadiness,
  type GlobalRegionLaunchEvaluation,
  type PathwayCountOverrides,
  type PathwayLaunchEvaluation,
} from "@/lib/navigation/country-exam-launch-readiness";
import { getSnapshotCounts } from "@/lib/navigation/country-exam-readiness-snapshot";

export type CountryExamReadinessDashboard = {
  inventoryDegraded: boolean;
  /** Live DB-backed evaluation per pathway. */
  pathwayRowsLive: PathwayLaunchEvaluation[];
  /** Committed snapshot only (what public routes use). */
  pathwayRowsSnapshot: PathwayLaunchEvaluation[];
  countryRollups: GlobalRegionLaunchEvaluation[];
};

function buildOverridesFromInventory(
  rows: Array<{ pathwayId: string; lessonsEffective: number; questionsMatched: number }>,
): PathwayCountOverrides {
  const o: PathwayCountOverrides = {};
  for (const r of rows) {
    o[r.pathwayId] = { lessons: r.lessonsEffective, questions: r.questionsMatched };
  }
  return o;
}

export async function loadCountryExamReadinessDashboard(): Promise<CountryExamReadinessDashboard> {
  const inv = await loadAdminPathwayInventory({ country: "ALL" });
  const overrides = buildOverridesFromInventory(inv.rows);

  const pathwayRowsLive = EXAM_PATHWAYS.map((p) => {
    const row = inv.rows.find((r) => r.pathwayId === p.id);
    return evaluatePathwayLaunchReadiness(
      p,
      row ? { lessonCount: row.lessonsEffective, questionCount: row.questionsMatched } : undefined,
    );
  });

  const pathwayRowsSnapshot = EXAM_PATHWAYS.map((p) => {
    const snap = getSnapshotCounts(p.id);
    return evaluatePathwayLaunchReadiness(p, { lessonCount: snap.lessons, questionCount: snap.questions });
  });

  const countryRollups: GlobalRegionLaunchEvaluation[] = [
    evaluateGlobalRegionLaunchReadiness("us", overrides),
    evaluateGlobalRegionLaunchReadiness("canada", overrides),
  ];

  return {
    inventoryDegraded: inv.degraded,
    pathwayRowsLive,
    pathwayRowsSnapshot,
    countryRollups,
  };
}

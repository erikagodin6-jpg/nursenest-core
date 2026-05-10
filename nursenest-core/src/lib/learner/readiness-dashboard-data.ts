/**
 * Readiness Dashboard Data
 *
 * Extended server-side data loader for the premium readiness dashboard.
 * Builds on the existing ReadinessPagePayload and adds:
 *
 *   1. Dimension breakdown — accuracy by body system, cognitive level, question type
 *      Derived from ExamAttempt.results JSON × ExamQuestion metadata join.
 *
 *   2. CAT trend — per-session readiness scores for the sparkline trajectory card.
 *
 *   3. Benchmark — percentile rank (conditional on 100+ qualified learners).
 *
 * Performance protections:
 *   - ExamAttempt: capped at MAX_SESSIONS (30) / MAX_QUESTIONS (600)
 *   - ExamQuestion join: `id in [...]` — N bounded at MAX_QUESTIONS
 *   - CAT trend: last 10 completed CAT sessions only
 *   - All sources run concurrently with Promise.all
 *   - Each source is wrapped in try/catch — one failing source never breaks the page
 */

import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache.server";
import { learnerPrivateReadAccessScopeKey } from "@/lib/cache/learner-private-read-cache-keying";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  loadReadinessPagePayload,
  type ReadinessPagePayload,
} from "@/lib/learner/load-readiness-page-payload";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { learnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { computeBenchmarkData, type BenchmarkData } from "@/lib/learner/benchmark-engine";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  EMPTY_EXAM_DIMENSION_BREAKDOWN,
  loadExamAttemptDimensionBreakdown,
  type DimensionBreakdown,
} from "@/lib/learner/exam-attempt-dimension-breakdown";

export type { DimensionStat, DimensionBreakdown } from "@/lib/learner/exam-attempt-dimension-breakdown";
export { EMPTY_EXAM_DIMENSION_BREAKDOWN, loadExamAttemptDimensionBreakdown } from "@/lib/learner/exam-attempt-dimension-breakdown";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CatTrendPoint = {
  id: string;
  score: number;
  /** ISO string */
  completedAt: string;
  /** "CAT #N" */
  sessionLabel: string;
};

export type ReadinessDashboardPayload = ReadinessPagePayload & {
  dimensions: DimensionBreakdown;
  catTrend: CatTrendPoint[];
  benchmark: BenchmarkData | null;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_CAT_TREND = 10;

// ── Readiness score from PracticeTest results ─────────────────────────────────

function parseReadinessScore(results: unknown): number | null {
  if (!results || typeof results !== "object") return null;
  const r = results as Record<string, unknown>;
  const catReport = r.catReport as Record<string, unknown> | undefined;
  if (catReport?.readinessScore != null && typeof catReport.readinessScore === "number") {
    return Math.round(catReport.readinessScore);
  }
  if (typeof r.accuracyPct === "number") return Math.round(r.accuracyPct);
  if (typeof r.scoreCorrect === "number" && typeof r.scoreTotal === "number" && r.scoreTotal > 0) {
    return Math.round(((r.scoreCorrect as number) / (r.scoreTotal as number)) * 100);
  }
  return null;
}

// ── CAT trend loader ──────────────────────────────────────────────────────────

async function loadCatTrend(userId: string): Promise<CatTrendPoint[]> {
  try {
    const rows = await prisma.practiceTest.findMany({
      where: {
        userId,
        status: PracticeTestStatus.COMPLETED,
        completedAt: { not: null },
        config: { path: ["selectionMode"], equals: "cat" },
      },
      orderBy: { completedAt: "desc" },
      select: { id: true, config: true, results: true, completedAt: true },
      take: 12,
    });

    const trend: CatTrendPoint[] = [];
    let sessionNum = 1;
    for (const row of [...rows].reverse().slice(-MAX_CAT_TREND)) {
      const score = parseReadinessScore(row.results as PracticeTestResultsJson | null);
      if (score === null) { sessionNum++; continue; }
      trend.push({
        id: row.id,
        score,
        completedAt: row.completedAt!.toISOString(),
        sessionLabel: `CAT #${sessionNum}`,
      });
      sessionNum++;
    }
    return trend;
  } catch {
    safeServerLog("learner_readiness", "cat_trend_block_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
    return [];
  }
}

// ── Benchmark loader ──────────────────────────────────────────────────────────

async function loadBenchmark(
  userId: string,
  payload: ReadinessPagePayload,
): Promise<BenchmarkData | null> {
  try {
    return await computeBenchmarkData(userId, payload.snapshot.readiness);
  } catch {
    safeServerLog("learner_readiness", "benchmark_block_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
    return null;
  }
}

// ── Main entry ────────────────────────────────────────────────────────────────

async function loadReadinessDashboardDataUncached(
  userId: string,
  entitlement: AccessScope,
): Promise<ReadinessDashboardPayload | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  try {
    const skipHeavy = shouldSkipNonCriticalLearnerWork();
    // Load base payload first (required) then augment concurrently
    const base = await loadReadinessPagePayload(userId, entitlement);
    if (!base) return null;

    const [dimensionsResult, catTrendResult, benchmarkResult] = await Promise.all([
      skipHeavy
        ? Promise.resolve({
            value: EMPTY_EXAM_DIMENSION_BREAKDOWN,
            degradedPanels: ["dimension_breakdown"],
          })
        : loadExamAttemptDimensionBreakdown(userId).then((value) => ({ value, degradedPanels: [] as string[] })),
      skipHeavy
        ? Promise.resolve({ value: [] as CatTrendPoint[], degradedPanels: ["cat_trend"] })
        : loadCatTrend(userId).then((value) => ({ value, degradedPanels: [] as string[] })),
      skipHeavy
        ? Promise.resolve({ value: null as BenchmarkData | null, degradedPanels: ["benchmark"] })
        : loadBenchmark(userId, base).then((value) => ({ value, degradedPanels: [] as string[] })),
    ]);

    const degradedPanels = [
      ...(base.degraded?.panels ?? []),
      ...dimensionsResult.degradedPanels,
      ...catTrendResult.degradedPanels,
      ...benchmarkResult.degradedPanels,
    ];

    return {
      ...base,
      dimensions: dimensionsResult.value,
      catTrend: catTrendResult.value,
      benchmark: benchmarkResult.value,
      degraded: degradedPanels.length > 0
        ? learnerAggregateDegradedState(
            skipHeavy || base.degraded?.reason === "durability_degraded"
              ? "durability_degraded"
              : "temporarily_unavailable",
            degradedPanels,
          )
        : undefined,
    };
  } catch {
    safeServerLog("learner_readiness", "dashboard_payload_load_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
    return null;
  }
}

export async function loadReadinessDashboardData(
  userId: string,
  entitlement: AccessScope,
): Promise<ReadinessDashboardPayload | null> {
  return loadWithLearnerPrivateReadCache(
    {
      surface: "readiness-dashboard",
      userId,
      ttlSeconds: 45,
      keyParts: [learnerPrivateReadAccessScopeKey(entitlement)],
      bypass: !entitlement.hasAccess || entitlement.reason === "admin_override",
    },
    () => loadReadinessDashboardDataUncached(userId, entitlement),
  );
}

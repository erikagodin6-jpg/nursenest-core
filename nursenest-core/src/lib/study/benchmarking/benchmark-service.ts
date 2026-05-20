/**
 * Benchmark Service — pathway-aware, threshold-gated percentile
 *
 * Safety rules (per spec §2, §5, §7, §11):
 *   - Percentile hidden until BENCHMARK_THRESHOLD qualifying users in cohort
 *   - Cohort = same pathway (targetExamPathwayId) + recency window + depth gate
 *   - No fallback to global/mixed-pathway comparison
 *   - Entire calculation is server-side SQL → no raw user arrays returned to browser
 *   - Exclude the current user from cohort
 *
 * Cohort selection:
 *   1. Pathway-specific:  targetExamPathwayId matches, last RECENCY_DAYS, ≥ MIN_GRADED_ITEMS
 *   2. If no pathwayId / cohort too small → percentile hidden, neutral message shown
 *
 * Performance:
 *   - Single aggregate SQL query returning two numbers (total_learners, at_or_below)
 *   - No user-array download to JS
 *   - Bounded by RECENCY_DAYS and MIN_GRADED_ITEMS filters
 */

import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

// ── Configuration ─────────────────────────────────────────────────────────────

/** Minimum qualifying users in cohort before percentile is shown. */
export const BENCHMARK_THRESHOLD = 100;

/** Each user must have answered at least this many questions to enter the cohort. */
const MIN_GRADED_ITEMS = 20;

/** Rolling recency window in days. Only users active within this window count. */
const RECENCY_DAYS = 180;

// ── Public types ──────────────────────────────────────────────────────────────

export type BenchmarkServiceResult = {
  /** Whether the percentile is active (cohort threshold met). */
  active: boolean;
  /** Number of qualifying users in the cohort. */
  cohortSize: number;
  /** Threshold required for activation. */
  threshold: number;
  /**
   * Human-readable cohort label, e.g. "RN-NCLEX learners" or "comparable learners".
   * Used in display copy.
   */
  cohortLabel: string;
  /**
   * Percentile rank 1–99, e.g. 72 → "higher than 72% of comparable learners".
   * Null when benchmarking is not active.
   */
  percentileRank: number | null;
  /**
   * Short one-sentence comparison text shown when active.
   * e.g. "You scored higher than 72% of comparable learners."
   */
  comparisonText: string | null;
  /**
   * Calm neutral message shown when benchmarking is not yet active.
   */
  neutralMessage: string;
};

// ── Internal helpers ──────────────────────────────────────────────────────────

function buildComparisonText(pct: number, cohortLabel: string): string {
  if (pct >= 90) return `You are in the top 10% among ${cohortLabel}.`;
  if (pct >= 75) return `You scored higher than ${pct}% of ${cohortLabel}.`;
  if (pct >= 50) return `You scored above the median among ${cohortLabel}.`;
  return `You scored higher than ${pct}% of ${cohortLabel}.`;
}

function pathwayCohortLabel(pathwayId: string): string {
  const id = pathwayId.toLowerCase();
  if (id.includes("rn") && id.includes("nclex")) return "RN-NCLEX learners";
  if (id.includes("pn") || id.includes("lpn")) return "PN/LPN learners";
  if (id.includes("np") || id.includes("nurse-practitioner")) return "NP learners";
  if (id.includes("med-surg") || id.includes("medsurg")) return "Med-Surg learners";
  return "comparable learners";
}

// ── Core percentile query ─────────────────────────────────────────────────────

type AggRow = { total_learners: bigint; at_or_below: bigint };

/**
 * Pathway-specific cohort percentile.
 * Returns null when DB is not configured or query fails.
 */
async function queryPathwayPercentile(args: {
  userId: string;
  pathwayId: string;
  userAccuracyPct: number;
  minGradedItems: number;
  recencyDays: number;
}): Promise<{ totalLearners: number; atOrBelow: number } | null> {
  const { userId, pathwayId, userAccuracyPct, minGradedItems, recencyDays } = args;

  try {
    const rows = await prisma.$queryRaw<AggRow[]>`
      WITH user_accuracy AS (
        SELECT
          s."userId",
          SUM(s."correctCount")::float /
            NULLIF(SUM(s."correctCount") + SUM(s."wrongCount"), 0) * 100 AS accuracy_pct
        FROM "UserTopicStat" s
        JOIN "User" u ON s."userId" = u.id
        WHERE u."targetExamPathwayId" = ${pathwayId}
          AND s."updatedAt" >= NOW() - (${recencyDays} || ' days')::INTERVAL
          AND s."userId" != ${userId}
        GROUP BY s."userId"
        HAVING SUM(s."correctCount") + SUM(s."wrongCount") >= ${minGradedItems}
      )
      SELECT
        COUNT(*) AS total_learners,
        COUNT(*) FILTER (WHERE accuracy_pct <= ${userAccuracyPct}) AS at_or_below
      FROM user_accuracy
    `;

    const row = rows[0];
    if (!row) return null;
    return {
      totalLearners: Number(row.total_learners),
      atOrBelow: Number(row.at_or_below),
    };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Loads benchmark data for a specific practice/CAT report.
 *
 * @param userId     Current user's ID (excluded from cohort).
 * @param pathwayId  Pathway from PracticeTest.config.pathwayId or user profile.
 *                   If null, benchmark is disabled (no meaningful cohort key).
 * @param userAccuracyPct  User's accuracy for this session (from results.accuracyPct).
 *                   If null, benchmark is disabled.
 */
export async function loadBenchmarkForReport(args: {
  userId: string;
  pathwayId: string | null;
  userAccuracyPct: number | null;
}): Promise<BenchmarkServiceResult> {
  const { userId, pathwayId, userAccuracyPct } = args;

  const neutralMessage =
    "Percentile benchmarking will appear once enough learner data is available.";

  // Guard: DB not configured
  if (!isDatabaseUrlConfigured()) {
    return {
      active: false,
      cohortSize: 0,
      threshold: BENCHMARK_THRESHOLD,
      cohortLabel: "comparable learners",
      percentileRank: null,
      comparisonText: null,
      neutralMessage,
    };
  }

  // Guard: no pathway → no meaningful cohort comparison
  if (!pathwayId || userAccuracyPct == null) {
    return {
      active: false,
      cohortSize: 0,
      threshold: BENCHMARK_THRESHOLD,
      cohortLabel: "comparable learners",
      percentileRank: null,
      comparisonText: null,
      neutralMessage,
    };
  }

  const cohortLabel = pathwayCohortLabel(pathwayId);

  // Try pathway-specific cohort
  const result = await queryPathwayPercentile({
    userId,
    pathwayId,
    userAccuracyPct,
    minGradedItems: MIN_GRADED_ITEMS,
    recencyDays: RECENCY_DAYS,
  });

  if (!result) {
    return {
      active: false,
      cohortSize: 0,
      threshold: BENCHMARK_THRESHOLD,
      cohortLabel,
      percentileRank: null,
      comparisonText: null,
      neutralMessage,
    };
  }

  const { totalLearners, atOrBelow } = result;

  // Threshold check — hide percentile if cohort is too small
  if (totalLearners < BENCHMARK_THRESHOLD) {
    return {
      active: false,
      cohortSize: totalLearners,
      threshold: BENCHMARK_THRESHOLD,
      cohortLabel,
      percentileRank: null,
      comparisonText: null,
      neutralMessage,
    };
  }

  // Compute percentile rank (1–99)
  const rawPct = totalLearners > 0 ? Math.round((atOrBelow / totalLearners) * 100) : 0;
  const percentileRank = Math.min(99, Math.max(1, rawPct));

  return {
    active: true,
    cohortSize: totalLearners,
    threshold: BENCHMARK_THRESHOLD,
    cohortLabel,
    percentileRank,
    comparisonText: buildComparisonText(percentileRank, cohortLabel),
    neutralMessage,
  };
}

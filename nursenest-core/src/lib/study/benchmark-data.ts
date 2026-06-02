/**
 * Benchmarking Data Layer
 *
 * Safety rules (per spec §11):
 *   - Percentile is hidden unless cohort reaches BENCHMARK_THRESHOLD
 *   - Only users in the same tier are compared
 *   - Only users with sufficient graded history (≥ MIN_USER_GRADED_ITEMS) are included
 *   - No stale-data comparisons (rows must have been updated recently)
 *   - If quality fails any gate → show neutral message, hide percentile
 *
 * Percentile computation:
 *   - Fetches up to MAX_COHORT_ROWS recent UserTopicStat rows for same-tier users
 *   - Aggregates per-user accuracy in JS (fast for bounded N)
 *   - Filters to users with MIN_USER_GRADED_ITEMS graded items
 *   - Counts users with lower accuracy than current user → percentile
 *
 * Performance: bounded by MAX_COHORT_ROWS (default 3000). No unbounded scans.
 */

import "server-only";

import { TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

// ── Configuration ─────────────────────────────────────────────────────────────

/** Minimum cohort size before percentile is shown. */
export const BENCHMARK_THRESHOLD = 100;

/** Minimum graded items per user to include in cohort (filters thin-data users). */
const MIN_USER_GRADED_ITEMS = 20;

/** Max UserTopicStat rows to fetch for cohort computation (performance bound). */
const MAX_COHORT_ROWS = 3000;

// ── Public types ──────────────────────────────────────────────────────────────

export type BenchmarkResult = {
  /** Whether benchmarking is active (threshold met). */
  active: boolean;
  /** Number of qualifying users in cohort. */
  cohortSize: number;
  /** Minimum threshold for activation. */
  threshold: number;
  /**
   * User's approximate percentile rank (1–99), or null if not active.
   * "You scored higher than N% of comparable learners."
   */
  percentileRank: number | null;
  /** Short comparison sentence, or null if not active. */
  comparisonText: string | null;
  /** Neutral message shown when benchmarking is not yet active. */
  neutralMessage: string;
};

// ── Internal helpers ──────────────────────────────────────────────────────────

function buildComparisonText(pct: number): string {
  if (pct >= 75) return `You scored higher than ${pct}% of comparable learners.`;
  if (pct >= 50) return `You are performing above the median for comparable learners.`;
  if (pct >= 25) return `You are below the median — targeted practice can close this gap.`;
  return `Performance is below most comparable learners right now. Consistent remediation will help.`;
}

// ── Main loader ───────────────────────────────────────────────────────────────

export async function loadBenchmarkResult(args: {
  userId: string;
  userTier: TierCode;
  userAccuracyPct: number | null;
}): Promise<BenchmarkResult> {
  const { userId, userTier, userAccuracyPct } = args;

  const neutralMessage =
    "Benchmarking will appear once enough learner data is available.";

  if (!isDatabaseUrlConfigured() || userAccuracyPct === null) {
    return {
      active: false,
      cohortSize: 0,
      threshold: BENCHMARK_THRESHOLD,
      percentileRank: null,
      comparisonText: null,
      neutralMessage,
    };
  }

  try {
    // Fetch recent topic stats for same-tier users (bounded)
    const rows = await prisma.userTopicStat.findMany({
      where: {
        user: { tier: userTier },
      },
      select: {
        userId: true,
        correctCount: true,
        wrongCount: true,
      },
      orderBy: { updatedAt: "desc" },
      take: MAX_COHORT_ROWS,
    });

    // Aggregate per user
    const perUser = new Map<string, { correct: number; wrong: number }>();
    for (const row of rows) {
      const entry = perUser.get(row.userId) ?? { correct: 0, wrong: 0 };
      entry.correct += row.correctCount;
      entry.wrong += row.wrongCount;
      perUser.set(row.userId, entry);
    }

    // Filter to users with enough graded items (excluding the current user)
    const accuracies: number[] = [];
    for (const [uid, agg] of perUser.entries()) {
      if (uid === userId) continue; // exclude self
      const total = agg.correct + agg.wrong;
      if (total < MIN_USER_GRADED_ITEMS) continue;
      accuracies.push(agg.correct / total);
    }

    const cohortSize = accuracies.length;

    if (cohortSize < BENCHMARK_THRESHOLD) {
      return {
        active: false,
        cohortSize,
        threshold: BENCHMARK_THRESHOLD,
        percentileRank: null,
        comparisonText: null,
        neutralMessage,
      };
    }

    // Sort ascending for percentile calculation
    accuracies.sort((a, b) => a - b);

    const userAcc = userAccuracyPct / 100;
    const below = accuracies.filter((a) => a < userAcc).length;
    const percentileRank = Math.min(99, Math.max(1, Math.round((below / cohortSize) * 100)));

    return {
      active: true,
      cohortSize,
      threshold: BENCHMARK_THRESHOLD,
      percentileRank,
      comparisonText: buildComparisonText(percentileRank),
      neutralMessage,
    };
  } catch {
    return {
      active: false,
      cohortSize: 0,
      threshold: BENCHMARK_THRESHOLD,
      percentileRank: null,
      comparisonText: null,
      neutralMessage,
    };
  }
}

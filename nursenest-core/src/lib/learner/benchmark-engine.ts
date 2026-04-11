import "server-only";
import { prisma } from "@/lib/db";
import type { ReadinessBand, ReadinessResult } from "@/lib/learner/readiness-score";

/* ═══════════════════════════════════════════════════════════════════════
   Peer benchmark engine
   ─────────────────────────────────────────────────────────────────────
   Three layers:
     1. Personal progress  → already covered by readiness card
     2. Benchmark level    → readiness band + contextual messaging (always)
     3. Percentile rank    → conditional on 100+ active learners
   ═══════════════════════════════════════════════════════════════════════ */

const MIN_USERS_FOR_PERCENTILE = 100;
const MIN_QUESTIONS_PER_USER = 10;

export type BenchmarkData = {
  band: ReadinessBand;
  bandContext: string;
  percentile: number | null;
  percentileLabel: string | null;
  totalLearners: number;
  hasEnoughData: boolean;
  improvementHint: string;
};

/**
 * Contextual messaging for each readiness band, framed as peer comparison
 * rather than individual assessment.
 */
function bandContextMessage(band: ReadinessBand): string {
  switch (band) {
    case "ready":
      return "Students at this level are typically exam-ready and performing consistently.";
    case "near_ready":
      return "Students at this level are typically close to exam readiness.";
    case "improving":
      return "Students at this level are building momentum and strengthening key topics.";
    case "not_ready":
      return "Students at this level are in the early stages of preparation.";
    case "insufficient_data":
    default:
      return "Complete more practice to see how you compare.";
  }
}

function improvementHintForBand(band: ReadinessBand): string {
  switch (band) {
    case "ready":
      return "Stay sharp with spaced review. You are in a strong position.";
    case "near_ready":
      return "A few more focused sessions on weak topics could move you into the Ready band.";
    case "improving":
      return "Consistent daily practice on your weakest areas will move you forward fastest.";
    case "not_ready":
      return "Start with lessons, then practice questions on one topic at a time.";
    case "insufficient_data":
    default:
      return "Take a practice session or exam to establish your baseline.";
  }
}

function percentileLabel(pct: number): string {
  if (pct >= 90) return "Top 10%";
  if (pct >= 75) return "Top 25%";
  if (pct >= 50) return "Above Average";
  if (pct >= 25) return "Building";
  return "Getting Started";
}

/**
 * Computes the user's percentile rank among all learners with sufficient
 * practice data (10+ answered questions across topics).
 *
 * Uses a single aggregate query on UserTopicStat grouped by userId to
 * derive per-user accuracy, then ranks the current user.
 *
 * Returns null when fewer than MIN_USERS_FOR_PERCENTILE learners qualify.
 */
async function computePercentile(
  userId: string,
  userAccuracyPct: number | null,
): Promise<{ percentile: number | null; totalLearners: number }> {
  if (userAccuracyPct == null) {
    return { percentile: null, totalLearners: 0 };
  }

  try {
    const rows = await prisma.$queryRaw<
      { total_learners: bigint; users_at_or_below: bigint }[]
    >`
      WITH user_accuracy AS (
        SELECT
          "userId",
          SUM("correctCount") AS correct,
          SUM("correctCount") + SUM("wrongCount") AS total
        FROM "UserTopicStat"
        GROUP BY "userId"
        HAVING SUM("correctCount") + SUM("wrongCount") >= ${MIN_QUESTIONS_PER_USER}
      )
      SELECT
        COUNT(*) AS total_learners,
        COUNT(*) FILTER (
          WHERE (correct::float / NULLIF(total, 0)) * 100 <= ${userAccuracyPct}
        ) AS users_at_or_below
      FROM user_accuracy
    `;

    const row = rows[0];
    if (!row) return { percentile: null, totalLearners: 0 };

    const total = Number(row.total_learners);
    const atOrBelow = Number(row.users_at_or_below);

    if (total < MIN_USERS_FOR_PERCENTILE) {
      return { percentile: null, totalLearners: total };
    }

    const pct = total > 0 ? Math.round((atOrBelow / total) * 100) : 0;
    return { percentile: Math.min(99, Math.max(1, pct)), totalLearners: total };
  } catch {
    return { percentile: null, totalLearners: 0 };
  }
}

/**
 * Computes the user's overall accuracy percentage from their topic stats.
 */
async function getUserAccuracy(userId: string): Promise<number | null> {
  try {
    const agg = await prisma.userTopicStat.aggregate({
      where: { userId },
      _sum: { correctCount: true, wrongCount: true },
    });

    const correct = agg._sum.correctCount ?? 0;
    const wrong = agg._sum.wrongCount ?? 0;
    const total = correct + wrong;

    if (total < MIN_QUESTIONS_PER_USER) return null;
    return Math.round((correct / total) * 100);
  } catch {
    return null;
  }
}

/**
 * Main entry point. Computes benchmark data for a user given their
 * readiness result (already computed upstream).
 */
export async function computeBenchmarkData(
  userId: string,
  readiness: ReadinessResult,
): Promise<BenchmarkData> {
  const userAccuracy = await getUserAccuracy(userId);
  const { percentile, totalLearners } = await computePercentile(userId, userAccuracy);

  return {
    band: readiness.band,
    bandContext: bandContextMessage(readiness.band),
    percentile,
    percentileLabel: percentile != null ? percentileLabel(percentile) : null,
    totalLearners,
    hasEnoughData: totalLearners >= MIN_USERS_FOR_PERCENTILE,
    improvementHint: improvementHintForBand(readiness.band),
  };
}

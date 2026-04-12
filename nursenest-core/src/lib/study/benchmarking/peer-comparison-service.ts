/**
 * Peer Comparison Service — unified percentile framework
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     FRAMEWORK OVERVIEW                              │
 * │                                                                     │
 * │  Four contexts, each with a distinct cohort and metric:             │
 * │                                                                     │
 * │  1. cat_exam       — CAT sessions, metric: readinessScore (0–100)   │
 * │     Cohort: same pathwayId + status=COMPLETED + last 180d           │
 * │     Min per user: ≥1 completed CAT                                  │
 * │                                                                     │
 * │  2. practice_test  — Linear practice, metric: accuracyPct (0–100)   │
 * │     Cohort: same pathwayId + non-CAT + last 180d                    │
 * │     Min per user: ≥2 completed practice tests                       │
 * │                                                                     │
 * │  3. question_bank  — UserTopicStat accuracy, metric: accuracyPct    │
 * │     Cohort: same pathway via User.targetExamPathwayId + last 180d   │
 * │     Min per user: ≥20 graded items                                  │
 * │                                                                     │
 * │  4. readiness_overall — same as question_bank but described as      │
 * │     overall readiness; maps to global UserTopicStat comparison       │
 * │                                                                     │
 * │  ACTIVATION RULES (all contexts):                                   │
 * │    ✓ Cohort must reach PEER_THRESHOLD (100 qualifying users)        │
 * │    ✓ Current user excluded from cohort always                       │
 * │    ✓ No percentile shown when cohort < threshold                    │
 * │    ✓ No pathway → benchmarking unavailable (no fallback mixing)     │
 * │    ✓ User score null → benchmarking unavailable                     │
 * │    ✓ Try/catch on every query → graceful fallback to "building"     │
 * │                                                                     │
 * │  PERFORMANCE:                                                       │
 * │    All cohort queries run as single aggregate SQL statements.       │
 * │    No user arrays returned to the JS layer.                        │
 * │    Bounded by RECENCY_DAYS and per-user minimum filters.           │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

// ── Activation constants ──────────────────────────────────────────────────────

/** Minimum qualifying peers in cohort before percentile is shown. */
export const PEER_THRESHOLD = 100;

/** Rolling recency window for all cohort queries. */
const RECENCY_DAYS = 180;

/** Minimum completed CAT sessions for a user to enter the CAT cohort. */
const MIN_CAT_COMPLETIONS = 1;

/** Minimum completed (non-CAT) practice tests to enter the practice cohort. */
const MIN_PRACTICE_TESTS = 2;

/** Minimum graded items (correct + wrong) to enter question-bank / readiness cohort. */
const MIN_GRADED_ITEMS = 20;

// ── Public types ──────────────────────────────────────────────────────────────

/**
 * Which learner context this comparison is for.
 * Determines cohort definition, query strategy, and UI copy.
 */
export type PeerComparisonContext =
  | "cat_exam"           // CAT session completed; compare by readinessScore
  | "practice_test"      // Linear practice test; compare by accuracyPct
  | "question_bank"      // Question bank session; compare by overall accuracy
  | "readiness_overall"; // Readiness dashboard; compare by overall accuracy

/**
 * Which cohort dimension was used for comparison.
 * More specific → more meaningful comparison.
 */
export type CohortDimension =
  | "pathway_exam_type" // same pathway + same exam config (most precise)
  | "pathway"           // same pathway only
  | "tier"              // same subscription tier (fallback)
  | "global";           // all qualifying learners (final fallback)

/**
 * Activation state of peer comparison.
 * Only "active" exposes a percentile rank.
 */
export type PeerActivationState =
  | "active"      // threshold met — show percentile
  | "building"    // cohort growing — show neutral progress
  | "unavailable"; // no meaningful cohort possible (no pathway, no score)

/** The metric being compared. */
export type PeerScoreType = "accuracy" | "readiness_score";

/** Input to the peer comparison service. */
export interface PeerComparisonArgs {
  /** Current user's ID — always excluded from cohort. */
  userId: string;
  /** Which surface is requesting the comparison. */
  context: PeerComparisonContext;
  /**
   * Pathway from PracticeTest.config.pathwayId or User.targetExamPathwayId.
   * Null → benchmarking set to "unavailable" (no meaningful cohort key).
   */
  pathwayId: string | null;
  /**
   * The user's score to rank (accuracy 0–100, or readiness score 0–100).
   * Null → benchmarking set to "unavailable".
   */
  userScore: number | null;
  /**
   * For cat_exam: catExamConfigId to enable exam-type cohort.
   * e.g. "nclex-rn-us". Optional — falls back to pathway-only cohort.
   */
  examConfigId?: string | null;
}

/** Result returned by computePeerComparison. */
export interface PeerComparisonResult {
  activationState: PeerActivationState;
  context: PeerComparisonContext;
  /** Number of qualifying peers in the cohort (0 when unavailable). */
  cohortSize: number;
  /** Threshold required for activation (100). */
  threshold: number;
  /** Percentile rank 1–99. Null when not active. */
  percentileRank: number | null;
  /** Short label: "Top 10%", "Above Median", etc. Null when not active. */
  percentileLabel: string | null;
  /** One-sentence comparison text. Null when not active. */
  comparisonText: string | null;
  /** Neutral message when not yet active. Always set. */
  neutralMessage: string;
  /** What dimension the cohort was built on. */
  cohortDimension: CohortDimension;
  /** Human-readable cohort description: "RN-NCLEX learners", etc. */
  cohortLabel: string;
  /** Whether the metric is accuracy or CAT readiness score. */
  scoreType: PeerScoreType;
  /**
   * Why benchmarking is not yet active (for transparency).
   * Null when active.
   */
  activationReason: string | null;
}

// ── Internal result type ──────────────────────────────────────────────────────

type AggRow = { total_learners: bigint; at_or_below: bigint };

// ── Cohort label helpers ──────────────────────────────────────────────────────

function pathwayCohortLabel(pathwayId: string): string {
  const id = pathwayId.toLowerCase();
  if (id.includes("rn") && id.includes("nclex")) return "RN-NCLEX learners";
  if (id.includes("pn") || id.includes("lpn")) return "PN/LPN learners";
  if (id.includes("np") || id.includes("nurse-practitioner") || id.includes("fnp") || id.includes("anp"))
    return "NP learners";
  if (id.includes("med-surg") || id.includes("medsurg")) return "Med-Surg learners";
  if (id.includes("allied")) return "Allied health learners";
  return "comparable learners";
}

function examConfigLabel(examConfigId: string | null | undefined): string {
  if (!examConfigId) return "comparable learners";
  const id = examConfigId.toLowerCase();
  if (id.includes("nclex-rn")) return "NCLEX-RN candidates";
  if (id.includes("nclex-pn")) return "NCLEX-PN candidates";
  if (id.includes("nclex")) return "NCLEX candidates";
  if (id.includes("fnp")) return "FNP candidates";
  if (id.includes("np")) return "NP candidates";
  return pathwayCohortLabel(examConfigId);
}

// ── Percentile label + copy ───────────────────────────────────────────────────

function percentileLabel(pct: number): string {
  if (pct >= 90) return "Top 10%";
  if (pct >= 75) return "Top 25%";
  if (pct >= 50) return "Above median";
  if (pct >= 25) return "Below median";
  return "Lower quartile";
}

function buildComparisonText(
  pct: number,
  cohortLabel: string,
  context: PeerComparisonContext,
): string {
  const contextLabel =
    context === "cat_exam"
      ? "readiness score"
      : context === "practice_test"
      ? "practice accuracy"
      : "overall performance";

  if (pct >= 90) return `Your ${contextLabel} places you in the top 10% among ${cohortLabel}.`;
  if (pct >= 75) return `Your ${contextLabel} is higher than ${pct}% of ${cohortLabel}.`;
  if (pct >= 50) return `Your ${contextLabel} is above the median among ${cohortLabel}.`;
  if (pct >= 25) return `Your ${contextLabel} is below the median among ${cohortLabel} — targeted practice on weak areas can close this gap.`;
  return `Your ${contextLabel} is in the lower range among ${cohortLabel}. Consistent remediation on weak topics will help.`;
}

function neutralMessageForContext(
  context: PeerComparisonContext,
  cohortLabel: string,
): string {
  switch (context) {
    case "cat_exam":
      return `CAT benchmarking against ${cohortLabel} will appear once enough learner data is available.`;
    case "practice_test":
      return `Practice test benchmarking against ${cohortLabel} will appear once enough learner data is available.`;
    case "question_bank":
    case "readiness_overall":
      return `Percentile comparison against ${cohortLabel} will appear once enough learner data is available.`;
  }
}

// ── Inactive result helpers ───────────────────────────────────────────────────

function unavailableResult(
  context: PeerComparisonContext,
  reason: string,
): PeerComparisonResult {
  return {
    activationState: "unavailable",
    context,
    cohortSize: 0,
    threshold: PEER_THRESHOLD,
    percentileRank: null,
    percentileLabel: null,
    comparisonText: null,
    neutralMessage: "Peer comparison is not available for this session.",
    cohortDimension: "global",
    cohortLabel: "comparable learners",
    scoreType: "accuracy",
    activationReason: reason,
  };
}

function buildingResult(args: {
  context: PeerComparisonContext;
  cohortSize: number;
  cohortLabel: string;
  cohortDimension: CohortDimension;
  scoreType: PeerScoreType;
}): PeerComparisonResult {
  return {
    activationState: "building",
    context: args.context,
    cohortSize: args.cohortSize,
    threshold: PEER_THRESHOLD,
    percentileRank: null,
    percentileLabel: null,
    comparisonText: null,
    neutralMessage: neutralMessageForContext(args.context, args.cohortLabel),
    cohortDimension: args.cohortDimension,
    cohortLabel: args.cohortLabel,
    scoreType: args.scoreType,
    activationReason: `Cohort has ${args.cohortSize} of ${PEER_THRESHOLD} required qualifying learners.`,
  };
}

function activeResult(args: {
  context: PeerComparisonContext;
  cohortSize: number;
  atOrBelow: number;
  cohortLabel: string;
  cohortDimension: CohortDimension;
  scoreType: PeerScoreType;
}): PeerComparisonResult {
  const { context, cohortSize, atOrBelow, cohortLabel, cohortDimension, scoreType } = args;
  const rawPct = cohortSize > 0 ? Math.round((atOrBelow / cohortSize) * 100) : 0;
  const rank = Math.min(99, Math.max(1, rawPct));
  return {
    activationState: "active",
    context,
    cohortSize,
    threshold: PEER_THRESHOLD,
    percentileRank: rank,
    percentileLabel: percentileLabel(rank),
    comparisonText: buildComparisonText(rank, cohortLabel, context),
    neutralMessage: neutralMessageForContext(context, cohortLabel),
    cohortDimension,
    cohortLabel,
    scoreType,
    activationReason: null,
  };
}

// ── Context-specific cohort queries ──────────────────────────────────────────

/**
 * CAT exam cohort: pathway-filtered, compares by readinessScore.
 * If examConfigId provided, adds an additional exam-type filter (most specific).
 */
async function queryCatCohort(args: {
  userId: string;
  pathwayId: string;
  userScore: number;
  examConfigId: string | null | undefined;
}): Promise<{ totalLearners: number; atOrBelow: number } | null> {
  const { userId, pathwayId, userScore, examConfigId } = args;

  try {
    // Try pathway + exam-type cohort first (most specific)
    if (examConfigId) {
      const rows = await prisma.$queryRaw<AggRow[]>`
        WITH cat_scores AS (
          SELECT
            p."userId",
            AVG((p.results::jsonb->'catReport'->>'readinessScore')::float) AS avg_score
          FROM "practice_tests" p
          WHERE
            p.status = 'COMPLETED'
            AND p."completedAt" >= NOW() - (${RECENCY_DAYS}::text || ' days')::INTERVAL
            AND (p.config::jsonb->>'selectionMode') = 'cat'
            AND (p.config::jsonb->>'pathwayId') = ${pathwayId}
            AND (p.config::jsonb->>'catExamConfigId') = ${examConfigId}
            AND p."userId" != ${userId}
            AND (p.results::jsonb->'catReport'->>'readinessScore') IS NOT NULL
          GROUP BY p."userId"
          HAVING COUNT(*) >= ${MIN_CAT_COMPLETIONS}
        )
        SELECT
          COUNT(*) AS total_learners,
          COUNT(*) FILTER (WHERE avg_score <= ${userScore}) AS at_or_below
        FROM cat_scores
      `;
      const row = rows[0];
      if (row && Number(row.total_learners) >= PEER_THRESHOLD) {
        return {
          totalLearners: Number(row.total_learners),
          atOrBelow: Number(row.at_or_below),
        };
      }
    }

    // Fallback: pathway-only CAT cohort
    const rows = await prisma.$queryRaw<AggRow[]>`
      WITH cat_scores AS (
        SELECT
          p."userId",
          AVG((p.results::jsonb->'catReport'->>'readinessScore')::float) AS avg_score
        FROM "practice_tests" p
        WHERE
          p.status = 'COMPLETED'
          AND p."completedAt" >= NOW() - (${RECENCY_DAYS}::text || ' days')::INTERVAL
          AND (p.config::jsonb->>'selectionMode') = 'cat'
          AND (p.config::jsonb->>'pathwayId') = ${pathwayId}
          AND p."userId" != ${userId}
          AND (p.results::jsonb->'catReport'->>'readinessScore') IS NOT NULL
        GROUP BY p."userId"
        HAVING COUNT(*) >= ${MIN_CAT_COMPLETIONS}
      )
      SELECT
        COUNT(*) AS total_learners,
        COUNT(*) FILTER (WHERE avg_score <= ${userScore}) AS at_or_below
      FROM cat_scores
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

/**
 * Practice test cohort: pathway-filtered linear sessions, compares by accuracyPct.
 */
async function queryPracticeTestCohort(args: {
  userId: string;
  pathwayId: string;
  userScore: number;
}): Promise<{ totalLearners: number; atOrBelow: number } | null> {
  const { userId, pathwayId, userScore } = args;

  try {
    const rows = await prisma.$queryRaw<AggRow[]>`
      WITH pt_scores AS (
        SELECT
          p."userId",
          AVG((p.results::jsonb->>'accuracyPct')::float) AS avg_accuracy
        FROM "practice_tests" p
        WHERE
          p.status = 'COMPLETED'
          AND p."completedAt" >= NOW() - (${RECENCY_DAYS}::text || ' days')::INTERVAL
          AND (p.config::jsonb->>'selectionMode') != 'cat'
          AND (p.config::jsonb->>'pathwayId') = ${pathwayId}
          AND p."userId" != ${userId}
          AND (p.results::jsonb->>'accuracyPct') IS NOT NULL
        GROUP BY p."userId"
        HAVING COUNT(*) >= ${MIN_PRACTICE_TESTS}
      )
      SELECT
        COUNT(*) AS total_learners,
        COUNT(*) FILTER (WHERE avg_accuracy <= ${userScore}) AS at_or_below
      FROM pt_scores
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

/**
 * Question bank / overall cohort: UserTopicStat, pathway-filtered via User.targetExamPathwayId.
 */
async function queryQuestionBankCohort(args: {
  userId: string;
  pathwayId: string;
  userScore: number;
}): Promise<{ totalLearners: number; atOrBelow: number } | null> {
  const { userId, pathwayId, userScore } = args;

  try {
    const rows = await prisma.$queryRaw<AggRow[]>`
      WITH user_accuracy AS (
        SELECT
          s."userId",
          SUM(s."correctCount")::float /
            NULLIF(SUM(s."correctCount") + SUM(s."wrongCount"), 0) * 100 AS accuracy_pct
        FROM "UserTopicStat" s
        JOIN "User" u ON s."userId" = u.id
        WHERE
          u."targetExamPathwayId" = ${pathwayId}
          AND s."updatedAt" >= NOW() - (${RECENCY_DAYS}::text || ' days')::INTERVAL
          AND s."userId" != ${userId}
        GROUP BY s."userId"
        HAVING SUM(s."correctCount") + SUM(s."wrongCount") >= ${MIN_GRADED_ITEMS}
      )
      SELECT
        COUNT(*) AS total_learners,
        COUNT(*) FILTER (WHERE accuracy_pct <= ${userScore}) AS at_or_below
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

// ── Main entry point ──────────────────────────────────────────────────────────

/**
 * Computes a peer comparison result for the given context.
 *
 * Always safe to call — returns "unavailable" or "building" on any error.
 * Never returns fake or interpolated comparison data.
 */
export async function computePeerComparison(
  args: PeerComparisonArgs,
): Promise<PeerComparisonResult> {
  const { userId, context, pathwayId, userScore, examConfigId } = args;

  // Guard: DB not configured
  if (!isDatabaseUrlConfigured()) {
    return unavailableResult(context, "Database not configured.");
  }

  // Guard: no pathway — no meaningful cohort key
  if (!pathwayId) {
    return unavailableResult(context, "No pathway identifier available for cohort definition.");
  }

  // Guard: no user score — nothing to compare
  if (userScore == null || !Number.isFinite(userScore)) {
    return unavailableResult(context, "No score available for comparison.");
  }

  const cohortLabel =
    examConfigId
      ? examConfigLabel(examConfigId)
      : pathwayCohortLabel(pathwayId);

  let queryResult: { totalLearners: number; atOrBelow: number } | null = null;
  let cohortDimension: CohortDimension;
  let scoreType: PeerScoreType;

  switch (context) {
    case "cat_exam": {
      scoreType = "readiness_score";
      cohortDimension = examConfigId ? "pathway_exam_type" : "pathway";
      queryResult = await queryCatCohort({ userId, pathwayId, userScore, examConfigId });
      break;
    }
    case "practice_test": {
      scoreType = "accuracy";
      cohortDimension = "pathway";
      queryResult = await queryPracticeTestCohort({ userId, pathwayId, userScore });
      break;
    }
    case "question_bank":
    case "readiness_overall": {
      scoreType = "accuracy";
      cohortDimension = "pathway";
      queryResult = await queryQuestionBankCohort({ userId, pathwayId, userScore });
      break;
    }
    default: {
      return unavailableResult(context, "Unknown comparison context.");
    }
  }

  // Query failed — treat as building with zero cohort
  if (!queryResult) {
    return buildingResult({
      context,
      cohortSize: 0,
      cohortLabel,
      cohortDimension: cohortDimension!,
      scoreType: scoreType!,
    });
  }

  const { totalLearners, atOrBelow } = queryResult;

  // Threshold not met
  if (totalLearners < PEER_THRESHOLD) {
    return buildingResult({
      context,
      cohortSize: totalLearners,
      cohortLabel,
      cohortDimension: cohortDimension!,
      scoreType: scoreType!,
    });
  }

  // Active comparison
  return activeResult({
    context,
    cohortSize: totalLearners,
    atOrBelow,
    cohortLabel,
    cohortDimension: cohortDimension!,
    scoreType: scoreType!,
  });
}

/**
 * Derives the best peer comparison args for a report card context.
 *
 * Priority order:
 *   1. Most recent completed CAT (readinessScore from catReport)
 *   2. Most recent completed practice test (accuracyPct)
 *   3. Overall question bank accuracy (readiness_overall)
 */
export function bestReportCardComparisonArgs(args: {
  userId: string;
  recentPracticeTests: Array<{
    isCat: boolean;
    accuracyPct: number | null;
    pathwayId: string | null;
    catReadinessScore?: number | null;
    examConfigId?: string | null;
  }>;
  overallAccuracyPct: number | null;
  preferredPathwayId: string | null;
}): PeerComparisonArgs {
  const { userId, recentPracticeTests, overallAccuracyPct, preferredPathwayId } = args;

  // 1. CAT
  const latestCat = recentPracticeTests.find(
    (pt) => pt.isCat && pt.catReadinessScore != null && pt.pathwayId,
  );
  if (latestCat) {
    return {
      userId,
      context: "cat_exam",
      pathwayId: latestCat.pathwayId,
      userScore: latestCat.catReadinessScore ?? null,
      examConfigId: latestCat.examConfigId ?? null,
    };
  }

  // 2. Practice test
  const latestPractice = recentPracticeTests.find(
    (pt) => !pt.isCat && pt.accuracyPct != null && pt.pathwayId,
  );
  if (latestPractice) {
    return {
      userId,
      context: "practice_test",
      pathwayId: latestPractice.pathwayId,
      userScore: latestPractice.accuracyPct ?? null,
    };
  }

  // 3. Overall question bank
  return {
    userId,
    context: "readiness_overall",
    pathwayId: preferredPathwayId,
    userScore: overallAccuracyPct,
  };
}

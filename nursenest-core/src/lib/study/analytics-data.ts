/**
 * Analytics Data — server-side loading functions for the deeper analytics page.
 *
 * Architecture:
 *   - Pure async functions (not Server Actions) — called from RSC page and actions.ts
 *   - All queries are windowed/limited — no unbounded fetches
 *   - Summary layer loads first (fast); expanded panels load on-demand
 *   - Results JSON is parsed defensively (same strategy as srs-scheduler)
 *
 * Pagination strategy:
 *   - Initial trend: last 10 CAT sessions
 *   - Older history: cursor-based via loadMoreReadinessTrend(afterId)
 *   - Confidence: last 20 ExamAttempt sessions, aggregated client-side
 *   - Time: last 10 PracticeTest sessions
 *   - Topics: last 15 UserTopicStat rows (most recently updated)
 */

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { withRetry } from "@/lib/resilience/with-retry";
import { loadStudyStreakDays } from "@/lib/learner/premium-dashboard-snapshot";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getReadinessBand } from "@/components/study/cat-readiness-hero";
import type { ReadinessBand } from "@/components/study/cat-readiness-hero";
import {
  analyticsDegraded,
  analyticsError,
  analyticsOk,
  analyticsResolvedData,
  type AnalyticsLoadResult,
} from "@/lib/study/analytics-load-result";

// ── Shared types ──────────────────────────────────────────────────────────────

export type AnalyticsSummary = {
  /** Total questions answered across all sessions. */
  totalQuestionsAnswered: number;
  /** Overall accuracy pct (0–100) from UserTopicStat or fallback. */
  overallAccuracyPct: number | null;
  /** Current study streak in days. */
  streakDays: number;
  /** Most recent CAT readiness score (0–100) or null if no CATs taken. */
  latestReadinessScore: number | null;
  /** Readiness band for the latest score. */
  latestReadinessBand: ReadinessBand | null;
  /** Total CAT sessions completed. */
  catSessionCount: number;
  /** Total study sessions (ExamAttempt count). */
  studySessionCount: number;
};

export type ReadinessTrendPoint = {
  id: string;
  score: number;
  completedAt: string; // ISO string
  sessionLabel: string; // "CAT #N" or formatted date
};

export type ConfidencePatternSummary = {
  /** Questions where user was high-confidence and wrong. */
  overconfidentErrors: number;
  /** Questions where user was low-confidence and correct. */
  uncertainCorrect: number;
  /** Questions where user was high-confidence and correct. */
  stableMastery: number;
  /** Total questions with confidence ratings. */
  totalRated: number;
  /** Accuracy when high-confidence (0–1 or null). */
  highConfidenceAccuracy: number | null;
  /** Count from last N sessions analyzed. */
  sessionsAnalyzed: number;
};

export type TopicRow = {
  topic: string;
  correctCount: number;
  totalCount: number;
  accuracyPct: number; // 0–100
};

/** Aggregated accuracy by `ExamQuestion.questionType` from recent graded attempts. */
export type QuestionTypeRow = {
  questionType: string;
  correctCount: number;
  wrongCount: number;
  accuracyPct: number;
};

export type TimeMetrics = {
  /** Average milliseconds per question across sessions. */
  avgMsPerQuestion: number | null;
  /** Average total session duration in ms. */
  avgSessionDurationMs: number | null;
  /** Sessions with less than 60s total (likely skipped). */
  rushSessions: number;
  /** Sessions with more than 45 min (deep study). */
  deepStudySessions: number;
  /** Total sessions analyzed. */
  sessionsAnalyzed: number;
  /** Min session duration seen (ms). */
  minSessionMs: number | null;
  /** Max session duration seen (ms). */
  maxSessionMs: number | null;
};

/** Single rated attempt for confidence × performance scatter (exam attempts, bounded). */
export type ConfidenceScatterPoint = {
  id: string;
  /** 0–100: mapped confidence (low / medium / high). */
  x: number;
  /** 0–100: 100 = correct, 0 = incorrect, with tiny jitter for visibility. */
  y: number;
};

/** One calendar day (UTC) of graded practice volume for the study-activity heatmap. */
export type DailyActivityCell = {
  dateKey: string;
  questionsAnswered: number;
};

/** Extra bounded metrics for the analytics “performance report” hero. */
export type AnalyticsDbSupplemental = {
  flashcardsReviewedTotal: number;
  /** Sum of completed session elapsed time over the last 90 days (practice tests). */
  studyHoursApprox: number | null;
  /** From recent completed practice tests with timing + results. */
  avgMsPerQuestion: number | null;
};

export type AnalyticsSupplementalMetrics = AnalyticsDbSupplemental & {
  /**
   * Rough composite from readiness + accuracy for dashboard display only.
   * Not a clinical or licensing prediction.
   */
  passProbabilityEstimate: number | null;
  /** 0–10 display derived from latest readiness when available. */
  adaptiveDifficultyDisplay: number | null;
};

/** Readiness trend window + pagination cursor (CAT sessions). */
export type AnalyticsReadinessTrendWindow = {
  points: ReadinessTrendPoint[];
  hasMore: boolean;
  cursor: string | null;
};

export type AnalyticsPagePayload = {
  summary: AnalyticsLoadResult<AnalyticsSummary>;
  trend: AnalyticsLoadResult<AnalyticsReadinessTrendWindow>;
  initialTopicRows: AnalyticsLoadResult<TopicRow[]>;
  questionTypeRows: AnalyticsLoadResult<QuestionTypeRow[]>;
  confidenceScatterPoints: AnalyticsLoadResult<ConfidenceScatterPoint[]>;
  dbSupplemental: AnalyticsLoadResult<AnalyticsDbSupplemental>;
  dailyActivity: AnalyticsLoadResult<DailyActivityCell[]>;
  /** Merged KPI metrics; passProbability null when hidden per quality rules. */
  supplemental: AnalyticsSupplementalMetrics;
  /** Explicit load / data-quality flags for analytics surfaces. */
  analyticsQuality: {
    hasError: boolean;
    hasDegraded: boolean;
    failedSegments: string[];
    passProbabilityVisible: boolean;
  };
};

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Safely read a numeric readiness score from PracticeTest.results JSON.
 * Tries `catReport.readinessScore` then falls back to `accuracyPct`.
 */
function parseReadinessScore(results: unknown): number | null {
  if (!results || typeof results !== "object") return null;
  const r = results as Record<string, unknown>;
  const catReport = r.catReport as Record<string, unknown> | undefined;
  if (catReport?.readinessScore != null && typeof catReport.readinessScore === "number") {
    return Math.round(catReport.readinessScore);
  }
  if (typeof r.accuracyPct === "number") return Math.round(r.accuracyPct);
  return null;
}

/**
 * Parse ExamAttempt.results JSON into confidence/correctness arrays.
 * Defensively typed — skips malformed rows.
 */
function parseAttemptResults(raw: unknown): {
  questionId: string;
  isCorrect: boolean;
  confidence: "high" | "medium" | "low" | null;
}[] {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.items)) return parseAttemptResults(o.items);
    if (Array.isArray(o.questions)) return parseAttemptResults(o.questions);
    if (Array.isArray(o.results)) return parseAttemptResults(o.results);
  }
  if (!Array.isArray(raw)) return [];
  const out: { questionId: string; isCorrect: boolean; confidence: "high" | "medium" | "low" | null }[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const qid = String(r.id ?? r.questionId ?? r.qid ?? "");
    if (!qid) continue;
    const isCorrect = Boolean(r.isCorrect ?? r.correct ?? false);
    const conf = r.confidence;
    const confidence: "high" | "medium" | "low" | null =
      conf === "high" || conf === "medium" || conf === "low" ? conf : null;
    out.push({ questionId: qid, isCorrect, confidence });
  }
  return out;
}

function logAnalyticsFailure(event: string, userId: string): void {
  safeServerLog("learner_analytics", event, {
    userIdPrefix: userId.slice(0, 8),
  });
}

function utcDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function emptyDailyActivity(days: number): DailyActivityCell[] {
  const end = new Date();
  const out: DailyActivityCell[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    out.push({ dateKey: utcDateKey(d), questionsAnswered: 0 });
  }
  return out;
}

/**
 * Questions answered per UTC day from recent ExamAttempt rows (bounded).
 */
export async function loadDailyQuestionActivity(
  userId: string,
  days = 28,
): Promise<AnalyticsLoadResult<DailyActivityCell[]>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - days);

    const attempts = await withRetry(() =>
      prisma.examAttempt.findMany({
        where: { userId, createdAt: { gte: start } },
        orderBy: { createdAt: "desc" },
        take: 200,
        select: { createdAt: true, results: true },
      }),
    );

    const tally = new Map<string, number>();
    for (const cell of emptyDailyActivity(days)) {
      tally.set(cell.dateKey, 0);
    }

    for (const a of attempts) {
      const key = utcDateKey(a.createdAt);
      if (!tally.has(key)) continue;
      const n = parseAttemptResults(a.results).length;
      tally.set(key, (tally.get(key) ?? 0) + n);
    }

    return analyticsOk(
      [...tally.entries()]
        .sort(([x], [y]) => x.localeCompare(y))
        .map(([dateKey, questionsAnswered]) => ({ dateKey, questionsAnswered })),
    );
  } catch {
    logAnalyticsFailure("daily_activity_block_failed", userId);
    return analyticsError("daily_activity_load_failed");
  }
}

export async function loadAnalyticsDbSupplemental(
  userId: string,
): Promise<AnalyticsLoadResult<AnalyticsDbSupplemental>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const since90 = new Date();
    since90.setDate(since90.getDate() - 90);

    const [stats, sumElapsed, recentSessions] = await Promise.all([
      withRetry(() =>
        prisma.flashcardUserStats.findUnique({
          where: { userId },
          select: { cardsReviewedTotal: true },
        }),
      ),
      withRetry(() =>
        prisma.practiceTest.aggregate({
          where: {
            userId,
            status: PracticeTestStatus.COMPLETED,
            elapsedMs: { not: null },
            completedAt: { gte: since90 },
          },
          _sum: { elapsedMs: true },
        }),
      ),
      withRetry(() =>
        prisma.practiceTest.findMany({
          where: { userId, status: PracticeTestStatus.COMPLETED, elapsedMs: { not: null } },
          orderBy: { completedAt: "desc" },
          take: 12,
          select: { elapsedMs: true, results: true },
        }),
      ),
    ]);

    let totalMs = 0;
    let totalQs = 0;
    for (const s of recentSessions) {
      const ms = s.elapsedMs ?? 0;
      if (ms <= 0) continue;
      totalMs += ms;
      const r = s.results as Record<string, unknown> | null;
      const qCount =
        typeof r?.scoreTotal === "number"
          ? r.scoreTotal
          : Array.isArray(r?.items)
            ? (r.items as unknown[]).length
            : 0;
      if (qCount > 0) totalQs += qCount;
    }

    const sumMs = sumElapsed._sum.elapsedMs;
    return analyticsOk({
      flashcardsReviewedTotal: stats?.cardsReviewedTotal ?? 0,
      studyHoursApprox:
        sumMs != null && sumMs > 0 ? Math.round((sumMs / 3600000) * 10) / 10 : null,
      avgMsPerQuestion: totalQs > 0 ? Math.round(totalMs / totalQs) : null,
    });
  } catch {
    logAnalyticsFailure("db_supplemental_block_failed", userId);
    return analyticsError("db_supplemental_load_failed");
  }
}

function derivePassProbabilityEstimate(summary: AnalyticsSummary): number | null {
  const r = summary.latestReadinessScore;
  const a = summary.overallAccuracyPct;
  if (r != null && a != null) {
    return Math.min(96, Math.max(45, Math.round(0.45 * r + 0.4 * a + 8)));
  }
  if (r != null) return Math.min(92, Math.max(45, Math.round(0.82 * r + 6)));
  if (a != null && summary.totalQuestionsAnswered >= 20) {
    return Math.min(88, Math.max(45, Math.round(0.65 * a + 20)));
  }
  return null;
}

function deriveAdaptiveDifficultyDisplay(summary: AnalyticsSummary): number | null {
  if (summary.latestReadinessScore == null) return null;
  return Math.round((summary.latestReadinessScore / 100) * 100) / 10;
}

function buildAnalyticsSupplementalAndQuality(args: {
  summary: AnalyticsLoadResult<AnalyticsSummary>;
  trend: AnalyticsLoadResult<AnalyticsReadinessTrendWindow>;
  initialTopicRows: AnalyticsLoadResult<TopicRow[]>;
  questionTypeRows: AnalyticsLoadResult<QuestionTypeRow[]>;
  confidenceScatterPoints: AnalyticsLoadResult<ConfidenceScatterPoint[]>;
  dbSupplemental: AnalyticsLoadResult<AnalyticsDbSupplemental>;
  dailyActivity: AnalyticsLoadResult<DailyActivityCell[]>;
}): {
  supplemental: AnalyticsSupplementalMetrics;
  analyticsQuality: {
    hasError: boolean;
    hasDegraded: boolean;
    failedSegments: string[];
    passProbabilityVisible: boolean;
  };
} {
  const segmentEntries: Array<[string, AnalyticsLoadResult<unknown>]> = [
    ["summary", args.summary],
    ["trend", args.trend],
    ["topics", args.initialTopicRows],
    ["question_types", args.questionTypeRows],
    ["confidence_scatter", args.confidenceScatterPoints],
    ["db_supplemental", args.dbSupplemental],
    ["daily_activity", args.dailyActivity],
  ];
  const failedSegments: string[] = [];
  let hasError = false;
  let hasDegraded = false;
  for (const [key, r] of segmentEntries) {
    if (r.kind === "error") {
      hasError = true;
      failedSegments.push(key);
    } else if (r.kind === "degraded") {
      hasDegraded = true;
      failedSegments.push(`${key}:degraded`);
    }
  }

  const summaryData = analyticsResolvedData(args.summary);
  const dbData = analyticsResolvedData(args.dbSupplemental);
  const dbBase: AnalyticsDbSupplemental =
    dbData ??
    ({
      flashcardsReviewedTotal: 0,
      studyHoursApprox: null,
      avgMsPerQuestion: null,
    } satisfies AnalyticsDbSupplemental);

  const passProbabilityVisible =
    !hasError &&
    !hasDegraded &&
    summaryData != null &&
    derivePassProbabilityEstimate(summaryData) != null;

  const supplemental: AnalyticsSupplementalMetrics = {
    ...dbBase,
    passProbabilityEstimate: passProbabilityVisible ? derivePassProbabilityEstimate(summaryData) : null,
    adaptiveDifficultyDisplay: summaryData ? deriveAdaptiveDifficultyDisplay(summaryData) : null,
  };

  return {
    supplemental,
    analyticsQuality: {
      hasError,
      hasDegraded,
      failedSegments,
      passProbabilityVisible,
    },
  };
}

// ── Data loaders ──────────────────────────────────────────────────────────────

/**
 * Load the fast summary layer — runs 4 queries in parallel.
 * Target: < 300ms total.
 */
export async function loadAnalyticsSummary(userId: string): Promise<AnalyticsLoadResult<AnalyticsSummary>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const [studySessionCount, latestCat, topicStats] = await Promise.all([
      withRetry(() =>
        prisma.examAttempt.count({ where: { userId } }),
      ),
      withRetry(() =>
        prisma.practiceTest.findFirst({
          where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
          orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
          select: { id: true, results: true, elapsedMs: true },
        }),
      ),
      withRetry(() =>
        prisma.userTopicStat.findMany({
          where: { userId },
          select: { correctCount: true, wrongCount: true },
          take: 200,
        }),
      ),
    ]);

    let streakDays = 0;
    let streakFailureReason: string | null = null;
    try {
      streakDays = await loadStudyStreakDays(userId);
    } catch (e) {
      streakFailureReason = e instanceof Error ? e.message : "streak_load_failed";
    }

    // Compute accuracy from UserTopicStat aggregates
    let totalCorrect = 0;
    let totalAttempted = 0;
    for (const s of topicStats) {
      totalCorrect += s.correctCount;
      totalAttempted += s.correctCount + s.wrongCount;
    }
    const overallAccuracyPct =
      totalAttempted >= 5
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : null;

    const latestReadinessScore = latestCat
      ? parseReadinessScore(latestCat.results)
      : null;
    const latestReadinessBand = latestReadinessScore !== null
      ? getReadinessBand(latestReadinessScore)
      : null;

    const catSessionCount = await withRetry(() =>
      prisma.practiceTest.count({
        where: { userId, status: PracticeTestStatus.COMPLETED },
      }),
    );

    const built: AnalyticsSummary = {
      totalQuestionsAnswered: totalAttempted > 0 ? totalAttempted : studySessionCount,
      overallAccuracyPct,
      streakDays,
      latestReadinessScore,
      latestReadinessBand,
      catSessionCount,
      studySessionCount,
    };

    if (streakFailureReason) {
      return analyticsDegraded(built, streakFailureReason);
    }
    return analyticsOk(built);
  } catch {
    logAnalyticsFailure("summary_block_failed", userId);
    return analyticsError("summary_load_failed");
  }
}

/**
 * Load the initial readiness trend window (last 10 CAT sessions).
 * Used for initial page render. Older history fetched via Server Action.
 */
export async function loadReadinessTrend(
  userId: string,
  limit = 10,
): Promise<AnalyticsLoadResult<AnalyticsReadinessTrendWindow>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) {
    return analyticsError("database_not_configured");
  }

  try {
    const rows = await withRetry(() =>
      prisma.practiceTest.findMany({
        where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: 12,
        select: { id: true, results: true, completedAt: true },
      }),
    );

    const hasMore = rows.length > limit;
    const window = hasMore ? rows.slice(0, limit) : rows;

    let sessionNum = 0;
    const points: ReadinessTrendPoint[] = [];
    for (const row of [...window].reverse()) {
      sessionNum++;
      const score = parseReadinessScore(row.results);
      if (score === null) continue;
      points.push({
        id: row.id,
        score,
        completedAt: row.completedAt!.toISOString(),
        sessionLabel: `CAT #${sessionNum}`,
      });
    }

    const cursor = window.length > 0 ? (window[window.length - 1]?.id ?? null) : null;
    return analyticsOk({ points, hasMore, cursor });
  } catch {
    logAnalyticsFailure("readiness_trend_block_failed", userId);
    return analyticsError("readiness_trend_load_failed");
  }
}

/**
 * Load older readiness trend history after a cursor.
 * Called from Server Action for "Load more history".
 */
export async function loadMoreReadinessTrend(
  userId: string,
  afterId: string,
  limit = 10,
): Promise<AnalyticsLoadResult<AnalyticsReadinessTrendWindow>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) {
    return analyticsError("database_not_configured");
  }

  try {
    const rows = await withRetry(() =>
      prisma.practiceTest.findMany({
        where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        cursor: { id: afterId },
        skip: 1,
        take: 12,
        select: { id: true, results: true, completedAt: true },
      }),
    );

    const hasMore = rows.length > limit;
    const window = hasMore ? rows.slice(0, limit) : rows;

    const points: ReadinessTrendPoint[] = window.map((row, i) => {
      const score = parseReadinessScore(row.results);
      return {
        id: row.id,
        score: score ?? 0,
        completedAt: row.completedAt!.toISOString(),
        sessionLabel: `Earlier session ${i + 1}`,
      };
    }).filter((p) => p.score > 0);

    const cursor = window.length > 0 ? (window[window.length - 1]?.id ?? null) : null;
    return analyticsOk({ points, hasMore, cursor });
  } catch {
    logAnalyticsFailure("more_readiness_trend_block_failed", userId);
    return analyticsError("readiness_trend_more_load_failed");
  }
}

function confidenceLevelToX(conf: "high" | "medium" | "low"): number {
  if (conf === "low") return 22;
  if (conf === "medium") return 52;
  return 82;
}

/** Deterministic micro-jitter so stacked points remain visible (stable across SSR/client). */
function scatterJitter(seed: string, axis: "x" | "y"): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i);
  const u = (h >>> 0) % 17;
  const v = u - 8;
  return axis === "x" ? v * 0.55 : v * 0.45;
}

/**
 * Per-question coordinates for a confidence vs. performance scatter chart.
 * Bounded scan of recent ExamAttempt sessions (same source as confidence patterns).
 */
export async function loadConfidenceScatterPoints(
  userId: string,
  sessionLimit = 25,
  maxPoints = 160,
): Promise<AnalyticsLoadResult<ConfidenceScatterPoint[]>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const recentSessions = await withRetry(() =>
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 60,
        select: { id: true, results: true },
      }),
    );
    const sessions = recentSessions.slice(0, sessionLimit);

    const out: ConfidenceScatterPoint[] = [];
    for (const session of sessions) {
      const items = parseAttemptResults(session.results);
      for (let i = 0; i < items.length; i++) {
        if (out.length >= maxPoints) return analyticsOk(out);
        const item = items[i]!;
        if (item.confidence === null) continue;
        const seed = `${session.id}:${item.questionId}:${i}`;
        const x = Math.min(
          98,
          Math.max(2, confidenceLevelToX(item.confidence) + scatterJitter(seed, "x")),
        );
        const baseY = item.isCorrect ? 84 : 16;
        const y = Math.min(98, Math.max(2, baseY + scatterJitter(`${seed}:y`, "y")));
        out.push({ id: seed, x, y });
      }
    }
    return analyticsOk(out);
  } catch {
    logAnalyticsFailure("confidence_scatter_block_failed", userId);
    return analyticsError("confidence_scatter_load_failed");
  }
}

/**
 * Aggregate confidence patterns from recent ExamAttempt sessions.
 * Reads last 20 sessions, parses results JSON.
 */
export async function loadConfidencePatterns(
  userId: string,
  sessionLimit = 20,
): Promise<AnalyticsLoadResult<ConfidencePatternSummary>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const recentSessions = await withRetry(() =>
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 60,
        select: { results: true },
      }),
    );
    const sessions = recentSessions.slice(0, sessionLimit);

    let overconfidentErrors = 0;
    let uncertainCorrect = 0;
    let stableMastery = 0;
    let highCorrect = 0;
    let highTotal = 0;
    let totalRated = 0;

    for (const session of sessions) {
      const items = parseAttemptResults(session.results);
      for (const item of items) {
        if (item.confidence === null) continue;
        totalRated++;
        if (item.confidence === "high") {
          highTotal++;
          if (item.isCorrect) { highCorrect++; stableMastery++; }
          else overconfidentErrors++;
        }
        if (item.confidence === "low" && item.isCorrect) uncertainCorrect++;
      }
    }

    return analyticsOk({
      overconfidentErrors,
      uncertainCorrect,
      stableMastery,
      totalRated,
      highConfidenceAccuracy: highTotal > 0 ? highCorrect / highTotal : null,
      sessionsAnalyzed: sessions.length,
    });
  } catch {
    logAnalyticsFailure("confidence_patterns_block_failed", userId);
    return analyticsError("confidence_patterns_load_failed");
  }
}

/**
 * Load time metrics from recent PracticeTest sessions.
 * Uses PracticeTest.elapsedMs (actual DB field).
 */
export async function loadTimeMetrics(
  userId: string,
  sessionLimit = 10,
): Promise<AnalyticsLoadResult<TimeMetrics>> {
  const empty: TimeMetrics = {
    avgMsPerQuestion: null,
    avgSessionDurationMs: null,
    rushSessions: 0,
    deepStudySessions: 0,
    sessionsAnalyzed: 0,
    minSessionMs: null,
    maxSessionMs: null,
  };

  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const recentSessions = await withRetry(() =>
      prisma.practiceTest.findMany({
        where: {
          userId,
          status: PracticeTestStatus.COMPLETED,
          elapsedMs: { not: null },
        },
        orderBy: { completedAt: "desc" },
        take: 12,
        select: { elapsedMs: true, results: true },
      }),
    );
    const sessions = recentSessions.slice(0, sessionLimit);

    if (sessions.length === 0) return analyticsOk(empty);

    let totalMs = 0;
    let totalQs = 0;
    let rushSessions = 0;
    let deepStudySessions = 0;
    let minMs: number | null = null;
    let maxMs: number | null = null;

    for (const s of sessions) {
      const ms = s.elapsedMs ?? 0;
      if (ms <= 0) continue;
      totalMs += ms;
      // Parse question count from results JSON
      const r = s.results as Record<string, unknown> | null;
      const qCount =
        typeof r?.scoreTotal === "number"
          ? r.scoreTotal
          : Array.isArray(r?.items)
          ? (r.items as unknown[]).length
          : 0;
      if (qCount > 0) totalQs += qCount;

      if (ms < 60_000) rushSessions++;
      else if (ms > 45 * 60_000) deepStudySessions++;

      if (minMs === null || ms < minMs) minMs = ms;
      if (maxMs === null || ms > maxMs) maxMs = ms;
    }

    return analyticsOk({
      avgMsPerQuestion: totalQs > 0 ? Math.round(totalMs / totalQs) : null,
      avgSessionDurationMs: sessions.length > 0 ? Math.round(totalMs / sessions.length) : null,
      rushSessions,
      deepStudySessions,
      sessionsAnalyzed: sessions.length,
      minSessionMs: minMs,
      maxSessionMs: maxMs,
    });
  } catch {
    logAnalyticsFailure("time_metrics_block_failed", userId);
    return analyticsError("time_metrics_load_failed");
  }
}

/**
 * Load topic accuracy breakdown from UserTopicStat.
 * Returns the 15 most recently updated topics with sufficient data.
 */
export async function loadTopicBreakdown(
  userId: string,
  limit = 15,
): Promise<AnalyticsLoadResult<TopicRow[]>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const rows = await withRetry(() =>
      prisma.userTopicStat.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: limit,
        select: { topic: true, correctCount: true, wrongCount: true },
      }),
    );

    return analyticsOk(
      rows
        .filter((r) => r.correctCount + r.wrongCount >= 3)
        .map((r) => {
          const total = r.correctCount + r.wrongCount;
          return {
            topic: r.topic,
            correctCount: r.correctCount,
            totalCount: total,
            accuracyPct: total > 0 ? Math.round((r.correctCount / total) * 100) : 0,
          };
        })
        .sort((a, b) => b.totalCount - a.totalCount),
    );
  } catch {
    logAnalyticsFailure("topic_breakdown_block_failed", userId);
    return analyticsError("topic_breakdown_load_failed");
  }
}

/**
 * Aggregate performance by question type from recent ExamAttempt rows.
 * Joins parsed item IDs to `ExamQuestion.questionType` (bounded sessions + batched lookups).
 */
export async function loadQuestionTypeBreakdown(
  userId: string,
  sessionLimit = 40,
): Promise<AnalyticsLoadResult<QuestionTypeRow[]>> {
  if (!userId) return analyticsError("missing_user_id");
  if (!isDatabaseUrlConfigured()) return analyticsError("database_not_configured");

  try {
    const recentSessions = await withRetry(() =>
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 60,
        select: { results: true },
      }),
    );
    const sessions = recentSessions.slice(0, sessionLimit);

    type Item = { qid: string; isCorrect: boolean };
    const allItems: Item[] = [];
    for (const s of sessions) {
      for (const row of parseAttemptResults(s.results)) {
        if (!row.questionId) continue;
        allItems.push({ qid: row.questionId, isCorrect: row.isCorrect });
      }
    }

    const uniqueIds = [...new Set(allItems.map((i) => i.qid))];
    if (uniqueIds.length === 0) return analyticsOk([]);

    const typeById = new Map<string, string>();
    const CHUNK = 200;
    for (let i = 0; i < uniqueIds.length; i += CHUNK) {
      const chunk = uniqueIds.slice(i, i + CHUNK);
      const rows = await withRetry(() =>
        prisma.examQuestion.findMany({
          where: { id: { in: chunk } },
          select: { id: true, questionType: true },
        }),
      );
      for (const r of rows) {
        typeById.set(r.id, r.questionType);
      }
    }

    const tallies = new Map<string, { c: number; w: number }>();
    for (const row of allItems) {
      const qt = typeById.get(row.qid);
      if (!qt) continue;
      const t = tallies.get(qt) ?? { c: 0, w: 0 };
      if (row.isCorrect) t.c++;
      else t.w++;
      tallies.set(qt, t);
    }

    return analyticsOk(
      [...tallies.entries()]
        .map(([questionType, { c, w }]) => {
          const total = c + w;
          return {
            questionType,
            correctCount: c,
            wrongCount: w,
            accuracyPct: total > 0 ? Math.round((c / total) * 100) : 0,
          };
        })
        .filter((r) => r.correctCount + r.wrongCount >= 3)
        .sort((a, b) => b.correctCount + b.wrongCount - (a.correctCount + a.wrongCount)),
    );
  } catch {
    logAnalyticsFailure("question_type_block_failed", userId);
    return analyticsError("question_type_load_failed");
  }
}

/**
 * Full initial analytics payload for the RSC page.
 * Loads summary + initial trend window in parallel.
 * Detailed panels (confidence, time, topics) load on-demand.
 */
export async function loadAnalyticsPagePayload(
  userId: string,
): Promise<AnalyticsPagePayload> {
  const [
    summary,
    trend,
    initialTopicRows,
    questionTypeRows,
    confidenceScatterPoints,
    dbSupplemental,
    dailyActivity,
  ] = await Promise.all([
    loadAnalyticsSummary(userId),
    loadReadinessTrend(userId, 10),
    loadTopicBreakdown(userId, 15),
    loadQuestionTypeBreakdown(userId, 40),
    loadConfidenceScatterPoints(userId, 25, 160),
    loadAnalyticsDbSupplemental(userId),
    loadDailyQuestionActivity(userId, 28),
  ]);

  const { supplemental, analyticsQuality } = buildAnalyticsSupplementalAndQuality({
    summary,
    trend,
    initialTopicRows,
    questionTypeRows,
    confidenceScatterPoints,
    dbSupplemental,
    dailyActivity,
  });

  return {
    summary,
    trend,
    initialTopicRows,
    questionTypeRows,
    confidenceScatterPoints,
    dbSupplemental,
    dailyActivity,
    supplemental,
    analyticsQuality,
  };
}

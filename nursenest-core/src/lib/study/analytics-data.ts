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
import { getReadinessBand } from "@/components/study/cat-readiness-hero";
import type { ReadinessBand } from "@/components/study/cat-readiness-hero";

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

export type AnalyticsPagePayload = {
  summary: AnalyticsSummary;
  /** Initial trend window — last 10 CATs. */
  trendWindow: ReadinessTrendPoint[];
  /** Whether older CAT history exists beyond the initial window. */
  hasMorTrend: boolean;
  /** ID of the oldest item in trendWindow (used as cursor for more history). */
  trendCursor: string | null;
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

// ── Data loaders ──────────────────────────────────────────────────────────────

/**
 * Load the fast summary layer — runs 4 queries in parallel.
 * Target: < 300ms total.
 */
export async function loadAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    totalQuestionsAnswered: 0,
    overallAccuracyPct: null,
    streakDays: 0,
    latestReadinessScore: null,
    latestReadinessBand: null,
    catSessionCount: 0,
    studySessionCount: 0,
  };

  if (!userId || !isDatabaseUrlConfigured()) return empty;

  try {
    const [studySessionCount, latestCat, topicStats, streakDays] = await Promise.all([
      withRetry(() =>
        prisma.examAttempt.count({ where: { userId } }),
      ),
      withRetry(() =>
        prisma.practiceTest.findFirst({
          where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
          orderBy: { completedAt: "desc" },
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
      loadStudyStreakDays(userId).catch(() => 0),
    ]);

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

    return {
      totalQuestionsAnswered: totalAttempted > 0 ? totalAttempted : studySessionCount,
      overallAccuracyPct,
      streakDays,
      latestReadinessScore,
      latestReadinessBand,
      catSessionCount,
      studySessionCount,
    };
  } catch {
    return empty;
  }
}

/**
 * Load the initial readiness trend window (last 10 CAT sessions).
 * Used for initial page render. Older history fetched via Server Action.
 */
export async function loadReadinessTrend(
  userId: string,
  limit = 10,
): Promise<{ points: ReadinessTrendPoint[]; hasMore: boolean; cursor: string | null }> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return { points: [], hasMore: false, cursor: null };
  }

  try {
    const rows = await withRetry(() =>
      prisma.practiceTest.findMany({
        where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: limit + 1,
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
    return { points, hasMore, cursor };
  } catch {
    return { points: [], hasMore: false, cursor: null };
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
): Promise<{ points: ReadinessTrendPoint[]; hasMore: boolean; cursor: string | null }> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return { points: [], hasMore: false, cursor: null };
  }

  try {
    const rows = await withRetry(() =>
      prisma.practiceTest.findMany({
        where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        cursor: { id: afterId },
        skip: 1,
        take: limit + 1,
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
    return { points, hasMore, cursor };
  } catch {
    return { points: [], hasMore: false, cursor: null };
  }
}

/**
 * Aggregate confidence patterns from recent ExamAttempt sessions.
 * Reads last 20 sessions, parses results JSON.
 */
export async function loadConfidencePatterns(
  userId: string,
  sessionLimit = 20,
): Promise<ConfidencePatternSummary> {
  const empty: ConfidencePatternSummary = {
    overconfidentErrors: 0,
    uncertainCorrect: 0,
    stableMastery: 0,
    totalRated: 0,
    highConfidenceAccuracy: null,
    sessionsAnalyzed: 0,
  };

  if (!userId || !isDatabaseUrlConfigured()) return empty;

  try {
    const sessions = await withRetry(() =>
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: sessionLimit,
        select: { results: true },
      }),
    );

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

    return {
      overconfidentErrors,
      uncertainCorrect,
      stableMastery,
      totalRated,
      highConfidenceAccuracy: highTotal > 0 ? highCorrect / highTotal : null,
      sessionsAnalyzed: sessions.length,
    };
  } catch {
    return empty;
  }
}

/**
 * Load time metrics from recent PracticeTest sessions.
 * Uses PracticeTest.elapsedMs (actual DB field).
 */
export async function loadTimeMetrics(
  userId: string,
  sessionLimit = 10,
): Promise<TimeMetrics> {
  const empty: TimeMetrics = {
    avgMsPerQuestion: null,
    avgSessionDurationMs: null,
    rushSessions: 0,
    deepStudySessions: 0,
    sessionsAnalyzed: 0,
    minSessionMs: null,
    maxSessionMs: null,
  };

  if (!userId || !isDatabaseUrlConfigured()) return empty;

  try {
    const sessions = await withRetry(() =>
      prisma.practiceTest.findMany({
        where: {
          userId,
          status: PracticeTestStatus.COMPLETED,
          elapsedMs: { not: null },
        },
        orderBy: { completedAt: "desc" },
        take: sessionLimit,
        select: { elapsedMs: true, results: true },
      }),
    );

    if (sessions.length === 0) return empty;

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

    return {
      avgMsPerQuestion: totalQs > 0 ? Math.round(totalMs / totalQs) : null,
      avgSessionDurationMs: sessions.length > 0 ? Math.round(totalMs / sessions.length) : null,
      rushSessions,
      deepStudySessions,
      sessionsAnalyzed: sessions.length,
      minSessionMs: minMs,
      maxSessionMs: maxMs,
    };
  } catch {
    return empty;
  }
}

/**
 * Load topic accuracy breakdown from UserTopicStat.
 * Returns the 15 most recently updated topics with sufficient data.
 */
export async function loadTopicBreakdown(
  userId: string,
  limit = 15,
): Promise<TopicRow[]> {
  if (!userId || !isDatabaseUrlConfigured()) return [];

  try {
    const rows = await withRetry(() =>
      prisma.userTopicStat.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: limit,
        select: { topic: true, correctCount: true, wrongCount: true },
      }),
    );

    return rows
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
      .sort((a, b) => b.totalCount - a.totalCount);
  } catch {
    return [];
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
  const [summary, trendResult] = await Promise.all([
    loadAnalyticsSummary(userId),
    loadReadinessTrend(userId, 10),
  ]);

  return {
    summary,
    trendWindow: trendResult.points,
    hasMorTrend: trendResult.hasMore,
    trendCursor: trendResult.cursor,
  };
}

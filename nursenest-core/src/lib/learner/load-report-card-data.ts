import "server-only";

import { getLearnerDurabilityObservabilityFields, shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { ExamSessionStatus, PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { buildVisibleLessonScopeForLearner } from "@/lib/learner/learner-visible-lesson-scope";
import { computeReadiness } from "@/lib/learner/readiness-score";
import {
  buildPathwayStudySummariesFromLessonInventory,
  loadLearnerDashboard,
  loadLearnerDashboardCore,
  loadPathwayLessonProgressBundle,
  mapExamAttemptRowsToRecentMocks,
  type RecentMock,
} from "@/lib/learner/load-learner-dashboard";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  gradeBankSessionWithTierBreakdown,
  loadBatchedBankGradingQuestionMap,
  type BankGradingQuestionRow,
  type SessionGradingAggregate,
} from "@/lib/learner/session-grading-aggregate";
import {
  computePeerComparison,
  bestReportCardComparisonArgs,
  type PeerComparisonResult,
} from "@/lib/study/benchmarking/peer-comparison-service";

export type TierAccuracyBucket = {
  tierKey: string;
  displayLabel: string;
  correct: number;
  total: number;
  accuracyPct: number | null;
};

export type MockTierSummary = {
  tierKey: string;
  displayLabel: string;
  sumScore: number;
  sumTotal: number;
  attempts: number;
  accuracyPct: number | null;
};

export type PathwayLessonSummary = {
  pathwayId: string;
  shortLabel: string;
  lessonsPct: number;
  lessonsCompleted: number;
  lessonsTotal: number;
};

export type RecentBankSessionRow = {
  id: string;
  updatedAt: Date;
  examMode: string;
  examTitle: string | null;
  correct: number;
  total: number;
  accuracyPct: number | null;
};

export type RecentPracticeTestRow = {
  id: string;
  title: string | null;
  completedAt: Date;
  accuracyPct: number | null;
  scoreTotal: number;
  isCat: boolean;
  pathwayLabel: string | null;
};

export type MockWeeklyTrendPoint = {
  weekStart: string;
  avgPct: number;
  attempts: number;
};

export type ReportCardData = {
  scopeTier: string | null;
  scopeCountry: string | null;
  /** Computed readiness from the dashboard pipeline — null when insufficient data. */
  readiness: ReadinessResult;
  /** Graded items from recent completed bank/exam sessions (tier-scoped). */
  bankGraded: { correct: number; total: number; sessionCount: number; accuracyPct: number | null };
  /** Weighted mock accuracy across recent attempts. */
  mockAggregate: { sumScore: number; sumTotal: number; attempts: number; accuracyPct: number | null };
  byQuestionTier: TierAccuracyBucket[];
  mockByExamTier: MockTierSummary[];
  pathways: PathwayLessonSummary[];
  weakTopics: WeakTopicRow[];
  strongTopics: WeakTopicRow[];
  topicTrends: TopicTrendRow[];
  recentBankSessions: RecentBankSessionRow[];
  recentMocks: RecentMock[];
  recentPracticeTests: RecentPracticeTestRow[];
  mockWeeklyTrend: MockWeeklyTrendPoint[];
  trendEligible: boolean;
  continueLesson: { title: string; href: string } | null;
  recommendedQuizTopic: string | null;
  /** Detailed mock rows for the report log table. */
  mockLog: Array<{ id: string; examTitle: string; score: number; total: number; pct: number; createdAt: Date }>;
  /**
   * Peer comparison result for the most meaningful available context:
   * CAT readiness score → linear practice accuracy → overall question bank.
   * Null when DB not configured or no score is available to compare.
   */
  peerBenchmark: PeerComparisonResult | null;
};

/** Enough recent mocks for tier splits, weekly trend (~10w), and mock log — single bounded query. */
const MOCK_ATTEMPT_LIMIT_FULL = 60;
/**
 * Degraded: smaller slice so mock hydration + in-memory trend math stay light; still enough for aggregates + a short log.
 */
const MOCK_ATTEMPT_LIMIT_DEGRADED = 28;
/** Graded bank sessions for tier breakdown + recent list; one batched question map shared with dashboard readiness. */
const SESSION_LIMIT = 12;
/** Matches {@link loadSessionGradingAggregate} default — first N rows feed dashboard preload (no duplicate session fetch). */
const DASHBOARD_SESSION_GRADING_LIMIT = 8;
/** Recent bank rows rendered in the report card UI (session list is capped; totals use {@link SESSION_LIMIT}). */
const RECENT_BANK_SESSIONS_UI = 8;
const TREND_WEEKS = 10;

function mockAttemptTakeForReportCard(degraded: boolean): number {
  return degraded ? MOCK_ATTEMPT_LIMIT_DEGRADED : MOCK_ATTEMPT_LIMIT_FULL;
}

/** Ops / incidents: skip cohort SQL while keeping the rest of the report card. */
function skipReportCardPeerBenchmarkByEnv(): boolean {
  const v = process.env.NN_SKIP_REPORT_CARD_PEER_BENCHMARK?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function reportCardTierDisplayLabel(tier: string): string {
  switch (tier) {
    case "RN":
      return "RN (NCLEX-RN)";
    case "RPN":
      return "RPN / Practical nursing";
    case "LVN_LPN":
      return "LPN / LVN";
    case "NP":
      return "NP (advanced practice)";
    case "ALLIED":
      return "Allied health";
    case "UNKNOWN":
      return "Mixed / unscoped";
    default:
      return tier.replace(/_/g, " ");
  }
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function weekStartMondayUtc(d: Date): string {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay();
  const diff = (day + 6) % 7;
  x.setUTCDate(x.getUTCDate() - diff);
  return ymd(x);
}

type MockAttemptSelect = {
  id: string;
  score: number;
  total: number;
  createdAt: Date;
  exam: { tier: string; title: string };
};

type BuildMockSlicesOptions = {
  /**
   * Off in durability-degraded report card: skips weekly bucket math + long mock log (secondary chart / table).
   * Tier splits + aggregate + short log still run so the page stays truthful.
   */
  includeWeeklyTrend?: boolean;
  /** Max rows for mock log table; degraded uses a shorter slice. */
  mockLogTake?: number;
};

/** Shared mock-tier / weekly / log math from the bounded `examAttempt` query (core path + full path). */
function buildMockReportSlices(
  mockAttempts: MockAttemptSelect[],
  options?: BuildMockSlicesOptions,
): {
  mockByExamTier: MockTierSummary[];
  mockAggregate: ReportCardData["mockAggregate"];
  mockLog: ReportCardData["mockLog"];
  mockWeeklyTrend: MockWeeklyTrendPoint[];
  trendEligible: boolean;
} {
  const includeWeeklyTrend = options?.includeWeeklyTrend !== false;
  const mockLogTake = Math.min(30, Math.max(0, options?.mockLogTake ?? 30));

  const mockByTierMap = new Map<string, { sumScore: number; sumTotal: number; n: number }>();
  let mockSumScore = 0;
  let mockSumTotal = 0;
  for (const a of mockAttempts) {
    if (a.total <= 0) continue;
    mockSumScore += a.score;
    mockSumTotal += a.total;
    const k = String(a.exam.tier);
    const cur = mockByTierMap.get(k) ?? { sumScore: 0, sumTotal: 0, n: 0 };
    cur.sumScore += a.score;
    cur.sumTotal += a.total;
    cur.n += 1;
    mockByTierMap.set(k, cur);
  }

  const mockByExamTier: MockTierSummary[] = [...mockByTierMap.entries()]
    .map(([tierKey, v]) => ({
      tierKey,
      displayLabel: reportCardTierDisplayLabel(tierKey),
      sumScore: v.sumScore,
      sumTotal: v.sumTotal,
      attempts: v.n,
      accuracyPct: v.sumTotal > 0 ? Math.round((v.sumScore / v.sumTotal) * 100) : null,
    }))
    .sort((a, b) => b.sumTotal - a.sumTotal);

  let mockWeeklyTrend: MockWeeklyTrendPoint[] = [];
  let trendEligible = false;
  if (includeWeeklyTrend) {
    const mockWeekly = new Map<string, { sumScore: number; sumTotal: number; n: number }>();
    const cutoff = new Date(Date.now() - TREND_WEEKS * 7 * 86400000);
    for (const a of mockAttempts) {
      if (a.createdAt < cutoff || a.total <= 0) continue;
      const wk = weekStartMondayUtc(a.createdAt);
      const cur = mockWeekly.get(wk) ?? { sumScore: 0, sumTotal: 0, n: 0 };
      cur.sumScore += a.score;
      cur.sumTotal += a.total;
      cur.n += 1;
      mockWeekly.set(wk, cur);
    }
    mockWeeklyTrend = [...mockWeekly.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, v]) => ({
        weekStart,
        avgPct: v.sumTotal > 0 ? Math.round((v.sumScore / v.sumTotal) * 100) : 0,
        attempts: v.n,
      }));
    trendEligible = mockWeeklyTrend.filter((p) => p.attempts > 0).length >= 2;
  }

  const mockLog = mockAttempts.slice(0, mockLogTake).map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    createdAt: a.createdAt,
  }));

  const mockAggregate = {
    sumScore: mockSumScore,
    sumTotal: mockSumTotal,
    attempts: mockAttempts.filter((a) => a.total > 0).length,
    accuracyPct: mockSumTotal > 0 ? Math.round((mockSumScore / mockSumTotal) * 100) : null,
  };

  return { mockByExamTier, mockAggregate, mockLog, mockWeeklyTrend, trendEligible };
}

/**
 * Aggregates learner performance for the premium Report Card (bank sessions, mocks, topics, pathways).
 * Omits or nulls metrics when underlying counts are zero — callers should show honest empty states.
 *
 * **Load phases (see `load-learner-dashboard` module header):**
 * - **Core:** pathway bundle + visible scope + bounded mock attempts + `loadLearnerDashboardCore` + pathway rows from inventory (degraded), or full dashboard + summaries (normal).
 * - **Practice hydration (normal only):** exam sessions + practice tests + batched question map + session grading preload.
 * - **Analytics (normal, inside dashboard):** topic performance + bank grading aggregate.
 * - **Peer comparison (normal only):** optional benchmark from practice rows; skipped when `NN_SKIP_REPORT_CARD_PEER_BENCHMARK` is set.
 */
export async function loadReportCardData(userId: string, entitlement: AccessScope): Promise<ReportCardData | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const skipHeavy = shouldSkipNonCriticalLearnerWork();
  const mockAttemptCap = mockAttemptTakeForReportCard(skipHeavy);
  const tRoute = performance.now();

  const bundle = await loadPathwayLessonProgressBundle(userId, entitlement, { source: "loadReportCardData" });
  if (!bundle) return null;

  /** Parallel: visible scope (CPU) + bounded mock attempts (single Prisma round-trip). */
  const tScopeMocks = performance.now();
  const [visibleLessonScope, mockAttempts] = await Promise.all([
    buildVisibleLessonScopeForLearner(entitlement, bundle.pathwayLessonRows),
    prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: mockAttemptCap,
      select: {
        id: true,
        score: true,
        total: true,
        createdAt: true,
        exam: { select: { tier: true, title: true } },
      },
    }),
  ]);
  const durationMsScopeAndMocks = Math.round(performance.now() - tScopeMocks);

  const mockSlices = buildMockReportSlices(
    mockAttempts,
    skipHeavy ? { includeWeeklyTrend: false, mockLogTake: 12 } : undefined,
  );

  if (skipHeavy) {
    const tCore = performance.now();
    const core = await loadLearnerDashboardCore(userId, entitlement, {
      source: "loadReportCardData",
      userProfile: bundle.user,
      visibleLessonScope,
      pathwayRowsForScope: bundle.pathwayLessonRows,
      pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
      pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
      recentMocksPreload: mapExamAttemptRowsToRecentMocks(mockAttempts.slice(0, 5)),
    });
    const durationMsDashboardCore = Math.round(performance.now() - tCore);
    if (!core) return null;

    const tPath = performance.now();
    const pathwayRaw = buildPathwayStudySummariesFromLessonInventory(
      entitlement,
      bundle.pathwayLessonRows,
      bundle.pathwayProgressScoped,
    );
    const durationMsPathwaySummaries = Math.round(performance.now() - tPath);

    const readiness = computeReadiness({
      practiceCorrect: 0,
      practiceTotal: 0,
      recentMocks: core.recentMocks.map((m) => ({ score: m.score, total: m.total })),
      weakTopics: [],
      lessonsCompleted: core.lessonsCompleted,
      lessonsAvailable: core.lessonsAvailable,
      scope: core.scope,
    });

    const pathways: PathwayLessonSummary[] = pathwayRaw.map((p) => ({
      pathwayId: p.pathwayId,
      shortLabel: p.shortLabel,
      lessonsTotal: p.lessonsTotal,
      lessonsCompleted: p.lessonsCompleted,
      lessonsPct: p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0,
    }));

    safeServerLog("learner_report_card", "report_card_load_phases", {
      userIdPrefix: userId.slice(0, 8),
      degraded: true,
      mockAttemptCap,
      durationMsTotal: Math.round(performance.now() - tRoute),
      durationMsScopeAndMocks,
      durationMsDashboardCore,
      durationMsPathwaySummaries,
      skippedAnalytics: true,
      skippedPracticeHydration: true,
      skippedPeerComparison: true,
      skippedFullDashboardLoader: true,
      skippedMockWeeklyTrend: true,
      ...getLearnerDurabilityObservabilityFields(),
    });

    return {
      scopeTier: core.scope.tier,
      scopeCountry: core.scope.country,
      readiness,
      bankGraded: { correct: 0, total: 0, sessionCount: 0, accuracyPct: null },
      mockAggregate: mockSlices.mockAggregate,
      byQuestionTier: [],
      mockByExamTier: mockSlices.mockByExamTier,
      pathways,
      weakTopics: [],
      strongTopics: [],
      topicTrends: [],
      recentBankSessions: [],
      recentMocks: core.recentMocks,
      recentPracticeTests: [],
      mockWeeklyTrend: mockSlices.mockWeeklyTrend,
      trendEligible: mockSlices.trendEligible,
      continueLesson: core.continueLesson ? { title: core.continueLesson.title, href: core.continueLesson.href } : null,
      recommendedQuizTopic: null,
      mockLog: mockSlices.mockLog,
      peerBenchmark: null,
    };
  }

  /**
   * Normal: hydrate bank sessions + practice tests before the dashboard so we can (a) batch-load questions once,
   * (b) feed {@link loadLearnerDashboard} with `sessionGradingPreload`, and (c) align readiness grading with bank panels.
   */
  const tHydration = performance.now();
  const [sessions, practiceRows] = await Promise.all([
    prisma.examSession.findMany({
      where: { userId, status: ExamSessionStatus.COMPLETED },
      orderBy: { updatedAt: "desc" },
      take: SESSION_LIMIT,
      select: {
        id: true,
        questionIds: true,
        answers: true,
        updatedAt: true,
        examMode: true,
        exam: { select: { title: true } },
      },
    }),
    prisma.practiceTest.findMany({
      where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 8,
      select: { id: true, title: true, completedAt: true, results: true, config: true },
    }),
  ]);
  const durationMsPracticeHydration = Math.round(performance.now() - tHydration);

  const allSessionIds: string[] = [];
  for (const s of sessions) {
    const { ids } = sanitizeSessionQuestionIds(s.questionIds);
    allSessionIds.push(...ids);
  }
  const qById: Map<string, BankGradingQuestionRow> = await loadBatchedBankGradingQuestionMap(allSessionIds, entitlement);

  /** Pathway table rows: same inventory math as {@link loadPathwayStudySummaries} with bundle preloads (no extra Prisma). */
  const pathwayRaw = buildPathwayStudySummariesFromLessonInventory(
    entitlement,
    bundle.pathwayLessonRows,
    bundle.pathwayProgressScoped,
  );

  const tierTotals = new Map<string, { c: number; t: number }>();
  const recentBankSessions: RecentBankSessionRow[] = [];
  let bankCorrect = 0;
  let bankTotal = 0;
  let preloadCorrect = 0;
  let preloadTotal = 0;

  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i]!;
    const { correct, total, byTier } = gradeBankSessionWithTierBreakdown(s.questionIds, s.answers, qById);
    bankCorrect += correct;
    bankTotal += total;
    if (i < DASHBOARD_SESSION_GRADING_LIMIT) {
      preloadCorrect += correct;
      preloadTotal += total;
    }
    for (const [tier, v] of byTier) {
      const cur = tierTotals.get(tier) ?? { c: 0, t: 0 };
      cur.c += v.c;
      cur.t += v.t;
      tierTotals.set(tier, cur);
    }
    if (recentBankSessions.length < RECENT_BANK_SESSIONS_UI) {
      recentBankSessions.push({
        id: s.id,
        updatedAt: s.updatedAt,
        examMode: s.examMode,
        examTitle: s.exam?.title ?? null,
        correct,
        total,
        accuracyPct: total > 0 ? Math.round((correct / total) * 100) : null,
      });
    }
  }

  let sessionGradingPreload: SessionGradingAggregate | undefined;
  if (sessions.length > 0) {
    const n = Math.min(sessions.length, DASHBOARD_SESSION_GRADING_LIMIT);
    sessionGradingPreload = { correct: preloadCorrect, total: preloadTotal, sessionCount: n };
  }

  const tDashPath = performance.now();
  const dash = await loadLearnerDashboard(userId, entitlement, {
    source: "loadReportCardData",
    userProfile: bundle.user,
    visibleLessonScope,
    pathwayRowsForScope: bundle.pathwayLessonRows,
    pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
    pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
    recentMocksPreload: mapExamAttemptRowsToRecentMocks(mockAttempts.slice(0, 5)),
    sessionGradingPreload,
  });
  const durationMsDashboardAndPathways = Math.round(performance.now() - tDashPath);
  if (!dash) return null;

  const pathwayOptions = listPathwaysCompatibleWithSubscription(entitlement);
  const pathwayLabelById = new Map(pathwayOptions.map((p) => [p.id, p.shortName || p.displayName]));

  /** Same SESSION_LIMIT window as tier + recent list — avoids mismatch with dashboard sessionGrading (8). */
  const bankGraded = {
    correct: bankCorrect,
    total: bankTotal,
    sessionCount: sessions.length,
    accuracyPct: bankTotal > 0 ? Math.round((bankCorrect / bankTotal) * 100) : null,
  };

  const byQuestionTier: TierAccuracyBucket[] = [...tierTotals.entries()]
    .map(([tierKey, v]) => ({
      tierKey,
      displayLabel: reportCardTierDisplayLabel(tierKey),
      correct: v.c,
      total: v.t,
      accuracyPct: v.t > 0 ? Math.round((v.c / v.t) * 100) : null,
    }))
    .filter((b) => b.total > 0)
    .sort((a, b) => b.total - a.total);

  const {
    mockByExamTier,
    mockAggregate,
    mockLog,
    mockWeeklyTrend,
    trendEligible,
  } = mockSlices;

  const pathways: PathwayLessonSummary[] = pathwayRaw.map((p) => ({
    pathwayId: p.pathwayId,
    shortLabel: p.shortLabel,
    lessonsTotal: p.lessonsTotal,
    lessonsCompleted: p.lessonsCompleted,
    lessonsPct: p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0,
  }));

  // Enriched practice test rows — includes pathwayId, CAT readiness score, and exam config
  // for use by both the display list and the peer comparison service.
  type EnrichedPracticeTestRow = RecentPracticeTestRow & {
    pathwayId: string | null;
    catReadinessScore: number | null;
    examConfigId: string | null;
  };

  const enrichedPracticeTests: EnrichedPracticeTestRow[] = practiceRows.map((row) => {
    const cfg = row.config as PracticeTestConfigJson | null;
    const res = row.results as PracticeTestResultsJson | null;
    const isCat = cfg?.selectionMode === "cat";
    const pid = cfg?.pathwayId ?? null;
    const accuracyPct =
      res && typeof res.accuracyPct === "number" && Number.isFinite(res.accuracyPct)
        ? Math.round(res.accuracyPct)
        : res && res.scoreTotal > 0
          ? Math.round((res.scoreCorrect / res.scoreTotal) * 100)
          : null;
    const catReadinessScore =
      isCat && res?.catReport?.readinessScore != null
        ? Math.round(res.catReport.readinessScore)
        : null;
    return {
      id: row.id,
      title: row.title,
      completedAt: row.completedAt!,
      accuracyPct,
      scoreTotal: res?.scoreTotal ?? 0,
      isCat,
      pathwayLabel: pid ? pathwayLabelById.get(pid) ?? null : null,
      pathwayId: pid,
      catReadinessScore,
      examConfigId: cfg?.catExamConfigId ?? null,
    };
  });

  const recentPracticeTests: RecentPracticeTestRow[] = enrichedPracticeTests.map((row) => ({
    id: row.id,
    title: row.title,
    completedAt: row.completedAt,
    accuracyPct: row.accuracyPct,
    scoreTotal: row.scoreTotal,
    isCat: row.isCat,
    pathwayLabel: row.pathwayLabel,
  }));

  // Peer benchmark: best available comparison context (CAT → practice → overall)
  const preferredPathwayId =
    pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? pathways[0]?.pathwayId ?? null;
  const skipPeerBenchmark = skipReportCardPeerBenchmarkByEnv();
  let peerBenchmark: PeerComparisonResult | null = null;
  if (!skipPeerBenchmark) {
    const peerComparisonArgs = bestReportCardComparisonArgs({
      userId,
      recentPracticeTests: enrichedPracticeTests,
      overallAccuracyPct: bankGraded.accuracyPct,
      preferredPathwayId,
    });
    peerBenchmark = await computePeerComparison(peerComparisonArgs).catch(() => null);
  }

  safeServerLog("learner_report_card", "report_card_load_phases", {
    userIdPrefix: userId.slice(0, 8),
    degraded: false,
    mockAttemptCap,
    peerBenchmarkSkipped: skipPeerBenchmark,
    durationMsTotal: Math.round(performance.now() - tRoute),
    durationMsScopeAndMocks,
    durationMsPracticeHydration,
    durationMsDashboardAndPathways,
    ...getLearnerDurabilityObservabilityFields(),
  });

  return {
    scopeTier: dash.scope.tier,
    scopeCountry: dash.scope.country,
    readiness: dash.readiness,
    bankGraded,
    mockAggregate,
    byQuestionTier,
    mockByExamTier,
    pathways,
    weakTopics: dash.weakTopics.slice(0, 10),
    strongTopics: dash.strongTopics.slice(0, 10),
    topicTrends: dash.topicTrends.slice(0, 8),
    recentBankSessions,
    recentMocks: dash.recentMocks,
    recentPracticeTests,
    mockWeeklyTrend,
    trendEligible,
    continueLesson: dash.continueLesson ? { title: dash.continueLesson.title, href: dash.continueLesson.href } : null,
    recommendedQuizTopic: dash.recommendedQuizTopic,
    mockLog,
    peerBenchmark: peerBenchmark ?? null,
  };
}

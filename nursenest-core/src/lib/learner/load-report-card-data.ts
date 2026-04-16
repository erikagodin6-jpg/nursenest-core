import "server-only";

import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { ExamSessionStatus, PracticeTestStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { answerMatches } from "@/lib/exams/score-session-answers";
import { sanitizeSessionQuestionIds } from "@/lib/exams/exam-session-bounds";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { buildVisibleLessonScopeForLearner } from "@/lib/learner/learner-visible-lesson-scope";
import {
  loadLearnerDashboard,
  loadPathwayLessonProgressBundle,
  loadPathwayStudySummaries,
  mapExamAttemptRowsToRecentMocks,
  type RecentMock,
} from "@/lib/learner/load-learner-dashboard";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
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

const MOCK_ATTEMPT_LIMIT = 80;
const SESSION_LIMIT = 18;
const TREND_WEEKS = 10;

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

type QRow = {
  id: string;
  tier: string;
  questionType: string;
  correctAnswer: Prisma.JsonValue;
};

async function loadQuestionMap(ids: string[], entitlement: AccessScope): Promise<Map<string, QRow>> {
  const baseWhere = questionAccessWhere(entitlement);
  const uniq = [...new Set(ids)].filter(Boolean);
  if (uniq.length === 0) return new Map();
  const CHUNK = 400;
  const map = new Map<string, QRow>();
  for (let i = 0; i < uniq.length; i += CHUNK) {
    const chunk = uniq.slice(i, i + CHUNK);
    const rows = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: chunk } }, baseWhere] },
      select: { id: true, tier: true, questionType: true, correctAnswer: true },
    });
    for (const r of rows) map.set(r.id, r);
  }
  return map;
}

function gradeSessionAgainstMap(
  questionIds: unknown,
  answers: unknown,
  qById: Map<string, QRow>,
): { correct: number; total: number; byTier: Map<string, { c: number; t: number }> } {
  const sanitized = sanitizeSessionQuestionIds(questionIds);
  const ids = sanitized.ids;
  const ans =
    typeof answers === "object" && answers !== null && !Array.isArray(answers)
      ? (answers as Record<string, unknown>)
      : {};
  let correct = 0;
  let total = 0;
  const byTier = new Map<string, { c: number; t: number }>();
  for (const id of ids) {
    const q = qById.get(id);
    if (!q) continue;
    total += 1;
    const ok = answerMatches(q.questionType, q.correctAnswer, ans[id]);
    if (ok) correct += 1;
    const tier = q.tier?.trim() || "UNKNOWN";
    const cur = byTier.get(tier) ?? { c: 0, t: 0 };
    cur.t += 1;
    if (ok) cur.c += 1;
    byTier.set(tier, cur);
  }
  return { correct, total, byTier };
}

/**
 * Aggregates learner performance for the premium Report Card (bank sessions, mocks, topics, pathways).
 * Omits or nulls metrics when underlying counts are zero — callers should show honest empty states.
 *
 * **Pathway catalog:** one {@link loadPathwayLessonProgressBundle} per request; `loadPathwayStudySummaries` and
 * `loadLearnerDashboard` use preloads derived from that bundle (no duplicate pathway inventory User read).
 */
export async function loadReportCardData(userId: string, entitlement: AccessScope): Promise<ReportCardData | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const bundle = await loadPathwayLessonProgressBundle(userId, entitlement, { source: "loadReportCardData" });
  if (!bundle) return null;

  const visibleLessonScope = await buildVisibleLessonScopeForLearner(entitlement, bundle.pathwayLessonRows);

  /** One graded-mock query for both dashboard “recent five” and report analytics (avoids duplicate findMany). */
  const mockAttempts = await prisma.examAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MOCK_ATTEMPT_LIMIT,
    select: {
      id: true,
      score: true,
      total: true,
      createdAt: true,
      exam: { select: { tier: true, title: true } },
    },
  });

  const dash = await loadLearnerDashboard(userId, entitlement, {
    source: "loadReportCardData",
    userProfile: bundle.user,
    visibleLessonScope,
    pathwayRowsForScope: bundle.pathwayLessonRows,
    pathwayMetadataRowCount: bundle.pathwayLessonRows.length,
    pathwayProgressRowCount: bundle.pathwayProgressScoped.length,
    recentMocksPreload: mapExamAttemptRowsToRecentMocks(mockAttempts.slice(0, 5)),
  });
  if (!dash) return null;

  const pathwayOptions = listPathwaysCompatibleWithSubscription(entitlement);
  const pathwayLabelById = new Map(pathwayOptions.map((p) => [p.id, p.shortName || p.displayName]));

  const [pathwayRaw, sessions, practiceRows] = await Promise.all([
    loadPathwayStudySummaries(userId, entitlement, {
      lessonRows: bundle.pathwayLessonRows,
      pathwayProgress: bundle.pathwayProgressScoped,
      learnerPath: bundle.user.learnerPath,
    }),
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

  const allSessionIds: string[] = [];
  for (const s of sessions) {
    const { ids } = sanitizeSessionQuestionIds(s.questionIds);
    allSessionIds.push(...ids);
  }
  const qById = await loadQuestionMap(allSessionIds, entitlement);

  const tierTotals = new Map<string, { c: number; t: number }>();
  const recentBankSessions: RecentBankSessionRow[] = [];

  for (const s of sessions) {
    const { correct, total, byTier } = gradeSessionAgainstMap(s.questionIds, s.answers, qById);
    for (const [tier, v] of byTier) {
      const cur = tierTotals.get(tier) ?? { c: 0, t: 0 };
      cur.c += v.c;
      cur.t += v.t;
      tierTotals.set(tier, cur);
    }
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
  const mockLog = mockAttempts.slice(0, 30).map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    createdAt: a.createdAt,
  }));

  const mockWeeklyTrend: MockWeeklyTrendPoint[] = [...mockWeekly.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, v]) => ({
      weekStart,
      avgPct: v.sumTotal > 0 ? Math.round((v.sumScore / v.sumTotal) * 100) : 0,
      attempts: v.n,
    }));
  const trendEligible = mockWeeklyTrend.filter((p) => p.attempts > 0).length >= 2;

  const pathways: PathwayLessonSummary[] = pathwayRaw.map((p) => ({
    pathwayId: p.pathwayId,
    shortLabel: p.shortLabel,
    lessonsTotal: p.lessonsTotal,
    lessonsCompleted: p.lessonsCompleted,
    lessonsPct: p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0,
  }));

  const sg = dash.sessionGrading;
  const bankGraded = {
    correct: sg.correct,
    total: sg.total,
    sessionCount: sg.sessionCount,
    accuracyPct: sg.total > 0 ? Math.round((sg.correct / sg.total) * 100) : null,
  };

  const mockAggregate = {
    sumScore: mockSumScore,
    sumTotal: mockSumTotal,
    attempts: mockAttempts.filter((a) => a.total > 0).length,
    accuracyPct: mockSumTotal > 0 ? Math.round((mockSumScore / mockSumTotal) * 100) : null,
  };

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

  const recentPracticeTests: RecentPracticeTestRow[] = enrichedPracticeTests;

  // Peer benchmark: best available comparison context (CAT → practice → overall)
  const preferredPathwayId =
    pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? pathways[0]?.pathwayId ?? null;
  const peerComparisonArgs = bestReportCardComparisonArgs({
    userId,
    recentPracticeTests: enrichedPracticeTests,
    overallAccuracyPct: bankGraded.accuracyPct,
    preferredPathwayId,
  });
  const peerBenchmark = shouldSkipNonCriticalLearnerWork()
    ? null
    : await computePeerComparison(peerComparisonArgs).catch(() => null);

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
    recentBankSessions: recentBankSessions.slice(0, 8),
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

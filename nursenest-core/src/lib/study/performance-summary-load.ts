import type { ReadinessBand as CatReadinessBand } from "@/components/study/cat-readiness-hero";
import type { ReadinessBand as LearnerReadinessBand } from "@/lib/learner/readiness-score";
import type { ReadinessTrend } from "@/lib/learner/readiness-score";
import { computePassReadinessForecast } from "@/lib/study/pass-readiness-forecast";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";
import {
  loadAnalyticsDbSupplemental,
  loadAnalyticsSummary,
  loadBodySystemAccuracyBreakdown,
  loadItemLevelAverageResponseTimeMs,
  loadReadinessTrend,
  loadRecentAttemptQuestionTagCoverage,
  loadTimeMetrics,
  loadTopicBreakdown,
  type BodySystemAccuracyRow,
  type ReadinessTrendPoint,
  type RecentQuestionTagCoverage,
  type TopicRow,
} from "@/lib/study/analytics-data";

export type PerformanceSummaryWeakArea = {
  topic: string;
  accuracyPct: number;
  totalCount: number;
};

export type UserPerformanceSummaryPayload = {
  generatedAt: string;
  accuracyByBodySystem: BodySystemAccuracyRow[];
  accuracyByTopic: TopicRow[];
  averageResponseTimeMs: number | null;
  averageResponseTimeSource: "item_level" | "practice_test_session" | "db_supplemental" | "none";
  weakAreas: PerformanceSummaryWeakArea[];
  passProbability: {
    /** Point estimate 0–100, or null if insufficient signals. */
    percent: number | null;
    displayRange: string | null;
    band: string;
    interpretation: string;
  };
  speed: {
    /** True when average time per question exceeds a conservative study threshold. */
    isSlowResponder: boolean;
    thresholdMsPerQuestion: number;
    itemLevelTimedSamples: number;
  };
  recentQuestionTagCoverage: RecentQuestionTagCoverage | null;
  integration: {
    questionBankSessionPath: string;
    /** Query params understood by `question-bank-practice-client` (topic drill + efficiency). */
    customQuizParams: {
      preset: "topic_drill";
      topic: string;
      sessionSize: string;
      difficultyBand: string;
    };
    quickFilters: {
      weakStudyMode: { studyMode: "weak"; description: string };
      incorrectOnly: { description: string; clientControlled: true };
    };
  };
  loadWarnings: string[];
};

const SLOW_RESPONDER_MS = 120_000;

function mapCatBandToLearnerBand(b: CatReadinessBand | null): LearnerReadinessBand | null {
  if (!b) return null;
  if (b === "exam_ready") return "ready";
  if (b === "approaching") return "near_ready";
  if (b === "building") return "improving";
  return "not_ready";
}

function trendFromReadinessPoints(scores: number[]): ReadinessTrend | null {
  if (scores.length < 4) return null;
  const first = scores.slice(0, Math.min(2, scores.length));
  const last = scores.slice(-Math.min(2, scores.length));
  const a = first.reduce((s, x) => s + x, 0) / first.length;
  const b = last.reduce((s, x) => s + x, 0) / last.length;
  const d = b - a;
  if (d > 4) return "improving";
  if (d < -4) return "declining";
  return "stable";
}

function pickWeakAreasFromTopics(rows: TopicRow[], limit = 3): PerformanceSummaryWeakArea[] {
  const eligible = rows
    .filter((r) => r.totalCount >= 3)
    .map((r) => ({
      topic: r.topic,
      accuracyPct: r.accuracyPct,
      totalCount: r.totalCount,
    }))
    .sort((x, y) => x.accuracyPct - y.accuracyPct || y.totalCount - x.totalCount);
  return eligible.slice(0, limit);
}

/**
 * Bounded learner performance rollup for UWorld-style analytics consumers.
 * Reuses analytics loaders; does not touch CAT runtime or lesson routes.
 */
export async function loadUserPerformanceSummary(userId: string): Promise<UserPerformanceSummaryPayload> {
  const warnings: string[] = [];

  const [
    summaryRes,
    topicsRes,
    timeRes,
    dbSupRes,
    bodyRes,
    itemTimeRes,
    trendRes,
    tagCovRes,
  ] = await Promise.all([
    loadAnalyticsSummary(userId),
    loadTopicBreakdown(userId, 24),
    loadTimeMetrics(userId, 10),
    loadAnalyticsDbSupplemental(userId),
    loadBodySystemAccuracyBreakdown(userId, 40),
    loadItemLevelAverageResponseTimeMs(userId, 45, 5),
    loadReadinessTrend(userId, 10),
    loadRecentAttemptQuestionTagCoverage(userId, 40),
  ]);

  if (summaryRes.kind !== "ok" && summaryRes.kind !== "degraded") warnings.push("summary");
  if (topicsRes.kind !== "ok" && topicsRes.kind !== "degraded") warnings.push("topics");
  if (timeRes.kind !== "ok" && timeRes.kind !== "degraded") warnings.push("time_metrics");
  if (bodyRes.kind !== "ok" && bodyRes.kind !== "degraded") warnings.push("body_system");
  if (itemTimeRes.kind !== "ok" && itemTimeRes.kind !== "degraded") warnings.push("item_timing");
  if (tagCovRes.kind !== "ok" && tagCovRes.kind !== "degraded") warnings.push("tag_coverage");

  const summary = analyticsResolvedData(summaryRes);
  const topics = analyticsResolvedData(topicsRes) ?? [];
  const timeM = analyticsResolvedData(timeRes);
  const dbSup = analyticsResolvedData(dbSupRes);
  const bodyRows = analyticsResolvedData(bodyRes) ?? [];
  const itemTiming = analyticsResolvedData(itemTimeRes);
  const tagCov = analyticsResolvedData(tagCovRes);

  let averageResponseTimeMs: number | null = null;
  let averageResponseTimeSource: UserPerformanceSummaryPayload["averageResponseTimeSource"] = "none";
  if (itemTiming?.averageMs != null) {
    averageResponseTimeMs = itemTiming.averageMs;
    averageResponseTimeSource = "item_level";
  } else if (timeM?.avgMsPerQuestion != null) {
    averageResponseTimeMs = timeM.avgMsPerQuestion;
    averageResponseTimeSource = "practice_test_session";
  } else if (dbSup?.avgMsPerQuestion != null) {
    averageResponseTimeMs = dbSup.avgMsPerQuestion;
    averageResponseTimeSource = "db_supplemental";
  }

  const weakAreas = pickWeakAreasFromTopics(topics, 3);
  const holdingBack = weakAreas.map((w) => `Weak topic: ${w.topic}`);

  const trendWindow = analyticsResolvedData(trendRes);
  const scores = (trendWindow?.points ?? [])
    .map((p: ReadinessTrendPoint) => p.score)
    .filter((n: number) => typeof n === "number");
  const readinessTrend = trendFromReadinessPoints(scores);

  const readinessScore = summary?.latestReadinessScore ?? null;
  const learnerBand = mapCatBandToLearnerBand(summary?.latestReadinessBand ?? null);
  const forecast = computePassReadinessForecast({
    readinessScore,
    readinessBand: learnerBand,
    overallAccuracyPct: summary?.overallAccuracyPct ?? null,
    streakDays: summary?.streakDays ?? 0,
    catSessionCount: summary?.catSessionCount ?? 0,
    readinessTrend,
    holdingBack,
    daysUntilExam: null,
  });

  const timedSamples = itemTiming?.timedItems ?? 0;
  const isSlowResponder =
    averageResponseTimeMs != null && averageResponseTimeMs > SLOW_RESPONDER_MS;

  return {
    generatedAt: new Date().toISOString(),
    accuracyByBodySystem: bodyRows,
    accuracyByTopic: topics,
    averageResponseTimeMs,
    averageResponseTimeSource,
    weakAreas,
    passProbability: {
      percent: forecast.pointEstimate,
      displayRange: forecast.displayRange,
      band: forecast.band,
      interpretation: forecast.interpretation,
    },
    speed: {
      isSlowResponder,
      thresholdMsPerQuestion: SLOW_RESPONDER_MS,
      itemLevelTimedSamples: timedSamples,
    },
    recentQuestionTagCoverage: tagCov,
    integration: {
      questionBankSessionPath: "/app/practice-tests",
      customQuizParams: {
        preset: "topic_drill",
        topic: "topic",
        sessionSize: "sessionSize",
        difficultyBand: "difficultyBand",
      },
      quickFilters: {
        weakStudyMode: {
          studyMode: "weak",
          description: "Append ?studyMode=weak (optional pathwayId) to prioritize weak-topic practice.",
        },
        incorrectOnly: {
          description: "Use the question bank “incorrect only” filter in-session (local mistake IDs + UI toggle).",
          clientControlled: true,
        },
      },
    },
    loadWarnings: warnings,
  };
}

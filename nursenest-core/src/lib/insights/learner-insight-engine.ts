import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { LearnerDashboardModel } from "@/lib/learner/load-learner-dashboard";
import { loadStudyStreakDays } from "@/lib/learner/premium-dashboard-snapshot";
import { explainNextAction } from "@/lib/insights/explain-actions";
import { loadCatInsightSummary, loadFlashcardInsight } from "@/lib/insights/cat-flash-loaders";
import { detectKnowledgeGaps } from "@/lib/insights/knowledge-gaps";
import { buildPerformanceAnalysis } from "@/lib/insights/performance-metrics";
import type { DailyAdaptivePlan, LearnerInsightSnapshot } from "@/lib/insights/types";
import { buildWeakAreaInsights } from "@/lib/insights/weak-area-engine";
import { loadRecencyWeightedSessionGrading } from "@/lib/insights/weighted-session-grading";

function lessonPct(lessonsCompleted: number, lessonsAvailable: number): number {
  if (lessonsAvailable <= 0) return 0;
  return Math.round((lessonsCompleted / lessonsAvailable) * 100);
}

function buildDailyPlan(
  adaptive: ReturnType<typeof buildAdaptiveRecommendations>,
  primaryHref: string,
): DailyAdaptivePlan {
  const todayTasks = adaptive.todayFocus.slice(0, 4).map((label, i) => ({
    label,
    href: i === 0 ? primaryHref : adaptive.primaryNext.href,
    reason: i === 0 ? adaptive.primaryNext.reason : "Supporting priority from your current trajectory.",
  }));
  return {
    todayTasks,
    weeklyPriorities: adaptive.weeklyPriorities,
  };
}

export type InsightBuildOverrides = {
  streakDays?: number;
  mockCount?: number;
  examDate?: Date | null;
  examDatePlanType?: import("@prisma/client").ExamDatePlanType | null;
  studyCadencePreference?: string | null;
};

/**
 * Central “brain”: turns dashboard aggregates + light DB reads into explainable insights.
 * Safe when partial data is missing — never invents numbers.
 */
export async function buildLearnerInsightSnapshot(
  userId: string,
  entitlement: AccessScope,
  dashboard: LearnerDashboardModel,
  overrides?: InsightBuildOverrides,
): Promise<LearnerInsightSnapshot | null> {
  if (!entitlement.hasAccess) return null;

  const [recencyWeighted, cat, flashcards, streakDaysLoaded, topicStatCount, mockCountLoaded, userExam] =
    await Promise.all([
      loadRecencyWeightedSessionGrading(userId, entitlement, 12),
      loadCatInsightSummary(userId),
      loadFlashcardInsight(userId),
      overrides?.streakDays != null
        ? Promise.resolve(overrides.streakDays)
        : loadStudyStreakDays(userId),
      prisma.userTopicStat.count({ where: { userId } }).catch(() => 0),
      overrides?.mockCount != null
        ? Promise.resolve(overrides.mockCount)
        : prisma.examAttempt.count({ where: { userId } }).catch(() => 0),
      overrides?.examDate !== undefined && overrides?.examDatePlanType !== undefined
        ? Promise.resolve({
            examDate: overrides.examDate ?? null,
            examDatePlanType: overrides.examDatePlanType ?? null,
            studyCadencePreference: overrides.studyCadencePreference ?? null,
          })
        : prisma.user
            .findUnique({
              where: { id: userId },
              select: { examDate: true, examDatePlanType: true, studyCadencePreference: true },
            })
            .catch(() => null),
    ]);

  const streakDays = streakDaysLoaded;
  const mockCount = mockCountLoaded;

  const weakTopics = dashboard.weakTopics;
  const strongTopics = dashboard.strongTopics;
  const topicTrends = dashboard.topicTrends;

  const performance = buildPerformanceAnalysis({
    sessionGrading: dashboard.sessionGrading,
    recencyWeighted,
    weakTopics,
    strongTopics,
    recentMocks: dashboard.recentMocks.map((m) => ({ score: m.score, total: m.total, at: m.at })),
  });

  const weakAreas = buildWeakAreaInsights(weakTopics, 12);
  const knowledgeGaps = detectKnowledgeGaps({
    weakTopics,
    strongTopics,
    topicStatCount,
    gradedSessionItems: dashboard.sessionGrading.total,
  });

  const lc = dashboard.lessonsCompleted;
  const la = dashboard.lessonsAvailable;
  const lp = lessonPct(lc, la);

  const adaptive = buildAdaptiveRecommendations({
    examDatePlanType: userExam?.examDatePlanType ?? undefined,
    examDate: userExam?.examDate ?? null,
    readiness: dashboard.readiness,
    weakTopics,
    topicTrends,
    streakDays,
    lessonPct: lp,
    lessonsCompleted: lc,
    lessonsTotal: la,
    studyCadencePreference: userExam?.studyCadencePreference,
    continueLesson: dashboard.continueLesson,
    recommendedQuizTopic: dashboard.recommendedQuizTopic,
    mockCount,
    practiceSessionCount: dashboard.sessionGrading.sessionCount,
    subscriberCountry: entitlement.country,
  });

  const primary = explainNextAction(adaptive.primaryNext);
  const secondary = adaptive.secondary.map(explainNextAction);

  const dailyPlan = buildDailyPlan(adaptive, primary.href);

  return {
    generatedAt: new Date().toISOString(),
    performance,
    weakAreas,
    knowledgeGaps,
    readiness: dashboard.readiness,
    recommendations: { primary, secondary },
    dailyPlan,
    cat,
    flashcards,
    topicTrends,
  };
}

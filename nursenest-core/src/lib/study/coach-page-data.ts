/**
 * Coach Page Data Loader
 *
 * Server-side loader for the Adaptive Study Coach page.
 * Combines:
 *   - PremiumDashboardSnapshot (readiness, streaks, milestones, pathways)
 *   - TopicPerformance (weak/strong topics for adaptive planner)
 *   - buildAdaptiveRecommendations (daily plan, weekly plan, trajectory)
 *   - computePassReadinessForecast (pass probability estimate)
 *   - loadBenchmarkResult (percentile, threshold-gated)
 *   - User exam plan (examDate, examDatePlanType, studyCadencePreference)
 *
 * Performance:
 *   - All queries are bounded (existing helpers enforce limits)
 *   - Benchmark adds one bounded query (MAX_COHORT_ROWS = 3000)
 *   - No full-history loads
 *   - Returns null on auth/access failure
 */

import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { computePassReadinessForecast } from "@/lib/study/pass-readiness-forecast";
import type { PassReadinessForecast } from "@/lib/study/pass-readiness-forecast";
import { loadBenchmarkResult } from "@/lib/study/benchmark-data";
import type { BenchmarkResult } from "@/lib/study/benchmark-data";

// ── Exam-date helpers ─────────────────────────────────────────────────────────

function daysUntilDate(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const target = new Date(isoDate);
  if (isNaN(target.getTime())) return null;
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - todayUtc.getTime()) / 86_400_000);
  return diff;
}

// ── Public types ──────────────────────────────────────────────────────────────

export type CoachPageData = {
  readiness: ReadinessResult;
  adaptive: AdaptiveLearnerRecommendations;
  passReadiness: PassReadinessForecast;
  benchmark: BenchmarkResult;
  /** ISO string from user.examDate, or null */
  examDate: string | null;
  /** "unsure" | "proposed" | "confirmed" | null */
  examDatePlanType: string | null;
  /** Days until exam from today (UTC), or null if no exam date. */
  daysUntilExam: number | null;
  streakDays: number;
  overallAccuracyPct: number | null;
  catSessionCount: number;
  /** Top 3 weak topic names */
  weakTop3: string[];
  /** Top 3 strong topic names */
  strongTop3: string[];
};

// ── Loader ────────────────────────────────────────────────────────────────────

export async function loadCoachPageData(
  userId: string,
  entitlement: AccessScope,
): Promise<CoachPageData | null> {
  if (!userId || !isDatabaseUrlConfigured() || !entitlement.hasAccess) return null;

  try {
    const [snapshot, topicPerf, userRow] = await Promise.all([
      loadPremiumDashboardSnapshot(userId, entitlement),
      loadUnifiedTopicPerformance(userId, entitlement, 12),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          examDate: true,
          examDatePlanType: true,
          studyCadencePreference: true,
          tier: true,
        },
      }),
    ]);

    if (!snapshot || !topicPerf) return null;

    const examDateIso = userRow?.examDate?.toISOString() ?? null;
    const daysUntilExam = daysUntilDate(examDateIso);
    const examDatePlanType = userRow?.examDatePlanType?.toLowerCase() ?? null;

    // Build adaptive plan
    const adaptive = buildAdaptiveRecommendations({
      examDatePlanType: userRow?.examDatePlanType,
      examDate: userRow?.examDate ?? null,
      readiness: snapshot.readiness,
      weakTopics: topicPerf.weakTopics,
      topicTrends: topicPerf.trends,
      streakDays: snapshot.studyStreakDays,
      lessonPct: snapshot.overallLessons.pct,
      lessonsCompleted: snapshot.overallLessons.completed,
      lessonsTotal: snapshot.overallLessons.total,
      studyCadencePreference: userRow?.studyCadencePreference,
      continueLesson: snapshot.continueLesson,
      recommendedQuizTopic: snapshot.recommendedQuizTopic,
      mockCount: snapshot.mockCount,
      practiceSessionCount: snapshot.practice.sessionCount,
      subscriberCountry: entitlement.country,
      preferredPathwayId:
        snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
        snapshot.pathways[0]?.pathwayId ??
        null,
      availablePathwayIds: snapshot.pathways.map((p) => p.pathwayId),
    });

    // Overall accuracy from practice summary
    const overallAccuracyPct = snapshot.practice.accuracyPct;

    // Pass readiness forecast (pure function)
    const passReadiness = computePassReadinessForecast({
      readinessScore: snapshot.readiness.score,
      readinessBand: snapshot.readiness.band,
      overallAccuracyPct,
      streakDays: snapshot.studyStreakDays,
      catSessionCount: snapshot.mockCount,
      readinessTrend: snapshot.readiness.trend,
      holdingBack: snapshot.readiness.holdingBack,
      daysUntilExam,
    });

    // Benchmarking (threshold-gated)
    const benchmark = await loadBenchmarkResult({
      userId,
      userTier: userRow!.tier,
      userAccuracyPct: overallAccuracyPct,
    });

    const weakTop3 = adaptive.weakTop3.slice(0, 3);
    const strongTop3 = topicPerf.strongTopics.slice(0, 3).map((t) => t.topic);

    return {
      readiness: snapshot.readiness,
      adaptive,
      passReadiness,
      benchmark,
      examDate: examDateIso,
      examDatePlanType,
      daysUntilExam,
      streakDays: snapshot.studyStreakDays,
      overallAccuracyPct,
      catSessionCount: snapshot.mockCount,
      weakTop3,
      strongTop3,
    };
  } catch {
    return null;
  }
}

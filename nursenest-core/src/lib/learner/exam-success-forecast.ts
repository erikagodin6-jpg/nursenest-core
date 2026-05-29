import { addDays, format } from "date-fns";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { PersonalizedCommandCenterPlan } from "@/lib/learner/personalized-command-center";
import { computePassReadinessForecast } from "@/lib/study/pass-readiness-forecast";
import { getTestingModelReadinessSemantics } from "@/lib/testing/policies/readiness-policy";

export type ExamSuccessForecastTrend = "improving" | "stable" | "declining" | "calibrating";

export type ExamSuccessForecast = {
  passProbability: number | null;
  confidenceInterval: { low: number; high: number } | null;
  projectedReadinessDate: string | null;
  estimatedStudyHoursRemaining: number | null;
  trend: ExamSuccessForecastTrend;
  weeklyImprovement: number | null;
  recommendedNextActions: Array<{ label: string; href: string; minutes: number }>;
  allowsPassProbability: boolean;
  confidenceLabel: "low" | "medium" | "high";
  summary: string;
  disclaimer: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function confidenceWidth(confidence: PremiumDashboardSnapshot["readiness"]["confidence"], signalCount: number): number {
  const base = confidence === "high" ? 5 : confidence === "medium" ? 8 : 12;
  return Math.max(4, base - Math.min(4, Math.floor(signalCount / 2)));
}

function weeklyImprovementFromSnapshot(snapshot: PremiumDashboardSnapshot): number {
  const trend = snapshot.readiness.trend;
  const mockDelta =
    snapshot.recentMocks.length >= 2
      ? snapshot.recentMocks[0]!.pct - snapshot.recentMocks[1]!.pct
      : 0;
  const trendBase = trend === "improving" ? 4 : trend === "declining" ? -2 : 2;
  const streakBoost = snapshot.studyStreakDays >= 7 ? 1.5 : snapshot.studyStreakDays >= 3 ? 0.75 : 0;
  const mockBoost = clamp(mockDelta / 2, -3, 3);
  return Math.round(Math.max(1, trendBase + streakBoost + mockBoost));
}

function estimatedWeeklyStudyHours(snapshot: PremiumDashboardSnapshot): number {
  const streak = snapshot.studyStreakDays;
  if (streak >= 7) return 7;
  if (streak >= 3) return 5;
  if (snapshot.practice.sessionCount >= 3) return 4;
  return 3;
}

function forecastTrend(snapshot: PremiumDashboardSnapshot): ExamSuccessForecastTrend {
  if (snapshot.readiness.score == null) return "calibrating";
  if (snapshot.readiness.trend === "improving") return "improving";
  if (snapshot.readiness.trend === "declining") return "declining";
  return "stable";
}

function projectedDate(args: {
  readinessScore: number | null;
  weeklyImprovement: number | null;
  weeklyStudyHours: number;
}): { date: string | null; hours: number | null } {
  if (args.readinessScore == null || args.weeklyImprovement == null) return { date: null, hours: null };
  const target = 85;
  const gap = Math.max(0, target - args.readinessScore);
  if (gap === 0) return { date: format(new Date(), "MMMM d"), hours: 0 };
  const weeks = clamp(Math.ceil(gap / Math.max(1, args.weeklyImprovement)), 1, 16);
  const hours = Math.ceil(weeks * args.weeklyStudyHours);
  return {
    date: format(addDays(new Date(), weeks * 7), "MMMM d"),
    hours,
  };
}

function signalCount(snapshot: PremiumDashboardSnapshot, studySnap: LearnerStudySnapshot | null): number {
  let count = 0;
  if (snapshot.practice.gradedTotal >= 15) count += 1;
  if (snapshot.mockCount > 0) count += 1;
  if (snapshot.flashcards && snapshot.flashcards.cardsReviewedTotal > 0) count += 1;
  if (snapshot.overallLessons.completed > 0) count += 1;
  if ((studySnap?.weakTopics.length ?? 0) > 0) count += 1;
  if (snapshot.examDimensions && Object.keys(snapshot.examDimensions).length > 0) count += 1;
  return count;
}

export function buildExamSuccessForecast(args: {
  snapshot: PremiumDashboardSnapshot;
  studySnap: LearnerStudySnapshot | null;
  pathwayId: string | null;
  commandPlan: PersonalizedCommandCenterPlan;
}): ExamSuccessForecast {
  const { snapshot, studySnap, pathwayId, commandPlan } = args;
  const semantics = getTestingModelReadinessSemantics(pathwayId);
  const signals = signalCount(snapshot, studySnap);
  const baseForecast = computePassReadinessForecast({
    readinessScore: snapshot.readiness.score,
    readinessBand: snapshot.readiness.band,
    overallAccuracyPct: snapshot.practice.accuracyPct,
    streakDays: snapshot.studyStreakDays,
    catSessionCount: snapshot.mockCount,
    readinessTrend: snapshot.readiness.trend,
    holdingBack: snapshot.readiness.holdingBack,
    daysUntilExam: null,
  });

  const flashcardAdjustment =
    snapshot.flashcards && snapshot.flashcards.cardsReviewedTotal >= 50 ? 2 : snapshot.flashcards?.cardsReviewedTotal ? 1 : 0;
  const lessonAdjustment = snapshot.overallLessons.pct >= 60 ? 2 : snapshot.overallLessons.pct >= 25 ? 1 : 0;
  const point =
    semantics.allowsPassOutlook && baseForecast.pointEstimate != null
      ? clamp(baseForecast.pointEstimate + flashcardAdjustment + lessonAdjustment, 5, 95)
      : null;
  const width = point == null ? null : confidenceWidth(snapshot.readiness.confidence, signals);
  const weeklyImprovement = snapshot.readiness.score == null ? null : weeklyImprovementFromSnapshot(snapshot);
  const weeklyHours = estimatedWeeklyStudyHours(snapshot);
  const projection = projectedDate({
    readinessScore: snapshot.readiness.score,
    weeklyImprovement,
    weeklyStudyHours: weeklyHours,
  });
  const trend = forecastTrend(snapshot);

  return {
    passProbability: point,
    confidenceInterval:
      point == null || width == null
        ? null
        : { low: clamp(point - width, 5, 95), high: clamp(point + width, 5, 95) },
    projectedReadinessDate: projection.date,
    estimatedStudyHoursRemaining: projection.hours,
    trend,
    weeklyImprovement,
    recommendedNextActions: commandPlan.activities.slice(0, 3).map((activity) => ({
      label: activity.title,
      href: activity.href,
      minutes: activity.minutes,
    })),
    allowsPassProbability: semantics.allowsPassOutlook,
    confidenceLabel: snapshot.readiness.confidence,
    summary:
      point == null
        ? `${semantics.readinessLabel} is available, but this pathway does not display a pass-probability estimate. Use the projected readiness date and recommended actions instead.`
        : `Based on your CAT, question, flashcard, lesson, and topic-performance signals, your current modeled pass probability is ${point}%.`,
    disclaimer:
      "Forecasts are estimates from in-app study signals, not guarantees of exam outcomes. Use them to guide preparation decisions.",
  };
}


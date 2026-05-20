import type { PostExamDashboardFeed, ReadinessReliability } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { CoachingRecommendation } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { ReadinessReliabilityAssessment } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { PostExamCoachingContext } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

const SESSION_KEY = "nn_post_exam_dashboard_feed_v2";

export function buildDashboardFeedV2(args: {
  pathwayId: string | null;
  coachingModel: CoachingModel;
  readinessReliability: ReadinessReliabilityAssessment;
  recommendations: CoachingRecommendation[];
  longitudinal: PostExamCoachingContext;
  readinessScore: number;
  headline: string;
  learnerState?: RnLearnerStateSnapshot | null;
}): PostExamDashboardFeed {
  const topWeak =
    args.longitudinal.persistentWeakTopics[0] ??
    args.recommendations[0]?.graphStep?.title?.split(":").pop()?.trim() ??
    null;
  const primary = args.recommendations[0];
  const reliability = args.readinessReliability.level;
  const state = args.learnerState;

  const reassessmentPrompt =
    reliability === "low"
      ? "Complete one more assessment in your weakest domains before treating readiness as settled."
      : args.coachingModel === "loft_readiness"
        ? "Schedule your next LOFT simulation after domain review."
        : primary
          ? `Continue with: ${primary.title}`
          : null;

  const weaknessClusters = state
    ? state.competencyStates
        .filter((c) => c.persistentWeak || c.masteryScore < 50)
        .map((c) => c.competencyId.replace(/_/g, " "))
    : args.longitudinal.persistentWeakTopics;

  let studyMomentumLine: string | null = null;
  if (state && state.readinessTrajectory.length >= 2) {
    const delta = state.readinessTrajectory.at(-1)! - state.readinessTrajectory.at(-2)!;
    if (delta >= 5) studyMomentumLine = "Readiness trending up — stabilize with mixed-domain practice.";
    else if (delta <= -5) studyMomentumLine = "Readiness dipped — shore up one competency before another long session.";
  }

  return {
    generatedAt: new Date().toISOString(),
    pathwayId: args.pathwayId,
    coachingModel: args.coachingModel,
    topWeakTopic: topWeak,
    readinessScore: args.readinessScore,
    readinessReliability: reliability,
    headline: args.headline,
    primaryHref: primary?.href ?? "/app/dashboard",
    weakTopics: args.longitudinal.persistentWeakTopics.slice(0, 5),
    reassessmentPrompt,
    readinessMomentum: state?.readinessMomentum,
    pacingProfile: state?.pacingProfile,
    hesitationProfile: state?.hesitationProfile,
    weaknessClusters: weaknessClusters.slice(0, 4),
    studyMomentumLine,
    nextBestActionTitle: primary?.title ?? null,
  };
}

export function persistDashboardFeedToSession(feed: PostExamDashboardFeed): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(feed));
  } catch {
    /* quota */
  }
}

export function readDashboardFeedFromSession(): PostExamDashboardFeed | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PostExamDashboardFeed;
  } catch {
    return null;
  }
}

export function clearDashboardFeedSession(): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

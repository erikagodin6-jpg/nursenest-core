import type { PostExamDashboardFeed, PostExamCoachingReport, ReadinessReliability } from "@/lib/learner/post-exam-coaching/types";

const SESSION_KEY = "nn_post_exam_dashboard_feed_v1";

export function buildDashboardFeed(args: {
  pathwayId: string | null;
  coaching: Pick<
    PostExamCoachingReport,
    "coachingModel" | "readinessReliability" | "recommendations" | "longitudinal"
  >;
  readinessScore: number;
  headline: string;
}): PostExamDashboardFeed {
  const topWeak =
    args.coaching.longitudinal.persistentWeakTopics[0] ??
    args.coaching.recommendations[0]?.graphStep?.title?.split(":").pop()?.trim() ??
    null;

  const primary = args.coaching.recommendations[0];
  const reliability = args.coaching.readinessReliability.level;

  const reassessmentPrompt =
    reliability === "low"
      ? "Complete one more assessment in your weakest domains before treating readiness as settled."
      : args.coaching.coachingModel === "loft_readiness"
        ? "Schedule your next LOFT simulation when domain review is complete."
        : primary
          ? `Continue with: ${primary.title}`
          : null;

  return {
    generatedAt: new Date().toISOString(),
    pathwayId: args.pathwayId,
    coachingModel: args.coaching.coachingModel,
    topWeakTopic: topWeak,
    readinessScore: args.readinessScore,
    readinessReliability: reliability,
    headline: args.headline,
    primaryHref: primary?.href ?? "/app/dashboard",
    weakTopics: args.coaching.longitudinal.persistentWeakTopics.slice(0, 5),
    reassessmentPrompt,
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

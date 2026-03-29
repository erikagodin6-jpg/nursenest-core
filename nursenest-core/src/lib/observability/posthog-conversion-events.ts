/**
 * Client-side PostHog event names for funnels and feature usage.
 * Keep names stable; use PostHog Insights / HogQL for last-N-day breakdowns.
 */
export const PH = {
  /** User clicked “Continue to secure checkout” on pricing (before Stripe redirect). */
  checkoutStarted: "checkout_started",
  /** Signup form submit (before API response). */
  signupSubmitAttempt: "signup_submit_attempt",
  /** Client-side success after signup API returns ok (before redirect to login). */
  signupSuccessClient: "signup_success_client",
  /**
   * Learner app area viewed (dashboard, lessons, questions, exams, flashcards, study-plan).
   * Complements $pageview with a single dimension for breakdowns.
   */
  appSectionView: "app_section_view",
} as const;

export type AppSection =
  | "dashboard"
  | "lessons"
  | "questions"
  | "exams"
  | "flashcards"
  | "study_plan"
  | "other";

/** Map pathname under /app to a coarse section for analytics. */
export function appSectionFromPathname(pathname: string): AppSection {
  if (pathname === "/app" || pathname === "/app/") return "dashboard";
  if (pathname.startsWith("/app/lessons")) return "lessons";
  if (pathname.startsWith("/app/questions")) return "questions";
  if (pathname.startsWith("/app/exams")) return "exams";
  if (pathname.startsWith("/app/flashcards")) return "flashcards";
  if (pathname.startsWith("/app/study-plan")) return "study_plan";
  return "other";
}

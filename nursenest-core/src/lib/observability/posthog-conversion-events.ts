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
  /** Marketing homepage and pathway hub CTAs (funnel diagnostics). */
  marketingHomeHeroPrimaryCta: "marketing_home_hero_primary_cta",
  marketingHomeHeroSecondaryCta: "marketing_home_hero_secondary_cta",
  marketingHomeQuickEntryClick: "marketing_home_quick_entry_click",
  marketingHomeExploreHubClick: "marketing_home_explore_hub_click",
  marketingHomePathwayCardPrimary: "marketing_home_pathway_card_primary",
  marketingHomePathwayCardSecondary: "marketing_home_pathway_card_secondary",
  marketingHomeSampleContentClick: "marketing_home_sample_content_click",
  marketingHomeFinalCta: "marketing_home_final_cta",
  marketingHomePreviewSignupHint: "marketing_home_preview_signup_hint",
  marketingPathGatewayPrimaryCta: "marketing_path_gateway_primary_cta",
  marketingPathGatewayLinkClick: "marketing_path_gateway_link_click",
  marketingPathwayHubCta: "marketing_pathway_hub_cta",
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

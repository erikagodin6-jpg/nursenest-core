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
  /** NP SEO alias hub first paint (complements $pageview; use for funnel breakdown by alias segment). */
  marketingNpSeoAliasHubView: "marketing_np_seo_alias_hub_view",
  /** First paint of global marketing trust strip (homepage). */
  marketingTrustBarView: "marketing_trust_bar_view",
  /** Homepage sample question: user unlocked teaching rationale. */
  marketingSampleRationaleUnlock: "marketing_sample_rationale_unlock",
  /** Homepage sample question: primary “unlock explanations / sign up” CTA. */
  marketingSampleUnlockFullCta: "marketing_sample_unlock_full_cta",
  /** Generic conversion CTA (placement label for dashboards). */
  conversionCtaClick: "conversion_cta_click",
  /** Pathway lesson preview: user clicked unlock / pricing from locked remainder. */
  lessonPreviewUnlockCta: "lesson_preview_unlock_cta",
  /** Freemium question peek: user clicked upgrade to see rationale path. */
  freemiumSeeRationaleCta: "freemium_see_rationale_cta",
  /** Pre-Nursing surface engagement + conversion loop. */
  preNursingHubViewed: "pre_nursing_hub_viewed",
  preNursingLessonsHubViewed: "pre_nursing_lessons_hub_viewed",
  preNursingModuleViewed: "pre_nursing_module_viewed",
  preNursingStudyPlanViewed: "pre_nursing_study_plan_viewed",
  preNursingModuleCompleted: "pre_nursing_module_completed",
  preNursingAllModulesCompleted: "pre_nursing_all_modules_completed",
  preNursingNextModuleClicked: "pre_nursing_next_module_clicked",
  preNursingResumeClicked: "pre_nursing_resume_clicked",
  preNursingStudyPlanSaved: "pre_nursing_study_plan_saved",
  preNursingFuturePathwayHintChanged: "pre_nursing_future_pathway_hint_changed",
  preNursingComparePlansClicked: "pre_nursing_compare_plans_clicked",
  preNursingExamLessonsHubClicked: "pre_nursing_exam_lessons_hub_clicked",
  preNursingPathwayCtaClicked: "pre_nursing_pathway_cta_clicked",
  preNursingSignupCtaClicked: "pre_nursing_signup_cta_clicked",
  preNursingSigninCtaClicked: "pre_nursing_signin_cta_clicked",

  /** Marketing homepage → nursing exam hub (funnel; complements pathway card / final CTA events). */
  funnelHomeToExamHub: "funnel_home_to_exam_hub",
  /** Learner shell: user clicked primary nav Lessons. */
  learnerNavLessonsClick: "learner_nav_lessons_click",
  /** Question bank: first batch loaded for a new session (not append). */
  learnerQuestionBankSessionStarted: "learner_question_bank_session_started",
  /** Practice test API: adaptive (CAT) session created. */
  learnerCatExamStarted: "learner_cat_exam_started",
  /** Practice test API: non-CAT linear/random session created. */
  learnerLinearPracticeTestStarted: "learner_linear_practice_test_started",
  /** Practice test finished (linear complete, CAT advance completed, or CAT finalize). */
  learnerPracticeTestSessionCompleted: "learner_practice_test_session_completed",
  /** CAT / exam simulation produced a non-empty readiness label on completion. */
  learnerReadinessScoreReached: "learner_readiness_score_reached",
  /** Exam hub mock: graded attempt persisted via /api/exams/submit. */
  learnerExamMockSessionCompleted: "learner_exam_mock_session_completed",
  /** Stripe: first active subscription for user after checkout (free/trial → paid proxy). */
  learnerConversionSubscribed: "learner_conversion_subscribed",
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

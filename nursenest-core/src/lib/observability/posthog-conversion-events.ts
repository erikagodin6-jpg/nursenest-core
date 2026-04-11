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
  /** Homepage shell viewed (once per load; use with marketing_region for segmentation). */
  funnelHomepageViewed: "funnel_homepage_viewed",
  /** Exam pathway marketing hub overview viewed (canonical hub route). */
  funnelExamHubViewed: "funnel_exam_hub_viewed",
  /**
   * User clicked lessons, questions, or CAT card on the hub (intent to study).
   * Prefer this over generic hub CTA for funnel drop-off from hub → study surfaces.
   */
  funnelExamHubStudyIntent: "funnel_exam_hub_study_intent",
  /** First saved lesson progress row for this learner (subscriber app). */
  funnelFirstStudyProgress: "funnel_first_study_progress",
  /** Learner crossed a second distinct UTC calendar day with any progress activity (repeat study signal). */
  funnelRepeatStudyDay: "funnel_repeat_study_day",
  /** Stripe invoice paid for an existing subscription cycle (renewal / continuation — not first checkout). */
  funnelSubscriptionRenewed: "funnel_subscription_renewed",
  /** Learner shell: user clicked primary nav Lessons. */
  learnerNavLessonsClick: "learner_nav_lessons_click",
  /** Learner shell or marketing chrome: nav intent (prefer over per-link legacy events). */
  learnerNavClick: "learner_nav_click",
  marketingNavClick: "marketing_nav_click",
  /** Marketing: US/CA preference toggle (dedupe: only when region actually changes). */
  marketingRegionToggled: "marketing_region_toggled",
  /** Learner: first progress row for a lesson (pathway synthetic id or CMS lesson id). */
  learnerLessonStarted: "learner_lesson_started",
  learnerLessonCompleted: "learner_lesson_completed",
  /** Learner: user graded enough questions to finish the configured session batch. */
  learnerQuestionBankSessionCompleted: "learner_question_bank_session_completed",
  /**
   * Server-side sample (~5%) of `/api/questions/grade` successes — volume signal without per-question IDs.
   * Use for grading throughput / accuracy trends in PostHog.
   */
  learnerQuestionGradedSample: "learner_question_graded_sample",
  /** Paywall block shown in app (once per mount; context distinguishes placement). */
  paywallEncounter: "paywall_encounter",
  /** Learner saved target exam pathway on exam plan settings. */
  learnerPathwayPreferenceSaved: "learner_pathway_preference_saved",
  /** Blog distribution footer / related links (no query strings; use link_kind). */
  blogDistributionLinkClick: "blog_distribution_link_click",
  /** Public tools hub: user opened a tool. */
  marketingToolOpenClick: "marketing_tool_open_click",
  /** Marketing pathway strip (hub shortcuts). */
  marketingSubNavClick: "marketing_sub_nav_click",
  /** Pathway lesson explorer: user changed lifespan/domain filter (debounced). */
  pathwayExplorerFilterApplied: "pathway_explorer_filter_applied",
  /** Question bank: first batch loaded for a new session (not append). */
  learnerQuestionBankSessionStarted: "learner_question_bank_session_started",
  /** Practice test API: adaptive (CAT) session created. */
  learnerCatExamStarted: "learner_cat_exam_started",
  /** Practice test API: non-CAT linear/random session created. */
  learnerLinearPracticeTestStarted: "learner_linear_practice_test_started",
  /** Practice test finished (linear complete, CAT advance completed, or CAT finalize). */
  learnerPracticeTestSessionCompleted: "learner_practice_test_session_completed",
  /** CAT completion tried to persist a coaching snapshot. */
  learnerCatCoachGenerated: "learner_cat_coach_generated",
  /** Learner opened a lesson / study link from CAT rationale or coach (follow-through). */
  learnerCatLearningLinkClicked: "learner_cat_learning_link_clicked",
  /** Learner clicked a CAT CTA from study-loop surfaces. */
  learnerStudyLoopCatCtaClicked: "learner_study_loop_cat_cta_clicked",
  /** CAT / exam simulation produced a non-empty readiness label on completion. */
  learnerReadinessScoreReached: "learner_readiness_score_reached",
  /** Exam hub mock: graded attempt persisted via /api/exams/submit. */
  learnerExamMockSessionCompleted: "learner_exam_mock_session_completed",
  /** Stripe: first active subscription for user after checkout (free/trial → paid proxy). */
  learnerConversionSubscribed: "learner_conversion_subscribed",
  /**
   * CAT pathway ambiguity picker shown — subscription has 2+ eligible CAT tracks and
   * no `pathwayId` was supplied to the API. Use to measure how often this disambiguation
   * surface appears vs single-pathway users (should be low).
   */
  learnerCatAmbiguityShown: "learner_cat_ambiguity_shown",
  /**
   * User selected a specific pathway from the CAT ambiguity picker (link click).
   * `pathway_id` dimension lets you see which track users choose when given a choice.
   */
  learnerCatAmbiguityOptionSelected: "learner_cat_ambiguity_option_selected",

  // ── Onboarding funnel ────────────────────────────────────────────────────
  onboardingStarted: "onboarding_started",
  onboardingStepCompleted: "onboarding_step_completed",
  onboardingCompleted: "onboarding_completed",
  onboardingSkipped: "onboarding_skipped_to_explore",

  // ── Paywall funnel ───────────────────────────────────────────────────────
  paywallViewed: "paywall_viewed",
  paywallCtaClicked: "paywall_cta_clicked",

  // ── Trial funnel ─────────────────────────────────────────────────────────
  trialStarted: "trial_started",
  trialConverted: "trial_converted",

  // ── Dashboard engagement ─────────────────────────────────────────────────
  continueStudyClicked: "continue_study_clicked",
  dashboardPremiumCtaClicked: "dashboard_premium_cta_clicked",

  // ── Experiments ──────────────────────────────────────────────────────────
  experimentStarted: "$experiment_started",

  // ── Retention & engagement ─────────────────────────────────────────────
  /** Notification bell panel opened. */
  notificationPanelOpened: "notification_panel_opened",
  /** Smart engagement nudge clicked (kind dimension distinguishes trigger type). */
  engagementNudgeClicked: "engagement_nudge_clicked",
  /** Nudge dismissed by user. */
  engagementNudgeDismissed: "engagement_nudge_dismissed",
  /** Spaced repetition reminder CTA clicked. */
  spacedReviewReminderClicked: "spaced_review_reminder_clicked",
  /** User returned to the app after inactivity (24h+ gap). */
  userReactivated: "user_reactivated",
  /** Session frequency signal — fired once per unique UTC day with activity (deduped client-side). */
  dailyActiveSignal: "daily_active_signal",
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

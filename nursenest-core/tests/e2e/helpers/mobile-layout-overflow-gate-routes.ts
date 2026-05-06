/**
 * Phase 1B — documentation of routes / contexts gated by `assertMobileHorizontalLayoutHealth`
 * (measurement-based document vs viewport overflow). Keep aligned with mobile Playwright specs.
 *
 * Sources: `mobile-marketing-routes.spec.ts`, `mobile-learner-authenticated-layout.spec.ts`,
 * `mobile-learner-free-layout.spec.ts`, `mobile-learner-study-interactions.spec.ts`.
 */
export const MOBILE_OVERFLOW_GATE_REPORT = {
  marketingFastGrid: ["/signup", "pathway hub (LESSON_FLOW_PATHWAY_QA us-rn)", "pathway lessons (us-rn)", "menu-open"] as const,
  marketingSlowOptIn: ["/blog (E2E_MOBILE_INCLUDE_BLOG=1)"] as const,
  learnerAuthenticated: [
    "/app",
    "/app/onboarding",
    "lesson detail",
    "/app/practice-tests",
    "/app/practice-tests cat",
    "/app/flashcards",
    "/app/account/billing",
    "/app/questions",
    "/app/labs",
    "/app/ecg-video-quiz",
  ] as const,
  learnerFree: ["free /app", "free /app/lessons", "free /app/flashcards (bottom nav)"] as const,
  learnerStudy: [
    "/app/account/overview",
    "/app/account/billing",
    "/app/lessons (bottom nav)",
    "/app/flashcards hub",
    "flashcard session (front)",
    "flashcard session (revealed + ratings)",
    "linear practice (stem visible)",
    "linear practice (after rationale)",
    "linear practice (after optional next)",
    "CAT session (stem)",
    "CAT session (options)",
    "CAT session (after one advance)",
    "/app/questions mobile",
  ] as const,
} as const;

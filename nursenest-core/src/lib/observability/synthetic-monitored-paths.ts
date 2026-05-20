/**
 * Stable public URLs exercised by synthetic cron + deploy smoke scripts.
 * Keep aligned with marketing E2E paywall smoke (`tests/e2e/helpers/marketing-lesson-paywall.ts`).
 */
export const SYNTHETIC_PUBLIC_LEARNER_PATHS = {
  usRnMarketingLesson: "/us/rn/nclex-rn/lessons/respiratory-assessment-ngn",
  /** Marketing question bank hub (pathway-scoped; aligns with paywall smoke geography). */
  usRnMarketingQuestions: "/us/rn/nclex-rn/questions",
  usRnCat: "/us/rn/nclex-rn/cat",
  flashcardsHub: "/flashcards",
  /** Global practice exams landing (marketing). */
  practiceExamsHub: "/practice-exams",
} as const;

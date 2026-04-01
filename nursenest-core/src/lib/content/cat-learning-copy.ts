/**
 * Reusable learner-facing explanations for product/SEO and in-app help (no clinical claims).
 * Keep copy aligned with how the adaptive practice engine behaves.
 */
export const CAT_LEARNING_COPY = {
  whatIsCat:
    "Computer-adaptive practice adjusts item difficulty from your answers so each question gives useful information about your readiness.",
  whyAdaptive:
    "Fixed-length quizzes can waste items that are too easy or too hard. Adaptive sessions spend effort where it helps estimate your level more efficiently.",
  readinessScore:
    "Readiness score translates your session estimate onto a 0–100 scale for quick interpretation. It summarizes performance in this run, not a guarantee on exam day.",
  confidenceLabel:
    "Confidence reflects how stable the estimate is for the number of items answered — not whether you will pass a licensing exam.",
} as const;

/**
 * Taxonomy for programmatic SEO pages — used for filtering, analytics, and content-pipeline tooling.
 * Optional on {@link SeoPageDefinition}; when omitted, treat as `guide` (generic long-form).
 */
export type SeoPageKind =
  | "guide"
  /** Schedules, cadence, hour budgets (e.g. 2-week plans). */
  | "study-plan"
  /** Clinical or systems topic with exam-facing framing (not per-question thin pages). */
  | "topic-guide"
  /** Side-by-side disease or presentation comparisons (e.g. SIADH vs DI). */
  | "comparison"
  /** Single-condition deep guide (e.g. COPD NCLEX guide). */
  | "condition-guide"
  /** Symptom or lab-pattern explanation (e.g. K+ high vs low). */
  | "symptom-guide"
  /** Strong intent toward a specific exam pathway (RN/PN/NP/allied). */
  | "exam-intent"
  /** Practice questions / test bank / CAT entry surfaces (`practiceConversion` often true). */
  | "practice-surface"
  /** Careers, new grad, allied pathways. */
  | "career";

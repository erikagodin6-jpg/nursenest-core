/**
 * Slim stats shape passed from the homepage server component.
 * Allows safe hydration without crashes or flashing invalid values.
 */
export type HomeMarketingStats = {
  /** Total number of practice questions (may be null during build or fallback states) */
  questionCount?: number | null;

  /** Total registered learners (may be null during degraded / cold-start states) */
  registeredLearners?: number | null;

  /** Total lessons available (optional for future use / partial loads) */
  totalLessons?: number | null;
};
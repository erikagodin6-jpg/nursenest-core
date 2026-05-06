/**
 * Phase 5B feature gate — server-side only (read in RSC and API routes).
 * Default **false** when unset or any value other than the literal `true`.
 */
export function isAdaptiveLearningEnabled(): boolean {
  return process.env.ADAPTIVE_LEARNING_ENABLED?.trim() === "true";
}

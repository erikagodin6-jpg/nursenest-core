/**
 * Phase 5B/5C — single env gate for admin + learner adaptive surfaces.
 * When unset/false, admin UI omits the adaptive recommendations block.
 */
export function isAdaptiveLearningAdminFeatureEnabled(): boolean {
  const raw = process.env.ADAPTIVE_LEARNING_ENABLED?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

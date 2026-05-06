/**
 * Server-side feature gate for Phase 5B adaptive learning wiring (API + selective UI).
 * Default **off** unless `ADAPTIVE_LEARNING_ENABLED` is set to `true` or `1`.
 */
export function isAdaptiveLearningEnabled(): boolean {
  const v = process.env.ADAPTIVE_LEARNING_ENABLED;
  return v === "true" || v === "1";
}

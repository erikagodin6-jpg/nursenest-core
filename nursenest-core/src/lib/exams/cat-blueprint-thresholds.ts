/**
 * Single source for CAT blueprint quality thresholds (non-blocking warnings only).
 * Used by logging, admin diagnostics JSON, and tests.
 */
export const CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM = 0.9;

export const CAT_BLUEPRINT_SESSION_MAPPED_WARN = 0.85;

/** Practice CAT: emit `pool_ready` when pool mapping falls below this (logging only). */
export const CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED = 0.85;

export type CatBlueprintQualityThresholds = {
  poolMappedFractionWarning: number;
  sessionMappedFractionWarning: number;
  practicePoolLogFraction: number;
};

export function getCatBlueprintQualityThresholds(): CatBlueprintQualityThresholds {
  return {
    poolMappedFractionWarning: CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM,
    sessionMappedFractionWarning: CAT_BLUEPRINT_SESSION_MAPPED_WARN,
    practicePoolLogFraction: CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED,
  };
}

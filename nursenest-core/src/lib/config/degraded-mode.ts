/**
 * Global degraded mode for the learner app (`NN_DEGRADED_MODE` / `NEXT_PUBLIC_NN_DEGRADED_MODE`).
 * Skips Tier-2 optional loads (study-next strip, heavy analytics hooks) via {@link shouldSkipNonCriticalLearnerWork}.
 * Auto-stress activation may also set degraded (see `isAutoDegradedActive` in `auto-degraded-mode.ts`, merged via server `isDurabilityDegradedMode`).
 *
 * Priority: auth, entitlements, and lesson/question access stay on; analytics, recommendations, tutor, and email are first to degrade.
 *
 * Does **not** skip entitlements, session, or paywall enforcement.
 */
import {
  isDurabilityDegradedMode,
  shouldSkipNonCriticalLearnerWork,
} from "@/lib/durability/durability-flags";

export function isDegradedMode(): boolean {
  return isDurabilityDegradedMode();
}

export { shouldSkipNonCriticalLearnerWork };

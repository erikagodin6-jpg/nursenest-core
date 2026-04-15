/**
 * Global degraded mode for the learner app (`NN_DEGRADED_MODE` / `NEXT_PUBLIC_NN_DEGRADED_MODE`).
 * Skips Tier-2 optional loads (study-next strip, heavy analytics hooks) via {@link shouldSkipNonCriticalLearnerWork}.
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

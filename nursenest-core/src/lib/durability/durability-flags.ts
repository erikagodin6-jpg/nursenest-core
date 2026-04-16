import { isAutoDegradedActive } from "@/lib/config/auto-degraded-mode";

function truthyEnv(v: string | undefined): boolean {
  const t = v?.trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes";
}

/**
 * Degraded mode: skip non-critical DB work, optional panels, and client analytics.
 * Server: `NN_DEGRADED_MODE=1`
 * Client (PostHog / section analytics): also set `NEXT_PUBLIC_NN_DEGRADED_MODE=1` so the flag is bundled.
 * Auto (Node only): stress signals may enable degraded briefly — see {@link isAutoDegradedActive}.
 */
export function isDurabilityDegradedMode(): boolean {
  return (
    truthyEnv(process.env.NN_DEGRADED_MODE) ||
    truthyEnv(process.env.NEXT_PUBLIC_NN_DEGRADED_MODE) ||
    isAutoDegradedActive()
  );
}

/**
 * Core-only emergency: stronger than degraded — hides tutor/feedback chrome and tightens read timeouts.
 * Does not change entitlement rules or auth. Combine with `NN_DEGRADED_MODE` for full “backup mode”.
 * Server: `NN_CORE_ONLY_EMERGENCY=1`
 * Client: `NEXT_PUBLIC_NN_CORE_ONLY_EMERGENCY=1` when hiding client-only non-core UI.
 */
export function isCoreOnlyEmergencyMode(): boolean {
  return truthyEnv(process.env.NN_CORE_ONLY_EMERGENCY) || truthyEnv(process.env.NEXT_PUBLIC_NN_CORE_ONLY_EMERGENCY);
}

/** Skip recommendations, heavy dashboard widgets, study-next strip, and optional telemetry. */
export function shouldSkipNonCriticalLearnerWork(): boolean {
  return isDurabilityDegradedMode() || isCoreOnlyEmergencyMode();
}

/**
 * Safe, structured durability context for learner perf logs (no PII).
 * Greppable keys: `envNnDegradedMode`, `autoDegradedActive`, `skipNonCriticalLearnerWork`, etc.
 */
export function getLearnerDurabilityObservabilityFields(): {
  envNnDegradedMode: boolean;
  publicNnDegradedMode: boolean;
  coreOnlyEmergency: boolean;
  autoDegradedActive: boolean;
  skipNonCriticalLearnerWork: boolean;
} {
  return {
    envNnDegradedMode: truthyEnv(process.env.NN_DEGRADED_MODE),
    publicNnDegradedMode: truthyEnv(process.env.NEXT_PUBLIC_NN_DEGRADED_MODE),
    coreOnlyEmergency: isCoreOnlyEmergencyMode(),
    autoDegradedActive: isAutoDegradedActive(),
    skipNonCriticalLearnerWork: shouldSkipNonCriticalLearnerWork(),
  };
}

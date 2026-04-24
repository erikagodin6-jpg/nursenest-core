/**
 * Central helpers for trimming heavy work during `next build` / static generation.
 *
 * - {@link isProductionBuildInvocation}: Next.js production static generation (`NEXT_PHASE`).
 * - {@link shouldReduceNonCriticalBuildWork}: Optional extra fan-in guard via `NN_BUILD_SAFE_MODE`.
 *
 * @see `.env.example` (`NN_BUILD_SAFE_MODE`)
 */

const NEXT_PRODUCTION_STATIC_PHASE = "phase-production-build";

/** True while Next is running the production static generation phase (`next build`). */
export function isProductionBuildInvocation(): boolean {
  return process.env.NEXT_PHASE === NEXT_PRODUCTION_STATIC_PHASE;
}

/**
 * When `NN_BUILD_SAFE_MODE` is enabled, sitemap and other build paths may skip non-critical work
 * beyond the baseline `isProductionBuildInvocation()` skips.
 */
export function shouldReduceNonCriticalBuildWork(): boolean {
  const raw = process.env.NN_BUILD_SAFE_MODE?.trim();
  if (!raw) return false;
  const v = raw.toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/**
 * Compatibility / guard-rail name — reserved for future “global build safe” toggles.
 * Sitemap and static generation continue to use {@link isProductionBuildInvocation} /
 * {@link shouldReduceNonCriticalBuildWork}.
 */
export function isBuildSafeMode(): boolean {
  return false;
}

export function getBuildSafeModeReason(): string | null {
  return null;
}

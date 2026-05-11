/**
 * MLT premium specialty marketing + future learner modules — feature flags (server + marketing).
 * Orthogonal to RN/NP; gated to allied tier + MLT career for learner surfaces when enabled.
 */

export function isMltSpecialtyMarketingSurfacesEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const pub = env.NEXT_PUBLIC_ENABLE_MLT_SPECIALTY_MARKETING?.trim().toLowerCase();
  return pub === "true" || pub === "1";
}

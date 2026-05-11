/**
 * RT Ventilator premium module — feature flags (server + marketing).
 * Orthogonal to RN/NP ECG; gated to TierCode.ALLIED + respiratory career + premium subscription.
 */

export function isRtVentilatorLearnerModuleEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const raw = env.ENABLE_RT_VENTILATOR_MODULE?.trim().toLowerCase();
  return raw === "true" || raw === "1";
}

/** Marketing hub cards + public landing — safe to enable without learner routes. */
export function isRtVentilatorMarketingSurfacesEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const pub = env.NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING?.trim().toLowerCase();
  return pub === "true" || pub === "1";
}

export function canAccessRtVentilatorModuleForTierAndProfession(args: {
  tier: string | null | undefined;
  alliedProfessionKey: string | null | undefined;
}): boolean {
  const tier = args.tier?.trim().toUpperCase() ?? "";
  const prof = args.alliedProfessionKey?.trim().toLowerCase() ?? "";
  return tier === "ALLIED" && prof === "respiratory";
}

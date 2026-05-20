/**
 * RT Ventilator premium module — feature flags (server + marketing).
 * Orthogonal to RN/NP ECG; gated to TierCode.ALLIED + respiratory career + premium subscription.
 */

import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";

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

/**
 * RRT subscribers resolve to billing {@link AlliedCareerKey} **`rrt`** on the canonical access snapshot,
 * while dashboards often compare marketing **`alliedProfessionKey` `"respiratory"`** — both must grant access.
 */
export function canAccessRtVentilatorModuleForTierAndProfession(args: {
  tier: string | null | undefined;
  alliedProfessionKey?: string | null | undefined;
  alliedCareer?: AlliedCareerKey | null | undefined;
}): boolean {
  const tier = args.tier?.trim().toUpperCase() ?? "";
  if (tier !== "ALLIED") return false;

  const career = args.alliedCareer ?? null;
  if (career != null) {
    return career === "rrt";
  }

  const prof = args.alliedProfessionKey?.trim().toLowerCase() ?? "";
  return prof === "respiratory" || prof === "rrt";
}

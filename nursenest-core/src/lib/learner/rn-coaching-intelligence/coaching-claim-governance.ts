import type { ReadinessReliability, CoachingCertaintyTier } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export function certaintyTierFromReliability(level: ReadinessReliability): CoachingCertaintyTier {
  switch (level) {
    case "high":
      return "stable";
    case "moderate":
      return "directional";
    case "low":
    default:
      return "observation";
  }
}

/** Allowed longitudinal claim verbs by certainty tier. */
export function allowReadinessForecast(tier: CoachingCertaintyTier): boolean {
  return tier === "stable";
}

export function allowPassOutlookCopy(tier: CoachingCertaintyTier, softenPredictions: boolean): boolean {
  return !softenPredictions && tier !== "observation";
}

export function longitudinalClaimPrefix(tier: CoachingCertaintyTier): string {
  switch (tier) {
    case "stable":
      return "Across your recent sessions,";
    case "directional":
      return "Early trend suggests";
    case "observation":
    default:
      return "With limited data so far,";
  }
}

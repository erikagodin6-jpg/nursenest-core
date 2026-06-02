import type { BetaFeatureKey } from "@prisma/client";

export const BETA_FEATURE_OPTIONS: readonly { key: BetaFeatureKey; label: string; description: string }[] = [
  {
    key: "FLASHCARDS_V2",
    label: "Flashcards V2",
    description: "Early access to the updated flashcard study loop and deck experience.",
  },
  {
    key: "CLINICAL_SKILLS_EXPANSION",
    label: "Clinical Skills Expansion",
    description: "Preview expanded competency lab content and skills workflows.",
  },
  {
    key: "PHARMACOLOGY_EXPANSION",
    label: "Pharmacology Expansion",
    description: "Preview medication class hubs, safety modules, and pharmacology study tools.",
  },
  {
    key: "FRIEND_CODE_SYSTEM",
    label: "Friend Code System",
    description: "Test friend codes, comparisons, challenges, and social study flows.",
  },
  {
    key: "ADVANCED_ANALYTICS",
    label: "Advanced Analytics",
    description: "Preview deeper learner analytics, readiness trends, and performance reporting.",
  },
  {
    key: "ECG_ENHANCEMENTS",
    label: "ECG Enhancements",
    description: "Preview advanced ECG training, telemetry, and clinical response content.",
  },
  {
    key: "CNPLE_SIMULATION_UPDATES",
    label: "CNPLE Simulation Updates",
    description: "Preview NP-focused LOFT and CNPLE simulation updates.",
  },
] as const;

export const BETA_FEATURE_LABELS: Record<BetaFeatureKey, string> = Object.fromEntries(
  BETA_FEATURE_OPTIONS.map((feature) => [feature.key, feature.label]),
) as Record<BetaFeatureKey, string>;

export function betaFeaturesToLabels(features: readonly BetaFeatureKey[]): string[] {
  return features.map((feature) => BETA_FEATURE_LABELS[feature] ?? feature);
}

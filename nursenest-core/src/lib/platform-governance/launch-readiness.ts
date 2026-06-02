import {
  featureLaunchBand,
  featureReadinessScore,
  PLATFORM_FEATURES,
  type PlatformFeature,
} from "./feature-registry";

export const LAUNCH_READINESS_CONTRACT_VERSION = "1.0.0" as const;

export type FeatureLaunchReadinessRow = {
  feature: PlatformFeature;
  score: number;
  band: "ready" | "watch" | "blocked";
};

export function buildLaunchReadinessDashboard(): FeatureLaunchReadinessRow[] {
  return PLATFORM_FEATURES.map((feature) => {
    const score = featureReadinessScore(feature);
    return { feature, score, band: featureLaunchBand(score) };
  }).sort((a, b) => a.score - b.score || a.feature.label.localeCompare(b.feature.label));
}

export function platformGovernanceSummary() {
  const rows = buildLaunchReadinessDashboard();
  return {
    totalFeatures: rows.length,
    ready: rows.filter((row) => row.band === "ready").length,
    watch: rows.filter((row) => row.band === "watch").length,
    blocked: rows.filter((row) => row.band === "blocked").length,
    averageScore: Math.round(rows.reduce((sum, row) => sum + row.score, 0) / Math.max(1, rows.length)),
  };
}

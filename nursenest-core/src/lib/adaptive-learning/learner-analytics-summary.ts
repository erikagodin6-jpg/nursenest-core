/**
 * Learner-facing, **non-sensitive** summary DTO — suitable for authenticated `/app` shells.
 * Does not expose raw item IDs, timestamps, or cross-user aggregates. Marketing routes
 * must not import this module for public SEO pages.
 */
import type { PerformanceProfile } from "@/lib/cat/types";
import {
  MIN_RELIABLE_SAMPLE,
  STRONG_AREA_THRESHOLD,
  WEAK_AREA_THRESHOLD,
} from "@/lib/cat/performance-tracker";

export type LearnerSystemBand = "strong" | "developing" | "weak" | "insufficient_data";

export type LearnerSystemSummaryRow = {
  systemTag: string;
  band: LearnerSystemBand;
  /** Rounded for display only — omit when insufficient_data. */
  recentAccuracyPct?: number;
};

export type LearnerTrendPlaceholder = {
  dimension: "overall" | "by_system";
  /** Until longitudinal snapshots exist, callers show neutral copy. */
  trend: "not_enough_history" | "stable" | "improving" | "declining";
};

export type LearnerFacingProgressSummary = {
  strongestSystems: LearnerSystemSummaryRow[];
  weakestSystems: LearnerSystemSummaryRow[];
  trendPlaceholders: LearnerTrendPlaceholder[];
  hasMeaningfulPracticeHistory: boolean;
};

function bandFor(attempted: number, recentAccuracy: number): LearnerSystemBand {
  if (attempted < MIN_RELIABLE_SAMPLE) return "insufficient_data";
  if (recentAccuracy >= STRONG_AREA_THRESHOLD) return "strong";
  if (recentAccuracy < WEAK_AREA_THRESHOLD) return "weak";
  return "developing";
}

function rowFrom(systemTag: string, attempted: number, recentAccuracy: number): LearnerSystemSummaryRow {
  const band = bandFor(attempted, recentAccuracy);
  const recentAccuracyPct =
    band === "insufficient_data" ? undefined : Math.round(recentAccuracy * 1000) / 10;
  return { systemTag, band, recentAccuracyPct };
}

/**
 * Builds a bounded summary (top 5 weak / top 5 strong) from an existing CAT/profile aggregate.
 * When `profile` is null or empty, returns typed empty-safe defaults.
 */
export function buildLearnerFacingProgressSummary(
  profile: PerformanceProfile | null | undefined,
): LearnerFacingProgressSummary {
  const empty: LearnerFacingProgressSummary = {
    strongestSystems: [],
    weakestSystems: [],
    trendPlaceholders: [
      { dimension: "overall", trend: "not_enough_history" },
      { dimension: "by_system", trend: "not_enough_history" },
    ],
    hasMeaningfulPracticeHistory: false,
  };

  if (!profile) return empty;

  const systems = Object.entries(profile.bySystem).filter(([, p]) => p.attempted > 0);
  if (systems.length === 0) return empty;

  const rows = systems.map(([tag, p]) => rowFrom(tag, p.attempted, p.recentAccuracy));
  const scored = rows.filter((r) => r.band !== "insufficient_data");
  const hasMeaningfulPracticeHistory = scored.length > 0;

  const weakest = [...scored]
    .sort((a, b) => (a.recentAccuracyPct ?? 0) - (b.recentAccuracyPct ?? 0))
    .slice(0, 5);
  const strongest = [...scored]
    .sort((a, b) => (b.recentAccuracyPct ?? 0) - (a.recentAccuracyPct ?? 0))
    .slice(0, 5);

  return {
    strongestSystems: strongest,
    weakestSystems: weakest,
    trendPlaceholders: [
      { dimension: "overall", trend: hasMeaningfulPracticeHistory ? "stable" : "not_enough_history" },
      { dimension: "by_system", trend: hasMeaningfulPracticeHistory ? "stable" : "not_enough_history" },
    ],
    hasMeaningfulPracticeHistory,
  };
}

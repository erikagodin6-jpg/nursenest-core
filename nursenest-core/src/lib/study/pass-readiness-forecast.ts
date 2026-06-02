/**
 * Pass Readiness Forecast
 *
 * Deterministic, conservative estimate of a learner's readiness for exam success.
 *
 * This is NOT a guarantee of passing or failing.
 * It is a data-grounded probability estimate based on observable study signals.
 *
 * Formula:
 *   base = readinessScore
 *   ± accuracy adjustment  (vs 70% baseline)
 *   ± trend adjustment     (improving vs declining)
 *   ± consistency bonus    (streak days)
 *   ± CAT depth bonus      (number of completed CAT sessions)
 *   → clamp to [5, 95] to avoid false certainty at extremes
 *   → express as a ±4% range
 *
 * No LLM involvement. No magic. No false certainty.
 */

import type { ReadinessTrend } from "@/lib/learner/readiness-score";
import type { ReadinessBand } from "@/lib/learner/readiness-score";

// ── Public types ──────────────────────────────────────────────────────────────

export type ForecastBand =
  | "strong"      // forecast ≥ 75
  | "building"    // forecast 55–74
  | "early"       // forecast 35–54
  | "insufficient"; // not enough data

export type PassReadinessForecast = {
  /** Central estimate 0–100, or null if insufficient data. */
  pointEstimate: number | null;
  /** Display range string, e.g. "65–73%" or null. */
  displayRange: string | null;
  /** Band derived from pointEstimate. */
  band: ForecastBand;
  /** Short label summarising what is helping readiness. */
  positiveFactor: string | null;
  /** Short label for biggest limiter. */
  limitingFactor: string | null;
  /** Context sentence to display alongside. */
  interpretation: string;
};

// ── Internal helpers ──────────────────────────────────────────────────────────

const FORECAST_RANGE = 4; // ± displayed on each side

function forecastBand(score: number): ForecastBand {
  if (score >= 75) return "strong";
  if (score >= 55) return "building";
  if (score >= 35) return "early";
  return "early"; // even low scores are labelled "early" not "insufficient" once we have data
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function accuracyBoost(pct: number | null): number {
  if (pct === null) return 0;
  // ±8 max. Centred on 70%.
  return clamp((pct - 70) * 0.2, -8, 8);
}

function trendBoost(trend: ReadinessTrend | null): number {
  if (trend === "improving") return 4;
  if (trend === "declining") return -4;
  return 0;
}

function streakBoost(streakDays: number): number {
  if (streakDays >= 14) return 3;
  if (streakDays >= 7) return 2;
  if (streakDays >= 3) return 1;
  return 0;
}

function catBoost(catSessionCount: number): number {
  if (catSessionCount >= 5) return 3;
  if (catSessionCount >= 2) return 1;
  return 0;
}

function positiveFactorLabel(args: {
  streakDays: number;
  overallAccuracyPct: number | null;
  catSessionCount: number;
  readinessTrend: ReadinessTrend | null;
}): string | null {
  if (args.readinessTrend === "improving") return "Improving trajectory across recent sessions";
  if ((args.overallAccuracyPct ?? 0) >= 75) return "Strong overall accuracy";
  if (args.streakDays >= 7) return "Consistent daily study habit";
  if (args.catSessionCount >= 3) return "Good CAT exposure and practice depth";
  return null;
}

function limitingFactorLabel(
  holdingBack: string[],
  readinessBand: ReadinessBand | null,
): string | null {
  if (holdingBack.length > 0) return holdingBack[0]!;
  if (readinessBand === "not_ready") return "Not enough graded practice yet";
  if (readinessBand === "improving") return "Some weak areas still limiting readiness";
  return null;
}

function interpretationSentence(args: {
  estimate: number;
  trend: ReadinessTrend | null;
  readinessBand: ReadinessBand | null;
  holdingBack: string[];
  daysUntilExam: number | null;
}): string {
  const { estimate, trend, readinessBand, holdingBack, daysUntilExam } = args;
  const examContext =
    daysUntilExam !== null && daysUntilExam <= 21
      ? " With your exam close, focus on weak areas and targeted practice."
      : daysUntilExam !== null && daysUntilExam <= 56
        ? " Use the remaining time to close weak-area gaps."
        : "";

  if (estimate >= 75) {
    return (
      "Performance is strong. Maintain consistency and continue targeted practice." +
      examContext
    );
  }
  if (estimate >= 60 && trend === "improving") {
    return (
      "Trajectory is improving, but gaps remain." +
      (holdingBack.length > 0 ? ` Key limiter: ${holdingBack[0]}.` : "") +
      examContext
    );
  }
  if (estimate >= 55) {
    return (
      "Building readiness. Focused weak-area practice will have the highest impact." +
      examContext
    );
  }
  if (readinessBand === "not_ready" || readinessBand === "insufficient_data") {
    return "More graded practice will sharpen this estimate. Keep building the foundation.";
  }
  return (
    "Readiness is developing. Consistent study and remediation of weak areas are the priority." +
    examContext
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function computePassReadinessForecast(args: {
  readinessScore: number | null;
  readinessBand: ReadinessBand | null;
  overallAccuracyPct: number | null;
  streakDays: number;
  catSessionCount: number;
  readinessTrend: ReadinessTrend | null;
  holdingBack: string[];
  daysUntilExam: number | null;
}): PassReadinessForecast {
  const {
    readinessScore,
    readinessBand,
    overallAccuracyPct,
    streakDays,
    catSessionCount,
    readinessTrend,
    holdingBack,
    daysUntilExam,
  } = args;

  if (readinessScore === null) {
    return {
      pointEstimate: null,
      displayRange: null,
      band: "insufficient",
      positiveFactor: null,
      limitingFactor: "Complete more graded practice to generate a forecast",
      interpretation:
        "Complete practice sessions and at least one CAT to generate your readiness forecast.",
    };
  }

  const raw =
    readinessScore +
    accuracyBoost(overallAccuracyPct) +
    trendBoost(readinessTrend) +
    streakBoost(streakDays) +
    catBoost(catSessionCount);

  const estimate = clamp(Math.round(raw), 5, 95);
  const low = clamp(estimate - FORECAST_RANGE, 5, 95);
  const high = clamp(estimate + FORECAST_RANGE, 5, 95);

  return {
    pointEstimate: estimate,
    displayRange: `${low}–${high}%`,
    band: forecastBand(estimate),
    positiveFactor: positiveFactorLabel({
      streakDays,
      overallAccuracyPct,
      catSessionCount,
      readinessTrend,
    }),
    limitingFactor: limitingFactorLabel(holdingBack, readinessBand),
    interpretation: interpretationSentence({
      estimate,
      trend: readinessTrend,
      readinessBand,
      holdingBack,
      daysUntilExam,
    }),
  };
}

/**
 * Trend Analytics
 *
 * Time-series analysis for platform health metrics across configurable windows:
 *   7 day, 30 day, 90 day, 180 day
 *
 * Tracks:
 *   - Completion rates (per activity)
 *   - Abandonment rates
 *   - Friction scores
 *   - Remediation success rate
 *   - Feature health scores
 *   - Startup performance
 *   - Subscription health
 *   - SEO health
 *
 * Detects:
 *   - Regression alerts (metric significantly worse than baseline)
 *   - Growth alerts (metric significantly better — celebrate/investigate)
 *   - Moving averages (smooth out noise)
 *   - Trend direction (improving/stable/declining)
 *
 * Storage approach:
 *   - In-process ring buffer for hot metrics (last 24h)
 *   - Database (FeatureHealthSnapshot model) for 7d+ historical
 *   - Computed from aggregation queries for longer windows
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrendWindow = "7d" | "30d" | "90d" | "180d";
export type TrendDirection = "improving" | "stable" | "declining" | "insufficient-data";

export type MetricDataPoint = {
  timestamp: number;  // Unix ms
  value: number;
  label?: string;
};

export type TrendAnalysis = {
  metricId: string;
  window: TrendWindow;
  direction: TrendDirection;
  /** Simple moving average over the window. */
  movingAverage: number | null;
  /** Most recent value. */
  currentValue: number | null;
  /** Value at start of window (oldest point). */
  baselineValue: number | null;
  /** Change from baseline to current (absolute). */
  absoluteChange: number | null;
  /** Change from baseline to current (%). */
  percentChange: number | null;
  dataPoints: MetricDataPoint[];
  alerts: TrendAlert[];
};

export type TrendAlert = {
  type: "regression" | "growth" | "anomaly";
  severity: "warn" | "critical";
  message: string;
  currentValue: number;
  thresholdValue: number;
};

// ─── In-process time-series store ────────────────────────────────────────────

const MAX_DATAPOINTS = 500;
const metricsStore = new Map<string, MetricDataPoint[]>();

function getOrCreateSeries(metricId: string): MetricDataPoint[] {
  let series = metricsStore.get(metricId);
  if (!series) {
    series = [];
    metricsStore.set(metricId, series);
  }
  return series;
}

/** Record a metric data point. */
export function recordMetricDataPoint(
  metricId: string,
  value: number,
  label?: string,
): void {
  const series = getOrCreateSeries(metricId);
  series.push({ timestamp: Date.now(), value, label });
  if (series.length > MAX_DATAPOINTS) series.shift();
}

// ─── Window resolution ────────────────────────────────────────────────────────

const WINDOW_MS: Record<TrendWindow, number> = {
  "7d":   7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
  "180d":180 * 24 * 60 * 60 * 1000,
};

// ─── Trend direction ──────────────────────────────────────────────────────────

function computeTrendDirection(
  pctChange: number | null,
  minPctThreshold = 5,
): TrendDirection {
  if (pctChange === null) return "insufficient-data";
  if (Math.abs(pctChange) < minPctThreshold) return "stable";
  return pctChange > 0 ? "improving" : "declining";
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

/** Compute trend analysis for a metric over a given window. */
export function analyzeTrend(
  metricId: string,
  window: TrendWindow,
  opts: {
    /** Minimum % change to be considered a regression. Default 10. */
    regressionThresholdPct?: number;
    /** Minimum % change to trigger a growth alert. Default 20. */
    growthThresholdPct?: number;
    /** Direction where 'down' is bad (e.g. error rate, abandonment). Default: up is good. */
    lowerIsBetter?: boolean;
  } = {},
): TrendAnalysis {
  const { regressionThresholdPct = 10, growthThresholdPct = 20, lowerIsBetter = false } = opts;

  const series = metricsStore.get(metricId) ?? [];
  const cutoff = Date.now() - WINDOW_MS[window];
  const windowedPoints = series.filter((p) => p.timestamp >= cutoff);

  if (windowedPoints.length < 2) {
    return {
      metricId,
      window,
      direction: "insufficient-data",
      movingAverage: null,
      currentValue: windowedPoints[windowedPoints.length - 1]?.value ?? null,
      baselineValue: null,
      absoluteChange: null,
      percentChange: null,
      dataPoints: windowedPoints,
      alerts: [],
    };
  }

  const values = windowedPoints.map((p) => p.value);
  const movingAverage = values.reduce((a, b) => a + b, 0) / values.length;
  const currentValue = values[values.length - 1];
  const baselineValue = values[0];
  const absoluteChange = currentValue - baselineValue;
  const percentChange = baselineValue !== 0
    ? Math.round((absoluteChange / Math.abs(baselineValue)) * 100 * 10) / 10
    : null;

  // For lowerIsBetter metrics, flip the sign for direction
  const normalizedChange = lowerIsBetter ? -(percentChange ?? 0) : (percentChange ?? 0);
  const direction = computeTrendDirection(normalizedChange);

  const alerts: TrendAlert[] = [];

  // Regression check
  if (
    percentChange !== null &&
    ((lowerIsBetter && percentChange > regressionThresholdPct) ||
      (!lowerIsBetter && percentChange < -regressionThresholdPct))
  ) {
    alerts.push({
      type: "regression",
      severity: Math.abs(percentChange) > regressionThresholdPct * 2 ? "critical" : "warn",
      message: `${metricId} regressed ${Math.abs(Math.round(percentChange))}% over ${window}`,
      currentValue,
      thresholdValue: baselineValue,
    });

    safeServerLog("perf", "trend_regression_alert", {
      metricId,
      window,
      percentChange,
      currentValue,
      baselineValue,
    });
  }

  // Growth check
  if (
    percentChange !== null &&
    ((lowerIsBetter && percentChange < -growthThresholdPct) ||
      (!lowerIsBetter && percentChange > growthThresholdPct))
  ) {
    alerts.push({
      type: "growth",
      severity: "warn",
      message: `${metricId} grew ${Math.abs(Math.round(percentChange))}% over ${window} — verify expected`,
      currentValue,
      thresholdValue: baselineValue,
    });
  }

  return {
    metricId,
    window,
    direction,
    movingAverage: Math.round(movingAverage * 100) / 100,
    currentValue,
    baselineValue,
    absoluteChange: Math.round(absoluteChange * 100) / 100,
    percentChange,
    dataPoints: windowedPoints,
    alerts,
  };
}

// ─── Platform trend summary ───────────────────────────────────────────────────

export type PlatformTrendSummary = {
  window: TrendWindow;
  generatedAt: string;
  metricsAnalyzed: number;
  regressions: TrendAnalysis[];
  improvements: TrendAnalysis[];
  stableMetrics: number;
  insufficientDataMetrics: number;
};

/** Analyze all known metrics over a given window and return a summary. */
export function getPlatformTrendSummary(window: TrendWindow = "7d"): PlatformTrendSummary {
  const knownMetrics = [
    { id: "completion.questions",      lowerIsBetter: false },
    { id: "completion.flashcards",     lowerIsBetter: false },
    { id: "completion.lessons",        lowerIsBetter: false },
    { id: "completion.cat",            lowerIsBetter: false },
    { id: "abandonment.questions",     lowerIsBetter: true  },
    { id: "abandonment.flashcards",    lowerIsBetter: true  },
    { id: "friction.avg-score",        lowerIsBetter: true  },
    { id: "remediation.success-rate",  lowerIsBetter: false },
    { id: "feature.health-score",      lowerIsBetter: false },
    { id: "performance.p95-dashboard", lowerIsBetter: true  },
    { id: "seo.published-blogs",       lowerIsBetter: false },
  ];

  const analyses = knownMetrics.map((m) =>
    analyzeTrend(m.id, window, { lowerIsBetter: m.lowerIsBetter }),
  );

  return {
    window,
    generatedAt: new Date().toISOString(),
    metricsAnalyzed: analyses.length,
    regressions: analyses.filter((a) => a.direction === "declining" && a.alerts.length > 0),
    improvements: analyses.filter((a) => a.direction === "improving"),
    stableMetrics: analyses.filter((a) => a.direction === "stable").length,
    insufficientDataMetrics: analyses.filter((a) => a.direction === "insufficient-data").length,
  };
}

export function resetTrendAnalytics(): void {
  metricsStore.clear();
}

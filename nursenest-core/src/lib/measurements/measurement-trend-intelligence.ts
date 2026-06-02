/**
 * Trend intelligence V2 — multi-point trajectories for bedside educational cognition.
 */
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";

export type TrendTrajectory =
  | "stable"
  | "improving"
  | "worsening"
  | "volatile"
  | "acute_change";

export type TrendIntelligenceResult = {
  trajectory: TrendTrajectory;
  /** Absolute change from first to last point (SI). */
  deltaSi: number;
  /** Percent change when baseline > 0. */
  percentChange: number | null;
  /** Educational priority 0–100 for remediation/coaching ordering. */
  priorityScore: number;
  summary: string;
  escalationCue: string | null;
  monitoringCue: string | null;
  coachingCue: string | null;
};

/** V3 — trajectory confidence, acceleration, rebound, monitoring urgency. */
export type TrendIntelligenceV3Result = TrendIntelligenceResult & {
  trajectoryConfidence: number;
  deteriorationAcceleration: number | null;
  reboundInstability: boolean;
  oscillationDetected: boolean;
  interventionResponseCue: string | null;
  monitoringUrgencyScore: number;
  reassessmentIntervalMinutes: number | null;
  clinicalContext: "icu" | "renal" | "sepsis" | "hemodynamic" | "insulin" | "electrolyte" | "general";
};

export function analyzeTrendSeriesV3(args: {
  category: MeasurementCategory;
  valuesSi: number[];
  kind?: string;
}): TrendIntelligenceV3Result | null {
  const base = analyzeTrendSeries(args);
  if (!base) return null;

  const values = args.valuesSi.filter((v) => Number.isFinite(v));
  const deltas = values.slice(1).map((v, i) => v - values[i]!);
  const deteriorationAcceleration =
    deltas.length >= 2
      ? deltas[deltas.length - 1]! - deltas[deltas.length - 2]!
      : null;

  const signFlips = deltas.slice(1).filter((d, i) => d !== 0 && deltas[i] !== 0 && Math.sign(d) !== Math.sign(deltas[i]!)).length;
  const oscillationDetected = signFlips >= 1 && values.length >= 4;

  const first = values[0]!;
  const last = values[values.length - 1]!;
  const reboundInstability =
    base.trajectory === "improving" &&
    values.length >= 3 &&
    last > values[values.length - 2]! &&
    first < last;

  let trajectoryConfidence = 0.55;
  if (values.length >= 4) trajectoryConfidence += 0.2;
  if (Math.abs(base.deltaSi) > (acuteChangeThreshold(args.category, args.kind) ?? 1)) {
    trajectoryConfidence += 0.15;
  }
  trajectoryConfidence = Math.min(0.95, trajectoryConfidence);

  const monitoringUrgencyScore = Math.min(
    100,
    base.priorityScore +
      (oscillationDetected ? 10 : 0) +
      (reboundInstability ? 8 : 0) +
      (deteriorationAcceleration != null && deteriorationAcceleration > 0 ? 12 : 0),
  );

  const reassessmentIntervalMinutes = reassessmentSemantics(args.category, base.trajectory, monitoringUrgencyScore);
  const clinicalContext = clinicalContextFor(args.category, args.kind);
  const interventionResponseCue = interventionResponseFor(args.category, base.trajectory, reboundInstability);

  return {
    ...base,
    trajectoryConfidence,
    deteriorationAcceleration,
    reboundInstability,
    oscillationDetected,
    interventionResponseCue,
    monitoringUrgencyScore,
    reassessmentIntervalMinutes,
    clinicalContext,
  };
}

export function analyzeTrendSeries(args: {
  category: MeasurementCategory;
  valuesSi: number[];
  kind?: string;
}): TrendIntelligenceResult | null {
  const values = args.valuesSi.filter((v) => Number.isFinite(v));
  if (values.length < 2) return null;

  const first = values[0]!;
  const last = values[values.length - 1]!;
  const deltaSi = last - first;
  const percentChange = first !== 0 ? ((last - first) / Math.abs(first)) * 100 : null;

  let trajectory: TrendTrajectory = "stable";
  if (Math.abs(deltaSi) < 1e-6) {
    trajectory = "stable";
  } else if (deltaSi > 0) {
    trajectory = "worsening";
  } else {
    trajectory = "improving";
  }

  if (values.length >= 3) {
    const signs = values.slice(1).map((v, i) => Math.sign(v - values[i]!));
    const flips = signs.slice(1).filter((s, i) => s !== 0 && signs[i] !== 0 && s !== signs[i]!).length;
    if (flips >= 1) trajectory = "volatile";
  }

  const acuteThreshold = acuteChangeThreshold(args.category, args.kind);
  if (acuteThreshold != null && Math.abs(deltaSi) >= acuteThreshold) {
    trajectory = trajectory === "improving" ? "acute_change" : "worsening";
    if (Math.abs(percentChange ?? 0) >= 15) trajectory = "acute_change";
  }

  const priorityScore = scoreTrendPriority({
    category: args.category,
    trajectory,
    lastValueSi: last,
    deltaSi,
  });

  const summary = buildTrendSummary(args.category, trajectory, deltaSi);
  const escalationCue = escalationForTrend(args.category, trajectory, last);
  const monitoringCue =
    trajectory === "worsening" || trajectory === "acute_change"
      ? "Trend direction warrants reassessment interval per protocol — document serial values."
      : null;
  const coachingCue = coachingForWeakPattern(args.category, trajectory);

  return {
    trajectory,
    deltaSi,
    percentChange,
    priorityScore,
    summary,
    escalationCue,
    monitoringCue,
    coachingCue,
  };
}

function acuteChangeThreshold(category: MeasurementCategory, kind?: string): number | null {
  if (category === "electrolytes" && kind === "potassium") return 0.6;
  if (category === "electrolytes" && kind === "sodium") return 4;
  if (category === "electrolytes" && kind === "creatinine") return 30;
  if (category === "glucose") return 3;
  return null;
}

function scoreTrendPriority(args: {
  category: MeasurementCategory;
  trajectory: TrendTrajectory;
  lastValueSi: number;
  deltaSi: number;
}): number {
  let score = 40;
  if (args.trajectory === "worsening" || args.trajectory === "acute_change") score += 30;
  if (args.trajectory === "volatile") score += 15;
  if (args.category === "electrolytes" && args.lastValueSi >= 6.0) score += 25;
  if (args.category === "glucose" && args.lastValueSi < 3.5) score += 25;
  if (args.category === "abg" || args.category === "hemodynamics") score += 20;
  return Math.min(100, score);
}

function buildTrendSummary(
  category: MeasurementCategory,
  trajectory: TrendTrajectory,
  deltaSi: number,
): string {
  const dir =
    trajectory === "improving"
      ? "improving"
      : trajectory === "worsening" || trajectory === "acute_change"
        ? "worsening"
        : trajectory === "volatile"
          ? "volatile"
          : "stable";
  if (category === "electrolytes" && dir === "worsening" && deltaSi > 0) {
    return "Electrolyte trend is worsening — prioritize cardiac and renal context before isolated correction.";
  }
  if (category === "glucose" && dir === "worsening" && deltaSi < 0) {
    return "Glucose trend is falling — hypoglycemia risk may precede symptoms.";
  }
  return `Clinical trend is ${dir} across serial measurements.`;
}

function escalationForTrend(
  category: MeasurementCategory,
  trajectory: TrendTrajectory,
  lastValueSi: number,
): string | null {
  if (trajectory !== "worsening" && trajectory !== "acute_change") return null;
  if (category === "electrolytes" && lastValueSi >= 6.0) {
    return "Escalate per hyperkalemia protocol — ECG and provider notification when critical.";
  }
  if (category === "glucose" && lastValueSi < 3.0) {
    return "Treat hypoglycemia per protocol and reassess neurologic status.";
  }
  if (category === "hemodynamics") {
    return "Worsening perfusion trends require MAP, urine output, and lactate context.";
  }
  return null;
}

function coachingForWeakPattern(
  category: MeasurementCategory,
  trajectory: TrendTrajectory,
): string | null {
  if (trajectory === "volatile") {
    return "Volatile trends often reflect treatment response or instability — practice serial interpretation drills.";
  }
  if (category === "electrolytes" && trajectory === "worsening") {
    return "Remediation: electrolyte trend recognition → ECG → prioritization sequence.";
  }
  return null;
}

function reassessmentSemantics(
  category: MeasurementCategory,
  trajectory: TrendTrajectory,
  urgency: number,
): number | null {
  if (trajectory === "stable") return null;
  if (urgency >= 85) return 15;
  if (urgency >= 65) return 30;
  if (category === "glucose" || category === "hemodynamics") return 60;
  return 120;
}

function clinicalContextFor(
  category: MeasurementCategory,
  kind?: string,
): TrendIntelligenceV3Result["clinicalContext"] {
  if (category === "hemodynamics") return "hemodynamic";
  if (category === "glucose") return "insulin";
  if (category === "electrolytes" && kind === "creatinine") return "renal";
  if (category === "electrolytes") return "electrolyte";
  if (category === "abg") return "sepsis";
  return "general";
}

function interventionResponseFor(
  category: MeasurementCategory,
  trajectory: TrendTrajectory,
  rebound: boolean,
): string | null {
  if (rebound && category === "electrolytes") {
    return "Rebound after correction may still carry cardiac risk — continue serial monitoring.";
  }
  if (trajectory === "improving" && category === "glucose") {
    return "Document insulin or intake response; avoid overtreatment rebound.";
  }
  if (trajectory === "worsening" && category === "hemodynamics") {
    return "Perfusion trend guides fluid and vasopressor reassessment per order set.";
  }
  return null;
}

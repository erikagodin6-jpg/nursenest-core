/**
 * High-risk measurement safety governance — blocks unsafe display assumptions.
 */
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";

export type MeasurementSafetyTier = "standard" | "elevated" | "blocked_conversion";

export type SafetyGovernanceResult = {
  tier: MeasurementSafetyTier;
  allowDualEquivalent: boolean;
  allowCrossSystemConversion: boolean;
  warning: string | null;
  cognitiveAnchoringRisk: boolean;
};

const HIGH_RISK_CATEGORIES: ReadonlySet<MeasurementCategory> = new Set([
  "drug_dosage",
  "hemodynamics",
  "abg",
  "pediatric_dosing",
]);

const ELEVATED_RISK_CATEGORIES: ReadonlySet<MeasurementCategory> = new Set([
  "electrolytes",
  "glucose",
]);

const BLOCKED_ANNOTATIONS = new Set([
  "insulin",
  "vasopressor",
  "infusion",
  "heparin",
  "anticoagulation",
]);

export function assessMeasurementSafety(args: {
  category: MeasurementCategory;
  annotation?: string | null;
  authoredSystem: string;
  renderedSystem: string;
}): SafetyGovernanceResult {
  const ann = (args.annotation ?? "").toLowerCase();
  const conversionRequested = args.authoredSystem !== args.renderedSystem;

  if (HIGH_RISK_CATEGORIES.has(args.category) || [...BLOCKED_ANNOTATIONS].some((a) => ann.includes(a))) {
    return {
      tier: "blocked_conversion",
      allowDualEquivalent: false,
      allowCrossSystemConversion: false,
      warning:
        "This measurement class must display in its authored clinical frame. Unit toggle does not rewrite dosing, ABG, or hemodynamic values.",
      cognitiveAnchoringRisk: true,
    };
  }

  if (ELEVATED_RISK_CATEGORIES.has(args.category) && conversionRequested) {
    return {
      tier: "elevated",
      allowDualEquivalent: false,
      allowCrossSystemConversion: true,
      warning:
        "Converted display is for learning comparison only — do not anchor clinical decisions on the converted equivalent.",
      cognitiveAnchoringRisk: true,
    };
  }

  return {
    tier: "standard",
    allowDualEquivalent: true,
    allowCrossSystemConversion: true,
    warning: null,
    cognitiveAnchoringRisk: false,
  };
}

export function isHighRiskMeasurementCategory(category: MeasurementCategory): boolean {
  return HIGH_RISK_CATEGORIES.has(category);
}

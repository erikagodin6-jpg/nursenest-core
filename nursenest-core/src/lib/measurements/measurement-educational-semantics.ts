/**
 * Educational semantics layered on clinical measurements (pathway-aware, non-diagnostic).
 */
import type {
  ClinicalMeasurementSystem,
  MeasurementCategory,
  MeasurementContext,
} from "@/lib/measurements/measurement-domain";

export type EducationalSeverity = "normal" | "watch" | "urgent" | "critical";

export type InstructionalImportance =
  | "foundational"
  | "exam_high_yield"
  | "bedside_priority"
  | "trend_dependent";

export type CognitiveComplexity = "recall" | "interpretation" | "integration" | "clinical_judgment";

const SEVERITY_PRIORITY: Record<EducationalSeverity, number> = {
  normal: 25,
  watch: 45,
  urgent: 70,
  critical: 92,
};

export function scoreRemediationPriority(semantics: MeasurementEducationalSemantics): number {
  let score = SEVERITY_PRIORITY[semantics.severity];
  if (semantics.criticalValueSignificance) score += 8;
  if (semantics.bedsideUrgency) score += 6;
  if (semantics.trendImportant) score += 4;
  if (semantics.instructionalImportance === "bedside_priority") score += 5;
  return Math.min(100, score);
}

export function cognitiveComplexityForSemantics(
  semantics: MeasurementEducationalSemantics,
): CognitiveComplexity {
  if (semantics.bedsideUrgency && semantics.criticalValueSignificance) return "clinical_judgment";
  if (semantics.trendImportant) return "integration";
  if (semantics.interpretationHint) return "interpretation";
  return "recall";
}

export type MeasurementEducationalSemantics = {
  severity: EducationalSeverity;
  instructionalImportance: InstructionalImportance;
  criticalValueSignificance: boolean;
  trendImportant: boolean;
  bedsideUrgency: boolean;
  nclexRelevance: boolean;
  delegationImplication: boolean;
  medicationMonitoringRelevance: boolean;
  prioritizationHint: string | null;
  safetyAlert: string | null;
  interpretationHint: string | null;
};

export type EducationalSemanticsInput = {
  category: MeasurementCategory;
  kind?: string;
  valueSi: number;
  lowSi?: number;
  highSi?: number;
  annotation?: string | null;
  measurementContext: MeasurementContext;
  instructionalSystem: ClinicalMeasurementSystem;
};

export function resolveEducationalSemantics(
  input: EducationalSemanticsInput,
): MeasurementEducationalSemantics {
  const ann = (input.annotation ?? "").toLowerCase();
  const forcedCritical = ann.includes("critical") || ann.includes("urgent");

  if (input.category === "glucose") {
    if (input.valueSi < 3.9 || forcedCritical && input.valueSi < 4) {
      return pack({
        severity: input.valueSi < 3.0 ? "critical" : "urgent",
        instructionalImportance: "bedside_priority",
        criticalValueSignificance: true,
        bedsideUrgency: true,
        nclexRelevance: true,
        medicationMonitoringRelevance: true,
        prioritizationHint: "Treat neurologic symptoms and recheck glucose; consider D50 per protocol.",
        safetyAlert: "Hypoglycemia requires immediate assessment and escalation.",
        interpretationHint: "Glucose below target may indicate insulin effect, poor intake, or sepsis stress.",
      });
    }
    if (input.valueSi > 11.1) {
      return pack({
        severity: input.valueSi > 20 ? "critical" : "watch",
        instructionalImportance: "exam_high_yield",
        criticalValueSignificance: input.valueSi > 13.9,
        nclexRelevance: true,
        interpretationHint: "Persistent hyperglycemia warrants assessment for DKA/HHS risk and medication review.",
      });
    }
  }

  if (input.category === "electrolytes" && (input.kind === "potassium" || !input.kind)) {
    if (input.valueSi >= 6.0 || forcedCritical) {
      return pack({
        severity: input.valueSi >= 6.5 ? "critical" : "urgent",
        instructionalImportance: "bedside_priority",
        criticalValueSignificance: true,
        bedsideUrgency: true,
        nclexRelevance: true,
        medicationMonitoringRelevance: true,
        prioritizationHint: "Cardiac monitoring and ECG review are priorities with severe hyperkalemia.",
        safetyAlert: "Potassium ≥6.0 mmol/L may require urgent cardiac monitoring.",
        interpretationHint: "Consider ECG changes, renal function, and contributing medications (ACEi, K+ supplements).",
      });
    }
    if (input.valueSi < 3.0) {
      return pack({
        severity: input.valueSi < 2.5 ? "critical" : "urgent",
        instructionalImportance: "bedside_priority",
        criticalValueSignificance: true,
        bedsideUrgency: true,
        prioritizationHint: "Replace potassium cautiously per protocol; monitor cardiac rhythm.",
        interpretationHint: "Hypokalemia may reflect diuretics, GI losses, or alkalosis.",
      });
    }
  }

  if (input.category === "abg") {
    return pack({
      severity: forcedCritical ? "critical" : "watch",
      instructionalImportance: "bedside_priority",
      criticalValueSignificance: true,
      trendImportant: true,
      bedsideUrgency: true,
      nclexRelevance: true,
      interpretationHint: "Interpret pH with PaCO₂ and HCO₃⁻ together — compensation patterns guide urgency.",
      safetyAlert: "ABG clusters must not be auto-converted between unit conventions.",
    });
  }

  if (input.category === "hemodynamics" || ann.includes("shock")) {
    return pack({
      severity: ann.includes("shock") ? "critical" : "urgent",
      instructionalImportance: "bedside_priority",
      bedsideUrgency: true,
      nclexRelevance: true,
      prioritizationHint: "Assess perfusion, MAP, and response to fluids/vasopressors as ordered.",
      safetyAlert: "Hemodynamic values are context-dependent — avoid cross-system equivalency shortcuts.",
    });
  }

  if (input.category === "drug_dosage" || input.category === "pediatric_dosing") {
    return pack({
      severity: "watch",
      instructionalImportance: "bedside_priority",
      medicationMonitoringRelevance: true,
      delegationImplication: true,
      safetyAlert: "Medication dosing displays must not be converted for exam display convenience.",
      interpretationHint: "Verify weight-based calculations independently of unit toggle.",
    });
  }

  return pack({
    severity: "normal",
    instructionalImportance:
      input.measurementContext === "us" ? "exam_high_yield" : "foundational",
    nclexRelevance: input.measurementContext === "us",
    interpretationHint: null,
  });
}

function pack(
  partial: Partial<MeasurementEducationalSemantics>,
): MeasurementEducationalSemantics {
  return {
    severity: partial.severity ?? "normal",
    instructionalImportance: partial.instructionalImportance ?? "foundational",
    criticalValueSignificance: partial.criticalValueSignificance ?? false,
    trendImportant: partial.trendImportant ?? false,
    bedsideUrgency: partial.bedsideUrgency ?? false,
    nclexRelevance: partial.nclexRelevance ?? false,
    delegationImplication: partial.delegationImplication ?? false,
    medicationMonitoringRelevance: partial.medicationMonitoringRelevance ?? false,
    prioritizationHint: partial.prioritizationHint ?? null,
    safetyAlert: partial.safetyAlert ?? null,
    interpretationHint: partial.interpretationHint ?? null,
  };
}

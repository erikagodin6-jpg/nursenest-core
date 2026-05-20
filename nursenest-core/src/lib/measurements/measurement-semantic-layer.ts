/**
 * Structured semantic linkage — measurements ↔ competency graph ↔ interpretation hubs.
 */
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import type { EducationalSeverity } from "@/lib/measurements/measurement-educational-semantics";
import type { ClinicalInterpretationId } from "@/lib/clinical-interpretation/clinical-interpretation-registry";

export type SemanticEntityKind =
  | "LabValue"
  | "VitalSign"
  | "ClinicalMeasurement"
  | "MedicalEntity"
  | "DrugMonitoring"
  | "InterpretationGuide";

export type ClinicalMeasurementEntity = {
  kind: SemanticEntityKind;
  entityId: string;
  category: MeasurementCategory;
  measurementKind?: string;
  /** RN competency graph topic keys (coaching v3). */
  competencyTopicKeys: string[];
  /** Marketing / interpretation hub slugs when published. */
  interpretationGuideIds: ClinicalInterpretationId[];
  /** Glossary entity keys for cross-linking. */
  glossaryKeys: string[];
  remediationPriority: number;
};

const CATEGORY_COMPETENCY: Partial<Record<MeasurementCategory, string[]>> = {
  glucose: ["glucose_monitoring", "diabetes_acute", "hypoglycemia_response"],
  electrolytes: ["electrolyte_balance", "cardiac_monitoring", "renal_function"],
  abg: ["acid_base_balance", "ventilation_perfusion"],
  hemodynamics: ["shock_perfusion", "fluid_resuscitation"],
  drug_dosage: ["medication_safety", "insulin_administration"],
  pediatric_dosing: ["pediatric_dosing_safety"],
};

const CATEGORY_INTERPRETATION: Partial<Record<MeasurementCategory, ClinicalInterpretationId[]>> = {
  glucose: ["lab-values-explained", "critical-lab-values-nclex"],
  electrolytes: ["electrolyte-interpretation", "critical-lab-values-nclex", "renal-lab-trends"],
  abg: ["abg-interpretation", "acid-base-progression"],
  hemodynamics: ["hemodynamic-interpretation", "sepsis-interpretation"],
  drug_dosage: ["lab-values-explained"],
};

const KIND_OVERRIDES: Record<string, Partial<ClinicalMeasurementEntity>> = {
  potassium: {
    competencyTopicKeys: [
      "hyperkalemia",
      "ecg_interpretation",
      "electrolyte_prioritization",
      "cardiac_instability",
    ],
    interpretationGuideIds: ["electrolyte-interpretation", "ecg-interpretation"],
    glossaryKeys: ["hyperkalemia", "potassium", "ecg_peaked_t_waves"],
    remediationPriority: 90,
  },
  creatinine: {
    competencyTopicKeys: ["acute_kidney_injury", "renal_trends", "medication_review"],
    interpretationGuideIds: ["renal-lab-trends"],
    glossaryKeys: ["creatinine", "aki"],
    remediationPriority: 75,
  },
};

export function toClinicalMeasurementEntity(args: {
  category: MeasurementCategory;
  kind?: string;
  valueSi?: number;
}): ClinicalMeasurementEntity {
  const kind = args.kind ?? "unknown";
  const override = KIND_OVERRIDES[kind];
  const basePriority = severityToRemediationPriority(args.category, kind);
  return {
    kind: entityKindForCategory(args.category),
    entityId: `${args.category}:${kind}`,
    category: args.category,
    measurementKind: kind,
    competencyTopicKeys: override?.competencyTopicKeys ?? CATEGORY_COMPETENCY[args.category] ?? [],
    interpretationGuideIds:
      override?.interpretationGuideIds ?? CATEGORY_INTERPRETATION[args.category] ?? [],
    glossaryKeys: override?.glossaryKeys ?? [kind, args.category],
    remediationPriority: override?.remediationPriority ?? basePriority,
  };
}

export function linkMeasurementToCompetencyGraph(args: {
  category: MeasurementCategory;
  kind?: string;
  severity?: EducationalSeverity;
}): ClinicalMeasurementEntity {
  const entity = toClinicalMeasurementEntity({ category: args.category, kind: args.kind });
  if (args.severity === "critical") {
    entity.remediationPriority = Math.min(100, entity.remediationPriority + 15);
  } else if (args.severity === "urgent") {
    entity.remediationPriority = Math.min(100, entity.remediationPriority + 8);
  }
  return entity;
}

function entityKindForCategory(category: MeasurementCategory): SemanticEntityKind {
  if (category === "drug_dosage" || category === "pediatric_dosing") return "DrugMonitoring";
  if (category === "hemodynamics" || category === "temperature") return "VitalSign";
  if (category === "abg") return "InterpretationGuide";
  return "LabValue";
}

function severityToRemediationPriority(category: MeasurementCategory, kind: string): number {
  if (kind === "potassium") return 85;
  if (category === "glucose") return 70;
  if (category === "abg" || category === "hemodynamics") return 80;
  return 50;
}

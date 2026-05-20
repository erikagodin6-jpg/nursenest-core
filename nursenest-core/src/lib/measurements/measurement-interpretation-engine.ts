/**
 * RN bedside interpretation engine — educational cognition layer (non-diagnostic).
 */
import type { AuthoredMeasurement, MeasurementCategory } from "@/lib/measurements/measurement-domain";
import { convertClinicalMeasurement } from "@/lib/measurements/convert-clinical-measurement";
import {
  resolveEducationalSemantics,
  type MeasurementEducationalSemantics,
} from "@/lib/measurements/measurement-educational-semantics";
import { buildMeasurementClinicalReasoning } from "@/lib/measurements/measurement-clinical-reasoning";
import { analyzeTrendSeries } from "@/lib/measurements/measurement-trend-intelligence";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import { linkMeasurementToCompetencyGraph } from "@/lib/measurements/measurement-semantic-layer";

export type InterpretationDomain =
  | "electrolyte"
  | "acid_base"
  | "renal"
  | "sepsis"
  | "glucose"
  | "hemodynamic"
  | "oxygenation"
  | "pharmacology_monitoring"
  | "general";

export type InterpretationPanel = {
  domain: InterpretationDomain;
  abnormality: "normal" | "abnormal" | "critical";
  display: string;
  prioritization: string[];
  escalation: string | null;
  interventionImplications: string[];
  monitoringRequirements: string[];
  delegationNotes: string[];
  instabilitySignals: string[];
  semantics: MeasurementEducationalSemantics;
  competencyLinks: ReturnType<typeof linkMeasurementToCompetencyGraph>;
  trendSummary: string | null;
};

export function detectAbnormality(args: {
  category: MeasurementCategory;
  valueSi: number;
  annotation?: string | null;
}): InterpretationPanel["abnormality"] {
  const ann = (args.annotation ?? "").toLowerCase();
  if (ann.includes("critical") || ann.includes("shock")) return "critical";
  if (args.category === "electrolytes" && args.valueSi >= 6.0) return "critical";
  if (args.category === "electrolytes" && args.valueSi < 3.0) return "critical";
  if (args.category === "glucose" && (args.valueSi < 3.9 || args.valueSi > 13.9)) return "abnormal";
  if (args.category === "abg" || args.category === "hemodynamics") return "abnormal";
  return "normal";
}

export function resolveInterpretationDomain(
  category: MeasurementCategory,
  kind?: string,
): InterpretationDomain {
  if (category === "glucose") return "glucose";
  if (category === "abg") return "acid_base";
  if (category === "hemodynamics") return "hemodynamic";
  if (category === "drug_dosage" || category === "pediatric_dosing") return "pharmacology_monitoring";
  if (category === "electrolytes") {
    if (kind === "creatinine") return "renal";
    if (kind === "potassium" || kind === "sodium") return "electrolyte";
    return "electrolyte";
  }
  return "general";
}

export function buildInterpretationPanel(args: {
  measurement: AuthoredMeasurement;
  renderedSystem: import("@/lib/measurements/measurement-domain").ClinicalMeasurementSystem;
  pathwayId?: string | null;
  countryCode?: string | null;
  annotation?: string | null;
  trendValuesSi?: number[];
}): InterpretationPanel {
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  const render = convertClinicalMeasurement({
    valueSi: args.measurement.valueSi,
    category: args.measurement.category,
    kind: args.measurement.kind,
    authoredSystem: args.measurement.authoredSystem,
    renderedSystem: args.renderedSystem,
    options: { showEducationalEquivalent: false },
  });
  const reasoning = buildMeasurementClinicalReasoning({
    measurement: args.measurement,
    render,
    pathwayId: args.pathwayId,
    countryCode: args.countryCode,
  });
  const semantics = resolveEducationalSemantics({
    category: args.measurement.category,
    kind: args.measurement.kind,
    valueSi: args.measurement.valueSi,
    lowSi: args.measurement.lowSi,
    highSi: args.measurement.highSi,
    annotation: args.annotation ?? null,
    measurementContext: policy.measurementContext,
    instructionalSystem: policy.instructionalSystem,
  });

  const domain = resolveInterpretationDomain(args.measurement.category, args.measurement.kind);
  const domainFrames = buildDomainFrames(domain, args.measurement, semantics);
  const trend =
    args.trendValuesSi && args.trendValuesSi.length >= 2
      ? analyzeTrendSeries({
          category: args.measurement.category,
          valuesSi: args.trendValuesSi,
          kind: args.measurement.kind,
        })
      : null;

  return {
    domain,
    abnormality: detectAbnormality({
      category: args.measurement.category,
      valueSi: args.measurement.valueSi,
      annotation: args.annotation,
    }),
    display: render.displayPrimary,
    prioritization: domainFrames.prioritization,
    escalation: trend?.escalationCue ?? reasoning.escalationCue,
    interventionImplications: domainFrames.interventions,
    monitoringRequirements: domainFrames.monitoring,
    delegationNotes: domainFrames.delegation,
    instabilitySignals: domainFrames.instability,
    semantics,
    competencyLinks: linkMeasurementToCompetencyGraph({
      category: args.measurement.category,
      kind: args.measurement.kind,
      severity: semantics.severity,
    }),
    trendSummary: trend?.summary ?? null,
  };
}

function buildDomainFrames(
  domain: InterpretationDomain,
  measurement: AuthoredMeasurement,
  semantics: MeasurementEducationalSemantics,
): {
  prioritization: string[];
  interventions: string[];
  monitoring: string[];
  delegation: string[];
  instability: string[];
} {
  const prioritization: string[] = [];
  const interventions: string[] = [];
  const monitoring: string[] = [];
  const delegation: string[] = [];
  const instability: string[] = [];

  if (semantics.prioritizationHint) prioritization.push(semantics.prioritizationHint);

  switch (domain) {
    case "electrolyte":
      prioritization.push("Assess cardiac rhythm and renal contributors before isolated replacement.");
      monitoring.push("Serial electrolytes and ECG when potassium is elevated or rising.");
      if (measurement.valueSi >= 6.0) {
        instability.push("Cardiac conduction risk with severe hyperkalemia.");
        interventions.push("Protocol-driven K+ lowering and cardiac monitoring per order set.");
      }
      break;
    case "acid_base":
      prioritization.push("Interpret pH with PaCO₂ and HCO₃⁻ as a compensation pattern.");
      monitoring.push("Repeat ABG/VBG and correlate with ventilation and perfusion status.");
      instability.push("Mixed or uncompensated acid-base patterns increase instability risk.");
      break;
    case "renal":
      prioritization.push("Trend creatinine with urine output, volume status, and nephrotoxins.");
      monitoring.push("Serial renal panel and medication review.");
      if (measurement.valueSi > 150) {
        instability.push("Acute kidney injury trajectory may require fluid and nephrology escalation.");
      }
      break;
    case "sepsis":
      prioritization.push("Pair lactate trend with perfusion, MAP, and infection source control.");
      monitoring.push("Lactate clearance, urine output, and hemodynamic targets.");
      instability.push("Rising lactate with hypotension suggests escalating sepsis physiology.");
      break;
    case "glucose":
      prioritization.push("Neurologic and perfusion assessment precede isolated number correction.");
      interventions.push("Hypoglycemia protocol when glucose is low or falling rapidly.");
      monitoring.push("Point-of-care glucose serial checks after treatment.");
      break;
    case "hemodynamic":
      prioritization.push("MAP, skin perfusion, mental status, and urine output define shock context.");
      monitoring.push("Continuous pressure monitoring when ordered; document fluid response.");
      instability.push("Hypotension with tachycardia suggests compensated shock decompensation.");
      break;
    case "oxygenation":
      prioritization.push("SpO₂ must be interpreted with work of breathing and ABG when available.");
      monitoring.push("Oxygen delivery device, respiratory rate, and ABG trends.");
      break;
    case "pharmacology_monitoring":
      delegation.push("Verify weight-based calculations independently of display unit toggle.");
      monitoring.push("Therapeutic drug monitoring and adverse effect surveillance per medication class.");
      interventions.push("Never auto-convert insulin, vasopressor, or anticoagulation displays for convenience.");
      break;
    default:
      break;
  }

  if (semantics.delegationImplication) {
    delegation.push("RN scope: implement protocol orders, escalate out-of-range trends to provider.");
  }

  return { prioritization, interventions, monitoring, delegation, instability };
}

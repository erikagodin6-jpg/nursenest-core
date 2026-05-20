/**
 * Pathway-aware educational hints for measurement interpretation (non-blocking UI copy).
 */
import type { MeasurementCategory, MeasurementContext } from "@/lib/measurements/measurement-domain";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";

export type MeasurementEducationalHint = {
  category: MeasurementCategory | "general";
  text: string;
  /** When true, suitable for a single dismissible callout per lesson section. */
  showAsCallout?: boolean;
};

const CONTEXT_HINTS: Partial<Record<MeasurementContext, Partial<Record<MeasurementCategory | "general", string>>>> = {
  canada: {
    electrolytes:
      "Canadian nursing practice and licensure exams typically interpret potassium and sodium in mmol/L (mEq/L).",
    glucose:
      "Canadian clinical settings often use mmol/L for glucose; know US mg/dL equivalents for integrated NCLEX-style items.",
    general:
      "This pathway uses SI (metric) as the instructional measurement frame for Canadian clinical education.",
  },
  us: {
    glucose:
      "NCLEX-style pharmacology and med-surg items frequently use mg/dL for glucose and g/dL for hemoglobin.",
    general:
      "This pathway uses conventional (US customary) units as the primary instructional frame for NCLEX familiarity.",
  },
  global: {
    general: "Allied health content is authored in SI (metric) as the global instructional default.",
  },
};

const PATHWAY_SPECIFIC: Partial<Record<string, string>> = {
  "ca-rpn-rex-pn":
    "REx-PN preparation emphasizes Canadian provincial competencies; electrolytes and labs are taught in mmol/L.",
  "ca-np-cnple":
    "CNPLE clinical scenarios use Canadian measurement conventions (SI) for labs and vital-related reasoning.",
  "us-rn-nclex-rn":
    "NCLEX-RN item banks commonly present glucose in mg/dL and weights in lb; toggle SI when comparing international sources.",
};

export function getMeasurementEducationalHints(args: {
  pathwayId?: string | null;
  countryCode?: string | null;
  categories?: MeasurementCategory[];
  maxHints?: number;
}): MeasurementEducationalHint[] {
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  const max = args.maxHints ?? 2;
  const hints: MeasurementEducationalHint[] = [];

  const pathwayLine = args.pathwayId ? PATHWAY_SPECIFIC[args.pathwayId] : undefined;
  if (pathwayLine) {
    hints.push({ category: "general", text: pathwayLine, showAsCallout: true });
  }

  const ctxHints = CONTEXT_HINTS[policy.measurementContext] ?? {};
  const general = ctxHints.general;
  if (general && hints.length < max) {
    hints.push({ category: "general", text: general });
  }

  const cats = args.categories ?? ["glucose", "electrolytes"];
  for (const cat of cats) {
    if (hints.length >= max) break;
    const line = ctxHints[cat];
    if (line) hints.push({ category: cat, text: line });
  }

  return hints.slice(0, max);
}

/** Integration hook for lab / ECG / mechanism surfaces. */
export function measurementHintForClinicalTopic(args: {
  topic: "hyperkalemia_ecg" | "hypoglycemia" | "lab_panel" | "mechanism";
  pathwayId?: string | null;
  countryCode?: string | null;
}): string | null {
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  switch (args.topic) {
    case "hyperkalemia_ecg":
      return policy.measurementContext === "canada"
        ? "Hyperkalemia ECG changes become clinically significant as serum potassium rises above expected physiologic ranges (mmol/L)."
        : "Hyperkalemia ECG changes become clinically significant as serum potassium rises — know your pathway’s expected unit frame (mmol/L vs mEq/L).";
    case "hypoglycemia":
      return policy.instructionalSystem === "si"
        ? "Treat and interpret hypoglycemia thresholds in mmol/L unless an item explicitly uses mg/dL."
        : "NCLEX-style items often cite glucose in mg/dL; use the unit toggle when reviewing SI-authored supplements.";
    case "lab_panel":
      return policy.measurementContext === "canada"
        ? "Canadian lab interpretation references typically use SI units for chemistry panels."
        : null;
    case "mechanism":
      return null;
    default:
      return null;
  }
}

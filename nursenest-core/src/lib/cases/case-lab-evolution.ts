/**
 * Longitudinal lab evolution helpers.
 *
 * Simulates how lab values change over time in response to medications
 * and clinical decisions. Used to make lab panels coherent across case steps.
 *
 * All values are directional indicators — not authoritative clinical ranges.
 * Canadian reference ranges used where they differ from US standards.
 */
import type { DiagnosticArtifact } from "@/lib/cases/longitudinal-case-types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LabValue = {
  test: string;
  value: number;
  unit: string;
  referenceRange: string;
  flag?: "H" | "L" | "C";
};

export type LabTrend = {
  test: string;
  values: Array<{ stepIndex: number; value: number; unit: string; flag?: "H" | "L" | "C" }>;
  direction: "improving" | "stable" | "worsening";
  clinicalNote?: string;
};

export type MedicationEffect = {
  drugPattern: RegExp;
  labEffects: Array<{
    test: string;
    directionPerStep: number;  // Change per step (positive = increase)
    unit: string;
    minValue?: number;
    maxValue?: number;
  }>;
};

// ── Medication → lab effect map ───────────────────────────────────────────────

/**
 * Known medication effects on common lab values.
 * Values are approximate directional guides for simulation only.
 */
export const MEDICATION_LAB_EFFECTS: MedicationEffect[] = [
  {
    drugPattern: /ACE inhibitor|ramipril|lisinopril|enalapril|perindopril/i,
    labEffects: [
      { test: "Creatinine",    directionPerStep: +4,     unit: "µmol/L",      minValue: 45 },
      { test: "eGFR",          directionPerStep: -2,     unit: "mL/min/1.73m²", minValue: 15 },
      { test: "K+",            directionPerStep: +0.1,   unit: "mmol/L",      maxValue: 6.0 },
    ],
  },
  {
    drugPattern: /ARB|losartan|valsartan|candesartan|telmisartan/i,
    labEffects: [
      { test: "Creatinine",    directionPerStep: +3,     unit: "µmol/L",      minValue: 45 },
      { test: "K+",            directionPerStep: +0.1,   unit: "mmol/L",      maxValue: 5.8 },
    ],
  },
  {
    drugPattern: /SGLT2|canagliflozin|empagliflozin|dapagliflozin/i,
    labEffects: [
      { test: "eGFR",          directionPerStep: -3,     unit: "mL/min/1.73m²", minValue: 20 },  // Initial haemodynamic dip
      { test: "HbA1c",         directionPerStep: -0.4,   unit: "%",           minValue: 5.5 },
      { test: "UACR",          directionPerStep: -0.4,   unit: "mg/mmol",     minValue: 0 },
    ],
  },
  {
    drugPattern: /statin|atorvastatin|rosuvastatin|simvastatin|pravastatin/i,
    labEffects: [
      { test: "LDL-C",         directionPerStep: -0.35,  unit: "mmol/L",      minValue: 0.5 },
      { test: "Total-C",       directionPerStep: -0.4,   unit: "mmol/L",      minValue: 2.0 },
    ],
  },
  {
    drugPattern: /metformin/i,
    labEffects: [
      { test: "HbA1c",         directionPerStep: -0.3,   unit: "%",           minValue: 5.5 },
    ],
  },
  {
    drugPattern: /GLP-1|semaglutide|liraglutide|dulaglutide/i,
    labEffects: [
      { test: "HbA1c",         directionPerStep: -0.5,   unit: "%",           minValue: 5.5 },
      { test: "Weight",        directionPerStep: -1.2,   unit: "kg",          minValue: 40  },
    ],
  },
  {
    drugPattern: /insulin/i,
    labEffects: [
      { test: "HbA1c",         directionPerStep: -0.6,   unit: "%",           minValue: 5.5 },
    ],
  },
  {
    drugPattern: /amlodipine|nifedipine|felodipine/i,
    labEffects: [
      // Calcium channel blockers: no direct lab effects; may worsen ankle oedema
      // (not a lab marker, handled in trajectory narrative)
    ],
  },
  {
    drugPattern: /warfarin/i,
    labEffects: [
      { test: "INR",           directionPerStep: +0.3,   unit: "",            maxValue: 5.0 },
    ],
  },
  {
    drugPattern: /prednisone|methylprednisolone|corticosteroid/i,
    labEffects: [
      { test: "Blood glucose", directionPerStep: +1.2,   unit: "mmol/L",      maxValue: 20.0 },
      { test: "HbA1c",         directionPerStep: +0.3,   unit: "%",           maxValue: 14.0 },
    ],
  },
];

// ── Untreated disease → lab deterioration ────────────────────────────────────

export type DiseaseLabEffect = {
  diseasePattern: RegExp;
  labEffects: Array<{
    test: string;
    directionPerStep: number;
    unit: string;
    minValue?: number;
    maxValue?: number;
  }>;
};

export const UNTREATED_DISEASE_LAB_EFFECTS: DiseaseLabEffect[] = [
  {
    diseasePattern: /uncontrolled.*diabetes|diabetes.*uncontrolled|high.*A1C|elevated.*A1C/i,
    labEffects: [
      { test: "HbA1c",         directionPerStep: +0.25,  unit: "%",           maxValue: 14.0 },
      { test: "Blood glucose", directionPerStep: +0.5,   unit: "mmol/L",      maxValue: 20.0 },
      { test: "UACR",          directionPerStep: +0.3,   unit: "mg/mmol",     maxValue: 300  },
    ],
  },
  {
    diseasePattern: /uncontrolled.*hypertension|hypertension.*uncontrolled|elevated.*BP|high.*BP/i,
    labEffects: [
      { test: "Creatinine",    directionPerStep: +3,     unit: "µmol/L",      minValue: 45 },
      { test: "eGFR",          directionPerStep: -2,     unit: "mL/min/1.73m²", minValue: 10 },
    ],
  },
  {
    diseasePattern: /infection.*untreated|sepsis|cellulitis|pneumonia/i,
    labEffects: [
      { test: "WBC",           directionPerStep: +3,     unit: "×10⁹/L",      maxValue: 40 },
      { test: "CRP",           directionPerStep: +30,    unit: "mg/L",        maxValue: 400 },
      { test: "Lactate",       directionPerStep: +0.5,   unit: "mmol/L",      maxValue: 10 },
    ],
  },
  {
    diseasePattern: /untreated.*dyslipidemia|elevated.*LDL|high.*cholesterol/i,
    labEffects: [
      { test: "LDL-C",         directionPerStep: +0.1,   unit: "mmol/L",      maxValue: 10 },
    ],
  },
];

// ── Lab mutation helpers ──────────────────────────────────────────────────────

/**
 * Applies medication effects to a lab panel, returning mutated values.
 * @param labValues     Current lab values (from the previous step)
 * @param medications   Active medication names
 * @param stepsSinceStart  Number of case steps elapsed (for compounding)
 */
export function applyMedicationEffectsToLabs(
  labValues: Record<string, number>,
  medications: string[],
  stepsElapsed: number,
): Record<string, number> {
  const result = { ...labValues };

  for (const med of medications) {
    for (const effect of MEDICATION_LAB_EFFECTS) {
      if (!effect.drugPattern.test(med)) continue;
      for (const labEffect of effect.labEffects) {
        const current = result[labEffect.test];
        if (current === undefined) continue;
        const change = labEffect.directionPerStep * stepsElapsed;
        let next = current + change;
        if (labEffect.minValue !== undefined) next = Math.max(labEffect.minValue, next);
        if (labEffect.maxValue !== undefined) next = Math.min(labEffect.maxValue, next);
        result[labEffect.test] = Math.round(next * 100) / 100;
      }
    }
  }

  return result;
}

/**
 * Applies untreated disease effects to labs, simulating deterioration
 * when a harmful/suboptimal decision leaves a condition unmanaged.
 */
export function applyDiseaseEffectsToLabs(
  labValues: Record<string, number>,
  unresolvedIssueLabels: string[],
  stepsElapsed: number,
): Record<string, number> {
  const result = { ...labValues };

  for (const issue of unresolvedIssueLabels) {
    for (const effect of UNTREATED_DISEASE_LAB_EFFECTS) {
      if (!effect.diseasePattern.test(issue)) continue;
      for (const labEffect of effect.labEffects) {
        const current = result[labEffect.test];
        if (current === undefined) continue;
        const change = labEffect.directionPerStep * stepsElapsed;
        let next = current + change;
        if (labEffect.minValue !== undefined) next = Math.max(labEffect.minValue, next);
        if (labEffect.maxValue !== undefined) next = Math.min(labEffect.maxValue, next);
        result[labEffect.test] = Math.round(next * 100) / 100;
      }
    }
  }

  return result;
}

// ── Trend direction ───────────────────────────────────────────────────────────

/**
 * Computes trend direction from a sequence of numeric values.
 * Requires at least 2 data points.
 */
export function computeLabTrendDirection(
  values: number[],
  higherIsBetter: boolean,
): "improving" | "stable" | "worsening" {
  if (values.length < 2) return "stable";
  const first = values[0]!;
  const last = values[values.length - 1]!;
  const delta = last - first;
  const threshold = Math.abs(first) * 0.05; // 5% change threshold

  if (Math.abs(delta) < threshold) return "stable";
  const improving = higherIsBetter ? delta > 0 : delta < 0;
  return improving ? "improving" : "worsening";
}

/** Tests for which direction is "better" (higher or lower) by lab test name. */
export function higherIsBetterFor(testName: string): boolean {
  const higherBetter = /eGFR|Hb\b|hemoglobin|haemoglobin|platelets/i;
  return higherBetter.test(testName);
}

// ── Artifact evolution ────────────────────────────────────────────────────────

/**
 * Evolves a prior lab panel artifact to reflect medication and disease effects.
 * Returns a new artifact with updated values.
 * Does not mutate the input.
 */
export function evolveLabs(
  priorArtifact: DiagnosticArtifact,
  activeMedications: string[],
  unresolvedIssueLabels: string[],
  stepsElapsed: number,
): DiagnosticArtifact {
  if (!priorArtifact.values || priorArtifact.type !== "lab_panel") return priorArtifact;

  // Build numeric map
  const numericMap: Record<string, number> = {};
  for (const v of priorArtifact.values) {
    const num = parseFloat(v.value);
    if (!isNaN(num)) numericMap[v.test] = num;
  }

  // Apply effects
  let updated = applyMedicationEffectsToLabs(numericMap, activeMedications, stepsElapsed);
  updated = applyDiseaseEffectsToLabs(updated, unresolvedIssueLabels, stepsElapsed);

  // Rebuild values array
  const newValues = priorArtifact.values.map((v) => {
    const newNum = updated[v.test];
    if (newNum === undefined || isNaN(newNum)) return v;
    return {
      ...v,
      value: String(newNum),
      flag: deriveLabFlag(v.test, newNum, v.referenceRange),
    };
  });

  return { ...priorArtifact, values: newValues };
}

// ── Flag derivation ───────────────────────────────────────────────────────────

function deriveLabFlag(
  testName: string,
  value: number,
  referenceRange: string | undefined,
): "H" | "L" | "C" | undefined {
  if (!referenceRange) return undefined;

  // Try to parse "low–high" reference range
  const match = referenceRange.match(/([\d.]+)[–\-]([\d.]+)/);
  if (!match) return undefined;
  const low = parseFloat(match[1]!);
  const high = parseFloat(match[2]!);
  if (isNaN(low) || isNaN(high)) return undefined;

  // Critical thresholds for key tests
  if (testName === "K+" && (value < 3.0 || value > 6.0)) return "C";
  if (testName === "eGFR" && value < 15) return "C";
  if (testName === "Creatinine" && value > 300) return "C";
  if (testName === "HbA1c" && value > 12) return "C";

  if (value < low) return "L";
  if (value > high) return "H";
  return undefined;
}

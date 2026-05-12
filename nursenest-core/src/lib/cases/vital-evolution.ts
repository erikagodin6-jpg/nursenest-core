/**
 * Vital sign evolution engine.
 *
 * Computes how BP, HR, RR, SpO2, and Temperature evolve across case steps
 * based on active medications and unresolved clinical issues.
 *
 * All changes are directional guides for simulation — not physiological models.
 * Values are clamped to plausible ranges.
 */
import type { VitalReading, EvolvedVitalReading } from "@/lib/cases/longitudinal-case-types";

// ── Internal numeric vital state ──────────────────────────────────────────────

export type NumericVitalState = Record<string, number>;

export type VitalMedicationEffect = {
  drugPattern: RegExp;
  effects: Array<{
    vital: string;
    directionPerStep: number;
    minValue?: number;
    maxValue?: number;
  }>;
};

export type VitalDiseaseEffect = {
  diseasePattern: RegExp;
  effects: Array<{
    vital: string;
    directionPerStep: number;
    minValue?: number;
    maxValue?: number;
  }>;
};

// ── Plausible vital ranges ────────────────────────────────────────────────────

const VITAL_CLAMP: Record<string, { min: number; max: number }> = {
  HR:        { min: 25,  max: 250 },
  RR:        { min: 5,   max: 60  },
  SpO2:      { min: 60,  max: 100 },
  Temp:      { min: 33,  max: 43  },
  SBP:       { min: 55,  max: 270 },
  DBP:       { min: 30,  max: 160 },
};

// ── Medication → vital effect map ─────────────────────────────────────────────

export const MEDICATION_VITAL_EFFECTS: VitalMedicationEffect[] = [
  {
    drugPattern: /beta.?blocker|metoprolol|bisoprolol|carvedilol|atenolol|propranolol/i,
    effects: [
      { vital: "HR",  directionPerStep: -4,   minValue: 45 },
      { vital: "SBP", directionPerStep: -4,   minValue: 90 },
      { vital: "DBP", directionPerStep: -3,   minValue: 55 },
    ],
  },
  {
    drugPattern: /ACE inhibitor|ramipril|lisinopril|enalapril|perindopril/i,
    effects: [
      { vital: "SBP", directionPerStep: -5,   minValue: 95 },
      { vital: "DBP", directionPerStep: -3,   minValue: 55 },
    ],
  },
  {
    drugPattern: /ARB|losartan|valsartan|candesartan|telmisartan/i,
    effects: [
      { vital: "SBP", directionPerStep: -5,   minValue: 95 },
      { vital: "DBP", directionPerStep: -3,   minValue: 55 },
    ],
  },
  {
    drugPattern: /calcium channel blocker|amlodipine|nifedipine|diltiazem|verapamil/i,
    effects: [
      { vital: "SBP", directionPerStep: -4,   minValue: 95 },
      { vital: "HR",  directionPerStep: -2,   minValue: 50 },
    ],
  },
  {
    drugPattern: /diuretic|furosemide|hydrochlorothiazide|HCTZ|chlorthalidone|indapamide/i,
    effects: [
      { vital: "SBP", directionPerStep: -4,   minValue: 90 },
      { vital: "DBP", directionPerStep: -2,   minValue: 55 },
    ],
  },
  {
    drugPattern: /antibiotic|amoxicillin|azithromycin|cephalexin|ciprofloxacin|trimethoprim|clindamycin/i,
    effects: [
      { vital: "Temp", directionPerStep: -0.4, minValue: 36.0 },
      { vital: "HR",   directionPerStep: -4,   minValue: 55   },
      { vital: "RR",   directionPerStep: -2,   minValue: 12   },
    ],
  },
  {
    drugPattern: /bronchodilator|salbutamol|albuterol|ipratropium|formoterol|salmeterol/i,
    effects: [
      { vital: "SpO2", directionPerStep: +2,   maxValue: 99 },
      { vital: "RR",   directionPerStep: -2,   minValue: 12 },
      { vital: "HR",   directionPerStep: +3,   maxValue: 110 },  // Salbutamol tachycardia
    ],
  },
  {
    drugPattern: /oxygen|supplemental O2|O2 therapy/i,
    effects: [
      { vital: "SpO2", directionPerStep: +3,   maxValue: 99 },
    ],
  },
  {
    drugPattern: /IV fluid|normal saline|Ringer|crystalloid|fluid resuscitation/i,
    effects: [
      { vital: "SBP", directionPerStep: +10,  maxValue: 145 },
      { vital: "DBP", directionPerStep: +5,   maxValue: 90  },
      { vital: "HR",  directionPerStep: -6,   minValue: 55  },
    ],
  },
  {
    drugPattern: /corticosteroid|prednisone|dexamethasone|hydrocortisone|methylprednisolone/i,
    effects: [
      { vital: "SBP", directionPerStep: +4,   maxValue: 165 },
      { vital: "HR",  directionPerStep: +3,   maxValue: 100 },
    ],
  },
  {
    drugPattern: /opioid|morphine|hydromorphone|fentanyl|codeine|oxycodone/i,
    effects: [
      { vital: "HR",   directionPerStep: -3,  minValue: 45 },
      { vital: "RR",   directionPerStep: -2,  minValue: 8  },
      { vital: "SBP",  directionPerStep: -4,  minValue: 85 },
    ],
  },
  {
    drugPattern: /vasopressor|norepinephrine|dopamine|epinephrine|vasopressin/i,
    effects: [
      { vital: "SBP", directionPerStep: +12,  maxValue: 170 },
      { vital: "DBP", directionPerStep: +8,   maxValue: 100 },
      { vital: "HR",  directionPerStep: +5,   maxValue: 120 },
    ],
  },
];

// ── Untreated disease → vital deterioration ───────────────────────────────────

export const DISEASE_VITAL_EFFECTS: VitalDiseaseEffect[] = [
  {
    diseasePattern: /uncontrolled.*hypertension|hypertension.*uncontrolled|elevated.*BP|high.*BP/i,
    effects: [
      { vital: "SBP", directionPerStep: +4,  maxValue: 200 },
      { vital: "DBP", directionPerStep: +2,  maxValue: 120 },
    ],
  },
  {
    diseasePattern: /sepsis|septic|bacteremia/i,
    effects: [
      { vital: "HR",   directionPerStep: +8,  maxValue: 145 },
      { vital: "Temp", directionPerStep: +0.4, maxValue: 40.5 },
      { vital: "RR",   directionPerStep: +3,  maxValue: 36  },
      { vital: "SBP",  directionPerStep: -6,  minValue: 70  },
      { vital: "SpO2", directionPerStep: -2,  minValue: 80  },
    ],
  },
  {
    diseasePattern: /heart failure|CHF|congestive|pulmonary oedema|pulmonary edema/i,
    effects: [
      { vital: "SpO2", directionPerStep: -2,  minValue: 80  },
      { vital: "RR",   directionPerStep: +2,  maxValue: 32  },
      { vital: "HR",   directionPerStep: +4,  maxValue: 120 },
    ],
  },
  {
    diseasePattern: /COPD.*exacerbation|exacerbation.*COPD|respiratory.*failure/i,
    effects: [
      { vital: "SpO2", directionPerStep: -3,  minValue: 78  },
      { vital: "RR",   directionPerStep: +3,  maxValue: 40  },
      { vital: "HR",   directionPerStep: +5,  maxValue: 125 },
    ],
  },
  {
    diseasePattern: /DVT|pulmonary embolism|PE/i,
    effects: [
      { vital: "HR",   directionPerStep: +6,  maxValue: 140 },
      { vital: "SpO2", directionPerStep: -3,  minValue: 80  },
      { vital: "RR",   directionPerStep: +3,  maxValue: 32  },
    ],
  },
  {
    diseasePattern: /AKI|acute kidney injury|renal failure/i,
    effects: [
      { vital: "HR",   directionPerStep: +4,  maxValue: 120 },
      { vital: "RR",   directionPerStep: +2,  maxValue: 30  },
    ],
  },
  {
    diseasePattern: /anaphylaxis|severe allergic/i,
    effects: [
      { vital: "SBP",  directionPerStep: -15, minValue: 60  },
      { vital: "HR",   directionPerStep: +20, maxValue: 160 },
      { vital: "SpO2", directionPerStep: -5,  minValue: 70  },
    ],
  },
  {
    diseasePattern: /hyperglycemia|DKA|hyperosmolar/i,
    effects: [
      { vital: "HR",   directionPerStep: +5,  maxValue: 125 },
      { vital: "RR",   directionPerStep: +2,  maxValue: 28  },
    ],
  },
];

// ── Vital parsing / serialisation ─────────────────────────────────────────────

/**
 * Parses authored VitalReading[] into a numeric state map.
 * BP is split into SBP and DBP.
 */
export function parseVitalsToNumericState(vitals: VitalReading[]): NumericVitalState {
  const state: NumericVitalState = {};
  for (const v of vitals) {
    if (v.label === "BP") {
      const match = v.value.match(/^(\d+)\/(\d+)$/);
      if (match) {
        state["SBP"] = parseInt(match[1]!, 10);
        state["DBP"] = parseInt(match[2]!, 10);
      }
    } else {
      const num = parseFloat(v.value);
      if (!isNaN(num)) state[v.label] = num;
    }
  }
  return state;
}

/**
 * Merges evolved numeric state back into VitalReading[] with trend annotations.
 * Authored vitals with no numeric parse are kept as-is.
 */
export function serializeNumericStateToVitals(
  baseline: VitalReading[],
  evolved: NumericVitalState,
  prior: NumericVitalState,
): EvolvedVitalReading[] {
  const result: EvolvedVitalReading[] = [];

  for (const v of baseline) {
    if (v.label === "BP") {
      const sbp = evolved["SBP"] ?? parseFloat(v.value.split("/")[0] ?? "");
      const dbp = evolved["DBP"] ?? parseFloat(v.value.split("/")[1] ?? "");
      if (!isNaN(sbp) && !isNaN(dbp)) {
        const priorSbp = prior["SBP"] ?? sbp;
        const trend = computeVitalTrend(sbp, priorSbp, false /* lower BP is usually better when hypertensive */);
        result.push({
          label: "BP",
          value: `${Math.round(sbp)}/${Math.round(dbp)}`,
          unit: v.unit,
          flag: sbp >= 180 || dbp >= 120 ? "critical" : sbp >= 140 || dbp >= 90 ? "high" : sbp < 90 || dbp < 60 ? "low" : undefined,
          trend,
        });
      } else {
        result.push({ ...v });
      }
    } else {
      const evolvedNum = evolved[v.label];
      const priorNum = prior[v.label];
      if (evolvedNum !== undefined && priorNum !== undefined) {
        const higherBetter = v.label === "SpO2";
        result.push({
          label: v.label,
          value: String(Math.round(evolvedNum * 10) / 10),
          unit: v.unit,
          flag: deriveVitalFlag(v.label, evolvedNum),
          trend: computeVitalTrend(evolvedNum, priorNum, higherBetter),
        });
      } else {
        result.push({ ...v });
      }
    }
  }
  return result;
}

function computeVitalTrend(current: number, prior: number, higherIsBetter: boolean): EvolvedVitalReading["trend"] {
  const delta = current - prior;
  const threshold = Math.abs(prior) * 0.03; // 3% change threshold
  if (Math.abs(delta) < threshold) return "stable";
  const isImproving = higherIsBetter ? delta > 0 : delta < 0;
  return isImproving ? "improving" : "worsening";
}

function deriveVitalFlag(label: string, value: number): EvolvedVitalReading["flag"] {
  if (label === "SpO2" && value < 88) return "critical";
  if (label === "SpO2" && value < 94) return "low";
  if (label === "HR" && value > 130) return "critical";
  if (label === "HR" && (value > 100 || value < 50)) return "high";
  if (label === "RR" && value > 30) return "critical";
  if (label === "RR" && value > 20) return "high";
  if (label === "Temp" && value > 39.5) return "critical";
  if (label === "Temp" && value > 38.0) return "high";
  if (label === "Temp" && value < 35.0) return "critical";
  return undefined;
}

// ── Core evolution function ───────────────────────────────────────────────────

/**
 * Applies medication and disease effects to a numeric vital state.
 * @param state       Current numeric vital state
 * @param medications Active medication names
 * @param diseaseLabels Labels of unresolved clinical issues
 * @param stepsElapsed Steps since baseline
 */
export function applyMedicationEffectsToVitals(
  state: NumericVitalState,
  medications: string[],
  stepsElapsed: number,
): NumericVitalState {
  const result = { ...state };
  for (const med of medications) {
    for (const effect of MEDICATION_VITAL_EFFECTS) {
      if (!effect.drugPattern.test(med)) continue;
      for (const e of effect.effects) {
        const current = result[e.vital];
        if (current === undefined) continue;
        let next = current + e.directionPerStep * stepsElapsed;
        if (e.minValue !== undefined) next = Math.max(e.minValue, next);
        if (e.maxValue !== undefined) next = Math.min(e.maxValue, next);
        const clamp = VITAL_CLAMP[e.vital];
        if (clamp) next = Math.max(clamp.min, Math.min(clamp.max, next));
        result[e.vital] = next;
      }
    }
  }
  return result;
}

export function applyDiseaseEffectsToVitals(
  state: NumericVitalState,
  diseaseLabels: string[],
  stepsElapsed: number,
): NumericVitalState {
  const result = { ...state };
  for (const disease of diseaseLabels) {
    for (const effect of DISEASE_VITAL_EFFECTS) {
      if (!effect.diseasePattern.test(disease)) continue;
      for (const e of effect.effects) {
        const current = result[e.vital];
        if (current === undefined) continue;
        let next = current + e.directionPerStep * stepsElapsed;
        if (e.minValue !== undefined) next = Math.max(e.minValue, next);
        if (e.maxValue !== undefined) next = Math.min(e.maxValue, next);
        const clamp = VITAL_CLAMP[e.vital];
        if (clamp) next = Math.max(clamp.min, Math.min(clamp.max, next));
        result[e.vital] = next;
      }
    }
  }
  return result;
}

/**
 * Full vital evolution: apply meds then disease effects.
 * Returns EvolvedVitalReading[] ready for the UI.
 */
export function evolveVitals(
  baselineVitals: VitalReading[],
  activeMedications: string[],
  unresolvedIssueLabels: string[],
  stepsElapsed: number,
  priorVitals?: VitalReading[],
): EvolvedVitalReading[] {
  if (stepsElapsed === 0) return baselineVitals.map((v) => ({ ...v }));

  const baseline = parseVitalsToNumericState(baselineVitals);
  const prior = priorVitals ? parseVitalsToNumericState(priorVitals) : baseline;

  let evolved = applyMedicationEffectsToVitals(baseline, activeMedications, stepsElapsed);
  evolved = applyDiseaseEffectsToVitals(evolved, unresolvedIssueLabels, stepsElapsed);

  return serializeNumericStateToVitals(baselineVitals, evolved, prior);
}

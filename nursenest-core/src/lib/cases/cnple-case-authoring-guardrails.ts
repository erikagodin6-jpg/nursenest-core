/**
 * CNPLE case authoring guardrails.
 *
 * Validates PatientCase content at authoring time to prevent:
 * - Physiologically impossible vital signs
 * - Implausible or contradictory lab combinations
 * - Known unsafe medication combinations
 * - Timeline incoherence
 * - Age/dose impossibilities
 * - Contradictory trajectory sequences
 * - Fake Canadian guideline claims
 * - Placeholder rationale text
 *
 * Hard-blocks critical safety incoherence. Soft-warns on lower severity issues.
 */
import type {
  PatientCase,
  CaseStep,
  DiagnosticArtifact,
  FollowUpInterval,
  StructuredFollowUpInterval,
} from "@/lib/cases/longitudinal-case-types";

// ── Result types ──────────────────────────────────────────────────────────────

export type AuthoringViolationSeverity = "critical" | "warning" | "info";

export type AuthoringViolation = {
  code: string;
  severity: AuthoringViolationSeverity;
  message: string;
  location: string;  // e.g. "step[0].vitals.BP" or "step[2].question.rationale"
};

export type CaseAuthoringAuditResult = {
  ok: boolean;
  criticalCount: number;
  warningCount: number;
  violations: AuthoringViolation[];
};

// ── Vital sign ranges ─────────────────────────────────────────────────────────

type VitalRange = { min: number; max: number; criticalLow?: number | null; criticalHigh?: number | null };

const VITAL_RANGES: Record<string, VitalRange> = {
  "systolic":   { min: 50,  max: 280, criticalLow: 70,  criticalHigh: 230 },
  "diastolic":  { min: 30,  max: 160, criticalLow: 40,  criticalHigh: 130 },
  "HR":         { min: 20,  max: 250, criticalLow: 30,  criticalHigh: 200 },
  "RR":         { min: 4,   max: 60,  criticalLow: 6,   criticalHigh: 50  },
  "SpO2":       { min: 50,  max: 100, criticalLow: 80,  criticalHigh: null },
  "Temp":       { min: 32,  max: 43,  criticalLow: 34,  criticalHigh: 41  },
  "Weight":     { min: 2,   max: 400                                        },
};

// ── Lab ranges (plausibility — not clinical reference ranges) ─────────────────

type LabPlausibilityRange = { min: number; max: number; unit?: string };

const LAB_PLAUSIBILITY: Record<string, LabPlausibilityRange> = {
  "K+":            { min: 1.5,  max: 9.0  },
  "Na+":           { min: 100,  max: 175  },
  "Creatinine":    { min: 20,   max: 2000 },
  "eGFR":          { min: 0,    max: 120  },
  "HbA1c":         { min: 4.0,  max: 20.0 },
  "LDL-C":         { min: 0.3,  max: 12.0 },
  "Total-C":       { min: 2.0,  max: 18.0 },
  "HDL-C":         { min: 0.3,  max: 5.0  },
  "WBC":           { min: 0.5,  max: 100  },
  "Hb":            { min: 40,   max: 220  },
  "Platelets":     { min: 10,   max: 1200 },
  "INR":           { min: 0.8,  max: 12.0 },
  "TSH":           { min: 0.001, max: 150 },
  "Lactate":       { min: 0.3,  max: 20.0 },
  "pH":            { min: 6.8,  max: 7.8  },
  "UACR":          { min: 0,    max: 1000 },
};

// ── Unsafe medication combinations ────────────────────────────────────────────

type UnsafeCombination = { drugs: [RegExp, RegExp]; severity: AuthoringViolationSeverity; reason: string };

const UNSAFE_COMBINATIONS: UnsafeCombination[] = [
  {
    drugs: [/ACE inhibitor|ramipril|lisinopril|enalapril|perindopril/i, /ARB|losartan|valsartan|candesartan/i],
    severity: "critical",
    reason: "ACEi + ARB combination is contraindicated — dual RAAS blockade causes hyperkalaemia and renal injury.",
  },
  {
    drugs: [/MAOI|phenelzine|tranylcypromine|selegiline/i, /SSRI|sertraline|fluoxetine|paroxetine|citalopram|escitalopram/i],
    severity: "critical",
    reason: "MAOI + SSRI combination causes serotonin syndrome — potentially fatal.",
  },
  {
    drugs: [/warfarin/i, /NSAID|naproxen|ibuprofen|diclofenac/i],
    severity: "warning",
    reason: "Warfarin + NSAID significantly increases bleeding risk.",
  },
  {
    drugs: [/methotrexate/i, /trimethoprim|co-trimoxazole|septra/i],
    severity: "critical",
    reason: "Methotrexate + trimethoprim causes folate depletion and severe haematological toxicity.",
  },
  {
    drugs: [/digoxin/i, /amiodarone/i],
    severity: "warning",
    reason: "Digoxin + amiodarone increases digoxin toxicity risk — dose reduction required.",
  },
  {
    drugs: [/lithium/i, /NSAID|naproxen|ibuprofen/i],
    severity: "critical",
    reason: "NSAIDs raise lithium levels to toxic range.",
  },
];

// ── Fake guideline pattern ────────────────────────────────────────────────────

const FAKE_GUIDELINE_RE = new RegExp(
  String.raw`\b(?:according to official cnple|cnple guideline|ccrnr recommend[s]? that|official cnple blueprint [Ss]tates?)\b`,
  "i",
);

const PLACEHOLDER_RE = /\b(?:todo|placeholder|lorem ipsum|coming soon|tbd|fixme|insert (?:rationale|question|answer) here|sample text)\b/i;

// ── Validator ─────────────────────────────────────────────────────────────────

function v(
  code: string,
  severity: AuthoringViolationSeverity,
  message: string,
  location: string,
): AuthoringViolation {
  return { code, severity, message, location };
}

/** Full audit of a PatientCase. Returns all violations. */
export function auditCaseAuthoring(patientCase: PatientCase): CaseAuthoringAuditResult {
  const violations: AuthoringViolation[] = [];

  // ── Case-level checks ──

  if (!patientCase.id || patientCase.id.trim().length === 0) {
    violations.push(v("missing_case_id", "critical", "Case has no stable ID.", "case.id"));
  }

  if (patientCase.steps.length === 0) {
    violations.push(v("no_steps", "critical", "Case has zero steps.", "case.steps"));
  }

  if (patientCase.stepCount !== patientCase.steps.length) {
    violations.push(v("step_count_mismatch", "warning",
      `stepCount (${patientCase.stepCount}) does not match actual steps (${patientCase.steps.length}).`,
      "case.stepCount"));
  }

  // ── Medication combination audit ──

  const allMedNames = patientCase.medications.map((m) => m.name);
  for (const combo of UNSAFE_COMBINATIONS) {
    const matches = combo.drugs.map((d) => allMedNames.some((n) => d.test(n)));
    if (matches[0] && matches[1]) {
      violations.push(v("unsafe_med_combination", combo.severity,
        `Unsafe medication combination in initial list: ${combo.reason}`,
        "case.medications"));
    }
  }

  // ── Per-step checks ──

  let prevFollowUpDays = 0;
  let totalTimeDays = 0;

  for (const step of patientCase.steps) {
    const loc = `step[${step.index}]`;

    // Vitals
    for (const vital of step.vitals) {
      validateVital(vital, loc, violations);
    }

    // Labs
    for (const artifact of step.diagnosticArtifacts) {
      validateArtifact(artifact, loc, violations);
    }

    // Medication combos per-step
    const stepMedNames = step.medicationChanges
      .filter((m) => medicationChangeFlag(m) === "new")
      .map((m) => m.name);
    const cumMedNames = [...allMedNames, ...stepMedNames];
    for (const combo of UNSAFE_COMBINATIONS) {
      const matches = combo.drugs.map((d) => cumMedNames.some((n) => d.test(n)));
      if (matches[0] && matches[1]) {
        violations.push(v("unsafe_med_combination_step", combo.severity,
          `Unsafe medication combination at ${loc}: ${combo.reason}`,
          `${loc}.medicationChanges`));
      }
    }

    // Follow-up interval coherence.
    // NOTE: followUpInterval is elapsed time SINCE the prior step (retrospective context for the
    // narrative), NOT a prescribed future follow-up recommendation. Do not validate it as if it
    // were a medical order — only check for obviously impossible values.
    if (step.followUpInterval) {
      const days = intervalToDays(step.followUpInterval);
      if (days < 0) {
        violations.push(v("invalid_follow_up_interval", "critical",
          `Follow-up interval at step ${step.index} is negative (got ${formatFollowUpInterval(step.followUpInterval)}). Elapsed time must be non-negative.`,
          `${loc}.followUpInterval`));
      }
      if (days > 3650) {
        violations.push(v("follow_up_interval_implausibly_long", "warning",
          `Follow-up interval at step ${step.index} exceeds 10 years. Verify the unit is correct.`,
          `${loc}.followUpInterval`));
      }
      totalTimeDays += days;
    }

    // Trajectory contradiction: improving after critical without intervention
    if (
      step.index > 0 &&
      step.clinicalUpdate.direction === "improving" &&
      patientCase.steps[step.index - 1]?.clinicalUpdate.direction === "critical" &&
      step.medicationChanges.length === 0
    ) {
      violations.push(v("trajectory_contradiction", "warning",
        `Step ${step.index} shows improvement after a critical step, but no medication changes occurred. Consider adding a treatment rationale.`,
        `${loc}.clinicalUpdate`));
    }

    // Question checks
    validateQuestion(step, loc, violations);
  }

  // ── Age-specific checks ──

  if (typeof patientCase.patient.age === "number") {
    validateAgeSpecific(patientCase, violations);
  }

  const criticalCount = violations.filter((v) => v.severity === "critical").length;
  const warningCount = violations.filter((v) => v.severity === "warning").length;

  return {
    ok: criticalCount === 0,
    criticalCount,
    warningCount,
    violations,
  };
}

// ── Sub-validators ────────────────────────────────────────────────────────────

function validateVital(
  vital: PatientCase["steps"][number]["vitals"][number],
  loc: string,
  violations: AuthoringViolation[],
): void {
  const numVal = parseFloat(vital.value);
  if (isNaN(numVal)) return;

  // BP split
  if (vital.label === "BP") {
    const bpMatch = vital.value.match(/^(\d+)\/(\d+)$/);
    if (!bpMatch) {
      violations.push(v("invalid_bp_format", "warning",
        `BP value "${vital.value}" is not in systolic/diastolic format.`,
        `${loc}.vitals.BP`));
      return;
    }
    const sys = parseInt(bpMatch[1]!, 10);
    const dia = parseInt(bpMatch[2]!, 10);
    checkRange(sys, VITAL_RANGES["systolic"]!, `${loc}.vitals.BP.systolic`, "Systolic BP", violations);
    checkRange(dia, VITAL_RANGES["diastolic"]!, `${loc}.vitals.BP.diastolic`, "Diastolic BP", violations);
    if (sys <= dia) {
      violations.push(v("bp_systolic_below_diastolic", "critical",
        `Systolic BP (${sys}) must be greater than diastolic (${dia}).`,
        `${loc}.vitals.BP`));
    }
    return;
  }

  const range = VITAL_RANGES[vital.label];
  if (range) {
    checkRange(numVal, range, `${loc}.vitals.${vital.label}`, vital.label, violations);
  }
}

function validateArtifact(
  artifact: DiagnosticArtifact,
  loc: string,
  violations: AuthoringViolation[],
): void {
  if (!artifact.values) return;
  for (const v2 of artifact.values) {
    const numVal = parseFloat(v2.value);
    if (isNaN(numVal)) continue;
    const range = LAB_PLAUSIBILITY[v2.test];
    if (!range) continue;
    if (numVal < range.min || numVal > range.max) {
      violations.push(v(
        "implausible_lab_value",
        "critical",
        `${v2.test} value ${v2.value} ${v2.unit ?? ""} is outside plausibility range [${range.min}–${range.max}].`,
        `${loc}.diagnosticArtifacts.${diagnosticArtifactName(artifact)}.${v2.test}`,
      ));
    }
  }

  // Impossible K+/Na+ combination (severe hyponatraemia + hyperkalaemia = adrenal crisis check)
  if (artifact.values) {
    const kVal = artifact.values.find((v) => v.test === "K+");
    const naVal = artifact.values.find((v) => v.test === "Na+");
    if (kVal && naVal) {
      const k = parseFloat(kVal.value);
      const na = parseFloat(naVal.value);
      if (k > 6.5 && na < 120) {
        violations.push(v("extreme_electrolyte_combination", "warning",
          `K+ ${kVal.value} + Na+ ${naVal.value}: extreme electrolyte combination requires clinical narrative justification.`,
          `${loc}.diagnosticArtifacts.${diagnosticArtifactName(artifact)}`));
      }
    }
  }
}

function validateQuestion(
  step: CaseStep,
  loc: string,
  violations: AuthoringViolation[],
): void {
  const q = step.question;

  if (q.options.length < 2) {
    violations.push(v("too_few_options", "critical", "Question must have at least 2 options.", `${loc}.question`));
  }

  if (!q.options.some((o) => o.id === q.correctOptionId)) {
    violations.push(v("invalid_correct_option", "critical",
      `correctOptionId "${q.correctOptionId}" not found in options.`,
      `${loc}.question.correctOptionId`));
  }

  // Placeholder in rationale
  if (PLACEHOLDER_RE.test(q.rationale)) {
    violations.push(v("placeholder_rationale", "critical",
      "Rationale contains placeholder text — must be a substantive clinical explanation.",
      `${loc}.question.rationale`));
  }

  if (q.rationale.trim().length < 50) {
    violations.push(v("rationale_too_short", "warning",
      `Rationale is very short (${q.rationale.trim().length} chars). Consider expanding for clinical depth.`,
      `${loc}.question.rationale`));
  }

  // Fake guideline claims
  if (FAKE_GUIDELINE_RE.test(q.rationale)) {
    violations.push(v("fake_guideline_claim", "critical",
      "Rationale contains a fake or fabricated regulatory/guideline claim about CNPLE or CCRNR.",
      `${loc}.question.rationale`));
  }

  // All options must have a consequence
  for (const opt of q.options) {
    if (!q.consequencesByOptionId?.[opt.id]) {
      violations.push(v("missing_consequence", "warning",
        `Option ${opt.id} has no consequence entry.`,
        `${loc}.question.consequencesByOptionId`));
    }
  }

  // Wrong options must have whyWrong
  for (const opt of q.options) {
    if (opt.id !== q.correctOptionId && !q.whyWrongByOptionId?.[opt.id]) {
      violations.push(v("missing_why_wrong", "warning",
        `Option ${opt.id} is a distractor but has no whyWrongByOptionId entry.`,
        `${loc}.question.whyWrongByOptionId`));
    }
  }
}

function validateAgeSpecific(
  patientCase: PatientCase,
  violations: AuthoringViolation[],
): void {
  const age = typeof patientCase.patient.age === "number" ? patientCase.patient.age : null;
  if (!age) return;

  // Paediatric patients — flag if adult-dose medications are listed without weight-based note
  if (age < 18) {
    for (const med of patientCase.medications) {
      if (med.dose && !/(mg\/kg|weight.?based|paediatric|pediatric)/i.test(med.dose + (med.indication ?? ""))) {
        violations.push(v("adult_dose_in_pediatric_case", "warning",
          `Medication "${med.name}" (${med.dose}) in a ${age}-year-old patient — verify weight-based dosing is documented.`,
          "case.medications"));
      }
    }
  }

  // Geriatric patients — flag Beers-criteria medications without rationale
  if (age >= 75) {
    const beersMeds = /benzodiazepine|lorazepam|diazepam|zolpidem|diphenhydramine|amitriptyline|nortriptyline|indomethacin/i;
    for (const med of patientCase.medications) {
      if (beersMeds.test(med.name)) {
        violations.push(v("beers_criteria_medication", "warning",
          `"${med.name}" is potentially inappropriate in older adults (Beers Criteria / STOPP). Add a clinical justification or use an alternative.`,
          "case.medications"));
      }
    }
  }
}

function checkRange(
  value: number,
  range: VitalRange,
  location: string,
  label: string,
  violations: AuthoringViolation[],
): void {
  if (value < range.min || value > range.max) {
    violations.push(v("implausible_vital", "critical",
      `${label} value ${value} is outside the physiologically plausible range [${range.min}–${range.max}].`,
      location));
    return;
  }
  if (range.criticalLow !== null && range.criticalLow !== undefined && value < range.criticalLow) {
    violations.push(v("critical_vital_low", "warning",
      `${label} value ${value} is critically low (below ${range.criticalLow}). Ensure the scenario narrative reflects this severity.`,
      location));
  }
  if (range.criticalHigh !== null && range.criticalHigh !== undefined && value > range.criticalHigh) {
    violations.push(v("critical_vital_high", "warning",
      `${label} value ${value} is critically high (above ${range.criticalHigh}). Ensure the scenario narrative reflects this severity.`,
      location));
  }
}

function intervalToDays(interval: FollowUpInterval): number {
  if (typeof interval === "string") return intervalStringToDays(interval);
  const mult: Record<StructuredFollowUpInterval["unit"], number> = {
    hours: 1 / 24, days: 1, weeks: 7, months: 30,
  };
  return interval.value * mult[interval.unit];
}

function diagnosticArtifactName(artifact: DiagnosticArtifact): string {
  return artifact.name ?? artifact.label ?? artifact.type ?? "result";
}

function formatFollowUpInterval(interval: FollowUpInterval): string {
  if (typeof interval === "string") return interval;
  return `${interval.value} ${interval.unit}`;
}

function intervalStringToDays(interval: string): number {
  const normalized = interval.toLowerCase().replace(/[–—]/g, "-");
  const matches = [...normalized.matchAll(/(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*(hour|hours|day|days|week|weeks|month|months)/g)];
  if (matches.length === 0) return 0;

  const [, firstRaw, secondRaw, unitRaw] = matches[0]!;
  const first = Number(firstRaw);
  const second = secondRaw ? Number(secondRaw) : first;
  const value = Number.isFinite(first) && Number.isFinite(second) ? (first + second) / 2 : first;
  const unit = unitRaw ?? "days";
  const multiplier = unit.startsWith("hour") ? 1 / 24 : unit.startsWith("week") ? 7 : unit.startsWith("month") ? 30 : 1;
  return value * multiplier;
}

function medicationChangeFlag(
  change: PatientCase["steps"][number]["medicationChanges"][number],
): "new" | "changed" | "discontinued" | "hold" | undefined {
  if (change.flag) return change.flag;
  if (change.change === "start") return "new";
  if (change.change === "continue") return "changed";
  if (change.change === "stop") return "discontinued";
  if (change.change === "hold") return "hold";
  if (change.change === "change") return "changed";
  return undefined;
}

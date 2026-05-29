/**
 * ECG Clinical Reasoning Schema
 *
 * Defines the typed structure for comprehensive rhythm clinical reasoning data.
 * Every rhythm in the ECG curriculum is backed by an EcgClinicalReasoningEntry
 * which is consumed by:
 *
 *   - Lessons (ecg-lesson-clinical-panel.tsx)
 *   - Flashcards (profession-filtered content)
 *   - Practice questions (trap-based distractors)
 *   - Simulations (escalation decision trees)
 *   - Clinical judgment cases (hemodynamics + escalation)
 *   - New Grad modules (bedside-framed nursing priorities)
 *   - RT modules (ventilation-specific notes)
 *   - NP modules (pharmacology + orders)
 *   - Pediatric modules (age-specific overlays)
 *   - Advanced ECG modules (mechanism-depth content)
 *
 * VALIDATION CONTRACT
 *   ecg-clinical-reasoning.contract.test.ts enforces that all "published"
 *   entries (publishStatus="published") have every required field populated.
 *   Draft entries may be partial.
 *
 * CLINICAL SAFETY RULE
 *   Unstable rhythms (clinicalRiskLevel="high" or "life_threatening") MUST have:
 *     - escalationCriteria.codeBlue populated
 *     - or escalationCriteria.rapidResponse populated
 *     - clinicalSafetyFlags at least one flag
 *   This is enforced by the contract test.
 */

// ─── Escalation framework ───────────────────────────────────────────────────────

/**
 * 4-level escalation hierarchy. Each level implies all levels below it.
 *
 *   monitor       → Continue current monitoring; document in chart; no immediate call.
 *   notify        → Call/page provider now. Not an emergency but requires timely assessment.
 *   rapid_response → Activate the Rapid Response Team (RRT). Patient is deteriorating.
 *   code_blue     → Call a Code Blue. Cardiac/respiratory arrest in progress.
 */
export type EcgEscalationLevel =
  | "monitor"
  | "notify"
  | "rapid_response"
  | "code_blue";

export type EcgEscalationCriteria = {
  /**
   * Conditions that require continuing current monitoring without immediate escalation.
   * e.g. "Asymptomatic bradycardia with HR > 50 in a trained athlete"
   */
  monitor: ReadonlyArray<string>;
  /**
   * Conditions requiring urgent provider notification (call within minutes, not hours).
   * e.g. "New-onset AFib with rapid ventricular response (HR > 110)"
   */
  notify: ReadonlyArray<string>;
  /**
   * Conditions requiring Rapid Response Team activation.
   * e.g. "Symptomatic SVT unresponsive to vagal maneuvers"
   */
  rapidResponse: ReadonlyArray<string>;
  /**
   * Conditions requiring Code Blue activation.
   * e.g. "Pulseless VT", "VF", "Asystole"
   */
  codeBlue: ReadonlyArray<string>;
};

// ─── Clinical safety flags ───────────────────────────────────────────────────────

export type EcgClinicalSafetyFlag = {
  /** Single-sentence safety rule — must be actionable and specific. */
  rule: string;
  /**
   * Why this safety rule matters: the clinical consequence of violating it.
   * e.g. "Treating 3rd-degree AV block with atropine is ineffective and may worsen."
   */
  rationale: string;
  /** Which escalation this flag triggers (determines badge color in UI). */
  triggerLevel: EcgEscalationLevel;
};

// ─── Profession-specific notes ───────────────────────────────────────────────────

export type EcgProfession = "RN" | "RPN" | "NP" | "RT" | "new_grad";

export type EcgProfessionNote = {
  profession: EcgProfession;
  /**
   * 1–3 sentence scope-specific teaching point.
   * Must reflect the actual scope of practice for that profession in the given jurisdiction.
   */
  note: string;
};

// ─── Compare/contrast relationships ─────────────────────────────────────────────

export type EcgCompareContrast = {
  /** The other rhythm being compared. */
  otherRhythm: string;
  /** The human-readable label for the other rhythm. */
  otherLabel: string;
  /** What makes THIS rhythm NOT the other rhythm. */
  keyDifferentiator: string;
  /** Which ECG feature to look at to make the distinction. */
  discriminatingFeature: string;
  /**
   * Clinical consequence of confusing these two rhythms.
   * Must be specific — not "serious" but "would cause adenosine administration to VT."
   */
  confusionConsequence: string;
};

// ─── Clinical risk level ─────────────────────────────────────────────────────────

export type EcgClinicalRiskLevel =
  | "low"            // Monitor, no acute intervention expected
  | "moderate"       // Provider notification; intervention may be needed
  | "high"           // Rapid intervention required; patient at risk of deterioration
  | "life_threatening"; // Immediate life-saving intervention required

// ─── Simulation and remediation links ───────────────────────────────────────────

export type EcgSimulationLink = {
  /** Simulation ID or slug in the LOFT/OSCE simulation system. */
  simulationId: string;
  label: string;
  /** Brief description of how this simulation relates to the rhythm. */
  scenario: string;
  /** Minimum tier required to access this simulation. */
  minTier: "free" | "pro" | "premium";
};

export type EcgRemediationLink = {
  /** Lesson ID or structured lesson slug to send the learner to. */
  lessonId: string;
  label: string;
  /** Why this lesson is recommended for remediation. */
  remediationReason: string;
};

// ─── Hemodynamic impact ──────────────────────────────────────────────────────────

export type EcgHemodynamicImpact = {
  /** Cardiac output impact: how this rhythm affects CO = HR × SV. */
  cardiacOutputEffect: string;
  /** Perfusion impact: what the patient will feel/show clinically. */
  perfusionImpact: string;
  /**
   * Stable hemodynamic presentation — patient is maintaining adequate perfusion.
   * Signs and symptoms expected when the rhythm is compensated.
   */
  stablePresentation: ReadonlyArray<string>;
  /**
   * Unstable hemodynamic presentation — patient is losing perfusion.
   * Signs and symptoms that trigger escalation.
   */
  unstablePresentation: ReadonlyArray<string>;
  /**
   * The rate/HR at which hemodynamic compromise typically begins.
   * May be a range (e.g. "HR > 150 BPM reduces diastolic filling significantly").
   */
  hemodynamicCompromiseThreshold?: string;
};

// ─── Core clinical reasoning entry ──────────────────────────────────────────────

/**
 * The complete clinical reasoning data structure for a single ECG rhythm.
 *
 * Field population requirements by publishStatus:
 *   "published"  → ALL required fields must be non-empty. Contract test enforces this.
 *   "review"     → Required fields present but may need clinical validation.
 *   "draft"      → Partial data acceptable; not displayed to learners.
 *
 * Required fields (enforced by contract test for published entries):
 *   rhythmKey, label, publishStatus, clinicalRiskLevel,
 *   recognition (≥1 item), mechanism (non-empty),
 *   hemodynamicImpact (all sub-fields), nursingPriorities (≥2),
 *   escalationCriteria (all 4 levels), clinicalSafetyFlags (≥1 for high/life_threatening),
 *   commonTraps (≥1), compareContrast (≥1), professionNotes (≥1 for RN)
 */
export type EcgClinicalReasoningEntry = {
  /** Matches rhythmKey in EcgRhythmTemplate and RHYTHM_VALIDATORS. */
  rhythmKey: string;
  /** Human-readable rhythm name — matches rhythmName in EcgRhythmTemplate. */
  label: string;
  publishStatus: "published" | "review" | "draft";
  clinicalRiskLevel: EcgClinicalRiskLevel;

  // ── Recognition ──────────────────────────────────────────────────────────────
  /**
   * Ordered checklist for systematic rhythm identification.
   * Mirrors the 7-step interpretation framework: rate → regularity → P → PR → QRS → ST → clinical.
   */
  recognition: ReadonlyArray<string>;

  // ── Mechanism ────────────────────────────────────────────────────────────────
  /**
   * The electrical mechanism: where the impulse originates, how it propagates,
   * why the waveform looks the way it does. Explains WHY this strip looks this way.
   */
  mechanism: string;
  /** The conduction pathway that produces this rhythm (for mechanism-based teaching). */
  conductionPath: string;
  /**
   * Explicit connection between mechanism and strip appearance.
   * e.g. "The dropped QRS beat in Wenckebach occurs because..."
   */
  whyItLooksThisWay: string;

  // ── Hemodynamics ─────────────────────────────────────────────────────────────
  hemodynamicImpact: EcgHemodynamicImpact;

  // ── Nursing action ───────────────────────────────────────────────────────────
  /**
   * Ordered nursing priorities — most urgent action first.
   * Must be specific (no "assess the patient" without context).
   */
  nursingPriorities: ReadonlyArray<string>;
  /**
   * Immediate actions for unstable presentation before provider arrives.
   * Only populated for high-risk and life-threatening rhythms.
   */
  immediateActions?: ReadonlyArray<string>;

  // ── Escalation ───────────────────────────────────────────────────────────────
  escalationCriteria: EcgEscalationCriteria;

  // ── Clinical safety ──────────────────────────────────────────────────────────
  /**
   * Explicit do/don't safety rules. Required (≥1) for high-risk and life-threatening rhythms.
   * Each flag has a rationale explaining WHY the rule exists.
   */
  clinicalSafetyFlags: ReadonlyArray<EcgClinicalSafetyFlag>;

  // ── Compare / contrast ────────────────────────────────────────────────────────
  /**
   * What this rhythm is NOT — and why confusing them matters.
   * Required (≥1). Drives distractor selection in practice questions.
   */
  compareContrast: ReadonlyArray<EcgCompareContrast>;

  // ── Common traps ──────────────────────────────────────────────────────────────
  /**
   * The most frequent errors made at the bedside and on NCLEX.
   * Required (≥1). Used to generate question distractors and flashcard traps.
   */
  commonTraps: ReadonlyArray<string>;

  // ── Profession-specific notes ─────────────────────────────────────────────────
  /**
   * Scope-of-practice-appropriate notes for each profession.
   * Required (≥1 RN note) for published entries.
   */
  professionNotes: ReadonlyArray<EcgProfessionNote>;

  // ── Links ─────────────────────────────────────────────────────────────────────
  /** Links to LOFT/OSCE simulations featuring this rhythm. */
  simulationLinks?: ReadonlyArray<EcgSimulationLink>;
  /** Remediation lessons to assign when mastery is low for this rhythm. */
  remediationLinks?: ReadonlyArray<EcgRemediationLink>;

  // ── Monitoring requirements ───────────────────────────────────────────────────
  /**
   * Ongoing monitoring requirements after identification.
   * e.g. "Continuous telemetry", "12-lead ECG every 4 hours", "SpO₂ monitoring".
   */
  monitoringRequirements: ReadonlyArray<string>;
};

// ─── Schema validation helpers ───────────────────────────────────────────────────

/** Fields required in every published entry. Checked by contract test. */
export const PUBLISHED_REQUIRED_FIELDS: ReadonlyArray<keyof EcgClinicalReasoningEntry> = [
  "rhythmKey",
  "label",
  "clinicalRiskLevel",
  "recognition",
  "mechanism",
  "conductionPath",
  "whyItLooksThisWay",
  "hemodynamicImpact",
  "nursingPriorities",
  "escalationCriteria",
  "clinicalSafetyFlags",
  "compareContrast",
  "commonTraps",
  "professionNotes",
  "monitoringRequirements",
];

/** Minimum array lengths for published entries — shorter = incomplete. */
export const PUBLISHED_MIN_LENGTHS: Partial<Record<keyof EcgClinicalReasoningEntry, number>> = {
  recognition: 3,
  nursingPriorities: 2,
  commonTraps: 1,
  compareContrast: 1,
  professionNotes: 1,
  monitoringRequirements: 1,
};

/** Rhythms that MUST have codeBlue or rapidResponse populated due to life-threatening nature. */
export const RHYTHMS_REQUIRING_EMERGENCY_CRITERIA = new Set([
  "ventricular_fibrillation",
  "ventricular_tachycardia",
  "asystole",
  "pea",
  "torsades_de_pointes",
  "third_degree_av_block",
  "second_degree_type_ii_av_block",
  "stemi_pattern",
]);

/**
 * Validates a single entry's structural completeness.
 * Returns an array of error strings (empty = valid).
 */
export function validateClinicalReasoningEntry(
  entry: EcgClinicalReasoningEntry,
): string[] {
  if (entry.publishStatus === "draft") return [];

  const errors: string[] = [];
  const key = entry.rhythmKey;

  for (const field of PUBLISHED_REQUIRED_FIELDS) {
    const value = entry[field];
    if (value === undefined || value === null || value === "") {
      errors.push(`${key}: required field "${field}" is missing or empty`);
      continue;
    }
    const minLen = PUBLISHED_MIN_LENGTHS[field];
    if (minLen !== undefined && Array.isArray(value) && value.length < minLen) {
      errors.push(`${key}: "${field}" has ${value.length} items, minimum ${minLen}`);
    }
  }

  // High/life-threatening rhythms need emergency escalation criteria
  if (
    entry.clinicalRiskLevel === "high" ||
    entry.clinicalRiskLevel === "life_threatening"
  ) {
    if (
      entry.clinicalSafetyFlags.length === 0
    ) {
      errors.push(`${key}: high-risk rhythm needs ≥1 clinicalSafetyFlag`);
    }
    if (
      RHYTHMS_REQUIRING_EMERGENCY_CRITERIA.has(key) &&
      entry.escalationCriteria.codeBlue.length === 0 &&
      entry.escalationCriteria.rapidResponse.length === 0
    ) {
      errors.push(`${key}: life-threatening rhythm must have codeBlue or rapidResponse escalation criteria`);
    }
  }

  // Confirm at least one RN professionNote
  const hasRnNote = entry.professionNotes.some((n) => n.profession === "RN");
  if (!hasRnNote) {
    errors.push(`${key}: must have at least one RN professionNote`);
  }

  // hemodynamicImpact sub-field completeness
  const hd = entry.hemodynamicImpact;
  if (!hd.cardiacOutputEffect || !hd.perfusionImpact) {
    errors.push(`${key}: hemodynamicImpact.cardiacOutputEffect and .perfusionImpact are required`);
  }
  if (!hd.stablePresentation.length) {
    errors.push(`${key}: hemodynamicImpact.stablePresentation must have ≥1 item`);
  }
  if (!hd.unstablePresentation.length) {
    errors.push(`${key}: hemodynamicImpact.unstablePresentation must have ≥1 item`);
  }

  return errors;
}

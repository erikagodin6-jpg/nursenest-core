/**
 * Emergency Pattern Recognition — Clinical Content Validator
 *
 * Enforces modality, clinical data, and answer-structure requirements
 * for Paramedic → Emergency Pattern Recognition questions.
 *
 * Run on:
 *  - question create / update paths
 *  - audit scripts
 *  - tests
 */

// ---------------------------------------------------------------------------
// Shared clinical data types
// ---------------------------------------------------------------------------

export type EmergencyPatternVitals = {
  HR: number;
  BP: string; // e.g. "78/44"
  RR: number;
  SpO2: number;
  temperature?: number; // °C, when relevant (sepsis, hypothermia)
};

export type EmergencyPatternClinicalData = {
  vitals: EmergencyPatternVitals;
  glucose?: number; // mmol/L — required when hypoglycemia is a differential
  abg?: {
    pH?: number;
    PaCO2?: number;
    HCO3?: number;
    PaO2?: number;
  };
};

// ---------------------------------------------------------------------------
// ClinicalMedia type (URL-only — no local imports)
// ---------------------------------------------------------------------------

export type ClinicalMediaType = "audio" | "image" | "video" | "ecg";

export type EmergencyPatternClinicalMedia = {
  type: ClinicalMediaType;
  /** MUST be a URL — never a local import path */
  url: string;
  /** Human-readable description for admin preview */
  label?: string;
};

// ---------------------------------------------------------------------------
// TimedPattern — rapid recognition layer
// ---------------------------------------------------------------------------

export type TimedPattern = {
  /** Short clinical stimulus presented to the learner */
  stimulus: string;
  /** Target recognition time in milliseconds (e.g. 10000 = 10 s) */
  timeLimitMs: number;
  /** Expected clinical pattern label */
  expectedPattern: string;
  /** First priority action */
  expectedAction: string;
  /** Criteria that require immediate escalation or transport */
  escalationCriteria: string[];
};

// ---------------------------------------------------------------------------
// Full question shape
// ---------------------------------------------------------------------------

export type EmergencyPatternQuestion = {
  id: string;
  /** Clinical tags that drive modality requirements */
  tags?: string[];
  clinicalData: EmergencyPatternClinicalData;
  clinicalMedia?: EmergencyPatternClinicalMedia | null;
  answerOptions: string[];
  correctAnswerId: string;
  rationale: string;
  /** Keyed by answerId — explains why each distractor is wrong */
  distractorRationales?: Record<string, string>;
  /** What to look for clinically — required for all questions */
  clinicalLookFor: string;
  /** Optional timed rapid-recognition drill overlay */
  timedPattern?: TimedPattern;
};

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

/**
 * Validate an emergency pattern recognition question.
 *
 * Throws a descriptive Error on the first violation found so the caller
 * (create path / audit script / test) receives actionable output.
 */
export function validateEmergencyPatternQuestion(q: EmergencyPatternQuestion): void {
  const tags = q.tags ?? [];

  // 1. Paramedic cases ALWAYS require vitals --------------------------------
  if (!q.clinicalData?.vitals) {
    throw new Error(`[EMERGENCY_VALIDATOR] ${q.id}: missing required clinicalData.vitals`);
  }
  const { HR, BP, RR, SpO2 } = q.clinicalData.vitals;
  if (HR == null || BP == null || RR == null || SpO2 == null) {
    throw new Error(
      `[EMERGENCY_VALIDATOR] ${q.id}: incomplete vitals — HR, BP, RR, and SpO2 are all required`,
    );
  }

  // 2. Lung-sound questions require ClinicalMedia audio ---------------------
  if (tags.includes("lung-sound")) {
    if (!q.clinicalMedia || q.clinicalMedia.type !== "audio") {
      throw new Error(
        `[EMERGENCY_VALIDATOR] ${q.id}: tagged "lung-sound" requires ClinicalMedia.type="audio"`,
      );
    }
  }

  // 3. ECG questions require ECG-compatible media ---------------------------
  if (tags.includes("ecg")) {
    const ecgCompatible: ClinicalMediaType[] = ["image", "video", "ecg"];
    if (!q.clinicalMedia || !ecgCompatible.includes(q.clinicalMedia.type)) {
      throw new Error(
        `[EMERGENCY_VALIDATOR] ${q.id}: tagged "ecg" requires ClinicalMedia with type image/video/ecg`,
      );
    }
  }

  // 4. Trauma visual questions require image media --------------------------
  if (tags.includes("trauma-visual")) {
    if (!q.clinicalMedia || q.clinicalMedia.type !== "image") {
      throw new Error(
        `[EMERGENCY_VALIDATOR] ${q.id}: tagged "trauma-visual" requires ClinicalMedia.type="image"`,
      );
    }
  }

  // 5. Altered-LOC + hypoglycemia differential requires glucose value -------
  if (tags.includes("altered-loc")) {
    const hypoglycemiaInvolved =
      (q.answerOptions ?? []).some((opt) => /hypoglyc|glucose|sugar|dextrose/i.test(opt)) ||
      /hypoglyc|glucose|sugar|dextrose/i.test(q.rationale ?? "") ||
      Object.values(q.distractorRationales ?? {}).some((r) =>
        /hypoglyc|glucose|sugar|dextrose/i.test(r),
      );
    if (hypoglycemiaInvolved && q.clinicalData.glucose == null) {
      throw new Error(
        `[EMERGENCY_VALIDATOR] ${q.id}: altered-LOC question with hypoglycemia option requires clinicalData.glucose`,
      );
    }
  }

  // 6. Media URL must never be a local import path --------------------------
  if (q.clinicalMedia?.url && !/^https?:\/\//.test(q.clinicalMedia.url)) {
    throw new Error(
      `[EMERGENCY_VALIDATOR] ${q.id}: clinicalMedia.url must be a remote URL — local imports are not allowed`,
    );
  }

  // 7. Answer structure requirements ----------------------------------------
  if (!q.answerOptions || q.answerOptions.length < 2) {
    throw new Error(`[EMERGENCY_VALIDATOR] ${q.id}: requires at least 2 answerOptions`);
  }
  if (!q.correctAnswerId) {
    throw new Error(`[EMERGENCY_VALIDATOR] ${q.id}: missing correctAnswerId`);
  }
  if (!q.rationale) {
    throw new Error(`[EMERGENCY_VALIDATOR] ${q.id}: missing rationale`);
  }
  if (!q.clinicalLookFor) {
    throw new Error(`[EMERGENCY_VALIDATOR] ${q.id}: missing clinicalLookFor`);
  }
}

/**
 * Validate an array of emergency pattern questions.
 * Collects all errors before throwing so callers see the full picture.
 */
export function validateAllEmergencyPatternQuestions(
  questions: EmergencyPatternQuestion[],
): void {
  const errors: string[] = [];
  for (const q of questions) {
    try {
      validateEmergencyPatternQuestion(q);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  if (errors.length > 0) {
    throw new Error(`[EMERGENCY_VALIDATOR] ${errors.length} question(s) failed:\n${errors.join("\n")}`);
  }
}

/**
 * ECG Detective Mode — Investigation Engine
 *
 * Learners investigate a rhythm step-by-step before the answer is revealed.
 * Each step is scored. The reveal shows the full clinical reasoning library
 * entry for the identified rhythm.
 *
 * Scoring philosophy:
 *   - Correct on first attempt → full points
 *   - Correct on second attempt → partial credit
 *   - Skip/incorrect → 0 points + educational feedback
 *   - Bonus points for correct escalation and medication safety
 *
 * Used by: ecg-detective-mode-workspace.tsx
 * Feeds:   ecg-readiness-scoring.ts (domain scores)
 *          ecg-adaptive-remediation-v2.ts (weak step detection)
 */

import type { EcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";
import type { EcgEscalationLevel } from "@/lib/ecg-module/ecg-clinical-reasoning";

// ─── Step definitions ─────────────────────────────────────────────────────────

export type DetectiveStepKey =
  | "rate"
  | "regularity"
  | "p_wave"
  | "pr_interval"
  | "qrs_width"
  | "rhythm_id"
  | "mechanism"
  | "hemodynamic_impact"
  | "escalation_level"
  | "first_action"
  | "medication_safety";

export const DETECTIVE_STEP_LABELS: Record<DetectiveStepKey, string> = {
  rate:              "Heart Rate",
  regularity:        "Rhythm Regularity",
  p_wave:            "P-Wave Analysis",
  pr_interval:       "PR Interval",
  qrs_width:         "QRS Width",
  rhythm_id:         "Rhythm Identification",
  mechanism:         "Underlying Mechanism",
  hemodynamic_impact: "Hemodynamic Impact",
  escalation_level:  "Escalation Level",
  first_action:      "First Priority Action",
  medication_safety: "Medication Safety",
};

export const DETECTIVE_STEP_POINTS: Record<DetectiveStepKey, number> = {
  rate:              10,
  regularity:        10,
  p_wave:            15,
  pr_interval:       15,
  qrs_width:         10,
  rhythm_id:         20,
  mechanism:         15,
  hemodynamic_impact: 10,
  escalation_level:  15,
  first_action:      20,
  medication_safety: 25,
};

export const DETECTIVE_STEP_PARTIAL_CREDIT = 0.5; // fraction of points for second-attempt correct

/** Steps that are shown in the "basic" investigation mode (beginners). */
export const DETECTIVE_BASIC_STEPS: DetectiveStepKey[] = [
  "rate", "regularity", "p_wave", "qrs_width", "rhythm_id", "escalation_level", "first_action",
];

/** Full 11-step investigation for advanced learners. */
export const DETECTIVE_ADVANCED_STEPS: DetectiveStepKey[] = [
  "rate", "regularity", "p_wave", "pr_interval", "qrs_width",
  "rhythm_id", "mechanism", "hemodynamic_impact",
  "escalation_level", "first_action", "medication_safety",
];

// ─── Rate bracket options ─────────────────────────────────────────────────────

export type RateBracket =
  | "< 40 BPM (very slow)"
  | "40–59 BPM (bradycardia)"
  | "60–100 BPM (normal)"
  | "101–150 BPM (tachycardia)"
  | "> 150 BPM (rapid tachycardia)"
  | "Not measurable (chaotic/absent)";

export const RATE_BRACKET_OPTIONS: RateBracket[] = [
  "< 40 BPM (very slow)",
  "40–59 BPM (bradycardia)",
  "60–100 BPM (normal)",
  "101–150 BPM (tachycardia)",
  "> 150 BPM (rapid tachycardia)",
  "Not measurable (chaotic/absent)",
];

export function getRateBracketForConfig(config: EcgStripMediaConfig): RateBracket {
  const r = config.rate;
  if (r === 0) return "Not measurable (chaotic/absent)";
  if (r < 40) return "< 40 BPM (very slow)";
  if (r < 60) return "40–59 BPM (bradycardia)";
  if (r <= 100) return "60–100 BPM (normal)";
  if (r <= 150) return "101–150 BPM (tachycardia)";
  return "> 150 BPM (rapid tachycardia)";
}

// ─── Regularity options ───────────────────────────────────────────────────────

export type RegularityOption =
  | "Regular"
  | "Regularly irregular (predictable pattern)"
  | "Irregularly irregular (no pattern)"
  | "Chaotic (no identifiable rhythm)"
  | "Absent";

export const REGULARITY_OPTIONS: RegularityOption[] = [
  "Regular",
  "Regularly irregular (predictable pattern)",
  "Irregularly irregular (no pattern)",
  "Chaotic (no identifiable rhythm)",
  "Absent",
];

export function getRegularityOptionForTemplate(
  t: EcgRhythmTemplate,
): RegularityOption {
  const map: Record<EcgRhythmTemplate["rhythmRegularity"], RegularityOption> = {
    regular: "Regular",
    irregular: "Irregularly irregular (no pattern)",
    regularly_irregular: "Regularly irregular (predictable pattern)",
    chaotic: "Chaotic (no identifiable rhythm)",
    absent: "Absent",
  };
  return map[t.rhythmRegularity];
}

// ─── P-wave options ───────────────────────────────────────────────────────────

export type PWaveOption =
  | "Upright before every QRS (normal sinus)"
  | "Absent — replaced by fibrillatory baseline"
  | "Absent — no atrial activity"
  | "Sawtooth flutter waves (not discrete P-waves)"
  | "Retrograde (inverted in II, III, aVF)"
  | "Dissociated (P-waves independent of QRS)"
  | "Variable morphology (some normal, some ectopic)"
  | "Pacemaker spike before QRS"
  | "Absent or hidden in QRS/T-wave";

export const P_WAVE_OPTIONS: PWaveOption[] = [
  "Upright before every QRS (normal sinus)",
  "Absent — replaced by fibrillatory baseline",
  "Absent — no atrial activity",
  "Sawtooth flutter waves (not discrete P-waves)",
  "Retrograde (inverted in II, III, aVF)",
  "Dissociated (P-waves independent of QRS)",
  "Variable morphology (some normal, some ectopic)",
  "Pacemaker spike before QRS",
  "Absent or hidden in QRS/T-wave",
];

// ─── QRS width options ────────────────────────────────────────────────────────

export type QrsWidthOption =
  | "Narrow (< 0.12s) — normal ventricular conduction"
  | "Wide (≥ 0.12s) — abnormal ventricular conduction"
  | "Not measurable";

export const QRS_WIDTH_OPTIONS: QrsWidthOption[] = [
  "Narrow (< 0.12s) — normal ventricular conduction",
  "Wide (≥ 0.12s) — abnormal ventricular conduction",
  "Not measurable",
];

export function getQrsWidthOptionForConfig(
  config: EcgStripMediaConfig,
): QrsWidthOption {
  if (config.qrsWidth === 0) return "Not measurable";
  return config.qrsWidth >= 0.12
    ? "Wide (≥ 0.12s) — abnormal ventricular conduction"
    : "Narrow (< 0.12s) — normal ventricular conduction";
}

// ─── Escalation options ───────────────────────────────────────────────────────

export const DETECTIVE_ESCALATION_OPTIONS: { value: EcgEscalationLevel; label: string }[] = [
  { value: "monitor",            label: "Routine monitoring — no immediate action needed" },
  { value: "notify_provider",   label: "Notify provider — non-emergency notification" },
  { value: "rapid_response",    label: "Rapid Response Team — urgent bedside response" },
  { value: "code_blue",         label: "Code Blue — immediate resuscitation required" },
  { value: "varies_by_stability", label: "Depends on clinical stability" },
];

// ─── First action options ─────────────────────────────────────────────────────

export type FirstActionOption =
  | "Assess the patient at bedside (check pulse, BP, LOC, symptoms)"
  | "Call Code Blue and initiate CPR"
  | "Defibrillate (unsynchronised) — pulseless VT/VF"
  | "Synchronised cardioversion — unstable tachyarrhythmia with pulse"
  | "Apply transcutaneous pacing — symptomatic bradycardia"
  | "IV magnesium sulfate 2g — Torsades de Pointes"
  | "Activate STEMI/cath lab protocol"
  | "Administer adenosine 6mg IV — stable SVT"
  | "Hold/reverse QT-prolonging medications"
  | "Correct electrolytes (K⁺, Mg²⁺) urgently"
  | "Notify provider — document and monitor"
  | "Vagal manoeuvres — stable SVT";

export const FIRST_ACTION_OPTIONS: FirstActionOption[] = [
  "Assess the patient at bedside (check pulse, BP, LOC, symptoms)",
  "Call Code Blue and initiate CPR",
  "Defibrillate (unsynchronised) — pulseless VT/VF",
  "Synchronised cardioversion — unstable tachyarrhythmia with pulse",
  "Apply transcutaneous pacing — symptomatic bradycardia",
  "IV magnesium sulfate 2g — Torsades de Pointes",
  "Activate STEMI/cath lab protocol",
  "Administer adenosine 6mg IV — stable SVT",
  "Hold/reverse QT-prolonging medications",
  "Correct electrolytes (K⁺, Mg²⁺) urgently",
  "Notify provider — document and monitor",
  "Vagal manoeuvres — stable SVT",
];

// ─── Correct answers per rhythm ──────────────────────────────────────────────

export type DetectiveAnswerKey = {
  rateBracket: RateBracket;
  regularity: RegularityOption;
  pWave: PWaveOption;
  qrsWidth: QrsWidthOption;
  escalationLevel: EcgEscalationLevel;
  firstAction: FirstActionOption;
  /** Medication to AVOID — shown in the medication safety step */
  medicationDanger?: string;
  /** Why the medication is dangerous for this rhythm */
  medicationDangerReason?: string;
};

export const ECG_DETECTIVE_ANSWER_KEYS: Partial<Record<string, DetectiveAnswerKey>> = {
  normal_sinus_rhythm: {
    rateBracket: "60–100 BPM (normal)",
    regularity: "Regular",
    pWave: "Upright before every QRS (normal sinus)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "monitor",
    firstAction: "Notify provider — document and monitor",
  },
  sinus_bradycardia: {
    rateBracket: "40–59 BPM (bradycardia)",
    regularity: "Regular",
    pWave: "Upright before every QRS (normal sinus)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "varies_by_stability",
    firstAction: "Assess the patient at bedside (check pulse, BP, LOC, symptoms)",
  },
  sinus_tachycardia: {
    rateBracket: "101–150 BPM (tachycardia)",
    regularity: "Regular",
    pWave: "Upright before every QRS (normal sinus)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "varies_by_stability",
    firstAction: "Assess the patient at bedside (check pulse, BP, LOC, symptoms)",
    medicationDanger: "Cardioversion or adenosine",
    medicationDangerReason: "Sinus tachycardia is NOT a shockable or adenosine-responsive rhythm — treat the underlying cause, not the rate.",
  },
  atrial_fibrillation: {
    rateBracket: "101–150 BPM (tachycardia)",
    regularity: "Irregularly irregular (no pattern)",
    pWave: "Absent — replaced by fibrillatory baseline",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "notify_provider",
    firstAction: "Notify provider — document and monitor",
    medicationDanger: "Adenosine, digoxin, or verapamil if WPW suspected",
    medicationDangerReason: "In AFib with WPW, AV-nodal blockers can accelerate accessory pathway conduction → VF.",
  },
  atrial_flutter: {
    rateBracket: "60–100 BPM (normal)",
    regularity: "Regularly irregular (predictable pattern)",
    pWave: "Sawtooth flutter waves (not discrete P-waves)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "notify_provider",
    firstAction: "Notify provider — document and monitor",
    medicationDanger: "Cardioversion of flutter > 48h without anticoagulation",
    medicationDangerReason: "Cardioverting flutter > 48h without anticoagulation risks thromboembolic stroke.",
  },
  svt: {
    rateBracket: "> 150 BPM (rapid tachycardia)",
    regularity: "Regular",
    pWave: "Absent or hidden in QRS/T-wave",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "notify_provider",
    firstAction: "Vagal manoeuvres — stable SVT",
    medicationDanger: "Verapamil for wide-complex tachycardia",
    medicationDangerReason: "Verapamil given to VT (misidentified as SVT) causes haemodynamic collapse and death.",
  },
  ventricular_tachycardia: {
    rateBracket: "> 150 BPM (rapid tachycardia)",
    regularity: "Regular",
    pWave: "Absent or hidden in QRS/T-wave",
    qrsWidth: "Wide (≥ 0.12s) — abnormal ventricular conduction",
    escalationLevel: "rapid_response",
    firstAction: "Assess the patient at bedside (check pulse, BP, LOC, symptoms)",
    medicationDanger: "Verapamil or adenosine",
    medicationDangerReason: "Verapamil causes haemodynamic collapse in VT. Adenosine has no effect and wastes time.",
  },
  ventricular_fibrillation: {
    rateBracket: "Not measurable (chaotic/absent)",
    regularity: "Chaotic (no identifiable rhythm)",
    pWave: "Absent — no atrial activity",
    qrsWidth: "Not measurable",
    escalationLevel: "code_blue",
    firstAction: "Defibrillate (unsynchronised) — pulseless VT/VF",
  },
  pea: {
    rateBracket: "40–59 BPM (bradycardia)",
    regularity: "Regular",
    pWave: "Variable morphology (some normal, some ectopic)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "code_blue",
    firstAction: "Call Code Blue and initiate CPR",
    medicationDanger: "Defibrillation",
    medicationDangerReason: "PEA is NOT a shockable rhythm. Defibrillating PEA wastes time and can cause myocardial injury.",
  },
  asystole: {
    rateBracket: "Not measurable (chaotic/absent)",
    regularity: "Absent",
    pWave: "Absent — no atrial activity",
    qrsWidth: "Not measurable",
    escalationLevel: "code_blue",
    firstAction: "Call Code Blue and initiate CPR",
    medicationDanger: "Defibrillation",
    medicationDangerReason: "Asystole is NOT shockable. Shocking a flatline does not restart the heart and wastes CPR time.",
  },
  second_degree_type_ii_av_block: {
    rateBracket: "40–59 BPM (bradycardia)",
    regularity: "Regularly irregular (predictable pattern)",
    pWave: "Upright before every QRS (normal sinus)",
    qrsWidth: "Wide (≥ 0.12s) — abnormal ventricular conduction",
    escalationLevel: "notify_provider",
    firstAction: "Assess the patient at bedside (check pulse, BP, LOC, symptoms)",
    medicationDanger: "Atropine as primary treatment",
    medicationDangerReason: "Atropine is usually ineffective for Mobitz II (infranodal block). It may paradoxically increase atrial rate without improving ventricular conduction.",
  },
  third_degree_av_block: {
    rateBracket: "< 40 BPM (very slow)",
    regularity: "Regular",
    pWave: "Dissociated (P-waves independent of QRS)",
    qrsWidth: "Wide (≥ 0.12s) — abnormal ventricular conduction",
    escalationLevel: "rapid_response",
    firstAction: "Apply transcutaneous pacing — symptomatic bradycardia",
    medicationDanger: "Atropine alone as definitive treatment",
    medicationDangerReason: "Atropine may not help ventricular escape and should not replace definitive pacing in complete heart block.",
  },
  stemi_pattern: {
    rateBracket: "60–100 BPM (normal)",
    regularity: "Regular",
    pWave: "Upright before every QRS (normal sinus)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "code_blue",
    firstAction: "Activate STEMI/cath lab protocol",
    medicationDanger: "Nitroglycerin if hypotensive or RV infarction suspected",
    medicationDangerReason: "Nitroglycerin causes vasodilation. In RV infarction or hypotension, it can cause cardiovascular collapse.",
  },
  torsades_de_pointes: {
    rateBracket: "> 150 BPM (rapid tachycardia)",
    regularity: "Regularly irregular (predictable pattern)",
    pWave: "Absent or hidden in QRS/T-wave",
    qrsWidth: "Wide (≥ 0.12s) — abnormal ventricular conduction",
    escalationLevel: "rapid_response",
    firstAction: "IV magnesium sulfate 2g — Torsades de Pointes",
    medicationDanger: "Amiodarone",
    medicationDangerReason: "Amiodarone prolongs the QT interval and worsens Torsades. It is contraindicated in QT-related polymorphic VT.",
  },
  hyperkalemia_pattern: {
    rateBracket: "40–59 BPM (bradycardia)",
    regularity: "Regular",
    pWave: "Variable morphology (some normal, some ectopic)",
    qrsWidth: "Wide (≥ 0.12s) — abnormal ventricular conduction",
    escalationLevel: "notify_provider",
    firstAction: "Correct electrolytes (K⁺, Mg²⁺) urgently",
    medicationDanger: "Potassium-containing IV fluids (e.g. Lactated Ringer's)",
    medicationDangerReason: "Adding more potassium in hyperkalemia worsens the cardiac toxicity.",
  },
  hypokalemia_pattern: {
    rateBracket: "60–100 BPM (normal)",
    regularity: "Regular",
    pWave: "Upright before every QRS (normal sinus)",
    qrsWidth: "Narrow (< 0.12s) — normal ventricular conduction",
    escalationLevel: "notify_provider",
    firstAction: "Correct electrolytes (K⁺, Mg²⁺) urgently",
    medicationDanger: "IV potassium as IV push",
    medicationDangerReason: "Rapid IV potassium administration causes cardiac arrest. It must always be diluted and given via infusion pump.",
  },
  paced_rhythm: {
    rateBracket: "60–100 BPM (normal)",
    regularity: "Regular",
    pWave: "Pacemaker spike before QRS",
    qrsWidth: "Wide (≥ 0.12s) — abnormal ventricular conduction",
    escalationLevel: "monitor",
    firstAction: "Notify provider — document and monitor",
  },
};

// ─── Session state ────────────────────────────────────────────────────────────

export type DetectiveStepAttempt = {
  stepKey: DetectiveStepKey;
  selectedAnswer: string;
  isCorrect: boolean;
  attemptNumber: 1 | 2;
  pointsEarned: number;
  pointsPossible: number;
};

export type DetectiveSessionPhase =
  | "investigating"   // Learner is answering steps
  | "revealing"       // Answers are locked, content is being revealed
  | "complete";       // Full reveal shown, scores computed

export type DetectiveSession = {
  sessionId: string;
  rhythmKey: string;
  stripConfig: EcgStripMediaConfig;
  mode: "basic" | "advanced";
  stepsOrder: DetectiveStepKey[];
  currentStepIndex: number;
  phase: DetectiveSessionPhase;
  attempts: DetectiveStepAttempt[];
  startedAt: string;
  completedAt: string | null;
  /** True if the learner unlocked the early reveal (by answering rhythm_id correctly on first try) */
  earlyRevealUnlocked: boolean;
};

// ─── Session factory ──────────────────────────────────────────────────────────

export function createDetectiveSession(
  rhythmKey: string,
  stripConfig: EcgStripMediaConfig,
  mode: "basic" | "advanced" = "basic",
): DetectiveSession {
  return {
    sessionId: `det-${rhythmKey}-${Date.now()}`,
    rhythmKey,
    stripConfig,
    mode,
    stepsOrder: mode === "basic" ? DETECTIVE_BASIC_STEPS : DETECTIVE_ADVANCED_STEPS,
    currentStepIndex: 0,
    phase: "investigating",
    attempts: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
    earlyRevealUnlocked: false,
  };
}

// ─── Step answer submission ───────────────────────────────────────────────────

export type DetectiveAnswerResult = {
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  feedback: string;
  correctAnswer: string;
  canRetry: boolean;
};

export function submitDetectiveAnswer(
  session: DetectiveSession,
  answer: string,
): { result: DetectiveAnswerResult; updatedSession: DetectiveSession } {
  const stepKey = session.stepsOrder[session.currentStepIndex];
  if (!stepKey) throw new Error("No current step");

  const answerKey = ECG_DETECTIVE_ANSWER_KEYS[session.rhythmKey];
  const expectedAnswer = getExpectedAnswer(stepKey, answerKey, session.rhythmKey);
  const isCorrect = normaliseAnswer(answer) === normaliseAnswer(expectedAnswer);

  // Determine if this is a retry
  const prevAttempt = session.attempts.findLast((a) => a.stepKey === stepKey);
  const attemptNumber: 1 | 2 = prevAttempt ? 2 : 1;
  const pointsPossible = DETECTIVE_STEP_POINTS[stepKey] ?? 10;
  const pointsEarned = isCorrect
    ? attemptNumber === 1 ? pointsPossible : Math.round(pointsPossible * DETECTIVE_STEP_PARTIAL_CREDIT)
    : 0;

  const attempt: DetectiveStepAttempt = {
    stepKey,
    selectedAnswer: answer,
    isCorrect,
    attemptNumber,
    pointsEarned,
    pointsPossible,
  };

  const feedback = generateStepFeedback(stepKey, answer, expectedAnswer, isCorrect, session.rhythmKey);
  const canRetry = !isCorrect && attemptNumber === 1;

  const updatedAttempts = [...session.attempts, attempt];

  // Advance to next step if correct or second attempt exhausted
  const shouldAdvance = isCorrect || attemptNumber === 2;
  const nextStepIndex = shouldAdvance ? session.currentStepIndex + 1 : session.currentStepIndex;
  const isComplete = nextStepIndex >= session.stepsOrder.length;

  const earlyRevealUnlocked =
    session.earlyRevealUnlocked ||
    (stepKey === "rhythm_id" && isCorrect && attemptNumber === 1);

  const updatedSession: DetectiveSession = {
    ...session,
    currentStepIndex: nextStepIndex,
    phase: isComplete ? "revealing" : "investigating",
    attempts: updatedAttempts,
    completedAt: isComplete ? new Date().toISOString() : null,
    earlyRevealUnlocked,
  };

  return {
    result: {
      isCorrect,
      pointsEarned,
      pointsPossible,
      feedback,
      correctAnswer: expectedAnswer,
      canRetry,
    },
    updatedSession,
  };
}

function getExpectedAnswer(
  stepKey: DetectiveStepKey,
  answerKey: Partial<DetectiveAnswerKey> | undefined,
  rhythmKey: string,
): string {
  if (!answerKey) return "";
  switch (stepKey) {
    case "rate": return answerKey.rateBracket ?? "";
    case "regularity": return answerKey.regularity ?? "";
    case "p_wave": return answerKey.pWave ?? "";
    case "qrs_width": return answerKey.qrsWidth ?? "";
    case "escalation_level": return answerKey.escalationLevel ?? "";
    case "first_action": return answerKey.firstAction ?? "";
    case "rhythm_id": return rhythmKey;
    case "medication_safety": return answerKey.medicationDanger ?? "No specific contraindication";
    default: return "";
  }
}

function normaliseAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
}

function generateStepFeedback(
  stepKey: DetectiveStepKey,
  given: string,
  expected: string,
  isCorrect: boolean,
  rhythmKey: string,
): string {
  if (isCorrect) {
    const positives = [
      "Correct — good clinical eye.",
      "Exactly right.",
      "That's the key finding.",
      "Correct — this is what separates this rhythm from its look-alikes.",
    ];
    return positives[Math.floor(rhythmKey.length % positives.length)] ?? "Correct.";
  }

  const stepHints: Partial<Record<DetectiveStepKey, string>> = {
    rate: "Count the QRS complexes in 6 seconds and multiply by 10, or divide 300 by the number of large boxes between R-waves.",
    regularity: "Measure several consecutive R-R intervals. If they vary cyclically with breathing, that is sinus arrhythmia. If completely random, consider AFib.",
    p_wave: "Look carefully in lead II for P-waves before each QRS. Are they absent? Inverted? Part of a sawtooth baseline?",
    pr_interval: "Measure from start of P-wave to start of QRS. Normal is 3–5 small boxes (0.12–0.20s).",
    qrs_width: "Measure the QRS width. ≥ 3 small boxes (0.12s) = wide. Anything wider than 2 large boxes is very wide.",
    rhythm_id: "Consider your findings: rate, regularity, P-wave, QRS width. Which rhythm fits ALL of these criteria?",
    escalation_level: "Assess the clinical context: is this rhythm causing haemodynamic compromise, or is it stable? Emergency rhythms = code_blue. Stable life-threatening = rapid_response.",
    first_action: "Think ABCDE: your first action should address the most immediate threat. Pulseless = CPR. Wide rapid = check pulse. New ST elevation = cath lab.",
    medication_safety: `For ${rhythmKey}, there is a specific medication or intervention that could cause serious harm. Think about what would worsen this rhythm.`,
  };

  const hint = stepHints[stepKey] ?? "Review the recognition criteria for this step.";
  return `Not quite — the correct answer is: ${expected}. ${hint}`;
}

// ─── Session scoring ──────────────────────────────────────────────────────────

export type DetectiveSessionScore = {
  totalPoints: number;
  maxPoints: number;
  percentScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  domainScores: {
    recognition: number;
    clinicalReasoning: number;
    escalation: number;
    medicationSafety: number;
  };
  perfectSteps: DetectiveStepKey[];
  weakSteps: DetectiveStepKey[];
  rhythmKey: string;
};

const RECOGNITION_STEPS: DetectiveStepKey[] = ["rate", "regularity", "p_wave", "pr_interval", "qrs_width", "rhythm_id"];
const CLINICAL_REASONING_STEPS: DetectiveStepKey[] = ["mechanism", "hemodynamic_impact"];
const ESCALATION_STEPS: DetectiveStepKey[] = ["escalation_level", "first_action"];
const MEDICATION_SAFETY_STEPS: DetectiveStepKey[] = ["medication_safety"];

export function scoreDetectiveSession(session: DetectiveSession): DetectiveSessionScore {
  const totalPoints = session.attempts.reduce((sum, a) => sum + a.pointsEarned, 0);
  const maxPoints = session.stepsOrder.reduce(
    (sum, key) => sum + (DETECTIVE_STEP_POINTS[key] ?? 10),
    0,
  );
  const percentScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  const domainScore = (steps: DetectiveStepKey[]): number => {
    const relevant = session.attempts.filter((a) => steps.includes(a.stepKey));
    const earned = relevant.reduce((s, a) => s + a.pointsEarned, 0);
    const possible = relevant.reduce((s, a) => s + a.pointsPossible, 0);
    return possible > 0 ? Math.round((earned / possible) * 100) : 100;
  };

  const perfectSteps = session.attempts
    .filter((a) => a.isCorrect && a.attemptNumber === 1)
    .map((a) => a.stepKey);
  const weakSteps = session.attempts
    .filter((a) => !a.isCorrect || a.attemptNumber === 2)
    .map((a) => a.stepKey);

  return {
    totalPoints,
    maxPoints,
    percentScore,
    grade: percentScore >= 90 ? "A" : percentScore >= 80 ? "B" : percentScore >= 70 ? "C" : percentScore >= 60 ? "D" : "F",
    domainScores: {
      recognition: domainScore(RECOGNITION_STEPS),
      clinicalReasoning: domainScore(CLINICAL_REASONING_STEPS),
      escalation: domainScore(ESCALATION_STEPS),
      medicationSafety: domainScore(MEDICATION_SAFETY_STEPS),
    },
    perfectSteps: [...new Set(perfectSteps)],
    weakSteps: [...new Set(weakSteps)],
    rhythmKey: session.rhythmKey,
  };
}

// ─── Progress tracking ────────────────────────────────────────────────────────

export type DetectiveModeProgress = {
  /** Rhythm keys that have been completed in detective mode */
  completedRhythms: string[];
  /** Rhythm keys where the learner scored A grade */
  masteredRhythms: string[];
  /** Rhythm keys where the learner scored < 70% — needs practice */
  weakRhythms: string[];
  /** Total sessions completed */
  totalSessions: number;
  /** Aggregate domain scores across all sessions */
  aggregateDomainScores: DetectiveSessionScore["domainScores"];
  /** Most recent session scores per rhythm */
  latestScores: Record<string, number>;
};

export function updateDetectiveModeProgress(
  existing: DetectiveModeProgress,
  score: DetectiveSessionScore,
): DetectiveModeProgress {
  const { rhythmKey, percentScore } = score;

  const completedRhythms = existing.completedRhythms.includes(rhythmKey)
    ? existing.completedRhythms
    : [...existing.completedRhythms, rhythmKey];

  const masteredRhythms = percentScore >= 90
    ? existing.masteredRhythms.includes(rhythmKey)
      ? existing.masteredRhythms
      : [...existing.masteredRhythms, rhythmKey]
    : existing.masteredRhythms.filter((k) => k !== rhythmKey);

  const weakRhythms = percentScore < 70
    ? existing.weakRhythms.includes(rhythmKey)
      ? existing.weakRhythms
      : [...existing.weakRhythms, rhythmKey]
    : existing.weakRhythms.filter((k) => k !== rhythmKey);

  return {
    completedRhythms,
    masteredRhythms,
    weakRhythms,
    totalSessions: existing.totalSessions + 1,
    aggregateDomainScores: {
      recognition: Math.round(
        (existing.aggregateDomainScores.recognition + score.domainScores.recognition) / 2,
      ),
      clinicalReasoning: Math.round(
        (existing.aggregateDomainScores.clinicalReasoning + score.domainScores.clinicalReasoning) / 2,
      ),
      escalation: Math.round(
        (existing.aggregateDomainScores.escalation + score.domainScores.escalation) / 2,
      ),
      medicationSafety: Math.round(
        (existing.aggregateDomainScores.medicationSafety + score.domainScores.medicationSafety) / 2,
      ),
    },
    latestScores: { ...existing.latestScores, [rhythmKey]: percentScore },
  };
}

export function createEmptyDetectiveModeProgress(): DetectiveModeProgress {
  return {
    completedRhythms: [],
    masteredRhythms: [],
    weakRhythms: [],
    totalSessions: 0,
    aggregateDomainScores: { recognition: 0, clinicalReasoning: 0, escalation: 0, medicationSafety: 0 },
    latestScores: {},
  };
}

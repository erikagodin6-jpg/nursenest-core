/**
 * NGN Monitor Embed
 *
 * Generates Next-Generation NCLEX (NGN) question data from a live or
 * snapshot PhysiologyState. The learner views the monitor, then answers
 * the question — correlating what they see on the display to a clinical decision.
 *
 * Supported NGN formats:
 *   - bowtie         (actions to take + conditions, parameters to monitor)
 *   - matrix         (ordered list of conditions/actions by priority)
 *   - sata           (select all that apply)
 *   - prioritization (rank order)
 *   - cloze          (drop-down fill-in-the-blank)
 *
 * Each question is generated from:
 *   - The current PhysiologyState (drives stem, answer options, correct answers)
 *   - The condition key (drives clinical context and option set)
 *   - The condition stage (drives urgency of the stem)
 */

import type { PhysiologyState, ConditionStage } from "./physiology-state";
import { deriveAlarms } from "./physiology-state";
import { getDeteriorationPattern } from "./deterioration-patterns";
import { getInterventionsForCondition } from "./intervention-catalog";

// ─── NGN question types ───────────────────────────────────────────────────────

export type NgnFormat =
  | "bowtie"
  | "matrix"
  | "sata"
  | "prioritization"
  | "cloze"
  | "trend_recognition";

export interface NgnOption {
  id: string;
  text: string;
  isCorrect: boolean;
  /** Explanation shown after answer. */
  rationale: string;
}

export interface BowtiePanels {
  /** Actions to take (left panel). */
  actionsToTake: NgnOption[];
  /** Patient condition the actions address (center). */
  condition: string;
  /** Parameters to monitor (right panel). */
  parametersToMonitor: NgnOption[];
}

export interface MatrixRow {
  action: string;
  columns: Record<string, NgnOption & { applicable: boolean }>;
}

export interface NgnQuestion {
  id: string;
  format: NgnFormat;
  stem: string;
  /** What the learner sees before answering (the monitor snapshot description). */
  monitorContext: string;
  options?: NgnOption[];
  bowtie?: BowtiePanels;
  matrixRows?: MatrixRow[];
  /** Correct answer IDs (for SATA and prioritization). */
  correctOptionIds: string[];
  /** Overall rationale shown after scoring. */
  rationale: string;
  /** NCJMM domain this question primarily tests. */
  ncjmmDomain: string;
  /** Clinical tags for question bank routing. */
  clinicalTags: string[];
}

// ─── Monitor context builder ──────────────────────────────────────────────────

function buildMonitorContext(state: PhysiologyState): string {
  const alarms = deriveAlarms(state);
  const criticalAlarms = alarms.filter((a) => a.level === "critical").map((a) => a.message);
  const warningAlarms = alarms.filter((a) => a.level === "warning").map((a) => a.message);

  const vitals = [
    `HR ${Math.round(state.heartRate)} bpm`,
    `BP ${Math.round(state.systolicBP)}/${Math.round(state.diastolicBP)} mmHg (MAP ${Math.round(state.map)})`,
    `SpO₂ ${Math.round(state.spo2)}%`,
    `RR ${Math.round(state.respiratoryRate)}/min`,
    `Temp ${state.temperature.toFixed(1)}°C`,
  ];

  const ecgLine = `ECG: ${state.ecgRhythmKey.replace(/_/g, " ")} at ${Math.round(state.ecgRate || state.heartRate)} bpm.`;

  const alarmLines = criticalAlarms.length > 0
    ? `CRITICAL ALARMS: ${criticalAlarms.join("; ")}.`
    : warningAlarms.length > 0
    ? `Warning alarms: ${warningAlarms.join("; ")}.`
    : "";

  return [vitals.join(" · "), ecgLine, alarmLines].filter(Boolean).join(" ");
}

// ─── Format generators ────────────────────────────────────────────────────────

function buildSataQuestion(state: PhysiologyState, conditionKey: string, stage: ConditionStage): NgnQuestion {
  const pattern = getDeteriorationPattern(conditionKey);
  const indicated = getInterventionsForCondition(conditionKey);
  const allInterventions = getInterventionsForCondition(conditionKey).concat(
    getInterventionsForCondition("sepsis").slice(0, 2) // distractors from another condition
  );

  const stem = stage === "critical" || stage === "severe"
    ? `The nurse is caring for a patient with ${pattern?.label ?? conditionKey}. The monitor shows the values above. Which nursing actions are MOST appropriate at this time? Select all that apply.`
    : `A patient is showing early signs of ${pattern?.label ?? conditionKey}. Based on the monitor data, which assessments and interventions should the nurse initiate? Select all that apply.`;

  const options: NgnOption[] = allInterventions.slice(0, 6).map((inv) => ({
    id: inv.key,
    text: inv.label,
    isCorrect: indicated.some((i) => i.key === inv.key),
    rationale: indicated.some((i) => i.key === inv.key)
      ? inv.description
      : `${inv.label} is not the priority intervention for ${pattern?.label ?? conditionKey} at this stage.`,
  }));

  return {
    id: `sata-${conditionKey}-${stage}`,
    format: "sata",
    stem,
    monitorContext: buildMonitorContext(state),
    options,
    correctOptionIds: options.filter((o) => o.isCorrect).map((o) => o.id),
    rationale: pattern?.stages[stage].explanation ?? "",
    ncjmmDomain: "generate_solutions",
    clinicalTags: [conditionKey, stage, "sata", "intervention-selection"],
  };
}

function buildBowTieQuestion(state: PhysiologyState, conditionKey: string, stage: ConditionStage): NgnQuestion {
  const pattern = getDeteriorationPattern(conditionKey);
  const indicated = getInterventionsForCondition(conditionKey);

  const actionsToTake: NgnOption[] = [
    ...indicated.slice(0, 2).map((inv) => ({
      id: `action-${inv.key}`,
      text: inv.shortLabel,
      isCorrect: true,
      rationale: inv.description,
    })),
    { id: "action-wrong-1", text: "Continue current orders", isCorrect: false, rationale: "The patient's condition requires active intervention." },
    { id: "action-wrong-2", text: "Reassess in 4 hours", isCorrect: false, rationale: "This timeline is too slow for the current acuity." },
  ];

  const parametersToMonitor: NgnOption[] = [
    { id: "param-map", text: "MAP every 15 minutes", isCorrect: true, rationale: "MAP is the primary hemodynamic target (> 65 mmHg)." },
    { id: "param-spo2", text: "Continuous SpO₂ monitoring", isCorrect: true, rationale: "SpO₂ tracks oxygenation response to treatment." },
    { id: "param-weight", text: "Daily weight", isCorrect: false, rationale: "Daily weight is not the immediate priority parameter." },
    { id: "param-pain", text: "Pain score every 2 hours", isCorrect: false, rationale: "Not the highest priority parameter in this acute scenario." },
  ];

  return {
    id: `bowtie-${conditionKey}-${stage}`,
    format: "bowtie",
    stem: `Complete the bowtie diagram for a patient with ${pattern?.label ?? conditionKey}.`,
    monitorContext: buildMonitorContext(state),
    bowtie: {
      actionsToTake,
      condition: pattern?.label ?? conditionKey,
      parametersToMonitor,
    },
    correctOptionIds: [
      ...actionsToTake.filter((o) => o.isCorrect).map((o) => o.id),
      ...parametersToMonitor.filter((o) => o.isCorrect).map((o) => o.id),
    ],
    rationale: `For ${pattern?.label ?? conditionKey}: ${pattern?.stages[stage].explanation ?? ""}`,
    ncjmmDomain: "take_action",
    clinicalTags: [conditionKey, stage, "bowtie", "clinical-judgment"],
  };
}

function buildPrioritizationQuestion(state: PhysiologyState, conditionKey: string, stage: ConditionStage): NgnQuestion {
  const pattern = getDeteriorationPattern(conditionKey);
  const alarms = deriveAlarms(state);

  const findings = [
    alarms[0]?.message ?? `SpO₂ ${Math.round(state.spo2)}%`,
    alarms[1]?.message ?? `HR ${Math.round(state.heartRate)} bpm`,
    `Temperature ${state.temperature.toFixed(1)}°C`,
    `Pain score ${Math.round(state.painScore)}/10`,
  ];

  const options: NgnOption[] = findings.map((f, i) => ({
    id: `finding-${i}`,
    text: f,
    isCorrect: i < 2,
    rationale: i < 2
      ? "This finding represents the highest acuity — immediate action required."
      : "Important but not the immediate priority in this scenario.",
  }));

  return {
    id: `prioritization-${conditionKey}-${stage}`,
    format: "prioritization",
    stem: `A patient with ${pattern?.label ?? conditionKey} has the following monitor findings. Rank them in order of nursing priority (1 = most urgent).`,
    monitorContext: buildMonitorContext(state),
    options,
    correctOptionIds: [options[0]!.id, options[1]!.id],
    rationale: `In ${pattern?.label ?? conditionKey}, ${alarms[0]?.message ?? "the primary alarm"} demands first response.`,
    ncjmmDomain: "prioritize_hypotheses",
    clinicalTags: [conditionKey, stage, "prioritization"],
  };
}

function buildTrendRecognitionQuestion(state: PhysiologyState, conditionKey: string, stage: ConditionStage): NgnQuestion {
  const pattern = getDeteriorationPattern(conditionKey);
  const trend = stage === "early" ? "developing" : stage === "developing" ? "worsening" : "critical";

  const options: NgnOption[] = [
    {
      id: "trend-worsening",
      text: `The patient is ${trend} — escalate care`,
      isCorrect: stage !== "early",
      rationale: "The trends indicate clinical deterioration requiring intervention.",
    },
    {
      id: "trend-stable",
      text: "The patient is stable — continue monitoring",
      isCorrect: stage === "early",
      rationale: stage === "early"
        ? "Early-stage findings can be monitored closely with readiness to intervene."
        : "The trending data indicates deterioration — monitoring alone is insufficient.",
    },
    {
      id: "trend-improving",
      text: "The patient is improving — reduce monitoring frequency",
      isCorrect: false,
      rationale: "The monitor data does not support a clinical improvement interpretation.",
    },
  ];

  return {
    id: `trend-${conditionKey}-${stage}`,
    format: "trend_recognition",
    stem: `Review the vital sign trends on the patient monitor. Which nursing interpretation is MOST accurate?`,
    monitorContext: buildMonitorContext(state),
    options,
    correctOptionIds: options.filter((o) => o.isCorrect).map((o) => o.id),
    rationale: pattern?.stages[stage].explanation ?? "",
    ncjmmDomain: "analyze_cues",
    clinicalTags: [conditionKey, stage, "trend-recognition", "analyze-cues"],
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Generates an NGN question from the current PhysiologyState.
 * The format can be specified or will be selected based on the stage.
 */
export function generateNgnQuestion(
  state: PhysiologyState,
  format?: NgnFormat,
): NgnQuestion {
  const conditionKey = state.activeConditionKey;
  const stage = state.conditionStage;

  const selectedFormat = format ?? selectFormat(stage);

  switch (selectedFormat) {
    case "bowtie":
      return buildBowTieQuestion(state, conditionKey, stage);
    case "prioritization":
      return buildPrioritizationQuestion(state, conditionKey, stage);
    case "trend_recognition":
      return buildTrendRecognitionQuestion(state, conditionKey, stage);
    case "sata":
    default:
      return buildSataQuestion(state, conditionKey, stage);
  }
}

/** Default format selection based on condition stage. */
function selectFormat(stage: ConditionStage): NgnFormat {
  switch (stage) {
    case "early":      return "trend_recognition";
    case "developing": return "sata";
    case "severe":     return "bowtie";
    case "critical":   return "prioritization";
  }
}

/** Score a learner's answer against the correct answer set. */
export function scoreNgnAnswer(
  question: NgnQuestion,
  selectedIds: string[],
): { score: number; correct: boolean; feedback: string } {
  const correctSet = new Set(question.correctOptionIds);
  const selectedSet = new Set(selectedIds);

  const truePositives = [...selectedSet].filter((id) => correctSet.has(id)).length;
  const falsePositives = [...selectedSet].filter((id) => !correctSet.has(id)).length;
  const falseNegatives = [...correctSet].filter((id) => !selectedSet.has(id)).length;

  const score = Math.max(0, Math.round(
    ((truePositives) / (correctSet.size + falsePositives + falseNegatives)) * 100,
  ));

  const correct = score === 100;
  const feedback = correct
    ? "Correct — excellent clinical judgment."
    : score >= 50
    ? `Partially correct (${score}/100). Review: ${question.rationale}`
    : `Incorrect. ${question.rationale}`;

  return { score, correct, feedback };
}

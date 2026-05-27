import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type AdaptiveDifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "licensing-exam"
  | "expert-clinical-reasoning";

export type AdaptiveDifficultyIssueCode =
  | "SCENARIO_TOO_THIN"
  | "FAKE_LENGTH_BASED_DIFFICULTY"
  | "INSUFFICIENT_COGNITIVE_DEMAND"
  | "MISSING_PRIORITY_OR_SAFETY_DEMAND"
  | "MISSING_ADVANCED_SYNTHESIS"
  | "MISSING_EXPERT_AMBIGUITY"
  | "TIER_SCOPE_MISMATCH";

export type AdaptiveDifficultyIssue = {
  code: AdaptiveDifficultyIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type AdaptiveDifficultyDescriptor = {
  level: AdaptiveDifficultyLevel;
  difficultyScoreRange: readonly [number, number];
  learnerIntent: string;
  scenarioComplexity: string;
  distractorSubtlety: string;
  prioritizationAmbiguity: string;
  patientInstability: string;
  labInterpretation: string;
  delegationNuance: string;
  medicationInteractions: string;
  diagnosticUncertainty: string;
  competingPriorities: string;
  cognitiveDemand: readonly string[];
  avoid: readonly string[];
};

export type AdaptiveDifficultyStandard = {
  tier: HealthcareProgramTier;
  descriptors: Record<AdaptiveDifficultyLevel, AdaptiveDifficultyDescriptor>;
  tierScopeGuardrails: readonly string[];
};

export type AdaptiveDifficultyInput = {
  tier: HealthcareProgramTier;
  level: AdaptiveDifficultyLevel;
  stem?: string | null;
  options?: unknown;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  cognitiveLevel?: string | null;
};

export type AdaptiveDifficultyResult = {
  pass: boolean;
  score: number;
  descriptor: AdaptiveDifficultyDescriptor;
  issues: AdaptiveDifficultyIssue[];
};

const BEGINNER_DESCRIPTOR: AdaptiveDifficultyDescriptor = {
  level: "beginner",
  difficultyScoreRange: [1, 1.9],
  learnerIntent: "Reinforce foundational safety, expected findings, and first-step recognition.",
  scenarioComplexity: "One clear problem with limited patient context and obvious relevant cues.",
  distractorSubtlety: "Distractors are plausible but clearly less safe or less relevant after cue recognition.",
  prioritizationAmbiguity: "Low ambiguity; the safest first action should be identifiable from one major cue.",
  patientInstability: "Stable or early change; instability cues should be explicit.",
  labInterpretation: "Normal/abnormal recognition only, with no multi-lab synthesis required.",
  delegationNuance: "Basic scope and reporting decisions.",
  medicationInteractions: "Common safety checks such as allergy, dose, hold parameters, or hypoglycemia risk.",
  diagnosticUncertainty: "Minimal; diagnosis or care context is usually supplied.",
  competingPriorities: "Few competing tasks; one safety priority is dominant.",
  cognitiveDemand: ["recognition", "foundational safety", "expected vs unexpected findings"],
  avoid: ["long vignette without added reasoning", "obscure exceptions", "advanced independent management"],
};

const INTERMEDIATE_DESCRIPTOR: AdaptiveDifficultyDescriptor = {
  level: "intermediate",
  difficultyScoreRange: [2, 2.9],
  learnerIntent: "Build application of assessment cues, standard interventions, and early prioritization.",
  scenarioComplexity: "Two to three relevant cues with one distractor cue that should not drive the answer.",
  distractorSubtlety: "Distractors map to common but incomplete actions such as teaching before assessment.",
  prioritizationAmbiguity: "Moderate; learners must choose the best first step, not merely a correct step.",
  patientInstability: "Mild or potential deterioration with clear escalation criteria.",
  labInterpretation: "Simple trend or one abnormal value connected to symptoms.",
  delegationNuance: "Basic delegation boundaries with predictable patient needs.",
  medicationInteractions: "Common adverse effects, contraindications, and monitoring requirements.",
  diagnosticUncertainty: "Limited differential; learners interpret the most likely nursing or clinical concern.",
  competingPriorities: "Several reasonable actions, but one aligns best with safety or nursing process.",
  cognitiveDemand: ["application", "cue interpretation", "standard intervention selection"],
  avoid: ["recall-only wording", "one-word distractors", "specialist-only management"],
};

const ADVANCED_DESCRIPTOR: AdaptiveDifficultyDescriptor = {
  level: "advanced",
  difficultyScoreRange: [3, 3.9],
  learnerIntent: "Require synthesis across cues, trends, safety, delegation, and intervention sequencing.",
  scenarioComplexity: "Several relevant cues, including trends or comorbidities that change priority.",
  distractorSubtlety: "Distractors are clinically reasonable but flawed in timing, priority, scope, or sequence.",
  prioritizationAmbiguity: "High; multiple actions are plausible and the learner must rank urgency.",
  patientInstability: "Potential or active deterioration that requires recognition and timely action.",
  labInterpretation: "Trend interpretation or linked lab/assessment findings within tier scope.",
  delegationNuance: "Delegation requires acuity, stability, and scope judgment.",
  medicationInteractions: "Medication safety includes interactions, side effects, contraindications, or monitoring.",
  diagnosticUncertainty: "Uncertainty is present, but the safest immediate action is still defensible.",
  competingPriorities: "Multiple patients, actions, or clinical findings compete for attention.",
  cognitiveDemand: ["synthesis", "prioritization", "delegation nuance", "trend recognition"],
  avoid: ["difficulty created only by extra text", "rare specialty facts", "unsupported ambiguity"],
};

const LICENSING_DESCRIPTOR: AdaptiveDifficultyDescriptor = {
  level: "licensing-exam",
  difficultyScoreRange: [4, 4.6],
  learnerIntent: "Mimic licensure-style clinical judgment under realistic uncertainty.",
  scenarioComplexity: "Concise but information-dense vignette with competing cues and a clear decision point.",
  distractorSubtlety: "Distractors reflect realistic exam traps and common bedside reasoning errors.",
  prioritizationAmbiguity: "High; learners distinguish immediate, priority, and appropriate-but-later actions.",
  patientInstability: "Acute change, risk of harm, or unstable-vs-stable comparison is commonly present.",
  labInterpretation: "Meaningful abnormal values or trends that change priority without becoming specialist-level.",
  delegationNuance: "Delegation and scope decisions require stability and judgment distinctions.",
  medicationInteractions: "Medication decisions require safety monitoring, contraindication recognition, or interaction awareness.",
  diagnosticUncertainty: "Moderate uncertainty; learners act on the highest-risk interpretation.",
  competingPriorities: "Several plausible interventions, patients, or findings compete under time pressure.",
  cognitiveDemand: ["clinical judgment", "risk discrimination", "sequencing", "exam-trap recognition"],
  avoid: ["overly technical interpretation beyond tier scope", "trick wording", "longness as difficulty"],
};

const EXPERT_DESCRIPTOR: AdaptiveDifficultyDescriptor = {
  level: "expert-clinical-reasoning",
  difficultyScoreRange: [4.7, 5],
  learnerIntent: "Simulate real clinical ambiguity while preserving a defensible best answer.",
  scenarioComplexity: "Layered scenario with incomplete data, competing risks, and changing priorities.",
  distractorSubtlety: "Distractors are reasonable actions that fail because of timing, risk, scope, or missing cue synthesis.",
  prioritizationAmbiguity: "Very high; best answer depends on weighing instability, uncertainty, and downstream harm.",
  patientInstability: "Unstable, evolving, or high-risk presentation where deterioration must be anticipated.",
  labInterpretation: "Integrated trend, diagnostic, or treatment-risk interpretation appropriate to tier scope.",
  delegationNuance: "Delegation, escalation, or independent management is nuanced and context-dependent.",
  medicationInteractions: "Medication choices require contraindication, interaction, monitoring, and follow-up logic.",
  diagnosticUncertainty: "Meaningful uncertainty remains; action is based on risk and probability rather than certainty.",
  competingPriorities: "Multiple high-value actions compete; learner must choose the most protective next step.",
  cognitiveDemand: ["ambiguity tolerance", "risk-weighted synthesis", "advanced prioritization", "adaptive reasoning"],
  avoid: ["unanswerable ambiguity", "subspecialty-only facts", "physician-level decisions for RN/RPN items"],
};

const SHARED_DESCRIPTORS = {
  beginner: BEGINNER_DESCRIPTOR,
  intermediate: INTERMEDIATE_DESCRIPTOR,
  advanced: ADVANCED_DESCRIPTOR,
  "licensing-exam": LICENSING_DESCRIPTOR,
  "expert-clinical-reasoning": EXPERT_DESCRIPTOR,
} as const;

export const ADAPTIVE_DIFFICULTY_STANDARDS: Record<HealthcareProgramTier, AdaptiveDifficultyStandard> = {
  RPN: {
    tier: "RPN",
    descriptors: SHARED_DESCRIPTORS,
    tierScopeGuardrails: [
      "Scale difficulty through recognition, reporting, practical-nurse scope, and stable-vs-unstable distinctions.",
      "Do not convert difficult RPN items into independent diagnosis, prescribing, or critical-care ownership.",
    ],
  },
  RN: {
    tier: "RN",
    descriptors: SHARED_DESCRIPTORS,
    tierScopeGuardrails: [
      "Scale difficulty through safety, prioritization, delegation, trends, nursing interventions, and deterioration recognition.",
      "Avoid highly specialized ICU, advanced ventilator, physician-level, RT-specific, rare-procedure, or obscure-disease framing.",
    ],
  },
  NP: {
    tier: "NP",
    descriptors: SHARED_DESCRIPTORS,
    tierScopeGuardrails: [
      "Scale difficulty through differential diagnosis, advanced assessment, diagnostics, pharmacologic judgment, and follow-up.",
      "Avoid superficial RN-delegation framing when the item should test provider-level diagnostic or management reasoning.",
    ],
  },
  ALLIED: {
    tier: "ALLIED",
    descriptors: SHARED_DESCRIPTORS,
    tierScopeGuardrails: [
      "Scale difficulty through profession-specific workflow, equipment/specimen/procedure safeguards, scope, and escalation.",
      "Do not make Allied items difficult by defaulting to RN care planning or scope-inappropriate diagnosis/treatment ownership.",
    ],
  },
} as const;

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseArrayish(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function optionText(option: unknown): string {
  if (typeof option === "string") return option.trim();
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    return text(String(record.text ?? record.content ?? record.label ?? ""));
  }
  return "";
}

function wordCount(value: string): number {
  return value.match(/\b[\w'-]+\b/g)?.length ?? 0;
}

function countMatches(value: string, patterns: readonly RegExp[]): number {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(value) ? 1 : 0), 0);
}

function removeNegatedDifficultyClaims(value: string): string {
  return value.replace(
    /\b(no|without|lacks?|does not include|doesn't include|not enough)\b[^.]*\b(priority|prioritization|safety|trend|delegation|medication|contraindication|interaction|lab|diagnostic|uncertainty|ambiguit|competing|risk|follow-up)\w*[^.]*\.?/gi,
    "",
  );
}

function addIssue(issues: AdaptiveDifficultyIssue[], issue: AdaptiveDifficultyIssue): void {
  issues.push(issue);
}

const SAFETY_OR_PRIORITY_PATTERNS = [
  /\bfirst|priority|immediate|most important|initial|next\b/i,
  /\bunsafe|safety|fall|airway|breathing|circulation|deteriorat|unstable|new onset|acute\b/i,
] as const;

const SYNTHESIS_PATTERNS = [
  /\btrend|worsen|improv|increase|decrease|from .* to\b/i,
  /\bdelegate|assign|scope|handoff|escalat|notify|collaborat\b/i,
  /\bcontraindicat|interaction|adverse|monitor|hold parameter|therapeutic\b/i,
  /\blab|potassium|sodium|glucose|creatinine|hemoglobin|spo2|oxygen saturation|blood pressure\b/i,
] as const;

const EXPERT_AMBIGUITY_PATTERNS = [
  /\bdespite|although|however|while|but\b/i,
  /\bcompeting|multiple|uncertain|possible|likely|risk|probability|differential\b/i,
] as const;

const OUT_OF_SCOPE_PATTERNS: Record<HealthcareProgramTier, readonly RegExp[]> = {
  RPN: [/\bdiagnose|prescribe|intubate|ventilator|vasopressor|central line\b/i],
  RN: [/\bintubate|adjust ventilator settings|prescribe\b|diagnose\b|perform surgery|insert central line\b/i],
  NP: [/\bnone impossible marker\b/i],
  ALLIED: [/\bnursing care plan|prescribe|diagnose and treat|independent medical management\b/i],
};

export function resolveAdaptiveDifficultyStandard(
  tier: HealthcareProgramTier,
): AdaptiveDifficultyStandard {
  return ADAPTIVE_DIFFICULTY_STANDARDS[tier];
}

export function difficultyLevelFromScore(score: number | null | undefined): AdaptiveDifficultyLevel {
  if (typeof score !== "number" || !Number.isFinite(score)) return "intermediate";
  if (score < 2) return "beginner";
  if (score < 3) return "intermediate";
  if (score < 4) return "advanced";
  if (score < 4.7) return "licensing-exam";
  return "expert-clinical-reasoning";
}

export function evaluateAdaptiveDifficulty(
  input: AdaptiveDifficultyInput,
): AdaptiveDifficultyResult {
  const standard = resolveAdaptiveDifficultyStandard(input.tier);
  const descriptor = standard.descriptors[input.level];
  const stem = text(input.stem);
  const rationale = text(input.rationale);
  const reasoning = text(input.clinicalReasoning);
  const options = parseArrayish(input.options).map(optionText).filter(Boolean);
  const combined = [stem, rationale, reasoning, ...options].join(" ");
  const signalText = removeNegatedDifficultyClaims(combined);
  const issues: AdaptiveDifficultyIssue[] = [];
  const stemWords = wordCount(stem);
  const reasoningSignals =
    countMatches(signalText, SAFETY_OR_PRIORITY_PATTERNS) +
    countMatches(signalText, SYNTHESIS_PATTERNS) +
    countMatches(signalText, EXPERT_AMBIGUITY_PATTERNS);

  if (stemWords < 18 && input.level !== "beginner") {
    addIssue(issues, {
      code: "SCENARIO_TOO_THIN",
      severity: "error",
      message: "Scenario is too thin for the requested adaptive difficulty level.",
      remediation: "Add clinically relevant cues that increase reasoning demand, not filler text.",
    });
  }

  if (stemWords > 45 && reasoningSignals < 3) {
    addIssue(issues, {
      code: "FAKE_LENGTH_BASED_DIFFICULTY",
      severity: "warning",
      message: "The item appears long without enough cognitive-demand signals.",
      remediation: "Increase difficulty through cue synthesis, competing priorities, or distractor subtlety rather than length.",
    });
  }

  if (input.level !== "beginner" && reasoningSignals < 2) {
    addIssue(issues, {
      code: "INSUFFICIENT_COGNITIVE_DEMAND",
      severity: "error",
      message: "Difficulty level is not supported by meaningful cognitive demand.",
      remediation: "Add prioritization, safety, trend, delegation, medication, diagnostic, or uncertainty demands appropriate to the tier.",
    });
  }

  if (
    ["intermediate", "advanced", "licensing-exam", "expert-clinical-reasoning"].includes(input.level) &&
    countMatches(signalText, SAFETY_OR_PRIORITY_PATTERNS) === 0
  ) {
    addIssue(issues, {
      code: "MISSING_PRIORITY_OR_SAFETY_DEMAND",
      severity: "warning",
      message: "Item lacks an explicit safety, urgency, or priority demand.",
      remediation: "Frame the decision around a first action, unstable cue, risk, or safety consequence.",
    });
  }

  if (
    ["advanced", "licensing-exam", "expert-clinical-reasoning"].includes(input.level) &&
    countMatches(signalText, SYNTHESIS_PATTERNS) < 2
  ) {
    addIssue(issues, {
      code: "MISSING_ADVANCED_SYNTHESIS",
      severity: "error",
      message: "Advanced difficulty requires synthesis across cues, trends, scope, medication safety, or competing priorities.",
      remediation: "Add at least two meaningful synthesis demands, such as trend interpretation plus delegation or medication safety.",
    });
  }

  if (
    input.level === "expert-clinical-reasoning" &&
    countMatches(signalText, EXPERT_AMBIGUITY_PATTERNS) < 2
  ) {
    addIssue(issues, {
      code: "MISSING_EXPERT_AMBIGUITY",
      severity: "error",
      message: "Expert items should mimic real clinical ambiguity while preserving a defensible best answer.",
      remediation: "Add competing risks, incomplete information, diagnostic uncertainty, or evolving priorities.",
    });
  }

  if (OUT_OF_SCOPE_PATTERNS[input.tier].some((pattern) => pattern.test(combined))) {
    addIssue(issues, {
      code: "TIER_SCOPE_MISMATCH",
      severity: "error",
      message: "Item difficulty appears to exceed or mismatch the learner tier scope.",
      remediation: "Scale cognitive demand within the tier's role expectations instead of using out-of-scope clinical actions.",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((penalty, issue) => {
        return penalty + (issue.severity === "error" ? 20 : 9);
      }, 0),
  );

  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    descriptor,
    issues,
  };
}

export type DistractorTaxonomy =
  | "priority_error"
  | "timing_error"
  | "assessment_error"
  | "safety_error"
  | "interpretation_error"
  | "scope_error"
  | "communication_error"
  | "documentation_error"
  | "anchoring_bias"
  | "premature_closure"
  | "confirmation_bias"
  | "task_fixation"
  | "tunnel_vision"
  | "overconfidence"
  | "under_escalation"
  | "over_escalation"
  | "failure_to_rescue"
  | "pattern_recognition_error"
  | "medication_monitoring_failure"
  | "trend_interpretation_failure";

export type DistractorQualityDimension =
  | "plausibility"
  | "clinicalRealism"
  | "educationalValue"
  | "differentiation"
  | "safetyRelevance"
  | "analyticsReadiness";

export type DistractorQualityGate = "fail" | "review" | "publish_eligible" | "flagship";

export type DistractorQualityInput = {
  id?: string;
  distractor: string | null | undefined;
  stem?: string | null;
  correctAnswer?: string | null;
  rationale?: string | null;
  whyTempting?: string | null;
  whyIncorrect?: string | null;
  riskIntroduced?: string | null;
  commonLearnerBelief?: string | null;
  incorrectAssumption?: string | null;
  knowledgeGap?: string | null;
  remediation?: string | null;
  readinessDomains?: readonly DistractorReadinessDomain[] | null;
  pathway?: string | null;
  questionType?: string | null;
};

export type DistractorReadinessDomain =
  | "clinical_judgment_readiness"
  | "patient_safety_readiness"
  | "escalation_readiness"
  | "medication_safety_readiness"
  | "documentation_readiness"
  | "communication_readiness";

export type DistractorQualityResult = {
  id?: string;
  score: number;
  gate: DistractorQualityGate;
  publishAllowed: boolean;
  taxonomy: DistractorTaxonomy[];
  learnerMisconception: string;
  remediationTargets: readonly string[];
  readinessDomains: readonly DistractorReadinessDomain[];
  failureToRescueSignal: boolean;
  dimensions: Record<DistractorQualityDimension, number>;
  issues: string[];
  strengths: string[];
  whyTemptingComplete: boolean;
  misconceptionMappingPresent: boolean;
  remediationMappingPresent: boolean;
  readinessMappingPresent: boolean;
  safetyAnalysisPresent: boolean;
};

export type DistractorSetInput = {
  id?: string;
  stem?: string | null;
  correctAnswer?: string | null;
  distractors: readonly DistractorQualityInput[];
};

export type DistractorSetQualityResult = {
  id?: string;
  score: number;
  gate: DistractorQualityGate;
  publishAllowed: boolean;
  distractors: DistractorQualityResult[];
  issues: string[];
};

export const DISTRACTOR_MIN_PUBLISH_SCORE = 80;
export const DISTRACTOR_FLAGSHIP_SCORE = 95;

const TAXONOMY_PATTERNS: Array<{ type: DistractorTaxonomy; patterns: RegExp[] }> = [
  {
    type: "priority_error",
    patterns: [/\b(priority|first|initial|before|after|stable|unstable|ABCs|airway|breathing|circulation)\b/i],
  },
  {
    type: "timing_error",
    patterns: [/\b(delay|wait|later|immediate|scheduled|routine|after|before|recheck|next)\b/i],
  },
  {
    type: "assessment_error",
    patterns: [/\b(assess|reassess|monitor|vital|SpO2|SpO₂|lung sounds|pain|neuro|urine output|sensor)\b/i],
  },
  {
    type: "safety_error",
    patterns: [/\b(safety|unsafe|risk|harm|fall|aspiration|bleeding|hypox|shock|sepsis|contraindicat|toxicity)\b/i],
  },
  {
    type: "interpretation_error",
    patterns: [/\b(interpret|trend|lab|ECG|ABG|CBC|potassium|sodium|glucose|troponin|BNP|creatinine)\b/i],
  },
  {
    type: "scope_error",
    patterns: [/\b(delegate|scope|prescribe|diagnos|provider|RN|RPN|LPN|UAP|assistant|RT|NP)\b/i],
  },
  {
    type: "communication_error",
    patterns: [/\b(notify|report|SBAR|handoff|clarify|communicat|teach|reassure|therapeutic)\b/i],
  },
  {
    type: "documentation_error",
    patterns: [/\b(document|chart|record|note|incident report|flow sheet)\b/i],
  },
  {
    type: "anchoring_bias",
    patterns: [/\b(anchor|focuses on the first cue|baseline|known history|previous diagnosis|familiar finding)\b/i],
  },
  {
    type: "premature_closure",
    patterns: [/\b(assumes|concludes|without assessing|without reassessing|stops after|single finding)\b/i],
  },
  {
    type: "confirmation_bias",
    patterns: [/\b(confirms|expected finding|fits the diagnosis|supports the initial impression|ignores conflicting)\b/i],
  },
  {
    type: "task_fixation",
    patterns: [/\b(task|checklist|routine|scheduled|complete the task|charting first|med pass)\b/i],
  },
  {
    type: "tunnel_vision",
    patterns: [/\b(tunnel|one cue|isolated|only the lab|only the monitor|single symptom|misses the bigger picture)\b/i],
  },
  {
    type: "overconfidence",
    patterns: [/\b(independent|without notifying|without protocol|assumes stable|does not need help|manage alone)\b/i],
  },
  {
    type: "under_escalation",
    patterns: [/\b(delay escalation|delays escalation|waits to notify|monitor only|recheck later|observe only|routine report)\b/i],
  },
  {
    type: "over_escalation",
    patterns: [/\b(rapid response|code|emergency response|activate|stat|immediately notify).{0,80}\b(stable|expected|routine|mild)\b/i],
  },
  {
    type: "failure_to_rescue",
    patterns: [/\b(failure to rescue|missed deterioration|delayed response|delayed rescue|worsening hypox|shock progression|cannot wait)\b/i],
  },
  {
    type: "pattern_recognition_error",
    patterns: [/\b(pattern|cluster|syndrome|clinical picture|presentation|cue cluster)\b/i],
  },
  {
    type: "medication_monitoring_failure",
    patterns: [/\b(monitoring|hold parameter|toxicity|adverse effect|therapeutic level|interaction|contraindication)\b/i],
  },
  {
    type: "trend_interpretation_failure",
    patterns: [/\b(trend|rising|falling|worsening|improving|serial|over time|progressive)\b/i],
  },
];

const CLINICAL_ACTION_PATTERN =
  /\b(assess|monitor|reassess|administer|hold|position|reposition|suction|oxygen|notify|delegate|document|teach|clarify|prepare|obtain|check|recheck|report|reading)\b/i;
const SAFETY_PATTERN =
  /\b(unsafe|risk|harm|delay|worsen|deteriorat|hypox|bleeding|shock|sepsis|fall|aspiration|toxicity|contraindicat|failure|emergency|cannot wait)\b/i;
const WHY_TEMPTING_PATTERN = /\b(tempt|seem|reasonable|because|may choose|appears|sounds|looks|common)\b/i;
const WHY_INCORRECT_PATTERN = /\b(incorrect|wrong|unsafe|does not|fails to|misses|delays|ignores|instead)\b/i;
const THROWAWAY_PATTERN =
  /\b(all of the above|none of the above|do nothing|ignore|irrelevant|unrelated|not applicable|obviously|random|guess)\b/i;
const GENERIC_RATIONALE_PATTERN =
  /\b(not the priority|less appropriate|incorrect because|wrong because|not best|review the topic|study the material)\b/i;
const ABSOLUTE_GIVEAWAY_PATTERN = /\b(always|never|only|all patients|no patients|guaranteed)\b/i;
const REMEDIATION_PATTERN =
  /\b(remediate|review|practice|revisit|study|reinforce|teach|focus on|compare|use|apply|map|connect)\b/i;

function plain(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: unknown): number {
  const text = plain(value);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function wordOverlap(a: string, b: string): number {
  const aw = new Set(words(a).filter((word) => word.length > 3));
  const bw = new Set(words(b).filter((word) => word.length > 3));
  if (aw.size === 0 || bw.size === 0) return 0;
  return [...aw].filter((word) => bw.has(word)).length / Math.min(aw.size, bw.size);
}

function taxonomyFor(text: string): DistractorTaxonomy[] {
  return [...new Set(TAXONOMY_PATTERNS.flatMap(({ type, patterns }) =>
    patterns.some((pattern) => pattern.test(text)) ? [type] : [],
  ))];
}

function gateFor(score: number): DistractorQualityGate {
  if (score < 70) return "fail";
  if (score < 85) return "review";
  if (score < 95) return "publish_eligible";
  return "flagship";
}

function hasWhyTempting(input: DistractorQualityInput): boolean {
  const text = [input.whyTempting, input.rationale].map(plain).join(" ");
  return wordCount(text) >= 8 && WHY_TEMPTING_PATTERN.test(text);
}

function hasWhyIncorrect(input: DistractorQualityInput): boolean {
  const text = [input.whyIncorrect, input.rationale].map(plain).join(" ");
  return wordCount(text) >= 8 && WHY_INCORRECT_PATTERN.test(text);
}

function hasSafetyAnalysis(input: DistractorQualityInput): boolean {
  const text = [input.riskIntroduced, input.whyIncorrect, input.rationale, input.stem].map(plain).join(" ");
  return SAFETY_PATTERN.test(text);
}

function hasMisconceptionMapping(input: DistractorQualityInput, taxonomy: readonly DistractorTaxonomy[]): boolean {
  const text = [input.commonLearnerBelief, input.incorrectAssumption, input.knowledgeGap, input.whyTempting, input.rationale]
    .map(plain)
    .join(" ");
  return taxonomy.length > 0 && (wordCount(text) >= 8 || WHY_TEMPTING_PATTERN.test(text));
}

function hasRemediationMapping(input: DistractorQualityInput, taxonomy: readonly DistractorTaxonomy[]): boolean {
  const text = [input.remediation, input.knowledgeGap, input.whyIncorrect, input.rationale].map(plain).join(" ");
  return taxonomy.length > 0 && wordCount(text) >= 8 && (REMEDIATION_PATTERN.test(text) || WHY_INCORRECT_PATTERN.test(text));
}

function readinessDomainsFor(
  taxonomy: readonly DistractorTaxonomy[],
  input: DistractorQualityInput,
): DistractorReadinessDomain[] {
  const domains = new Set<DistractorReadinessDomain>(input.readinessDomains ?? []);
  for (const type of taxonomy) {
    if (
      type === "priority_error" ||
      type === "assessment_error" ||
      type === "interpretation_error" ||
      type === "pattern_recognition_error" ||
      type === "trend_interpretation_failure" ||
      type === "anchoring_bias" ||
      type === "premature_closure" ||
      type === "confirmation_bias" ||
      type === "task_fixation" ||
      type === "tunnel_vision" ||
      type === "overconfidence"
    ) {
      domains.add("clinical_judgment_readiness");
    }
    if (
      type === "safety_error" ||
      type === "under_escalation" ||
      type === "over_escalation" ||
      type === "failure_to_rescue"
    ) {
      domains.add("patient_safety_readiness");
      domains.add("escalation_readiness");
    }
    if (type === "medication_monitoring_failure") domains.add("medication_safety_readiness");
    if (type === "documentation_error") domains.add("documentation_readiness");
    if (type === "communication_error") domains.add("communication_readiness");
    if (type === "scope_error") {
      domains.add("clinical_judgment_readiness");
      domains.add("patient_safety_readiness");
    }
  }
  return [...domains];
}

function misconceptionFor(taxonomy: readonly DistractorTaxonomy[], input: DistractorQualityInput): string {
  const explicit = plain(input.commonLearnerBelief) || plain(input.incorrectAssumption);
  if (explicit) return explicit;
  const primary = taxonomy[0];
  switch (primary) {
    case "priority_error":
      return "Learner recognizes a real need but ranks it above the more urgent patient threat.";
    case "timing_error":
      return "Learner chooses an action that may be appropriate at the wrong point in the care sequence.";
    case "assessment_error":
      return "Learner misses the assessment or reassessment cue that should drive the next action.";
    case "safety_error":
      return "Learner underestimates the harm created by delay, contraindication, or unsafe workflow.";
    case "interpretation_error":
      return "Learner misinterprets clinical data, expected findings, or abnormal cues.";
    case "scope_error":
      return "Learner selects an action that does not match the role, setting, or delegation boundary.";
    case "communication_error":
      return "Learner delays or misdirects communication needed for safe care.";
    case "documentation_error":
      return "Learner prioritizes charting or records without completing assessment, action, or escalation.";
    case "failure_to_rescue":
      return "Learner misses deterioration and delays rescue actions.";
    case "trend_interpretation_failure":
      return "Learner treats a worsening trend as an isolated value.";
    case "medication_monitoring_failure":
      return "Learner misses medication monitoring, toxicity, contraindication, or hold-parameter logic.";
    case "pattern_recognition_error":
      return "Learner fails to connect cue clusters into the correct clinical pattern.";
    default:
      return "Learner selects a plausible but clinically incomplete reasoning path.";
  }
}

function remediationTargetsFor(taxonomy: readonly DistractorTaxonomy[], input: DistractorQualityInput): string[] {
  const explicit = plain(input.remediation);
  if (explicit) return [explicit];
  const targets = new Set<string>();
  for (const type of taxonomy) {
    if (type === "priority_error") targets.add("Priority framework: ABCs, safety, instability, and first-action decisions.");
    if (type === "timing_error") targets.add("Care sequencing: assessment, intervention, reassessment, escalation, documentation.");
    if (type === "assessment_error") targets.add("Assessment and reassessment cue selection.");
    if (type === "safety_error") targets.add("Patient safety risk recognition and harm prevention.");
    if (type === "interpretation_error") targets.add("Clinical interpretation of labs, ECGs, symptoms, and expected versus unexpected findings.");
    if (type === "scope_error") targets.add("Role scope, delegation, and escalation boundaries.");
    if (type === "communication_error") targets.add("SBAR, provider notification, handoff, and therapeutic communication.");
    if (type === "documentation_error") targets.add("Defensible documentation after assessment, action, and evaluation.");
    if (type === "failure_to_rescue" || type === "under_escalation") targets.add("Deterioration recognition and timely escalation.");
    if (type === "over_escalation") targets.add("Escalation calibration for stable versus unstable findings.");
    if (type === "trend_interpretation_failure") targets.add("Trend interpretation and serial data comparison.");
    if (type === "medication_monitoring_failure") targets.add("Medication monitoring, adverse effects, toxicity, and hold parameters.");
    if (type === "pattern_recognition_error") targets.add("Cue clustering and pattern recognition.");
    if (
      type === "anchoring_bias" ||
      type === "premature_closure" ||
      type === "confirmation_bias" ||
      type === "task_fixation" ||
      type === "tunnel_vision" ||
      type === "overconfidence"
    ) {
      targets.add("Cognitive bias correction using cue validation and alternate-hypothesis checks.");
    }
  }
  return [...targets];
}

function isFailureToRescueSignal(taxonomy: readonly DistractorTaxonomy[], input: DistractorQualityInput): boolean {
  const text = [input.distractor, input.rationale, input.whyIncorrect, input.riskIntroduced].map(plain).join(" ");
  return (
    taxonomy.some((type) =>
      ["under_escalation", "failure_to_rescue", "trend_interpretation_failure", "priority_error", "assessment_error"].includes(type),
    ) && /\b(deteriorat|escalat|delay|missed|worsen|unstable|shock|hypox|sepsis|stroke|bleeding|cannot wait)\b/i.test(text)
  );
}

export function normalizeDistractorForDuplicateDetection(value: unknown): string {
  return plain(value).toLowerCase().replace(/["'“”‘’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function scoreDistractorQuality(input: DistractorQualityInput): DistractorQualityResult {
  const distractor = plain(input.distractor);
  const stem = plain(input.stem);
  const correctAnswer = plain(input.correctAnswer);
  const rationale = plain(input.rationale);
  const combined = [distractor, rationale, input.whyTempting, input.whyIncorrect, input.riskIntroduced, stem].map(plain).join(" ");
  const issues: string[] = [];
  const strengths: string[] = [];
  const taxonomy = taxonomyFor(combined);
  const readinessDomains = readinessDomainsFor(taxonomy, input);
  const learnerMisconception = misconceptionFor(taxonomy, input);
  const remediationTargets = remediationTargetsFor(taxonomy, input);
  const failureToRescueSignal = isFailureToRescueSignal(taxonomy, input);
  const whyTemptingComplete = hasWhyTempting(input);
  const whyIncorrectComplete = hasWhyIncorrect(input);
  const safetyAnalysisPresent = hasSafetyAnalysis(input);
  const misconceptionMappingPresent = hasMisconceptionMapping(input, taxonomy);
  const remediationMappingPresent = hasRemediationMapping(input, taxonomy);
  const readinessMappingPresent = readinessDomains.length > 0;

  let plausibility = 82;
  let clinicalRealism = 78;
  let educationalValue = 72;
  let differentiation = 80;
  let safetyRelevance = 70;
  let analyticsReadiness = 72;

  if (!distractor) {
    issues.push("Distractor text is missing.");
    plausibility = 0;
    clinicalRealism = 0;
    differentiation = 0;
  }
  if (wordCount(distractor) < 3) {
    issues.push("Distractor is too short to be clinically plausible.");
    plausibility -= 30;
    educationalValue -= 20;
  }
  if (THROWAWAY_PATTERN.test(distractor)) {
    issues.push("Throwaway or non-clinical distractor pattern detected.");
    plausibility -= 45;
    educationalValue -= 35;
  }
  if (ABSOLUTE_GIVEAWAY_PATTERN.test(distractor) && !/\b(if|when|unless|except|usually|often|policy)\b/i.test(distractor)) {
    issues.push("Absolute-language giveaway detected.");
    plausibility -= 18;
  }
  if (!CLINICAL_ACTION_PATTERN.test(combined)) {
    issues.push("Distractor lacks realistic clinical action, assessment, or workflow language.");
    clinicalRealism -= 25;
  } else {
    strengths.push("Clinical workflow or action language present.");
    clinicalRealism += 8;
  }
  if (taxonomy.length === 0) {
    issues.push("Distractor does not map to a defined misconception taxonomy.");
    educationalValue -= 20;
    analyticsReadiness -= 35;
  } else {
    strengths.push(`Maps to ${taxonomy.map((item) => item.replace(/_/g, " ")).join(", ")}.`);
    educationalValue += 10;
    analyticsReadiness += 8;
  }
  if (!whyTemptingComplete) {
    issues.push("Why-tempting analysis is missing or too implicit.");
    educationalValue -= 18;
  } else {
    strengths.push("Why-tempting analysis present.");
    educationalValue += 10;
    analyticsReadiness += 6;
  }
  if (!whyIncorrectComplete) {
    issues.push("Why-incorrect analysis is missing or too implicit.");
    educationalValue -= 18;
  } else {
    strengths.push("Why-incorrect analysis present.");
    educationalValue += 10;
    analyticsReadiness += 6;
  }
  if (!safetyAnalysisPresent) {
    issues.push("Safety risk or consequence analysis is missing.");
    safetyRelevance -= 28;
  } else {
    strengths.push("Safety consequence signal present.");
    safetyRelevance += 14;
    analyticsReadiness += 6;
  }
  if (!misconceptionMappingPresent) {
    issues.push("Misconception mapping is missing.");
    analyticsReadiness -= 18;
  } else {
    strengths.push("Learner misconception mapping present.");
  }
  if (!remediationMappingPresent) {
    issues.push("Remediation mapping is missing.");
    analyticsReadiness -= 18;
  } else {
    strengths.push("Remediation mapping present.");
  }
  if (!readinessMappingPresent) {
    issues.push("Readiness domain mapping is missing.");
    analyticsReadiness -= 20;
  } else {
    strengths.push("Readiness domain mapping present.");
  }
  if (GENERIC_RATIONALE_PATTERN.test(rationale)) {
    issues.push("Generic distractor rationale language detected.");
    educationalValue -= 18;
  }
  const correctSimilarity = correctAnswer ? wordOverlap(distractor, correctAnswer) : 0;
  if (correctSimilarity > 0.75) {
    issues.push("Distractor is too similar to the correct answer.");
    differentiation -= 35;
  } else if (correctSimilarity >= 0.18) {
    strengths.push("Distractor shares enough surface features to feel plausible.");
    plausibility += 8;
  }
  if (stem && wordOverlap(distractor, stem) < 0.05 && wordOverlap(combined.replace(stem, ""), stem) < 0.05) {
    issues.push("Distractor appears weakly connected to the stem.");
    plausibility -= 18;
  }

  const dimensions = {
    plausibility: clamp(plausibility),
    clinicalRealism: clamp(clinicalRealism),
    educationalValue: clamp(educationalValue),
    differentiation: clamp(differentiation),
    safetyRelevance: clamp(safetyRelevance),
    analyticsReadiness: clamp(analyticsReadiness),
  };

  let score = clamp(
    dimensions.plausibility * 0.2 +
      dimensions.clinicalRealism * 0.18 +
      dimensions.educationalValue * 0.22 +
      dimensions.differentiation * 0.12 +
      dimensions.safetyRelevance * 0.16 +
      dimensions.analyticsReadiness * 0.12,
  );

  if (!whyTemptingComplete || !safetyAnalysisPresent || !misconceptionMappingPresent || !remediationMappingPresent || !readinessMappingPresent) {
    score = Math.min(score, DISTRACTOR_MIN_PUBLISH_SCORE - 1);
  }
  if (issues.some((issue) => /missing|throwaway|too similar/i.test(issue))) score = Math.min(score, 78);

  const gate = gateFor(score);
  const publishAllowed =
    score >= DISTRACTOR_MIN_PUBLISH_SCORE &&
    whyTemptingComplete &&
    safetyAnalysisPresent &&
    misconceptionMappingPresent &&
    remediationMappingPresent &&
    readinessMappingPresent;
  return {
    id: input.id,
    score,
    gate,
    publishAllowed,
    taxonomy,
    learnerMisconception,
    remediationTargets,
    readinessDomains,
    failureToRescueSignal,
    dimensions,
    issues,
    strengths,
    whyTemptingComplete,
    misconceptionMappingPresent,
    remediationMappingPresent,
    readinessMappingPresent,
    safetyAnalysisPresent,
  };
}

export function scoreDistractorSetQuality(input: DistractorSetInput): DistractorSetQualityResult {
  const seen = new Map<string, number>();
  const distractors = input.distractors.map((distractor) =>
    scoreDistractorQuality({
      ...distractor,
      stem: distractor.stem ?? input.stem,
      correctAnswer: distractor.correctAnswer ?? input.correctAnswer,
    }),
  );
  const issues: string[] = [];

  for (const distractor of input.distractors) {
    const key = normalizeDistractorForDuplicateDetection(distractor.distractor);
    if (!key) continue;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  const duplicateCount = [...seen.values()].filter((count) => count > 1).length;
  if (duplicateCount > 0) issues.push(`${duplicateCount} duplicate distractor text group(s) detected.`);
  if (distractors.length < 3) issues.push("MCQ-style item has fewer than three distractors.");

  const minScore = distractors.length ? Math.min(...distractors.map((distractor) => distractor.score)) : 0;
  const average = distractors.length
    ? Math.round(distractors.reduce((sum, distractor) => sum + distractor.score, 0) / distractors.length)
    : 0;
  let score = Math.min(average, minScore);
  if (duplicateCount > 0) score = Math.min(score, 69);
  const publishAllowed = distractors.length >= 3 && duplicateCount === 0 && distractors.every((distractor) => distractor.publishAllowed);

  return {
    id: input.id,
    score,
    gate: gateFor(score),
    publishAllowed,
    distractors,
    issues,
  };
}

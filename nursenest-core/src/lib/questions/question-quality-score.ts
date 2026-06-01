import { scoreHintQuality as scoreHintQualityV2 } from "@/lib/questions/hint-quality-score";
import {
  scoreDistractorQuality as scoreSingleDistractorQuality,
  scoreDistractorSetQuality,
  type DistractorReadinessDomain,
} from "@/lib/questions/distractor-quality-score";

export type QuestionQualityReviewFlag =
  | "critical_care"
  | "pediatric"
  | "np"
  | "pharmacology"
  | "emergency"
  | "complex_ecg";

export type QuestionQualityDimension =
  | "stemQuality"
  | "clinicalAccuracy"
  | "clinicalRealism"
  | "workflowRealism"
  | "escalationQuality"
  | "failureToRescueCoverage"
  | "educationalValue"
  | "reasoningQuality"
  | "distractorQuality"
  | "distractorIntelligence"
  | "rationaleQuality"
  | "hintQuality"
  | "pearlQuality"
  | "relatedContentQuality"
  | "remediationValue"
  | "readinessIntegration"
  | "examRelevance";

export type QuestionQualityIssue = {
  readonly dimension: QuestionQualityDimension;
  readonly severity: "info" | "warning" | "error" | "critical";
  readonly code: string;
  readonly message: string;
};

export type QuestionQualityInput = {
  readonly id: string;
  readonly stem?: string | null;
  readonly options?: readonly string[] | null;
  readonly correctAnswer?: string | readonly string[] | null;
  readonly rationale?: string | null;
  readonly whyCorrect?: string | null;
  readonly whyIncorrect?: readonly string[] | Record<string, string> | null;
  readonly distractorType?: string | readonly string[] | null;
  readonly misconceptionType?: string | readonly string[] | null;
  readonly safetyRisk?: string | readonly string[] | null;
  readonly readinessDomain?: DistractorReadinessDomain | readonly DistractorReadinessDomain[] | string | readonly string[] | null;
  readonly clinicalReasoning?: string | null;
  readonly patientSafetyImplications?: string | null;
  readonly examStrategy?: string | null;
  readonly clinicalApplication?: string | null;
  readonly clinicalPearl?: string | null;
  readonly hint?: string | null;
  readonly relatedTopics?: readonly string[] | null;
  readonly relatedLessons?: readonly string[] | null;
  readonly relatedFlashcards?: readonly string[] | null;
  readonly relatedSimulations?: readonly string[] | null;
  readonly relatedEcgContent?: readonly string[] | null;
  readonly relatedLabContent?: readonly string[] | null;
  readonly relatedPharmacologyContent?: readonly string[] | null;
  readonly topic?: string | null;
  readonly pathway?: string | null;
  readonly profession?: string | null;
  readonly questionType?: string | null;
  readonly duplicateCount?: number | null;
};

export type QuestionQualityScore = {
  readonly id: string;
  readonly score: number;
  readonly status: "publish_ready" | "needs_review" | "do_not_publish";
  readonly gate: "fail" | "review_required" | "publish_eligible" | "flagship_ready";
  readonly dimensions: Record<QuestionQualityDimension, number>;
  readonly issues: readonly QuestionQualityIssue[];
  readonly reviewFlags: readonly QuestionQualityReviewFlag[];
};

export const QUESTION_QUALITY_REVIEW_THRESHOLD = 85;
export const QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD = 70;
export const QUESTION_QUALITY_FLAGSHIP_THRESHOLD = 95;

const PLACEHOLDER_PATTERN = /\b(todo|tbd|placeholder|lorem ipsum|coming soon|insert|draft stub|rationale unavailable|answer shown)\b/i;
const GENERIC_RATIONALE_PATTERN =
  /\b(is correct because it is correct|because it is correct|not the best answer|less appropriate|not priority|review the material|study this topic|clinical reasoning is to choose|responds to the priority cue)\b/i;
const CLINICAL_CUE_PATTERN =
  /\b(airway|breathing|circulation|oxygen|spo2|vital signs|blood pressure|bp|heart rate|hr|respiratory rate|rr|perfusion|hypotension|tachycardia|bradycardia|fever|confusion|confused|skin|mottled|sepsis|shock|stroke|bleeding|glucose|potassium|sodium|creatinine|hemoglobin|platelet|ecg|stemi|arrhythmia|medication|dose|contraindicat|monitor|delegate|scope|sbar|documentation)\b/i;
const REASONING_PATTERN =
  /\b(because|therefore|indicates|suggests|reflects|causes|leads to|risk|priority|first|before|after|unstable|deteriorat|escalat|evaluate|reassess|mechanism|pathophysiology)\b/i;
const EXAM_PATTERN = /\b(nclex|rex-pn|cpnre|cnple|ngn|cat|sata|bowtie|matrix|case study|priority|delegation|clinical judgment|exam)\b/i;
const DECISION_POINT_PATTERN =
  /\b(first|priority|prioritize|best|most appropriate|immediate|initial|next|take|intervention|assessment|teaching|evaluate|delegate|report|hold|administer|interpret)\b/i;
const PATIENT_CONTEXT_PATTERN =
  /\b(client|patient|resident|infant|child|adolescent|adult|older adult|postpartum|pregnant|postoperative|unit|clinic|emergency|icu|med-surg|long-term care)\b/i;
const WORKFLOW_PATTERN =
  /\b(shift|round|handoff|sbar|provider|charge nurse|rapid response|code|protocol|policy|reassess|document|monitor|delegate|team|transfer|triage|report)\b/i;
const COMPETING_PRIORITY_PATTERN =
  /\b(priority|first|before|after|most urgent|least stable|competing|multiple|while|meanwhile|time-sensitive|immediate)\b/i;
const INCOMPLETE_INFORMATION_PATTERN =
  /\b(new|unknown|pending|incomplete|unclear|additional data|focused assessment|further assessment|trend|evolving|changes)\b/i;
const TIME_PRESSURE_PATTERN = /\b(rapid|immediate|urgent|now|stat|sudden|deteriorat|cannot wait|time-sensitive|first)\b/i;
const ESCALATION_PATTERN =
  /\b(notify|report|escalat|provider|charge nurse|rapid response|code blue|emergency response|call for help|sbar|transfer|activate)\b/i;
const FAILURE_TO_RESCUE_PATTERN =
  /\b(failure to rescue|missed deterioration|delayed recognition|delayed intervention|delayed escalation|worsening|shock|sepsis|stroke|respiratory failure|hypox|bleeding|cardiac arrest|deteriorat|unstable)\b/i;
const READINESS_DOMAIN_PATTERNS = {
  clinicalJudgment: /\b(clinical judgment|recognize|interpret|prioritize|hypothesis|take action|evaluate|reflect)\b/i,
  patientSafety: /\b(patient safety|harm|risk|fall|aspiration|infection|bleeding|shock|toxicity|contraindicat)\b/i,
  medicationSafety: /\b(medication safety|drug|dose|hold|monitor|toxicity|adverse|contraindication|interaction|insulin|anticoagulant)\b/i,
  escalation: /\b(escalation|escalat|notify|provider|charge nurse|rapid response|emergency response|sbar)\b/i,
  communication: /\b(communication|sbar|handoff|teach|clarify|report|therapeutic|family|provider)\b/i,
  documentation: /\b(documentation|document|chart|record|note|incident report|late entry)\b/i,
};

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

function optionList(options: readonly string[] | null | undefined): string[] {
  return (options ?? []).map(plain).filter(Boolean);
}

function textArray(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === "string") return [plain(value)].filter(Boolean);
  if (Array.isArray(value)) return value.flatMap(textArray).filter(Boolean);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).flatMap(textArray).filter(Boolean);
  return [plain(value)].filter(Boolean);
}

function incorrectRationales(input: QuestionQualityInput): string[] {
  const raw = input.whyIncorrect;
  if (Array.isArray(raw)) return raw.map(plain).filter(Boolean);
  if (raw && typeof raw === "object") return Object.values(raw).map(plain).filter(Boolean);
  return [];
}

function combinedTeachingText(input: QuestionQualityInput): string {
  return [
    input.stem,
    input.rationale,
    input.whyCorrect,
    ...incorrectRationales(input),
    input.clinicalReasoning,
    input.patientSafetyImplications,
    input.examStrategy,
    input.clinicalApplication,
    input.clinicalPearl,
    input.hint,
    ...(input.relatedTopics ?? []),
  ]
    .map(plain)
    .filter(Boolean)
    .join(" ");
}

function hasCorrectAnswer(input: QuestionQualityInput): boolean {
  if (Array.isArray(input.correctAnswer)) return input.correctAnswer.some((answer) => plain(answer).length > 0);
  return plain(input.correctAnswer).length > 0;
}

function addIssue(
  issues: QuestionQualityIssue[],
  dimension: QuestionQualityDimension,
  severity: QuestionQualityIssue["severity"],
  code: string,
  message: string,
): void {
  issues.push({ dimension, severity, code, message });
}

function scoreClinicalAccuracy(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (PLACEHOLDER_PATTERN.test(combined)) {
    score -= 45;
    addIssue(issues, "clinicalAccuracy", "critical", "placeholder_content", "Placeholder or unpublished-stub language is present.");
  }
  if (/\b(always|never|guaranteed|only intervention|cure)\b/i.test(combined)) {
    score -= 18;
    addIssue(issues, "clinicalAccuracy", "error", "unsafe_absolute_language", "Unsafe absolute clinical language requires review.");
  }
  if (!CLINICAL_CUE_PATTERN.test(combined)) score -= 12;
  return clamp(score);
}

function scoreStemQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const stem = plain(input.stem);
  let score = 100;
  if (wordCount(stem) < 12) {
    score -= 30;
    addIssue(issues, "stemQuality", "error", "thin_stem", "Question stem is too short to create a meaningful clinical decision.");
  }
  if (!PATIENT_CONTEXT_PATTERN.test(stem)) {
    score -= 15;
    addIssue(issues, "stemQuality", "warning", "missing_clinical_context", "Stem lacks a clear patient, setting, or clinical scenario.");
  }
  if (!CLINICAL_CUE_PATTERN.test(stem)) {
    score -= 18;
    addIssue(issues, "stemQuality", "warning", "missing_relevant_cues", "Stem lacks relevant clinical cues such as assessment, labs, medication, safety, or scope data.");
  }
  if (!DECISION_POINT_PATTERN.test(stem)) {
    score -= 18;
    addIssue(issues, "stemQuality", "warning", "missing_decision_point", "Stem does not clearly ask for a clinical decision.");
  }
  if (PLACEHOLDER_PATTERN.test(stem)) score -= 40;
  return clamp(score);
}

function scoreClinicalRealism(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const stem = plain(input.stem);
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!PATIENT_CONTEXT_PATTERN.test(stem)) {
    score -= 18;
    addIssue(issues, "clinicalRealism", "warning", "low_patient_specificity", "Question lacks patient-specific clinical context.");
  }
  if (!CLINICAL_CUE_PATTERN.test(stem)) score -= 18;
  if (!WORKFLOW_PATTERN.test(combined)) score -= 10;
  if (!COMPETING_PRIORITY_PATTERN.test(combined)) score -= 8;
  if (!INCOMPLETE_INFORMATION_PATTERN.test(combined)) score -= 8;
  if (!TIME_PRESSURE_PATTERN.test(combined)) score -= 8;
  if (!/\b(vital|assessment|symptom|finding|lab|medication|history|diagnos|trend|response|monitor|teaching)\b/i.test(combined)) {
    score -= 18;
    addIssue(issues, "clinicalRealism", "warning", "limited_bedside_detail", "Question does not provide enough bedside detail for premium clinical realism.");
  }
  if (/\b(foo|bar|sample question|example answer)\b/i.test(combined)) score -= 35;
  return clamp(score);
}

function scoreWorkflowRealism(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!WORKFLOW_PATTERN.test(combined)) {
    score -= 28;
    addIssue(issues, "workflowRealism", "warning", "missing_workflow_context", "Question does not show realistic clinical workflow, team communication, reassessment, documentation, or escalation.");
  }
  if (!/\b(assess|reassess|monitor|notify|report|document|delegate|administer|hold|teach|evaluate|prepare)\b/i.test(combined)) {
    score -= 20;
  }
  if (!COMPETING_PRIORITY_PATTERN.test(combined)) score -= 14;
  if (!PATIENT_CONTEXT_PATTERN.test(combined)) score -= 10;
  return clamp(score);
}

function scoreEscalationQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!ESCALATION_PATTERN.test(combined)) {
    score -= 34;
    addIssue(issues, "escalationQuality", "warning", "missing_escalation_teaching", "Question does not teach when, who, or why to escalate.");
  }
  if (!/\b(when|threshold|criteria|unstable|deteriorat|urgent|immediate|because|risk|safety)\b/i.test(combined)) score -= 18;
  if (!/\b(provider|charge nurse|rapid response|emergency response|sbar|team|call for help|notify|report)\b/i.test(combined)) score -= 18;
  if (!/\b(reassess|monitor|evaluate|response|outcome)\b/i.test(combined)) score -= 10;
  return clamp(score);
}

function scoreFailureToRescueCoverage(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  const highRisk = FAILURE_TO_RESCUE_PATTERN.test([input.topic, input.stem, input.patientSafetyImplications].map(plain).join(" "));
  let score = highRisk ? 92 : 82;
  if (highRisk && !/\b(recognize|early|cue|trend|deteriorat|unstable|worsening)\b/i.test(combined)) {
    score -= 28;
    addIssue(issues, "failureToRescueCoverage", "error", "missing_deterioration_recognition", "High-risk item does not teach early deterioration recognition.");
  }
  if (highRisk && !/\b(intervention|act|escalat|notify|rapid response|emergency|first|immediate)\b/i.test(combined)) {
    score -= 26;
    addIssue(issues, "failureToRescueCoverage", "error", "missing_rescue_action", "High-risk item does not teach timely intervention or escalation.");
  }
  if (!highRisk && !/\b(safety|risk|monitor|reassess|evaluate)\b/i.test(combined)) score -= 12;
  if (/\b(wait|later|routine|next scheduled|document first)\b/i.test(combined) && highRisk) score += 4;
  return clamp(score);
}

function scoreEducationalValue(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  let score = 100;
  if (wordCount(input.rationale) < 50) score -= 20;
  if (!plain(input.clinicalApplication)) score -= 15;
  if (!plain(input.relatedTopics?.join(" "))) score -= 10;
  return clamp(score);
}

function scoreReasoningQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!REASONING_PATTERN.test(combined)) {
    score -= 35;
    addIssue(issues, "reasoningQuality", "error", "missing_reasoning_language", "Teaching text does not explain why the answer follows from the cue.");
  }
  if (!plain(input.clinicalReasoning)) score -= 20;
  if (!plain(input.patientSafetyImplications)) score -= 15;
  return clamp(score);
}

function scoreDistractorQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const options = optionList(input.options);
  const distractors = incorrectRationales(input);
  let score = 100;
  if (options.length > 0 && options.length < 4 && !/bowtie|matrix|trend|case/i.test(plain(input.questionType))) {
    score -= 25;
    addIssue(issues, "distractorQuality", "error", "too_few_options", "MCQ-style items should include at least four plausible options.");
  }
  if (distractors.length === 0) {
    score -= 35;
    addIssue(issues, "distractorQuality", "error", "missing_distractor_analysis", "Wrong-answer rationales are missing.");
  }
  const weak = distractors.filter((item) => wordCount(item) < 12 || GENERIC_RATIONALE_PATTERN.test(item)).length;
  if (weak > 0) {
    score -= weak * 15;
    addIssue(issues, "distractorQuality", "warning", "weak_distractors", "One or more distractor rationales are shallow or generic.");
  }
  return clamp(score);
}

function scoreDistractorIntelligence(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const options = optionList(input.options);
  const correctAnswers = new Set(textArray(input.correctAnswer).map((answer) => answer.toLowerCase()));
  const distractorOptions = options.filter((option) => !correctAnswers.has(option.toLowerCase()));
  const rationales = incorrectRationales(input);
  const types = textArray(input.distractorType);
  const misconceptions = textArray(input.misconceptionType);
  const risks = textArray(input.safetyRisk);
  const readiness = textArray(input.readinessDomain);

  const distractorInputs = (distractorOptions.length ? distractorOptions : rationales).map((distractor, index) => ({
    id: `${input.id}:d${index + 1}`,
    distractor,
    stem: input.stem,
    correctAnswer: textArray(input.correctAnswer).join("; "),
    rationale: rationales[index] ?? "",
    whyTempting: rationales[index] ?? misconceptions[index] ?? "",
    whyIncorrect: rationales[index] ?? "",
    riskIntroduced: risks[index] ?? input.patientSafetyImplications ?? "",
    commonLearnerBelief: misconceptions[index] ?? "",
    incorrectAssumption: misconceptions[index] ?? types[index] ?? "",
    knowledgeGap: types[index] ?? "",
    remediation: [input.clinicalApplication, ...(input.relatedTopics ?? [])].map(plain).filter(Boolean).join("; "),
    readinessDomains: readiness.filter((domain): domain is DistractorReadinessDomain =>
      [
        "clinical_judgment_readiness",
        "patient_safety_readiness",
        "escalation_readiness",
        "medication_safety_readiness",
        "documentation_readiness",
        "communication_readiness",
      ].includes(domain),
    ),
    pathway: input.pathway ?? input.profession,
    questionType: input.questionType,
  }));

  if (distractorInputs.length === 0) {
    addIssue(issues, "distractorIntelligence", "error", "missing_distractor_metadata", "No distractors or distractor rationales are available for learner-thinking analysis.");
    return 0;
  }

  const advancedFormat = /bowtie|matrix|trend|case|sata/i.test(plain(input.questionType));
  const result =
    advancedFormat && distractorInputs.length < 3
      ? (() => {
          const scored = distractorInputs.map((distractor) => scoreSingleDistractorQuality(distractor));
          const score = scored.length ? Math.round(scored.reduce((sum, item) => sum + item.score, 0) / scored.length) : 0;
          return {
            score,
            publishAllowed: scored.every((item) => item.publishAllowed),
            distractors: scored,
          };
        })()
      : scoreDistractorSetQuality({
          id: input.id,
          stem: input.stem,
          correctAnswer: textArray(input.correctAnswer).join("; "),
          distractors: distractorInputs,
        });
  if (!result.publishAllowed) {
    addIssue(issues, "distractorIntelligence", "error", "weak_distractor_intelligence", "Distractors lack required misconception, safety, remediation, or readiness-domain mapping.");
  }
  if (result.distractors.some((distractor) => !distractor.misconceptionMappingPresent)) {
    addIssue(issues, "distractorIntelligence", "warning", "missing_misconception_mapping", "One or more distractors lacks clear misconception mapping.");
  }
  if (result.distractors.some((distractor) => !distractor.remediationMappingPresent)) {
    addIssue(issues, "distractorIntelligence", "warning", "missing_distractor_remediation", "One or more distractors lacks remediation mapping.");
  }
  const explicitMetadata =
    types.length >= distractorInputs.length &&
    misconceptions.length >= distractorInputs.length &&
    risks.length >= distractorInputs.length &&
    readiness.length > 0;
  return result.publishAllowed && explicitMetadata ? Math.max(result.score, 95) : result.score;
}

function scoreRationaleQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const rationale = [input.rationale, input.whyCorrect, input.clinicalReasoning, input.clinicalApplication].map(plain).join(" ");
  let score = 100;
  if (wordCount(rationale) < 80) {
    score -= 28;
    addIssue(issues, "rationaleQuality", "error", "thin_rationale", "Rationale is too short for premium clinical teaching.");
  }
  if (GENERIC_RATIONALE_PATTERN.test(rationale)) {
    score -= 35;
    addIssue(issues, "rationaleQuality", "critical", "generic_rationale", "Rationale contains generic or template-like explanation.");
  }
  if (!plain(input.whyCorrect)) score -= 12;
  if (!plain(input.clinicalApplication)) score -= 12;
  return clamp(score);
}

function scoreHintQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const result = scoreHintQualityV2({
    id: input.id,
    hint: input.hint,
    stem: input.stem,
    options: input.options,
    correctAnswer: input.correctAnswer,
    pathway: input.pathway ?? input.profession,
    topic: input.topic,
    questionType: input.questionType,
  });
  if (result.issues.includes("missing_hint")) {
    addIssue(issues, "hintQuality", "error", "missing_hint", "Hint is missing.");
  }
  if (result.issues.includes("answer_option_leakage") || result.issues.includes("answer_wording_leakage")) {
    addIssue(issues, "hintQuality", "critical", "answer_revealing_hint", "Hint appears to disclose the answer instead of guiding reasoning.");
  }
  if (result.issues.includes("generic_hint")) {
    addIssue(issues, "hintQuality", "error", "generic_hint", "Hint is generic and does not guide clinical reasoning.");
  }
  if (result.issues.includes("unsafe_scope_prompt")) {
    addIssue(issues, "hintQuality", "critical", "unsafe_scope_hint", "Hint encourages unsafe or outside-scope reasoning.");
  }
  if (result.issues.includes("stem_disconnected")) {
    addIssue(issues, "hintQuality", "warning", "stem_disconnected_hint", "Hint does not connect to the stem.");
  }
  return result.score * 20;
}

function scorePearlQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const pearl = plain(input.clinicalPearl);
  let score = 100;
  if (!pearl) {
    score -= 35;
    addIssue(issues, "pearlQuality", "error", "missing_clinical_pearl", "Clinical pearl is missing.");
  } else {
    if (wordCount(pearl) < 10) score -= 18;
    if (!CLINICAL_CUE_PATTERN.test(pearl) && !REASONING_PATTERN.test(pearl)) score -= 15;
    if (GENERIC_RATIONALE_PATTERN.test(pearl)) score -= 25;
  }
  return clamp(score);
}

function scoreExamRelevance(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!plain(input.examStrategy)) {
    score -= 24;
    addIssue(issues, "examRelevance", "warning", "missing_exam_strategy", "Exam strategy is missing.");
  }
  if (!EXAM_PATTERN.test([combined, input.pathway, input.questionType].map(plain).join(" "))) score -= 16;
  if ((input.duplicateCount ?? 1) > 1) {
    score -= Math.min(30, ((input.duplicateCount ?? 1) - 1) * 10);
    addIssue(issues, "examRelevance", "warning", "possible_duplicate", "Question appears duplicated or near-duplicated.");
  }
  return clamp(score);
}

function scoreRelatedContentQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const related = (input.relatedTopics ?? []).map(plain).filter(Boolean);
  let score = 100;
  if (related.length === 0) {
    score -= 35;
    addIssue(issues, "relatedContentQuality", "error", "missing_related_content", "Related lessons, topics, or remediation links are missing.");
  }
  if (related.length > 0 && related.length < 3) score -= 12;
  if (!plain(input.clinicalApplication)) score -= 15;
  if (!plain(input.examStrategy)) score -= 10;
  if (new Set(related.map((item) => item.toLowerCase())).size < related.length) {
    score -= 10;
    addIssue(issues, "relatedContentQuality", "warning", "duplicate_related_topics", "Related topics contain duplicates.");
  }
  return clamp(score);
}

function scoreRemediationValue(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const pools = [
    input.relatedLessons,
    input.relatedFlashcards,
    input.relatedSimulations,
    input.relatedEcgContent,
    input.relatedLabContent,
    input.relatedPharmacologyContent,
  ];
  const present = pools.filter((items) => (items ?? []).map(plain).filter(Boolean).length > 0).length;
  let score = 55 + present * 8;
  if ((input.relatedTopics ?? []).length > 0) score += 8;
  if (plain(input.clinicalApplication)) score += 7;
  if (present < 2) {
    addIssue(issues, "remediationValue", "warning", "thin_remediation_assets", "Question lacks enough linked lessons, flashcards, simulations, ECG, lab, or pharmacology remediation assets.");
  }
  if (FAILURE_TO_RESCUE_PATTERN.test([input.topic, input.stem].map(plain).join(" ")) && !(input.relatedSimulations ?? []).length) {
    score -= 14;
    addIssue(issues, "remediationValue", "warning", "missing_simulation_remediation", "High-risk question lacks related simulation remediation.");
  }
  return clamp(score);
}

function scoreReadinessIntegration(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = [
    combinedTeachingText(input),
    ...textArray(input.readinessDomain),
    ...textArray(input.distractorType),
    ...textArray(input.misconceptionType),
  ].join(" ");
  const mapped = Object.values(READINESS_DOMAIN_PATTERNS).filter((pattern) => pattern.test(combined)).length;
  let score = 45 + mapped * 9;
  if (mapped < 3) {
    addIssue(issues, "readinessIntegration", "warning", "thin_readiness_mapping", "Question is not strongly mapped to clinical judgment, safety, medication, escalation, communication, or documentation readiness.");
  }
  if (READINESS_DOMAIN_PATTERNS.clinicalJudgment.test(combined)) score += 4;
  if (READINESS_DOMAIN_PATTERNS.patientSafety.test(combined)) score += 4;
  return clamp(score);
}

export function getProfessionalReviewFlags(input: Pick<QuestionQualityInput, "topic" | "pathway" | "profession" | "questionType" | "stem">): QuestionQualityReviewFlag[] {
  const text = [input.topic, input.pathway, input.profession, input.questionType, input.stem].map(plain).join(" ");
  const flags: QuestionQualityReviewFlag[] = [];
  if (/\b(icu|critical care|shock|ventilator|hemodynamic|vasopressor)\b/i.test(text)) flags.push("critical_care");
  if (/\b(pediatric|paediatric|infant|child|newborn|neonate|nicu|picu)\b/i.test(text)) flags.push("pediatric");
  if (/\b(np|nurse practitioner|cnple|fnp|agpcnp|pmhnp|whnp|pnp)\b/i.test(text)) flags.push("np");
  if (/\b(pharmacology|medication|drug|dose|insulin|opioid|anticoagulant|antibiotic|prescrib)\b/i.test(text)) flags.push("pharmacology");
  if (/\b(emergency|trauma|stroke|sepsis|acs|code blue|rapid response|respiratory failure|acute respiratory|anaphylaxis)\b/i.test(text)) flags.push("emergency");
  if (/\b(ecg|ekg|stemi|arrhythmia|heart block|ventricular tachycardia|vfib|telemetry)\b/i.test(text)) flags.push("complex_ecg");
  return [...new Set(flags)];
}

export function scoreQuestionQuality(input: QuestionQualityInput): QuestionQualityScore {
  const issues: QuestionQualityIssue[] = [];
  const dimensions = {
    stemQuality: scoreStemQuality(input, issues),
    clinicalAccuracy: scoreClinicalAccuracy(input, issues),
    clinicalRealism: scoreClinicalRealism(input, issues),
    workflowRealism: scoreWorkflowRealism(input, issues),
    escalationQuality: scoreEscalationQuality(input, issues),
    failureToRescueCoverage: scoreFailureToRescueCoverage(input, issues),
    educationalValue: scoreEducationalValue(input, issues),
    reasoningQuality: scoreReasoningQuality(input, issues),
    distractorQuality: scoreDistractorQuality(input, issues),
    distractorIntelligence: scoreDistractorIntelligence(input, issues),
    rationaleQuality: scoreRationaleQuality(input, issues),
    hintQuality: scoreHintQuality(input, issues),
    pearlQuality: scorePearlQuality(input, issues),
    relatedContentQuality: scoreRelatedContentQuality(input, issues),
    remediationValue: scoreRemediationValue(input, issues),
    readinessIntegration: scoreReadinessIntegration(input, issues),
    examRelevance: scoreExamRelevance(input, issues),
  } satisfies Record<QuestionQualityDimension, number>;

  if (!hasCorrectAnswer(input)) {
    addIssue(issues, "educationalValue", "critical", "missing_correct_answer", "Correct answer is missing.");
  }

  const score = clamp(
    dimensions.stemQuality * 0.04 +
      dimensions.clinicalAccuracy * 0.08 +
      dimensions.clinicalRealism * 0.11 +
      dimensions.workflowRealism * 0.06 +
      dimensions.escalationQuality * 0.07 +
      dimensions.failureToRescueCoverage * 0.08 +
      dimensions.educationalValue * 0.05 +
      dimensions.reasoningQuality * 0.12 +
      dimensions.distractorQuality * 0.05 +
      dimensions.distractorIntelligence * 0.11 +
      dimensions.rationaleQuality * 0.11 +
      dimensions.hintQuality * 0.04 +
      dimensions.pearlQuality * 0.04 +
      dimensions.remediationValue * 0.06 +
      dimensions.readinessIntegration * 0.06 +
      dimensions.examRelevance * 0.02,
  );
  const hasCritical = issues.some((issue) => issue.severity === "critical");
  const hasWarningOrWorse = issues.some((issue) => issue.severity !== "info");
  const flagshipReady =
    score >= QUESTION_QUALITY_FLAGSHIP_THRESHOLD &&
    !hasWarningOrWorse &&
    dimensions.distractorIntelligence >= 95 &&
    dimensions.rationaleQuality >= 95 &&
    dimensions.hintQuality >= 80 &&
    dimensions.pearlQuality >= 95;
  const effectiveScore = hasCritical ? Math.min(score, QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD - 1) : score;
  const gate =
    effectiveScore < QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD
      ? "fail"
      : effectiveScore < QUESTION_QUALITY_REVIEW_THRESHOLD
        ? "review_required"
        : flagshipReady
          ? "flagship_ready"
          : "publish_eligible";

  return {
    id: input.id,
    score: effectiveScore,
    gate,
    status:
      effectiveScore < QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD
        ? "do_not_publish"
        : effectiveScore < QUESTION_QUALITY_REVIEW_THRESHOLD
          ? "needs_review"
          : "publish_ready",
    dimensions,
    issues,
    reviewFlags: getProfessionalReviewFlags(input),
  };
}

export type HintQualityPathway =
  | "RN"
  | "RPN_PN"
  | "NP"
  | "PRE_NURSING"
  | "ADMISSIONS"
  | "ALLIED"
  | "ECG"
  | "LABS"
  | "MEDICATION_MATH"
  | "PHARMACOLOGY"
  | "CLINICAL_SKILLS"
  | "GENERAL";

export type HintQualityIssueCode =
  | "missing_hint"
  | "answer_option_leakage"
  | "answer_wording_leakage"
  | "generic_hint"
  | "stem_disconnected"
  | "unsafe_scope_prompt"
  | "missing_ecg_framework"
  | "missing_lab_pattern_or_trend"
  | "missing_med_math_unit_setup"
  | "missing_pharmacology_safety_monitoring"
  | "missing_pathway_specificity";

export type HintQualityInput = {
  readonly id?: string;
  readonly hint?: string | null;
  readonly stem?: string | null;
  readonly options?: readonly string[] | null;
  readonly correctAnswer?: string | readonly string[] | null;
  readonly pathway?: HintQualityPathway | string | null;
  readonly topic?: string | null;
  readonly questionType?: string | null;
};

export type HintQualityResult = {
  readonly id?: string;
  readonly score: 1 | 2 | 3 | 4 | 5;
  readonly gate: "hard_fail" | "review_required" | "foundational_only" | "publish_eligible" | "premium_flagship";
  readonly publishAllowed: boolean;
  readonly issues: readonly HintQualityIssueCode[];
  readonly strengths: readonly string[];
};

const OPTION_LETTER_RE = /\b(option|choice|answer)\s*([a-f])\b|\bchoose\s+[a-f]\b|\bselect\s+[a-f]\b/i;
const GENERIC_HINT_RE =
  /\b(think carefully|read carefully|review the material|review the chapter|use your knowledge|remember what you learned|pick the best answer|look for clues)\b/i;
const UNSAFE_SCOPE_RE =
  /\b(prescribe|diagnose|adjust the dose|change the dose|titrate independently|ignore protocol|without notifying|do not report|wait and see)\b/i;
const CLINICAL_CUE_RE =
  /\b(cue|finding|symptom|assessment|vital|spo2|bp|heart rate|respiratory rate|lab|trend|ecg|rhythm|medication|contraindicat|monitor|risk)\b/i;
const PRIORITY_RE = /\b(priority|first|immediate|urgent|unstable|stable|airway|breathing|circulation|safety|greatest|most serious)\b/i;
const MECHANISM_RE = /\b(mechanism|pathophysiology|underlying|causes|why|because|effect|response)\b/i;
const SCOPE_RE = /\b(scope|role|rn|rpn|lpn|pn|np|delegate|report|notify|provider|uap|assistant|judgment)\b/i;
const SAFETY_RE = /\b(safety|harm|risk|escalat|deteriorat|rapid response|notify|report|contraindicat|hold|monitor)\b/i;
const EXAM_DECISION_RE = /\b(first action|best action|priority|teaching|delegation|evaluation|reassessment|next step|decision)\b/i;
const ECG_FRAMEWORK_RE = /\b(rate|regularity|p wave|pr interval|qrs|st segment|qt|rhythm|conduction|hemodynamic|telemetry)\b/i;
const LAB_FRAMEWORK_RE = /\b(pattern|trend|critical|isolated|together|compare|rising|falling|worsening|normal range|clinical significance)\b/i;
const MED_MATH_FRAMEWORK_RE = /\b(unit|units|conversion|set up|dimensional|dose|per|mL|mg|kg|rate|reasonable)\b/i;
const PHARM_FRAMEWORK_RE = /\b(monitor|contraindicat|adverse|toxicity|side effect|hold|teaching|interaction|safety|therapeutic)\b/i;

function plain(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g)?.filter((word) => word.length > 3) ?? [];
}

function wordCount(value: unknown): number {
  return words(plain(value)).length;
}

function normalizePathway(pathway: unknown, topic: unknown): HintQualityPathway {
  const text = `${plain(pathway)} ${plain(topic)}`.toLowerCase();
  if (/\becg|ekg|telemetry|rhythm/.test(text)) return "ECG";
  if (/\blab|abg|electrolyte|troponin|creatinine|hemoglobin/.test(text)) return "LABS";
  if (/\bmed(ication)?[ _-]?math|dose calc|dosage|calculation|medication_math/.test(text)) return "MEDICATION_MATH";
  if (/\bpharm|medication|drug|insulin|opioid|anticoagulant|antibiotic/.test(text)) return "PHARMACOLOGY";
  if (/\bclinical skill|wound|iv therapy|catheter|assessment skill/.test(text)) return "CLINICAL_SKILLS";
  if (/\bpre.?nursing|prerequisite|anatomy|physiology|chemistry/.test(text)) return "PRE_NURSING";
  if (/\badmission|casper|teas|hesi/.test(text)) return "ADMISSIONS";
  if (/\ballied|pharmacy.?tech|rt|paramedic|ot|pt|mlt/.test(text)) return "ALLIED";
  if (/\b(np|cnple|fnp|agpcnp|pmhnp|whnp|pnp)\b/.test(text)) return "NP";
  if (/\b(rpn|pn|lpn|rex-pn|nclex-pn)\b/.test(text)) return "RPN_PN";
  if (/\b(rn|nclex-rn|nclex)\b/.test(text)) return "RN";
  return "GENERAL";
}

function overlapsStem(hint: string, stem: string): boolean {
  const hintWords = new Set(words(hint));
  const stemWords = new Set(words(stem));
  if (hintWords.size === 0 || stemWords.size === 0) return false;
  return [...hintWords].some((word) => stemWords.has(word)) || CLINICAL_CUE_RE.test(hint);
}

function containsAnswerWording(input: HintQualityInput): boolean {
  const hint = plain(input.hint).toLowerCase();
  if (!hint) return false;
  const answers = Array.isArray(input.correctAnswer) ? input.correctAnswer : [input.correctAnswer];
  for (const answer of answers) {
    const text = plain(answer).toLowerCase();
    if (!text) continue;
    const answerWords = words(text).filter((word) => !["client", "patient", "nurse", "action", "first"].includes(word));
    const matching = answerWords.filter((word) => hint.includes(word));
    if (answerWords.length >= 2 && matching.length >= Math.min(2, answerWords.length)) return true;
  }
  return false;
}

function gateFor(score: 1 | 2 | 3 | 4 | 5, hardFail: boolean): HintQualityResult["gate"] {
  if (hardFail || score === 1) return "hard_fail";
  if (score === 2) return "review_required";
  if (score === 3) return "foundational_only";
  if (score === 4) return "publish_eligible";
  return "premium_flagship";
}

export function scoreHintQuality(input: HintQualityInput): HintQualityResult {
  const hint = plain(input.hint);
  const stem = plain(input.stem);
  const pathway = normalizePathway(input.pathway, input.topic);
  const issues = new Set<HintQualityIssueCode>();
  const strengths = new Set<string>();

  if (!hint) issues.add("missing_hint");
  if (OPTION_LETTER_RE.test(hint)) issues.add("answer_option_leakage");
  if (containsAnswerWording(input)) issues.add("answer_wording_leakage");
  if (GENERIC_HINT_RE.test(hint) || (hint && wordCount(hint) < 4)) issues.add("generic_hint");
  if (
    stem &&
    hint &&
    !overlapsStem(hint, stem) &&
    !ECG_FRAMEWORK_RE.test(hint) &&
    !LAB_FRAMEWORK_RE.test(hint) &&
    !MED_MATH_FRAMEWORK_RE.test(hint) &&
    !PHARM_FRAMEWORK_RE.test(hint)
  ) {
    issues.add("stem_disconnected");
  }
  if (UNSAFE_SCOPE_RE.test(hint)) issues.add("unsafe_scope_prompt");

  if (CLINICAL_CUE_RE.test(hint)) strengths.add("clinical cue direction");
  if (PRIORITY_RE.test(hint)) strengths.add("priority framework");
  if (MECHANISM_RE.test(hint)) strengths.add("mechanism prompt");
  if (SCOPE_RE.test(hint)) strengths.add("scope or role prompt");
  if (SAFETY_RE.test(hint)) strengths.add("safety or escalation prompt");
  if (EXAM_DECISION_RE.test(hint)) strengths.add("exam decision-type prompt");

  if (pathway === "ECG" && hint && !ECG_FRAMEWORK_RE.test(hint)) issues.add("missing_ecg_framework");
  if (pathway === "ECG" && hint && ECG_FRAMEWORK_RE.test(hint)) strengths.add("ECG interpretation framework");
  if (pathway === "LABS" && hint && !LAB_FRAMEWORK_RE.test(hint)) issues.add("missing_lab_pattern_or_trend");
  if (pathway === "LABS" && hint && LAB_FRAMEWORK_RE.test(hint)) strengths.add("lab pattern or trend framing");
  if (pathway === "MEDICATION_MATH" && hint && !MED_MATH_FRAMEWORK_RE.test(hint)) issues.add("missing_med_math_unit_setup");
  if (pathway === "MEDICATION_MATH" && hint && MED_MATH_FRAMEWORK_RE.test(hint)) strengths.add("medication math unit setup");
  if (pathway === "PHARMACOLOGY" && hint && !PHARM_FRAMEWORK_RE.test(hint)) {
    issues.add("missing_pharmacology_safety_monitoring");
  }
  if (pathway === "PHARMACOLOGY" && hint && PHARM_FRAMEWORK_RE.test(hint)) strengths.add("pharmacology safety or monitoring frame");

  const hasPathwaySpecificity =
    pathway === "GENERAL" ||
    (pathway === "RN" && /\b(acute|unstable|priority|assessment|delegate|nursing judgment)\b/i.test(hint)) ||
    (pathway === "RPN_PN" && /\b(expected|predictable|report|scope|reassess|monitor)\b/i.test(hint)) ||
    (pathway === "NP" && /\b(diagnos|management|red flag|follow-up|prescrib|differential|referral)\b/i.test(hint)) ||
    (pathway === "PRE_NURSING" && /\b(function|structure|term|process|basic|foundation)\b/i.test(hint)) ||
    (pathway === "ADMISSIONS" && /\b(question|calculation|eliminate|exact|units|passage)\b/i.test(hint)) ||
    (pathway === "ALLIED" && /\b(profession|workflow|safety|scope|specimen|verification|role)\b/i.test(hint)) ||
    (pathway === "ECG" && ECG_FRAMEWORK_RE.test(hint)) ||
    (pathway === "LABS" && LAB_FRAMEWORK_RE.test(hint)) ||
    (pathway === "MEDICATION_MATH" && MED_MATH_FRAMEWORK_RE.test(hint)) ||
    (pathway === "PHARMACOLOGY" && PHARM_FRAMEWORK_RE.test(hint)) ||
    (pathway === "CLINICAL_SKILLS" && /\b(technique|safety|assessment|documentation|complication|step)\b/i.test(hint));
  if (!hasPathwaySpecificity) issues.add("missing_pathway_specificity");
  else strengths.add("pathway specificity");

  const hardFailIssues: HintQualityIssueCode[] = [
    "missing_hint",
    "answer_option_leakage",
    "answer_wording_leakage",
    "unsafe_scope_prompt",
  ];
  const hardFail = hardFailIssues.some((issue) => issues.has(issue));
  let numeric = 3;
  if (hardFail) numeric = 1;
  else if (issues.has("generic_hint") || issues.has("stem_disconnected")) numeric = 2;
  else if (issues.size > 0 || strengths.size < 2) numeric = 3;
  else if (strengths.size >= 2 && strengths.size < 3) numeric = 4;
  else numeric = 5;

  const score = numeric as 1 | 2 | 3 | 4 | 5;
  const gate = gateFor(score, hardFail);
  const foundationalAllowed = gate === "foundational_only" && (pathway === "PRE_NURSING" || pathway === "ADMISSIONS");

  return {
    id: input.id,
    score,
    gate,
    publishAllowed: gate === "publish_eligible" || gate === "premium_flagship" || foundationalAllowed,
    issues: [...issues],
    strengths: [...strengths],
  };
}

export function isHintPublishBlocked(result: HintQualityResult): boolean {
  return result.gate === "hard_fail" || !result.publishAllowed;
}

export type ContentQualityDimension =
  | "specificity"
  | "clinicalAccuracy"
  | "educationalDepth"
  | "distractorQuality"
  | "pearlQuality"
  | "examRelevance"
  | "repetition";

export type ContentQualityStatus = "high_quality" | "needs_review" | "low_quality";

export type ContentQualityInput = {
  id: string;
  itemType?: string | null;
  pathway?: string | null;
  tier?: string | null;
  stem?: string | null;
  rationale?: string | null;
  distractorRationales?: string[] | null;
  clinicalPearl?: string | null;
  examTip?: string | null;
  memoryHook?: string | null;
  siConvExplanation?: string | null;
  repeatCount?: number;
};

export type ContentQualityIssue = {
  dimension: ContentQualityDimension;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
};

export type ContentQualityScore = {
  id: string;
  score: number;
  status: ContentQualityStatus;
  dimensions: Record<ContentQualityDimension, number>;
  issues: ContentQualityIssue[];
};

export const CONTENT_QUALITY_THRESHOLD = 72;
export const CONTENT_QUALITY_CRITICAL_THRESHOLD = 50;

export const GENERIC_CONTENT_PATTERNS: readonly { id: string; re: RegExp; severity: ContentQualityIssue["severity"] }[] = [
  { id: "priority_cue", re: /\bpriority\s+cues?\b/i, severity: "high" },
  { id: "responds_priority_cue", re: /\bresponds?\s+to\s+the\s+priority\s+cue\b/i, severity: "critical" },
  { id: "clinical_reasoning_is", re: /\bthe\s+clinical\s+reasoning\s+is\b/i, severity: "critical" },
  { id: "choose_the_action", re: /\bchoose\s+the\s+action\b/i, severity: "high" },
  { id: "safe_escalation", re: /\bsafe\s+escalation\b/i, severity: "high" },
  { id: "supports_safe_care", re: /\bsupports?\s+safe\s+care\b/i, severity: "medium" },
  { id: "using_nursing_process", re: /\busing\s+the\s+nursing\s+process\b/i, severity: "high" },
  { id: "use_nursing_process", re: /\buse\s+the\s+nursing\s+process\b/i, severity: "high" },
  { id: "identify_priority", re: /\bidentify\s+the\s+priority\b/i, severity: "medium" },
  { id: "most_urgent_cue", re: /\bmost\s+urgent\s+cue\b/i, severity: "high" },
  { id: "lower_priority", re: /\blower[-\s]+priority\b/i, severity: "high" },
  { id: "not_best_answer", re: /\bnot\s+the\s+best\s+answer\b/i, severity: "critical" },
  { id: "less_appropriate", re: /\bless\s+appropriate\b/i, severity: "critical" },
  { id: "not_priority", re: /\bnot\s+priority\b/i, severity: "critical" },
  { id: "no_rationale", re: /\b(no separate rationale|rationale unavailable|answer shown)\b/i, severity: "critical" },
  { id: "generic_prevent_harm", re: /\b(prevents?|preventing)\s+harm\b/i, severity: "medium" },
] as const;

const CLINICAL_SPECIFICITY_PATTERNS = [
  /\b(oxygen|spo2|airway|breathing|ventilation|perfusion|hypotension|tachycardia|bradycardia|fever|glucose|potassium|sodium|creatinine|hemoglobin|platelet|ecg|stemi|arrhythmia)\b/i,
  /\b(receptor|smooth muscle|contraction|vasoconstrict|vasodilat|antagonist|agonist|inhibit|metabol|clearance|half-life)\b/i,
  /\b(scope|delegate|unlicensed|uap|psw|rpn|lpn|rn|np|respiratory therapist|rt)\b/i,
];

const EXAM_CONTEXT_PATTERNS = [
  /\b(nclex|ngn|rex-pn|cpnre|cnple|loft|cat|entry-to-practice|licensure)\b/i,
  /\b(sata|bowtie|matrix|case study|priority|delegation|clinical judgment)\b/i,
];

function plain(text: string | null | undefined): string {
  return String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string | null | undefined): number {
  const normalized = plain(text);
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasStemReference(stem: string, rationale: string): boolean {
  const terms = plain(stem)
    .toLowerCase()
    .split(/[^a-z0-9/%.-]+/)
    .filter((term) => term.length >= 5 && !["which", "client", "patient", "nurse", "should", "first", "following"].includes(term));
  const unique = [...new Set(terms)].slice(0, 18);
  if (unique.length === 0) return false;
  const text = plain(rationale).toLowerCase();
  return unique.some((term) => text.includes(term));
}

export function collectGenericContentPatternIds(text: string | null | undefined): string[] {
  const normalized = plain(text);
  if (!normalized) return [];
  return GENERIC_CONTENT_PATTERNS.filter(({ re }) => re.test(normalized)).map(({ id }) => id);
}

export function normalizeContentForDuplicateDetection(text: string | null | undefined): string {
  return plain(text).toLowerCase().replace(/["'“”‘’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function scoreQuestionContentQuality(input: ContentQualityInput): ContentQualityScore {
  const stem = plain(input.stem);
  const rationale = plain(input.rationale);
  const distractors = (input.distractorRationales ?? []).map(plain).filter(Boolean);
  const clinicalPearl = plain(input.clinicalPearl);
  const examTip = plain(input.examTip);
  const memoryHook = plain(input.memoryHook);
  const siConv = plain(input.siConvExplanation);
  const combined = [rationale, clinicalPearl, examTip, memoryHook, siConv, ...distractors].filter(Boolean).join(" ");

  const issues: ContentQualityIssue[] = [];
  const genericHits = GENERIC_CONTENT_PATTERNS.filter(({ re }) => re.test(combined));
  for (const hit of genericHits) {
    issues.push({
      dimension: "specificity",
      severity: hit.severity,
      message: `Generic/template phrase detected: ${hit.id}`,
    });
  }

  let specificity = 100;
  if (!rationale) specificity -= 55;
  if (rationale && wordCount(rationale) < 35) specificity -= 30;
  if (stem && rationale && !hasStemReference(stem, rationale)) specificity -= 22;
  if (!CLINICAL_SPECIFICITY_PATTERNS.some((re) => re.test(combined))) specificity -= 18;
  specificity -= genericHits.length * 14;

  let clinicalAccuracy = 88;
  if (!CLINICAL_SPECIFICITY_PATTERNS.some((re) => re.test(combined))) clinicalAccuracy -= 18;
  if (/\b(always|never|guaranteed|cure|only intervention)\b/i.test(combined)) clinicalAccuracy -= 18;

  let educationalDepth = 100;
  const rationaleWords = wordCount(rationale);
  if (rationaleWords < 55) educationalDepth -= 25;
  if (!/\b(because|therefore|indicates|causes|leads to|results in|mechanism|risk|monitor|contraindicat|confus|mistak)\b/i.test(combined)) {
    educationalDepth -= 20;
  }
  if (!clinicalPearl) educationalDepth -= 14;
  if (!memoryHook) educationalDepth -= 8;

  let distractorQuality = 100;
  if (distractors.length === 0) distractorQuality -= 38;
  const weakDistractors = distractors.filter((d) => wordCount(d) < 18 || collectGenericContentPatternIds(d).length > 0).length;
  distractorQuality -= weakDistractors * 18;

  let pearlQuality = 100;
  if (!clinicalPearl) pearlQuality -= 40;
  if (clinicalPearl && wordCount(clinicalPearl) < 12) pearlQuality -= 20;
  if (clinicalPearl && !CLINICAL_SPECIFICITY_PATTERNS.some((re) => re.test(clinicalPearl))) pearlQuality -= 15;

  let examRelevance = 100;
  if (!examTip) examRelevance -= 28;
  if (examTip && !EXAM_CONTEXT_PATTERNS.some((re) => re.test(examTip) || re.test(input.pathway ?? ""))) examRelevance -= 18;
  if (siConv && !hasStemReference(stem, siConv)) examRelevance -= 10;

  let repetition = 100;
  const repeatCount = input.repeatCount ?? 1;
  if (repeatCount > 1) repetition -= Math.min(55, (repeatCount - 1) * 12);

  const dimensions = {
    specificity: clamp(specificity),
    clinicalAccuracy: clamp(clinicalAccuracy),
    educationalDepth: clamp(educationalDepth),
    distractorQuality: clamp(distractorQuality),
    pearlQuality: clamp(pearlQuality),
    examRelevance: clamp(examRelevance),
    repetition: clamp(repetition),
  } satisfies Record<ContentQualityDimension, number>;

  if (dimensions.specificity < 70) {
    issues.push({ dimension: "specificity", severity: "high", message: "Rationale does not sufficiently reference the question-specific cue." });
  }
  if (dimensions.distractorQuality < 70) {
    issues.push({ dimension: "distractorQuality", severity: "high", message: "Distractor explanations are missing, shallow, or generic." });
  }
  if (dimensions.pearlQuality < 70) {
    issues.push({ dimension: "pearlQuality", severity: "medium", message: "Clinical pearl is missing or does not add educator-level insight." });
  }
  if (dimensions.examRelevance < 70) {
    issues.push({ dimension: "examRelevance", severity: "medium", message: "Exam tip/SI-CONV explanation is missing or not exam-specific." });
  }
  if (dimensions.repetition < 80) {
    issues.push({ dimension: "repetition", severity: "high", message: `Rationale appears reused across ${repeatCount} items.` });
  }

  const score = clamp(
    dimensions.specificity * 0.22 +
      dimensions.clinicalAccuracy * 0.17 +
      dimensions.educationalDepth * 0.17 +
      dimensions.distractorQuality * 0.16 +
      dimensions.pearlQuality * 0.1 +
      dimensions.examRelevance * 0.1 +
      dimensions.repetition * 0.08,
  );
  const hasCriticalTemplateLanguage = genericHits.some((hit) => hit.severity === "critical");
  const effectiveScore = hasCriticalTemplateLanguage ? Math.min(score, CONTENT_QUALITY_CRITICAL_THRESHOLD - 1) : score;

  return {
    id: input.id,
    score: effectiveScore,
    status:
      effectiveScore < CONTENT_QUALITY_CRITICAL_THRESHOLD
        ? "low_quality"
        : effectiveScore < CONTENT_QUALITY_THRESHOLD
          ? "needs_review"
          : "high_quality",
    dimensions,
    issues,
  };
}

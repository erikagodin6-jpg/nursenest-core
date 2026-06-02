import {
  collectEducationalPlaceholderIds,
  hasEducationalAiDisclaimerLanguage,
  hasLargeDuplicateParagraphBlock,
} from "@/lib/education/educational-content-placeholder-guard";

export type ClinicalContentType =
  | "lesson"
  | "question"
  | "flashcard"
  | "clinical_pearl"
  | "simulation"
  | "ecg"
  | "lab"
  | "pharmacology"
  | "clinical_skill"
  | "np_module"
  | "allied_module";

export type ClinicalContentSection = {
  kind?: string | null;
  heading?: string | null;
  body?: string | null;
};

export type ClinicalContentQualityInput = {
  id: string;
  contentType: ClinicalContentType;
  title?: string | null;
  body?: string | null;
  sections?: readonly ClinicalContentSection[] | null;
  stem?: string | null;
  hint?: string | null;
  rationale?: string | null;
  whyCorrect?: string | null;
  whyIncorrect?: readonly string[] | string | null;
  clinicalApplication?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  front?: string | null;
  back?: string | null;
  relatedLessonIds?: readonly string[] | null;
  relatedFlashcardIds?: readonly string[] | null;
  references?: readonly string[] | null;
  topic?: string | null;
  tier?: string | null;
  pathwayId?: string | null;
  status?: string | null;
  lastReviewedAt?: string | Date | null;
  duplicateOfId?: string | null;
  qualityScore?: number | null;
  clinicalAccuracyReviewed?: boolean | null;
};

export type ClinicalContentScoreBand = "Excellent" | "Good" | "Needs Review" | "Do Not Publish";

export type ClinicalContentQualityDimension =
  | "accuracy"
  | "depth"
  | "clinicalRelevance"
  | "examRelevance"
  | "educationalValue"
  | "originality"
  | "patientSafety"
  | "reasoningQuality";

export type ClinicalContentQualityIssueCode =
  | "PLACEHOLDER_CONTENT"
  | "AI_DISCLAIMER"
  | "DUPLICATE_CONTENT"
  | "REPEATED_BLOCKS"
  | "LOW_WORD_COUNT"
  | "MISSING_REQUIRED_SECTION"
  | "MISSING_PATHOPHYSIOLOGY"
  | "MISSING_ASSESSMENT"
  | "MISSING_DIAGNOSTICS"
  | "MISSING_INTERVENTIONS"
  | "MISSING_PATIENT_SAFETY"
  | "MISSING_CLINICAL_JUDGMENT"
  | "MISSING_EXAM_RELEVANCE"
  | "MISSING_KNOWLEDGE_CHECK"
  | "MISSING_RELATED_CONTENT"
  | "WEAK_RATIONALE"
  | "WEAK_HINT"
  | "HINT_REVEALS_ANSWER"
  | "WEAK_CLINICAL_PEARL"
  | "WEAK_CLINICAL_APPLICATION"
  | "WEAK_WHY_CORRECT"
  | "WEAK_WHY_INCORRECT"
  | "LOW_VALUE_FLASHCARD"
  | "UNSUPPORTED_HIGH_RISK_CLAIM"
  | "UNSAFE_ABSOLUTE_LANGUAGE"
  | "OUTDATED_OR_STALE_REVIEW"
  | "EXPERT_REVIEW_REQUIRED";

export type ClinicalContentQualityIssue = {
  code: ClinicalContentQualityIssueCode;
  severity: "warning" | "error" | "blocker";
  message: string;
  remediation: string;
};

export type ClinicalContentQualityResult = {
  id: string;
  contentType: ClinicalContentType;
  score: number;
  band: ClinicalContentScoreBand;
  dimensions: Record<ClinicalContentQualityDimension, number>;
  clinicalAccuracyPass: boolean;
  requiredSectionsComplete: boolean;
  publicationReady: boolean;
  requiresExpertReview: boolean;
  issues: ClinicalContentQualityIssue[];
};

export type ClinicalPublicationGateResult = {
  ok: boolean;
  score: number;
  band: ClinicalContentScoreBand;
  reasons: string[];
  reviewRequired: boolean;
};

export type DuplicateCandidate = {
  leftId: string;
  rightId: string;
  similarity: number;
  leftType: ClinicalContentType;
  rightType: ClinicalContentType;
};

export type ExpertReviewQueueItem = {
  id: string;
  contentType: ClinicalContentType;
  priority: "Critical" | "High" | "Medium" | "Low";
  reasons: string[];
  score: number;
};

export type ContentQualityDashboard = {
  generatedAt: string;
  totalItems: number;
  averageLessonScore: number;
  averageQuestionScore: number;
  averageRationaleScore: number;
  averageClinicalPearlScore: number;
  averageHintScore: number;
  duplicateRate: number;
  reviewBacklog: number;
  publicationReady: number;
  publicationReadyRate: number;
  doNotPublish: number;
  byContentType: Record<string, { count: number; averageScore: number; ready: number; review: number }>;
};

const LESSON_REQUIRED_SIGNALS = [
  { code: "MISSING_REQUIRED_SECTION", label: "learning objective", patterns: [/\blearning objectives?\b/i, /\bobjective\b/i] },
  { code: "MISSING_REQUIRED_SECTION", label: "overview", patterns: [/\boverview\b/i, /\bintroduction\b/i] },
  { code: "MISSING_REQUIRED_SECTION", label: "core concepts", patterns: [/\bcore concept/i, /\bfoundation/i] },
  { code: "MISSING_PATHOPHYSIOLOGY", label: "pathophysiology", patterns: [/\bpathophysiology\b/i, /\bmechanism\b/i, /\bcauses?\b/i] },
  { code: "MISSING_ASSESSMENT", label: "assessment", patterns: [/\bassessment\b/i, /\bsigns?\b/i, /\bsymptoms?\b/i] },
  { code: "MISSING_DIAGNOSTICS", label: "diagnostics", patterns: [/\bdiagnostic/i, /\blabs?\b/i, /\btest\b/i] },
  { code: "MISSING_INTERVENTIONS", label: "interventions", patterns: [/\bintervention/i, /\btreatment/i, /\bnursing care\b/i] },
  { code: "MISSING_PATIENT_SAFETY", label: "patient safety", patterns: [/\bsafety\b/i, /\bred flags?\b/i, /\bescalat/i, /\bunsafe\b/i] },
  { code: "MISSING_CLINICAL_JUDGMENT", label: "clinical judgment", patterns: [/\bclinical judgment\b/i, /\bdecision[- ]making\b/i, /\bpriorit/i] },
  { code: "MISSING_REQUIRED_SECTION", label: "clinical pearls", patterns: [/\bclinical pearls?\b/i, /\bpearl\b/i] },
  { code: "MISSING_EXAM_RELEVANCE", label: "exam relevance", patterns: [/\bexam\b/i, /\bNCLEX\b/i, /\bREx-PN\b/i, /\bCNPLE\b/i, /\bNGN\b/i] },
  { code: "MISSING_KNOWLEDGE_CHECK", label: "knowledge check", patterns: [/\bknowledge check\b/i, /\bcheckpoint\b/i, /\bquestion\b/i] },
] as const;

const CLINICAL_SPECIFICITY_RE =
  /\b(airway|breathing|circulation|perfusion|oxygen|spo2|hypoxia|blood pressure|heart rate|glucose|potassium|sodium|creatinine|hemoglobin|platelets|troponin|lactate|ECG|STEMI|arrhythmia|dose|contraindication|adverse effect|scope|delegate|escalat|deteriorat|sepsis|shock)\b/i;
const REASONING_RE =
  /\b(because|therefore|leads to|indicates|suggests|reflects|mechanism|risk|priority|first|next|before|after|monitor|reassess|trend|if missed|what happens)\b/i;
const EXAM_RE = /\b(NCLEX|NGN|REx-PN|CNPLE|board|licen[cs]ure|exam|SATA|bowtie|matrix|case study|CAT|priority|delegation)\b/i;
const SAFETY_RE = /\b(safety|unsafe|harm|red flag|deteriorat|critical|urgent|emergency|rapid response|high-alert|contraindication|toxicity|error|scope)\b/i;
const HIGH_RISK_RE =
  /\b(prescrib|dose|dosing|titrate|contraindication|pediatric|neonate|pregnan|critical care|ICU|ACLS|PALS|vasopressor|insulin|heparin|warfarin|opioid|digoxin|chemotherapy|blood transfusion|sepsis|shock|STEMI|ventilator)\b/i;
const UNSAFE_ABSOLUTE_RE = /\b(always|never|guaranteed|guarantee|cure|only intervention|only appropriate|cannot fail|will prevent)\b/i;
const GENERIC_TEACHING_RE =
  /\b(this is important|be familiar with|review this topic|study this material|key takeaway only|correct because it is correct|because it is correct|basic concept|good to know)\b/i;

function clean(value: unknown): string {
  if (typeof value === "string") {
    return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  if (value == null) return "";
  return JSON.stringify(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function words(value: unknown): number {
  const text = clean(value);
  return text ? (text.match(/\b[\p{L}\p{N}'-]+\b/gu)?.length ?? 0) : 0;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function bandFor(score: number): ClinicalContentScoreBand {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Needs Review";
  return "Do Not Publish";
}

function sectionBundle(input: ClinicalContentQualityInput): string {
  return (input.sections ?? [])
    .map((section) => [section.kind, section.heading, section.body].map(clean).filter(Boolean).join(" "))
    .join("\n");
}

function whyIncorrectText(input: ClinicalContentQualityInput): string {
  if (Array.isArray(input.whyIncorrect)) return input.whyIncorrect.map(clean).join("\n");
  return clean(input.whyIncorrect);
}

function contentBundle(input: ClinicalContentQualityInput): string {
  return [
    input.title,
    input.body,
    sectionBundle(input),
    input.stem,
    input.hint,
    input.rationale,
    input.whyCorrect,
    whyIncorrectText(input),
    input.clinicalApplication,
    input.clinicalPearl,
    input.examStrategy,
    input.front,
    input.back,
    input.topic,
    input.tier,
    input.pathwayId,
  ]
    .map(clean)
    .filter(Boolean)
    .join("\n");
}

function addIssue(issues: ClinicalContentQualityIssue[], issue: ClinicalContentQualityIssue): void {
  issues.push(issue);
}

function hasLessonSignal(input: ClinicalContentQualityInput, signal: (typeof LESSON_REQUIRED_SIGNALS)[number]): boolean {
  const sections = input.sections ?? [];
  return sections.some((section) => {
    const headingKind = [section.kind, section.heading].map(clean).join(" ");
    const body = clean(section.body);
    return signal.patterns.some((pattern) => pattern.test(headingKind) || pattern.test(body));
  });
}

function staleReview(input: ClinicalContentQualityInput, now = new Date()): boolean {
  if (!input.lastReviewedAt) return HIGH_RISK_RE.test(contentBundle(input));
  const date = input.lastReviewedAt instanceof Date ? input.lastReviewedAt : new Date(input.lastReviewedAt);
  if (Number.isNaN(date.getTime())) return true;
  return now.getTime() - date.getTime() > 18 * 30 * 24 * 60 * 60 * 1000;
}

function scoreSupportText(value: string, kind: "hint" | "clinicalPearl" | "rationale"): number {
  const wc = words(value);
  let score = 100;
  if (!value) return 0;
  if (kind === "hint") {
    if (wc < 12 || wc > 55) score -= 30;
  } else if (kind === "clinicalPearl") {
    if (wc < 18) score -= 35;
  } else if (wc < 45) {
    score -= 35;
  }
  if (GENERIC_TEACHING_RE.test(value)) score -= 35;
  if (!REASONING_RE.test(value) && kind !== "hint") score -= 18;
  if (!CLINICAL_SPECIFICITY_RE.test(value)) score -= 16;
  return clamp(score);
}

function requiredSectionsComplete(input: ClinicalContentQualityInput, issues: ClinicalContentQualityIssue[]): boolean {
  if (input.contentType !== "lesson") return true;
  let complete = true;
  for (const signal of LESSON_REQUIRED_SIGNALS) {
    if (!hasLessonSignal(input, signal)) {
      complete = false;
      addIssue(issues, {
        code: signal.code,
        severity: signal.code === "MISSING_REQUIRED_SECTION" ? "error" : "blocker",
        message: `Lesson is missing a substantive ${signal.label} signal.`,
        remediation: `Add a dedicated ${signal.label} section that explains why it matters clinically and how learners apply it.`,
      });
    }
  }
  if ((input.relatedLessonIds?.length ?? 0) === 0) {
    complete = false;
    addIssue(issues, {
      code: "MISSING_RELATED_CONTENT",
      severity: "error",
      message: "Lesson does not expose related lessons for the study loop.",
      remediation: "Link related lessons and remediation targets before publish.",
    });
  }
  return complete;
}

export function evaluateClinicalContentQuality(input: ClinicalContentQualityInput): ClinicalContentQualityResult {
  const issues: ClinicalContentQualityIssue[] = [];
  const bundle = contentBundle(input);
  const placeholderIds = collectEducationalPlaceholderIds(bundle);
  const localPlaceholderIds = /\b(TODO|FIXME|TBD|placeholder|coming soon|draft filler)\b/i.test(bundle)
    ? ["authoring_stub"]
    : [];
  const allPlaceholderIds = [...new Set([...placeholderIds, ...localPlaceholderIds])];
  const totalWords = words(bundle);

  if (allPlaceholderIds.length > 0) {
    addIssue(issues, {
      code: "PLACEHOLDER_CONTENT",
      severity: "blocker",
      message: `Placeholder or stub content detected: ${allPlaceholderIds.join(", ")}.`,
      remediation: "Replace authoring stubs with reviewed clinical teaching before the item can publish.",
    });
  }
  if (hasEducationalAiDisclaimerLanguage(bundle)) {
    addIssue(issues, {
      code: "AI_DISCLAIMER",
      severity: "blocker",
      message: "AI disclaimer or meta-authoring language detected.",
      remediation: "Remove meta-language and replace with clinician-facing educational content.",
    });
  }
  if (input.duplicateOfId) {
    addIssue(issues, {
      code: "DUPLICATE_CONTENT",
      severity: "blocker",
      message: `Content is marked as duplicate of ${input.duplicateOfId}.`,
      remediation: "Merge into the canonical item or rewrite with clearly distinct learning value.",
    });
  }
  if (bundle.length > 1800 && hasLargeDuplicateParagraphBlock(bundle, 120)) {
    addIssue(issues, {
      code: "REPEATED_BLOCKS",
      severity: "blocker",
      message: "Repeated substantive paragraph blocks detected.",
      remediation: "Remove copied filler and add unique clinical reasoning or application.",
    });
  }

  const minimumWords =
    input.contentType === "lesson" ? 900 : input.contentType === "question" ? 170 : input.contentType === "flashcard" ? 22 : 120;
  if (totalWords < minimumWords) {
    addIssue(issues, {
      code: "LOW_WORD_COUNT",
      severity: input.contentType === "flashcard" ? "error" : "blocker",
      message: `Content is below the minimum educational depth floor (${totalWords}/${minimumWords} words).`,
      remediation: "Expand with clinical context, application, decision-making, safety, and exam relevance rather than padding.",
    });
  }

  const sectionsComplete = requiredSectionsComplete(input, issues);

  if (input.contentType === "question") {
    if (scoreSupportText(clean(input.rationale), "rationale") < 80) {
      addIssue(issues, {
        code: "WEAK_RATIONALE",
        severity: "blocker",
        message: "Question rationale is missing, generic, or too shallow.",
        remediation: "Explain the cue, why the answer is correct, why alternatives are unsafe or less correct, and the transferable principle.",
      });
    }
    if (scoreSupportText(clean(input.hint), "hint") < 75) {
      addIssue(issues, {
        code: "WEAK_HINT",
        severity: "error",
        message: "Hint does not guide reasoning enough.",
        remediation: "Add a hint that points learners to the relevant cue, priority framework, or safety principle without revealing the answer.",
      });
    }
    if (clean(input.hint) && clean(input.whyCorrect) && clean(input.hint).toLowerCase().includes(clean(input.whyCorrect).toLowerCase())) {
      addIssue(issues, {
        code: "HINT_REVEALS_ANSWER",
        severity: "blocker",
        message: "Hint appears to reveal the answer.",
        remediation: "Rewrite the hint to guide reasoning without naming the correct option.",
      });
    }
    if (words(input.whyCorrect) < 20) {
      addIssue(issues, {
        code: "WEAK_WHY_CORRECT",
        severity: "blocker",
        message: "Why-correct teaching is too thin.",
        remediation: "Explain why the keyed answer best matches the patient cue and safety priority.",
      });
    }
    if (words(whyIncorrectText(input)) < 30) {
      addIssue(issues, {
        code: "WEAK_WHY_INCORRECT",
        severity: "blocker",
        message: "Wrong-answer teaching is missing or too thin.",
        remediation: "Add per-distractor explanations that name the misconception and clinical risk.",
      });
    }
    if (words(input.clinicalApplication) < 25) {
      addIssue(issues, {
        code: "WEAK_CLINICAL_APPLICATION",
        severity: "error",
        message: "Question lacks bedside clinical application.",
        remediation: "Describe how the concept appears in practice and what the learner should do with the cue.",
      });
    }
  }

  if (input.contentType === "flashcard") {
    const frontWords = words(input.front);
    const backWords = words(input.back);
    if (frontWords < 4 || backWords < 10 || !/\b(why|when|which|what|how|cue|risk|priority|safety|clinical)\b/i.test(clean(input.front))) {
      addIssue(issues, {
        code: "LOW_VALUE_FLASHCARD",
        severity: "error",
        message: "Flashcard is likely trivia, definition-only, or too thin for retention.",
        remediation: "Rewrite the card to ask for clinical recognition, consequence, safety, priority, or application.",
      });
    }
  }

  const pearlScore = scoreSupportText(clean(input.clinicalPearl), "clinicalPearl");
  if (["question", "flashcard", "clinical_pearl"].includes(input.contentType) && pearlScore < 80) {
    addIssue(issues, {
      code: "WEAK_CLINICAL_PEARL",
      severity: "error",
      message: "Clinical pearl is missing, generic, or not actionable.",
      remediation: "Add a memorable practice-relevant pearl that teaches a useful bedside insight.",
    });
  }

  if (HIGH_RISK_RE.test(bundle) && (input.references?.length ?? 0) === 0 && input.clinicalAccuracyReviewed !== true) {
    addIssue(issues, {
      code: "UNSUPPORTED_HIGH_RISK_CLAIM",
      severity: "blocker",
      message: "High-risk clinical content lacks review signal or references.",
      remediation: "Add current authoritative references and clinician review before publish.",
    });
  }
  if (UNSAFE_ABSOLUTE_RE.test(bundle)) {
    addIssue(issues, {
      code: "UNSAFE_ABSOLUTE_LANGUAGE",
      severity: "error",
      message: "Unsupported absolute language may be clinically unsafe.",
      remediation: "Use conditional, evidence-aware clinical wording unless the absolute is explicitly guideline-supported.",
    });
  }
  if (staleReview(input)) {
    addIssue(issues, {
      code: "OUTDATED_OR_STALE_REVIEW",
      severity: HIGH_RISK_RE.test(bundle) ? "blocker" : "warning",
      message: "Content is high risk or stale without recent review.",
      remediation: "Refresh against current practice standards and record review before publication.",
    });
  }

  const requiresExpertReview = shouldRouteToExpertReview(input, issues);
  if (requiresExpertReview) {
    addIssue(issues, {
      code: "EXPERT_REVIEW_REQUIRED",
      severity: issues.some((issue) => issue.severity === "blocker") ? "blocker" : "warning",
      message: "Content should enter expert review before publication.",
      remediation: "Route to a qualified reviewer for clinical accuracy, scope, currency, and safety validation.",
    });
  }

  const blockerPenalty = issues.filter((i) => i.severity === "blocker").length * 20;
  const errorPenalty = issues.filter((i) => i.severity === "error").length * 10;
  const warningPenalty = issues.filter((i) => i.severity === "warning").length * 4;

  const dimensions = {
    accuracy: clamp(100 - (issues.some((i) => i.code === "UNSUPPORTED_HIGH_RISK_CLAIM") ? 34 : 0) - (UNSAFE_ABSOLUTE_RE.test(bundle) ? 14 : 0)),
    depth: clamp(Math.min(100, (totalWords / minimumWords) * 86 + 14) - (issues.some((i) => i.code === "LOW_WORD_COUNT") ? 30 : 0)),
    clinicalRelevance: clamp((CLINICAL_SPECIFICITY_RE.test(bundle) ? 92 : 58) - (GENERIC_TEACHING_RE.test(bundle) ? 24 : 0)),
    examRelevance: clamp((EXAM_RE.test(bundle) ? 94 : 62) - (issues.some((i) => i.code === "MISSING_EXAM_RELEVANCE") ? 18 : 0)),
    educationalValue: clamp(100 - (issues.some((i) => i.code === "LOW_VALUE_FLASHCARD") ? 40 : 0) - (GENERIC_TEACHING_RE.test(bundle) ? 28 : 0)),
    originality: clamp(100 - (input.duplicateOfId ? 60 : 0) - (issues.some((i) => i.code === "REPEATED_BLOCKS") ? 40 : 0)),
    patientSafety: clamp((SAFETY_RE.test(bundle) ? 96 : 66) - (issues.some((i) => i.code === "MISSING_PATIENT_SAFETY") ? 24 : 0)),
    reasoningQuality: clamp((REASONING_RE.test(bundle) ? 94 : 55) - (issues.some((i) => i.code === "WEAK_RATIONALE") ? 28 : 0)),
  } satisfies Record<ClinicalContentQualityDimension, number>;

  const weighted =
    dimensions.accuracy * 0.2 +
    dimensions.depth * 0.15 +
    dimensions.clinicalRelevance * 0.14 +
    dimensions.examRelevance * 0.11 +
    dimensions.educationalValue * 0.12 +
    dimensions.originality * 0.1 +
    dimensions.patientSafety * 0.1 +
    dimensions.reasoningQuality * 0.08;
  const explicitScore = typeof input.qualityScore === "number" ? Math.min(input.qualityScore, weighted) : weighted;
  const score = clamp(explicitScore - blockerPenalty - errorPenalty - warningPenalty);
  const band = bandFor(score);
  const clinicalAccuracyPass =
    dimensions.accuracy >= 85 &&
    !issues.some((issue) => ["UNSUPPORTED_HIGH_RISK_CLAIM", "UNSAFE_ABSOLUTE_LANGUAGE", "AI_DISCLAIMER"].includes(issue.code));
  const publicationReady =
    score >= 85 &&
    clinicalAccuracyPass &&
    sectionsComplete &&
    !issues.some((issue) => issue.severity === "blocker") &&
    !input.duplicateOfId &&
    allPlaceholderIds.length === 0;

  return {
    id: input.id,
    contentType: input.contentType,
    score,
    band,
    dimensions,
    clinicalAccuracyPass,
    requiredSectionsComplete: sectionsComplete,
    publicationReady,
    requiresExpertReview,
    issues,
  };
}

export function evaluateClinicalPublicationGate(input: ClinicalContentQualityInput): ClinicalPublicationGateResult {
  const result = evaluateClinicalContentQuality(input);
  const reasons: string[] = [];

  if (result.score < 85) reasons.push(`Quality Score must be >= 85 (actual ${result.score}).`);
  if (!result.clinicalAccuracyPass) reasons.push("Clinical Accuracy Pass is required.");
  if (!result.requiredSectionsComplete) reasons.push("Required sections must be complete.");
  if (input.duplicateOfId) reasons.push("Duplicate content cannot publish.");
  for (const issue of result.issues.filter((item) => item.severity === "blocker")) {
    reasons.push(issue.message);
  }

  return {
    ok: reasons.length === 0,
    score: result.score,
    band: result.band,
    reasons,
    reviewRequired: result.requiresExpertReview,
  };
}

export function shouldRouteToExpertReview(
  input: ClinicalContentQualityInput,
  issues: readonly ClinicalContentQualityIssue[] = [],
): boolean {
  const bundle = contentBundle(input);
  if (issues.some((issue) => issue.severity === "blocker")) return true;
  if (input.contentType === "np_module") return true;
  if (/\b(NP|advanced practice|prescrib|diagnos|differential)\b/i.test([input.tier, bundle].join(" "))) return true;
  if (/\b(critical care|ICU|ACLS|PALS|vasopressor|ventilator|pediatric|neonate|oncology|chemotherapy)\b/i.test(bundle)) {
    return true;
  }
  if (HIGH_RISK_RE.test(bundle) && input.clinicalAccuracyReviewed !== true) return true;
  return false;
}

function normalizedTokens(input: ClinicalContentQualityInput): Set<string> {
  const stop = new Set(["patient", "client", "nurse", "which", "should", "would", "about", "because", "correct", "answer"]);
  const tokens =
    contentBundle(input)
      .toLowerCase()
      .replace(/<[^>]+>/g, " ")
      .replace(/[^a-z0-9+/-]+/g, " ")
      .match(/\b[a-z][a-z0-9+/-]{3,}\b/g) ?? [];
  return new Set(tokens.filter((token) => !stop.has(token)));
}

export function clinicalContentSimilarity(left: ClinicalContentQualityInput, right: ClinicalContentQualityInput): number {
  const a = normalizedTokens(left);
  const b = normalizedTokens(right);
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  return Math.round((intersection / (a.size + b.size - intersection)) * 1000) / 1000;
}

export function findNearDuplicateClinicalContent(
  items: readonly ClinicalContentQualityInput[],
  threshold = 0.82,
): DuplicateCandidate[] {
  const candidates: DuplicateCandidate[] = [];
  const tokenCache = new Map<string, Set<string>>();
  const getTokens = (item: ClinicalContentQualityInput): Set<string> => {
    const cached = tokenCache.get(item.id);
    if (cached) return cached;
    const next = normalizedTokens(item);
    tokenCache.set(item.id, next);
    return next;
  };
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const left = items[i]!;
      const right = items[j]!;
      const a = getTokens(left);
      const b = getTokens(right);
      if (a.size === 0 || b.size === 0) continue;
      let intersection = 0;
      for (const token of a) {
        if (b.has(token)) intersection += 1;
      }
      const similarity = Math.round((intersection / (a.size + b.size - intersection)) * 1000) / 1000;
      if (similarity >= threshold) {
        candidates.push({
          leftId: left.id,
          rightId: right.id,
          similarity,
          leftType: left.contentType,
          rightType: right.contentType,
        });
      }
    }
  }
  return candidates.sort((a, b) => b.similarity - a.similarity);
}

export function buildExpertReviewQueue(inputs: readonly ClinicalContentQualityInput[]): ExpertReviewQueueItem[] {
  return inputs
    .map((input) => {
      const result = evaluateClinicalContentQuality(input);
      const reasons = result.issues
        .filter((issue) => issue.severity !== "warning" || result.score < 85)
        .map((issue) => issue.message);
      if (!result.requiresExpertReview && result.score >= 85) return null;
      const priority: ExpertReviewQueueItem["priority"] =
        result.score < 70 || result.issues.some((issue) => issue.severity === "blocker")
          ? "Critical"
          : result.score < 80
            ? "High"
            : result.requiresExpertReview
              ? "Medium"
              : "Low";
      return {
        id: input.id,
        contentType: input.contentType,
        priority,
        reasons: reasons.length > 0 ? reasons : ["Clinician review required before publication."],
        score: result.score,
      };
    })
    .filter((item): item is ExpertReviewQueueItem => Boolean(item))
    .sort((a, b) => {
      const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return rank[a.priority] - rank[b.priority] || a.score - b.score;
    });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function buildContentQualityDashboard(
  inputs: readonly ClinicalContentQualityInput[],
  duplicates = findNearDuplicateClinicalContent(inputs),
): ContentQualityDashboard {
  const results = inputs.map(evaluateClinicalContentQuality);
  const duplicateItemIds = new Set<string>();
  for (const duplicate of duplicates) {
    duplicateItemIds.add(duplicate.leftId);
    duplicateItemIds.add(duplicate.rightId);
  }
  const byType: ContentQualityDashboard["byContentType"] = {};
  for (const result of results) {
    const bucket = (byType[result.contentType] ??= { count: 0, averageScore: 0, ready: 0, review: 0 });
    bucket.count += 1;
    bucket.averageScore += result.score;
    if (result.publicationReady) bucket.ready += 1;
    if (result.requiresExpertReview || result.score < 85) bucket.review += 1;
  }
  for (const bucket of Object.values(byType)) {
    bucket.averageScore = bucket.count ? Math.round((bucket.averageScore / bucket.count) * 10) / 10 : 0;
  }

  const lessons = results.filter((result) => result.contentType === "lesson");
  const questions = results.filter((result) => result.contentType === "question");
  const rationaleScores = results
    .filter((result) => ["question", "flashcard"].includes(result.contentType))
    .map((result) => result.dimensions.reasoningQuality);
  const pearlScores = results.map((result) => result.dimensions.educationalValue);
  const hintScores = inputs
    .filter((input) => clean(input.hint))
    .map((input) => scoreSupportText(clean(input.hint), "hint"));
  const ready = results.filter((result) => result.publicationReady).length;

  return {
    generatedAt: new Date().toISOString(),
    totalItems: inputs.length,
    averageLessonScore: average(lessons.map((result) => result.score)),
    averageQuestionScore: average(questions.map((result) => result.score)),
    averageRationaleScore: average(rationaleScores),
    averageClinicalPearlScore: average(pearlScores),
    averageHintScore: average(hintScores),
    duplicateRate: inputs.length === 0 ? 0 : Math.round((duplicateItemIds.size / inputs.length) * 1000) / 10,
    reviewBacklog: results.filter((result) => result.requiresExpertReview || result.score < 85).length,
    publicationReady: ready,
    publicationReadyRate: inputs.length === 0 ? 0 : Math.round((ready / inputs.length) * 1000) / 10,
    doNotPublish: results.filter((result) => result.band === "Do Not Publish").length,
    byContentType: byType,
  };
}

export function renderContentQualityDashboardMarkdown(
  dashboard: ContentQualityDashboard,
  reviewQueue: readonly ExpertReviewQueueItem[] = [],
  duplicates: readonly DuplicateCandidate[] = [],
): string {
  const typeRows = Object.entries(dashboard.byContentType)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, row]) => `| ${type} | ${row.count} | ${row.averageScore} | ${row.ready} | ${row.review} |`);
  const queueRows = reviewQueue
    .slice(0, 30)
    .map((item) => `| ${item.priority} | ${item.contentType} | \`${item.id.replace(/`/g, "'")}\` | ${item.score} | ${item.reasons[0]?.replace(/\|/g, "\\|") ?? "Review required"} |`);
  const duplicateRows = duplicates
    .slice(0, 30)
    .map((item) => `| \`${item.leftId.replace(/`/g, "'")}\` | \`${item.rightId.replace(/`/g, "'")}\` | ${item.similarity} |`);

  return [
    "# Content Quality Dashboard",
    "",
    `- Generated: ${dashboard.generatedAt}`,
    `- Total items: ${dashboard.totalItems}`,
    `- Average lesson score: ${dashboard.averageLessonScore}`,
    `- Average question score: ${dashboard.averageQuestionScore}`,
    `- Average rationale score: ${dashboard.averageRationaleScore}`,
    `- Average clinical pearl score: ${dashboard.averageClinicalPearlScore}`,
    `- Average hint score: ${dashboard.averageHintScore}`,
    `- Duplicate rate: ${dashboard.duplicateRate}%`,
    `- Review backlog: ${dashboard.reviewBacklog}`,
    `- Publication readiness: ${dashboard.publicationReady} items (${dashboard.publicationReadyRate}%)`,
    `- Do Not Publish: ${dashboard.doNotPublish}`,
    "",
    "## Publication Gates",
    "",
    "- Quality Score >= 85",
    "- Clinical Accuracy Pass",
    "- No Placeholder Content",
    "- No Duplicate Content",
    "- Required Sections Complete",
    "- Rationale Complete",
    "- Hint Complete",
    "- Clinical Pearl Complete",
    "",
    "## By Content Type",
    "",
    "| Type | Count | Average score | Ready | Needs review |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...(typeRows.length ? typeRows : ["| none | 0 | 0 | 0 | 0 |"]),
    "",
    "## Expert Review Queue",
    "",
    "| Priority | Type | ID | Score | Primary reason |",
    "| --- | --- | --- | ---: | --- |",
    ...(queueRows.length ? queueRows : ["| none | - | - | - | - |"]),
    "",
    "## Duplicate Candidates",
    "",
    "| Left ID | Right ID | Similarity |",
    "| --- | --- | ---: |",
    ...(duplicateRows.length ? duplicateRows : ["| none | - | - |"]),
    "",
    "_Quality over quantity: content that does not meet the publication gate stays in review._",
    "",
  ].join("\n");
}

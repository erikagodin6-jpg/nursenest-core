import type { TierPedagogyProfile } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import type { AdaptiveDifficultyDescriptor } from "@/lib/questions/adaptive-difficulty-standards";
import type { CaseStudyExpansionStandard } from "@/lib/questions/case-study-expansion-standards";
import type { DistractorOptimizationStandard } from "@/lib/questions/distractor-optimization-standards";
import type { EducationalReadabilityStandard } from "@/lib/questions/educational-readability-standards";
import type { InteractiveQuestionTypeStandard } from "@/lib/questions/interactive-question-type-standards";
import type { LicensingExamStyleStandard } from "@/lib/questions/licensing-exam-style-standards";
import type { PremiumContentDepthStandard } from "@/lib/questions/premium-content-depth-standards";

export type PracticeQuestionType =
  | "single"
  | "multiple"
  | "ordered"
  | "matrix"
  | "bowtie"
  | "cloze"
  | "hotspot"
  | "case-study"
  | "chart-review"
  | "highlight"
  | "trend"
  | "extended-matching"
  | "multimedia"
  | "decision-tree"
  | "delegation"
  | "triage"
  | "medication-safety"
  | "communication-documentation"
  | "ranking"
  | "clinical-judgment";

export type PracticeQuestionLayoutMode = "exam-single-pane" | "flashcard-split-study";

export type PracticeQuestionScoringRule =
  | "exact"
  | "partial-credit"
  | "ordered"
  | "matrix"
  | "hotspot"
  | "matching"
  | "decision-tree"
  | "classification"
  | "multi-part";

export interface PracticeQuestionInteractionProfile {
  type: PracticeQuestionType;
  scoringRule: PracticeQuestionScoringRule;
  partialCredit: boolean;
  requiresStructuredPayload: boolean;
  supportsSplitRationale: boolean;
  confidenceTracking: boolean;
}

export interface PracticeQuestionRenderDefinition {
  id: string;
  questionType: PracticeQuestionType;
  prompt: string;
  answers: unknown;
  rationale?: unknown;
  scoringRule: PracticeQuestionScoringRule;
  partialCredit: boolean;
  interactionRules?: Record<string, unknown>;
  clinicalMetadata?: {
    topic?: string | null;
    subtopic?: string | null;
    nclexCategory?: string | null;
    difficulty?: number | null;
  };
  relatedLesson?: { title: string; href: string } | null;
  confidenceTracking: boolean;
  tierPedagogy: TierPedagogyProfile;
  adaptiveDifficulty?: AdaptiveDifficultyDescriptor;
  caseStudyStandard?: CaseStudyExpansionStandard;
  distractorStandard?: DistractorOptimizationStandard;
  educationalReadability?: EducationalReadabilityStandard;
  interactiveQuestionType?: InteractiveQuestionTypeStandard;
  licensingExamStyle?: LicensingExamStyleStandard;
  premiumContentDepth?: PremiumContentDepthStandard;
}

const QUESTION_TYPE_ALIASES: Array<{
  match: RegExp;
  type: PracticeQuestionType;
}> = [
  { match: /^(bow[-_\s]?tie|bowtie)$/i, type: "bowtie" },
  { match: /^(sata|select[-_\s]?all|select[-_\s]?all[-_\s]?that[-_\s]?apply|multiple[-_\s]?response)$/i, type: "multiple" },
  { match: /^(ordered|ordered[-_\s]?response|order[-_\s]?response|sequencing|sequence|drag[-_\s]?drop)$/i, type: "ordered" },
  { match: /^(matrix|grid)$/i, type: "matrix" },
  { match: /^(cloze|drop[-_\s]?down|dropdown|fill[-_\s]?in)$/i, type: "cloze" },
  { match: /^(hotspot|image[-_\s]?selection|image)$/i, type: "hotspot" },
  { match: /^(case[-_\s]?study|case)$/i, type: "case-study" },
  { match: /^(chart[-_\s]?review|ehr|ehr[-_\s]?simulation|mar[-_\s]?review)$/i, type: "chart-review" },
  { match: /^(highlight|select[-_\s]?in[-_\s]?passage|passage[-_\s]?select)$/i, type: "highlight" },
  { match: /^(trend|chart|trend[-_\s]?chart)$/i, type: "trend" },
  { match: /^(extended[-_\s]?matching|matching|option[-_\s]?bank)$/i, type: "extended-matching" },
  { match: /^(multimedia|ecg|audio|image[-_\s]?based|sound|imaging|wound[-_\s]?photo)$/i, type: "multimedia" },
  { match: /^(simulation|decision[-_\s]?tree|branching[-_\s]?scenario|branching)$/i, type: "decision-tree" },
  { match: /^(delegation|assignment|workload[-_\s]?assignment)$/i, type: "delegation" },
  { match: /^(triage|first[-_\s]?to[-_\s]?see|prioritization[-_\s]?set)$/i, type: "triage" },
  { match: /^(medication[-_\s]?safety|med[-_\s]?safety|dosage[-_\s]?verification|high[-_\s]?alert)$/i, type: "medication-safety" },
  { match: /^(communication|documentation|sbar|handoff|therapeutic[-_\s]?communication|legal[-_\s]?charting)$/i, type: "communication-documentation" },
  { match: /^(priority[-_\s]?ranking|ranking|rank[-_\s]?order|priority)$/i, type: "ranking" },
  { match: /^(clinical[-_\s]?judgment|layered[-_\s]?clinical[-_\s]?judgment)$/i, type: "clinical-judgment" },
  { match: /^(mcq|multiple[-_\s]?choice|single[-_\s]?best|single)$/i, type: "single" },
];

export const ENTRY_LEVEL_RN_QUESTION_SCOPE = {
  prioritize: [
    "patient safety",
    "prioritization",
    "delegation",
    "recognition of deterioration",
    "nursing interventions",
    "education",
    "pharmacology safety",
    "expected vs unexpected findings",
    "foundational clinical judgment",
  ],
  avoid: [
    "highly specialized ICU management",
    "advanced ventilator management",
    "physician-level decision-making",
    "respiratory therapist-specific interventions",
    "rare specialty procedures",
    "obscure disease states",
    "overly technical lab interpretation beyond NCLEX scope",
  ],
} as const;

export function normalizePracticeQuestionType(
  raw: string | null | undefined,
  hasBowtiePayload = false,
): PracticeQuestionType {
  if (hasBowtiePayload) return "bowtie";
  const normalized = String(raw ?? "").trim();
  if (!normalized) return "single";

  for (const alias of QUESTION_TYPE_ALIASES) {
    if (alias.match.test(normalized)) return alias.type;
  }

  return "single";
}

export function resolvePracticeQuestionLayoutMode(args: {
  splitRationale: boolean;
  examStyle: boolean;
}): PracticeQuestionLayoutMode {
  if (args.splitRationale && !args.examStyle) return "flashcard-split-study";
  return "exam-single-pane";
}

export function practiceQuestionSupportsImmediateRationale(type: PracticeQuestionType): boolean {
  return type !== "case-study" && type !== "decision-tree";
}

export const PRACTICE_QUESTION_INTERACTION_PROFILES: Record<
  PracticeQuestionType,
  PracticeQuestionInteractionProfile
> = {
  single: {
    type: "single",
    scoringRule: "exact",
    partialCredit: false,
    requiresStructuredPayload: false,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  multiple: {
    type: "multiple",
    scoringRule: "partial-credit",
    partialCredit: true,
    requiresStructuredPayload: false,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  ordered: {
    type: "ordered",
    scoringRule: "ordered",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  matrix: {
    type: "matrix",
    scoringRule: "matrix",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  bowtie: {
    type: "bowtie",
    scoringRule: "multi-part",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  cloze: {
    type: "cloze",
    scoringRule: "exact",
    partialCredit: false,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  hotspot: {
    type: "hotspot",
    scoringRule: "hotspot",
    partialCredit: false,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  "case-study": {
    type: "case-study",
    scoringRule: "multi-part",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: false,
    confidenceTracking: true,
  },
  "chart-review": {
    type: "chart-review",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  highlight: {
    type: "highlight",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  trend: {
    type: "trend",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  "extended-matching": {
    type: "extended-matching",
    scoringRule: "matching",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  multimedia: {
    type: "multimedia",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  "decision-tree": {
    type: "decision-tree",
    scoringRule: "decision-tree",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: false,
    confidenceTracking: true,
  },
  delegation: {
    type: "delegation",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: false,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  triage: {
    type: "triage",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: false,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  "medication-safety": {
    type: "medication-safety",
    scoringRule: "exact",
    partialCredit: false,
    requiresStructuredPayload: false,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  "communication-documentation": {
    type: "communication-documentation",
    scoringRule: "classification",
    partialCredit: true,
    requiresStructuredPayload: false,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  ranking: {
    type: "ranking",
    scoringRule: "ordered",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
  "clinical-judgment": {
    type: "clinical-judgment",
    scoringRule: "multi-part",
    partialCredit: true,
    requiresStructuredPayload: true,
    supportsSplitRationale: true,
    confidenceTracking: true,
  },
};

export function resolvePracticeQuestionInteractionProfile(
  type: PracticeQuestionType,
): PracticeQuestionInteractionProfile {
  return PRACTICE_QUESTION_INTERACTION_PROFILES[type];
}

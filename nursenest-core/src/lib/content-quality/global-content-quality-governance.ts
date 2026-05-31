export type GlobalContentAssetType =
  | "lesson"
  | "question"
  | "rationale"
  | "hint"
  | "clinical_pearl"
  | "flashcard"
  | "ngn_case"
  | "blog"
  | "simulation"
  | "practice_exam"
  | "cat_pool";

export type GlobalContentLifecycleState =
  | "draft"
  | "internal_review"
  | "clinical_review"
  | "educational_review"
  | "seo_review"
  | "ready_for_publication"
  | "published"
  | "archived";

export type GlobalContentReviewGate =
  | "clinical_review"
  | "educational_review"
  | "seo_review"
  | "localization_review"
  | "accessibility_review";

export type GlobalContentQualityDimension =
  | "clinicalAccuracy"
  | "educationalValue"
  | "examRelevance"
  | "originality"
  | "flashcardReusability"
  | "practiceExamReadiness"
  | "catReadiness"
  | "adaptiveLearning"
  | "publicationScore";

export type GlobalQualityReportType =
  | "quality_audit_scorecard"
  | "weak_content_report"
  | "duplicate_content_report"
  | "blueprint_coverage_report"
  | "publication_readiness_report"
  | "monetization_readiness_report";

export type GlobalContentGovernanceStandard = {
  readonly assetType: GlobalContentAssetType;
  readonly minimumScore: number;
  readonly requiredDimensions: readonly GlobalContentQualityDimension[];
  readonly requiredReviewGates: readonly GlobalContentReviewGate[];
  readonly requiredReports: readonly GlobalQualityReportType[];
  readonly hardRejects: readonly string[];
};

export type GlobalContentGovernanceFinding = {
  readonly assetType: GlobalContentAssetType;
  readonly severity: "critical" | "high" | "medium";
  readonly message: string;
};

export const GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE = 90;
export const GLOBAL_DUPLICATE_MANUAL_REVIEW_THRESHOLD = 0.9;
export const GLOBAL_CONTENT_GOVERNANCE_VERSION = "1.0.0" as const;

export const GLOBAL_CONTENT_LIFECYCLE_STATES = [
  "draft",
  "internal_review",
  "clinical_review",
  "educational_review",
  "seo_review",
  "ready_for_publication",
  "published",
  "archived",
] as const satisfies readonly GlobalContentLifecycleState[];

export const GLOBAL_REQUIRED_QUALITY_DIMENSIONS = [
  "clinicalAccuracy",
  "educationalValue",
  "examRelevance",
  "originality",
  "flashcardReusability",
  "practiceExamReadiness",
  "catReadiness",
  "adaptiveLearning",
  "publicationScore",
] as const satisfies readonly GlobalContentQualityDimension[];

export const GLOBAL_REQUIRED_REVIEW_GATES = [
  "clinical_review",
  "educational_review",
  "seo_review",
  "accessibility_review",
] as const satisfies readonly GlobalContentReviewGate[];

export const GLOBAL_LOCALIZED_REVIEW_GATES = [
  ...GLOBAL_REQUIRED_REVIEW_GATES,
  "localization_review",
] as const satisfies readonly GlobalContentReviewGate[];

export const GLOBAL_REQUIRED_REPORTS = [
  "quality_audit_scorecard",
  "weak_content_report",
  "duplicate_content_report",
  "blueprint_coverage_report",
  "publication_readiness_report",
  "monetization_readiness_report",
] as const satisfies readonly GlobalQualityReportType[];

const ASSET_TYPE_REJECTS: Record<GlobalContentAssetType, readonly string[]> = {
  lesson: [
    "Under required word count.",
    "Missing clinical reasoning, pathophysiology, assessment, nursing interventions, safety, or prioritization.",
    "Repeats existing lessons without meaningful new teaching value.",
  ],
  question: [
    "Obvious answer or implausible distractors.",
    "Trivia-only stem without realistic clinical scenario.",
    "Missing clinical reasoning, blueprint metadata, or exam-style decision point.",
  ],
  rationale: [
    "Restates the answer without teaching why.",
    "Missing clinical explanation, wrong-option teaching, safety implication, or transferable learning.",
  ],
  hint: [
    "Reveals the answer or points directly to the correct option.",
    "Fails to guide clinical reasoning.",
  ],
  clinical_pearl: [
    "Generic, obvious, repetitive, or merely restates lesson content.",
    "Missing memorable bedside, safety, escalation, or exam insight.",
  ],
  flashcard: [
    "Definition-only or one-line fact card.",
    "Missing clinical application, memory anchor, common mistake, or exam relevance.",
  ],
  ngn_case: [
    "Missing cue recognition, analysis, prioritization, action, and evaluation sequence.",
    "Missing realistic chart data, patient safety consequence, or remediation mapping.",
  ],
  blog: [
    "Thin SEO page, duplicate article, placeholder language, or generated filler.",
    "Missing author/reviewer trust signals, references, internal links, or educational utility.",
  ],
  simulation: [
    "Linear quiz disguised as simulation.",
    "Missing patient profile, assessment findings, deterioration logic, decisions, consequences, or debriefing.",
  ],
  practice_exam: [
    "Not blueprint weighted or lacks mixed difficulty.",
    "Missing tutor mode, exam mode, rationales, hints, pearls, or analytics readiness.",
  ],
  cat_pool: [
    "Insufficient CAT-eligible items across difficulty and blueprint domains.",
    "Missing discrimination metadata, adaptive routing, or blueprint balancing.",
  ],
};

function standardFor(assetType: GlobalContentAssetType): GlobalContentGovernanceStandard {
  const reviewGates =
    assetType === "blog" || assetType === "lesson" || assetType === "question" || assetType === "flashcard"
      ? GLOBAL_LOCALIZED_REVIEW_GATES
      : GLOBAL_REQUIRED_REVIEW_GATES;

  return {
    assetType,
    minimumScore: GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE,
    requiredDimensions: GLOBAL_REQUIRED_QUALITY_DIMENSIONS,
    requiredReviewGates: reviewGates,
    requiredReports: GLOBAL_REQUIRED_REPORTS,
    hardRejects: ASSET_TYPE_REJECTS[assetType],
  };
}

export const GLOBAL_CONTENT_GOVERNANCE_STANDARDS = [
  "lesson",
  "question",
  "rationale",
  "hint",
  "clinical_pearl",
  "flashcard",
  "ngn_case",
  "blog",
  "simulation",
  "practice_exam",
  "cat_pool",
].map((assetType) => standardFor(assetType as GlobalContentAssetType)) as readonly GlobalContentGovernanceStandard[];

export function getGlobalContentGovernanceStandard(
  assetType: GlobalContentAssetType,
): GlobalContentGovernanceStandard {
  return standardFor(assetType);
}

export function isPublishableGlobalContentScore(score: number): boolean {
  return Number.isFinite(score) && score >= GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE;
}

export function requiresDuplicateManualReview(similarityScore: number): boolean {
  return Number.isFinite(similarityScore) && similarityScore >= GLOBAL_DUPLICATE_MANUAL_REVIEW_THRESHOLD;
}

export function validateGlobalContentQualityGovernance(): GlobalContentGovernanceFinding[] {
  const findings: GlobalContentGovernanceFinding[] = [];

  for (const standard of GLOBAL_CONTENT_GOVERNANCE_STANDARDS) {
    if (standard.minimumScore !== GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE) {
      findings.push({
        assetType: standard.assetType,
        severity: "critical",
        message: `${standard.assetType} must use the global 90/100 publication threshold.`,
      });
    }

    for (const dimension of GLOBAL_REQUIRED_QUALITY_DIMENSIONS) {
      if (!standard.requiredDimensions.includes(dimension)) {
        findings.push({
          assetType: standard.assetType,
          severity: "critical",
          message: `${standard.assetType} is missing quality dimension ${dimension}.`,
        });
      }
    }

    for (const gate of GLOBAL_REQUIRED_REVIEW_GATES) {
      if (!standard.requiredReviewGates.includes(gate)) {
        findings.push({
          assetType: standard.assetType,
          severity: "critical",
          message: `${standard.assetType} is missing review gate ${gate}.`,
        });
      }
    }

    if (standard.hardRejects.length === 0) {
      findings.push({
        assetType: standard.assetType,
        severity: "high",
        message: `${standard.assetType} must define hard rejection criteria.`,
      });
    }

    for (const report of GLOBAL_REQUIRED_REPORTS) {
      if (!standard.requiredReports.includes(report)) {
        findings.push({
          assetType: standard.assetType,
          severity: "high",
          message: `${standard.assetType} is missing required report ${report}.`,
        });
      }
    }
  }

  return findings;
}

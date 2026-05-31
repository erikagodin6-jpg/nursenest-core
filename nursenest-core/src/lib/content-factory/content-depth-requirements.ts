export type ContentDepthAssetKind = "lesson" | "flashcard" | "question" | "simulation" | "clinical_skill";

export type ContentDepthRequirement = {
  readonly kind: ContentDepthAssetKind;
  readonly requiredFields: readonly string[];
  readonly minimumWordCount?: number;
  readonly minimumSections?: number;
  readonly minimumDecisionPoints?: number;
  readonly minimumCompetencyMappings?: number;
  readonly rejectIfMissingRelatedContent: true;
};

export const CONTENT_DEPTH_REQUIREMENTS: readonly ContentDepthRequirement[] = [
  {
    kind: "lesson",
    requiredFields: [
      "Learning Objectives",
      "Overview",
      "Core Concepts",
      "Pathophysiology",
      "Assessment",
      "Diagnostics",
      "Interventions",
      "Patient Safety",
      "Clinical Judgment",
      "Clinical Pearls",
      "Exam Relevance",
      "Knowledge Check",
      "Related Lessons",
      "Further Reading",
      "Summary",
    ],
    minimumWordCount: 700,
    minimumSections: 12,
    rejectIfMissingRelatedContent: true,
  },
  {
    kind: "flashcard",
    requiredFields: ["Prompt", "Answer", "Clinical Relevance", "Memory Hook", "Related Lesson", "Related Questions"],
    minimumWordCount: 30,
    rejectIfMissingRelatedContent: true,
  },
  {
    kind: "question",
    requiredFields: [
      "Hint",
      "Correct Answer",
      "Why Correct",
      "Why Incorrect",
      "Clinical Context",
      "Clinical Application",
      "Clinical Pearl",
      "Exam Strategy",
      "Related Lesson",
      "Related Flashcards",
    ],
    minimumWordCount: 160,
    rejectIfMissingRelatedContent: true,
  },
  {
    kind: "simulation",
    requiredFields: ["History", "Assessment", "Diagnostics", "Decision Points", "Outcomes", "Documentation", "Debrief"],
    minimumDecisionPoints: 3,
    rejectIfMissingRelatedContent: true,
  },
  {
    kind: "clinical_skill",
    requiredFields: ["Indications", "Contraindications", "Equipment", "Procedure", "Safety Checks", "Documentation", "Competency Mapping"],
    minimumCompetencyMappings: 2,
    rejectIfMissingRelatedContent: true,
  },
] as const;

export function getContentDepthRequirement(kind: ContentDepthAssetKind): ContentDepthRequirement {
  const requirement = CONTENT_DEPTH_REQUIREMENTS.find((item) => item.kind === kind);
  if (!requirement) throw new Error(`Unknown content depth kind: ${kind}`);
  return requirement;
}

export function validateContentDepthRequirements(): readonly string[] {
  const issues: string[] = [];
  for (const requirement of CONTENT_DEPTH_REQUIREMENTS) {
    if (requirement.requiredFields.length < 5) issues.push(`${requirement.kind} has too few required fields`);
    if (!requirement.rejectIfMissingRelatedContent) issues.push(`${requirement.kind} must reject missing related content`);
    if (requirement.kind === "question" && !requirement.requiredFields.includes("Why Incorrect")) {
      issues.push("question standard must require distractor analysis");
    }
  }
  return issues;
}

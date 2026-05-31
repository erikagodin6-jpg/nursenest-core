export type QuestionFactoryItemType =
  | "MCQ"
  | "SATA"
  | "Bowtie"
  | "Matrix"
  | "Trend"
  | "Case Study"
  | "Prioritization"
  | "Delegation"
  | "Clinical Judgment";

export type QuestionGenerationRequirement = {
  readonly itemType: QuestionFactoryItemType;
  readonly requiredFields: readonly [
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
  ];
  readonly requiresClinicalJudgment: boolean;
};

const REQUIRED_QUESTION_FIELDS: QuestionGenerationRequirement["requiredFields"] = [
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
] as const;

export const QUESTION_GENERATION_FACTORY: readonly QuestionGenerationRequirement[] = [
  "MCQ",
  "SATA",
  "Bowtie",
  "Matrix",
  "Trend",
  "Case Study",
  "Prioritization",
  "Delegation",
  "Clinical Judgment",
].map((itemType) => ({
  itemType: itemType as QuestionFactoryItemType,
  requiredFields: REQUIRED_QUESTION_FIELDS,
  requiresClinicalJudgment: !["MCQ"].includes(itemType),
})) as readonly QuestionGenerationRequirement[];

export function validateQuestionGenerationFactory(): readonly string[] {
  const issues: string[] = [];
  for (const item of QUESTION_GENERATION_FACTORY) {
    for (const field of REQUIRED_QUESTION_FIELDS) {
      if (!item.requiredFields.includes(field)) issues.push(`${item.itemType} missing ${field}`);
    }
  }
  return issues;
}

export type HiddenNpAcademyStatus = {
  readonly published: false;
  readonly visibleInNavigation: false;
  readonly launchReady: false;
  readonly indexable: false;
  readonly adminOnly: true;
};

export const HIDDEN_NP_ACADEMY_STATUS: HiddenNpAcademyStatus = {
  published: false,
  visibleInNavigation: false,
  launchReady: false,
  indexable: false,
  adminOnly: true,
};

export type NpPharmacologyCategory =
  | "cardiovascular"
  | "endocrine"
  | "psychiatric"
  | "respiratory"
  | "neurological"
  | "infectious-disease"
  | "pain-management"
  | "womens-health"
  | "pediatrics"
  | "critical-care";

export type NpPharmacologyAcademyCategory = HiddenNpAcademyStatus & {
  readonly id: NpPharmacologyCategory;
  readonly title: string;
  readonly lessonTarget: number;
  readonly flashcardTarget: number;
  readonly questionTarget: number;
  readonly requiredMedicationClassSections: readonly [
    "Mechanism",
    "Indications",
    "Contraindications",
    "Monitoring",
    "Patient Education",
    "Clinical Pearls",
    "Prescribing Considerations",
  ];
};

export const NP_ADVANCED_PHARMACOLOGY_ACADEMY: readonly NpPharmacologyAcademyCategory[] = [
  "cardiovascular",
  "endocrine",
  "psychiatric",
  "respiratory",
  "neurological",
  "infectious-disease",
  "pain-management",
  "womens-health",
  "pediatrics",
  "critical-care",
].map((id) => ({
  id: id as NpPharmacologyCategory,
  title: id.split("-").map((part) => part[0]!.toUpperCase() + part.slice(1)).join(" "),
  lessonTarget: 50,
  flashcardTarget: 500,
  questionTarget: 300,
  requiredMedicationClassSections: [
    "Mechanism",
    "Indications",
    "Contraindications",
    "Monitoring",
    "Patient Education",
    "Clinical Pearls",
    "Prescribing Considerations",
  ],
  ...HIDDEN_NP_ACADEMY_STATUS,
})) as readonly NpPharmacologyAcademyCategory[];

export type NpAssessmentSystem =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "gi"
  | "gu"
  | "musculoskeletal"
  | "endocrine"
  | "mental-health"
  | "pediatrics"
  | "womens-health";

export type NpAssessmentAcademySystem = HiddenNpAcademyStatus & {
  readonly id: NpAssessmentSystem;
  readonly title: string;
  readonly components: readonly ["Lessons", "Video-Ready Scripts", "Flashcards", "Cases", "Questions", "Documentation Exercises"];
};

export const NP_ADVANCED_ASSESSMENT_ACADEMY: readonly NpAssessmentAcademySystem[] = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "gi",
  "gu",
  "musculoskeletal",
  "endocrine",
  "mental-health",
  "pediatrics",
  "womens-health",
].map((id) => ({
  id: id as NpAssessmentSystem,
  title: id === "gi" ? "GI" : id === "gu" ? "GU" : id.split("-").map((part) => part[0]!.toUpperCase() + part.slice(1)).join(" "),
  components: ["Lessons", "Video-Ready Scripts", "Flashcards", "Cases", "Questions", "Documentation Exercises"],
  ...HIDDEN_NP_ACADEMY_STATUS,
})) as readonly NpAssessmentAcademySystem[];

export function summarizeNpPharmacologyTargets() {
  return NP_ADVANCED_PHARMACOLOGY_ACADEMY.reduce(
    (acc, category) => ({
      lessons: acc.lessons + category.lessonTarget,
      flashcards: acc.flashcards + category.flashcardTarget,
      questions: acc.questions + category.questionTarget,
    }),
    { lessons: 0, flashcards: 0, questions: 0 },
  );
}

export function validateNpAdvancedPracticeAcademies(): readonly string[] {
  const issues: string[] = [];
  const pharmTotals = summarizeNpPharmacologyTargets();
  if (pharmTotals.lessons < 500) issues.push("Advanced Pharmacology Academy must target at least 500 lessons");
  if (pharmTotals.flashcards < 5000) issues.push("Advanced Pharmacology Academy must target at least 5,000 flashcards");
  if (pharmTotals.questions < 3000) issues.push("Advanced Pharmacology Academy must target at least 3,000 questions");
  for (const entry of [...NP_ADVANCED_PHARMACOLOGY_ACADEMY, ...NP_ADVANCED_ASSESSMENT_ACADEMY]) {
    if (entry.published || entry.visibleInNavigation || entry.launchReady || entry.indexable || !entry.adminOnly) {
      issues.push(`${entry.id} must remain hidden development content`);
    }
  }
  return issues;
}

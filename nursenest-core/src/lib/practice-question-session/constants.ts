/** Practice Questions setup + `/app/questions/session` URL contract (query params). */

export const PRACTICE_SESSION_SOURCES = [
  "body_systems",
  "nursing_categories",
  "weak_areas",
  "previously_incorrect",
  "not_studied",
  "mixed_review",
] as const;

export type PracticeSessionSource = (typeof PRACTICE_SESSION_SOURCES)[number];

export const PRACTICE_SESSION_MODES = ["tutor", "exam", "weak_area"] as const;
export type PracticeSessionMode = (typeof PRACTICE_SESSION_MODES)[number];

/** Slug → `topic` query for GET /api/questions (exact DB topic match; API relaxes if pool is empty). */
export const PRACTICE_CATEGORY_SLUGS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "endocrine",
  "renal_urinary",
  "gastrointestinal",
  "maternal_newborn",
  "pediatrics",
  "mental_health",
  "pharmacology",
  "infection_control",
  "safety_prioritization",
  "leadership_delegation",
  "fundamentals",
] as const;

export type PracticeCategorySlug = (typeof PRACTICE_CATEGORY_SLUGS)[number];

export const PRACTICE_CATEGORY_TOPIC: Record<PracticeCategorySlug, string> = {
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  neurological: "Neurological",
  endocrine: "Endocrine",
  renal_urinary: "Renal",
  gastrointestinal: "Gastrointestinal",
  maternal_newborn: "Maternity",
  pediatrics: "Pediatrics",
  mental_health: "Mental Health",
  pharmacology: "Pharmacology",
  infection_control: "Infection Control",
  safety_prioritization: "Safety",
  leadership_delegation: "Leadership",
  fundamentals: "Fundamentals",
};

export const PRACTICE_CATEGORY_LABEL: Record<PracticeCategorySlug, string> = {
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  neurological: "Neurological",
  endocrine: "Endocrine",
  renal_urinary: "Renal & Urinary",
  gastrointestinal: "Gastrointestinal",
  maternal_newborn: "Maternal & Newborn",
  pediatrics: "Pediatrics",
  mental_health: "Mental Health",
  pharmacology: "Pharmacology",
  infection_control: "Infection Control",
  safety_prioritization: "Safety & Prioritization",
  leadership_delegation: "Leadership & Delegation",
  fundamentals: "Fundamentals",
};

export const DEFAULT_PRACTICE_SOURCE: PracticeSessionSource = "mixed_review";
export const DEFAULT_PRACTICE_COUNT = 20;
export const DEFAULT_PRACTICE_MODE: PracticeSessionMode = "tutor";
export const DEFAULT_SHUFFLE = true;

export const PRACTICE_QUESTION_COUNTS = [10, 20, 30, 50] as const;

import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";

/** Mirrors flashcards / practice session query shape (pathway + categories + mode + count + filters). */
export type StudyToolsSessionFilters = {
  weakOnly?: boolean;
};

export type StudyToolSessionMode =
  | "matching"
  | "fill_in_the_blank"
  | "ordering"
  | "lab_drills"
  | "medication_drills";

export type StudyToolsSessionPayload = {
  pathwayId: string;
  selectedCategories: CanonicalStudyCategoryId[];
  mode: StudyToolSessionMode;
  count: number;
  shuffle: boolean;
  filters: StudyToolsSessionFilters;
};

export type StudyToolMatchingItem = {
  kind: "matching";
  id: string;
  sourceQuestionId: string;
  prompt: string;
  answer: string;
  distractors: string[];
  canonicalCategory: CanonicalStudyCategoryId;
};

export type StudyToolFillInItem = {
  kind: "fill_in_the_blank";
  id: string;
  sourceQuestionId: string;
  /** Stem with `____` placeholder. */
  stemMasked: string;
  acceptableAnswers: string[];
  hint?: string;
  canonicalCategory: CanonicalStudyCategoryId;
};

export type StudyToolOrderingItem = {
  kind: "ordering";
  id: string;
  title: string;
  /** Correct top-to-bottom order. */
  steps: string[];
  canonicalCategory: CanonicalStudyCategoryId;
};

export type StudyToolLabItem = {
  kind: "lab_drills";
  id: string;
  sourceQuestionId: string;
  prompt: string;
  acceptableAnswers: string[];
  rationaleHint?: string;
  canonicalCategory: CanonicalStudyCategoryId;
};

export type StudyToolMedicationItem = {
  kind: "medication_drills";
  id: string;
  /** Either bank question or flashcard-backed id `fc:${flashcardId}` */
  sourceId: string;
  prompt: string;
  acceptableAnswers: string[];
  hint?: string;
  canonicalCategory: CanonicalStudyCategoryId;
};

export type StudyToolSessionItem =
  | StudyToolMatchingItem
  | StudyToolFillInItem
  | StudyToolOrderingItem
  | StudyToolLabItem
  | StudyToolMedicationItem;

export type StudyToolsSessionBuildResult =
  | {
      ok: true;
      pathwayId: string;
      payload: StudyToolsSessionPayload;
      items: StudyToolSessionItem[];
    }
  | { ok: false; code: "invalid_pathway" | "pathway_not_covered" | "empty_pool" | "database_error"; message: string };

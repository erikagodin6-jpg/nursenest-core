import { classifyLearningTopic, learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { REVIEW_REQUIRED, TAXONOMY } from "@/lib/taxonomy/taxonomy";

/**
 * Exam-bank / classifier buckets use taxonomy leaf ids; RN/PN/RPN hub rows use stable catalog ids.
 * Coalesce counts onto hub row ids so `applyCountsToBuilderCategories` fills the same rows the learner grid maps.
 */
const CLASSIFIER_COUNT_KEY_TO_RN_PN_HUB_ROW_ID: Record<string, string> = {
  renal_genitourinary: "renal_urinary",
  reproductive_obstetrics: "reproductive_maternal_newborn",
  immune_infectious: "infection_control",
  ethics: "professional_practice",
  legal_regulation: "professional_practice",
  documentation: "professional_practice",
  communication: "professional_practice",
  scope_of_practice: "professional_practice",
  delegation_supervision: "professional_practice",
  leadership_management: "professional_practice",
  patient_safety_quality: "professional_practice",
  cardiovascular_drugs: "pharmacology",
  cns_drugs: "pharmacology",
  endocrine_drugs: "pharmacology",
  anti_infectives: "pharmacology",
  pain_sedation: "pharmacology",
  test_taking: "exam_strategy",
  study_strategy: "exam_strategy",
};

/**
 * Merge exam-inventory / classifier count keys onto pathway hub category ids where the catalog uses aliases.
 */
export function coalesceExamInventoryCountsOntoPathwayHubRows(
  pathwayId: string | null | undefined,
  counts: Record<string, number>,
): Record<string, number> {
  if (!pathwayId?.trim()) return { ...counts };
  const cfg = learningConfigForPathwayId(pathwayId);
  const allowed = new Set(cfg.categories.map((c) => c.id));
  const out: Record<string, number> = {};
  for (const [rawId, rawN] of Object.entries(counts)) {
    if (!rawId || !Number.isFinite(rawN) || rawN <= 0) continue;
    const mapped = CLASSIFIER_COUNT_KEY_TO_RN_PN_HUB_ROW_ID[rawId];
    const target = mapped && allowed.has(mapped) ? mapped : rawId;
    out[target] = (out[target] ?? 0) + rawN;
  }
  return out;
}

const EXAM_META_IDS = new Set<string>(TAXONOMY.EXAM_META);

const OVERRIDES: Array<{ pattern: RegExp; categoryId: string }> = [
  { pattern: /\babg\b|arterial blood gas|oxygenation|ventilation/i, categoryId: "respiratory" },
  { pattern: /\bbph\b|benign prostatic hyperplasia|prostat/i, categoryId: "renal_genitourinary" },
  { pattern: /calcium|magnesium|electrolyte|sodium|potassium/i, categoryId: "endocrine" },
  { pattern: /male reproductive|reproductive tract|ob-gyn|pregnan|postpartum|gyne/i, categoryId: "reproductive_obstetrics" },
];

const SYSTEM_KEYWORDS =
  /cardio|heart|respir|pulmonary|neuro|stroke|renal|kidney|urinar|endocrine|diabet|gi|gastro|hepatic|musculo|ortho|heme|oncolog|infect|immune|dermat|reproductive|ob-gyn|pediatric|mental|psychi|pharmac|burn|graft|shock|sepsis|dka|copd|bph|electrolyte/i;

const FUNDAMENTALS_ALLOWED =
  /safety|infection control|hand hygiene|aseptic|sterile|ppe|isolation|prioritiz|delegat|communication|documentation|foundational|basic assessment|vital signs|therapeutic communication/i;

const CATEGORY_BLOCKERS: Array<{ pattern: RegExp; categoryId: string }> = [
  { pattern: /burn|skin graft|pressure injury|wound|cellulitis|rash|dermat|lesion|melanoma|basal cell|squamous cell/i, categoryId: "integumentary" },
  { pattern: /heart failure|acs|arrhythm|mi\b|stemi|cardio|coronary|shock|hemodynamic|perfusion/i, categoryId: "cardiovascular" },
  { pattern: /copd|asthma|abg|oxygen|ventilat|pulmonary|pneumonia|respir|hypox|ecmo/i, categoryId: "respiratory" },
  { pattern: /dka|hhs|thyroid|adrenal|pituitary|endocrine|diabet|electrolyte|magnesium|calcium|potassium|sodium/i, categoryId: "endocrine" },
  { pattern: /stroke|seizure|icp|tbi|delirium|neurolog/i, categoryId: "neurological" },
  { pattern: /\bbph\b|prostat|renal|kidney|dialysis|aki|ckd|urinar|uti|gu\b/i, categoryId: "renal_genitourinary" },
  { pattern: /sepsis|infect|immune|antibiotic|antimicrobial/i, categoryId: "immune_infectious" },
];

export type BuilderCategoryOption = {
  id: string;
  title: string;
  description?: string;
  count: number;
};

export function resolveBuilderCategoryId(input: {
  label: string;
  topicCode?: string | null;
  pathwayId?: string | null;
  front?: string | null;
  back?: string | null;
  deckTitle?: string | null;
  /** From `ExamQuestion.bodySystem` when the flashcard is sourced from the question bank. */
  examBodySystem?: string | null;
  /** From `ExamQuestion.topic` when the flashcard is sourced from the question bank. */
  examTopic?: string | null;
}): string {
  const text = `${input.examBodySystem ?? ""} ${input.examTopic ?? ""} ${input.label} ${input.topicCode ?? ""} ${input.deckTitle ?? ""} ${input.front ?? ""} ${input.back ?? ""}`.trim();
  for (const override of OVERRIDES) {
    if (override.pattern.test(text)) return override.categoryId;
  }
  for (const blocker of CATEGORY_BLOCKERS) {
    if (blocker.pattern.test(text)) return blocker.categoryId;
  }
  const classified = classifyLearningTopic(text, input.pathwayId);
  // Do not park clearly system-specific topics under exam-meta buckets.
  if (EXAM_META_IDS.has(classified.categoryId) && SYSTEM_KEYWORDS.test(text) && !FUNDAMENTALS_ALLOWED.test(text)) {
    return REVIEW_REQUIRED;
  }
  const out = classified.categoryId;
  const hadExamOrLessonSignal = Boolean(
    (input.examBodySystem && input.examBodySystem.trim()) ||
      (input.examTopic && input.examTopic.trim()) ||
      (input.label && input.label.trim()),
  );
  if (out === REVIEW_REQUIRED && !hadExamOrLessonSignal) {
    return FLASHCARD_BUILDER_UNCATEGORIZED_ID;
  }
  return out;
}

export function builderCategoryOptionsForPathway(pathwayId: string | null | undefined): BuilderCategoryOption[] {
  const config = learningConfigForPathwayId(pathwayId);
  return config.categories.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    count: 0,
  }));
}

/** Stable id for cards that cannot be mapped to a pathway hub body system. */
export const FLASHCARD_BUILDER_UNCATEGORIZED_ID = "uncategorized";

function humanizeUnknownBuilderCategoryId(id: string): string {
  if (id === REVIEW_REQUIRED) return "Review required";
  if (id === FLASHCARD_BUILDER_UNCATEGORIZED_ID) return "Uncategorized";
  return id
    .split("_")
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

export type ApplyBuilderCategoryCountsOptions = {
  /**
   * `hub_inventory` (default): every pathway hub body-system row (lessons hub parity), including 0-count buckets.
   * `non_empty_only`: legacy — only rows with count > 0 (empty when there are no cards at all).
   */
  listMode?: "hub_inventory" | "non_empty_only";
};

/**
 * Merges classifier counts into the pathway's builder category list. Counts whose ids are absent from
 * the static config (stale taxonomy keys, deck-specific labels, etc.) still surface as trailing rows.
 *
 * Default `hub_inventory` keeps the flashcards hub aligned with the pathway lessons hub: body systems stay
 * visible even when the card pool is empty or filters zero out matches.
 */
export function applyCountsToBuilderCategories(
  pathwayId: string | null | undefined,
  counts: Record<string, number>,
  options?: ApplyBuilderCategoryCountsOptions,
): BuilderCategoryOption[] {
  const listMode = options?.listMode ?? "hub_inventory";
  const categories = builderCategoryOptionsForPathway(pathwayId);
  const baseIds = new Set(categories.map((c) => c.id));
  const coalesced = coalesceExamInventoryCountsOntoPathwayHubRows(pathwayId, counts);
  const merged = categories.map((c) => ({ ...c, count: coalesced[c.id] ?? 0 }));

  const extras: BuilderCategoryOption[] = [];
  for (const [id, count] of Object.entries(coalesced)) {
    if (!id || count <= 0 || baseIds.has(id)) continue;
    extras.push({
      id,
      title: humanizeUnknownBuilderCategoryId(id),
      count,
    });
  }
  extras.sort((a, b) => a.title.localeCompare(b.title));
  const withExtras = [...merged, ...extras];
  if (listMode === "non_empty_only") {
    return withExtras.filter((c) => c.count > 0);
  }
  return [...merged, ...extras.filter((e) => e.count > 0)];
}

export function builderCategoryTitleForId(pathwayId: string | null | undefined, categoryId: string): string {
  const categories = builderCategoryOptionsForPathway(pathwayId);
  return categories.find((c) => c.id === categoryId)?.title ?? humanizeUnknownBuilderCategoryId(categoryId);
}

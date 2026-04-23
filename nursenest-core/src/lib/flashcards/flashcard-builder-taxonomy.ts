import { classifyLearningTopic, learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { REVIEW_REQUIRED, TAXONOMY } from "@/lib/taxonomy/taxonomy";

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
}): string {
  const text = `${input.label} ${input.topicCode ?? ""} ${input.deckTitle ?? ""} ${input.front ?? ""} ${input.back ?? ""}`.trim();
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
  return classified.categoryId;
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

export function applyCountsToBuilderCategories(
  pathwayId: string | null | undefined,
  counts: Record<string, number>,
): BuilderCategoryOption[] {
  const categories = builderCategoryOptionsForPathway(pathwayId);
  return categories
    .map((c) => ({ ...c, count: counts[c.id] ?? 0 }))
    .filter((c) => c.count > 0);
}

export function builderCategoryTitleForId(pathwayId: string | null | undefined, categoryId: string): string {
  const categories = builderCategoryOptionsForPathway(pathwayId);
  return categories.find((c) => c.id === categoryId)?.title ?? "General";
}

import { classifyLearningTopic, learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";

const OVERRIDES: Array<{ pattern: RegExp; categoryId: string }> = [
  { pattern: /\babg\b|arterial blood gas|oxygenation|ventilation/i, categoryId: "respiratory" },
  { pattern: /\bbph\b|benign prostatic hyperplasia|prostat/i, categoryId: "renal-genitourinary" },
  { pattern: /calcium|magnesium|electrolyte|sodium|potassium/i, categoryId: "endocrine" },
  { pattern: /male reproductive|reproductive tract|ob-gyn|pregnan|postpartum|gyne/i, categoryId: "reproductive-ob-gyn" },
];

const SYSTEM_KEYWORDS =
  /cardio|heart|respir|pulmonary|neuro|stroke|renal|kidney|urinar|endocrine|diabet|gi|gastro|hepatic|musculo|ortho|heme|oncolog|infect|immune|dermat|reproductive|ob-gyn|pediatric|mental|psychi|pharmac|burn|graft|shock|sepsis|dka|copd|bph|electrolyte/i;

const FUNDAMENTALS_ALLOWED =
  /safety|infection control|hand hygiene|aseptic|sterile|ppe|isolation|prioritiz|delegat|communication|documentation|foundational|basic assessment|vital signs|therapeutic communication/i;

const CATEGORY_BLOCKERS: Array<{ pattern: RegExp; categoryId: string }> = [
  { pattern: /burn|skin graft|pressure injury|wound|cellulitis|rash|dermat/i, categoryId: "dermatology" },
  { pattern: /heart failure|acs|arrhythm|mi\b|stemi|cardio|coronary|shock|hemodynamic/i, categoryId: "cardiovascular" },
  { pattern: /copd|asthma|abg|oxygen|ventilat|pulmonary|pneumonia|respir/i, categoryId: "respiratory" },
  { pattern: /dka|hhs|thyroid|adrenal|pituitary|endocrine|diabet|electrolyte|magnesium|calcium|potassium|sodium/i, categoryId: "endocrine" },
  { pattern: /stroke|seizure|icp|tbi|delirium|neurolog/i, categoryId: "neurology" },
  { pattern: /\bbph\b|prostat|renal|kidney|dialysis|aki|ckd|urinar|uti|gu\b/i, categoryId: "renal-genitourinary" },
  { pattern: /sepsis|infect|immune|antibiotic|antimicrobial/i, categoryId: "immune-infectious" },
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
  // Guardrail: if a clearly system-specific topic was misrouted, keep it out of Fundamentals.
  if (classified.categoryId === "fundamentals" && (SYSTEM_KEYWORDS.test(text) || !FUNDAMENTALS_ALLOWED.test(text))) {
    return "professional-practice-ethics";
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

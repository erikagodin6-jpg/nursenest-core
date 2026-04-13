import { classifyLearningTopic, learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";

const OVERRIDES: Array<{ pattern: RegExp; categoryId: string }> = [
  { pattern: /\babg\b|arterial blood gas|oxygenation|ventilation/i, categoryId: "respiratory" },
  { pattern: /\bbph\b|benign prostatic hyperplasia|prostat/i, categoryId: "renal-genitourinary" },
  { pattern: /calcium|magnesium|electrolyte|sodium|potassium/i, categoryId: "endocrine" },
  { pattern: /male reproductive|reproductive tract|ob-gyn|pregnan|postpartum|gyne/i, categoryId: "reproductive-ob-gyn" },
];

const SYSTEM_KEYWORDS =
  /cardio|heart|respir|pulmonary|neuro|stroke|renal|kidney|urinar|endocrine|diabet|gi|gastro|hepatic|musculo|ortho|heme|oncolog|infect|immune|dermat|reproductive|ob-gyn|pediatric|mental|psychi|pharmac/i;

export type BuilderCategoryOption = {
  id: string;
  title: string;
  description?: string;
  count: number;
};

export function resolveBuilderCategoryId(input: { label: string; topicCode?: string | null; pathwayId?: string | null }): string {
  const text = `${input.label} ${input.topicCode ?? ""}`.trim();
  for (const override of OVERRIDES) {
    if (override.pattern.test(text)) return override.categoryId;
  }
  const classified = classifyLearningTopic(text, input.pathwayId);
  // Guardrail: if a clearly system-specific topic was misrouted, keep it out of Fundamentals.
  if (classified.categoryId === "fundamentals" && SYSTEM_KEYWORDS.test(text)) {
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

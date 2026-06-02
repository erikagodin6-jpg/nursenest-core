import {
  HIGH_TRAFFIC_SLUG_HINTS,
  LOW_VISUAL_PRIORITY_PATTERNS,
  VISUAL_HIGH_PRIORITY_KEYWORDS,
} from "@/lib/content/lesson-image-audit/constants";

export type VisualNecessityInput = {
  title: string;
  slug: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
};

function haystack(input: VisualNecessityInput): string {
  return [input.title, input.slug, input.topic, input.topicSlug, input.bodySystem]
    .join(" ")
    .toLowerCase();
}

export function isLowVisualPriorityLesson(input: VisualNecessityInput): boolean {
  const h = haystack(input);
  if (LOW_VISUAL_PRIORITY_PATTERNS.some((re) => re.test(h))) return true;
  if (/\b(bp\d+|stub|placeholder)\b/i.test(input.slug)) return true;
  return false;
}

/** 0–100 — how much this lesson benefits from a dedicated clinical visual. */
export function scoreVisualNecessity(input: VisualNecessityInput): number {
  if (isLowVisualPriorityLesson(input)) return 12;

  const h = haystack(input);
  let score = 28;

  for (const kw of VISUAL_HIGH_PRIORITY_KEYWORDS) {
    if (h.includes(kw)) score += 9;
  }

  if (/\b(compare|versus|vs\.?|types of|classification)\b/i.test(h)) score += 12;
  if (/\b(pathophysiology|mechanism|anatomy|interpretation|placement|algorithm)\b/i.test(h)) {
    score += 10;
  }
  if (/\b(workflow|protocol|step|priority action|nursing intervention)\b/i.test(h)) score += 8;

  if (h.includes("cardiovascular") || h.includes("respiratory") || h.includes("pharmacology")) {
    score += 6;
  }

  return Math.min(100, Math.max(0, score));
}

export function shouldLessonHaveImage(input: VisualNecessityInput): boolean {
  return scoreVisualNecessity(input) >= 42;
}

export function scoreSeoTrafficImportance(input: VisualNecessityInput): number {
  const h = haystack(input);
  let score = 20;
  for (const hint of HIGH_TRAFFIC_SLUG_HINTS) {
    if (h.includes(hint)) score += 14;
  }
  if (input.slug.length <= 42 && !input.slug.includes("bp26")) score += 6;
  return Math.min(100, score);
}

export function scoreClinicalComplexity(input: VisualNecessityInput): number {
  const h = haystack(input);
  let score = 25;
  const complexTerms = [
    "pathophysiology",
    "differential",
    "interpretation",
    "multiorgan",
    "hemodynamic",
    "ventilation",
    "anticoagulation",
    "electrolyte",
    "acid-base",
  ];
  for (const t of complexTerms) {
    if (h.includes(t)) score += 10;
  }
  return Math.min(100, score);
}

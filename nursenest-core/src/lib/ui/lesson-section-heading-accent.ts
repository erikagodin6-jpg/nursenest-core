import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

/**
 * When `kind` is missing or a generic catalog bucket, map recognizable **H2 heading**
 * phrases to the clinical chip label used above section titles. This does not change
 * `PathwayLesson` data — UI-only refinement layered on `getLessonSectionTheme`.
 *
 * Heuristic order: first match wins (case-insensitive substring on trimmed heading).
 */
const HEADING_CHIP_RULES: { test: RegExp; label: string }[] = [
  { test: /\bpathophys/i, label: "Pathophysiology" },
  { test: /\b(diagnostic|labs?|laboratory)\b/i, label: "Diagnostics & labs" },
  { test: /\b(signs?|symptoms?|presentation|manifestations?)\b/i, label: "Signs & symptoms" },
  { test: /\b(medication|pharmac|treatment|management|therap|intervention)\b/i, label: "Treatments & medications" },
  { test: /\b(pearl|clinical pearl)\b/i, label: "Clinical pearls" },
  { test: /\b(client|patient|family) educat/i, label: "Client education" },
  { test: /\b(exam|nclex|tip|high[\s-]?yield)\b/i, label: "Exam tips" },
];

const GENERIC_KINDS = new Set<PathwayLessonSectionKind>([
  "intro",
  "core",
  "introduction",
  "core_concept",
  "country_specific_notes",
]);

export function refineChipLabelFromHeading(
  heading: string,
  kind: PathwayLessonSectionKind | null | undefined,
): string | undefined {
  const h = heading.trim();
  if (!h) return undefined;
  if (kind && !GENERIC_KINDS.has(kind)) return undefined;

  for (const { test, label } of HEADING_CHIP_RULES) {
    if (test.test(h)) return label;
  }
  return undefined;
}

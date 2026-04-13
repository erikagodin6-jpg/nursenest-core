import type { PathwayLessonExamFocus, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

/** Count letters and numbers (Unicode-aware) for thin-body detection. */
export function countAlphanumericChars(text: string): number {
  return (text.match(/\p{L}|\p{N}/gu) ?? []).length;
}

const PLACEHOLDER_HEAD = /^(?:\s*(?:TODO|TBD|WIP|DRAFT)\b|\[placeholder\]|placeholder:|content\s+todo|coming\s+soon|lorem\s+ipsum|fixme)\b/i;

/**
 * True when the body is empty, obviously placeholder, or too thin to read as a real section.
 */
export function bodyIsPlaceholderOrTrivial(body: string): boolean {
  const t = body.trim();
  if (!t) return true;
  const oneLine = t.replace(/\s+/g, " ");
  if (oneLine.length <= 160 && PLACEHOLDER_HEAD.test(oneLine)) return true;
  if (countAlphanumericChars(t) < 14) return true;
  return false;
}

function examFocusHasSubstance(ef: PathwayLessonExamFocus | undefined): boolean {
  if (!ef) return false;
  const parts = [ef.howTested, ef.commonTraps, ef.prioritizationCues].filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0,
  );
  if (parts.length === 0) return false;
  return parts.some((p) => !bodyIsPlaceholderOrTrivial(p) && countAlphanumericChars(p) >= 14);
}

/**
 * Sections that should appear in the subscriber lesson article: has figures, recall, substantive body, or exam focus blocks.
 * Prevents empty or placeholder-only sections from reading as “published” lesson spine.
 */
export function pathwaySectionIsLearnerPresentable(section: PathwayLessonSection): boolean {
  if ((section.figures?.length ?? 0) > 0) return true;
  if ((section.recallPrompts?.length ?? 0) > 0) return true;
  if ((section.checkpointQuestions?.length ?? 0) > 0) return true;
  if ((section.keyRecallFacts?.length ?? 0) > 0) return true;
  if (examFocusHasSubstance(section.examFocus)) return true;
  const body = typeof section.body === "string" ? section.body : "";
  if (!body.trim()) return false;
  return !bodyIsPlaceholderOrTrivial(body);
}

export function filterLearnerPresentablePathwaySections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  return sections.filter(pathwaySectionIsLearnerPresentable);
}

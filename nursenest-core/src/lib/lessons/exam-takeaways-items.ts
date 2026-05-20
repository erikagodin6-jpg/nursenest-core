/**
 * Normalized exam takeaway lines from lesson metadata (`studyTakeaways` on {@link PathwayLessonRecord}).
 * Empty strings are dropped; no synthetic bullets.
 */
export function examTakeawayLinesFromLessonInput(items: string[] | undefined | null): string[] {
  if (!items?.length) return [];
  return items.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
}

export function lessonHasExamTakeaways(items: string[] | undefined | null): boolean {
  return examTakeawayLinesFromLessonInput(items).length > 0;
}

/**
 * RN v2.7 reading stack: first N section cards stay in the center lane;
 * later cards expand under the left pearls column.
 */
export function rnLessonSectionStackClass(
  index: number,
  underLeftFrom = 3,
): string | undefined {
  return index >= underLeftFrom ? "nn-lesson-section-card--under-left" : undefined;
}

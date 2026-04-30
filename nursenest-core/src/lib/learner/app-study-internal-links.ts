/**
 * Canonical in-app study cross-links (lessons hub, flashcards hub, practice-tests hub).
 * Callers must pass pathway ids from server-resolved entitlement context — never from unvalidated client-only state.
 */

export function buildAppFlashcardsTopicHref(pathwayId: string, topicSlug: string): string {
  const pid = pathwayId.trim();
  const t = topicSlug.trim().toLowerCase();
  return `/app/flashcards?pathwayId=${encodeURIComponent(pid)}&topic=${encodeURIComponent(t)}`;
}

export function buildAppPracticeTestsTopicHref(pathwayId: string, topicSlug: string): string {
  const pid = pathwayId.trim();
  const t = topicSlug.trim().toLowerCase();
  return `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}&topic=${encodeURIComponent(t)}`;
}

/** Hub deep link; `/app/lessons/[id]` is preferred when the lesson row id is already known. */
export function buildAppLessonsReviewLessonHref(pathwayId: string, lessonSlug: string): string {
  const pid = pathwayId.trim();
  const s = lessonSlug.trim();
  return `/app/lessons?pathwayId=${encodeURIComponent(pid)}&lessonSlug=${encodeURIComponent(s)}`;
}

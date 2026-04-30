/**
 * Canonical in-app study cross-links (lessons hub, flashcards hub, practice-tests hub).
 * Callers must pass pathway ids from server-resolved entitlement context — never from unvalidated client-only state.
 */

export function buildAppFlashcardsTopicHref(pathwayId: string, topicSlug: string): string {
  const pid = pathwayId.trim();
  const t = topicSlug.trim().toLowerCase();
  return `/app/flashcards?pathwayId=${encodeURIComponent(pid)}&topic=${encodeURIComponent(t)}`;
}

/** Flashcards hub scoped to a canonical topic with the **Weak** filter pre-selected via query string. */
export function buildAppFlashcardsWeakTopicHref(pathwayId: string, topicSlug: string): string {
  const base = buildAppFlashcardsTopicHref(pathwayId, topicSlug);
  return `${base}&weakOnly=1`;
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

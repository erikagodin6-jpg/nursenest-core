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

/**
 * Topic-scoped question bank drill (requires `pathwayId` for tier-scoped routing).
 * Uses `topicCode` = canonical `bidirectionalTopicKey` from {@link PathwayLessonRecord.linkedLearningSignals}.
 */
export function buildAppQuestionsTopicDrillHref(pathwayId: string, bidirectionalTopicKey: string): string {
  const pid = pathwayId.trim();
  const code = bidirectionalTopicKey.trim().toLowerCase();
  const qs = new URLSearchParams();
  qs.set("pathwayId", pid);
  qs.set("topicCode", code);
  qs.set("preset", "topic_drill");
  return `/app/questions?${qs.toString()}`;
}

/** Hub deep link; `/app/lessons/[id]` is preferred when the lesson row id is already known. */
export function buildAppLessonsReviewLessonHref(pathwayId: string, lessonSlug: string): string {
  const pid = pathwayId.trim();
  const s = lessonSlug.trim();
  return `/app/lessons?pathwayId=${encodeURIComponent(pid)}&lessonSlug=${encodeURIComponent(s)}`;
}

/** Dedupe identical `href`s within one render pass (e.g. rationale + reinforce strips). */
export function createStudyLinkHrefDeduper(): (href: string | null | undefined) => string | null {
  const seen = new Set<string>();
  return (href) => {
    if (href == null || typeof href !== "string") return null;
    const h = href.trim();
    if (!h) return null;
    if (seen.has(h)) return null;
    seen.add(h);
    return h;
  };
}

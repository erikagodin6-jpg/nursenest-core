/**
 * **Future hook (not wired in v1):** page-level binding for “explain this rationale” / “quiz this concept”.
 *
 * Planned pattern:
 * 1. Lesson or question review client calls `registerTutorFocus({ questionStemId, rationaleSnippet })` (client module TBD).
 * 2. `LearnerTutorDock` reads optional context from React context or URL search params.
 * 3. Server actions under `src/app/api/learner/tutor/*` validate session + entitlement + rate limits before calling a model.
 *
 * Do not import heavy client code from here — this file stays tree-shakeable documentation + types only.
 */
export type TutorPageFocus = {
  /** Stable id for analytics + future model tool calls */
  questionStemId?: string;
  /** Short excerpt only — never send full bank payloads client-side until policy review */
  rationalePreview?: string;
  topicLabel?: string;
};

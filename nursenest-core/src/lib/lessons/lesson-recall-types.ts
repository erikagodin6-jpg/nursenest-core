/**
 * Active recall content types for lesson sections.
 *
 * These types are OPTIONAL — no lesson is required to have recall data.
 * The UI degrades gracefully when any or all fields are absent.
 *
 * Content lifecycle:
 *   1. Author adds recall data to the lesson JSON / DB sections field.
 *   2. `PathwayLessonSection.recallPrompts`, `.checkpointQuestions`, `.keyRecallFacts`
 *      carry the data through to the page.
 *   3. Recall components render only when the data is present and non-empty.
 *   4. The `LessonRecallToggle` lets the user hide all recall blocks globally.
 */

// ── Reveal-answer recall prompts ──────────────────────────────────────────────

/**
 * A single reveal-answer recall card.
 *
 * Prompts the learner to think before seeing the answer.
 * Collapsed by default; answer + explanation revealed on demand.
 */
export type RecallPrompt = {
  /** Stable unique id within the section (e.g. "rp-aortic-1"). */
  id: string;
  /** Short question or trigger phrase shown while collapsed. */
  prompt: string;
  /** The revealed answer text. */
  answer: string;
  /** Brief clinical explanation shown below the answer. Optional. */
  explanation?: string;
  /**
   * "Think first" nudge shown between the prompt and the reveal button.
   * Defaults to a standard phrase when absent.
   */
  hint?: string;
};

// ── Checkpoint quiz questions ─────────────────────────────────────────────────

export type CheckpointQuestionOption = {
  /** Stable option id within the question (e.g. "a", "b", "c", "d"). */
  id: string;
  /** Display text for this answer choice. */
  text: string;
};

/**
 * A single multiple-choice checkpoint question shown after a lesson section.
 *
 * Provides immediate feedback (correct / incorrect) with a short explanation.
 * Not a scored assessment — purely for active learning reinforcement.
 */
export type CheckpointQuestion = {
  /** Stable unique id within the section (e.g. "cq-aortic-1"). */
  id: string;
  /** The question stem (keep concise — this is a check, not a full NCLEX item). */
  question: string;
  /** Answer options, typically 3–4. */
  options: CheckpointQuestionOption[];
  /** id of the correct option. */
  correctId: string;
  /** Short explanation shown after the learner submits an answer. */
  explanation: string;
};

// ── Key fact blur-to-reveal chips ─────────────────────────────────────────────

/**
 * A single key fact rendered as a compact blur-to-reveal card.
 *
 * Best for definitions, normal values, critical thresholds, and
 * short clinical distinctions that learners should actively recall.
 */
export type KeyRecallFact = {
  /** Stable unique id within the section (e.g. "krf-inr-1"). */
  id: string;
  /**
   * Optional category label shown above the fact (e.g. "Normal Range",
   * "Key Distinction", "Critical Value", "Watch For").
   * When absent, only the fact is shown.
   */
  label?: string;
  /** The fact to recall. Keep ≤ 2 short lines. */
  fact: string;
};

// ── Section recall bundle ─────────────────────────────────────────────────────

/**
 * All recall content for a single lesson section, bundled for convenience.
 * Each field is independently optional.
 */
export type SectionRecallData = {
  recallPrompts?: RecallPrompt[];
  checkpointQuestions?: CheckpointQuestion[];
  keyRecallFacts?: KeyRecallFact[];
};

/** True when a section has any recall content to render. */
export function hasSectionRecall(data: Partial<SectionRecallData>): boolean {
  return (
    (data.recallPrompts?.length ?? 0) > 0 ||
    (data.checkpointQuestions?.length ?? 0) > 0 ||
    (data.keyRecallFacts?.length ?? 0) > 0
  );
}

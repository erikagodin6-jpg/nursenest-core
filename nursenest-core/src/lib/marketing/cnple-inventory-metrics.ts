/**
 * Single source of truth for CNPLE content inventory counts used in marketing copy.
 *
 * Update this file whenever inventory milestones change — all CNPLE marketing
 * surfaces consume these constants so a single edit propagates everywhere.
 *
 * POSITIONING RULES (enforced at call sites):
 *  - caQuestionsLabel / caQuestionsLong → "Canadian-aligned NP" framing, NOT "CNPLE questions"
 *  - cnpleTaggedLabel / cnpleTaggedLong → the explicitly CNPLE-tagged subset only
 *  - Never conflate the two counts on the same surface without explaining the distinction
 *
 * Last updated: 2026-05-13
 * Basis: tag-cnple-exam-questions.mts run + seed-cnple-curated-flashcards.mts run
 */

export const CNPLE_INVENTORY = {
  /**
   * Total Canadian-eligible NP practice questions.
   * Includes: 1,496 CNPLE-tagged + 1,342 FNP|BOTH + any remaining NP|BOTH.
   * Conservative round number per brand positioning guidance.
   * Use for hero copy and primary stat blocks.
   */
  caQuestionsLabel: "4,000+" as const,
  caQuestionsLong: "4,000+ Canadian-aligned NP practice questions" as const,

  /**
   * Questions explicitly tagged exam:"CNPLE" in the ExamQuestion table.
   * More precise claim for secondary copy, FAQ, and comparison tables.
   */
  cnpleTaggedLabel: "1,496" as const,
  cnpleTaggedLong: "1,496 explicitly CNPLE-tagged practice questions" as const,

  /**
   * Total CNPLE flashcard deck size.
   * Includes auto-generated condition-specific cards + hand-authored curated set.
   */
  flashcardsLabel: "1,154" as const,
  flashcardsLong: "1,154 CNPLE-aligned flashcards" as const,

  /**
   * Hand-authored curated CNPLE flashcards (examItemKind: CLINICAL).
   * Canadian guideline-aligned, NP-level clinical reasoning cards.
   */
  curatedFlashcardsLabel: "100" as const,
  curatedFlashcardsLong: "100 hand-authored Canadian clinical reasoning flashcards" as const,

  /**
   * CNPLE-pathway lesson count (unchanged from prior sprint).
   */
  lessonsLabel: "1,463" as const,
  lessonsLong: "1,463 CNPLE-aligned NP lessons" as const,
} as const;

export type CnpleInventoryMetrics = typeof CNPLE_INVENTORY;

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
   * Questions with studyLinkPathwayId=ca-np-cnple — the canonical pathway-scoped count.
   * Updated: 2026-06-02 after launch-readiness publication sprint.
   * Use for hero copy and primary stat blocks.
   */
  caQuestionsLabel: "10,000+" as const,
  caQuestionsLong: "10,000+ CNPLE-aligned NP practice questions" as const,

  /**
   * Questions with studyLinkPathwayId=ca-np-cnple (precise pathway-scoped count).
   * Prefer this over exam="CNPLE" queries — avoids counting legacy/untagged questions.
   */
  cnpleTaggedLabel: "10,375" as const,
  cnpleTaggedLong: "10,375 CNPLE pathway-linked practice questions" as const,

  /**
   * Total CNPLE flashcard deck size across all decks.
   * cnple-clinical-reasoning-launch-deck (8,300) + np-pathway-ca-np-cnple-flashcards (1,154) = 9,454.
   * Updated: 2026-06-02 after launch-readiness publication sprint.
   */
  flashcardsLabel: "9,000+" as const,
  flashcardsLong: "9,000+ CNPLE-aligned flashcards" as const,

  /**
   * Hand-authored curated CNPLE flashcards in cnple-gap-closure-flashcards.ts.
   * Updated: 2026-06-02 — 60 cards authored (not 100 as previously estimated).
   */
  curatedFlashcardsLabel: "60" as const,
  curatedFlashcardsLong: "60 hand-authored Canadian clinical reasoning flashcards" as const,

  /**
   * CNPLE-pathway lesson count (DB: pathwayLesson where pathwayId=ca-np-cnple).
   * Updated: 2026-06-02.
   */
  lessonsLabel: "1,465" as const,
  lessonsLong: "1,465 CNPLE-aligned NP lessons" as const,
} as const;

export type CnpleInventoryMetrics = typeof CNPLE_INVENTORY;

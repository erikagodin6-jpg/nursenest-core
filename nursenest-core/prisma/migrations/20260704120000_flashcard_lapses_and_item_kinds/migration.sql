-- Phase 1: Add lapses counter to flashcard_progress for SM-2 lapse tracking
-- Counts how many times a card is rated "again" after being learned (repetitions > 0).
-- Default 0 — backward-compatible; no existing progress rows change behaviour.

ALTER TABLE "flashcard_progress" ADD COLUMN "lapses" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "flashcard_progress_user_id_lapses_idx" ON "flashcard_progress"("user_id", "lapses");

-- Phase 4: Extend FlashcardItemKind enum with clinical cognition card types.
-- Existing values (RECALL, CLINICAL, PRIORITY, CONCEPT) are unchanged.
-- New values are opt-in — no existing card behaviour changes until examItemKind is set.

ALTER TYPE "FlashcardItemKind" ADD VALUE IF NOT EXISTS 'SATA';
ALTER TYPE "FlashcardItemKind" ADD VALUE IF NOT EXISTS 'ECG_STRIP';
ALTER TYPE "FlashcardItemKind" ADD VALUE IF NOT EXISTS 'BOWTIE';
ALTER TYPE "FlashcardItemKind" ADD VALUE IF NOT EXISTS 'MED_SAFETY';
ALTER TYPE "FlashcardItemKind" ADD VALUE IF NOT EXISTS 'LAB_TREND';

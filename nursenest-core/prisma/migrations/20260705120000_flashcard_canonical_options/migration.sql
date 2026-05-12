-- Phase 1: Canonical relational option model for flashcards
-- Replaces fragile JSON-only SATA persistence with typed, indexed rows.
-- Additive only — no existing tables or columns are modified.
-- Existing JSON fields (answerOptions, correctAnswer, rationaleIncorrect) are
-- preserved and continue to work during the migration window.

-- ─── flashcard_options ────────────────────────────────────────────────────────
-- One row per answer choice. isCorrect supports MCQ (exactly 1 true) and
-- SATA (2+ true). rationale is per-option (may be null for legacy cards).
-- displayOrder controls the render sequence.

CREATE TABLE IF NOT EXISTS "flashcard_options" (
  "id"            TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
  "flashcard_id"  TEXT         NOT NULL,
  "option_key"    VARCHAR(8)   NOT NULL,
  "content"       TEXT         NOT NULL,
  "is_correct"    BOOLEAN      NOT NULL,
  "rationale"     TEXT,
  "display_order" INTEGER      NOT NULL,

  CONSTRAINT "flashcard_options_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "flashcard_options_flashcard_id_option_key_key"
    UNIQUE ("flashcard_id", "option_key"),
  CONSTRAINT "flashcard_options_flashcard_id_fkey"
    FOREIGN KEY ("flashcard_id")
    REFERENCES "flashcards" ("id")
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "flashcard_options_flashcard_id_idx"
  ON "flashcard_options" ("flashcard_id");

-- ─── flashcard_option_responses ───────────────────────────────────────────────
-- Analytics: which option each user selected, supporting distractor frequency,
-- SATA partial accuracy, and misconception heatmaps.
-- No FK to flashcard_options to keep it append-friendly at scale.

CREATE TABLE IF NOT EXISTS "flashcard_option_responses" (
  "id"            TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
  "user_id"       TEXT         NOT NULL,
  "flashcard_id"  TEXT         NOT NULL,
  "option_key"    VARCHAR(8)   NOT NULL,
  "was_correct"   BOOLEAN      NOT NULL,
  "session_id"    TEXT,
  "responded_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT "flashcard_option_responses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "flashcard_option_responses_flashcard_option_idx"
  ON "flashcard_option_responses" ("flashcard_id", "option_key");

CREATE INDEX IF NOT EXISTS "flashcard_option_responses_user_flashcard_idx"
  ON "flashcard_option_responses" ("user_id", "flashcard_id");

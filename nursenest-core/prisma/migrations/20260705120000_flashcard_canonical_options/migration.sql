-- Phase 1: Canonical relational option model for flashcards
-- Replaces fragile JSON-only SATA persistence with typed, indexed rows.
-- Additive only — no existing tables or columns are modified.
-- Existing JSON fields (answerOptions, correctAnswer, rationaleIncorrect) are
-- preserved and continue to work during the migration window.

-- ─── flashcard_options ────────────────────────────────────────────────────────
-- One row per answer choice. isCorrect supports MCQ (exactly 1 true) and
-- SATA (≥ 2 true). rationale is per-option (may be null for legacy-migrated cards).
-- selectCount / correctSelectCount are denormalized aggregates updated atomically
-- on each card review — avoids a join for distractor-frequency dashboards.

CREATE TABLE IF NOT EXISTS "flashcard_options" (
  "id"                   TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
  "flashcard_id"         TEXT         NOT NULL,
  -- Option key within the card: "A"–"D" for MCQ/SATA.
  -- Extended namespaces for future types: "action:A", "row:1:col:A" (matrix).
  "option_key"           VARCHAR(8)   NOT NULL,
  "content"              TEXT         NOT NULL,
  "is_correct"           BOOLEAN      NOT NULL DEFAULT false,
  -- Teaching rationale shown after reveal (per-option).
  -- Null on legacy-migrated cards; card-level rationaleCorrect is used instead.
  "rationale"            TEXT,
  "display_order"        INTEGER      NOT NULL DEFAULT 0,
  -- Denormalized aggregate: total selections across all users.
  "select_count"         INTEGER      NOT NULL DEFAULT 0,
  -- Denormalized: selections where the overall card answer was correct.
  "correct_select_count" INTEGER      NOT NULL DEFAULT 0,

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
-- SATA partial accuracy, dangerous-misconception detection, and remediation targeting.
-- Intentionally no FK to flashcard_options — append-friendly at ingestion scale.

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

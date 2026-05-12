-- Canonical answer-option persistence for flashcards.
-- Replaces JSON answerOptions + rationaleIncorrect for new content.
-- Legacy cards without rows fall back to JSON fields transparently (no data loss).

CREATE TABLE "flashcard_options" (
  "id"                   TEXT        NOT NULL,
  "flashcard_id"         TEXT        NOT NULL,
  "option_key"           TEXT        NOT NULL,
  "content"              TEXT        NOT NULL,
  "is_correct"           BOOLEAN     NOT NULL DEFAULT false,
  "rationale"            TEXT,
  "display_order"        INTEGER     NOT NULL DEFAULT 0,
  -- Denormalized analytics aggregates (avoids a high-volume log table)
  "select_count"         INTEGER     NOT NULL DEFAULT 0,
  "correct_select_count" INTEGER     NOT NULL DEFAULT 0,

  CONSTRAINT "flashcard_options_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "flashcard_options_flashcard_id_option_key_key"
    UNIQUE ("flashcard_id", "option_key"),
  CONSTRAINT "flashcard_options_flashcard_id_fkey"
    FOREIGN KEY ("flashcard_id")
    REFERENCES "flashcards"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Index: load all options for a card in order
CREATE INDEX "flashcard_options_flashcard_id_idx"
  ON "flashcard_options"("flashcard_id");

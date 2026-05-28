-- Observed hot path:
-- scripts/migrate-flashcards-to-postgres.ts counts published enabled rows by source_type.
-- Existing primary key and content_hash unique indexes already cover id/content_hash import probes.
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_source_status_enabled"
  ON "flashcard_bank" ("source_type", "status", "flashcard_enabled");

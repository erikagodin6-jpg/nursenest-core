-- Observed flashcard_bank query families across the Next app maintenance scripts
-- and legacy Express server:
-- - source/status/enabled counts and fetches
-- - tier/status counts and learner/admin lists
-- - source_question_id duplicate probes and joins
-- - career/topic/status related-content lookups
-- - created_at admin/report ordering and time-window counts
-- Existing primary key and content_hash unique indexes cover id/content_hash probes.
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_source_status_enabled"
  ON "flashcard_bank" ("source_type", "status", "flashcard_enabled");

CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_tier_status"
  ON "flashcard_bank" ("tier", "status");

CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_source_question_id"
  ON "flashcard_bank" ("source_question_id");

CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_status_created_at"
  ON "flashcard_bank" ("status", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_topic_status"
  ON "flashcard_bank" ("topic", "status");

CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_category_status"
  ON "flashcard_bank" ("category", "status");

CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_career_status"
  ON "flashcard_bank" ("career_type", "status");

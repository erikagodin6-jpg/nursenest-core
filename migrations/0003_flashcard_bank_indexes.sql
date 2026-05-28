-- flashcard_bank performance indexes
-- Derived from observed query patterns in server/routes.ts, server/adaptive-engine.ts,
-- server/content-integrity-audit.ts, and server/access-delivery-orchestrator.ts.
-- Every index uses CREATE INDEX IF NOT EXISTS — safe to re-run.

-- Most common hot path: status filter alone (published count checks, admin reviews, needs_review)
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_status"
  ON flashcard_bank USING btree (status);

-- Covers tier+status learner queries:
--   WHERE tier = $1 AND status = 'published'
--   WHERE fb.status='published' AND fb.tier = ANY($2::text[])
--   GROUP BY tier, status
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_tier_status"
  ON flashcard_bank USING btree (tier, status);

-- Covers career_type+status filter:
--   WHERE career_type = $1 AND status = 'published'
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_career_type_status"
  ON flashcard_bank USING btree (career_type, status);

-- Covers source_type+flashcard_enabled counts endpoint and CAT pool queries:
--   WHERE source_type = 'cat_exam' AND flashcard_enabled = true
--   WHERE status = 'published' AND flashcard_enabled = true AND source_type = 'cat_exam'
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_source_type_flashcard_enabled"
  ON flashcard_bank USING btree (source_type, flashcard_enabled);

-- Covers status+flashcard_enabled filter variant:
--   WHERE status = 'published' AND flashcard_enabled = true
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_status_flashcard_enabled"
  ON flashcard_bank USING btree (status, flashcard_enabled);

-- Covers EXISTS subquery during exam_question → flashcard conversion:
--   EXISTS(SELECT 1 FROM flashcard_bank fb WHERE fb.source_question_id = eq.id)
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_source_question_id"
  ON flashcard_bank USING btree (source_question_id);

-- Covers topic-based JOINs and WHERE filters used in adaptive-engine LEFT JOIN pool queries
CREATE INDEX IF NOT EXISTS "idx_flashcard_bank_topic"
  ON flashcard_bank USING btree (topic);

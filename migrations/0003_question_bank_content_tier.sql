-- Nursing entitlement tier for question_bank rows (rpn | rn | np). Nullable until backfilled; learners must not see NULL after rollout.
ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS content_tier text;

COMMENT ON COLUMN question_bank.content_tier IS 'Nursing content ladder: rpn, rn, np (lowercase). Required for learner access after backfill.';

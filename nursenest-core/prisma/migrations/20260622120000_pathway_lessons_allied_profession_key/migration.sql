-- Ensure production pathway lesson rows have the allied profession discriminator
-- required by allied learner/marketing audits. Idempotent because some DBs may
-- have received this column manually during drift recovery.
ALTER TABLE "pathway_lessons"
  ADD COLUMN IF NOT EXISTS "allied_profession_key" VARCHAR(64);

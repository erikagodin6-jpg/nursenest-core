-- Idempotent repair for databases where application code expects `structural_public_complete`
-- but the column was never applied (e.g. skipped migrate deploy). Safe when the column already exists.
ALTER TABLE "pathway_lessons" ADD COLUMN IF NOT EXISTS "structural_public_complete" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "pathway_lessons_structural_public_complete_idx" ON "pathway_lessons" ("structural_public_complete");

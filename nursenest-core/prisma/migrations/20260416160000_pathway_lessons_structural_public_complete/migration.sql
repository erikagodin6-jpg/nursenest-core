-- Denormalized structural gate for learner list queries (avoids loading large `sections` JSON).
ALTER TABLE "pathway_lessons" ADD COLUMN "structural_public_complete" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "pathway_lessons_structural_public_complete_idx" ON "pathway_lessons" ("structural_public_complete");

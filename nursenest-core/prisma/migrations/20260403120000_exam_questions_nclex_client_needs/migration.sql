-- NCLEX client-needs blueprint tags for CAT balancing and diagnostics
ALTER TABLE "exam_questions" ADD COLUMN IF NOT EXISTS "nclex_client_needs_category" VARCHAR(64);
ALTER TABLE "exam_questions" ADD COLUMN IF NOT EXISTS "nclex_client_needs_subcategory" VARCHAR(128);

-- Staged marketing copy (admin) + optional publish timestamp.
ALTER TABLE "marketing_public_content_overrides" ADD COLUMN IF NOT EXISTS "draft_value" TEXT;
ALTER TABLE "marketing_public_content_overrides" ADD COLUMN IF NOT EXISTS "published_at" TIMESTAMP(3);

UPDATE "marketing_public_content_overrides"
SET "published_at" = "updated_at"
WHERE "is_published" = true AND "published_at" IS NULL;

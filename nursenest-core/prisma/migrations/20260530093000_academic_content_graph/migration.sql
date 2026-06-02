-- Promote CanonicalTopic into the master academic content graph.
-- This migration is additive: no existing educational content rows are rewritten.

ALTER TABLE "canonical_topics"
  ADD COLUMN IF NOT EXISTS "metadata" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "learning_objectives" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "profession_mappings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "exam_mappings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "difficulty_mappings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "system_mappings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "prerequisite_topic_keys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "related_topic_keys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "weak_area_topic_keys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE IF NOT EXISTS "academic_content_asset_links" (
  "id" TEXT NOT NULL,
  "canonical_topic_id" TEXT NOT NULL,
  "asset_type" VARCHAR(64) NOT NULL,
  "asset_id" VARCHAR(128) NOT NULL,
  "relationship" VARCHAR(40) NOT NULL DEFAULT 'primary',
  "source" VARCHAR(80) NOT NULL DEFAULT 'migration',
  "confidence" DOUBLE PRECISION,
  "evidence" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "academic_content_asset_links_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "academic_content_asset_links_topic_fk"
    FOREIGN KEY ("canonical_topic_id") REFERENCES "canonical_topics"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "academic_content_asset_links_asset_relationship_key"
  ON "academic_content_asset_links"("asset_type", "asset_id", "relationship");

CREATE INDEX IF NOT EXISTS "academic_content_asset_links_topic_asset_idx"
  ON "academic_content_asset_links"("canonical_topic_id", "asset_type");

CREATE INDEX IF NOT EXISTS "academic_content_asset_links_asset_idx"
  ON "academic_content_asset_links"("asset_type", "asset_id");

CREATE OR REPLACE FUNCTION set_academic_content_asset_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "academic_content_asset_links_updated_at" ON "academic_content_asset_links";
CREATE TRIGGER "academic_content_asset_links_updated_at"
BEFORE UPDATE ON "academic_content_asset_links"
FOR EACH ROW
EXECUTE FUNCTION set_academic_content_asset_links_updated_at();

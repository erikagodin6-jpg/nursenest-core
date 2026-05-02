-- OSCE governance: publish flag + traceable metadata (read path filters on is_published).
ALTER TABLE "osce_stations" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "osce_stations" ADD COLUMN IF NOT EXISTS "is_published" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "osce_stations" ADD COLUMN IF NOT EXISTS "domain" TEXT;
ALTER TABLE "osce_stations" ADD COLUMN IF NOT EXISTS "role_track" TEXT;
ALTER TABLE "osce_stations" ADD COLUMN IF NOT EXISTS "source_legacy_path" TEXT;

CREATE INDEX IF NOT EXISTS "osce_stations_is_published_idx" ON "osce_stations"("is_published");

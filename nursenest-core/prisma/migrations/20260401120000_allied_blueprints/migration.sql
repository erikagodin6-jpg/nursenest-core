-- CreateTable: allied_blueprints (legacy monolith / Replit import; aligns with shared/schema.ts alliedBlueprints)
CREATE TABLE IF NOT EXISTS "allied_blueprints" (
    "id" VARCHAR NOT NULL DEFAULT gen_random_uuid(),
    "career_type" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "domains" JSONB NOT NULL,
    "difficulty_distribution" JSONB NOT NULL,
    "cognitive_distribution" JSONB NOT NULL,
    "allowed_question_types" JSONB NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allied_blueprints_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "allied_blueprints_career_type_is_active_idx" ON "allied_blueprints"("career_type", "is_active");

CREATE INDEX IF NOT EXISTS "allied_blueprints_career_type_version_idx" ON "allied_blueprints"("career_type", "version");

-- Idempotent safety net: ensures flashcard deck stack + allied_blueprints exist without dropping data.
-- Safe when a prior migration (e.g. P3009) left the chain stuck so 20260331180000 / 20260401120000 never ran,
-- or when those migrations already applied (this migration no-ops).

DO $flashvis$ BEGIN
  CREATE TYPE "FlashcardDeckVisibility" AS ENUM ('PUBLIC_PREVIEW', 'SUBSCRIBER', 'HIDDEN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $flashvis$;

CREATE TABLE IF NOT EXISTS "flashcard_decks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "country" "CountryCode" NOT NULL,
    "tier" "TierCode" NOT NULL,
    "examFamily" "ExamFamily" NOT NULL DEFAULT 'GENERIC',
    "pathway_id" TEXT,
    "visibility" "FlashcardDeckVisibility" NOT NULL DEFAULT 'SUBSCRIBER',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "card_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "flashcard_decks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "flashcard_tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "flashcard_tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "flashcard_deck_tags" (
    "deck_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    CONSTRAINT "flashcard_deck_tags_pkey" PRIMARY KEY ("deck_id","tag_id")
);

CREATE TABLE IF NOT EXISTS "flashcard_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "flashcard_id" TEXT NOT NULL,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval_days" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "next_review_at" TIMESTAMP(3),
    "last_quality" INTEGER,
    "last_reviewed_at" TIMESTAMP(3),
    CONSTRAINT "flashcard_progress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "flashcard_study_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "queue_ids" JSONB NOT NULL,
    "cursor" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "flashcard_study_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "flashcard_user_stats" (
    "user_id" TEXT NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_study_date" TIMESTAMP(3),
    "cards_reviewed_total" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "flashcard_user_stats_pkey" PRIMARY KEY ("user_id")
);

ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "deck_id" TEXT;
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "position_in_deck" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS "flashcard_decks_slug_key" ON "flashcard_decks"("slug");
CREATE INDEX IF NOT EXISTS "flashcard_decks_status_visibility_country_idx" ON "flashcard_decks"("status", "visibility", "country");
CREATE INDEX IF NOT EXISTS "flashcard_decks_status_examFamily_idx" ON "flashcard_decks"("status", "examFamily");
CREATE UNIQUE INDEX IF NOT EXISTS "flashcard_tags_slug_key" ON "flashcard_tags"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "flashcard_progress_user_id_flashcard_id_key" ON "flashcard_progress"("user_id", "flashcard_id");
CREATE INDEX IF NOT EXISTS "flashcard_progress_user_id_next_review_at_idx" ON "flashcard_progress"("user_id", "next_review_at");
CREATE INDEX IF NOT EXISTS "flashcard_progress_flashcard_id_idx" ON "flashcard_progress"("flashcard_id");
CREATE UNIQUE INDEX IF NOT EXISTS "flashcard_study_sessions_user_id_deck_id_key" ON "flashcard_study_sessions"("user_id", "deck_id");
CREATE INDEX IF NOT EXISTS "flashcard_study_sessions_user_id_idx" ON "flashcard_study_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "Flashcard_deck_id_position_in_deck_idx" ON "Flashcard"("deck_id", "position_in_deck");
CREATE INDEX IF NOT EXISTS "Flashcard_deck_id_status_idx" ON "Flashcard"("deck_id", "status");

DO $fk_deck_tags_deck$ BEGIN
  ALTER TABLE "flashcard_deck_tags" ADD CONSTRAINT "flashcard_deck_tags_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_deck_tags_deck$;

DO $fk_deck_tags_tag$ BEGIN
  ALTER TABLE "flashcard_deck_tags" ADD CONSTRAINT "flashcard_deck_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "flashcard_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_deck_tags_tag$;

DO $fk_flashcard_deck$ BEGIN
  ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_flashcard_deck$;

DO $fk_prog_user$ BEGIN
  ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_prog_user$;

DO $fk_prog_fc$ BEGIN
  ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_prog_fc$;

DO $fk_sess_user$ BEGIN
  ALTER TABLE "flashcard_study_sessions" ADD CONSTRAINT "flashcard_study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_sess_user$;

DO $fk_sess_deck$ BEGIN
  ALTER TABLE "flashcard_study_sessions" ADD CONSTRAINT "flashcard_study_sessions_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_sess_deck$;

DO $fk_stats_user$ BEGIN
  ALTER TABLE "flashcard_user_stats" ADD CONSTRAINT "flashcard_user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $fk_stats_user$;

CREATE TABLE IF NOT EXISTS "allied_blueprints" (
    "id" VARCHAR NOT NULL,
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

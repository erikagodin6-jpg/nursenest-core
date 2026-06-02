-- =============================================================================
-- NurseNest production DB recovery (DigitalOcean / psql / query console)
-- =============================================================================
-- Context: Prisma P3009 on migration `20260327120000_conversion_onboarding_allied_freemium`
--          and/or missing `flashcard_decks` + allied blueprint storage.
--
-- Rules: NO DROP, NO TRUNCATE. Statements are idempotent where possible.
--
-- RECOMMENDED PATH (keeps migration history authoritative):
--   1) Run SECTION A below in the DO SQL console.
--   2) From `nursenest-core/` with DATABASE_URL pointing at production:
--        npx prisma migrate resolve --applied 20260327120000_conversion_onboarding_allied_freemium
--   3) Deploy remaining migrations:
--        npx prisma migrate deploy
--      This creates `Flashcard`, `flashcard_decks`, `Flashcard` deck columns, `allied_blueprints`
--      (via `20260327140000` … `20260401120000_allied_blueprints`) in order.
--
-- FALLBACK: If step 3 cannot run (no CLI access), run SECTION B after SECTION A, then run
--   `prisma migrate resolve --applied` for EVERY migration whose DDL you executed manually
--   (at minimum `20260331180000_flashcard_decks_progress`), then `migrate deploy` for the rest.
--
-- NOTE: `deck_flashcards.json` in imports maps to Prisma model `Flashcard` (table `"Flashcard"`),
--       not a table named `deck_flashcards`.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION A — Complete failed migration 20260327120000 (safe re-run)
-- -----------------------------------------------------------------------------

-- TierCode.ALLIED (PostgreSQL: duplicate value → duplicate_object)
DO $tiercode_allied$ BEGIN
  ALTER TYPE "TierCode" ADD VALUE 'ALLIED';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $tiercode_allied$;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "examFocus" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "studyGoal" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dailyStudyMinutes" INTEGER;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "learnerPath" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingCompletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "freeQuestionViews" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "freeLessonOpens" INTEGER NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- SECTION B — OPTIONAL: flashcard deck stack (only if `migrate deploy` is blocked)
-- Requires: `"Flashcard"` table + enums `CountryCode`, `TierCode`, `ExamFamily`, `ContentStatus`, `User`.
-- After running, mark `20260331180000_flashcard_decks_progress` as applied before deploy.
-- -----------------------------------------------------------------------------

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

-- `allied_blueprints` is created by Prisma migration `20260401120000_allied_blueprints`
-- (run `npx prisma migrate deploy` after resolving earlier failures — do not duplicate here).

-- -----------------------------------------------------------------------------
-- Verification (read-only)
-- -----------------------------------------------------------------------------
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN
--   ('flashcard_decks', 'allied_blueprints');
-- SELECT typname, enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'TierCode';

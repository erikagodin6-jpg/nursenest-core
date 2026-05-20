-- Verified study cards (NurseNest-governed learner decks; not auto-published).
DO $$ BEGIN CREATE TYPE "VerifiedStudyDeckVisibility" AS ENUM ('PRIVATE', 'SHARED', 'PUBLIC', 'UNLISTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "VerifiedStudyVerificationStatus" AS ENUM ('UNVERIFIED', 'AI_GENERATED', 'VERIFIED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "VerifiedStudyModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "VerifiedStudySourceType" AS ENUM ('EXAM_BANK', 'LESSON', 'USER_CREATED', 'AI_GENERATED', 'LEGACY_IMPORT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "VerifiedStudyDeckSharePermission" AS ENUM ('VIEW', 'EDIT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "VerifiedStudyDeckReportStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "verified_study_decks" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(2000),
    "pathway_id" VARCHAR(64) NOT NULL,
    "profession_key" VARCHAR(64),
    "canonical_category_id" VARCHAR(64),
    "visibility" "VerifiedStudyDeckVisibility" NOT NULL DEFAULT 'PRIVATE',
    "verification_status" "VerifiedStudyVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "moderation_status" "VerifiedStudyModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "source_type" "VerifiedStudySourceType" NOT NULL DEFAULT 'USER_CREATED',
    "nurse_nest_verified" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "unlisted_slug" VARCHAR(48),
    "legacy_import_batch" VARCHAR(80),
    "duplicate_of_deck_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verified_study_decks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "verified_study_deck_shares" (
    "id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "target_user_id" TEXT,
    "target_email" VARCHAR(320),
    "permission" "VerifiedStudyDeckSharePermission" NOT NULL DEFAULT 'VIEW',
    "invited_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verified_study_deck_shares_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "verified_study_cards" (
    "id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "prompt_front" TEXT NOT NULL,
    "answer_back" TEXT NOT NULL,
    "rationale" TEXT,
    "clinical_pearl" TEXT,
    "canonical_category_id" VARCHAR(64),
    "related_lesson_slug" VARCHAR(200),
    "related_exam_question_id" VARCHAR(64),
    "references_json" JSONB NOT NULL DEFAULT '[]',
    "verification_status" "VerifiedStudyVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "last_verified_at" TIMESTAMP(3),
    "ai_rejected_reason" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verified_study_cards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "verified_study_card_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "viewed_count" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "incorrect_count" INTEGER NOT NULL DEFAULT 0,
    "weak" BOOLEAN NOT NULL DEFAULT false,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "mastered" BOOLEAN NOT NULL DEFAULT false,
    "last_studied_at" TIMESTAMP(3),
    "confidence_rating" INTEGER,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval_days" INTEGER NOT NULL DEFAULT 0,
    "next_review_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verified_study_card_progress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "verified_study_deck_reports" (
    "id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "status" "VerifiedStudyDeckReportStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "verified_study_deck_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "verified_study_decks_unlisted_slug_key" ON "verified_study_decks"("unlisted_slug");

CREATE INDEX IF NOT EXISTS "verified_study_decks_owner_id_pathway_id_idx" ON "verified_study_decks"("owner_id", "pathway_id");
CREATE INDEX IF NOT EXISTS "verified_study_decks_pathway_id_visibility_moderation_status_idx" ON "verified_study_decks"("pathway_id", "visibility", "moderation_status");
CREATE INDEX IF NOT EXISTS "verified_study_decks_visibility_moderation_status_verification_status_idx" ON "verified_study_decks"("visibility", "moderation_status", "verification_status");

CREATE INDEX IF NOT EXISTS "verified_study_deck_shares_deck_id_idx" ON "verified_study_deck_shares"("deck_id");
CREATE INDEX IF NOT EXISTS "verified_study_deck_shares_target_user_id_idx" ON "verified_study_deck_shares"("target_user_id");
CREATE INDEX IF NOT EXISTS "verified_study_deck_shares_target_email_idx" ON "verified_study_deck_shares"("target_email");

CREATE INDEX IF NOT EXISTS "verified_study_cards_deck_id_position_idx" ON "verified_study_cards"("deck_id", "position");

CREATE UNIQUE INDEX IF NOT EXISTS "verified_study_card_progress_user_id_card_id_key" ON "verified_study_card_progress"("user_id", "card_id");
CREATE INDEX IF NOT EXISTS "verified_study_card_progress_user_id_last_studied_at_idx" ON "verified_study_card_progress"("user_id", "last_studied_at");
CREATE INDEX IF NOT EXISTS "verified_study_card_progress_user_id_next_review_at_idx" ON "verified_study_card_progress"("user_id", "next_review_at");

CREATE INDEX IF NOT EXISTS "verified_study_deck_reports_deck_id_status_idx" ON "verified_study_deck_reports"("deck_id", "status");
CREATE INDEX IF NOT EXISTS "verified_study_deck_reports_reporter_id_idx" ON "verified_study_deck_reports"("reporter_id");

DO $$ BEGIN
  ALTER TABLE "verified_study_decks" ADD CONSTRAINT "verified_study_decks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_decks" ADD CONSTRAINT "verified_study_decks_duplicate_of_deck_id_fkey" FOREIGN KEY ("duplicate_of_deck_id") REFERENCES "verified_study_decks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_deck_shares" ADD CONSTRAINT "verified_study_deck_shares_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "verified_study_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_deck_shares" ADD CONSTRAINT "verified_study_deck_shares_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_deck_shares" ADD CONSTRAINT "verified_study_deck_shares_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_cards" ADD CONSTRAINT "verified_study_cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "verified_study_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_card_progress" ADD CONSTRAINT "verified_study_card_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_card_progress" ADD CONSTRAINT "verified_study_card_progress_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "verified_study_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_deck_reports" ADD CONSTRAINT "verified_study_deck_reports_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "verified_study_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "verified_study_deck_reports" ADD CONSTRAINT "verified_study_deck_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

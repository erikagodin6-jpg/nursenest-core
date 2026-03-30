-- CreateEnum
CREATE TYPE "FlashcardDeckVisibility" AS ENUM ('PUBLIC_PREVIEW', 'SUBSCRIBER', 'HIDDEN');

-- CreateTable
CREATE TABLE "flashcard_decks" (
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

-- CreateTable
CREATE TABLE "flashcard_tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_deck_tags" (
    "deck_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "flashcard_deck_tags_pkey" PRIMARY KEY ("deck_id","tag_id")
);

-- CreateTable
CREATE TABLE "flashcard_progress" (
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

-- CreateTable
CREATE TABLE "flashcard_study_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "queue_ids" JSONB NOT NULL,
    "cursor" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashcard_study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_user_stats" (
    "user_id" TEXT NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_study_date" TIMESTAMP(3),
    "cards_reviewed_total" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashcard_user_stats_pkey" PRIMARY KEY ("user_id")
);

-- AlterTable Flashcard
ALTER TABLE "Flashcard" ADD COLUMN "deck_id" TEXT;
ALTER TABLE "Flashcard" ADD COLUMN "position_in_deck" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_decks_slug_key" ON "flashcard_decks"("slug");

-- CreateIndex
CREATE INDEX "flashcard_decks_status_visibility_country_idx" ON "flashcard_decks"("status", "visibility", "country");

-- CreateIndex
CREATE INDEX "flashcard_decks_status_examFamily_idx" ON "flashcard_decks"("status", "examFamily");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_tags_slug_key" ON "flashcard_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_progress_user_id_flashcard_id_key" ON "flashcard_progress"("user_id", "flashcard_id");

-- CreateIndex
CREATE INDEX "flashcard_progress_user_id_next_review_at_idx" ON "flashcard_progress"("user_id", "next_review_at");

-- CreateIndex
CREATE INDEX "flashcard_progress_flashcard_id_idx" ON "flashcard_progress"("flashcard_id");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_study_sessions_user_id_deck_id_key" ON "flashcard_study_sessions"("user_id", "deck_id");

-- CreateIndex
CREATE INDEX "flashcard_study_sessions_user_id_idx" ON "flashcard_study_sessions"("user_id");

-- CreateIndex
CREATE INDEX "Flashcard_deck_id_position_in_deck_idx" ON "Flashcard"("deck_id", "position_in_deck");

-- CreateIndex
CREATE INDEX "Flashcard_deck_id_status_idx" ON "Flashcard"("deck_id", "status");

-- AddForeignKey
ALTER TABLE "flashcard_deck_tags" ADD CONSTRAINT "flashcard_deck_tags_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_deck_tags" ADD CONSTRAINT "flashcard_deck_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "flashcard_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_study_sessions" ADD CONSTRAINT "flashcard_study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_study_sessions" ADD CONSTRAINT "flashcard_study_sessions_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_user_stats" ADD CONSTRAINT "flashcard_user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

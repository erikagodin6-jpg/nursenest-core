-- CreateEnum
CREATE TYPE "FlashcardSessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "flashcard_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "status" "FlashcardSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "card_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "flashcard_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_attempts" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "flashcard_id" TEXT NOT NULL,
    "selected_key" VARCHAR(8),
    "is_correct" BOOLEAN,
    "guessed" BOOLEAN NOT NULL DEFAULT false,
    "confidence" INTEGER,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_mastery" (
    "user_id" TEXT NOT NULL,
    "flashcard_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashcard_mastery_pkey" PRIMARY KEY ("user_id","flashcard_id")
);

-- CreateIndex
CREATE INDEX "flashcard_sessions_user_id_status_idx" ON "flashcard_sessions"("user_id", "status");

-- CreateIndex
CREATE INDEX "flashcard_sessions_user_id_deck_id_idx" ON "flashcard_sessions"("user_id", "deck_id");

-- CreateIndex
CREATE INDEX "flashcard_attempts_session_id_idx" ON "flashcard_attempts"("session_id");

-- CreateIndex
CREATE INDEX "flashcard_attempts_user_id_flashcard_id_idx" ON "flashcard_attempts"("user_id", "flashcard_id");

-- CreateIndex
CREATE INDEX "flashcard_mastery_user_id_level_idx" ON "flashcard_mastery"("user_id", "level");

-- AddForeignKey
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_attempts" ADD CONSTRAINT "flashcard_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "flashcard_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_mastery" ADD CONSTRAINT "flashcard_mastery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

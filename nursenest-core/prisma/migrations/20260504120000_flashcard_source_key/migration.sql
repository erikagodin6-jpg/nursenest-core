-- AddColumn Flashcard.sourceKey
-- Stable deduplication key for pipeline-generated flashcards.
-- Format: "{sourceType}:{sourceId}" — e.g. "exam_q:abc123"
-- Null for manually authored cards. Unique so sync scripts can upsert without duplicating.

ALTER TABLE "Flashcard" ADD COLUMN "source_key" TEXT;
CREATE UNIQUE INDEX "flashcards_source_key_key" ON "Flashcard"("source_key");

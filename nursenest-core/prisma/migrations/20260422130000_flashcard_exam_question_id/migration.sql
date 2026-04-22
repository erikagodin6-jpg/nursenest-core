-- Optional link from flashcards to canonical exam_questions (consolidation path).
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "exam_question_id" VARCHAR(64);
CREATE INDEX IF NOT EXISTS "flashcards_exam_question_id_idx" ON "Flashcard"("exam_question_id");

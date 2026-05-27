-- Add progressive hints support to flashcard_bank
-- Mirrors the hints column added to exam_questions in migration 0005
ALTER TABLE flashcard_bank
  ADD COLUMN IF NOT EXISTS hints jsonb DEFAULT NULL;

COMMENT ON COLUMN flashcard_bank.hints IS 'Progressive learning hints: array of {level:1|2|3, text:string}. Transferred from exam_questions on conversion.';

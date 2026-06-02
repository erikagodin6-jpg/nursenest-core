-- Exam-style micro-question fields for flashcards (optional; legacy rows stay null).

CREATE TYPE "FlashcardItemKind" AS ENUM ('RECALL', 'CLINICAL', 'PRIORITY', 'CONCEPT');

ALTER TABLE "Flashcard"
ADD COLUMN "exam_item_kind" "FlashcardItemKind",
ADD COLUMN "question_stem" TEXT,
ADD COLUMN "answer_options" JSONB,
ADD COLUMN "correct_answer" TEXT,
ADD COLUMN "rationale_correct" TEXT,
ADD COLUMN "rationale_incorrect" JSONB;

-- Example UPDATE for a dev row (replace :id with a real flashcard id):
-- UPDATE "Flashcard" SET
--   "exam_item_kind" = 'CLINICAL',
--   "question_stem" = 'A nurse is caring for a client receiving IV potassium chloride. Which action should the nurse take first if the client reports burning at the IV site?',
--   "answer_options" = '[{"letter":"A","text":"Slow the infusion rate"},{"letter":"B","text":"Stop the infusion and assess the site"},{"letter":"C","text":"Apply a warm compress and continue"},{"letter":"D","text":"Flush the line with normal saline"}]'::jsonb,
--   "correct_answer" = 'B',
--   "rationale_correct" = 'Infiltration or phlebitis can cause tissue injury; stopping the infusion and assessing the site is the priority safety action before any other intervention.',
--   "rationale_incorrect" = '[{"letter":"A","rationale":"Slowing the rate does not address possible extravasation or phlebitis and delays removal of the irritant."},{"letter":"C","rationale":"Warm compresses do not replace assessment and may mask worsening tissue injury if the medication is still infusing."},{"letter":"D","rationale":"Flushing can worsen tissue exposure if infiltration is present; the line should not be flushed before assessment."}]'::jsonb,
--   "front" = "question_stem",
--   "back" = 'Correct: B) Stop the infusion and assess the site'
-- WHERE id = ':id';

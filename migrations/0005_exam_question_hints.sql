-- Progressive hints support for exam_questions
-- Stores up to 3 hints per question as a JSON array: [{level:1,text:""},{level:2,text:""},{level:3,text:""}]
ALTER TABLE exam_questions
  ADD COLUMN IF NOT EXISTS hints jsonb DEFAULT NULL;

COMMENT ON COLUMN exam_questions.hints IS 'Progressive learning hints: array of {level:1|2|3, text:string}. Level 1=broad, Level 2=clinical, Level 3=near-answer.';

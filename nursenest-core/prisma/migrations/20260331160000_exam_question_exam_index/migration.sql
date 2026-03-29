-- Speeds pathway / exam-key filters on the question bank (`exam IN (...)`).
CREATE INDEX IF NOT EXISTS "exam_questions_exam_idx" ON "exam_questions" ("exam");

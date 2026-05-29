-- Question quality analytics response-time instrumentation.
-- Keeps existing aggregates intact while allowing average response time to be
-- computed without scanning learner attempt rows.

ALTER TABLE "exam_question_practice_answer_attempts"
ADD COLUMN IF NOT EXISTS "response_time_ms" INTEGER;

ALTER TABLE "exam_question_performance_aggregates"
ADD COLUMN IF NOT EXISTS "response_time_total_ms" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "response_time_samples" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "exam_question_practice_attempts_question_response_time_idx"
ON "exam_question_practice_answer_attempts" ("question_id", "response_time_ms");

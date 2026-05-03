-- Aggregate peer performance for practice questions (no identities in API responses).

CREATE TYPE "PracticeQuestionAnswerMode" AS ENUM ('practice', 'cat', 'quiz', 'remediation');

CREATE TABLE "exam_question_practice_answer_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" VARCHAR NOT NULL,
    "selected_option_key" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "mode" "PracticeQuestionAnswerMode" NOT NULL DEFAULT 'practice',
    "pathway_id" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_question_practice_answer_attempts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "exam_question_answer_option_aggregates" (
    "question_id" VARCHAR NOT NULL,
    "option_key" TEXT NOT NULL,
    "selection_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_question_answer_option_aggregates_pkey" PRIMARY KEY ("question_id","option_key")
);

CREATE TABLE "exam_question_performance_aggregates" (
    "question_id" VARCHAR NOT NULL,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "correct_attempts" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_question_performance_aggregates_pkey" PRIMARY KEY ("question_id")
);

CREATE INDEX "exam_question_practice_answer_attempts_question_id_created_at_idx" ON "exam_question_practice_answer_attempts"("question_id", "created_at");

CREATE INDEX "exam_question_practice_answer_attempts_user_id_question_id_idx" ON "exam_question_practice_answer_attempts"("user_id", "question_id");

ALTER TABLE "exam_question_practice_answer_attempts" ADD CONSTRAINT "exam_question_practice_answer_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exam_question_practice_answer_attempts" ADD CONSTRAINT "exam_question_practice_answer_attempts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exam_question_answer_option_aggregates" ADD CONSTRAINT "exam_question_answer_option_aggregates_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exam_question_performance_aggregates" ADD CONSTRAINT "exam_question_performance_aggregates_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

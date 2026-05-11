ALTER TABLE "exam_questions"
  ADD COLUMN "ecg_level" VARCHAR(16),
  ADD COLUMN "ecg_mode" VARCHAR(16);

CREATE INDEX "exam_questions_question_format_ecg_level_ecg_mode_idx"
  ON "exam_questions"("question_format", "ecg_level", "ecg_mode");

CREATE TABLE "ecg_worksheets" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "pdf_url" TEXT NOT NULL,
  "thumbnail_url" TEXT,
  "level" TEXT NOT NULL,
  "tags" TEXT[],
  "is_premium" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ecg_worksheets_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ecg_worksheets_level_idx" ON "ecg_worksheets"("level");

CREATE TABLE "ecg_video_questions" (
  "id" TEXT NOT NULL,
  "video_url" TEXT NOT NULL,
  "thumbnail_url" TEXT,
  "duration_seconds" INTEGER,
  "question_text" TEXT NOT NULL,
  "answer_options" JSONB NOT NULL DEFAULT '[]',
  "correct_answer_id" VARCHAR(64) NOT NULL,
  "rationale" TEXT NOT NULL,
  "difficulty" VARCHAR(16) NOT NULL,
  "rhythm_tag" VARCHAR(64) NOT NULL,
  "clinical_priority" VARCHAR(64),
  "allowed_tiers" TEXT[] NOT NULL,
  "is_premium" BOOLEAN NOT NULL DEFAULT true,
  "level" VARCHAR(16) NOT NULL,
  "mode" VARCHAR(16) NOT NULL,
  "clinician_reviewed_at" TIMESTAMP(3),
  "clinician_reviewed_by" TEXT,
  "waveform_fidelity" VARCHAR(40) NOT NULL DEFAULT 'educational_simplified',
  "qa_status" VARCHAR(32) NOT NULL DEFAULT 'pending',
  "publish_safety_status" VARCHAR(32) NOT NULL DEFAULT 'internal_only',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ecg_video_questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ecg_video_questions_level_mode_idx" ON "ecg_video_questions"("level", "mode");
CREATE INDEX "ecg_video_questions_rhythm_tag_idx" ON "ecg_video_questions"("rhythm_tag");
CREATE INDEX "ecg_video_questions_qa_status_idx" ON "ecg_video_questions"("qa_status");
CREATE INDEX "ecg_video_questions_publish_safety_status_idx" ON "ecg_video_questions"("publish_safety_status");

CREATE TABLE "ecg_video_question_practice_answer_attempts" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "question_id" TEXT NOT NULL,
  "selected_option_id" TEXT NOT NULL,
  "is_correct" BOOLEAN NOT NULL,
  "mode" "PracticeQuestionAnswerMode" NOT NULL DEFAULT 'practice',
  "pathway_id" VARCHAR(64),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ecg_video_question_practice_answer_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ecg_video_question_practice_answer_attempts_question_id_created_at_idx"
  ON "ecg_video_question_practice_answer_attempts"("question_id", "created_at");
CREATE INDEX "ecg_video_question_practice_answer_attempts_user_id_question_id_idx"
  ON "ecg_video_question_practice_answer_attempts"("user_id", "question_id");

CREATE TABLE "ecg_video_question_answer_option_aggregates" (
  "question_id" TEXT NOT NULL,
  "option_id" TEXT NOT NULL,
  "selection_count" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ecg_video_question_answer_option_aggregates_pkey" PRIMARY KEY ("question_id", "option_id")
);

CREATE TABLE "ecg_video_question_performance_aggregates" (
  "question_id" TEXT NOT NULL,
  "total_attempts" INTEGER NOT NULL DEFAULT 0,
  "correct_attempts" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ecg_video_question_performance_aggregates_pkey" PRIMARY KEY ("question_id")
);

ALTER TABLE "ecg_video_question_practice_answer_attempts"
  ADD CONSTRAINT "ecg_video_question_practice_answer_attempts_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ecg_video_question_practice_answer_attempts"
  ADD CONSTRAINT "ecg_video_question_practice_answer_attempts_question_id_fkey"
  FOREIGN KEY ("question_id") REFERENCES "ecg_video_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ecg_video_question_answer_option_aggregates"
  ADD CONSTRAINT "ecg_video_question_answer_option_aggregates_question_id_fkey"
  FOREIGN KEY ("question_id") REFERENCES "ecg_video_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ecg_video_question_performance_aggregates"
  ADD CONSTRAINT "ecg_video_question_performance_aggregates_question_id_fkey"
  FOREIGN KEY ("question_id") REFERENCES "ecg_video_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

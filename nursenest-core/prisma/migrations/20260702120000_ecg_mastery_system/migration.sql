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

ALTER TABLE "ecg_video_questions"
  ADD COLUMN IF NOT EXISTS "media_type" VARCHAR(32) NOT NULL DEFAULT 'video_url',
  ADD COLUMN IF NOT EXISTS "media_config" JSONB,
  ADD COLUMN IF NOT EXISTS "topic_tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "lesson_link_count" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "medical_qa_status" VARCHAR(32) NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "manual_reviewed_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "manual_reviewed_by" TEXT;

CREATE INDEX IF NOT EXISTS "ecg_video_questions_media_type_idx" ON "ecg_video_questions"("media_type");
CREATE INDEX IF NOT EXISTS "ecg_video_questions_medical_qa_status_idx" ON "ecg_video_questions"("medical_qa_status");

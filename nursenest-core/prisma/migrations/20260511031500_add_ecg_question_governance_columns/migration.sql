DO $$
BEGIN
  IF to_regclass('public.ecg_video_questions') IS NOT NULL THEN
    ALTER TABLE "ecg_video_questions"
      ADD COLUMN IF NOT EXISTS "clinician_reviewed_at" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "clinician_reviewed_by" TEXT,
      ADD COLUMN IF NOT EXISTS "waveform_fidelity" VARCHAR(40) NOT NULL DEFAULT 'educational_simplified',
      ADD COLUMN IF NOT EXISTS "qa_status" VARCHAR(32) NOT NULL DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS "publish_safety_status" VARCHAR(32) NOT NULL DEFAULT 'internal_only';

    CREATE INDEX IF NOT EXISTS "ecg_video_questions_qa_status_idx"
      ON "ecg_video_questions"("qa_status");

    CREATE INDEX IF NOT EXISTS "ecg_video_questions_publish_safety_status_idx"
      ON "ecg_video_questions"("publish_safety_status");
  END IF;
END $$;

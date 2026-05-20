-- CAT: adaptive exam state + mode (linear default)
ALTER TABLE "ExamSession" ADD COLUMN IF NOT EXISTS "exam_mode" TEXT NOT NULL DEFAULT 'linear';
ALTER TABLE "ExamSession" ADD COLUMN IF NOT EXISTS "adaptive_state" JSONB;

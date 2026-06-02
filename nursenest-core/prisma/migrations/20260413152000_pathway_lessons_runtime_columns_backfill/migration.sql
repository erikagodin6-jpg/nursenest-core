-- Backfill runtime columns expected by PathwayLesson model on environments
-- where schema drift left the table without newer array/json metadata fields.
ALTER TABLE "pathway_lessons"
ADD COLUMN IF NOT EXISTS "exams" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "pathway_lessons"
ADD COLUMN IF NOT EXISTS "countries" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "pathway_lessons"
ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'medium';

ALTER TABLE "pathway_lessons"
ADD COLUMN IF NOT EXISTS "exam_meta" JSONB NOT NULL DEFAULT '[]'::jsonb;

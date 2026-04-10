-- Lesson batch admin reporting: cancel timestamps for job + queue items
ALTER TABLE "AiGenerationJob" ADD COLUMN IF NOT EXISTS "lesson_batch_canceled_at" TIMESTAMP(3);

ALTER TABLE "lesson_batch_queue_item" ADD COLUMN IF NOT EXISTS "canceledAt" TIMESTAMP(3);

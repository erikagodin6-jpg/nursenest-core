-- ExamSession: timed practice + elapsed tracking for resume
ALTER TABLE "ExamSession" ADD COLUMN "timedMode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ExamSession" ADD COLUMN "timeLimitSec" INTEGER;
ALTER TABLE "ExamSession" ADD COLUMN "elapsedMs" INTEGER;

-- ExamAttempt: persisted graded review (topic performance, items, timing)
ALTER TABLE "ExamAttempt" ADD COLUMN "results" JSONB;

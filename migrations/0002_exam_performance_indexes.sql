-- Exam Performance Indexes Migration
-- Add indexes on exam_questions for common lookup patterns
CREATE INDEX IF NOT EXISTS "idx_exam_questions_tier_status" ON "exam_questions" USING btree ("tier", "status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exam_questions_tier_status_body_system" ON "exam_questions" USING btree ("tier", "status", "body_system");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exam_questions_tier_status_region_scope" ON "exam_questions" USING btree ("tier", "status", "region_scope");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exam_questions_career_type_status" ON "exam_questions" USING btree ("career_type", "status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exam_questions_difficulty" ON "exam_questions" USING btree ("difficulty");--> statement-breakpoint

-- Add indexes on mock_exam_attempts for user lookups
CREATE INDEX IF NOT EXISTS "idx_mock_exam_attempts_user_status" ON "mock_exam_attempts" USING btree ("user_id", "status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mock_exam_attempts_user_started" ON "mock_exam_attempts" USING btree ("user_id", "started_at" DESC);

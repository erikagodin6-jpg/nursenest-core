-- Supports topic/category-scoped queries filtered by exam and publish status.
CREATE INDEX "exam_questions_status_exam_topic_idx" ON "exam_questions" ("status", "exam", "topic");

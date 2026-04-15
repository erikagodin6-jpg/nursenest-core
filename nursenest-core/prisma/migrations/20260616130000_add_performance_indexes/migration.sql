-- Hot-path read performance: subscriptions, users, content_items lesson lists, exam_questions filters, flashcard deck discovery.
-- See prisma/schema.prisma models Subscription, User, ContentItem, ExamQuestion, FlashcardDeck.

CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

CREATE INDEX IF NOT EXISTS "User_tier_idx" ON "User"("tier");

CREATE INDEX IF NOT EXISTS "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

CREATE INDEX IF NOT EXISTS "Subscription_status_currentPeriodEnd_idx" ON "Subscription"("status", "currentPeriodEnd");

CREATE INDEX IF NOT EXISTS "content_items_status_published_at_idx" ON "content_items"("status", "published_at" DESC);

CREATE INDEX IF NOT EXISTS "exam_questions_topic_idx" ON "exam_questions"("topic");

CREATE INDEX IF NOT EXISTS "exam_questions_difficulty_idx" ON "exam_questions"("difficulty");

CREATE INDEX IF NOT EXISTS "exam_questions_exam_topic_idx" ON "exam_questions"("exam", "topic");

CREATE INDEX IF NOT EXISTS "exam_questions_exam_difficulty_idx" ON "exam_questions"("exam", "difficulty");

CREATE INDEX IF NOT EXISTS "flashcard_decks_examFamily_pathway_id_idx" ON "flashcard_decks"("examFamily", "pathway_id");

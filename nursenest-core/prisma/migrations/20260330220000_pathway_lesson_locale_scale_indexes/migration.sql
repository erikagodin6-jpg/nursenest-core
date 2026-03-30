-- Pathway lessons: per-locale rows + list indexes (bounded queries by pathway + locale + topic).
ALTER TABLE "pathway_lessons" ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'en';

ALTER TABLE "pathway_lessons" DROP CONSTRAINT IF EXISTS "pathway_lessons_pathway_id_slug_key";

CREATE UNIQUE INDEX IF NOT EXISTS "pathway_lessons_pathway_id_slug_locale_key" ON "pathway_lessons"("pathway_id", "slug", "locale");

CREATE INDEX IF NOT EXISTS "pathway_lessons_pathway_locale_status_sort_idx" ON "pathway_lessons"("pathway_id", "locale", "status", "sort_order");

CREATE INDEX IF NOT EXISTS "pathway_lessons_pathway_topic_locale_status_idx" ON "pathway_lessons"("pathway_id", "topic_slug", "locale", "status");

-- Question bank: common entitlement list sorts / filters
CREATE INDEX IF NOT EXISTS "exam_questions_status_updated_at_idx" ON "exam_questions"("status", "updated_at");

CREATE INDEX IF NOT EXISTS "exam_questions_status_exam_tier_country_idx" ON "exam_questions"("status", "exam", "tier", "country_code");

-- App lessons (content_items): paginated subscriber lists
CREATE INDEX IF NOT EXISTS "content_items_type_status_updated_at_idx" ON "content_items"("type", "status", "updated_at");

-- Learner progress history (skip manually if `Progress` table not present in a fork DB).
CREATE INDEX IF NOT EXISTS "Progress_userId_updatedAt_idx" ON "Progress"("userId", "updatedAt");

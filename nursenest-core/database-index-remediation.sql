-- NurseNest database index remediation
-- Generated: 2026-06-01
--
-- Safe application notes:
-- - Additive indexes only. No table rewrites, drops, uniqueness changes, or data changes.
-- - Uses CONCURRENTLY to avoid long ACCESS EXCLUSIVE locks on production tables.
-- - Run outside an explicit transaction; PostgreSQL does not allow CREATE INDEX CONCURRENTLY inside one.

-- Blog discovery, public blog pages, admin queue sorting, sitemap generation.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blogpost_status_created_desc
  ON "BlogPost" ("postStatus", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blogpost_status_updated_desc
  ON "BlogPost" ("postStatus", "updatedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blogpost_legacy_status_publish
  ON "BlogPost" ("legacySource", "postStatus", "publishAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blogpost_exam_status_publish
  ON "BlogPost" ("exam", "postStatus", "publishAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blogpost_locale_status_updated
  ON "BlogPost" ("locale", "postStatus", "updatedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blogpost_tags_gin
  ON "BlogPost" USING GIN ("tags");

-- Localized blog route lookup, multilingual sitemap generation, localized admin queues.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_localized_blog_status_published
  ON "LocalizedBlogArticle" ("contentStatus", "publishedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_localized_blog_locale_status_published
  ON "LocalizedBlogArticle" ("locale", "contentStatus", "publishedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_localized_blog_prof_exam_locale_status
  ON "LocalizedBlogArticle" ("profession", "exam", "locale", "contentStatus");

-- Lesson hubs, lesson sitemap, learner dashboard continue-study queries, related lesson lookup.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pathway_lessons_status_locale_updated_public
  ON pathway_lessons (status, locale, updated_at DESC)
  WHERE deprecated_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pathway_lessons_body_system_hub
  ON pathway_lessons (pathway_id, locale, status, body_system, updated_at DESC)
  WHERE deprecated_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pathway_lessons_country_tier_status_updated
  ON pathway_lessons (country_code, tier_code, status, updated_at DESC)
  WHERE deprecated_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pathway_lessons_public_structural_sort
  ON pathway_lessons (pathway_id, locale, status, structural_public_complete, sort_order)
  WHERE deprecated_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pathway_lessons_deprecated_redirect
  ON pathway_lessons (deprecated_at, redirect_to_slug)
  WHERE deprecated_at IS NOT NULL;

-- Question bank, CAT pools, flashcard-derived question pools, public metrics and blueprint grouping.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_pool_body_system
  ON exam_questions (status, exam, tier, country_code, body_system);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_pool_adaptive
  ON exam_questions (status, exam, tier, country_code, is_adaptive_eligible);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_pool_id_order
  ON exam_questions (status, exam, tier, country_code, id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_status_question_type
  ON exam_questions (status, question_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_status_scenario
  ON exam_questions (status, is_scenario);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_flashcard_source
  ON exam_questions (status, is_flashcard_source);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_topic_subtopic
  ON exam_questions (status, topic, subtopic);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_body_topic
  ON exam_questions (status, body_system, topic);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_client_needs
  ON exam_questions (status, nclex_client_needs_category, nclex_client_needs_subcategory);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_published_at
  ON exam_questions (status, published_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examq_tags_gin
  ON exam_questions USING GIN (tags);

-- Flashcard decks and cards, including launcher counts, deck sessions, and pathway-scoped decks.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flashcard_status_tier_category_updated
  ON "Flashcard" (status, country, tier, "categoryId", "updatedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flashcard_status_exam_family
  ON "Flashcard" (status, "examFamily", country, tier);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flashcard_decks_pathway_status_sort
  ON flashcard_decks (pathway_id, status, visibility, sort_order);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flashcard_decks_exam_tier_country
  ON flashcard_decks (status, "examFamily", tier, country);

-- Practice and CAT learner session startup, profile pages, readiness dashboards.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_practice_tests_user_status_started
  ON practice_tests ("userId", status, "startedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_practice_tests_user_completed
  ON practice_tests ("userId", "completedAt" DESC)
  WHERE status = 'COMPLETED';

-- Progress and learner activity snapshots.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_progress_user_created
  ON "Progress" ("userId", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_progress_user_engaged
  ON "Progress" ("userId", "engagedAt" DESC)
  WHERE "engagedAt" IS NOT NULL;

-- Subscription and entitlement checks.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_status_period
  ON "Subscription" (status, "currentPeriodEnd" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_user_status_period
  ON "Subscription" ("userId", status, "currentPeriodEnd" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_customer_status
  ON "Subscription" ("stripeCustomerId", status);

-- User admin metrics, trial eligibility, audience segmentation.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_role_created
  ON "User" (role, "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_country_tier_created
  ON "User" (country, tier, "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_trial_status_ends
  ON "User" ("trialStatus", "trialEndsAt");

-- Content item legacy lesson/article discovery and visible lesson scope.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_items_type_status_tier_body_updated
  ON content_items (type, status, tier, body_system, updated_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_items_status_scheduled
  ON content_items (status, scheduled_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_items_tags_gin
  ON content_items USING GIN (tags);

-- Admin feedback, duplicate triage, and route diagnostics.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_feedback_status_severity_created
  ON "UserFeedbackReport" (status, severity, "createdAt" DESC);


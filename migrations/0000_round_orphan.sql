CREATE TYPE "public"."activity_event_type" AS ENUM('lesson_started', 'lesson_completed', 'quiz_started', 'quiz_completed', 'cat_started', 'cat_completed', 'cat_paused', 'cat_resumed', 'mock_started', 'mock_completed', 'test_bank_started', 'test_bank_completed', 'flashcard_reviewed', 'bookmark_added', 'bookmark_removed', 'question_answered', 'note_created', 'study_streak_updated', 'login', 'session_started');--> statement-breakpoint
CREATE TYPE "public"."cat_session_status" AS ENUM('in_progress', 'paused', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."question_history_source_type" AS ENUM('test_bank', 'cat', 'mock');--> statement-breakpoint
CREATE TYPE "public"."translation_status_enum" AS ENUM('missing', 'draft', 'machine_translated', 'human_review_needed', 'reviewed', 'approved', 'stale', 'rejected');--> statement-breakpoint
CREATE TABLE "ab_tests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"variants_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"allocation" double precision DEFAULT 0.5,
	"enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accuracy_trends" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"date" text NOT NULL,
	"questions_answered" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"accuracy" double precision DEFAULT 0,
	"study_minutes" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "adaptive_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_key" text NOT NULL,
	"weak_topic_weight" integer DEFAULT 4,
	"incorrect_history_weight" integer DEFAULT 5,
	"low_confidence_weight" integer DEFAULT 4,
	"flagged_weight" integer DEFAULT 3,
	"not_seen_weight" integer DEFAULT 2,
	"mastered_penalty" integer DEFAULT -5,
	"correct_streak_penalty" integer DEFAULT -4,
	"interval_incorrect" double precision DEFAULT 1,
	"interval_unsure" double precision DEFAULT 3,
	"interval_confident" double precision DEFAULT 10,
	"interval_mastered" double precision DEFAULT 30,
	"weak_topic_threshold" double precision DEFAULT 0.7,
	"weak_subtopic_threshold" double precision DEFAULT 0.65,
	"mastery_threshold_improving" double precision DEFAULT 0.5,
	"mastery_threshold_nearly_mastered" double precision DEFAULT 0.7,
	"mastery_threshold_mastered" double precision DEFAULT 0.85,
	"high_yield_tags" jsonb DEFAULT '[]'::jsonb,
	"blueprint_weighting" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "adaptive_config_config_key_unique" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE "admin_finance" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"label" text NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'USD',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affected_subscribers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"user_email" text,
	"username" text,
	"impact_type" text DEFAULT 'service_disruption' NOT NULL,
	"impact_duration" integer,
	"severity" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'identified' NOT NULL,
	"rescue_action_ids" text[] DEFAULT '{}'::text[],
	"suggested_actions" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_budget_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"job_id" varchar,
	"cap_type" text,
	"cap_value" double precision,
	"current_spend" double precision,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_cache" (
	"cache_key" text PRIMARY KEY NOT NULL,
	"output_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_cost_budgets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"budget_type" text NOT NULL,
	"max_tokens" integer DEFAULT 1000000,
	"max_cost_usd" double precision DEFAULT 50,
	"alert_threshold_pct" integer DEFAULT 80,
	"current_tokens" integer DEFAULT 0,
	"current_cost_usd" double precision DEFAULT 0,
	"period_start" timestamp DEFAULT now() NOT NULL,
	"period_end" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"tier" text,
	"content_type" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"progress" jsonb DEFAULT '{}'::jsonb,
	"logs" jsonb DEFAULT '[]'::jsonb,
	"model" text DEFAULT 'gpt-4o-mini',
	"model_tier" text DEFAULT 'cheapest',
	"batch_size" integer DEFAULT 25,
	"spend_cap" double precision,
	"duplicate_protection" boolean DEFAULT true,
	"dry_run" boolean DEFAULT false,
	"topic" text,
	"specialty" text,
	"framework" text,
	"current_stage" text,
	"cost_estimate" double precision DEFAULT 0,
	"actual_cost" double precision DEFAULT 0,
	"item_count" integer DEFAULT 1,
	"items_completed" integer DEFAULT 0,
	"items_failed" integer DEFAULT 0,
	"duplicates_skipped" integer DEFAULT 0,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	"paused_at" timestamp,
	"resumed_at" timestamp,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "ai_providers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"provider_type" text NOT NULL,
	"endpoint_url" text NOT NULL,
	"api_key" text,
	"models" text[] DEFAULT '{}'::text[],
	"cost_per_input_token" double precision DEFAULT 0,
	"cost_per_output_token" double precision DEFAULT 0,
	"max_concurrency" integer DEFAULT 5,
	"rate_limit" integer DEFAULT 60,
	"health_endpoint" text,
	"priority" integer DEFAULT 100,
	"enabled" boolean DEFAULT true,
	"is_healthy" boolean DEFAULT true,
	"last_health_check" timestamp,
	"consecutive_failures" integer DEFAULT 0,
	"task_types" text[] DEFAULT '{}'::text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_request_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" varchar,
	"provider_name" text,
	"model" text,
	"task_type" text,
	"feature" text,
	"input_tokens" integer DEFAULT 0,
	"output_tokens" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"estimated_cost" double precision DEFAULT 0,
	"latency_ms" integer DEFAULT 0,
	"success" boolean DEFAULT true,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_spend_tracking" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar,
	"date_key" text NOT NULL,
	"week_key" text NOT NULL,
	"token_count" integer DEFAULT 0,
	"estimated_cost_usd" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage_budget" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"month_year" text NOT NULL,
	"tokens_used" integer DEFAULT 0,
	"token_budget" integer DEFAULT 500000,
	"request_count" integer DEFAULT 0,
	"last_request_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_article_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_key" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"section_structure" jsonb DEFAULT '[]'::jsonb,
	"prompt_instructions" text,
	"default_internal_link_targets" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "allied_article_templates_template_key_unique" UNIQUE("template_key")
);
--> statement-breakpoint
CREATE TABLE "allied_automation_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"automation_id" varchar NOT NULL,
	"automation_slug" text NOT NULL,
	"status" text DEFAULT 'running',
	"items_generated" integer DEFAULT 0,
	"items_accepted" integer DEFAULT 0,
	"items_rejected" integer DEFAULT 0,
	"details" jsonb,
	"error_message" text,
	"token_cost" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "allied_automations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT false,
	"frequency" text DEFAULT 'daily',
	"max_items_per_run" integer DEFAULT 25,
	"max_runs_per_day" integer DEFAULT 1,
	"career_scope" jsonb DEFAULT '["rrt","paramedic","pharmacyTech","mlt","imaging"]'::jsonb,
	"auto_publish" boolean DEFAULT false,
	"rationale_min_words" integer DEFAULT 600,
	"strictness_level" text DEFAULT 'standard',
	"prompt_template" text,
	"config" jsonb,
	"last_run_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "allied_automations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "allied_batch_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_type" text NOT NULL,
	"blueprint_id" varchar,
	"requested_count" integer NOT NULL,
	"generated_count" integer DEFAULT 0,
	"accepted_count" integer DEFAULT 0,
	"rejected_count" integer DEFAULT 0,
	"rejection_reasons" jsonb,
	"difficulty_breakdown" jsonb,
	"cognitive_breakdown" jsonb,
	"domain_breakdown" jsonb,
	"avg_rationale_words" double precision,
	"status" text DEFAULT 'running',
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "allied_blueprints" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_type" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"domains" jsonb NOT NULL,
	"difficulty_distribution" jsonb NOT NULL,
	"cognitive_distribution" jsonb NOT NULL,
	"allowed_question_types" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_draft_assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'draft',
	"career_type" text,
	"domain" text,
	"subtopic" text,
	"title" text,
	"payload" jsonb NOT NULL,
	"validation_report" jsonb,
	"automation_run_id" varchar,
	"created_by" text DEFAULT 'automation',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_flashcards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_type" text NOT NULL,
	"question_id" varchar,
	"card_type" text NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"rationale" text,
	"clinical_pearl" text,
	"blueprint_category" text,
	"subtopic" text,
	"exam_tag" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_health_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profession_slug" text NOT NULL,
	"article_type" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"canonical_url" text,
	"primary_keyword" text,
	"secondary_keywords" text[] DEFAULT '{}'::text[],
	"content_sections" jsonb DEFAULT '[]'::jsonb,
	"faq_items" jsonb DEFAULT '[]'::jsonb,
	"internal_links" jsonb DEFAULT '[]'::jsonb,
	"schema_markup_json" jsonb,
	"breadcrumb_items" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"featured_order" integer,
	"country_scope" text DEFAULT 'ALL',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "allied_health_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "allied_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"career_type" text,
	"source" text DEFAULT 'homepage',
	"consent" boolean DEFAULT false,
	"diagnostic_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_lessons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar NOT NULL,
	"career_type" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"order_index" integer DEFAULT 0,
	"clinical_reasoning" text,
	"decision_tree" text,
	"common_mistakes" jsonb,
	"exam_trap_warning" text,
	"checkpoint_questions" jsonb,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_modules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_type" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"domain" text NOT NULL,
	"domain_weight" double precision DEFAULT 0,
	"order_index" integer DEFAULT 0,
	"learning_objectives" jsonb,
	"most_tested_concepts" jsonb,
	"red_flags" jsonb,
	"exam_traps" jsonb,
	"status" text DEFAULT 'draft',
	"is_free" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_type" text NOT NULL,
	"blueprint_id" varchar,
	"batch_id" varchar,
	"stem" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_answer" integer NOT NULL,
	"rationale_long" text NOT NULL,
	"learning_objective" text NOT NULL,
	"blueprint_category" text NOT NULL,
	"subtopic" text NOT NULL,
	"difficulty" integer NOT NULL,
	"cognitive_level" text NOT NULL,
	"question_type" text NOT NULL,
	"exam_trap" text,
	"clinical_pearls" jsonb,
	"safety_note" text,
	"distractor_rationales" jsonb,
	"is_free" boolean DEFAULT false,
	"status" text DEFAULT 'pending',
	"discrimination_index" double precision,
	"total_attempts" integer DEFAULT 0,
	"correct_attempts" integer DEFAULT 0,
	"top_group_correct" double precision,
	"bottom_group_correct" double precision,
	"flagged" boolean DEFAULT false,
	"flag_reason" text,
	"exam_tag" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allied_revision_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" varchar NOT NULL,
	"career_type" text NOT NULL,
	"reason" text NOT NULL,
	"severity" text DEFAULT 'medium',
	"status" text DEFAULT 'pending',
	"review_notes" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" text,
	"event_type" text,
	"user_id" varchar,
	"session_id" text,
	"platform" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"event_data" jsonb DEFAULT '{}'::jsonb,
	"device_info" jsonb DEFAULT '{}'::jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applynest_career_guides" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"summary" text NOT NULL,
	"content" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applynest_career_guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "applynest_career_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profession" text NOT NULL,
	"profession_label" text NOT NULL,
	"job_market_overview" text NOT NULL,
	"salary_range_json" jsonb DEFAULT '{}'::jsonb,
	"top_employers" jsonb DEFAULT '[]'::jsonb,
	"licensing_requirements" jsonb DEFAULT '[]'::jsonb,
	"resume_tips" jsonb DEFAULT '[]'::jsonb,
	"interview_questions" jsonb DEFAULT '[]'::jsonb,
	"first_job_checklist" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applynest_career_profiles_profession_unique" UNIQUE("profession")
);
--> statement-breakpoint
CREATE TABLE "applynest_interview_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"category" text NOT NULL,
	"profession" text,
	"sample_answer" text NOT NULL,
	"tips" text,
	"difficulty" text DEFAULT 'medium',
	"question_type" text DEFAULT 'behavioral',
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applynest_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"profession" text,
	"source" text DEFAULT 'applynest',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applynest_leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "applynest_resume_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"profession" text,
	"description" text NOT NULL,
	"template_content" jsonb DEFAULT '{}'::jsonb,
	"tips" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applynest_resume_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "assignment_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" varchar NOT NULL,
	"student_id" varchar NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"score" integer,
	"time_spent" integer,
	"submitted_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classroom_id" varchar NOT NULL,
	"instructor_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text DEFAULT 'lesson' NOT NULL,
	"resource_id" text,
	"due_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audio_clips" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"condition_tag" text,
	"description_short" text,
	"body_site" text,
	"audio_url_original" text,
	"audio_url_stream" text,
	"duration_seconds" integer,
	"license_type" text NOT NULL,
	"attribution_text" text,
	"source_url" text,
	"creator_name" text,
	"proof_of_license_url" text,
	"is_derivative" boolean DEFAULT false,
	"is_published" boolean DEFAULT false,
	"created_by_admin_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" varchar,
	"actor_username" text,
	"actor_role" text,
	"entity_type" text NOT NULL,
	"entity_id" varchar,
	"action" text NOT NULL,
	"action_category" text,
	"target_type" text,
	"target_id" varchar,
	"reason" text,
	"confirmation_required" boolean DEFAULT false,
	"before_json" jsonb,
	"after_json" jsonb,
	"metadata" jsonb,
	"severity" text DEFAULT 'info',
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "autopilot_engines" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"engine_key" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT false NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"last_run_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "autopilot_engines_engine_key_unique" UNIQUE("engine_key")
);
--> statement-breakpoint
CREATE TABLE "autopilot_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"engine_key" varchar NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"result" jsonb DEFAULT '{}'::jsonb,
	"error" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"scheduled_for" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "autopilot_schedules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"engine_key" varchar NOT NULL,
	"frequency" text DEFAULT 'daily' NOT NULL,
	"cron_expression" text,
	"enabled" boolean DEFAULT false NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"next_run_at" timestamp,
	"last_run_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "backup_artifacts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_version_id" varchar,
	"content_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"artifact_type" text NOT NULL,
	"storage_path" text,
	"checksum" text,
	"status" text DEFAULT 'active',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmark_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_type" text NOT NULL,
	"total_users" integer DEFAULT 0 NOT NULL,
	"avg_readiness_score" double precision DEFAULT 0 NOT NULL,
	"avg_pass_probability" double precision DEFAULT 0 NOT NULL,
	"avg_accuracy" double precision DEFAULT 0 NOT NULL,
	"avg_questions_answered" double precision DEFAULT 0 NOT NULL,
	"avg_topic_coverage" double precision DEFAULT 0 NOT NULL,
	"passing_threshold" integer DEFAULT 65 NOT NULL,
	"score_distribution" jsonb DEFAULT '{}'::jsonb,
	"percentile_breakpoints" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "benchmark_profiles_exam_type_unique" UNIQUE("exam_type")
);
--> statement-breakpoint
CREATE TABLE "bg_job_batches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"batch_index" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"total_items" integer DEFAULT 0,
	"completed_items" integer DEFAULT 0,
	"failed_items" integer DEFAULT 0,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"result" jsonb DEFAULT '{}'::jsonb,
	"error" text,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"claimed_by" varchar,
	"heartbeat_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bg_job_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"batch_id" varchar NOT NULL,
	"item_index" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"content_type" text,
	"content_payload" jsonb DEFAULT '{}'::jsonb,
	"error" text,
	"saved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bg_job_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bg_job_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "bg_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"engine_key" varchar,
	"status" text DEFAULT 'queued' NOT NULL,
	"priority" integer DEFAULT 0,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"result" jsonb DEFAULT '{}'::jsonb,
	"error" text,
	"total_items" integer DEFAULT 0,
	"completed_items" integer DEFAULT 0,
	"failed_items" integer DEFAULT 0,
	"total_batches" integer DEFAULT 0,
	"completed_batches" integer DEFAULT 0,
	"failed_batches" integer DEFAULT 0,
	"batch_size" integer DEFAULT 50,
	"concurrency_limit" integer DEFAULT 3,
	"created_by" varchar,
	"claimed_by" varchar,
	"heartbeat_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_clusters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"keyword" text NOT NULL,
	"exam_key" text,
	"pillar_title" text,
	"pillar_content" jsonb DEFAULT '{}'::jsonb,
	"pillar_slug" text,
	"pillar_status" text DEFAULT 'draft',
	"supporting_articles" jsonb DEFAULT '[]'::jsonb,
	"schema_markup" jsonb DEFAULT '{}'::jsonb,
	"internal_links" jsonb DEFAULT '[]'::jsonb,
	"publish_schedule" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"citation_style" text DEFAULT 'apa7',
	"posts_per_day" integer DEFAULT 2,
	"day_count" integer DEFAULT 0,
	"total_posts_generated" integer DEFAULT 0,
	"is_active" boolean DEFAULT false,
	"last_post_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_key" text NOT NULL,
	"name" text NOT NULL,
	"layout_type" text NOT NULL,
	"hero_config" jsonb DEFAULT '{}'::jsonb,
	"toc_enabled" boolean DEFAULT true NOT NULL,
	"content_blocks" jsonb DEFAULT '[]'::jsonb,
	"faq_enabled" boolean DEFAULT true NOT NULL,
	"related_posts_enabled" boolean DEFAULT true NOT NULL,
	"cta_config" jsonb DEFAULT '{}'::jsonb,
	"seo_meta_patterns" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_post_templates_template_key_unique" UNIQUE("template_key")
);
--> statement-breakpoint
CREATE TABLE "business_expenses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"vendor" text NOT NULL,
	"description" text,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'CAD' NOT NULL,
	"date" text NOT NULL,
	"recurring" boolean DEFAULT false,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"tier" text DEFAULT 'rpn' NOT NULL,
	"difficulty" text DEFAULT 'moderate' NOT NULL,
	"body_system" text,
	"category" text,
	"scenario_intro" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"region_scope" text DEFAULT 'BOTH',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_study_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_step_id" varchar NOT NULL,
	"question_text" text NOT NULL,
	"question_type" text DEFAULT 'multiple_choice' NOT NULL,
	"answer_options" jsonb DEFAULT '[]'::jsonb,
	"correct_answer" jsonb DEFAULT '[]'::jsonb,
	"rationale" text,
	"points" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "case_study_steps" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" varchar NOT NULL,
	"step_number" integer NOT NULL,
	"clinical_update_text" text NOT NULL,
	"exhibit_data" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "cat_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"status" "cat_session_status" DEFAULT 'in_progress' NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"adaptive_state" jsonb DEFAULT '{}'::jsonb,
	"question_sequence" jsonb DEFAULT '[]'::jsonb,
	"result_summary" jsonb DEFAULT '{}'::jsonb,
	"total_questions" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"time_spent_seconds" integer DEFAULT 0,
	"exam_type" text,
	"tier" text
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" varchar NOT NULL,
	"institution_id" varchar NOT NULL,
	"classroom_id" varchar,
	"student_name" text NOT NULL,
	"course_name" text NOT NULL,
	"institution_name" text NOT NULL,
	"completion_date" timestamp NOT NULL,
	"certificate_code" text NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_certificate_code_unique" UNIQUE("certificate_code")
);
--> statement-breakpoint
CREATE TABLE "change_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"change_type" text NOT NULL,
	"source" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"description" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"changed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_students" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classroom_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"instructor_id" varchar NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cleanup_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_type" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"items_scanned" integer DEFAULT 0,
	"items_cleaned" integer DEFAULT 0,
	"items_flagged" integer DEFAULT 0,
	"details" jsonb DEFAULT '[]'::jsonb,
	"triggered_by" text DEFAULT 'system',
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "clinical_seo_page_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translation_status" "translation_status_enum" DEFAULT 'missing' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"translated_at" timestamp,
	"reviewed_at" timestamp,
	"title" text,
	"meta_title" text,
	"meta_description" text,
	"summary" text,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "clinical_seo_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_type" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"canonical_url" text,
	"body_system" text,
	"category" text,
	"summary" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"practice_questions" jsonb DEFAULT '[]'::jsonb,
	"references" jsonb DEFAULT '[]'::jsonb,
	"related_slugs" text[] DEFAULT '{}'::text[],
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"published_at" timestamp,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "clinical_seo_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comm_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"channel" text DEFAULT 'email' NOT NULL,
	"subject" text,
	"body_template" text NOT NULL,
	"variables" text[] DEFAULT '{}'::text[],
	"category" text DEFAULT 'general',
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"updated_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comm_templates_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "communication_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_key" text NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"body_email" text NOT NULL,
	"body_in_app" text NOT NULL,
	"placeholders" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"updated_by" varchar,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "communication_templates_template_key_unique" UNIQUE("template_key")
);
--> statement-breakpoint
CREATE TABLE "confidence_ratings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"confidence" text NOT NULL,
	"was_correct" boolean DEFAULT false,
	"topic" text,
	"body_system" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_access_counters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"access_date" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_growth_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_id" varchar,
	"content_type" text NOT NULL,
	"target_tier" text DEFAULT 'rn',
	"status" text DEFAULT 'queued',
	"target_count" integer DEFAULT 0,
	"generated_count" integer DEFAULT 0,
	"accepted_count" integer DEFAULT 0,
	"rejected_count" integer DEFAULT 0,
	"validation_results" jsonb DEFAULT '[]'::jsonb,
	"topics_prioritized" jsonb DEFAULT '[]'::jsonb,
	"gap_analysis" jsonb DEFAULT '{}'::jsonb,
	"error_message" text,
	"triggered_by" text DEFAULT 'schedule',
	"estimated_cost" double precision DEFAULT 0,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_growth_schedules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"cadence" text DEFAULT 'daily' NOT NULL,
	"enabled" boolean DEFAULT false,
	"items_per_run" integer DEFAULT 5,
	"run_time_hour" integer DEFAULT 3,
	"max_daily_runs" integer DEFAULT 1,
	"priority_topics" text[] DEFAULT '{}'::text[],
	"target_tier" text DEFAULT 'rn',
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"total_runs" integer DEFAULT 0,
	"total_items_generated" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_health_records" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scan_run_id" varchar,
	"content_type" text NOT NULL,
	"content_id" varchar NOT NULL,
	"content_title" text,
	"tier" text,
	"issue_type" text NOT NULL,
	"severity" text DEFAULT 'medium' NOT NULL,
	"description" text NOT NULL,
	"field" text,
	"current_value" text,
	"auto_fixable" boolean DEFAULT false,
	"repair_status" text DEFAULT 'pending',
	"repair_action" text,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"repaired_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "content_health_scores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"overall_score" integer DEFAULT 0 NOT NULL,
	"accuracy_score" integer,
	"completeness_score" integer,
	"freshness_score" integer,
	"engagement_score" integer,
	"issues" jsonb DEFAULT '[]'::jsonb,
	"last_checked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_intelligence_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_type" text NOT NULL,
	"report_data" jsonb NOT NULL,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_item_translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_item_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"title" text,
	"summary" text,
	"content" jsonb,
	"seo_title" text,
	"seo_description" text,
	"translation_status" text DEFAULT 'draft' NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translated_by" text,
	"reviewed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"type" text DEFAULT 'lesson' NOT NULL,
	"category" text,
	"body_system" text,
	"tier" text DEFAULT 'free',
	"status" text DEFAULT 'draft',
	"tags" text[] DEFAULT '{}'::text[],
	"summary" text,
	"content" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"primary_keyword" text,
	"secondary_keywords" text[] DEFAULT '{}'::text[],
	"scheduled_at" timestamp,
	"clinical_safety_review" boolean DEFAULT false,
	"auto_publish" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"author_id" varchar,
	"author_name" text,
	"region_scope" text DEFAULT 'BOTH',
	"version_key" text,
	"updated_by_ai" boolean DEFAULT false,
	"protected_fields" text[] DEFAULT '{}'::text[],
	"source_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "content_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_quarantine" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"reason" text NOT NULL,
	"detected_by" text DEFAULT 'validation',
	"previous_status" text,
	"previous_version" integer,
	"affected_users_estimate" integer DEFAULT 0,
	"fallback_content_id" varchar,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"resolution_action" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_repair_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"health_record_id" varchar,
	"scan_run_id" varchar,
	"content_type" text NOT NULL,
	"content_id" varchar NOT NULL,
	"repair_type" text NOT NULL,
	"field" text NOT NULL,
	"before_value" text,
	"after_value" text,
	"repair_method" text NOT NULL,
	"status" text DEFAULT 'applied' NOT NULL,
	"rolled_back" boolean DEFAULT false,
	"rolled_back_at" timestamp,
	"rolled_back_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_revisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"revision_number" integer DEFAULT 1 NOT NULL,
	"title" text,
	"content" jsonb,
	"status" text,
	"edited_by" varchar,
	"edited_by_username" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_roi_scores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposed_title" text NOT NULL,
	"language_code" text DEFAULT 'en' NOT NULL,
	"exam_code" text,
	"content_type" text NOT NULL,
	"primary_keyword" text,
	"secondary_keywords" jsonb DEFAULT '[]'::jsonb,
	"blueprint_category" text,
	"seo_demand_score" integer DEFAULT 0,
	"blueprint_strategic_score" integer DEFAULT 0,
	"conversion_potential_score" integer DEFAULT 0,
	"authority_multiplier_score" integer DEFAULT 0,
	"monetization_fit_score" integer DEFAULT 0,
	"roi_score" double precision DEFAULT 0,
	"priority_tier" text DEFAULT 'deprioritize',
	"similarity_flag" boolean DEFAULT false,
	"similar_page_slug" text,
	"pipeline_status" text DEFAULT 'idea',
	"projected_monthly_traffic" integer,
	"projected_diagnostic_starts" integer,
	"projected_revenue" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_snapshots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"content_type" text DEFAULT 'content_item',
	"version" integer DEFAULT 1 NOT NULL,
	"title" text,
	"slug" text,
	"content_data" jsonb,
	"verified_payload" jsonb,
	"backup_payload" jsonb,
	"static_fallback" text,
	"metadata" jsonb,
	"snapshot_type" text DEFAULT 'auto',
	"is_last_known_good" boolean DEFAULT false,
	"validated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_substitution_rules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"match_profession" boolean DEFAULT true,
	"match_tier" boolean DEFAULT true,
	"match_exam_type" boolean DEFAULT true,
	"match_domain" boolean DEFAULT true,
	"match_region" boolean DEFAULT false,
	"match_language" boolean DEFAULT true,
	"match_plan_eligibility" boolean DEFAULT true,
	"profession_weight" integer DEFAULT 10,
	"tier_weight" integer DEFAULT 8,
	"exam_type_weight" integer DEFAULT 7,
	"domain_weight" integer DEFAULT 9,
	"region_weight" integer DEFAULT 3,
	"language_weight" integer DEFAULT 6,
	"plan_weight" integer DEFAULT 5,
	"allow_cross_language" boolean DEFAULT true,
	"default_language" text DEFAULT 'en',
	"max_substitutes" integer DEFAULT 3,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"content_id" text NOT NULL,
	"language_code" text NOT NULL,
	"field_name" text NOT NULL,
	"translated_text" text NOT NULL,
	"translation_status" text DEFAULT 'auto',
	"source_hash" text,
	"source_last_updated_reference" timestamp,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_validation_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"version" integer DEFAULT 1,
	"valid" boolean NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"warnings" jsonb DEFAULT '[]'::jsonb,
	"validator_results" jsonb,
	"triggered_by" text DEFAULT 'publish',
	"actor_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"locale" text DEFAULT 'en',
	"region" text DEFAULT 'US',
	"tier" text DEFAULT 'free',
	"version_number" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"validation_status" text DEFAULT 'verified' NOT NULL,
	"payload_hash" text NOT NULL,
	"backup_artifact_refs" jsonb DEFAULT '[]'::jsonb,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"created_by" varchar,
	"updated_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_weekly_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" timestamp NOT NULL,
	"week_end" timestamp NOT NULL,
	"lessons_created" integer DEFAULT 0 NOT NULL,
	"blog_posts_created" integer DEFAULT 0 NOT NULL,
	"flashcards_created" integer DEFAULT 0 NOT NULL,
	"exam_questions_created" integer DEFAULT 0 NOT NULL,
	"seo_articles_created" integer DEFAULT 0 NOT NULL,
	"total_content_created" integer DEFAULT 0 NOT NULL,
	"previous_week_total" integer DEFAULT 0,
	"week_over_week_change" double precision DEFAULT 0,
	"breakdown_json" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" integer NOT NULL,
	"expires_at" timestamp,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "coupon_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "cross_section_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" varchar,
	"source_section" text NOT NULL,
	"destination_section" text NOT NULL,
	"source_page" text NOT NULL,
	"destination_page" text NOT NULL,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_page_modules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text DEFAULT 'BookOpen',
	"color" text DEFAULT 'text-primary',
	"bg_color" text DEFAULT 'bg-primary/10',
	"image_url" text,
	"sort_order" integer DEFAULT 0,
	"lessons" jsonb DEFAULT '[]'::jsonb,
	"tier" text,
	"status" text DEFAULT 'active',
	"content" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_practice_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"status" text DEFAULT 'pending',
	"total_questions" integer DEFAULT 20,
	"weak_topic_count" integer DEFAULT 0,
	"moderate_topic_count" integer DEFAULT 0,
	"strong_topic_count" integer DEFAULT 0,
	"includes_images" boolean DEFAULT false,
	"questions" jsonb DEFAULT '[]'::jsonb,
	"score" integer,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_study_goals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"date" text NOT NULL,
	"lessons_target" integer DEFAULT 3,
	"lessons_completed" integer DEFAULT 0,
	"questions_target" integer DEFAULT 10,
	"questions_completed" integer DEFAULT 0,
	"minutes_target" integer DEFAULT 30,
	"minutes_completed" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboard_resume_state" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"last_cat_session_id" varchar,
	"last_mock_session_id" varchar,
	"last_test_bank_id" varchar,
	"last_lesson_id" text,
	"recommended_next_action" text,
	"last_updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dashboard_resume_state_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "dashboard_widgets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"widget_type" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "deck_flashcards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" varchar NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"rationale" text,
	"clinical_pearl" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"difficulty" text DEFAULT 'medium',
	"ai_check_status" text DEFAULT 'unknown',
	"ai_check_summary" text,
	"ai_check_confidence" integer,
	"user_override" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" varchar NOT NULL,
	"target_type" text NOT NULL,
	"target_id" varchar NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"asset_type" text NOT NULL,
	"url" text NOT NULL,
	"width" integer,
	"height" integer,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"page_number" integer NOT NULL,
	"canvas_json" jsonb,
	"background_color" text DEFAULT '#ffffff',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"page_size" text DEFAULT 'Letter',
	"orientation" text DEFAULT 'portrait',
	"created_by_admin_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "design_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "diagnostic_assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"exam_target" text DEFAULT 'rex-pn' NOT NULL,
	"total_questions" integer DEFAULT 30 NOT NULL,
	"score" integer NOT NULL,
	"domain_scores" jsonb DEFAULT '{}'::jsonb,
	"topic_scores" jsonb DEFAULT '{}'::jsonb,
	"answers" jsonb DEFAULT '[]'::jsonb,
	"weakness_summary" text,
	"strength_summary" text,
	"study_plan" jsonb,
	"recommended_qbanks" jsonb,
	"remediation_bank_id" varchar,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"session_id" text,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb,
	"topic_breakdown" jsonb DEFAULT '{}'::jsonb,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "difficulty_adjustment_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"difficulty_level" integer NOT NULL,
	"old_scaling" double precision NOT NULL,
	"new_scaling" double precision NOT NULL,
	"actual_percent" double precision,
	"expected_range" text,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digital_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text,
	"price" integer NOT NULL,
	"compare_at_price" integer,
	"file_url" text,
	"cover_image_url" text,
	"preview_url" text,
	"preview_page_count" integer DEFAULT 3,
	"category" text NOT NULL,
	"tier_target" text DEFAULT 'all',
	"exam_target" text,
	"featured" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"question_count" integer DEFAULT 0,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text,
	"theme_id" text,
	"career_type" text DEFAULT 'nursing',
	"sale_price" integer,
	"sale_starts_at" timestamp,
	"sale_ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "digital_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "email_subscribers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"tier" text DEFAULT 'general',
	"source" text DEFAULT 'qotd',
	"verified" boolean DEFAULT false,
	"frequency" text DEFAULT 'weekly',
	"lead_magnet_type" text,
	"profession_context" text,
	"categories" text[] DEFAULT '{"general"}'::text[],
	"daily_question_opt_in" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "email_verification_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encyclopedia_cross_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_entry_id" varchar NOT NULL,
	"target_entry_id" varchar NOT NULL,
	"match_score" double precision DEFAULT 0 NOT NULL,
	"match_reason" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encyclopedia_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" varchar,
	"profession" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"overview" text NOT NULL,
	"mechanism_physiology" text,
	"clinical_relevance" text,
	"signs_symptoms" text,
	"assessment" text,
	"management" text,
	"complications" text,
	"clinical_pearls" jsonb DEFAULT '[]'::jsonb,
	"exam_pitfalls" jsonb DEFAULT '[]'::jsonb,
	"faq_json" jsonb DEFAULT '[]'::jsonb,
	"related_lesson_ids" text[] DEFAULT '{}'::text[],
	"related_question_ids" text[] DEFAULT '{}'::text[],
	"related_flashcard_ids" text[] DEFAULT '{}'::text[],
	"cross_profession_links" jsonb DEFAULT '[]'::jsonb,
	"image_placeholders" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'published',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encyclopedia_topics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profession" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"related_lesson_ids" text[] DEFAULT '{}'::text[],
	"related_question_ids" text[] DEFAULT '{}'::text[],
	"related_flashcard_ids" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlement_cache" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_type" text NOT NULL,
	"product_id" text,
	"has_access" boolean NOT NULL,
	"access_source" text NOT NULL,
	"plan_id" text,
	"tier" text,
	"expires_at" timestamp,
	"decision_reason" text,
	"verified_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlement_decisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_type" text NOT NULL,
	"product_id" text,
	"has_access" boolean NOT NULL,
	"access_source" text NOT NULL,
	"provisional" boolean DEFAULT false,
	"decision_reason" text,
	"request_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlement_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"event_type" text NOT NULL,
	"tier" text,
	"previous_tier" text,
	"access_source" text,
	"stripe_event_id" text,
	"subscription_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "environment_write_audit" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" varchar,
	"actor_username" text,
	"selected_target" text NOT NULL,
	"actual_environment" text NOT NULL,
	"actual_db_fingerprint" text,
	"content_type" text NOT NULL,
	"entity_id" varchar,
	"item_count" integer DEFAULT 0,
	"action_type" text NOT NULL,
	"provider_model" text,
	"approval_state" text,
	"write_summary" text,
	"preflight_result" jsonb,
	"post_write_result" jsonb,
	"success" boolean DEFAULT false,
	"failure_reason" text,
	"mismatch_reason" text,
	"block_reason" text,
	"dry_run" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_blueprints" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_code" text NOT NULL,
	"exam_name" text NOT NULL,
	"tier" text NOT NULL,
	"region" text DEFAULT 'ALL',
	"total_questions" integer NOT NULL,
	"passing_standard" text NOT NULL,
	"time_limit" integer NOT NULL,
	"domains" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"question_type_weights" jsonb DEFAULT '{}'::jsonb,
	"cat_enabled" boolean DEFAULT false,
	"cat_min_questions" integer,
	"cat_max_questions" integer,
	"active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exam_blueprints_exam_code_unique" UNIQUE("exam_code")
);
--> statement-breakpoint
CREATE TABLE "exam_planner_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"exam_date" timestamp,
	"exam_date_type" text DEFAULT 'target',
	"exam_countdown_hidden" boolean DEFAULT false,
	"study_planner_hidden" boolean DEFAULT false,
	"study_plan_intensity" text DEFAULT 'balanced',
	"plan_without_date" boolean DEFAULT false,
	"plan_without_date_weeks" integer,
	"tier" text DEFAULT 'rn',
	"career_type" text DEFAULT 'nursing',
	"generated_plan" jsonb,
	"planner_last_updated" timestamp,
	"exam_result_status" text,
	"exam_followup_completed" boolean DEFAULT false,
	"exam_postponed" boolean DEFAULT false,
	"career_stage" text DEFAULT 'student',
	"new_grad_resources_activated" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exam_planner_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "exam_question_translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_question_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"stem" text,
	"options" jsonb,
	"rationale" text,
	"scenario" text,
	"clinical_pearl" text,
	"exam_strategy" text,
	"memory_hook" text,
	"correct_answer_explanation" text,
	"incorrect_answer_rationale" jsonb,
	"distractor_rationales" jsonb,
	"clinical_reasoning" text,
	"key_takeaway" text,
	"mnemonic" text,
	"translation_status" text DEFAULT 'draft' NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translated_by" text,
	"reviewed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" text NOT NULL,
	"exam" text NOT NULL,
	"question_type" text NOT NULL,
	"status" text DEFAULT 'draft',
	"publish_at" timestamp,
	"stem" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correct_answer" jsonb DEFAULT '[]'::jsonb,
	"rationale" text,
	"difficulty" integer DEFAULT 3,
	"tags" text[] DEFAULT '{}'::text[],
	"body_system" text,
	"topic" text,
	"subtopic" text,
	"case_id" varchar,
	"exhibit_data" jsonb,
	"region_scope" text DEFAULT 'BOTH',
	"stem_hash" text,
	"career_type" text DEFAULT 'nursing',
	"scenario" text,
	"clinical_pearl" text,
	"exam_strategy" text,
	"memory_hook" text,
	"framework_used" text,
	"clinical_trap" text,
	"distractor_rationales" jsonb,
	"quality_scores" jsonb,
	"quality_feedback" jsonb,
	"quality_score" integer,
	"country_code" text,
	"region_code" text,
	"licensing_body" text,
	"language_code" text DEFAULT 'en',
	"cognitive_level" text,
	"question_format" text,
	"is_scenario" boolean DEFAULT false,
	"is_mock_exam_eligible" boolean DEFAULT true,
	"is_adaptive_eligible" boolean DEFAULT true,
	"is_flashcard_source" boolean DEFAULT false,
	"is_study_guide_linked" boolean DEFAULT false,
	"is_tutor_ready" boolean DEFAULT false,
	"correct_answer_explanation" text,
	"incorrect_answer_rationale" jsonb,
	"clinical_reasoning" text,
	"key_takeaway" text,
	"mnemonic" text,
	"reference_source" text,
	"lab_unit_variant" text,
	"medication_naming_variant" text,
	"case_context" text,
	"vitals" jsonb,
	"labs" jsonb,
	"images" jsonb,
	"scenario_id" varchar,
	"blueprint_weight" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"source_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exported_files" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"export_type" text NOT NULL,
	"url" text NOT NULL,
	"settings_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fallback_event_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar,
	"failure_reason" text NOT NULL,
	"fallback_tier" text NOT NULL,
	"request_path" text,
	"response_time" integer,
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_usage" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"feature" text NOT NULL,
	"usage_date" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_bank" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" text NOT NULL,
	"topic_tag" text,
	"career_type" text DEFAULT 'nursing',
	"front" text NOT NULL,
	"back" text NOT NULL,
	"tags_json" jsonb DEFAULT '[]'::jsonb,
	"references_json" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"content_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"source_type" text DEFAULT 'manual',
	"source_question_id" varchar,
	"question_type" text,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correct_answer" jsonb,
	"rationale_correct" text,
	"distractor_rationales" jsonb,
	"clinical_takeaway" text,
	"exam_pearl" text,
	"rationale_media" jsonb DEFAULT '[]'::jsonb,
	"lesson_links" jsonb DEFAULT '[]'::jsonb,
	"difficulty" integer,
	"body_system" text,
	"topic" text,
	"subtopic" text,
	"region_scope" text DEFAULT 'BOTH',
	"flashcard_enabled" boolean DEFAULT false,
	"category" text,
	"blueprint_category" text,
	"updated_at" timestamp DEFAULT now(),
	"high_yield" boolean DEFAULT false,
	"is_foundational" boolean DEFAULT false,
	"quality_scores" jsonb,
	"quality_feedback" jsonb,
	"quality_score" integer,
	"source_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "flashcard_bank_content_hash_unique" UNIQUE("content_hash")
);
--> statement-breakpoint
CREATE TABLE "flashcard_deck_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translation_status" "translation_status_enum" DEFAULT 'missing' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"translated_at" timestamp,
	"reviewed_at" timestamp,
	"title" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "flashcard_decks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"tier" text DEFAULT 'free',
	"visibility" text DEFAULT 'private',
	"slug" text,
	"career_type" text DEFAULT 'nursing',
	"is_upgraded" boolean DEFAULT false,
	"upgraded_at" timestamp,
	"upgraded_limit" integer DEFAULT 300,
	"stripe_payment_intent_id" text,
	"card_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"save_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_preview_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text DEFAULT 'flashcards' NOT NULL,
	"session_limit" integer DEFAULT 5 NOT NULL,
	"daily_limit" integer DEFAULT 10 NOT NULL,
	"allowed_topics" text[] DEFAULT '{}'::text[],
	"allowed_tiers" text[] DEFAULT '{}'::text[],
	"upgrade_headline" text DEFAULT 'Unlock the Full Flashcard Library',
	"upgrade_body" text DEFAULT 'Get unlimited flashcards, adaptive review, weak areas mode, and saved progress with a premium plan.',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "flashcard_preview_config_content_type_unique" UNIQUE("content_type")
);
--> statement-breakpoint
CREATE TABLE "flashcard_preview_usage" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"date" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"card_id" varchar NOT NULL,
	"deck_id" varchar NOT NULL,
	"response" text NOT NULL,
	"interval" integer DEFAULT 1,
	"ease_factor" integer DEFAULT 250,
	"repetitions" integer DEFAULT 0,
	"confidence" text DEFAULT 'unsure',
	"next_review_date" text NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flashcard_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"front" text,
	"back" text,
	"options" jsonb,
	"rationale_correct" text,
	"clinical_takeaway" text,
	"exam_pearl" text,
	"translation_status" text DEFAULT 'draft' NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translated_by" text,
	"reviewed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "free_trial_usage" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"questions_used" integer DEFAULT 0,
	"flashcards_used" integer DEFAULT 0,
	"cat_exams_used" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "free_trial_usage_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "friend_connections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_a_id" varchar NOT NULL,
	"user_b_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friend_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" varchar NOT NULL,
	"receiver_id" varchar NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generated_courses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" varchar,
	"exam_code" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft',
	"structure" jsonb DEFAULT '[]'::jsonb,
	"total_lessons" integer DEFAULT 0,
	"total_flashcards" integer DEFAULT 0,
	"total_questions" integer DEFAULT 0,
	"seo_pages" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generated_micro_lectures" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"topic" text NOT NULL,
	"tier" text NOT NULL,
	"focus" text,
	"duration_estimate" text,
	"script_json" jsonb,
	"slides_json" jsonb,
	"flashcards_json" jsonb,
	"keywords" text[],
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "generated_micro_lectures_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "generated_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_id" varchar NOT NULL,
	"idx" integer NOT NULL,
	"type" text NOT NULL,
	"difficulty" text,
	"system" text,
	"category" text,
	"stem" text NOT NULL,
	"scenario" text,
	"choices" jsonb NOT NULL,
	"correct_answers" jsonb NOT NULL,
	"rationale" jsonb,
	"exam_pearl" text,
	"hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_id" varchar NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_date" text NOT NULL,
	"content_type" text NOT NULL,
	"tier" text NOT NULL,
	"target_count" integer NOT NULL,
	"generated_count" integer DEFAULT 0,
	"mode" text NOT NULL,
	"topic_plan_json" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'queued' NOT NULL,
	"cost_estimate_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "generator_v2_presentation_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_id" varchar NOT NULL,
	"theme_id" text,
	"cover_layout" text DEFAULT 'minimal',
	"cover_title" text DEFAULT '',
	"cover_subtitle" text DEFAULT '',
	"author_line" text,
	"edition_text" text,
	"show_logo" boolean DEFAULT true,
	"extras_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "generator_v2_presentation_settings_generation_id_unique" UNIQUE("generation_id")
);
--> statement-breakpoint
CREATE TABLE "image_assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_type" text DEFAULT 'radiograph' NOT NULL,
	"category" text DEFAULT 'exam_image' NOT NULL,
	"country" text DEFAULT 'canada' NOT NULL,
	"exam_type" text,
	"modality" text,
	"body_region" text,
	"projection" text,
	"title" text,
	"description" text,
	"teaching_url" text,
	"exam_url" text,
	"thumbnail_url" text,
	"tags" text[] DEFAULT '{}'::text[],
	"related_content_ids" text[] DEFAULT '{}'::text[],
	"approval_status" text DEFAULT 'pending' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_anatomy_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"body_region" text NOT NULL,
	"body_part" text,
	"anatomical_structures" text[] DEFAULT '{}'::text[],
	"labeled_teaching_url" text,
	"clean_exam_url" text,
	"hotspot_overlay" jsonb DEFAULT '[]'::jsonb,
	"modality" text,
	"projection" text,
	"tags" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_artifact_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artifact_name" text NOT NULL,
	"artifact_type" text NOT NULL,
	"description" text,
	"cause" text,
	"correction" text,
	"severity" text DEFAULT 'moderate',
	"teaching_version_url" text,
	"exam_version_url" text,
	"corrected_comparison_url" text,
	"body_region" text,
	"modality" text,
	"tags" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_blog_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"country" text NOT NULL,
	"article_type" text NOT NULL,
	"category" text,
	"title" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"summary" text,
	"content_html" text,
	"tags" text[] DEFAULT '{}'::text[],
	"primary_keyword" text,
	"secondary_keywords" text[] DEFAULT '{}'::text[],
	"related_seo_page_slugs" text[] DEFAULT '{}'::text[],
	"related_article_slugs" text[] DEFAULT '{}'::text[],
	"schema_markup_json" jsonb,
	"read_time_minutes" integer DEFAULT 5,
	"status" text DEFAULT 'draft',
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp,
	"next_review_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "imaging_blog_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "imaging_case_studies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country" text DEFAULT 'canada' NOT NULL,
	"exam_type" text DEFAULT 'camrt' NOT NULL,
	"title" text NOT NULL,
	"clinical_history" text NOT NULL,
	"findings" jsonb DEFAULT '[]'::jsonb,
	"diagnosis" text,
	"discussion_points" jsonb DEFAULT '[]'::jsonb,
	"image_refs" text[] DEFAULT '{}'::text[],
	"difficulty" text DEFAULT 'medium',
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_comparison_sets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"comparison_type" text NOT NULL,
	"description" text,
	"acceptable_image_url" text,
	"unacceptable_image_url" text,
	"acceptable_label" text DEFAULT 'Acceptable',
	"unacceptable_label" text DEFAULT 'Unacceptable',
	"key_differences" text[] DEFAULT '{}'::text[],
	"body_region" text,
	"modality" text,
	"category" text,
	"tags" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_entitlements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_id" varchar,
	"entitlement_type" text NOT NULL,
	"scope" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'active',
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_exam_attempt_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"user_answer" text,
	"is_correct" boolean,
	"time_spent" integer,
	"flagged" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "imaging_exam_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"country" text DEFAULT 'canada' NOT NULL,
	"exam_type" text DEFAULT 'camrt' NOT NULL,
	"total_questions" integer NOT NULL,
	"score" integer,
	"time_spent" integer,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"report" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "imaging_exam_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country" text DEFAULT 'canada' NOT NULL,
	"exam_type" text DEFAULT 'camrt' NOT NULL,
	"max_exam_length" integer DEFAULT 200,
	"default_time_per_question" integer DEFAULT 90,
	"allow_back_navigation" boolean DEFAULT true,
	"image_question_percentage" integer DEFAULT 20,
	"topic_weights" jsonb DEFAULT '{}'::jsonb,
	"difficulty_sensitivity" double precision DEFAULT 0.5,
	"question_reuse_cooldown_days" integer DEFAULT 7,
	"grace_period_minutes" integer DEFAULT 5,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_exam_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"country" text DEFAULT 'canada' NOT NULL,
	"exam_type" text DEFAULT 'camrt' NOT NULL,
	"mode" text DEFAULT 'adaptive' NOT NULL,
	"exam_length" integer DEFAULT 50 NOT NULL,
	"total_questions" integer NOT NULL,
	"current_index" integer DEFAULT 0,
	"current_difficulty" double precision DEFAULT 3,
	"ability_estimate" double precision DEFAULT 0,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"score" integer,
	"correct_count" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"time_limit" integer,
	"question_ids" jsonb DEFAULT '[]'::jsonb,
	"answers" jsonb DEFAULT '{}'::jsonb,
	"flagged_ids" jsonb DEFAULT '[]'::jsonb,
	"question_meta" jsonb DEFAULT '[]'::jsonb,
	"difficulty_history" jsonb DEFAULT '[]'::jsonb,
	"category_breakdown" jsonb DEFAULT '{}'::jsonb,
	"report" jsonb,
	"allow_back_navigation" boolean DEFAULT true,
	"grace_period_minutes" integer DEFAULT 5,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"last_activity_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "imaging_flashcards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"modality" varchar(100),
	"body_part" varchar(100),
	"category" varchar(100),
	"country" text DEFAULT 'both',
	"exam_type" text,
	"topic" text,
	"difficulty" integer DEFAULT 2,
	"image_url" text,
	"status" varchar(20) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "imaging_image_briefs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"brief_type" text NOT NULL,
	"target_category" text NOT NULL,
	"description" text NOT NULL,
	"specifications" jsonb DEFAULT '{}'::jsonb,
	"body_region" text,
	"modality" text,
	"priority" text DEFAULT 'medium',
	"status" text DEFAULT 'pending',
	"assigned_to" text,
	"source_task_id" text,
	"resulting_asset_id" varchar,
	"notes" text,
	"due_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"source" text DEFAULT 'general' NOT NULL,
	"trigger" text DEFAULT 'manual',
	"exam_type" text,
	"country" text,
	"quiz_score" integer,
	"quiz_data" jsonb,
	"referral_code" text,
	"referred_by" text,
	"status" text DEFAULT 'active',
	"tags" text[] DEFAULT '{}'::text[],
	"converted_to_user" boolean DEFAULT false,
	"user_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_marketing_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"page" text,
	"session_id" text,
	"lead_id" varchar,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_nurture_enrollments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" varchar NOT NULL,
	"sequence_id" varchar NOT NULL,
	"current_step" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"next_send_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_nurture_sequences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"trigger" text NOT NULL,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_physics_topics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(300) NOT NULL,
	"slug" text DEFAULT '' NOT NULL,
	"content" text NOT NULL,
	"explanation" text,
	"category" varchar(100),
	"modality" varchar(100),
	"country" text DEFAULT 'both',
	"exam_type" text,
	"key_concepts" text[] DEFAULT '{}'::text[],
	"formulas" jsonb DEFAULT '[]'::jsonb,
	"exam_traps" jsonb DEFAULT '[]'::jsonb,
	"memory_aid" text,
	"clinical_relevance" text,
	"factor_relationships" jsonb DEFAULT '[]'::jsonb,
	"diagram_config" jsonb DEFAULT '{}'::jsonb,
	"quiz_items" jsonb DEFAULT '[]'::jsonb,
	"difficulty" integer DEFAULT 2,
	"sort_order" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'draft',
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "imaging_physics_visuals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"concept" text NOT NULL,
	"description" text,
	"category" text,
	"image_url" text,
	"animation_url" text,
	"related_topic_id" varchar,
	"tags" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_positioning_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text DEFAULT '' NOT NULL,
	"projection_name" varchar(200) NOT NULL,
	"body_part" varchar(100) NOT NULL,
	"body_region" text DEFAULT '',
	"country" text DEFAULT 'canada',
	"exam_relevance" text DEFAULT 'medium',
	"patient_position" text NOT NULL,
	"body_part_position" text,
	"central_ray" text NOT NULL,
	"central_ray_direction" text,
	"film_size" varchar(50),
	"sid" varchar(50),
	"detector_placement" text,
	"collimation_guidance" text,
	"breathing_instructions" text,
	"technical_factors" text,
	"anatomy_demonstrated" text,
	"common_errors" jsonb DEFAULT '[]'::jsonb,
	"evaluation_criteria" text,
	"clinical_notes" text,
	"tips" text,
	"exam_tips" text,
	"image_url" text,
	"teaching_image_url" text,
	"exam_image_url" text,
	"positioning_diagram_url" text,
	"incorrect_image_url" text,
	"positioning_errors" jsonb DEFAULT '[]'::jsonb,
	"quiz_questions" jsonb DEFAULT '[]'::jsonb,
	"label_overlays" jsonb DEFAULT '[]'::jsonb,
	"learning_steps" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"status" varchar(20) DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "imaging_preview_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"free_limit" integer DEFAULT 5 NOT NULL,
	"preview_message" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "imaging_preview_config_content_type_unique" UNIQUE("content_type")
);
--> statement-breakpoint
CREATE TABLE "imaging_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"product_type" text NOT NULL,
	"description" text,
	"features" text[] DEFAULT '{}'::text[],
	"price_cad" integer NOT NULL,
	"price_usd" integer NOT NULL,
	"compare_at_price_cad" integer,
	"compare_at_price_usd" integer,
	"stripe_price_id_cad" text,
	"stripe_price_id_usd" text,
	"stripe_product_id" text,
	"billing_interval" text,
	"content_scope" jsonb DEFAULT '{}'::jsonb,
	"question_count" integer DEFAULT 0,
	"flashcard_count" integer DEFAULT 0,
	"exam_count" integer DEFAULT 0,
	"country" text,
	"popular" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "imaging_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "imaging_purchases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD',
	"status" text DEFAULT 'completed',
	"purchased_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text NOT NULL,
	"correct_answer" varchar(1) NOT NULL,
	"rationale" text NOT NULL,
	"modality" varchar(100),
	"body_part" varchar(100),
	"category" varchar(100),
	"difficulty" integer DEFAULT 2,
	"exam" varchar(50),
	"country" varchar(50),
	"topic" varchar(200),
	"status" varchar(20) DEFAULT 'draft',
	"exam_domain" varchar(100),
	"mastery_category" varchar(20),
	"clinical_pearls" text,
	"imaging_practice_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "imaging_referrals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_email" text NOT NULL,
	"referrer_code" text NOT NULL,
	"referred_email" text NOT NULL,
	"status" text DEFAULT 'pending',
	"reward_granted" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imaging_seo_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"country" text NOT NULL,
	"page_type" text NOT NULL,
	"topic" text,
	"subtopic" text,
	"exam_type" text,
	"title" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"intro_html" text,
	"content_html" text,
	"faq_json" jsonb DEFAULT '[]'::jsonb,
	"internal_links_json" jsonb DEFAULT '[]'::jsonb,
	"cta_json" jsonb DEFAULT '{}'::jsonb,
	"sample_questions_json" jsonb DEFAULT '[]'::jsonb,
	"tags" text[] DEFAULT '{}'::text[],
	"primary_keyword" text,
	"secondary_keywords" text[] DEFAULT '{}'::text[],
	"schema_markup_json" jsonb,
	"status" text DEFAULT 'draft',
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp,
	"next_review_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "imaging_seo_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "imaging_study_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"lead_id" varchar,
	"exam_type" text NOT NULL,
	"exam_date" text,
	"hours_per_week" integer NOT NULL,
	"confidence_level" text NOT NULL,
	"plan_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_affected_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"username" text,
	"email" text,
	"tier" text,
	"subscription_status" text,
	"severity" text DEFAULT 'medium',
	"impact_description" text,
	"rescue_status" text DEFAULT 'pending',
	"suggested_actions" jsonb DEFAULT '[]'::jsonb,
	"actions_applied" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" varchar NOT NULL,
	"event_type" text NOT NULL,
	"event_data" jsonb DEFAULT '{}'::jsonb,
	"actor" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"severity" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"duration" integer,
	"impacted_features" jsonb DEFAULT '[]'::jsonb,
	"impacted_content_ids" jsonb DEFAULT '[]'::jsonb,
	"affected_users_estimate" integer DEFAULT 0,
	"fallback_modes" jsonb DEFAULT '[]'::jsonb,
	"root_cause_summary" text,
	"actions_taken" jsonb DEFAULT '[]'::jsonb,
	"created_by" varchar,
	"production_incident_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "infographic_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_key" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"prompt_text" text NOT NULL,
	"country_mode" text DEFAULT 'BOTH' NOT NULL,
	"exam_tier" text DEFAULT 'ALL' NOT NULL,
	"site_context" text DEFAULT 'nursing' NOT NULL,
	"career_track" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "infographic_templates_template_key_unique" UNIQUE("template_key")
);
--> statement-breakpoint
CREATE TABLE "institution_audit_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" varchar NOT NULL,
	"actor_user_id" varchar NOT NULL,
	"action_type" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_invite_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" varchar NOT NULL,
	"code" text NOT NULL,
	"seat_limit" integer DEFAULT 50 NOT NULL,
	"expires_at" timestamp,
	"usage_count" integer DEFAULT 0,
	CONSTRAINT "institution_invite_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "institution_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_name" text NOT NULL,
	"program_type" text NOT NULL,
	"estimated_student_count" integer,
	"country" text,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text,
	"region" text DEFAULT 'US',
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_roster_allowlist" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" varchar NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"added_by_user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institution_seat_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reason" text,
	"decided_at" timestamp,
	"decided_by_user_id" varchar
);
--> statement-breakpoint
CREATE TABLE "institution_seats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"access_start" timestamp DEFAULT now() NOT NULL,
	"access_end" timestamp,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"region" text DEFAULT 'US' NOT NULL,
	"career_scope" text DEFAULT 'MULTI' NOT NULL,
	"license_model" text DEFAULT 'COHORT' NOT NULL,
	"seat_limit" integer DEFAULT 50 NOT NULL,
	"semester_end_date" timestamp,
	"default_duration_days" integer,
	"tier_level" text DEFAULT 'COHORT' NOT NULL,
	"add_ons" jsonb DEFAULT '[]'::jsonb,
	"enrollment_mode" text DEFAULT 'DOMAIN_LOCK' NOT NULL,
	"allowed_email_domains" text[],
	"require_email_verified" boolean DEFAULT true,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrity_scan_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scan_type" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"content_types" text[] DEFAULT '{}'::text[],
	"tiers" text[] DEFAULT '{}'::text[],
	"total_records" integer DEFAULT 0,
	"scanned_records" integer DEFAULT 0,
	"issues_found" integer DEFAULT 0,
	"issues_by_severity" jsonb DEFAULT '{}'::jsonb,
	"issues_by_type" jsonb DEFAULT '{}'::jsonb,
	"auto_fixable" integer DEFAULT 0,
	"repairs_attempted" integer DEFAULT 0,
	"repairs_succeeded" integer DEFAULT 0,
	"error" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_listings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text[] DEFAULT '{}'::text[],
	"qualifications" text[] DEFAULT '{}'::text[],
	"responsibilities" text[] DEFAULT '{}'::text[],
	"location" text NOT NULL,
	"state" text,
	"country" text DEFAULT 'US',
	"profession" text NOT NULL,
	"specialty" text,
	"experience_level" text DEFAULT 'new_grad' NOT NULL,
	"employment_type" text DEFAULT 'full_time',
	"salary_min" integer,
	"salary_max" integer,
	"salary_currency" text DEFAULT 'USD',
	"salary_period" text DEFAULT 'year',
	"employer" text NOT NULL,
	"employer_description" text,
	"benefits" text[] DEFAULT '{}'::text[],
	"application_url" text,
	"status" text DEFAULT 'published',
	"featured" boolean DEFAULT false,
	"posted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_listings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "language_priority" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_code" text NOT NULL,
	"language_name" text NOT NULL,
	"nursing_population" integer DEFAULT 3,
	"immigration_patterns" integer DEFAULT 3,
	"search_demand" integer DEFAULT 3,
	"competition_strength" integer DEFAULT 3,
	"monetization_potential" integer DEFAULT 3,
	"production_difficulty" integer DEFAULT 3,
	"roi_score" double precision DEFAULT 0,
	"tier" text DEFAULT 'tier_3',
	"rollout_month" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "language_priority_language_code_unique" UNIQUE("language_code")
);
--> statement-breakpoint
CREATE TABLE "lead_capture_downloads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscriber_id" varchar,
	"email" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_name" text NOT NULL,
	"profession" text,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_aliases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" text NOT NULL,
	"alias_text" text NOT NULL,
	"normalized_alias" text NOT NULL,
	"canonical_slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_audio_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" text NOT NULL,
	"audio_clip_id" varchar NOT NULL,
	"display_order" integer DEFAULT 0,
	"quiz_prompt" text,
	"answer_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_bookmarks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lesson_id" varchar NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" text NOT NULL,
	"object_path" text NOT NULL,
	"file_name" text NOT NULL,
	"section" text DEFAULT 'general',
	"caption" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_overrides" (
	"lesson_id" text PRIMARY KEY NOT NULL,
	"overrides" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text,
	"sub_category" text,
	"tier" text DEFAULT 'free',
	"status" text DEFAULT 'draft',
	"summary" text,
	"definition" text,
	"pathophysiology" text,
	"signs_symptoms" jsonb DEFAULT '[]'::jsonb,
	"diagnostics" jsonb DEFAULT '[]'::jsonb,
	"treatment" jsonb DEFAULT '[]'::jsonb,
	"nursing_interventions" jsonb DEFAULT '[]'::jsonb,
	"complications" jsonb DEFAULT '[]'::jsonb,
	"clinical_pearls" jsonb DEFAULT '[]'::jsonb,
	"references" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"image_url" text,
	"image_alt" text,
	"related_lesson_slugs" text[] DEFAULT '{}'::text[],
	"linked_flashcard_set_id" varchar,
	"linked_question_bank_id" varchar,
	"is_public_preview" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lifecycle_emails" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"email_type" text NOT NULL,
	"trigger_event" text NOT NULL,
	"sequence_name" text,
	"sequence_step" integer DEFAULT 1,
	"status" text DEFAULT 'pending' NOT NULL,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locale_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locale" text NOT NULL,
	"strict_mode" boolean DEFAULT true NOT NULL,
	"allow_reviewed" boolean DEFAULT false NOT NULL,
	"allow_english_fallback" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locale_settings_locale_unique" UNIQUE("locale")
);
--> statement-breakpoint
CREATE TABLE "manual_review_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"health_record_id" varchar,
	"scan_run_id" varchar,
	"content_type" text NOT NULL,
	"content_id" varchar NOT NULL,
	"content_title" text,
	"issue_type" text NOT NULL,
	"severity" text DEFAULT 'medium' NOT NULL,
	"description" text NOT NULL,
	"suggested_fix" text,
	"suggested_value" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"review_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_terminology_dictionary" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"english_term" text NOT NULL,
	"language_code" text NOT NULL,
	"translated_term" text NOT NULL,
	"category" text NOT NULL,
	"abbreviation" text,
	"preserve_abbreviation" boolean DEFAULT true,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "migration_audit_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" text NOT NULL,
	"name" text NOT NULL,
	"direction" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"dry_run" boolean DEFAULT false,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"error_message" text,
	"affected_rows" integer,
	"executed_by" text,
	"rollback_of" varchar,
	"sql_executed" text,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "mlt_analytics_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"session_id" text,
	"event_type" text NOT NULL,
	"event_category" text NOT NULL,
	"event_action" text NOT NULL,
	"event_label" text,
	"event_value" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"page" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_blog_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" jsonb DEFAULT '[]'::jsonb,
	"discipline" text,
	"tags" text[] DEFAULT '{}'::text[],
	"country_track" text DEFAULT 'both',
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"related_lesson_ids" text[] DEFAULT '{}'::text[],
	"related_flashcard_ids" text[] DEFAULT '{}'::text[],
	"read_time" integer DEFAULT 5,
	"author_name" text,
	"featured_image" text,
	"status" text DEFAULT 'draft',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mlt_blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mlt_cat_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"min_questions" integer DEFAULT 60,
	"max_questions" integer DEFAULT 130,
	"time_limit" integer DEFAULT 150,
	"stability_threshold" double precision DEFAULT 0.3,
	"exposure_max" double precision DEFAULT 0.25,
	"content_targets" jsonb DEFAULT '{}'::jsonb,
	"ability_cap_per_question" double precision DEFAULT 0.5,
	"rapid_guess_threshold_ms" integer DEFAULT 3000,
	"no_backtracking" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_content_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" varchar NOT NULL,
	"primary_lesson_id" varchar,
	"related_lesson_ids" jsonb DEFAULT '[]'::jsonb,
	"primary_deck_id" varchar,
	"related_deck_ids" jsonb DEFAULT '[]'::jsonb,
	"remediation_lesson_id" varchar,
	"remediation_deck_id" varchar,
	"auto_link_score" integer DEFAULT 0,
	"manually_curated" boolean DEFAULT false,
	"curated_by" varchar,
	"curated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_disciplines" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"short_label" text,
	"icon" text,
	"color_hex" text,
	"description" text,
	"subdisciplines" jsonb DEFAULT '[]'::jsonb,
	"blueprint_categories_canada" jsonb DEFAULT '[]'::jsonb,
	"blueprint_categories_usa" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mlt_disciplines_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "mlt_exam_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"mode" text NOT NULL,
	"country" text NOT NULL,
	"sub_mode" text,
	"practice_mode" text,
	"total_questions" integer NOT NULL,
	"time_limit" integer NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"score" integer,
	"correct_count" integer,
	"ability_estimate" double precision DEFAULT 0,
	"ability_history" jsonb DEFAULT '[]'::jsonb,
	"response_history" jsonb DEFAULT '[]'::jsonb,
	"question_ids" jsonb DEFAULT '[]'::jsonb,
	"flagged_ids" jsonb DEFAULT '[]'::jsonb,
	"coverage_achieved" jsonb DEFAULT '{}'::jsonb,
	"weak_area_map" jsonb DEFAULT '{}'::jsonb,
	"strong_area_map" jsonb DEFAULT '{}'::jsonb,
	"stability_score" double precision DEFAULT 1,
	"cat_params" jsonb,
	"report" jsonb,
	"topics" text[] DEFAULT '{}'::text[],
	"current_index" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mlt_flashcards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discipline" text NOT NULL,
	"country_track" text DEFAULT 'both' NOT NULL,
	"deck_title" text NOT NULL,
	"card_type" text DEFAULT 'term-definition' NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"hint" text,
	"mnemonic" text,
	"image_url" text,
	"image_alt" text,
	"tags" text[] DEFAULT '{}'::text[],
	"difficulty" text DEFAULT 'intermediate',
	"sort_order" integer DEFAULT 0,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_generation_batches" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_track" text DEFAULT 'both' NOT NULL,
	"requested_count" integer NOT NULL,
	"generated_count" integer DEFAULT 0,
	"accepted_count" integer DEFAULT 0,
	"rejected_count" integer DEFAULT 0,
	"tokens_used" integer DEFAULT 0,
	"discipline" text,
	"discipline_breakdown" jsonb,
	"difficulty_breakdown" jsonb,
	"cognitive_breakdown" jsonb,
	"rejection_reasons" jsonb,
	"status" text DEFAULT 'running',
	"error_message" text,
	"triggered_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mlt_image_drill_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"drill_type" text NOT NULL,
	"discipline" text NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_count" integer DEFAULT 0,
	"time_spent" integer,
	"answers" jsonb DEFAULT '[]'::jsonb,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_import_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_type" text NOT NULL,
	"file_name" text,
	"total_rows" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"warning_count" integer DEFAULT 0 NOT NULL,
	"duplicate_count" integer DEFAULT 0 NOT NULL,
	"imported_ids" jsonb DEFAULT '[]'::jsonb,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"warnings" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'completed' NOT NULL,
	"imported_by" varchar,
	"rolled_back" boolean DEFAULT false,
	"rolled_back_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_lab_image_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_id" varchar NOT NULL,
	"linked_type" text NOT NULL,
	"linked_id" varchar NOT NULL,
	"role" text DEFAULT 'primary',
	"layout_type" text DEFAULT 'single',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_lab_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"optimized_url" text,
	"alt_text" text,
	"caption" text,
	"image_type" text DEFAULT 'hematology_cell_morphology' NOT NULL,
	"discipline" text DEFAULT 'hematology' NOT NULL,
	"specimen" text,
	"stain_type" text,
	"organism" text,
	"cell_type" text,
	"crystal_type" text,
	"cast_type" text,
	"artifact_type" text,
	"annotation_data" jsonb DEFAULT '[]'::jsonb,
	"copyright_info" text,
	"license_type" text DEFAULT 'internal',
	"tags" text[] DEFAULT '{}'::text[],
	"approval_exam" boolean DEFAULT false,
	"approval_lesson" boolean DEFAULT false,
	"approval_flashcard" boolean DEFAULT false,
	"approval_public" boolean DEFAULT false,
	"quality_score" integer DEFAULT 0,
	"magnification" text,
	"normal_abnormal" text DEFAULT 'abnormal',
	"clinical_significance" text,
	"file_name" text,
	"file_size" integer,
	"width" integer,
	"height" integer,
	"mime_type" text,
	"uploaded_by" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_lessons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"module_title" text NOT NULL,
	"topic_title" text NOT NULL,
	"discipline" text NOT NULL,
	"disciplines" text[] DEFAULT '{}'::text[],
	"country_track" text DEFAULT 'both' NOT NULL,
	"difficulty" text DEFAULT 'intermediate',
	"blueprint_categories" text[] DEFAULT '{}'::text[],
	"content" jsonb DEFAULT '[]'::jsonb,
	"summary" text,
	"objectives" text[] DEFAULT '{}'::text[],
	"glossary_terms" jsonb DEFAULT '[]'::jsonb,
	"end_of_lesson_quiz_id" varchar,
	"related_lesson_ids" text[] DEFAULT '{}'::text[],
	"estimated_minutes" integer DEFAULT 15,
	"sort_order" integer DEFAULT 0,
	"tier" text DEFAULT 'free',
	"status" text DEFAULT 'draft',
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mlt_lessons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mlt_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_track" text DEFAULT 'both' NOT NULL,
	"exam_track" text DEFAULT 'both' NOT NULL,
	"discipline" text NOT NULL,
	"subdiscipline" text,
	"blueprint_category" text,
	"difficulty" text DEFAULT 'intermediate' NOT NULL,
	"cognitive_level" text DEFAULT 'application' NOT NULL,
	"stem" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_answer" text NOT NULL,
	"rationale" text NOT NULL,
	"distractor_rationales" jsonb DEFAULT '{}'::jsonb,
	"tags" text[] DEFAULT '{}'::text[],
	"adaptive_eligible" boolean DEFAULT true,
	"exam_eligible" boolean DEFAULT true,
	"image_url" text,
	"image_alt" text,
	"image_caption" text,
	"has_image_stimulus" boolean DEFAULT false,
	"references" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_remediation_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"content_id" varchar NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_remediation_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" text NOT NULL,
	"source_id" varchar NOT NULL,
	"target_type" text NOT NULL,
	"target_id" varchar NOT NULL,
	"discipline" text NOT NULL,
	"topic" text,
	"subtopic" text,
	"relevance_score" double precision DEFAULT 0,
	"match_type" text DEFAULT 'auto',
	"tags" text[] DEFAULT '{}'::text[],
	"admin_override" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_study_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"country_track" text DEFAULT 'both' NOT NULL,
	"exam_track" text DEFAULT 'both' NOT NULL,
	"duration_weeks" integer DEFAULT 8 NOT NULL,
	"difficulty" text DEFAULT 'intermediate',
	"weekly_plan" jsonb DEFAULT '[]'::jsonb,
	"checkpoints" jsonb DEFAULT '[]'::jsonb,
	"resource_links" jsonb DEFAULT '[]'::jsonb,
	"disciplines" text[] DEFAULT '{}'::text[],
	"description" text,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mlt_wrong_answers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"discipline" text NOT NULL,
	"subdiscipline" text,
	"selected_answer" text NOT NULL,
	"correct_answer" text NOT NULL,
	"stem" text NOT NULL,
	"rationale" text,
	"tags" text[] DEFAULT '{}'::text[],
	"reviewed" boolean DEFAULT false,
	"bookmarked" boolean DEFAULT false,
	"retry_count" integer DEFAULT 0,
	"last_retry_correct" boolean,
	"source_type" text DEFAULT 'practice',
	"source_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"tier" text DEFAULT 'rpn' NOT NULL,
	"total_questions" integer NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"score" integer,
	"time_spent" integer,
	"questions" jsonb DEFAULT '[]'::jsonb,
	"answers" jsonb DEFAULT '{}'::jsonb,
	"flagged" jsonb DEFAULT '[]'::jsonb,
	"report" jsonb DEFAULT '{}'::jsonb,
	"career_type" text DEFAULT 'nursing',
	"exam_type" text DEFAULT 'practice',
	"cat_state" jsonb,
	"blueprint_coverage_state" jsonb,
	"review_unlocked" boolean DEFAULT false,
	"timer_state" jsonb,
	"stopping_rule_status" text,
	"blueprint_code" text,
	"blueprint_meta" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mock_exam_credit_ledger" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"credit_type" text DEFAULT 'MOCK_OFFICIAL' NOT NULL,
	"scope" text NOT NULL,
	"quantity" integer NOT NULL,
	"source_purchase_id" varchar,
	"session_id" varchar,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_definitions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"specialty" text NOT NULL,
	"exam_number" integer DEFAULT 1 NOT NULL,
	"title" text NOT NULL,
	"question_ids" jsonb DEFAULT '[]'::jsonb,
	"difficulty_level" text DEFAULT 'mixed' NOT NULL,
	"category_tags" jsonb DEFAULT '[]'::jsonb,
	"answer_key" jsonb DEFAULT '{}'::jsonb,
	"rationale_ids" jsonb DEFAULT '[]'::jsonb,
	"time_limit" integer DEFAULT 150 NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb,
	"total_questions" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"credit_type" text DEFAULT 'MOCK_OFFICIAL' NOT NULL,
	"scope" text NOT NULL,
	"credits_granted" integer NOT NULL,
	"price_in_cents" integer NOT NULL,
	"stripe_price_id" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mock_exam_products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "mock_exam_purchases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_id" varchar,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount_in_cents" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_session_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"attempt_id" varchar NOT NULL,
	"current_question_index" integer DEFAULT 0,
	"answered_count" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"incorrect_count" integer DEFAULT 0,
	"flagged_questions" jsonb DEFAULT '[]'::jsonb,
	"time_remaining" integer,
	"status" text DEFAULT 'in_progress',
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" text NOT NULL,
	"exam_code" text NOT NULL,
	"exam_name" text NOT NULL,
	"template_name" text NOT NULL,
	"description" text,
	"question_count" integer NOT NULL,
	"time_limit_minutes" integer NOT NULL,
	"difficulty_distribution" jsonb NOT NULL,
	"domain_weights" jsonb NOT NULL,
	"format_mix" jsonb NOT NULL,
	"passing_standard" integer DEFAULT 65,
	"seed" integer DEFAULT 0,
	"tier" text NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mock_exam_templates_template_id_unique" UNIQUE("template_id")
);
--> statement-breakpoint
CREATE TABLE "new_grad_guides" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"profession" text NOT NULL,
	"guide_type" text NOT NULL,
	"category" text,
	"summary" text,
	"content" jsonb DEFAULT '[]'::jsonb,
	"sections" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" text[] DEFAULT '{}'::text[],
	"faq_items" jsonb DEFAULT '[]'::jsonb,
	"related_guide_ids" text[] DEFAULT '{}'::text[],
	"is_premium" boolean DEFAULT false,
	"status" text DEFAULT 'draft',
	"tags" text[] DEFAULT '{}'::text[],
	"author_name" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "new_grad_guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "new_grad_interview_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"question" text NOT NULL,
	"sample_answer" text,
	"tips" text,
	"difficulty" text DEFAULT 'moderate',
	"is_premium" boolean DEFAULT false,
	"status" text DEFAULT 'published',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "new_grad_interview_simulations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text DEFAULT 'intermediate' NOT NULL,
	"question_count" integer DEFAULT 0 NOT NULL,
	"estimated_minutes" integer DEFAULT 30 NOT NULL,
	"question_ids" text[] DEFAULT '{}'::text[],
	"metadata" jsonb,
	"is_premium" boolean DEFAULT false,
	"status" text DEFAULT 'published',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "new_grad_mock_interview_tests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text DEFAULT 'intermediate' NOT NULL,
	"question_count" integer DEFAULT 0 NOT NULL,
	"time_limit" integer DEFAULT 60 NOT NULL,
	"question_ids" text[] DEFAULT '{}'::text[],
	"supports_randomization" boolean DEFAULT true,
	"metadata" jsonb,
	"is_premium" boolean DEFAULT true,
	"status" text DEFAULT 'published',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "new_grad_scenario_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"format_type" text DEFAULT 'scenario' NOT NULL,
	"category_group" text NOT NULL,
	"subcategory" text NOT NULL,
	"scenario_prompt" text NOT NULL,
	"question" text NOT NULL,
	"example_answer" text NOT NULL,
	"feedback" text,
	"star_breakdown" jsonb,
	"difficulty" text DEFAULT 'intermediate' NOT NULL,
	"is_premium" boolean DEFAULT false,
	"status" text DEFAULT 'published',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "new_grad_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"template_type" text NOT NULL,
	"category" text,
	"description" text,
	"content" jsonb DEFAULT '{}'::jsonb,
	"preview_content" text,
	"is_premium" boolean DEFAULT true,
	"status" text DEFAULT 'published',
	"tags" text[] DEFAULT '{}'::text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "new_grad_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "new_grad_testimonials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"profession" text NOT NULL,
	"role" text,
	"organization" text,
	"content" text NOT NULL,
	"rating" integer DEFAULT 5,
	"avatar_url" text,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lesson_id" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ops_incidents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"severity" text DEFAULT 'warning' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"source" text,
	"affected_services" text[] DEFAULT '{}'::text[],
	"assigned_to" varchar,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"resolution_notes" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orchestrator_routing_decisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"content_id" varchar,
	"request_path" text,
	"attempted_tier" text NOT NULL,
	"delivered_tier" text NOT NULL,
	"failure_reason" text,
	"response_time_ms" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" varchar,
	"page" text NOT NULL,
	"platform_section" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"device_type" text,
	"browser" text,
	"os" text,
	"country" text,
	"duration" integer DEFAULT 0,
	"is_checkout_intent" boolean DEFAULT false,
	"is_pricing_view" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views_daily" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"path" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paramedic_bulk_import_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_id" varchar NOT NULL,
	"row_index" integer NOT NULL,
	"content_type" text NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"raw_data" jsonb NOT NULL,
	"mapped_data" jsonb,
	"normalized_data" jsonb,
	"validation_status" text DEFAULT 'pending',
	"validation_errors" jsonb,
	"published_id" varchar,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paramedic_bulk_imports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"input_format" text NOT NULL,
	"total_items" integer DEFAULT 0 NOT NULL,
	"valid_items" integer DEFAULT 0,
	"error_items" integer DEFAULT 0,
	"published_items" integer DEFAULT 0,
	"status" text DEFAULT 'draft',
	"mapping_template" jsonb,
	"validation_results" jsonb,
	"admin_id" varchar,
	"admin_name" text,
	"rollback_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "paramedic_category_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"profession_track" text DEFAULT 'paramedic' NOT NULL,
	"region" text DEFAULT 'BOTH',
	"visibility_tier" text DEFAULT 'free',
	"difficulty" text DEFAULT 'intermediate',
	"exam_relevance" text DEFAULT 'medium',
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"seo_title" text,
	"meta_description" text,
	"canonical_url" text,
	"description" text,
	"hero_image" text,
	"featured_topic_ids" text[] DEFAULT '{}'::text[],
	"sort_order" integer DEFAULT 0,
	"is_cornerstone" boolean DEFAULT false,
	"is_noindex" boolean DEFAULT false,
	"manual_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "paramedic_category_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paramedic_comparison_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"profession_track" text DEFAULT 'paramedic' NOT NULL,
	"region" text DEFAULT 'BOTH',
	"visibility_tier" text DEFAULT 'free',
	"difficulty" text DEFAULT 'intermediate',
	"exam_relevance" text DEFAULT 'high',
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"seo_title" text,
	"meta_description" text,
	"canonical_url" text,
	"item_a" text DEFAULT '' NOT NULL,
	"item_b" text DEFAULT '' NOT NULL,
	"comparison_points" jsonb DEFAULT '[]'::jsonb,
	"summary" text,
	"faq" jsonb DEFAULT '[]'::jsonb,
	"category_id" varchar,
	"is_cornerstone" boolean DEFAULT false,
	"is_noindex" boolean DEFAULT false,
	"manual_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "paramedic_comparison_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paramedic_exam_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"mode" text NOT NULL,
	"exam_type" text NOT NULL,
	"total_questions" integer NOT NULL,
	"time_limit" integer,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"current_index" integer DEFAULT 0,
	"score" integer,
	"correct_count" integer,
	"question_ids" jsonb DEFAULT '[]'::jsonb,
	"answers" jsonb DEFAULT '{}'::jsonb,
	"flagged_ids" jsonb DEFAULT '[]'::jsonb,
	"question_meta" jsonb DEFAULT '[]'::jsonb,
	"ability_estimate" double precision DEFAULT 0,
	"drill_topic" text,
	"drill_streak" integer DEFAULT 0,
	"drill_best_streak" integer DEFAULT 0,
	"report" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "paramedic_field_mapping_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"content_type" text NOT NULL,
	"mappings" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paramedic_glossary_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"profession_track" text DEFAULT 'paramedic' NOT NULL,
	"region" text DEFAULT 'BOTH',
	"visibility_tier" text DEFAULT 'free',
	"difficulty" text DEFAULT 'beginner',
	"exam_relevance" text DEFAULT 'medium',
	"status" text DEFAULT 'draft' NOT NULL,
	"term" text NOT NULL,
	"slug" text NOT NULL,
	"seo_title" text,
	"meta_description" text,
	"canonical_url" text,
	"definition" text DEFAULT '' NOT NULL,
	"extended_description" text,
	"abbreviation" text,
	"related_term_slugs" text[] DEFAULT '{}'::text[],
	"category_id" varchar,
	"usage_examples" jsonb DEFAULT '[]'::jsonb,
	"is_cornerstone" boolean DEFAULT false,
	"is_noindex" boolean DEFAULT false,
	"manual_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "paramedic_glossary_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paramedic_scenarios" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"profession_track" text DEFAULT 'General' NOT NULL,
	"region" text DEFAULT 'BOTH',
	"visibility_tier" text DEFAULT 'free',
	"difficulty" integer DEFAULT 3 NOT NULL,
	"exam_relevance" text DEFAULT 'medium',
	"category" text DEFAULT 'Medical Emergencies' NOT NULL,
	"dispatch_info" text NOT NULL,
	"scene_description" text NOT NULL,
	"scene_safety" text NOT NULL,
	"primary_assessment" text NOT NULL,
	"secondary_assessment" text NOT NULL,
	"vital_signs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"history" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"decision_points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_interventions" text[] DEFAULT '{}'::text[],
	"common_errors" text[] DEFAULT '{}'::text[],
	"debrief" text DEFAULT '' NOT NULL,
	"learning_objectives" text[] DEFAULT '{}'::text[],
	"related_lesson_slugs" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paramedic_scenarios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paramedic_study_guides" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"profession_track" text DEFAULT 'paramedic' NOT NULL,
	"region" text DEFAULT 'BOTH',
	"visibility_tier" text DEFAULT 'free',
	"difficulty" text DEFAULT 'intermediate',
	"exam_relevance" text DEFAULT 'high',
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"seo_title" text,
	"meta_description" text,
	"canonical_url" text,
	"estimated_minutes" integer DEFAULT 30,
	"objectives" jsonb DEFAULT '[]'::jsonb,
	"sections" jsonb DEFAULT '[]'::jsonb,
	"checklist" jsonb DEFAULT '[]'::jsonb,
	"faq" jsonb DEFAULT '[]'::jsonb,
	"mini_quiz" jsonb DEFAULT '[]'::jsonb,
	"related_lesson_ids" text[] DEFAULT '{}'::text[],
	"category_id" varchar,
	"is_cornerstone" boolean DEFAULT false,
	"is_noindex" boolean DEFAULT false,
	"manual_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "paramedic_study_guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paramedic_topic_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"profession_track" text DEFAULT 'paramedic' NOT NULL,
	"region" text DEFAULT 'BOTH',
	"visibility_tier" text DEFAULT 'free',
	"difficulty" text DEFAULT 'intermediate',
	"exam_relevance" text DEFAULT 'medium',
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"seo_title" text,
	"meta_description" text,
	"canonical_url" text,
	"target_keyword" text,
	"secondary_keywords" text[] DEFAULT '{}'::text[],
	"category_id" varchar,
	"sections" jsonb DEFAULT '[]'::jsonb,
	"faq" jsonb DEFAULT '[]'::jsonb,
	"exam_tips" jsonb DEFAULT '[]'::jsonb,
	"clinical_pearls" jsonb DEFAULT '[]'::jsonb,
	"related_lesson_ids" text[] DEFAULT '{}'::text[],
	"is_cornerstone" boolean DEFAULT false,
	"is_noindex" boolean DEFAULT false,
	"word_count" integer DEFAULT 0,
	"manual_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "paramedic_topic_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "paramedic_waveform_assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"waveform_type" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"svg_path_data" jsonb NOT NULL,
	"clinical_annotations" jsonb DEFAULT '{}'::jsonb,
	"identifying_features" text[] DEFAULT '{}'::text[],
	"associated_conditions" text[] DEFAULT '{}'::text[],
	"treatment_notes" text,
	"rate" text,
	"regularity" text,
	"clinical_significance" text,
	"difficulty" text DEFAULT 'beginner',
	"visibility_tier" text DEFAULT 'free',
	"content_domain" text DEFAULT 'paramedic' NOT NULL,
	"sort_order" integer DEFAULT 0,
	"status" text DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paramedic_waveform_assets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "pharmtech_adaptive_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"status" text DEFAULT 'active' NOT NULL,
	"total_answered" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"current_difficulty" integer DEFAULT 3,
	"responses" jsonb DEFAULT '[]'::jsonb,
	"category_stats" jsonb DEFAULT '{}'::jsonb,
	"mastery_levels" jsonb DEFAULT '{}'::jsonb,
	"weak_areas" jsonb DEFAULT '[]'::jsonb,
	"difficulty_progression" jsonb DEFAULT '[]'::jsonb,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pharmtech_exam_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"exam_id" varchar NOT NULL,
	"mode" text DEFAULT 'timed' NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb,
	"flagged" jsonb DEFAULT '[]'::jsonb,
	"score" integer,
	"total_questions" integer NOT NULL,
	"time_spent_seconds" integer,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pharmtech_exams" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"external_id" text,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"question_ids" text[] DEFAULT '{}'::text[],
	"time_limit_minutes" integer DEFAULT 60,
	"passing_score" integer DEFAULT 70,
	"published" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pharmtech_exams_slug_unique" UNIQUE("slug"),
	CONSTRAINT "pharmtech_exams_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pharmtech_flashcard_decks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"external_id" text,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"category" text NOT NULL,
	"lesson_slug" text,
	"cert_context" text DEFAULT 'BOTH' NOT NULL,
	"card_count" integer DEFAULT 0,
	"published" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pharmtech_flashcard_decks_slug_unique" UNIQUE("slug"),
	CONSTRAINT "pharmtech_flashcard_decks_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pharmtech_flashcards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" varchar NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pharmtech_lessons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"external_id" text,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"summary" text,
	"body" text DEFAULT '' NOT NULL,
	"objectives" text[] DEFAULT '{}'::text[],
	"key_points" text[] DEFAULT '{}'::text[],
	"common_mistakes" text[] DEFAULT '{}'::text[],
	"related_deck_slugs" text[] DEFAULT '{}'::text[],
	"cert_context" text DEFAULT 'BOTH' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pharmtech_lessons_slug_unique" UNIQUE("slug"),
	CONSTRAINT "pharmtech_lessons_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pharmtech_mastery_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"category" text NOT NULL,
	"total_attempted" integer DEFAULT 0,
	"total_correct" integer DEFAULT 0,
	"accuracy" double precision DEFAULT 0,
	"mastery_level" text DEFAULT 'Beginner',
	"last_session_id" varchar,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pharmtech_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text,
	"stem" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"rationale" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" integer DEFAULT 2 NOT NULL,
	"lesson_slug" text,
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pharmtech_questions_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "pharmtech_study_plan_tasks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" varchar NOT NULL,
	"week_num" integer NOT NULL,
	"day_num" integer NOT NULL,
	"phase" text NOT NULL,
	"task_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"link_url" text,
	"estimated_minutes" integer DEFAULT 15,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"skipped" boolean DEFAULT false,
	"rescheduled_to" text,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "pharmtech_study_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"exam_date" timestamp,
	"days_per_week" integer DEFAULT 5,
	"minutes_per_session" integer DEFAULT 30,
	"pace" text DEFAULT 'balanced',
	"learning_style" text DEFAULT 'mixed',
	"weak_areas" jsonb DEFAULT '[]'::jsonb,
	"use_adaptive_results" boolean DEFAULT false,
	"preset_type" text,
	"schedule" jsonb DEFAULT '[]'::jsonb,
	"progress_percent" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pinterest_pins" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"hashtags" jsonb DEFAULT '[]'::jsonb,
	"image_url" text,
	"link_url" text,
	"pin_type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"scheduled_for" timestamp,
	"published_at" timestamp,
	"pinterest_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_incidents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" text NOT NULL,
	"type" text NOT NULL,
	"severity" text DEFAULT 'warning' NOT NULL,
	"user_id" varchar,
	"route" text,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_incidents_incident_id_unique" UNIQUE("incident_id")
);
--> statement-breakpoint
CREATE TABLE "practice_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"exam_key" text NOT NULL,
	"domain" text NOT NULL,
	"keyword" text NOT NULL,
	"title" text NOT NULL,
	"intro_content" text,
	"questions" jsonb DEFAULT '[]'::jsonb,
	"faq_schema" jsonb DEFAULT '{}'::jsonb,
	"breadcrumb_schema" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "practice_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "practice_quiz_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"meta_description" text NOT NULL,
	"h1" text NOT NULL,
	"intro_text" text,
	"topic" text NOT NULL,
	"subtopic" text,
	"body_system" text,
	"career_type" text DEFAULT 'nursing',
	"exam_type" text,
	"difficulty" text DEFAULT 'mixed',
	"question_count" integer DEFAULT 10,
	"question_ids" text[] DEFAULT '{}'::text[],
	"related_page_slugs" text[] DEFAULT '{}'::text[],
	"keywords" text[] DEFAULT '{}'::text[],
	"structured_data" jsonb DEFAULT '{}'::jsonb,
	"is_auto_generated" boolean DEFAULT true,
	"status" text DEFAULT 'published',
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "practice_quiz_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "practice_recommendations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"recommendations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "practice_recommendations_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "pricing_offers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offer_type" text NOT NULL,
	"tier" text NOT NULL,
	"price" double precision NOT NULL,
	"currency" text DEFAULT 'USD',
	"duration_days" integer,
	"discount_percent" integer DEFAULT 0,
	"eligibility_rules" jsonb DEFAULT '{}'::jsonb,
	"localized_copy" jsonb DEFAULT '{}'::jsonb,
	"enabled" boolean DEFAULT true,
	"career_type" text DEFAULT 'nursing',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" text NOT NULL,
	"duration" text NOT NULL,
	"plan_name" text,
	"description" text,
	"is_lifetime" boolean DEFAULT false,
	"price_cad" integer NOT NULL,
	"price_usd" integer NOT NULL,
	"stripe_price_id_usd" text,
	"stripe_price_id_cad" text,
	"is_enabled" boolean DEFAULT true,
	"is_popular" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_founding_price" boolean DEFAULT false,
	"feature_list" jsonb DEFAULT '[]'::jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_url" text NOT NULL,
	"page_title" text,
	"site_section" text,
	"content_id" text,
	"user_id" varchar,
	"problem_type" text NOT NULL,
	"description" text NOT NULL,
	"email" text,
	"severity" text DEFAULT 'medium',
	"contact_permission" boolean DEFAULT false,
	"device_type" text,
	"browser_info" text,
	"locale" text,
	"tier" text,
	"screenshot_url" text,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_generations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"template" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"target_count" integer NOT NULL,
	"created_count" integer DEFAULT 0 NOT NULL,
	"chunk_size" integer DEFAULT 15 NOT NULL,
	"model" text DEFAULT 'gpt-4o-mini',
	"prompt_base" text,
	"prompt_state" jsonb,
	"topic" text,
	"exam_target" text,
	"difficulty" text DEFAULT 'mixed',
	"question_types" jsonb,
	"region" text DEFAULT 'BOTH',
	"settings" jsonb,
	"last_error" text,
	"started_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_purchases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"stripe_session_id" text,
	"purchase_date" timestamp DEFAULT now() NOT NULL,
	"download_count" integer DEFAULT 0,
	"max_downloads" integer DEFAULT 5
);
--> statement-breakpoint
CREATE TABLE "professions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'BookOpen',
	"color" text DEFAULT '#6C63FF',
	"color_accent" text DEFAULT '#E8E6FF',
	"route_prefix" text NOT NULL,
	"exam_names" text[] DEFAULT '{}'::text[],
	"domains" text[] DEFAULT '{}'::text[],
	"tiers" jsonb DEFAULT '[]'::jsonb,
	"modules" jsonb DEFAULT '{"lessons":true,"flashcards":true,"practiceExams":true,"adaptiveExams":true,"imageAssets":true,"seoPages":true,"studyPacks":true}'::jsonb,
	"pricing" jsonb DEFAULT '{}'::jsonb,
	"country" text DEFAULT 'ALL',
	"status" text DEFAULT 'draft',
	"sort_order" integer DEFAULT 0,
	"question_count" integer DEFAULT 0,
	"user_count" integer DEFAULT 0,
	"image_url" text,
	"hub_title" text,
	"hub_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"launched_at" timestamp,
	CONSTRAINT "professions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "programmatic_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_type" text NOT NULL,
	"source_content_id" varchar NOT NULL,
	"source_content_type" text NOT NULL,
	"career_track" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"content_sections" jsonb DEFAULT '[]'::jsonb,
	"faq_json" jsonb DEFAULT '[]'::jsonb,
	"related_content_links" jsonb DEFAULT '[]'::jsonb,
	"sibling_links" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'published' NOT NULL,
	"gating_level" text DEFAULT 'public' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "programmatic_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "provisional_access_grants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"reason" text NOT NULL,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"granted_by" text DEFAULT 'system',
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "publish_validation_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"content_type" text NOT NULL,
	"action" text NOT NULL,
	"passed" boolean NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"warnings" jsonb DEFAULT '[]'::jsonb,
	"repair_report" jsonb DEFAULT '{}'::jsonb,
	"previous_version_id" varchar,
	"artifacts_generated" integer DEFAULT 0,
	"actor_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publishing_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"engine_key" varchar NOT NULL,
	"content_type" text NOT NULL,
	"title" text NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"preview_url" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_by" varchar,
	"approved_by" varchar,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"reminder_time" text DEFAULT '09:00',
	"enable_daily_reminder" boolean DEFAULT true,
	"enable_exam_reminder" boolean DEFAULT true,
	"enable_flashcard_reminder" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "qbank_drafts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"exam" text DEFAULT 'rex-pn' NOT NULL,
	"topic" text NOT NULL,
	"mixed_blueprint" boolean DEFAULT false,
	"requested_count" integer DEFAULT 300 NOT NULL,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"distribution_json" jsonb,
	"topic_mix" jsonb,
	"canadian_context" boolean DEFAULT true,
	"output_language" text DEFAULT 'en',
	"editions_json" jsonb,
	"questions_json" jsonb,
	"audit_json" jsonb,
	"base_prompt" text,
	"patch_prompts" jsonb,
	"version" integer DEFAULT 1,
	"status" text DEFAULT 'draft' NOT NULL,
	"price" integer DEFAULT 1499,
	"study_edition_price" integer DEFAULT 2499,
	"published_product_id" varchar,
	"published_study_product_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qbank_drafts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "qbank_generation_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" varchar NOT NULL,
	"template_key" text NOT NULL,
	"variant_key" text NOT NULL,
	"exam_key" text NOT NULL,
	"region" text NOT NULL,
	"target_count" integer NOT NULL,
	"generated_count" integer DEFAULT 0,
	"accepted_count" integer DEFAULT 0,
	"rejected_count" integer DEFAULT 0,
	"status" text DEFAULT 'queued',
	"is_dry_run" boolean DEFAULT true,
	"ingested" boolean DEFAULT false,
	"validation_report" jsonb,
	"preview_items" jsonb,
	"generated_items" jsonb,
	"token_cost" integer DEFAULT 0,
	"model" text DEFAULT 'gpt-4o-mini',
	"error_message" text,
	"triggered_by" text DEFAULT 'manual',
	"schedule_id" varchar,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qbank_generation_schedules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"template_key" text NOT NULL,
	"variant_key" text NOT NULL,
	"exam_key" text NOT NULL,
	"region" text NOT NULL,
	"questions_per_run" integer DEFAULT 25,
	"rationale_min_words" integer DEFAULT 250,
	"frequency" text DEFAULT 'daily',
	"custom_cron_days" jsonb,
	"run_time_hour" integer DEFAULT 3,
	"enabled" boolean DEFAULT false,
	"auto_ingest" boolean DEFAULT false,
	"max_daily_runs" integer DEFAULT 1,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"total_runs_completed" integer DEFAULT 0,
	"total_questions_generated" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "qbank_prompt_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"version" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"system_prompt" text NOT NULL,
	"user_prompt_template" text NOT NULL,
	"variants" jsonb,
	"validation_rules" jsonb,
	"output_schema_version" text DEFAULT 'v1',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "qbank_prompt_templates_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "qbank_recipes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"exam" text DEFAULT 'rex-pn' NOT NULL,
	"topic" text NOT NULL,
	"mixed_blueprint" boolean DEFAULT false,
	"requested_count" integer DEFAULT 300 NOT NULL,
	"difficulty" text DEFAULT 'medium' NOT NULL,
	"distribution_json" jsonb,
	"canadian_context" boolean DEFAULT true,
	"editions_json" jsonb,
	"price" integer DEFAULT 1499,
	"study_edition_price" integer DEFAULT 2499,
	"auto_publish" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_run_at" timestamp,
	"last_run_status" text,
	"run_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qc_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text NOT NULL,
	"cluster_id" varchar,
	"article_id" varchar,
	"asset_id" varchar,
	"passed" boolean NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qotd_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_date" text NOT NULL,
	"tier" text DEFAULT 'rpn' NOT NULL,
	"question_text" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correct_index" integer NOT NULL,
	"rationale" text NOT NULL,
	"body_system" text,
	"lesson_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "qotd_history_question_date_unique" UNIQUE("question_date")
);
--> statement-breakpoint
CREATE TABLE "qotd_streaks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"total_answered" integer DEFAULT 0 NOT NULL,
	"total_correct" integer DEFAULT 0 NOT NULL,
	"last_answer_date" text,
	CONSTRAINT "qotd_streaks_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "qotd_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translation_status" "translation_status_enum" DEFAULT 'missing' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"translated_at" timestamp,
	"reviewed_at" timestamp,
	"question_text" text,
	"options" jsonb,
	"rationale" text
);
--> statement-breakpoint
CREATE TABLE "qotd_user_answers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_date" text NOT NULL,
	"selected_index" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" varchar NOT NULL,
	"total_attempts" integer DEFAULT 0,
	"total_correct" integer DEFAULT 0,
	"percent_correct" double precision DEFAULT 0,
	"unique_user_count" integer DEFAULT 0,
	"difficulty" text,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_bank" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text NOT NULL,
	"correct_answer" text NOT NULL,
	"rationale" text NOT NULL,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"exam_type" text NOT NULL,
	"country" text NOT NULL,
	"question_type" text NOT NULL,
	"client_needs" text NOT NULL,
	"topic" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_bank_import_rows" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_id" varchar NOT NULL,
	"row_number" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"question_id" text,
	"profession" text,
	"country" text,
	"exam_type" text,
	"topic" text,
	"subtopic" text,
	"difficulty" integer,
	"question_type" text,
	"question_text" text,
	"option_a" text,
	"option_b" text,
	"option_c" text,
	"option_d" text,
	"option_e" text,
	"correct_answer" text,
	"rationale" text,
	"image_reference" text,
	"tags" text,
	"eligibility_flags" text,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"warnings" jsonb DEFAULT '[]'::jsonb,
	"duplicate_of" varchar,
	"created_exam_question_id" varchar
);
--> statement-breakpoint
CREATE TABLE "question_bank_imports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"file_format" text NOT NULL,
	"file_size" integer DEFAULT 0,
	"profession_id" varchar,
	"profession_slug" text,
	"status" text DEFAULT 'pending',
	"total_rows" integer DEFAULT 0,
	"valid_rows" integer DEFAULT 0,
	"error_rows" integer DEFAULT 0,
	"warning_rows" integer DEFAULT 0,
	"duplicate_rows" integer DEFAULT 0,
	"imported_rows" integer DEFAULT 0,
	"skipped_rows" integer DEFAULT 0,
	"duplicate_strategy" text DEFAULT 'skip',
	"validation_report" jsonb DEFAULT '{"errors":[],"warnings":[]}'::jsonb,
	"preview_data" jsonb DEFAULT '[]'::jsonb,
	"mapped_topics" jsonb DEFAULT '[]'::jsonb,
	"imported_by" varchar,
	"imported_by_username" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_bank_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"mode" text NOT NULL,
	"exam_type" text NOT NULL,
	"country" text NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_count" integer NOT NULL,
	"time_spent" integer,
	"answers" jsonb DEFAULT '[]'::jsonb,
	"category_breakdown" jsonb DEFAULT '{}'::jsonb,
	"difficulty_breakdown" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_bookmarks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"question_source" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_comment_votes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"vote_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_comments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"thumbs_up_count" integer DEFAULT 0 NOT NULL,
	"thumbs_down_count" integer DEFAULT 0 NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_explanations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" varchar NOT NULL,
	"question_source" text NOT NULL,
	"correct_answer_explanation" text NOT NULL,
	"incorrect_answer_rationale" jsonb DEFAULT '{}'::jsonb,
	"clinical_reasoning" text,
	"key_takeaway" text,
	"mnemonic" text,
	"clinical_pearl" text,
	"reference_source" text,
	"quality_score" jsonb DEFAULT '{}'::jsonb,
	"review_status" text DEFAULT 'pending' NOT NULL,
	"generated_by" text DEFAULT 'manual' NOT NULL,
	"related_content" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"selected_answer" text,
	"was_correct" boolean,
	"rationale_viewed" boolean DEFAULT false,
	"answered_at" timestamp DEFAULT now() NOT NULL,
	"session_id" varchar,
	"source_type" "question_history_source_type" NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "question_schedule_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" varchar NOT NULL,
	"action" text NOT NULL,
	"previous_status" text,
	"new_status" text,
	"actor_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_type_registry" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam" text NOT NULL,
	"question_type" text NOT NULL,
	"display_name" text NOT NULL,
	"is_enabled" boolean DEFAULT true,
	"default_target_count" integer DEFAULT 100,
	"validation_rules" jsonb DEFAULT '{}'::jsonb,
	"weight_percent" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readiness_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"readiness_score" integer DEFAULT 0 NOT NULL,
	"pass_probability" integer DEFAULT 0 NOT NULL,
	"readiness_tier" text DEFAULT 'early_preparation' NOT NULL,
	"exam_type" text DEFAULT 'RN' NOT NULL,
	"factors" jsonb DEFAULT '{}'::jsonb,
	"snapshot_week" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_type" text,
	"session_id" varchar,
	"recommended_courses" jsonb DEFAULT '[]'::jsonb,
	"weakness_snapshot" jsonb DEFAULT '{}'::jsonb,
	"clicked" boolean DEFAULT false,
	"added_to_plan" boolean DEFAULT false,
	"completed" boolean DEFAULT false,
	"performance_change_after" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "release_checks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"release_version" text NOT NULL,
	"check_name" text NOT NULL,
	"check_type" text DEFAULT 'automated' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"result" text,
	"details" jsonb DEFAULT '{}'::jsonb,
	"overridden_by" varchar,
	"override_reason" text,
	"executed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reliability_alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alert_type" text NOT NULL,
	"severity" text DEFAULT 'warning' NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"acknowledged" boolean DEFAULT false,
	"acknowledged_by" varchar,
	"acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "render_payloads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"payload_type" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"data" jsonb NOT NULL,
	"html_snapshot" text,
	"validated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rescue_action_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_user_id" varchar NOT NULL,
	"target_username" text,
	"actor_id" varchar NOT NULL,
	"actor_username" text,
	"action_type" text NOT NULL,
	"action_details" jsonb DEFAULT '{}'::jsonb,
	"reason" text,
	"incident_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rescue_actions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscriber_id" varchar,
	"subscriber_email" text,
	"action_type" text NOT NULL,
	"reason" text,
	"template_id" varchar,
	"extension_days" integer,
	"discount_percent" integer,
	"rescue_link" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp,
	"redeemed_at" timestamp,
	"expires_at" timestamp,
	"performed_by" varchar,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revenue_protection_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"username" text,
	"event_type" text NOT NULL,
	"severity" text DEFAULT 'medium',
	"details" jsonb DEFAULT '{}'::jsonb,
	"resolved" boolean DEFAULT false,
	"resolved_by" text,
	"resolved_at" timestamp,
	"action_taken" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"item_type" text NOT NULL,
	"item_id" varchar NOT NULL,
	"reason" text NOT NULL,
	"priority" integer DEFAULT 1,
	"scheduled_date" text NOT NULL,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_decks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"deck_id" varchar NOT NULL,
	"saved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schema_migrations" (
	"version" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"checksum" text,
	"execution_time_ms" integer
);
--> statement-breakpoint
CREATE TABLE "search_performance_snapshots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_date" timestamp NOT NULL,
	"indexed_pages" integer DEFAULT 0,
	"total_impressions" integer DEFAULT 0,
	"total_clicks" integer DEFAULT 0,
	"average_ctr" double precision DEFAULT 0,
	"average_position" double precision DEFAULT 0,
	"top_keywords_json" jsonb DEFAULT '[]'::jsonb,
	"top_pages_json" jsonb DEFAULT '[]'::jsonb,
	"data_source" text DEFAULT 'internal',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"ip_address" text,
	"endpoint" text NOT NULL,
	"event_type" text NOT NULL,
	"request_count" integer DEFAULT 1,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_id" varchar NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"target_keyword" text NOT NULL,
	"search_intent" text DEFAULT 'informational' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"outline_json" jsonb DEFAULT '{}'::jsonb,
	"content_md" text DEFAULT '' NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"reading_level" text,
	"canonical_url" text,
	"requires_infographic" boolean DEFAULT true NOT NULL,
	"requires_pins" boolean DEFAULT true NOT NULL,
	"requires_practice_questions" boolean DEFAULT true NOT NULL,
	"published_at" timestamp,
	"site_context" text DEFAULT 'nursing' NOT NULL,
	"career_track" text,
	"exam_name" text,
	"primary_category" text,
	"secondary_category" text,
	"gating_level" text DEFAULT 'public' NOT NULL,
	"requires_disclaimer" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "seo_clusters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"keyword" text NOT NULL,
	"country_mode" text DEFAULT 'BOTH' NOT NULL,
	"exam_tier" text DEFAULT 'ALL' NOT NULL,
	"pillar_slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"notes" text,
	"site_context" text DEFAULT 'nursing' NOT NULL,
	"career_track" text,
	"career_country_mode" text DEFAULT 'BOTH' NOT NULL,
	"exam_name" text,
	"blueprint_tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_clusters_pillar_slug_unique" UNIQUE("pillar_slug")
);
--> statement-breakpoint
CREATE TABLE "seo_health_checks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"check_type" text NOT NULL,
	"severity" text DEFAULT 'warning',
	"page_slug" text,
	"language_code" text,
	"details" text NOT NULL,
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_hub_page_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translation_status" "translation_status_enum" DEFAULT 'missing' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"translated_at" timestamp,
	"reviewed_at" timestamp,
	"title" text,
	"meta_title" text,
	"meta_description" text,
	"h1" text,
	"content_sections" jsonb,
	"faq_items" jsonb
);
--> statement-breakpoint
CREATE TABLE "seo_hub_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" text NOT NULL,
	"page_type" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text[] DEFAULT '{}'::text[],
	"h1" text,
	"content_sections" jsonb DEFAULT '[]'::jsonb,
	"faq_items" jsonb DEFAULT '[]'::jsonb,
	"internal_links" jsonb DEFAULT '[]'::jsonb,
	"parent_hub" text,
	"related_slugs" text[] DEFAULT '{}'::text[],
	"language" text DEFAULT 'en',
	"status" text DEFAULT 'draft',
	"medically_reviewed_by" text,
	"medically_reviewed_at" timestamp,
	"last_updated_date" text,
	"references" jsonb DEFAULT '[]'::jsonb,
	"practice_question_ids" text[] DEFAULT '{}'::text[],
	"structured_data_type" text DEFAULT 'Article',
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "seo_hub_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "seo_infographics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" varchar NOT NULL,
	"template_id" varchar,
	"type" text NOT NULL,
	"variant" text DEFAULT 'default' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"prompt_used" text DEFAULT '' NOT NULL,
	"width" integer DEFAULT 3000 NOT NULL,
	"height" integer DEFAULT 2000 NOT NULL,
	"file_path" text DEFAULT '' NOT NULL,
	"public_url" text DEFAULT '' NOT NULL,
	"checksum" text,
	"qc_errors" jsonb DEFAULT '[]'::jsonb,
	"site_context" text DEFAULT 'nursing' NOT NULL,
	"career_track" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_internal_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_article_id" varchar NOT NULL,
	"to_article_id" varchar NOT NULL,
	"anchor_text" text NOT NULL,
	"reason" text NOT NULL,
	"placement" text DEFAULT 'body' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_keyword_targets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_code" text NOT NULL,
	"keyword" text NOT NULL,
	"intent" text DEFAULT 'informational',
	"page_target_slug" text,
	"search_volume" integer,
	"difficulty" integer,
	"coverage_status" text DEFAULT 'unmapped',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_page_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_key" text NOT NULL,
	"name" text NOT NULL,
	"page_type" text NOT NULL,
	"section_structure" jsonb DEFAULT '[]'::jsonb,
	"schema_markup_type" text DEFAULT 'Article' NOT NULL,
	"meta_title_pattern" text DEFAULT '{keyword} | NurseNest' NOT NULL,
	"meta_description_pattern" text DEFAULT 'Learn about {keyword} with our comprehensive guide.' NOT NULL,
	"placeholder_blocks" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_page_templates_template_key_unique" UNIQUE("template_key")
);
--> statement-breakpoint
CREATE TABLE "seo_page_translations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seo_page_id" varchar NOT NULL,
	"locale" text NOT NULL,
	"title" text,
	"meta_title" text,
	"meta_description" text,
	"content_html" text,
	"toc_json" jsonb,
	"faq_json" jsonb,
	"translation_status" text DEFAULT 'draft' NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"translated_by" text,
	"reviewed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_pages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_type" text NOT NULL,
	"exam" text,
	"language_code" text DEFAULT 'en' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"content_html" text,
	"toc_json" jsonb,
	"faq_json" jsonb,
	"internal_links_json" jsonb,
	"is_public" boolean DEFAULT true,
	"is_indexable" boolean DEFAULT true,
	"canonical_url" text,
	"translation_status" text DEFAULT 'en_source',
	"page_group_id" varchar,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_pins" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" varchar NOT NULL,
	"infographic_id" varchar,
	"pin_variant" integer NOT NULL,
	"headline" text NOT NULL,
	"bullets_json" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"width" integer DEFAULT 1000 NOT NULL,
	"height" integer DEFAULT 1500 NOT NULL,
	"file_path" text DEFAULT '' NOT NULL,
	"public_url" text DEFAULT '' NOT NULL,
	"qc_errors" jsonb DEFAULT '[]'::jsonb,
	"site_context" text DEFAULT 'nursing' NOT NULL,
	"career_track" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seo_publish_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" varchar NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"priority" integer DEFAULT 50 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"blocked_reason" text,
	"site_context" text DEFAULT 'nursing' NOT NULL,
	"career_track" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_checkpoints" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_type" text NOT NULL,
	"session_id" text NOT NULL,
	"checkpoint_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_recordings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" varchar,
	"actions" jsonb DEFAULT '[]'::jsonb,
	"api_calls" jsonb DEFAULT '[]'::jsonb,
	"state_transitions" jsonb DEFAULT '[]'::jsonb,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"duration" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "site_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_key" text NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_images_image_key_unique" UNIQUE("image_key")
);
--> statement-breakpoint
CREATE TABLE "social_connections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"facebook_page_id" text,
	"facebook_page_name" text,
	"facebook_page_token" text,
	"instagram_business_id" text,
	"instagram_username" text,
	"token_expires_at" timestamp,
	"connected_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "social_connections_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"post_type" text DEFAULT 'qotd',
	"content" text NOT NULL,
	"image_url" text,
	"hashtags" text[] DEFAULT '{}'::text[],
	"status" text DEFAULT 'scheduled',
	"scheduled_at" timestamp,
	"published_at" timestamp,
	"platform_post_id" text,
	"engagement_data" jsonb DEFAULT '{}'::jsonb,
	"tier" text DEFAULT 'rpn',
	"question_data" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spaced_repetition_cards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"card_id" varchar NOT NULL,
	"deck_id" varchar,
	"ease_factor" double precision DEFAULT 2.5,
	"interval" integer DEFAULT 1,
	"repetitions" integer DEFAULT 0,
	"next_review_at" timestamp DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp,
	"status" text DEFAULT 'new',
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_study_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_questions_answered" integer DEFAULT 0,
	"total_correct" integer DEFAULT 0,
	"total_incorrect" integer DEFAULT 0,
	"avg_time_per_question" integer DEFAULT 0,
	"flashcards_studied" integer DEFAULT 0,
	"lessons_viewed" integer DEFAULT 0,
	"practice_exams_completed" integer DEFAULT 0,
	"adaptive_exams_completed" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_study_date" text,
	"weekly_goal_hours" integer DEFAULT 10,
	"weekly_hours_logged" double precision DEFAULT 0,
	"weekly_goal_reset_date" text,
	"total_study_minutes" integer DEFAULT 0,
	"exam_date" timestamp,
	"hours_per_week" integer DEFAULT 10,
	"readiness_score" integer DEFAULT 0,
	"readiness_level" text DEFAULT 'not_ready',
	"pass_probability" integer DEFAULT 0,
	"exam_prep_mode_active" boolean DEFAULT false,
	"exam_followup_completed" boolean DEFAULT false,
	"exam_result_status" text,
	"exam_weak_areas" jsonb DEFAULT '[]'::jsonb,
	"exam_result_date" timestamp,
	"post_exam_offer_shown" boolean DEFAULT false,
	"new_exam_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_study_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "study_group_members" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_groups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"invite_code" text NOT NULL,
	"created_by" varchar NOT NULL,
	"show_ranking" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "study_groups_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "study_milestones" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"milestone_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	"seen" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "study_onboarding" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"tier" text NOT NULL,
	"domain_ratings" jsonb,
	"preferences" jsonb,
	"quiz_results" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_pack_purchases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"pack_id" varchar NOT NULL,
	"stripe_payment_id" text,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'USD',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_packs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"pack_type" text NOT NULL,
	"exam_code" text,
	"tier" text DEFAULT 'rn',
	"description" text,
	"content_html" text,
	"price" double precision NOT NULL,
	"currency" text DEFAULT 'USD',
	"question_count" integer DEFAULT 0,
	"question_tags" jsonb DEFAULT '[]'::jsonb,
	"difficulty_range" text,
	"language_code" text DEFAULT 'en',
	"faq_json" jsonb DEFAULT '[]'::jsonb,
	"meta_title" text,
	"meta_description" text,
	"is_published" boolean DEFAULT false,
	"stripe_price_id" text,
	"purchase_count" integer DEFAULT 0,
	"career_type" text DEFAULT 'nursing',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "study_packs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "study_plan_days" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"study_plan_id" varchar NOT NULL,
	"week_num" integer NOT NULL,
	"day_num" integer NOT NULL,
	"title" text NOT NULL,
	"focus_domains" jsonb,
	"date" timestamp
);
--> statement-breakpoint
CREATE TABLE "study_plan_schedule" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"date" text NOT NULL,
	"phase" text,
	"tasks" jsonb DEFAULT '[]'::jsonb,
	"completed" boolean DEFAULT false,
	"completion_rate" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_plan_tasks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_id" varchar NOT NULL,
	"type" text NOT NULL,
	"domain" text NOT NULL,
	"title" text NOT NULL,
	"minutes" integer NOT NULL,
	"link_url" text,
	"resource_id" text,
	"status" text DEFAULT 'todo',
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "study_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"tier" text NOT NULL,
	"timeframe_weeks" integer DEFAULT 4,
	"minutes_per_day" integer DEFAULT 30,
	"exam_date" timestamp,
	"exam_type" text,
	"style_preference" text DEFAULT 'read_then_practice',
	"domain_ratings" jsonb,
	"quiz_results" jsonb,
	"preferences" jsonb,
	"is_active" boolean DEFAULT true,
	"progress_percent" integer DEFAULT 0,
	"career_type" text DEFAULT 'nursing',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_session_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_type" text DEFAULT 'recommended' NOT NULL,
	"session_accuracy" double precision DEFAULT 0,
	"session_topics" jsonb DEFAULT '[]'::jsonb,
	"session_duration" integer DEFAULT 0,
	"cards_reviewed" integer DEFAULT 0,
	"weak_cards_encountered" integer DEFAULT 0,
	"mastery_changes" jsonb DEFAULT '[]'::jsonb,
	"tier" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"deck_id" varchar NOT NULL,
	"mode" text DEFAULT 'learn' NOT NULL,
	"total_cards" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"incorrect_count" integer DEFAULT 0,
	"time_seconds" integer,
	"missed_card_ids" jsonb DEFAULT '[]'::jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscriber_rescue_actions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"incident_id" varchar,
	"action_type" text NOT NULL,
	"action_data" jsonb DEFAULT '{}'::jsonb,
	"performed_by" varchar NOT NULL,
	"performed_by_username" text,
	"reason" text,
	"status" text DEFAULT 'completed',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"plan_id" text,
	"plan_name" text,
	"tier" text DEFAULT 'free' NOT NULL,
	"billing_interval" text,
	"status" text DEFAULT 'active' NOT NULL,
	"purchase_source" text DEFAULT 'web',
	"active_from" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"renews_at" timestamp,
	"canceled_at" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"grace_period_until" timestamp,
	"last_verified_at" timestamp DEFAULT now(),
	"is_lifetime" boolean DEFAULT false,
	"currency" text DEFAULT 'usd',
	"amount" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "substitution_event_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_content_id" varchar,
	"substitute_content_id" varchar,
	"match_criteria" jsonb,
	"match_score" integer,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "substitution_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"original_content_id" varchar NOT NULL,
	"original_content_type" text NOT NULL,
	"substitute_content_id" varchar NOT NULL,
	"substitute_content_type" text NOT NULL,
	"match_score" double precision DEFAULT 0,
	"matching_criteria" jsonb DEFAULT '{}'::jsonb,
	"rule_id" varchar,
	"profession" text,
	"tier" text,
	"exam_type" text,
	"domain" text,
	"region" text,
	"language" text,
	"was_language_fallback" boolean DEFAULT false,
	"request_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_notes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"author_id" varchar,
	"author_username" text,
	"note_type" text DEFAULT 'general' NOT NULL,
	"content" text NOT NULL,
	"incident_id" varchar,
	"rescue_action_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "synthetic_test_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_name" text NOT NULL,
	"status" text DEFAULT 'pass' NOT NULL,
	"response_time_ms" integer,
	"error_details" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "taxonomy_review_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_topic" text NOT NULL,
	"original_system" text,
	"suggested_topic" text,
	"suggested_system" text,
	"confidence" double precision DEFAULT 0,
	"match_method" text,
	"body_system" text,
	"tier" text,
	"generation_id" varchar,
	"status" text DEFAULT 'pending',
	"resolved_topic" text,
	"resolved_system" text,
	"resolved_by" varchar,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telemetry_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" varchar,
	"event_type" text NOT NULL,
	"event_category" text NOT NULL,
	"event_data" jsonb DEFAULT '{}'::jsonb,
	"page" text,
	"component" text,
	"severity" text DEFAULT 'info',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_bank_collections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"description" text,
	"role" text,
	"country" text,
	"exam" text,
	"exam_type" text,
	"question_count" integer DEFAULT 0,
	"tier" text DEFAULT 'free',
	"access_level" text DEFAULT 'free',
	"categories" jsonb DEFAULT '[]'::jsonb,
	"category_mappings" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"tags" text[] DEFAULT '{}'::text[],
	"sort_order" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "test_bank_collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "test_bank_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"collection_id" varchar NOT NULL,
	"questions_attempted" integer DEFAULT 0,
	"questions_correct" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"incorrect_count" integer DEFAULT 0,
	"last_question_id" varchar,
	"last_accessed_at" timestamp,
	"last_studied_at" timestamp,
	"completed_percent" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lesson_id" text NOT NULL,
	"test_type" text NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"answers" jsonb,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tester_feedback" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"username" text,
	"category" text DEFAULT 'general' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"page_url" text,
	"severity" text DEFAULT 'medium',
	"status" text DEFAULT 'new',
	"admin_response" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tester_invite_codes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"max_uses" integer DEFAULT 10 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"notes" text,
	"tier" text DEFAULT 'rn',
	"is_active" boolean DEFAULT true,
	"used_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tester_invite_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "topic_mastery_scores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"topic" text NOT NULL,
	"subtopic" text,
	"total_attempts" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"mastery_percent" double precision DEFAULT 0,
	"mastery_label" text DEFAULT 'weak',
	"recent_accuracy" double precision DEFAULT 0,
	"avg_time_seconds" integer DEFAULT 0,
	"last_attempt_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_audit_issues" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" varchar NOT NULL,
	"field_name" text NOT NULL,
	"source_value" text,
	"localized_value" text,
	"issue_type" text NOT NULL,
	"category" text DEFAULT 'primary_body',
	"status" text DEFAULT 'open',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_audits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"content_type" text NOT NULL,
	"url" text,
	"locale" text NOT NULL,
	"translation_pct" double precision DEFAULT 0,
	"status" text DEFAULT 'draft',
	"issue_count" integer DEFAULT 0,
	"issue_breakdown" jsonb DEFAULT '{}'::jsonb,
	"sitemap_eligible" boolean DEFAULT false,
	"noindex" boolean DEFAULT false,
	"admin_override" boolean DEFAULT false,
	"last_scanned_at" timestamp DEFAULT now(),
	"last_content_updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_batch_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"filter_tier" text,
	"filter_exam" text,
	"filter_body_system" text,
	"total_questions" integer DEFAULT 0,
	"translated_count" integer DEFAULT 0,
	"skipped_count" integer DEFAULT 0,
	"failed_count" integer DEFAULT 0,
	"status" text DEFAULT 'pending',
	"last_processed_offset" integer DEFAULT 0,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"quality_report" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "translation_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"content_type" text,
	"content_id" text,
	"language" text,
	"generator_name" text,
	"generation_id" text,
	"severity" text DEFAULT 'info',
	"details" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"content_id" text NOT NULL,
	"target_language" text NOT NULL,
	"fields_to_translate" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'pending',
	"progress" integer DEFAULT 0,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "trial_entitlements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"selected_tier" text NOT NULL,
	"trial_started_at" timestamp DEFAULT now() NOT NULL,
	"trial_ends_at" timestamp NOT NULL,
	"trial_status" text DEFAULT 'active' NOT NULL,
	"verified_email_at" timestamp,
	"stripe_customer_id" text,
	"stripe_trial_subscription_id" text,
	"payment_fingerprint" text,
	"device_fingerprint_hash" text,
	"signup_ip" text,
	"last_seen_ip" text,
	"abuse_flags" jsonb DEFAULT '[]'::jsonb,
	"consumption_counters" jsonb DEFAULT '{"questions":0,"flashcards":0,"lessons":0,"mockExams":0}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trial_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"exam_key" text NOT NULL,
	"tier" text DEFAULT 'rpn' NOT NULL,
	"status" text DEFAULT 'started' NOT NULL,
	"total_questions" integer DEFAULT 50 NOT NULL,
	"questions_served" integer DEFAULT 0,
	"questions_answered" integer DEFAULT 0,
	"current_index" integer DEFAULT 0,
	"questions" jsonb DEFAULT '[]'::jsonb,
	"answers" jsonb DEFAULT '{}'::jsonb,
	"domain_scores" jsonb DEFAULT '{}'::jsonb,
	"difficulty_estimate" double precision,
	"readiness_level" text,
	"completion_time_seconds" integer,
	"report" jsonb DEFAULT '{}'::jsonb,
	"ip_address" text,
	"device_fingerprint" text,
	"timer_enabled" boolean DEFAULT false,
	"expires_at" timestamp,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutor_admin_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_prompt" text DEFAULT 'You are a helpful AI tutoring assistant for healthcare students. Provide clear, accurate explanations. Never provide direct answers to exam questions — guide students to understand the concepts.' NOT NULL,
	"blocked_topics" jsonb DEFAULT '["explicit_content","violence","political_opinions","medical_diagnosis","prescription_advice"]'::jsonb,
	"daily_free_limit" integer DEFAULT 10,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutor_conversations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"username" text,
	"user_tier" text DEFAULT 'free',
	"topic" text,
	"explanation_type" text,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"flagged" boolean DEFAULT false,
	"flag_reason" text,
	"admin_reviewed" boolean DEFAULT false,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unified_question_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"selected_answer" integer,
	"was_correct" boolean NOT NULL,
	"session_id" varchar,
	"source_type" text NOT NULL,
	"source_id" varchar,
	"time_spent" integer,
	"answered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upgrade_funnel_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"event_type" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_ability_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_id" varchar NOT NULL,
	"final_ability" double precision DEFAULT 0,
	"confidence_interval" double precision,
	"stability_index" double precision,
	"early_stop" boolean DEFAULT false,
	"question_count" integer DEFAULT 0,
	"ability_trajectory" jsonb DEFAULT '[]'::jsonb,
	"anti_gaming_flags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_activity_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"event_type" "activity_event_type" NOT NULL,
	"entity_id" varchar,
	"entity_type" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_card_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"card_id" varchar NOT NULL,
	"is_correct" boolean NOT NULL,
	"confidence" text DEFAULT 'unsure' NOT NULL,
	"selected_option" integer,
	"time_spent" integer,
	"study_mode" text DEFAULT 'learn',
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_card_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"card_id" varchar NOT NULL,
	"times_seen" integer DEFAULT 0 NOT NULL,
	"times_correct" integer DEFAULT 0 NOT NULL,
	"times_incorrect" integer DEFAULT 0 NOT NULL,
	"last_seen_at" timestamp,
	"last_answered_at" timestamp,
	"average_response_time" double precision DEFAULT 0,
	"confidence_rating" text DEFAULT 'unsure',
	"flagged" boolean DEFAULT false NOT NULL,
	"mastered" boolean DEFAULT false NOT NULL,
	"streak_correct" integer DEFAULT 0 NOT NULL,
	"streak_incorrect" integer DEFAULT 0 NOT NULL,
	"mastery_state" text DEFAULT 'new' NOT NULL,
	"next_review_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_exam_profile" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"exam_type" text NOT NULL,
	"exam_date" timestamp,
	"hours_per_day" integer DEFAULT 2,
	"days_per_week" integer DEFAULT 5,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"username" text,
	"email" text,
	"type" text DEFAULT 'feedback' NOT NULL,
	"category" text DEFAULT 'general',
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'new',
	"priority" text DEFAULT 'medium',
	"admin_notes" text,
	"upvotes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_flashcards" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" text DEFAULT 'My Cards',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_funnel_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"language_code" text DEFAULT 'en',
	"event_name" text NOT NULL,
	"event_value" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_mastery_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"tier" text NOT NULL,
	"topic" text,
	"subtopic" text,
	"blueprint_category" text,
	"question_type" text,
	"total_attempts" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"avg_confidence" double precision DEFAULT 0,
	"last_reviewed_at" timestamp,
	"mastery_level" double precision DEFAULT 0,
	"next_due_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_performance_summary" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"readiness_score" integer DEFAULT 0,
	"projected_pass_probability" integer DEFAULT 0,
	"weakness_vector" jsonb DEFAULT '{}'::jsonb,
	"strengths_vector" jsonb DEFAULT '{}'::jsonb,
	"top_weak_domains" jsonb DEFAULT '[]'::jsonb,
	"top_weak_question_types" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lesson_id" text NOT NULL,
	"completed" text DEFAULT 'false',
	"pre_test_score" integer,
	"post_test_score" integer,
	"completion_percent" integer DEFAULT 0,
	"bookmarked" boolean DEFAULT false,
	"last_accessed" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_revenue_profile" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"language_code" text DEFAULT 'en',
	"segment" text DEFAULT 'content_explorer',
	"propensity_score" double precision DEFAULT 0,
	"price_sensitivity_score" double precision DEFAULT 0,
	"time_to_exam_days" integer,
	"last_offer_shown" text,
	"last_offer_result" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_revenue_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_questions_answered" integer DEFAULT 0,
	"total_correct" integer DEFAULT 0,
	"domain_breakdown" jsonb DEFAULT '{}'::jsonb,
	"exam_scores" jsonb DEFAULT '[]'::jsonb,
	"study_streak" integer DEFAULT 0,
	"last_study_date" text,
	"weekly_history" jsonb DEFAULT '[]'::jsonb,
	"public_profile" boolean DEFAULT false,
	"leaderboard_visible" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_id" text,
	"plan_name" text,
	"billing_interval" text,
	"status" text DEFAULT 'active',
	"active_from" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"renews_at" timestamp,
	"canceled_at" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"purchase_source" text DEFAULT 'web',
	"last_verified_at" timestamp DEFAULT now(),
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"email_verified_at" timestamp,
	"display_name" text,
	"first_name" text,
	"role" text,
	"country" text,
	"exam_track" text,
	"exam" text,
	"onboarding_complete" boolean DEFAULT false,
	"onboarding_completed" boolean DEFAULT false,
	"tier" text DEFAULT 'free',
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_status" text DEFAULT 'inactive',
	"region" text DEFAULT 'US',
	"flashcard_limit" integer DEFAULT 300,
	"plan_expires_at" timestamp,
	"career_type" text DEFAULT 'nursing',
	"tester_access" boolean DEFAULT false,
	"tester_expiry" timestamp,
	"tester_invite_code" text,
	"referral_code" text,
	"referral_uses" integer DEFAULT 0,
	"referred_by" text,
	"referral_discount_used" boolean DEFAULT false,
	"is_lifetime" boolean DEFAULT false,
	"lifetime_purchased_at" timestamp,
	"preferred_theme" text,
	"admin_role" text,
	"study_goal" text,
	"daily_study_time" text,
	"exam_type" text,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "v2_content_blocks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_id" varchar NOT NULL,
	"section_key" text NOT NULL,
	"blocks" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" varchar NOT NULL,
	"verdict" text NOT NULL,
	"confidence_score" double precision,
	"issues_json" jsonb DEFAULT '[]'::jsonb,
	"citations_json" jsonb DEFAULT '[]'::jsonb,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"model_version" text
);
--> statement-breakpoint
CREATE TABLE "vip_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"priority_level" text DEFAULT 'standard' NOT NULL,
	"support_tier" text DEFAULT 'normal',
	"notes" text,
	"is_active" boolean DEFAULT true,
	"added_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visual_assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_type" text NOT NULL,
	"prompt" text NOT NULL,
	"alt_text" text,
	"caption" text,
	"image_url" text,
	"width" integer DEFAULT 1600,
	"height" integer DEFAULT 1200,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watermark_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"masked_email" text,
	"user_id_suffix" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "weak_area_alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"topic" text NOT NULL,
	"alert_type" text DEFAULT 'repeated_struggle' NOT NULL,
	"message" text NOT NULL,
	"dismissed" boolean DEFAULT false,
	"recommended_actions" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"source" text DEFAULT 'stripe' NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"user_id" varchar,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"processing_result" jsonb DEFAULT '{}'::jsonb,
	"error_message" text,
	"event_timestamp" timestamp,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "weekly_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start" timestamp NOT NULL,
	"week_end" timestamp NOT NULL,
	"report_type" text DEFAULT 'ops_summary' NOT NULL,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"incidents" jsonb DEFAULT '[]'::jsonb,
	"highlights" text[] DEFAULT '{}'::text[],
	"generated_by" varchar,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cat_sessions" ADD CONSTRAINT "cat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_seo_page_translations" ADD CONSTRAINT "clinical_seo_page_translations_content_id_clinical_seo_pages_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."clinical_seo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_growth_runs" ADD CONSTRAINT "content_growth_runs_schedule_id_content_growth_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."content_growth_schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dashboard_resume_state" ADD CONSTRAINT "dashboard_resume_state_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_deck_translations" ADD CONSTRAINT "flashcard_deck_translations_content_id_flashcard_decks_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."flashcard_decks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_bookmarks" ADD CONSTRAINT "lesson_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_exam_session_progress" ADD CONSTRAINT "mock_exam_session_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_exam_session_progress" ADD CONSTRAINT "mock_exam_session_progress_attempt_id_mock_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."mock_exam_attempts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qotd_translations" ADD CONSTRAINT "qotd_translations_content_id_qotd_history_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."qotd_history"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_history" ADD CONSTRAINT "question_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_hub_page_translations" ADD CONSTRAINT "seo_hub_page_translations_content_id_seo_hub_pages_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."seo_hub_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_bank_progress" ADD CONSTRAINT "test_bank_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_bank_progress" ADD CONSTRAINT "test_bank_progress_collection_id_test_bank_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."test_bank_collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity_log" ADD CONSTRAINT "user_activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_events_user_idx" ON "analytics_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analytics_events_type_idx" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "analytics_events_created_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cat_sessions_user_idx" ON "cat_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cat_sessions_status_idx" ON "cat_sessions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "clinical_seo_page_translations_content_locale_idx" ON "clinical_seo_page_translations" USING btree ("content_id","locale");--> statement-breakpoint
CREATE INDEX "clinical_seo_page_translations_locale_status_idx" ON "clinical_seo_page_translations" USING btree ("locale","translation_status");--> statement-breakpoint
CREATE INDEX "clinical_seo_page_translations_status_stale_idx" ON "clinical_seo_page_translations" USING btree ("translation_status") WHERE translation_status = 'stale';--> statement-breakpoint
CREATE UNIQUE INDEX "content_item_translations_unique_idx" ON "content_item_translations" USING btree ("content_item_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "content_translations_unique_idx" ON "content_translations" USING btree ("content_type","content_id","field_name","language_code");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_question_translations_unique_idx" ON "exam_question_translations" USING btree ("exam_question_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "flashcard_deck_translations_content_locale_idx" ON "flashcard_deck_translations" USING btree ("content_id","locale");--> statement-breakpoint
CREATE INDEX "flashcard_deck_translations_locale_status_idx" ON "flashcard_deck_translations" USING btree ("locale","translation_status");--> statement-breakpoint
CREATE INDEX "flashcard_deck_translations_status_stale_idx" ON "flashcard_deck_translations" USING btree ("translation_status") WHERE translation_status = 'stale';--> statement-breakpoint
CREATE UNIQUE INDEX "flashcard_translations_unique_idx" ON "flashcard_translations" USING btree ("flashcard_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_bookmarks_user_lesson_idx" ON "lesson_bookmarks" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_bookmarks_user_idx" ON "lesson_bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "med_term_unique_idx" ON "medical_terminology_dictionary" USING btree ("english_term","language_code");--> statement-breakpoint
CREATE UNIQUE INDEX "mock_exam_session_progress_user_attempt_idx" ON "mock_exam_session_progress" USING btree ("user_id","attempt_id");--> statement-breakpoint
CREATE INDEX "mock_exam_session_progress_user_idx" ON "mock_exam_session_progress" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "qotd_translations_content_locale_idx" ON "qotd_translations" USING btree ("content_id","locale");--> statement-breakpoint
CREATE INDEX "qotd_translations_locale_status_idx" ON "qotd_translations" USING btree ("locale","translation_status");--> statement-breakpoint
CREATE INDEX "qotd_translations_status_stale_idx" ON "qotd_translations" USING btree ("translation_status") WHERE translation_status = 'stale';--> statement-breakpoint
CREATE INDEX "question_history_user_idx" ON "question_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "question_history_session_idx" ON "question_history" USING btree ("session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_readiness_history_user_week" ON "readiness_history" USING btree ("user_id","snapshot_week");--> statement-breakpoint
CREATE UNIQUE INDEX "seo_hub_page_translations_content_locale_idx" ON "seo_hub_page_translations" USING btree ("content_id","locale");--> statement-breakpoint
CREATE INDEX "seo_hub_page_translations_locale_status_idx" ON "seo_hub_page_translations" USING btree ("locale","translation_status");--> statement-breakpoint
CREATE INDEX "seo_hub_page_translations_status_stale_idx" ON "seo_hub_page_translations" USING btree ("translation_status") WHERE translation_status = 'stale';--> statement-breakpoint
CREATE UNIQUE INDEX "seo_page_translations_unique_idx" ON "seo_page_translations" USING btree ("seo_page_id","locale");--> statement-breakpoint
CREATE INDEX "test_bank_collections_role_country_idx" ON "test_bank_collections" USING btree ("role","country");--> statement-breakpoint
CREATE UNIQUE INDEX "test_bank_progress_user_collection_idx" ON "test_bank_progress" USING btree ("user_id","collection_id");--> statement-breakpoint
CREATE INDEX "unified_question_history_user_idx" ON "unified_question_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "unified_question_history_session_idx" ON "unified_question_history" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "unified_question_history_source_idx" ON "unified_question_history" USING btree ("user_id","source_type");--> statement-breakpoint
CREATE INDEX "user_activity_log_user_idx" ON "user_activity_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_activity_log_event_type_idx" ON "user_activity_log" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "user_activity_log_created_idx" ON "user_activity_log" USING btree ("created_at");
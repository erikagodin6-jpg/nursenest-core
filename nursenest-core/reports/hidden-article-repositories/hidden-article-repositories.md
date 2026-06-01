# Hidden Article Repository Audit

Generated: 2026-06-01T18:01:35.336Z

## Database

- Protocol: postgresql
- Host hash: 587a4cd342
- Database: defaultdb

## Summary

- Base tables inspected: 154
- Article-like tables flagged by fields: 22
- Article-like tables with hidden rows or unknown visibility: 10

## Flagged Article-Like Tables

| Table Name | Row Count | Content Type | Public Count | Hidden Count | Fields Triggering Flag | Visibility Fields |
| --- | ---: | --- | ---: | ---: | --- | --- |
| `public.blog_article_generation_jobs` | 51 | article-like | unknown | unknown | resultTitle, resultSlug, bodyHtmlSnapshot | unknown |
| `public.BlogCampaignItem` | 0 | article-like | 0 | 0 | plannedTitle, plannedSlug, plannedKeyword | status, plannedPublishAt |
| `public.BlogPost` | 4366 | article-like | 4217 | 149 | title, seoTitle, titleAlternates, clickTitle, metaTitleVariant, slug, careerSlug, body, faqBlock, checklistBlock, quickReferenceBlock, excerpt, seoDescription, targetKeyword, keywordCluster, keywordPlan, metaDescriptionVariant, shortSummary, schemaSummary | postStatus, publishAt, workflowStatus, scheduledAt |
| `public.canonical_topic_shared_sections` | 0 | article-like | unknown | unknown | heading, body, content_version | unknown |
| `public.content_items` | 52 | article-like | 0 | 52 | title, seo_title, slug, content, summary, seo_description, seo_keywords, primary_keyword, secondary_keywords | status, scheduled_at, published_at |
| `public.digital_products` | 0 | article-like | unknown | unknown | title, seo_title, slug, description, short_description, seo_description, seo_keywords | unknown |
| `public.ecg_worksheets` | 0 | article-like | unknown | unknown | title, description | unknown |
| `public.flashcard_decks` | 177 | flashcard-like | 171 | 6 | title, slug, description | visibility, status |
| `public.generated_courses` | 0 | article-like | 0 | 0 | title, description, seo_pages | status |
| `public.internal_course_modules` | 0 | lesson-like | unknown | unknown | lesson_slug, content | unknown |
| `public.internal_courses` | 2 | article-like | 2 | 0 | title, description | status |
| `public.LearnerNote` | 2 | article-like | unknown | unknown | title, body | unknown |
| `public.Lesson` | 0 | article-like | 0 | 0 | title, slug, body, summary | status |
| `public.LocalizedBlogArticle` | 2 | article-like | 2 | 0 | localizedTitle, localizedMetaTitle, canonicalSlug, localizedSlug, contentStatus, localizedBody, localizedExcerpt, localizedMetaDescription, seoKeywordPrimary, seoKeywordSecondary, canonicalUrl | contentStatus, publishedAt, scheduledAt |
| `public.mastery_lessons` | 0 | article-like | 0 | 0 | title, slug, content | is_public |
| `public.mastery_modules` | 0 | lesson-like | 0 | 0 | title, slug, description | is_public |
| `public.osce_stations` | 1 | article-like | 1 | 0 | title, slug, description | is_published |
| `public.pathway_lessons` | 13040 | lesson-like | 13040 | 0 | title, seo_title, slug, topic_slug, redirect_to_slug, preview_section_count, sections, content_version, seo_description, exam_meta | status, published_at |
| `public.printable_products` | 0 | article-like | 0 | 0 | title, slug, description | is_published |
| `public.study_milestones` | 0 | article-like | unknown | unknown | title, description | unknown |
| `public.test_bank_collections` | 0 | article-like | 0 | 0 | slug, description | status |
| `public.verified_study_decks` | 0 | article-like | 0 | 0 | title, unlisted_slug, description | visibility, published_at |

## All Tables

| Table Name | Row Count | Content Type | Public Count | Hidden Count | Article-like |
| --- | ---: | --- | ---: | ---: | --- |
| `public.blog_article_generation_jobs` | 51 | article-like | unknown | unknown | YES |
| `public.BlogCampaignItem` | 0 | article-like | 0 | 0 | YES |
| `public.BlogPost` | 4366 | article-like | 4217 | 149 | YES |
| `public.canonical_topic_shared_sections` | 0 | article-like | unknown | unknown | YES |
| `public.content_items` | 52 | article-like | 0 | 52 | YES |
| `public.digital_products` | 0 | article-like | unknown | unknown | YES |
| `public.ecg_worksheets` | 0 | article-like | unknown | unknown | YES |
| `public.flashcard_decks` | 177 | flashcard-like | 171 | 6 | YES |
| `public.generated_courses` | 0 | article-like | 0 | 0 | YES |
| `public.internal_course_modules` | 0 | lesson-like | unknown | unknown | YES |
| `public.internal_courses` | 2 | article-like | 2 | 0 | YES |
| `public.LearnerNote` | 2 | article-like | unknown | unknown | YES |
| `public.Lesson` | 0 | article-like | 0 | 0 | YES |
| `public.LocalizedBlogArticle` | 2 | article-like | 2 | 0 | YES |
| `public.mastery_lessons` | 0 | article-like | 0 | 0 | YES |
| `public.mastery_modules` | 0 | lesson-like | 0 | 0 | YES |
| `public.osce_stations` | 1 | article-like | 1 | 0 | YES |
| `public.pathway_lessons` | 13040 | lesson-like | 13040 | 0 | YES |
| `public.printable_products` | 0 | article-like | 0 | 0 | YES |
| `public.study_milestones` | 0 | article-like | unknown | unknown | YES |
| `public.test_bank_collections` | 0 | article-like | 0 | 0 | YES |
| `public.verified_study_decks` | 0 | article-like | 0 | 0 | YES |
| `public._prisma_migrations` | 128 | non-article/operational | unknown | unknown | NO |
| `public._prisma_migrations_backup_20260413` | 68 | non-article/operational | unknown | unknown | NO |
| `public.accuracy_trends` | 0 | non-article/operational | unknown | unknown | NO |
| `public.AiGenerationJob` | 0 | auth/user/system | 0 | 0 | NO |
| `public.AiGenerationLog` | 0 | non-article/operational | unknown | unknown | NO |
| `public.allied_blueprints` | 0 | non-article/operational | unknown | unknown | NO |
| `public.analytics_events` | 0 | auth/user/system | unknown | unknown | NO |
| `public.app_login_lockout` | 0 | join/config | unknown | unknown | NO |
| `public.app_rate_limit_bucket` | 81 | join/config | unknown | unknown | NO |
| `public.BackgroundJob` | 0 | non-article/operational | 0 | 0 | NO |
| `public.BaselineAssessmentAttempt` | 12 | non-article/operational | 0 | 12 | NO |
| `public.benchmark_profiles` | 0 | non-article/operational | unknown | unknown | NO |
| `public.BlogBatchSchedule` | 4 | non-article/operational | 4 | 0 | NO |
| `public.BlogBatchScheduleItem` | 4481 | non-article/operational | 7 | 4474 | NO |
| `public.BlogCampaign` | 0 | non-article/operational | 0 | 0 | NO |
| `public.BlogDraftGenerationBatch` | 32 | non-article/operational | 30 | 2 | NO |
| `public.BlogDraftGenerationBatchItem` | 248 | non-article/operational | 0 | 248 | NO |
| `public.canonical_topics` | 50 | non-article/operational | unknown | unknown | NO |
| `public.cat_emergency_fallback_banks` | 1 | non-article/operational | unknown | unknown | NO |
| `public.Category` | 38 | non-article/operational | unknown | unknown | NO |
| `public.clinical_nursing_scenario_stages` | 0 | question-like | unknown | unknown | NO |
| `public.clinical_nursing_scenarios` | 0 | non-article/operational | 0 | 0 | NO |
| `public.clinical_scenario_simulation_runs` | 0 | non-article/operational | unknown | unknown | NO |
| `public.content_entity_revisions` | 0 | non-article/operational | unknown | unknown | NO |
| `public.content_import_runs` | 0 | non-article/operational | 0 | 0 | NO |
| `public.content_quality_corpus_snapshots` | 0 | join/config | unknown | unknown | NO |
| `public.content_translations` | 2 | non-article/operational | unknown | unknown | NO |
| `public.content_versions` | 0 | non-article/operational | unknown | unknown | NO |
| `public.ContentAutomationLog` | 52 | non-article/operational | 0 | 52 | NO |
| `public.critical_route_errors` | 0 | non-article/operational | unknown | unknown | NO |
| `public.cross_section_events` | 0 | lesson-like | unknown | unknown | NO |
| `public.custom_practice_sessions` | 0 | non-article/operational | 0 | 0 | NO |
| `public.ecg_video_question_answer_option_aggregates` | 0 | join/config | unknown | unknown | NO |
| `public.ecg_video_question_performance_aggregates` | 0 | join/config | unknown | unknown | NO |
| `public.ecg_video_question_practice_answer_attempts` | 0 | non-article/operational | unknown | unknown | NO |
| `public.ecg_video_questions` | 242 | question-like | unknown | unknown | NO |
| `public.educational_translation_overlays` | 36 | non-article/operational | 36 | 0 | NO |
| `public.EmailNotificationLog` | 0 | non-article/operational | unknown | unknown | NO |
| `public.EmailVerificationToken` | 39 | auth/user/system | unknown | unknown | NO |
| `public.Exam` | 0 | non-article/operational | 0 | 0 | NO |
| `public.exam_attempts` | 0 | non-article/operational | 0 | 0 | NO |
| `public.exam_followup_responses` | 0 | non-article/operational | unknown | unknown | NO |
| `public.exam_load_incidents` | 0 | auth/user/system | unknown | unknown | NO |
| `public.exam_planner_settings` | 2 | non-article/operational | unknown | unknown | NO |
| `public.exam_question_answer_option_aggregates` | 0 | join/config | unknown | unknown | NO |
| `public.exam_question_performance_aggregates` | 0 | join/config | unknown | unknown | NO |
| `public.exam_question_practice_answer_attempts` | 0 | non-article/operational | unknown | unknown | NO |
| `public.exam_questions` | 72881 | question-like | 72828 | 53 | NO |
| `public.ExamAttempt` | 0 | non-article/operational | unknown | unknown | NO |
| `public.ExamSession` | 0 | non-article/operational | 0 | 0 | NO |
| `public.fallback_delivery_events` | 0 | non-article/operational | unknown | unknown | NO |
| `public.Flashcard` | 6216 | question-like | 6216 | 0 | NO |
| `public.flashcard_attempts` | 0 | auth/user/system | unknown | unknown | NO |
| `public.flashcard_bank` | 12549 | question-like | 11076 | 1473 | NO |
| `public.flashcard_deck_tags` | 0 | join/config | unknown | unknown | NO |
| `public.flashcard_mastery` | 0 | non-article/operational | unknown | unknown | NO |
| `public.flashcard_option_responses` | 0 | auth/user/system | unknown | unknown | NO |
| `public.flashcard_options` | 0 | non-article/operational | unknown | unknown | NO |
| `public.flashcard_preview_config` | 1 | auth/user/system | unknown | unknown | NO |
| `public.flashcard_preview_usage` | 0 | join/config | unknown | unknown | NO |
| `public.flashcard_progress` | 0 | non-article/operational | unknown | unknown | NO |
| `public.flashcard_sessions` | 0 | flashcard-like | 0 | 0 | NO |
| `public.flashcard_study_sessions` | 1 | non-article/operational | unknown | unknown | NO |
| `public.flashcard_tags` | 0 | join/config | unknown | unknown | NO |
| `public.flashcard_user_stats` | 0 | non-article/operational | unknown | unknown | NO |
| `public.generated_questions` | 0 | question-like | unknown | unknown | NO |
| `public.GeneratedFlashcardDraft` | 0 | flashcard-like | unknown | unknown | NO |
| `public.GeneratedLessonDraft` | 0 | non-article/operational | unknown | unknown | NO |
| `public.GeneratedQuestionDraft` | 0 | question-like | unknown | unknown | NO |
| `public.inbound_email_autoreply_events` | 0 | auth/user/system | 0 | 0 | NO |
| `public.inline_content_entries` | 0 | non-article/operational | unknown | unknown | NO |
| `public.kill_switches` | 8 | non-article/operational | 0 | 8 | NO |
| `public.language_enforcement_events` | 0 | non-article/operational | unknown | unknown | NO |
| `public.learner_session_activities` | 0 | auth/user/system | unknown | unknown | NO |
| `public.learner_session_ip_observations` | 0 | non-article/operational | unknown | unknown | NO |
| `public.LearningMemoryState` | 0 | non-article/operational | unknown | unknown | NO |
| `public.LearningMisconceptionEvent` | 0 | non-article/operational | unknown | unknown | NO |
| `public.LearningRetentionEvent` | 0 | non-article/operational | unknown | unknown | NO |
| `public.LearningReviewQueueItem` | 0 | non-article/operational | unknown | unknown | NO |
| `public.lesson_batch_queue_item` | 0 | non-article/operational | 0 | 0 | NO |
| `public.lesson_bookmarks` | 0 | join/config | unknown | unknown | NO |
| `public.longitudinal_case_sessions` | 0 | non-article/operational | 0 | 0 | NO |
| `public.manual_fulfillment_queue` | 0 | non-article/operational | 0 | 0 | NO |
| `public.marketing_public_content_override_revisions` | 0 | non-article/operational | unknown | unknown | NO |
| `public.marketing_public_content_overrides` | 0 | non-article/operational | 0 | 0 | NO |
| `public.mastery_case_scenarios` | 0 | non-article/operational | 0 | 0 | NO |
| `public.mastery_pattern_maps` | 0 | non-article/operational | 0 | 0 | NO |
| `public.mastery_questions` | 0 | question-like | 0 | 0 | NO |
| `public.media_assets` | 0 | non-article/operational | unknown | unknown | NO |
| `public.PasswordResetToken` | 2 | auth/user/system | unknown | unknown | NO |
| `public.pathway_launch_workflows` | 0 | non-article/operational | unknown | unknown | NO |
| `public.practice_recommendations` | 0 | non-article/operational | unknown | unknown | NO |
| `public.practice_tests` | 14 | non-article/operational | 0 | 14 | NO |
| `public.premium_protection_rollups` | 6 | non-article/operational | unknown | unknown | NO |
| `public.premium_protection_user_days` | 6 | non-article/operational | unknown | unknown | NO |
| `public.pricing_plans` | 0 | non-article/operational | unknown | unknown | NO |
| `public.printable_accesses` | 0 | non-article/operational | unknown | unknown | NO |
| `public.printable_download_events` | 0 | non-article/operational | unknown | unknown | NO |
| `public.Progress` | 26 | non-article/operational | unknown | unknown | NO |
| `public.protection_abuse_reviews` | 3 | non-article/operational | unknown | unknown | NO |
| `public.provisional_access_log` | 0 | non-article/operational | unknown | unknown | NO |
| `public.quarantine_log` | 0 | non-article/operational | unknown | unknown | NO |
| `public.Question` | 0 | question-like | 0 | 0 | NO |
| `public.readiness_history` | 2 | non-article/operational | unknown | unknown | NO |
| `public.social_challenge_participants` | 0 | non-article/operational | 0 | 0 | NO |
| `public.social_challenges` | 0 | non-article/operational | 0 | 0 | NO |
| `public.social_connections` | 0 | non-article/operational | 0 | 0 | NO |
| `public.social_group_memberships` | 0 | auth/user/system | 0 | 0 | NO |
| `public.social_groups` | 0 | non-article/operational | 0 | 0 | NO |
| `public.social_invite_codes` | 0 | non-article/operational | 0 | 0 | NO |
| `public.social_privacy_settings` | 0 | non-article/operational | unknown | unknown | NO |
| `public.social_stat_snapshots` | 0 | non-article/operational | unknown | unknown | NO |
| `public.spaced_repetition_cards` | 0 | non-article/operational | 0 | 0 | NO |
| `public.StripeOwnerPaidSubscriptionNotify` | 0 | join/config | unknown | unknown | NO |
| `public.StripeWebhookEvent` | 0 | join/config | unknown | unknown | NO |
| `public.student_study_profiles` | 0 | non-article/operational | unknown | unknown | NO |
| `public.study_plan_schedule` | 0 | non-article/operational | unknown | unknown | NO |
| `public.Subscription` | 17 | non-article/operational | 17 | 0 | NO |
| `public.test_bank_progress` | 0 | non-article/operational | unknown | unknown | NO |
| `public.topic_mastery_scores` | 0 | non-article/operational | unknown | unknown | NO |
| `public.TrialDeviceBinding` | 0 | join/config | unknown | unknown | NO |
| `public.unified_question_history` | 0 | question-like | unknown | unknown | NO |
| `public.User` | 71 | question-like | 71 | 0 | NO |
| `public.UserFeedbackReport` | 2 | non-article/operational | 0 | 2 | NO |
| `public.UserRemediationEvent` | 0 | non-article/operational | unknown | unknown | NO |
| `public.UserRemediationQueue` | 0 | non-article/operational | unknown | unknown | NO |
| `public.UserTopicStat` | 9 | non-article/operational | unknown | unknown | NO |
| `public.verified_study_card_progress` | 0 | non-article/operational | unknown | unknown | NO |
| `public.verified_study_cards` | 0 | question-like | unknown | unknown | NO |
| `public.verified_study_deck_reports` | 0 | non-article/operational | 0 | 0 | NO |
| `public.verified_study_deck_shares` | 0 | auth/user/system | unknown | unknown | NO |
| `public.weak_area_alerts` | 0 | non-article/operational | unknown | unknown | NO |

## Notes

- The audit does not dump article body text or secrets.
- Article-like classification is based on actual columns containing title/slug/body/content/markdown/SEO-like fields, not table names alone.
- Public/hidden counts are only computed when visibility/status/publish/hidden/delete fields exist. Otherwise the table is marked `visibility_unknown` and counts are `unknown`.

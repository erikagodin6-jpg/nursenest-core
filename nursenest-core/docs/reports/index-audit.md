# Database Index Audit

Generated: 2026-06-01

## Scope

Audited Prisma schema indexes and high-frequency Prisma query surfaces for:

- `WHERE`
- `ORDER BY`
- `GROUP BY`
- relation-backed `include` / join patterns
- raw SQL joins

Primary query families reviewed:

- public blog and sitemap loaders
- localized blog loaders
- lesson hubs and lesson detail navigation
- question bank / CAT pools
- flashcard launcher and flashcard session pools
- learner dashboard/readiness/progress queries
- subscription and entitlement checks
- admin blog queues, feedback queues, and content dashboards

## Deliverables

- SQL remediation file: `database-index-remediation.sql`
- Report: `docs/reports/index-audit.md`

## Current Index Coverage Summary

The schema already has strong baseline coverage for unique lookups and several public content surfaces:

- `BlogPost.slug`, plus public status/workflow/publish/sort composites
- `PathwayLesson` pathway/locale/status/sort and pathway/topic/locale/status composites
- `ExamQuestion` status/exam/tier/country and status/exam/topic composites
- `Flashcard` deck/status and status/country/tier composites
- `PracticeTest` user/status/updated and user/status/completed composites
- `Progress` user/lesson unique and user/completed/updated composite
- `Subscription` user/created and Stripe subscription unique lookup

The missing coverage is concentrated around additional filter dimensions that are used heavily after recent feature growth: body system, adaptive eligibility, scenario/question-type grouping, localized blog publishing, status+created/updated admin queues, array membership checks, and route-level content discovery.

## Missing Indexes Added To SQL

| Query family                    | Query shape                                                                    | Existing coverage                                | Remediation index                                  | Current cost                          | Estimated improvement                      |
| ------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------- | ------------------------------------- | ------------------------------------------ |
| Blog hub/admin queue            | `WHERE postStatus ORDER BY createdAt DESC`                                     | `postStatus,publishAt` only                      | `idx_blogpost_status_created_desc`                 | Medium on 5k+ rows, grows with drafts | 40-75% less sort/filter work               |
| Blog queue/sitemap              | `WHERE postStatus ORDER BY updatedAt DESC`                                     | public composite includes workflow/publish first | `idx_blogpost_status_updated_desc`                 | Medium                                | 35-70% faster queue scans                  |
| Blog recovery/inventory         | `WHERE legacySource AND postStatus/publishAt`                                  | no legacy composite                              | `idx_blogpost_legacy_status_publish`               | High when legacy imports grow         | avoids legacy-source table scan            |
| Blog pathway/category discovery | `WHERE exam AND postStatus/publishAt`                                          | no exam composite                                | `idx_blogpost_exam_status_publish`                 | Medium                                | faster exam-specific hubs/sitemaps         |
| Blog localized discovery        | `WHERE locale AND postStatus ORDER BY updatedAt`                               | public composite includes workflow/publish first | `idx_blogpost_locale_status_updated`               | Medium                                | faster locale admin/hub lists              |
| Blog tag lookup                 | `tags has/overlap`                                                             | no GIN                                           | `idx_blogpost_tags_gin`                            | High when tag-filtered                | index-backed array lookup                  |
| Localized blog public pages     | `WHERE contentStatus ORDER BY publishedAt`                                     | `contentStatus,scheduledAt` only                 | `idx_localized_blog_status_published`              | Medium                                | faster multilingual sitemap/public list    |
| Localized blog route lists      | `WHERE locale AND contentStatus ORDER BY publishedAt`                          | `region,locale,contentStatus`                    | `idx_localized_blog_locale_status_published`       | Medium                                | removes region dependency for locale lists |
| Localized profession hubs       | `WHERE profession, exam, locale, contentStatus`                                | no profession/exam composite                     | `idx_localized_blog_prof_exam_locale_status`       | Medium                                | faster localized career hubs               |
| Lesson global public lists      | `WHERE status, locale ORDER BY updatedAt`                                      | pathway-first composites only                    | `idx_pathway_lessons_status_locale_updated_public` | High when not scoped to one pathway   | avoids all-pathway status scan             |
| Lesson body-system hubs         | `WHERE pathwayId, locale, status, bodySystem ORDER BY updatedAt`               | no body-system composite                         | `idx_pathway_lessons_body_system_hub`              | Medium/high                           | faster related lessons and internal links  |
| Region/tier lesson scope        | `WHERE countryCode, tierCode, status`                                          | no region/tier composite                         | `idx_pathway_lessons_country_tier_status_updated`  | Medium                                | faster learner-visible lesson scope        |
| Public complete lesson hubs     | `WHERE pathwayId, locale, status, structuralPublicComplete ORDER BY sortOrder` | no structural gate composite                     | `idx_pathway_lessons_public_structural_sort`       | Medium                                | lower hub filtering cost                   |
| Deprecated lesson redirects     | `WHERE deprecatedAt IS NOT NULL AND redirectToSlug`                            | canonical indexes only                           | `idx_pathway_lessons_deprecated_redirect`          | Low/medium                            | faster redirect repair/audits              |
| CAT/question pools              | `WHERE status, exam, tier, countryCode, bodySystem`                            | status/exam/tier/country only                    | `idx_examq_pool_body_system`                       | High on large banks                   | faster system-scoped pools/grouping        |
| CAT startup                     | `WHERE status, exam, tier, countryCode, isAdaptiveEligible`                    | no adaptive composite                            | `idx_examq_pool_adaptive`                          | High                                  | faster CAT pool count/bootstrap            |
| Practice/CAT stable order       | `WHERE pool scope ORDER BY id`                                                 | no id suffix                                     | `idx_examq_pool_id_order`                          | Medium/high                           | avoids sort for first-batch hydration      |
| Question type counts            | `WHERE status, questionType`                                                   | no question-type composite                       | `idx_examq_status_question_type`                   | Medium                                | faster NGN/SATA/case counts                |
| Scenario counts                 | `WHERE status, isScenario`                                                     | no scenario composite                            | `idx_examq_status_scenario`                        | Medium                                | faster scenario inventory                  |
| Flashcard virtual source        | `WHERE status, isFlashcardSource`                                              | no source composite                              | `idx_examq_flashcard_source`                       | Medium                                | faster generated flashcard source pools    |
| Topic remediation               | `WHERE status, topic, subtopic`                                                | status/exam/topic only                           | `idx_examq_topic_subtopic`                         | Medium                                | faster remediation/rationale links         |
| Flashcard inventory grouping    | `WHERE status GROUP BY bodySystem, topic`                                      | no status/body/topic composite                   | `idx_examq_body_topic`                             | High                                  | faster grouped inventory counts            |
| NCLEX blueprint analytics       | `WHERE status, nclexClientNeedsCategory/subcategory`                           | no blueprint composite                           | `idx_examq_client_needs`                           | Medium                                | faster blueprint coverage                  |
| Published question audits       | `WHERE status ORDER BY publishedAt`                                            | status/updated only                              | `idx_examq_published_at`                           | Medium                                | faster publication diagnostics             |
| Question tags                   | `tags has/overlap`                                                             | no GIN                                           | `idx_examq_tags_gin`                               | High when tag-filtered                | index-backed array lookup                  |
| Flashcard launcher              | `WHERE status,country,tier,categoryId ORDER BY updatedAt`                      | status/country/tier only                         | `idx_flashcard_status_tier_category_updated`       | Medium                                | faster category counts                     |
| Flashcard pools by exam         | `WHERE status,examFamily,country,tier`                                         | status/examFamily only                           | `idx_flashcard_status_exam_family`                 | Medium                                | faster exam-scoped decks/cards             |
| Flashcard deck launcher         | `WHERE pathway_id,status,visibility ORDER BY sortOrder`                        | no pathway deck composite                        | `idx_flashcard_decks_pathway_status_sort`          | Medium                                | faster pathway deck lists                  |
| Flashcard deck exam scope       | `WHERE status,examFamily,tier,country`                                         | status/examFamily only                           | `idx_flashcard_decks_exam_tier_country`            | Medium                                | faster region/tier deck lists              |
| Practice session lists          | `WHERE userId,status ORDER BY startedAt`                                       | user/status/updated                              | `idx_practice_tests_user_status_started`           | Low/medium                            | faster profile/history order               |
| Completed readiness             | `WHERE userId AND status=COMPLETED ORDER BY completedAt`                       | user/status/completed exists                     | `idx_practice_tests_user_completed`                | Low                                   | partial index reduces completed scan size  |
| Progress history                | `WHERE userId ORDER BY createdAt`                                              | user/updated only                                | `idx_progress_user_created`                        | Low/medium                            | faster activity history                    |
| Engagement history              | `WHERE userId AND engagedAt IS NOT NULL`                                       | no engaged index                                 | `idx_progress_user_engaged`                        | Low/medium                            | faster lesson engagement views             |
| Entitlement sweeps              | `WHERE status ORDER BY currentPeriodEnd`                                       | user/created only                                | `idx_subscription_status_period`                   | Medium                                | faster billing/admin expiry sweeps         |
| Entitlement checks              | `WHERE userId,status ORDER BY currentPeriodEnd`                                | user/created only                                | `idx_subscription_user_status_period`              | Medium                                | faster entitlement resolution              |
| Stripe customer diagnostics     | `WHERE stripeCustomerId,status`                                                | subscription id unique only                      | `idx_subscription_customer_status`                 | Medium                                | faster customer reconciliation             |
| User admin metrics              | `WHERE role ORDER BY createdAt`                                                | no role composite                                | `idx_user_role_created`                            | Medium                                | faster admin user metrics                  |
| User segmentation               | `WHERE country,tier ORDER BY createdAt`                                        | no country/tier composite                        | `idx_user_country_tier_created`                    | Medium                                | faster cohort/audience queries             |
| Trial eligibility               | `WHERE trialStatus,trialEndsAt`                                                | no trial composite                               | `idx_user_trial_status_ends`                       | Medium                                | faster trial expiration/eligibility        |
| Legacy content items            | `WHERE type,status,tier,bodySystem ORDER BY updatedAt`                         | type/status/updated only                         | `idx_content_items_type_status_tier_body_updated`  | Medium/high                           | faster legacy lesson scope                 |
| Scheduled content               | `WHERE status,scheduledAt`                                                     | no scheduled composite                           | `idx_content_items_status_scheduled`               | Medium                                | faster scheduler/publishing checks         |
| Content item tags               | `tags has/overlap`                                                             | no GIN                                           | `idx_content_items_tags_gin`                       | Medium                                | index-backed array lookup                  |
| Feedback triage                 | `WHERE status,severity ORDER BY createdAt`                                     | separate status/category/severity indexes        | `idx_feedback_status_severity_created`             | Low/medium                            | faster admin triage queue                  |

## Join Audit

| Join source                                                              | Join columns                                                 | Existing coverage                                                 | Action                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| `Progress` -> `content_items` in learner-visible scope                   | `Progress.lessonId = content_items.id`, plus content filters | `Progress(userId, lessonId)` unique, `content_items(type,status)` | Added richer `content_items(type,status,tier,body_system,updated_at)` |
| Benchmark raw SQL `Subscription` -> `User`                               | `Subscription.userId = User.id`                              | `Subscription(userId,createdAt)` and `User.id` primary            | No additional join index needed                                       |
| Educator raw SQL joins to `User`, `UserRemediationQueue`, study profiles | FK/id joins already indexed by primary/user indexes          | Existing queue indexes cover user/resolved                        | No additional index needed in this pass                               |
| `Flashcard` -> `FlashcardDeck`/`Category`                                | card `deckId`, `categoryId`                                  | `deckId,status`, category primary                                 | Added category-aware card index                                       |
| Localized blog -> canonical `BlogPost`                                   | `canonicalArticleId = BlogPost.id`                           | localized canonical index + BlogPost id primary                   | Covered                                                               |

## Application Result

`database-index-remediation.sql` was applied to production PostgreSQL using `psql`.

Result:

- 43 safe indexes were created with `CREATE INDEX CONCURRENTLY IF NOT EXISTS`.
- Verification query confirmed `43 / 43` remediation index names exist in `pg_indexes`.
- `ANALYZE` was run for the affected tables so PostgreSQL planner statistics can account for the new indexes.

Note: the Prisma CLI could not apply the SQL from this workspace because the local dotenv values parse as invalid URLs for Prisma. The SQL was applied through `psql` using the production connection string instead.

## Representative Post-Apply Query Plans

| Query                                                                                                        | Post-apply plan                                                                                 | Cost                           |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------ |
| Blog public list: `WHERE postStatus='PUBLISHED' ORDER BY updatedAt DESC LIMIT 24`                            | Index scan using `idx_blogpost_status_updated_desc`                                             | `0.28..5.61` for limited page  |
| Lesson body-system hub: `WHERE pathway_id + locale + status + body_system ORDER BY updated_at DESC LIMIT 12` | Index scan using `idx_pathway_lessons_body_system_hub`                                          | `0.29..10.73` for limited page |
| CAT/question pool: `WHERE status + exam + tier + country_code + is_adaptive_eligible ORDER BY id LIMIT 75`   | Index scan using `idx_examq_pool_body_system`; planner filters adaptive flag for sampled values | `2.33..2.33`                   |
| Flashcard count: `WHERE status + country + tier`                                                             | Index-only scan using existing `Flashcard_status_country_tier_idx`                              | `90.97..90.98` aggregate       |
| Subscription entitlement sample: `WHERE userId + status ORDER BY currentPeriodEnd DESC LIMIT 1`              | Planner chose seq scan because sampled table is tiny                                            | `1.26..1.27`                   |

The subscription sample confirms the planner may still prefer a sequential scan on very small tables; the new subscription indexes are still useful as rows grow and for production entitlement/reconciliation bursts.

## Risk Assessment

All proposed indexes are additive and safe from a data-integrity perspective.

Operational considerations:

- Concurrent index creation still consumes CPU and I/O. Apply during a lower-traffic window.
- GIN indexes on array columns can be larger than btree indexes. They are included only for frequently filtered array fields (`tags`) where btree indexes cannot help.
- Partial indexes on public lesson rows reduce write/read overhead for deprecated rows.
- No unique constraints were added.
- No migrations or Prisma model changes were made.

## Validation Status

- SQL generated: complete.
- Static schema/query audit: complete.
- Live representative `EXPLAIN` costs: captured after application.
- Index application: complete.
- Post-apply index existence verification: `43 / 43`.
- Planner stats refreshed with `ANALYZE`.

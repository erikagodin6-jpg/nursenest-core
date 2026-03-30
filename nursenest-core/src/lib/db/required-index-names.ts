/**
 * Index names created by scale migrations (`20260330220000_pathway_lesson_locale_scale_indexes`, etc.).
 * Used by `scripts/verify-required-db-indexes.ts` — keep in sync when adding migrations.
 *
 * **Coverage vs hot paths (planner-dependent; verify with EXPLAIN in prod):**
 *
 * - **Subscriber discovery SQL** (`exam_questions` + `status` + `tier IN (…)` + `region_scope`):
 *   `exam_questions_status_exam_tier_country_idx` and/or `exam_questions_status_updated_at_idx` align with common filters.
 *   Distinct `GROUP BY topic` / `exam` may still sort/hash large filtered sets; `statement_timeout` bounds wall time.
 *
 * - **Paginated pathway hub / topic lists** (`pathway_lessons` + pathway + locale + status + sort_order / topic_slug):
 *   `pathway_lessons_pathway_locale_status_sort_idx`, `pathway_lessons_pathway_topic_locale_status_idx`.
 *
 * - **Subscriber question list** (`orderBy: updatedAt` + entitlement filters):
 *   `exam_questions_status_updated_at_idx`, `exam_questions_status_exam_tier_country_idx`.
 *
 * - **App `content_items` lesson lists**: `content_items_type_status_updated_at_idx`.
 */
export const REQUIRED_PUBLIC_INDEX_NAMES = [
  "pathway_lessons_pathway_id_slug_locale_key",
  "pathway_lessons_pathway_locale_status_sort_idx",
  "pathway_lessons_pathway_topic_locale_status_idx",
  "exam_questions_status_updated_at_idx",
  "exam_questions_status_exam_tier_country_idx",
  "content_items_type_status_updated_at_idx",
] as const;

/** Optional: absent if `Progress` model not migrated in a fork. */
export const OPTIONAL_PUBLIC_INDEX_NAMES = ["Progress_userId_updatedAt_idx"] as const;

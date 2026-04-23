/** Stable API codes for POST /api/practice-tests (CAT branch). Keep in sync with route + cat-session. */
export const PRACTICE_TEST_CAT_CREATE_CODE = {
  cat_invalid_question_count: "cat_invalid_question_count",
  exam_sim_disabled: "exam_sim_disabled",
  exam_sim_unsupported_pathway: "exam_sim_unsupported_pathway",
  pathway_not_found: "pathway_not_found",
  pathway_not_entitled: "pathway_not_entitled",
  cat_weak_areas_empty: "cat_weak_areas_empty",
  cat_missed_items_empty: "cat_missed_items_empty",
  cat_pool_invalid: "cat_pool_invalid",
  cat_pick_failed: "cat_pick_failed",
  /** No CAT-eligible pathway for this subscription (nothing to scope the session to). */
  cat_pathway_required: "cat_pathway_required",
  /** More than one CAT-eligible pathway — client must send `pathwayId` (no silent default). */
  cat_pathway_ambiguous: "cat_pathway_ambiguous",
  /** Upcoming / waitlist / info-only — CAT not offered for this track yet. */
  pathway_track_not_ready: "pathway_track_not_ready",
  cat_create_failed: "cat_create_failed",
} as const;

export type PracticeTestCatCreateErrorCode = (typeof PRACTICE_TEST_CAT_CREATE_CODE)[keyof typeof PRACTICE_TEST_CAT_CREATE_CODE];

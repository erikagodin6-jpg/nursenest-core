/** Stable API codes for POST /api/practice-tests (CAT branch). Keep in sync with route + cat-session. */
export const PRACTICE_TEST_CAT_CREATE_CODE = {
  exam_sim_disabled: "exam_sim_disabled",
  exam_sim_unsupported_pathway: "exam_sim_unsupported_pathway",
  pathway_not_found: "pathway_not_found",
  pathway_not_entitled: "pathway_not_entitled",
  cat_weak_areas_empty: "cat_weak_areas_empty",
  cat_pool_invalid: "cat_pool_invalid",
  cat_pick_failed: "cat_pick_failed",
  /** No pathway in request and no default pathway from subscription profile. */
  cat_pathway_required: "cat_pathway_required",
  cat_create_failed: "cat_create_failed",
} as const;

export type PracticeTestCatCreateErrorCode = (typeof PRACTICE_TEST_CAT_CREATE_CODE)[keyof typeof PRACTICE_TEST_CAT_CREATE_CODE];

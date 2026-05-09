import assert from "node:assert/strict";
import { test } from "node:test";
import { MARKETING_HUB_CATEGORY_PAGE_SIZE } from "@/lib/lessons/marketing-lessons-hub-category";

/**
 * Marketing category drill-down must not dump hundreds of lesson cards on first paint.
 * Target band from product perf PR: ~40–60 cards per paginated page.
 */
test("marketing hub category page size stays within 40–60 card cap", () => {
  assert.ok(MARKETING_HUB_CATEGORY_PAGE_SIZE >= 40);
  assert.ok(MARKETING_HUB_CATEGORY_PAGE_SIZE <= 60);
});

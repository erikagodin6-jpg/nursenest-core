/**
 * Marketing hub default page size must never regress to a single row (curriculum + pagination contract).
 *
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-scale.contract.test.ts`
 */
import assert from "node:assert/strict";
import test from "node:test";
import { PATHWAY_HUB_PAGE_SIZE_DEFAULT, PATHWAY_HUB_PAGE_SIZE_MAX } from "@/lib/lessons/pathway-lesson-scale";

test("PATHWAY_HUB_PAGE_SIZE_DEFAULT is not 1", () => {
  assert.ok(PATHWAY_HUB_PAGE_SIZE_DEFAULT > 1);
  assert.ok(PATHWAY_HUB_PAGE_SIZE_MAX >= PATHWAY_HUB_PAGE_SIZE_DEFAULT);
});

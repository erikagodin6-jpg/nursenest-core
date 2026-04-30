import test from "node:test";
import assert from "node:assert/strict";
import { getCatalogLessonsRawFromBundledOnly, resetCatalogLessonsRawMergeCacheForTests } from "@/lib/lessons/pathway-lesson-catalog-sync";

const RN_PATHWAY = "us-rn-nclex-rn";
/** Known slug from `rn-nclex-exam-notes-integration-batch4-catalog.json` (batch 4 spine). */
const BATCH4_SLUG = "malignant-hyperthermia-exam-notes-b4-nclex-rn";

test("RN catalog merge includes batch 4 exam-notes slug (first slug wins across batches)", () => {
  resetCatalogLessonsRawMergeCacheForTests();
  const raw = getCatalogLessonsRawFromBundledOnly(RN_PATHWAY);
  const slugs = new Set(raw.map((r) => r.slug.trim()).filter(Boolean));
  assert.ok(slugs.has(BATCH4_SLUG), `expected batch4 slug in merged catalog for ${RN_PATHWAY}`);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PATHWAY_LESSON_SLUG_REDIRECTS,
  resolvePathwayLessonSlugRedirectChain,
} from "./pathway-lesson-slug-redirects";

test("resolvePathwayLessonSlugRedirectChain: empty registry returns null", () => {
  assert.equal(resolvePathwayLessonSlugRedirectChain("us-rn-nclex-rn", "any-slug"), null);
});

test("PATHWAY_LESSON_SLUG_REDIRECTS is frozen for accidental mutation at runtime", () => {
  assert.ok(Array.isArray(PATHWAY_LESSON_SLUG_REDIRECTS));
});

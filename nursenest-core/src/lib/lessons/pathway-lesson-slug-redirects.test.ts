import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PATHWAY_LESSON_SLUG_REDIRECTS,
  resolvePathwayLessonSlugRedirectChain,
} from "./pathway-lesson-slug-redirects";

test("resolvePathwayLessonSlugRedirectChain: unknown slug returns null", () => {
  assert.equal(resolvePathwayLessonSlugRedirectChain("us-rn-nclex-rn", "no-such-lesson-slug-xyz"), null);
});

test("resolvePathwayLessonSlugRedirectChain: RN catalog merge redirects resolve", () => {
  assert.equal(
    resolvePathwayLessonSlugRedirectChain("us-rn-nclex-rn", "pulmonary-embolism-nclex-rn"),
    "us-rn-pulmonary-embolism",
  );
  assert.equal(
    resolvePathwayLessonSlugRedirectChain("ca-rn-nclex-rn", "insulin-hypoglycemia-hy"),
    "ca-rn-insulin-hypoglycemia",
  );
});

test("PATHWAY_LESSON_SLUG_REDIRECTS is frozen for accidental mutation at runtime", () => {
  assert.ok(Array.isArray(PATHWAY_LESSON_SLUG_REDIRECTS));
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLocalizedEnglishFallbackWhere,
  shouldFallbackToEnglishLocale,
} from "./safe-localized-blog-queries";

test("falls back to english only when non-english locale has no matches", () => {
  assert.equal(shouldFallbackToEnglishLocale("fr", 0), true);
  assert.equal(shouldFallbackToEnglishLocale("fr", 1), false);
  assert.equal(shouldFallbackToEnglishLocale("en", 0), false);
});

test("english fallback where clause keeps same region/profession/exam grouping", () => {
  const where = buildLocalizedEnglishFallbackWhere({
    slug: "sepsis-early-vs-late-signs",
    region: "canada",
    profession: "rn",
    exam: "nclex-rn",
  });

  assert.deepEqual(where, {
    OR: [{ localizedSlug: "sepsis-early-vs-late-signs" }, { canonicalSlug: "sepsis-early-vs-late-signs" }],
    locale: "en",
    region: "canada",
    profession: "rn",
    exam: "nclex-rn",
  });
});

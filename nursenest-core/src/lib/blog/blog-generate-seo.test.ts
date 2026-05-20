import assert from "node:assert/strict";
import { test } from "node:test";
import { CountryCode } from "@prisma/client";
import {
  generateBlogSEO,
  generateBlogSEOFromPostRow,
  isValidBlogSlug,
  mergeFaqForSchema,
  normalizeCountryForBlogSeo,
  normalizeExamForBlogSeo,
  slugifyBlogSeoSegment,
} from "./blog-generate-seo";

test("normalizeExamForBlogSeo maps common labels", () => {
  assert.equal(normalizeExamForBlogSeo("NCLEX-RN"), "NCLEX-RN");
  assert.equal(normalizeExamForBlogSeo("REX-PN"), "REx-PN");
  assert.equal(normalizeExamForBlogSeo("CNPLE"), "NP");
});

test("generateBlogSEO returns bounded title and meta description", () => {
  const out = generateBlogSEO({
    title: "End-of-Dose Wearing Off in Parkinson Disease — a complete guide | NurseNest",
    topic: "Neurology",
    exam: "NCLEX-RN",
    country: "Canada",
    existingSlug: "parkinson-wearing-off-nclex",
  });
  assert.ok(out.seoTitle.length <= 60);
  assert.ok(out.metaDescription.length >= 120 && out.metaDescription.length <= 155);
  assert.ok(out.h1.toLowerCase().includes("nclex-rn"));
  assert.ok(out.intro.includes("Canada"));
  assert.equal(out.slug, "parkinson-wearing-off-nclex");
  assert.ok(out.faq.length >= 3);
  assert.equal(out.breadcrumbs[0].href, "/");
  assert.ok(out.canonicalPath.startsWith("/blog/"));
});

test("generateBlogSEOFromPostRow respects allied canonical override", () => {
  const out = generateBlogSEOFromPostRow(
    {
      title: "Sample allied topic",
      slug: "sample-allied",
      category: "PT",
      tags: [],
      exam: "ALLIED",
      countryTarget: CountryCode.CA,
    },
    { canonicalPath: "/allied-health/pt/blog/sample-allied" },
  );
  assert.equal(out.canonicalPath, "/allied-health/pt/blog/sample-allied");
});

test("mergeFaqForSchema dedupes and caps", () => {
  const merged = mergeFaqForSchema(
    [{ q: "What is X?", a: "A1" }],
    [
      { question: "What is X?", answer: "dup" },
      { question: "Second?", answer: "B" },
      { question: "Third?", answer: "C" },
      { question: "Fourth?", answer: "D" },
      { question: "Fifth?", answer: "E" },
      { question: "Sixth?", answer: "F" },
    ],
    { max: 4 },
  );
  assert.equal(merged.length, 4);
});

test("isValidBlogSlug rejects invalid segments", () => {
  assert.equal(isValidBlogSlug("ok-slug-2"), true);
  assert.equal(isValidBlogSlug("Bad"), false);
  assert.equal(isValidBlogSlug("a".repeat(200)), false);
});

test("slugifyBlogSeoSegment produces kebab-case", () => {
  assert.equal(slugifyBlogSeoSegment("Hello  World!!!"), "hello-world");
});

test("normalizeCountryForBlogSeo", () => {
  assert.equal(normalizeCountryForBlogSeo(CountryCode.CA), "Canada");
  assert.equal(normalizeCountryForBlogSeo(CountryCode.US), "United States");
});

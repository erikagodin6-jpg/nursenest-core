import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeBlogGenerationInput,
  normalizeTitleToSlug,
  sanitizeAiReturnedSlug,
  sanitizeAiSeoOutput,
} from "@/lib/blog/normalize-blog-generation-input";
import { cleanBlogSlugInput, BLOG_SLUG_FORMAT_RE } from "@/lib/blog/blog-optional-slug";

// Helper to assert a valid slug
function assertValidSlug(slug: string, label: string) {
  assert.ok(
    BLOG_SLUG_FORMAT_RE.test(slug),
    `${label}: slug "${slug}" does not match BLOG_SLUG_FORMAT_RE`,
  );
  assert.ok(slug.length >= 3, `${label}: slug "${slug}" is too short`);
  assert.ok(slug.length <= 100, `${label}: slug "${slug}" is too long (>100 chars)`);
}

describe("normalizeTitleToSlug — regression titles", () => {
  const cases: Array<{ title: string; label: string }> = [
    {
      title:
        "A Step-by-Step Pathophysiology Breakdown of Heart Failure (HFrEF vs HFpEF): From Cellular Changes to NCLEX-Style Questions",
      label: "long clinical title with parens and colon",
    },
    {
      title: "ABGs: Respiratory Acidosis/Alkalosis & Compensation — Nursing Guide",
      label: "ABGs with slash, ampersand, and em-dash",
    },
    {
      title: "SIADH vs DI: What Nurses Need to Know!",
      label: "SIADH vs DI with exclamation",
    },
    {
      title: "🔥 Shock Pathophysiology: Septic, Cardiogenic & Hypovolemic",
      label: "emoji + clinical terms with ampersand",
    },
    {
      title: "Pediatric Cardiac ICU: Family-Centred Care & Clinical Reasoning",
      label: "clinical ICU title with ampersand",
    },
    {
      title: "HFrEF/HFpEF Comparison — NCLEX Review",
      label: "slash in abbreviations",
    },
    {
      title: "REx-PN: What You Need to Know Before Test Day",
      label: "hyphenated exam abbreviation with colon",
    },
    {
      title: "NCLEX-Style Questions: Prioritization (ABCDs of Assessment)",
      label: "parens and colon together",
    },
    {
      title: "Medication Math: Drips, Rates & Safety Checks ✅",
      label: "emoji at end",
    },
    {
      title: "Blood Pressure — Normal vs Abnormal: A Visual Guide (Hypo/Hypertension)",
      label: "em-dash and slash in parens",
    },
  ];

  for (const { title, label } of cases) {
    it(`generates a valid slug for: ${label}`, () => {
      const slug = normalizeTitleToSlug(title);
      assertValidSlug(slug, label);
    });
  }

  it("falls back gracefully when input is only symbols", () => {
    const slug = normalizeTitleToSlug("!!!???:::///");
    assert.ok(typeof slug === "string" && slug.length > 0, "should return a non-empty string");
    // Fallback slug may be timestamp-based and not match BLOG_SLUG_FORMAT_RE with 3-char min
    // but should be a non-empty string
  });

  it("falls back when input is empty", () => {
    const slug = normalizeTitleToSlug("");
    assert.ok(slug.startsWith("generated-blog-post-"), "should return timestamped fallback");
  });
});

describe("normalizeBlogGenerationInput — field contracts", () => {
  it("produces all required fields from a complex title", () => {
    const result = normalizeBlogGenerationInput(
      "A Step-by-Step Pathophysiology Breakdown of Heart Failure (HFrEF vs HFpEF): From Cellular Changes to NCLEX-Style Questions",
    );
    assert.ok(result.cleanTitle.length > 0, "cleanTitle must be non-empty");
    assertValidSlug(result.slug, "normalizeBlogGenerationInput slug");
    assert.ok(result.seoTitle.length <= 70, "seoTitle must be ≤70 chars");
    assert.ok(result.metaDescription.length <= 155, "metaDescription must be ≤155 chars");
    assert.ok(result.excerptSeed.length <= 200, "excerptSeed must be ≤200 chars");
    assert.ok(Array.isArray(result.topicKeywords), "topicKeywords must be an array");
    assert.ok(result.canonicalPath.startsWith("/blog/"), "canonicalPath must start with /blog/");
    assert.ok(
      !result.canonicalPath.includes(":") && !result.canonicalPath.includes("("),
      "canonicalPath must not contain raw title chars",
    );
  });

  it("does not put raw title into canonicalPath", () => {
    const rawTitle = "HFrEF vs HFpEF: From Cellular Changes";
    const { canonicalPath } = normalizeBlogGenerationInput(rawTitle);
    assert.ok(!canonicalPath.includes(":"), "canonicalPath must not contain colon");
    assert.ok(!canonicalPath.includes("("), "canonicalPath must not contain parens");
  });

  it("handles emoji-only prefix", () => {
    const result = normalizeBlogGenerationInput("🔥 Shock Pathophysiology: Septic & Cardiogenic");
    assertValidSlug(result.slug, "emoji prefix");
    assert.ok(!result.cleanTitle.includes("🔥"), "cleanTitle should not contain emoji");
  });
});

describe("cleanBlogSlugInput — special character handling", () => {
  const cases: Array<{ input: string; expectedContains?: string; label: string }> = [
    { input: "HFrEF vs HFpEF: From Cellular Changes", label: "colon" },
    { input: "ABGs & Compensation", expectedContains: "and", label: "ampersand becomes and" },
    { input: "Respiratory Acidosis/Alkalosis", label: "slash" },
    { input: "🔥 Shock Pathophysiology", label: "emoji" },
    { input: "NCLEX-Style: Review (Part 1)", label: "mixed special chars" },
    { input: "REx-PN — Test Guide", label: "em-dash" },
    { input: "Pédiatrie et soins", label: "Unicode accented chars" },
  ];

  for (const { input, expectedContains, label } of cases) {
    it(`safely normalizes: ${label}`, () => {
      const cleaned = cleanBlogSlugInput(input);
      if (cleaned.length > 0) {
        assert.ok(
          BLOG_SLUG_FORMAT_RE.test(cleaned),
          `cleaned "${cleaned}" from "${input}" must match slug format`,
        );
      }
      if (expectedContains) {
        assert.ok(
          cleaned.includes(expectedContains),
          `cleaned "${cleaned}" should contain "${expectedContains}"`,
        );
      }
    });
  }
});

describe("sanitizeAiReturnedSlug", () => {
  it("accepts a clean AI slug", () => {
    const slug = sanitizeAiReturnedSlug("heart-failure-nclex", "Heart Failure NCLEX");
    assert.equal(slug, "heart-failure-nclex");
  });

  it("normalizes a messy AI slug", () => {
    const slug = sanitizeAiReturnedSlug("HFrEF: vs HFpEF!", "HFrEF vs HFpEF");
    assertValidSlug(slug, "messy AI slug");
  });

  it("normalizes AI slug suggestions that are actually raw admin article titles", () => {
    const cases = [
      "Nephrotic Syndrome and Low Urine Output: What Nurses Need to Know",
      "Why does COPD cause CO2 retention?",
      "CABG: Priority Nursing Assessments After Surgery",
      "Parkinson’s Disease: Nursing Priorities & Red Flags",
    ];

    for (const title of cases) {
      const slug = sanitizeAiReturnedSlug(title, `nclex-rn ${title}`);
      assertValidSlug(slug, title);
      assert.ok(!slug.includes(":") && !slug.includes("?") && !slug.includes("&"), slug);
    }
  });

  it("falls back to title-derived slug when AI slug is empty", () => {
    const slug = sanitizeAiReturnedSlug("", "Heart Failure Guide");
    assertValidSlug(slug, "empty AI slug fallback");
  });

  it("falls back to title-derived slug when AI slug is null", () => {
    const slug = sanitizeAiReturnedSlug(null, "ABGs Nursing Guide");
    assertValidSlug(slug, "null AI slug fallback");
  });
});

describe("sanitizeAiSeoOutput", () => {
  it("clamps seoTitle to 70 chars", () => {
    const result = sanitizeAiSeoOutput({
      seoTitle: "A".repeat(120),
    });
    assert.ok((result.seoTitle?.length ?? 0) <= 70, "seoTitle must be ≤70 chars");
  });

  it("clamps metaDescription to 155 chars", () => {
    const result = sanitizeAiSeoOutput({
      metaDescription: "B".repeat(200),
    });
    assert.ok((result.metaDescription?.length ?? 0) <= 155, "metaDescription must be ≤155 chars");
  });

  it("rejects non-string tags", () => {
    const result = sanitizeAiSeoOutput({
      tags: ["valid-tag", 42, null, { obj: true }, "another-tag"],
    });
    assert.deepEqual(result.tags, ["valid-tag", "another-tag"]);
  });

  it("clamps tags to 20 items", () => {
    const result = sanitizeAiSeoOutput({
      tags: Array.from({ length: 30 }, (_, i) => `tag-${i}`),
    });
    assert.equal(result.tags.length, 20);
  });

  it("handles null/undefined fields gracefully", () => {
    const result = sanitizeAiSeoOutput({});
    assert.equal(result.title, null);
    assert.equal(result.seoTitle, null);
    assert.equal(result.metaDescription, null);
    assert.equal(result.category, null);
    assert.deepEqual(result.tags, []);
  });
});

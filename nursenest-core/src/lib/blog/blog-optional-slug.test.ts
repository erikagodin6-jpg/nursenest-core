import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BlogInvalidSlugError,
  BLOG_SLUG_FORMAT_RE,
  cleanBlogSlugInput,
  generateBlogSlugBaseFromTitle,
  liveNormalizeBlogSlugInputValue,
  normalizeSlugPreprocess,
  parseOptionalBlogSlug,
} from "@/lib/blog/blog-optional-slug";

describe("parseOptionalBlogSlug", () => {
  it("allows empty slug and auto-generate signal (null)", () => {
    assert.equal(parseOptionalBlogSlug(""), null);
    assert.equal(parseOptionalBlogSlug("   "), null);
    assert.equal(parseOptionalBlogSlug(undefined), null);
    assert.equal(parseOptionalBlogSlug(null), null);
  });

  it("normalizes uppercase and spaces", () => {
    assert.equal(parseOptionalBlogSlug("Sepsis Guide"), "sepsis-guide");
    assert.equal(parseOptionalBlogSlug("Sepsis!! Guide??"), "sepsis-guide");
  });

  it("rejects invalid slug format (too short when provided)", () => {
    assert.throws(() => parseOptionalBlogSlug("ab"), BlogInvalidSlugError);
  });

  it("rejects non-empty input that cleans to nothing", () => {
    assert.throws(() => parseOptionalBlogSlug("###"), BlogInvalidSlugError);
  });

  it("normalizes clinical titles with colons and parens", () => {
    const slug = parseOptionalBlogSlug("HFrEF vs HFpEF: From Cellular Changes");
    assert.ok(slug !== null && BLOG_SLUG_FORMAT_RE.test(slug), `slug "${slug}" should be valid`);
  });

  it("handles ampersand conversion", () => {
    const slug = parseOptionalBlogSlug("ABGs & Compensation");
    assert.ok(slug !== null && slug.includes("and"), `slug "${slug}" should contain 'and'`);
  });
});

describe("generateBlogSlugBaseFromTitle", () => {
  it("builds kebab-case from title", () => {
    assert.equal(generateBlogSlugBaseFromTitle("Sepsis Management"), "sepsis-management");
  });

  it("handles long clinical title with special chars", () => {
    const slug = generateBlogSlugBaseFromTitle(
      "A Step-by-Step Pathophysiology Breakdown of Heart Failure (HFrEF vs HFpEF): From Cellular Changes to NCLEX-Style Questions",
    );
    assert.ok(BLOG_SLUG_FORMAT_RE.test(slug), `slug "${slug}" should match format`);
  });

  it("handles emoji in title", () => {
    const slug = generateBlogSlugBaseFromTitle("🔥 Shock Pathophysiology: Septic & Cardiogenic");
    assert.ok(BLOG_SLUG_FORMAT_RE.test(slug), `slug "${slug}" should match format`);
    assert.ok(!slug.includes("🔥"), "slug should not contain emoji");
  });

  it("returns non-empty string for symbol-only input", () => {
    const slug = generateBlogSlugBaseFromTitle("???!!!");
    assert.ok(typeof slug === "string" && slug.length > 0, "should be non-empty");
  });
});

describe("liveNormalizeBlogSlugInputValue", () => {
  it("lowercases and strips invalid characters for controlled inputs", () => {
    assert.equal(liveNormalizeBlogSlugInputValue("Hello World!!!"), "hello-world");
  });

  it("converts ampersand to and", () => {
    const result = liveNormalizeBlogSlugInputValue("ABGs & Compensation");
    assert.ok(result.includes("and"), `"${result}" should contain 'and'`);
  });

  it("handles emoji", () => {
    const result = liveNormalizeBlogSlugInputValue("🔥 Shock Patho");
    assert.ok(!result.includes("🔥"), "should not contain emoji");
  });
});

describe("cleanBlogSlugInput", () => {
  it("trims edges and collapses hyphens", () => {
    assert.equal(cleanBlogSlugInput("  foo---bar  "), "foo-bar");
  });

  it("strips emojis safely", () => {
    const result = cleanBlogSlugInput("🔥 Shock Pathophysiology");
    assert.ok(BLOG_SLUG_FORMAT_RE.test(result), `"${result}" should match slug format`);
    assert.ok(!result.includes("🔥"), "should not contain emoji");
  });

  it("converts colon and slash to hyphens", () => {
    const result = cleanBlogSlugInput("ABGs: Respiratory Acidosis/Alkalosis");
    assert.ok(BLOG_SLUG_FORMAT_RE.test(result), `"${result}" should match slug format`);
  });

  it("converts & to and", () => {
    const result = cleanBlogSlugInput("ABGs & Compensation");
    assert.ok(result.includes("and"), `"${result}" should contain 'and'`);
  });

  it("handles em-dash", () => {
    const result = cleanBlogSlugInput("REx-PN — Nursing Guide");
    assert.ok(BLOG_SLUG_FORMAT_RE.test(result), `"${result}" should match slug format`);
  });
});

describe("normalizeSlugPreprocess", () => {
  it("returns undefined for null/undefined", () => {
    assert.equal(normalizeSlugPreprocess(null), undefined);
    assert.equal(normalizeSlugPreprocess(undefined), undefined);
  });

  it("returns undefined for blank string", () => {
    assert.equal(normalizeSlugPreprocess(""), undefined);
    assert.equal(normalizeSlugPreprocess("   "), undefined);
  });

  it("returns undefined for non-string", () => {
    assert.equal(normalizeSlugPreprocess(42), undefined);
  });

  it("normalizes a raw title to a valid slug", () => {
    const result = normalizeSlugPreprocess("HFrEF vs HFpEF: From Cellular Changes");
    assert.ok(result !== undefined && BLOG_SLUG_FORMAT_RE.test(result), `"${result}" should be valid`);
  });

  it("returns undefined when cleaned slug is too short (<3 chars)", () => {
    const result = normalizeSlugPreprocess("ab");
    assert.equal(result, undefined);
  });

  it("returns undefined when input cleans to empty (all symbols)", () => {
    const result = normalizeSlugPreprocess("???!!!");
    assert.equal(result, undefined);
  });
});

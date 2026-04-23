import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BlogInvalidSlugError,
  cleanBlogSlugInput,
  generateBlogSlugBaseFromTitle,
  liveNormalizeBlogSlugInputValue,
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
});

describe("generateBlogSlugBaseFromTitle", () => {
  it("builds kebab-case from title", () => {
    assert.equal(generateBlogSlugBaseFromTitle("Sepsis Management"), "sepsis-management");
  });
});

describe("liveNormalizeBlogSlugInputValue", () => {
  it("lowercases and strips invalid characters for controlled inputs", () => {
    assert.equal(liveNormalizeBlogSlugInputValue("Hello World!!!"), "hello-world");
  });
});

describe("cleanBlogSlugInput", () => {
  it("trims edges and collapses hyphens", () => {
    assert.equal(cleanBlogSlugInput("  foo---bar  "), "foo-bar");
  });
});

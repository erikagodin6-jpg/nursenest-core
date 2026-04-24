import assert from "node:assert/strict";
import test from "node:test";
import { expectedGeneratedBlogPaths, isNursingScopedCareerSlug } from "./blog-scoped-career-hubs";

test("expectedGeneratedBlogPaths: RN uses /nursing/rn/blog hub", () => {
  const p = expectedGeneratedBlogPaths({ slug: "my-post-slug", careerSlug: "rn" });
  assert.equal(p.expectedPublicBlogPath, "/nursing/rn/blog");
  assert.equal(p.expectedDetailPath, "/nursing/rn/blog/my-post-slug");
  assert.equal(p.scopedListPath, "/nursing/rn/blog");
});

test("expectedGeneratedBlogPaths: PN and NP hubs", () => {
  assert.equal(expectedGeneratedBlogPaths({ slug: "a", careerSlug: "pn" }).expectedPublicBlogPath, "/nursing/pn/blog");
  assert.equal(expectedGeneratedBlogPaths({ slug: "b", careerSlug: "np" }).expectedPublicBlogPath, "/nursing/np/blog");
});

test("expectedGeneratedBlogPaths: allied profession keys map under /allied-health/…/blog", () => {
  const p = expectedGeneratedBlogPaths({ slug: "x", careerSlug: "paramedic" });
  assert.equal(p.expectedPublicBlogPath, "/allied-health/paramedic/blog");
  assert.equal(p.expectedDetailPath, "/allied-health/paramedic/blog/x");
  assert.equal(p.scopedListPath, "/allied-health/paramedic/blog");
});

test("expectedGeneratedBlogPaths: null career uses global /blog", () => {
  const p = expectedGeneratedBlogPaths({ slug: "global-slug", careerSlug: null });
  assert.equal(p.expectedPublicBlogPath, "/blog");
  assert.equal(p.expectedDetailPath, "/blog/global-slug");
  assert.equal(p.scopedListPath, null);
});

test("isNursingScopedCareerSlug", () => {
  assert.equal(isNursingScopedCareerSlug("rn"), true);
  assert.equal(isNursingScopedCareerSlug("ALLIED"), false);
});

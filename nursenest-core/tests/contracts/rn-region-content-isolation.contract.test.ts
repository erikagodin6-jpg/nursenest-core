/**
 * Contract: RN region content isolation — verifies that Canada RN content does not leak into
 * US RN and vice versa. Prevents copy contamination between regional ecosystems.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/rn-region-content-isolation.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getRnRegionalHubCopy } from "../../src/lib/marketing/rn-regional-hub-copy.ts";
import { expectedGeneratedBlogPaths } from "../../src/lib/blog/blog-scoped-career-hubs.ts";

describe("Canada RN content does not contain US-specific copy", () => {
  const copy = getRnRegionalHubCopy("ca-rn-nclex-rn")!;

  it("Canada employment body does not mention US residency programs", () => {
    assert.doesNotMatch(copy.employmentBody.toLowerCase(), /us residency program/);
    assert.doesNotMatch(copy.employmentBody.toLowerCase(), /united states/);
  });

  it("Canada medication note does not reference ISMP (US-specific)", () => {
    assert.doesNotMatch(copy.medicationSafetyNote.toLowerCase(), /ismp/);
  });
});

describe("US RN content does not contain Canada-specific copy", () => {
  const copy = getRnRegionalHubCopy("us-rn-nclex-rn")!;

  it("US employment body does not mention Canadian employers", () => {
    assert.doesNotMatch(copy.employmentBody.toLowerCase(), /canadian employer/);
  });

  it("US study plan does not mention provincial practice context", () => {
    assert.doesNotMatch(copy.studyPlanBody.toLowerCase(), /provincial/);
  });
});

describe("Blog path routing for regional slugs", () => {
  it("canada-rn careerSlug routes to /blog/canada-rn", () => {
    const paths = expectedGeneratedBlogPaths({ slug: "test-post", careerSlug: "canada-rn" });
    assert.equal(paths.expectedPublicBlogPath, "/blog/canada-rn");
    assert.equal(paths.expectedDetailPath, "/blog/canada-rn/test-post");
    assert.equal(paths.scopedListPath, "/blog/canada-rn");
  });

  it("us-rn careerSlug routes to /blog/us-rn", () => {
    const paths = expectedGeneratedBlogPaths({ slug: "nclex-tips", careerSlug: "us-rn" });
    assert.equal(paths.expectedPublicBlogPath, "/blog/us-rn");
    assert.equal(paths.expectedDetailPath, "/blog/us-rn/nclex-tips");
    assert.equal(paths.scopedListPath, "/blog/us-rn");
  });

  it("rex-pn careerSlug routes to /blog/rex-pn", () => {
    const paths = expectedGeneratedBlogPaths({ slug: "rex-pn-guide", careerSlug: "rex-pn" });
    assert.equal(paths.expectedPublicBlogPath, "/blog/rex-pn");
    assert.equal(paths.expectedDetailPath, "/blog/rex-pn/rex-pn-guide");
    assert.equal(paths.scopedListPath, "/blog/rex-pn");
  });

  it("nclex-pn careerSlug routes to /blog/nclex-pn", () => {
    const paths = expectedGeneratedBlogPaths({ slug: "lpn-prep", careerSlug: "nclex-pn" });
    assert.equal(paths.expectedPublicBlogPath, "/blog/nclex-pn");
    assert.equal(paths.expectedDetailPath, "/blog/nclex-pn/lpn-prep");
    assert.equal(paths.scopedListPath, "/blog/nclex-pn");
  });

  it("generic rn careerSlug still routes to /blog/rn (not canada-rn)", () => {
    const paths = expectedGeneratedBlogPaths({ slug: "rn-article", careerSlug: "rn" });
    assert.equal(paths.expectedPublicBlogPath, "/blog/rn");
    assert.equal(paths.expectedDetailPath, "/blog/rn/rn-article");
  });

  it("null careerSlug routes to /blog (global)", () => {
    const paths = expectedGeneratedBlogPaths({ slug: "general-article", careerSlug: null });
    assert.equal(paths.expectedPublicBlogPath, "/blog");
    assert.equal(paths.scopedListPath, null);
  });
});

describe("Regional blog cluster paths are unique and non-overlapping", () => {
  const clusters = [
    { slug: "canada-rn", expected: "/blog/canada-rn" },
    { slug: "us-rn", expected: "/blog/us-rn" },
    { slug: "rex-pn", expected: "/blog/rex-pn" },
    { slug: "nclex-pn", expected: "/blog/nclex-pn" },
  ] as const;

  it("all 4 cluster base paths are unique", () => {
    const paths = clusters.map((c) =>
      expectedGeneratedBlogPaths({ slug: "x", careerSlug: c.slug }).expectedPublicBlogPath,
    );
    const unique = new Set(paths);
    assert.equal(unique.size, 4);
  });
});

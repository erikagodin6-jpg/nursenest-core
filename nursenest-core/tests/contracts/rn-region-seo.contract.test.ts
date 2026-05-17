/**
 * Contract: RN regional SEO — verifies that Canada RN and US RN have distinct, non-overlapping
 * SEO titles/descriptions and that regional hub copy is region-isolated.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/rn-region-seo.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog.ts";
import { getRnRegionalHubCopy } from "../../src/lib/marketing/rn-regional-hub-copy.ts";

describe("RN regional SEO isolation", () => {
  const caRn = EXAM_PATHWAYS.find((p) => p.id === "ca-rn-nclex-rn")!;
  const usRn = EXAM_PATHWAYS.find((p) => p.id === "us-rn-nclex-rn")!;

  it("Canada RN seoTitle contains 'Canada'", () => {
    assert.match(caRn.seoTitle.toLowerCase(), /canada/);
  });

  it("US RN seoTitle does not contain 'Canada'", () => {
    assert.doesNotMatch(usRn.seoTitle.toLowerCase(), /canada/);
  });

  it("Canada RN and US RN have different seoTitles", () => {
    assert.notEqual(caRn.seoTitle, usRn.seoTitle);
  });

  it("Canada RN and US RN have different seoDescriptions", () => {
    assert.notEqual(caRn.seoDescription, usRn.seoDescription);
  });

  it("Both seoTitles have meaningful length (20-100 chars)", () => {
    assert.ok(caRn.seoTitle.length > 20 && caRn.seoTitle.length < 100, `Canada RN seoTitle: ${caRn.seoTitle.length} chars`);
    assert.ok(usRn.seoTitle.length > 20 && usRn.seoTitle.length < 100, `US RN seoTitle: ${usRn.seoTitle.length} chars`);
  });
});

describe("RN regional hub copy content isolation", () => {
  const caCopy = getRnRegionalHubCopy("ca-rn-nclex-rn")!;
  const usCopy = getRnRegionalHubCopy("us-rn-nclex-rn")!;

  it("Canada RN hub copy is defined", () => assert.ok(caCopy, "Canada RN copy missing"));
  it("US RN hub copy is defined", () => assert.ok(usCopy, "US RN copy missing"));

  it("Canada RN hero title references Canadian", () => {
    assert.match(caCopy.heroTitle.toLowerCase(), /canadian/);
  });

  it("Canada and US copy have different hero titles", () => {
    assert.notEqual(caCopy.heroTitle, usCopy.heroTitle);
  });

  it("Canada copy blog cluster path is /blog/canada-rn", () => {
    assert.equal(caCopy.blogClusterPath, "/blog/canada-rn");
  });

  it("US copy blog cluster path is /blog/us-rn", () => {
    assert.equal(usCopy.blogClusterPath, "/blog/us-rn");
  });

  it("Both regions have at least 3 FAQ items", () => {
    assert.ok(caCopy.faq.length >= 3, `Canada RN FAQ has ${caCopy.faq.length} items`);
    assert.ok(usCopy.faq.length >= 3, `US RN FAQ has ${usCopy.faq.length} items`);
  });

  it("Both regions have testimonial placeholders", () => {
    assert.ok(caCopy.testimonialPlaceholders.length > 0);
    assert.ok(usCopy.testimonialPlaceholders.length > 0);
  });

  it("Canada testimonials reference Canadian provinces", () => {
    const credentials = caCopy.testimonialPlaceholders.map((t) => t.credential.toLowerCase());
    const hasCanadianCred = credentials.some(
      (c) => c.includes("ontario") || c.includes("british columbia") || c.includes("alberta"),
    );
    assert.ok(hasCanadianCred, "No Canadian province found in testimonial credentials");
  });

  it("US testimonials reference US states", () => {
    const credentials = usCopy.testimonialPlaceholders.map((t) => t.credential.toLowerCase());
    const hasUsCred = credentials.some(
      (c) => c.includes("texas") || c.includes("california") || c.includes("florida"),
    );
    assert.ok(hasUsCred, "No US state found in testimonial credentials");
  });
});

describe("RN regional SEO — unknown pathway returns null", () => {
  it("returns null for non-RN pathway IDs", () => {
    assert.equal(getRnRegionalHubCopy("us-np-fnp"), null);
    assert.equal(getRnRegionalHubCopy("ca-np-cnple"), null);
    assert.equal(getRnRegionalHubCopy("ca-rpn-rex-pn"), null);
  });
});

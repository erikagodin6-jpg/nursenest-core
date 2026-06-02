/**
 * Tests for CNPLE SEO readiness guard.
 *
 * Covers:
 * - Strong cornerstone page passes all thresholds
 * - Thin stub page fails all thresholds
 * - Missing FAQ fails FAQ threshold
 * - Low internal links fails link threshold
 * - Support-tier uses lower word count threshold
 * - Remediation depth is noted in reasons
 * - Robots directive returns correct index/follow values
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isCnplePageIndexReady,
  cnpleSeoRobotsDirective,
  CNPLE_STRONG_PAGE_PROFILE,
  CNPLE_THIN_PAGE_PROFILE,
  CNPLE_SEO_THRESHOLDS,
} from "@/lib/cnple/cnple-seo-readiness";

describe("isCnplePageIndexReady", () => {
  it("strong cornerstone page is indexable", () => {
    const result = isCnplePageIndexReady(CNPLE_STRONG_PAGE_PROFILE);
    assert.equal(result.indexable, true, `Expected indexable, failures: ${result.failures.join("; ")}`);
    assert.equal(result.failures.length, 0);
    assert.ok(result.reasons.length > 0, "Must provide reasons");
  });

  it("thin stub page is not indexable", () => {
    const result = isCnplePageIndexReady(CNPLE_THIN_PAGE_PROFILE);
    assert.equal(result.indexable, false, "Thin page must not be indexable");
    assert.ok(result.failures.length > 0, "Must report failures");
  });

  it("page with insufficient FAQ is not indexable", () => {
    const result = isCnplePageIndexReady({
      wordCount: 1000,
      faqCount: 0,
      internalLinkCount: 5,
      sectionCount: 4,
      hasRemediationDepth: true,
      tier: "cornerstone",
    });
    assert.equal(result.indexable, false);
    assert.ok(
      result.failures.some((f) => f.includes("FAQ")),
      `Expected FAQ failure, got: ${result.failures.join("; ")}`,
    );
  });

  it("page with low internal links is not indexable", () => {
    const result = isCnplePageIndexReady({
      wordCount: 1000,
      faqCount: 4,
      internalLinkCount: 0,
      sectionCount: 4,
      hasRemediationDepth: true,
      tier: "cornerstone",
    });
    assert.equal(result.indexable, false);
    assert.ok(
      result.failures.some((f) => f.includes("internal link")),
      `Expected internal link failure, got: ${result.failures.join("; ")}`,
    );
  });

  it("page below word count threshold fails", () => {
    const result = isCnplePageIndexReady({
      wordCount: CNPLE_SEO_THRESHOLDS.wordCountCornerstone - 1,
      faqCount: 4,
      internalLinkCount: 5,
      sectionCount: 4,
      hasRemediationDepth: true,
      tier: "cornerstone",
    });
    assert.equal(result.indexable, false);
    assert.ok(
      result.failures.some((f) => f.includes("word count")),
      `Expected word count failure, got: ${result.failures.join("; ")}`,
    );
  });

  it("support tier uses lower word count threshold", () => {
    // A page that would fail cornerstone threshold passes as support
    const result = isCnplePageIndexReady({
      wordCount: CNPLE_SEO_THRESHOLDS.wordCountSupport + 50,
      faqCount: 2,
      internalLinkCount: 3,
      sectionCount: 2,
      hasRemediationDepth: false,
      tier: "support",
    });
    assert.equal(result.indexable, true, `Expected support page to pass, failures: ${result.failures.join("; ")}`);
  });

  it("support tier still fails if word count below support threshold", () => {
    const result = isCnplePageIndexReady({
      wordCount: CNPLE_SEO_THRESHOLDS.wordCountSupport - 1,
      faqCount: 2,
      internalLinkCount: 3,
      sectionCount: 2,
      hasRemediationDepth: false,
      tier: "support",
    });
    assert.equal(result.indexable, false);
    assert.ok(result.failures.some((f) => f.includes("word count")));
  });

  it("remediation depth is noted in reasons when present", () => {
    const result = isCnplePageIndexReady({
      ...CNPLE_STRONG_PAGE_PROFILE,
      hasRemediationDepth: true,
    });
    assert.ok(
      result.reasons.some((r) => r.includes("remediation")),
      "Must note remediation depth",
    );
  });

  it("insufficient section count fails", () => {
    const result = isCnplePageIndexReady({
      wordCount: 1200,
      faqCount: 4,
      internalLinkCount: 5,
      sectionCount: 1,
      hasRemediationDepth: true,
      tier: "cornerstone",
    });
    assert.equal(result.indexable, false);
    assert.ok(result.failures.some((f) => f.includes("section")));
  });
});

describe("cnpleSeoRobotsDirective", () => {
  it("strong page returns index: true", () => {
    const robots = cnpleSeoRobotsDirective(CNPLE_STRONG_PAGE_PROFILE);
    assert.equal(robots.index, true);
    assert.equal(robots.follow, true);
  });

  it("thin page returns index: false", () => {
    const robots = cnpleSeoRobotsDirective(CNPLE_THIN_PAGE_PROFILE);
    assert.equal(robots.index, false);
    assert.equal(robots.follow, true, "follow must always be true");
  });

  it("always sets follow: true regardless of indexability", () => {
    const resultA = cnpleSeoRobotsDirective(CNPLE_STRONG_PAGE_PROFILE);
    const resultB = cnpleSeoRobotsDirective(CNPLE_THIN_PAGE_PROFILE);
    assert.equal(resultA.follow, true);
    assert.equal(resultB.follow, true);
  });
});

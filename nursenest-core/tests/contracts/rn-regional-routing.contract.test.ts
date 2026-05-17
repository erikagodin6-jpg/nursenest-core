/**
 * Contract: RN regional routing — verifies that Canada RN and US RN are registered as distinct
 * exam pathways with correct route segments, exam families, and tier codes.
 * Prevents accidental merging into a single generic RN product.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/rn-regional-routing.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog.ts";
import { isRnRegionalPathwayId } from "../../src/lib/marketing/rn-regional-hub-copy.ts";
import {
  isRegionalBlogClusterSlug,
  regionalBlogClusterBase,
} from "../../src/lib/blog/blog-scoped-career-hubs.ts";

describe("RN regional pathway registration", () => {
  const caRn = EXAM_PATHWAYS.find((p) => p.id === "ca-rn-nclex-rn");
  const usRn = EXAM_PATHWAYS.find((p) => p.id === "us-rn-nclex-rn");

  it("Canada RN pathway is registered", () => assert.ok(caRn, "ca-rn-nclex-rn not in EXAM_PATHWAYS"));
  it("US RN pathway is registered", () => assert.ok(usRn, "us-rn-nclex-rn not in EXAM_PATHWAYS"));

  it("Canada RN routes to /canada/rn/nclex-rn", () => {
    assert.equal(caRn?.countrySlug, "canada");
    assert.equal(caRn?.roleTrack, "rn");
    assert.equal(caRn?.examCode, "nclex-rn");
  });

  it("US RN routes to /us/rn/nclex-rn", () => {
    assert.equal(usRn?.countrySlug, "us");
    assert.equal(usRn?.roleTrack, "rn");
    assert.equal(usRn?.examCode, "nclex-rn");
  });

  it("Canada and US RN are distinct pathway IDs", () => {
    assert.notEqual(caRn?.id, usRn?.id);
  });

  it("Both RN pathways share the same NCLEX_RN examFamily", () => {
    assert.equal(caRn?.examFamily, usRn?.examFamily);
  });

  it("Both RN pathways are status=active", () => {
    assert.equal(caRn?.status, "active");
    assert.equal(usRn?.status, "active");
  });
});

describe("RN regional hub copy detection", () => {
  it("detects ca-rn-nclex-rn as a regional pathway", () => {
    assert.equal(isRnRegionalPathwayId("ca-rn-nclex-rn"), true);
  });

  it("detects us-rn-nclex-rn as a regional pathway", () => {
    assert.equal(isRnRegionalPathwayId("us-rn-nclex-rn"), true);
  });

  it("does not flag unrelated pathways as regional RN", () => {
    assert.equal(isRnRegionalPathwayId("us-np-fnp"), false);
    assert.equal(isRnRegionalPathwayId("ca-rpn-rex-pn"), false);
    assert.equal(isRnRegionalPathwayId("ca-np-cnple"), false);
  });
});

describe("RN regional blog cluster routing", () => {
  it("canada-rn is a registered regional blog cluster", () => {
    assert.equal(isRegionalBlogClusterSlug("canada-rn"), true);
  });

  it("us-rn is a registered regional blog cluster", () => {
    assert.equal(isRegionalBlogClusterSlug("us-rn"), true);
  });

  it("canada-rn blog cluster base is /blog/canada-rn", () => {
    assert.equal(regionalBlogClusterBase("canada-rn"), "/blog/canada-rn");
  });

  it("us-rn blog cluster base is /blog/us-rn", () => {
    assert.equal(regionalBlogClusterBase("us-rn"), "/blog/us-rn");
  });

  it("rex-pn is a registered regional blog cluster", () => {
    assert.equal(isRegionalBlogClusterSlug("rex-pn"), true);
  });

  it("nclex-pn is a registered regional blog cluster", () => {
    assert.equal(isRegionalBlogClusterSlug("nclex-pn"), true);
  });

  it("generic rn slug is NOT a regional cluster (routes to /blog/rn)", () => {
    assert.equal(isRegionalBlogClusterSlug("rn"), false);
  });
});

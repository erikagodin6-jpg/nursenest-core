/**
 * Regression: marketing exam hub segments must resolve without throwing and produce stable paths.
 * Invalid triples return null (caller uses notFound), not uncaught exceptions that become 5xx.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";

describe("exam hub marketing route safety", () => {
  it("resolves canonical US RN NCLEX hub and builds non-throwing hub artifacts", () => {
    const pathway = resolveExamPathwaySafe("us", "rn", "nclex-rn", { pathname: "/us/rn/nclex-rn" });
    assert.ok(pathway);
    assert.equal(pathway.id, "us-rn-nclex-rn");
    assert.equal(buildExamPathwayPath(pathway), "/us/rn/nclex-rn");
    const content = buildNursingTierHubContent(pathway);
    assert.ok(content.title.length > 0);
    const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, { hubBasePath: "/us/rn/nclex-rn" });
    assert.ok(crumbs.length >= 2);
    assert.ok(schemaItems.length >= 2);
  });

  it("returns null for invalid region/tier/exam combinations (no throw)", () => {
    assert.equal(resolveExamPathwaySafe("us", "rn", "not-a-real-exam", { pathname: "/us/rn/not-a-real-exam" }), null);
    assert.equal(resolveExamPathwaySafe("us", "zz", "nclex-rn", { pathname: "/us/zz/nclex-rn" }), null);
    assert.equal(resolveExamPathwaySafe("france", "rn", "nclex-rn", { pathname: "/france/rn/nclex-rn" }), null);
  });
});

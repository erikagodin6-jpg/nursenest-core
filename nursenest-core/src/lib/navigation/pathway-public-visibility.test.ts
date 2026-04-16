import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import {
  isPathwayPublishedForPublicSite,
  listPublishedExamPathwaysForPublicSite,
} from "@/lib/navigation/country-exam-launch-readiness";

describe("pathway public visibility (snapshot readiness)", () => {
  it("listPublishedExamPathwaysForPublicSite is a subset of listPublicExamPathways", () => {
    const all = new Set(listPublicExamPathways().map((p) => p.id));
    for (const p of listPublishedExamPathwaysForPublicSite()) {
      assert.equal(all.has(p.id), true, p.id);
    }
  });

  it("every published-pathway id passes isPathwayPublishedForPublicSite", () => {
    for (const p of listPublishedExamPathwaysForPublicSite()) {
      assert.equal(isPathwayPublishedForPublicSite(p.id), true, p.id);
    }
  });
});

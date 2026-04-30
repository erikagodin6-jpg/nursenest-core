import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import {
  getStudyCategoryGroupsForPathway,
  getStudyCountsByCategoryFromDiscovery,
} from "@/lib/study/study-category-hub";

describe("study-category-hub", () => {
  it("getStudyCategoryGroupsForPathway returns one row per canonical category", () => {
    const rows = getStudyCategoryGroupsForPathway("ca-rn-nclex-rn");
    assert.equal(rows.length, CANONICAL_STUDY_CATEGORIES.length);
    const ids = new Set(rows.map((r) => r.id));
    for (const c of CANONICAL_STUDY_CATEGORIES) {
      assert.ok(ids.has(c.id), `missing canonical id ${c.id}`);
    }
  });

  it("getStudyCountsByCategoryFromDiscovery aggregates topic buckets", () => {
    const counts = getStudyCountsByCategoryFromDiscovery("ca-rn-nclex-rn", [
      { topic: "Angina", count: 3 },
      { topic: "COPD exacerbation", count: 2 },
    ]);
    const total = Object.values(counts).reduce((a, n) => a + n, 0);
    assert.ok(total >= 4, `expected non-zero mapped counts, got total=${total}`);
  });
});

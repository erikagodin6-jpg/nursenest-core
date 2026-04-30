import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSkeletonPracticeHubAggregates,
  hydratePracticeHubAggregatesFromGroupByRows,
} from "@/lib/questions/pathway-practice-body-system-aggregates";

describe("pathway-practice-body-system-aggregates", () => {
  it("returns a full skeleton including pharmacology and leadership_prioritization at zero", () => {
    const s = buildSkeletonPracticeHubAggregates();
    assert.ok(s.some((x) => x.id === "pharmacology" && x.questionCount === 0));
    assert.ok(s.some((x) => x.id === "leadership_prioritization" && x.questionCount === 0));
    assert.ok(s.some((x) => x.id === "uncategorized"));
  });

  it("keeps zero-count hubs after hydration", () => {
    const h = hydratePracticeHubAggregatesFromGroupByRows([]);
    assert.equal(h.find((x) => x.id === "pharmacology")?.questionCount, 0);
    assert.equal(h.find((x) => x.id === "cardiovascular")?.questionCount, 0);
  });

  it("hydrates counts from ExamQuestion-style groupBy rows", () => {
    const h = hydratePracticeHubAggregatesFromGroupByRows([
      {
        bodySystem: "Pharmacology",
        topic: null,
        nclexClientNeedsCategory: null,
        _count: { _all: 3 },
      },
    ]);
    assert.equal(h.find((x) => x.id === "pharmacology")?.questionCount, 3);
  });

  it("uses nclexClientNeedsCategory to route into leadership_prioritization", () => {
    const h = hydratePracticeHubAggregatesFromGroupByRows([
      {
        bodySystem: null,
        topic: "Misc",
        nclexClientNeedsCategory: "Management of Care",
        _count: { _all: 2 },
      },
    ]);
    const lp = h.find((x) => x.id === "leadership_prioritization");
    assert.ok(lp && lp.questionCount >= 2);
  });
});

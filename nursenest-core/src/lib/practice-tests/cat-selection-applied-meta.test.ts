import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCatSelectionAppliedMeta } from "@/lib/practice-tests/cat-selection-applied-meta";

const baseBuild = {
  strictCompleteRowCount: 5,
  usedRelaxedFilters: false,
  finalCompleteRowCount: 5,
};

describe("buildCatSelectionAppliedMeta", () => {
  it("returns exact tier when practice pool matches requested basis and no relaxation", () => {
    const m = buildCatSelectionAppliedMeta({
      sim: false,
      requestedCatBasis: "weak",
      appliedPoolBasis: "weak",
      poolStrictness: "soft",
      topicNames: ["Cardiovascular"],
      buildMeta: baseBuild,
      finalPoolSize: 12,
      candidatePoolSize: 10,
    });
    assert.equal(m.selectionStrictness, "exact");
    assert.equal(m.requestedFilters.catSelectionBasis, "weak");
    assert.equal(m.appliedFilters.catSelectionBasis, "weak");
    assert.equal(m.matchedCountBeforeExpansion, 5);
    assert.equal(m.finalPoolSize, 12);
    assert.equal(m.candidatePoolSize, 10);
    assert.equal(m.fallbackReason, undefined);
  });

  it("returns broad tier when relaxed filters were used (practice)", () => {
    const m = buildCatSelectionAppliedMeta({
      sim: false,
      requestedCatBasis: "random",
      appliedPoolBasis: "random",
      poolStrictness: "soft",
      topicNames: ["Renal"],
      buildMeta: { ...baseBuild, usedRelaxedFilters: true, finalCompleteRowCount: 40 },
      finalPoolSize: 40,
    });
    assert.equal(m.selectionStrictness, "broad");
    assert.ok(m.fallbackReason?.includes("relaxed_pathway_pool"));
  });

  it("returns soft tier when basis was coerced without relaxed filters", () => {
    const m = buildCatSelectionAppliedMeta({
      sim: false,
      requestedCatBasis: "weak",
      appliedPoolBasis: "random",
      poolStrictness: "soft",
      topicNames: [],
      buildMeta: baseBuild,
      finalPoolSize: 20,
    });
    assert.equal(m.selectionStrictness, "soft");
    assert.ok(m.fallbackReason?.includes("weak_areas_empty_coerced_random"));
  });

  it("exam simulation: broad when relaxed; notes basis mismatch", () => {
    const m = buildCatSelectionAppliedMeta({
      sim: true,
      requestedCatBasis: "weak",
      appliedPoolBasis: "random",
      poolStrictness: "strict",
      topicNames: [],
      buildMeta: { ...baseBuild, usedRelaxedFilters: true },
      finalPoolSize: 30,
    });
    assert.equal(m.selectionStrictness, "broad");
    assert.ok(m.fallbackReason?.includes("relaxed_pathway_pool"));
    assert.ok(m.fallbackReason?.includes("exam_simulation_basis_random"));
  });
});

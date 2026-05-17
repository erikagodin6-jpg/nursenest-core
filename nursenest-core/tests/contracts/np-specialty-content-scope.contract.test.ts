/**
 * Contract: NP specialty content scope — verifies content exam key arrays have correct scope
 * per specialty: shared NP core + specialty-specific tag, no cross-specialty leakage.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/np-specialty-content-scope.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog.ts";

const NP_SPECIALTY_IDS = ["us-np-fnp", "us-np-agpcnp", "us-np-pmhnp", "us-np-whnp", "us-np-pnp-pc"] as const;

const SPECIALTY_PAIRS: Array<[string, string]> = [
  ["us-np-pmhnp", "us-np-whnp"],
  ["us-np-pmhnp", "us-np-fnp"],
  ["us-np-pmhnp", "us-np-agpcnp"],
  ["us-np-pmhnp", "us-np-pnp-pc"],
  ["us-np-whnp", "us-np-fnp"],
  ["us-np-whnp", "us-np-agpcnp"],
  ["us-np-whnp", "us-np-pnp-pc"],
  ["us-np-fnp", "us-np-agpcnp"],
  ["us-np-fnp", "us-np-pnp-pc"],
  ["us-np-agpcnp", "us-np-pnp-pc"],
];

describe("NP specialty contentExamKeys non-overlap on specialty-specific tags", () => {
  for (const [idA, idB] of SPECIALTY_PAIRS) {
    it(`${idA} and ${idB} specialty-specific contentExamKeys do not overlap`, () => {
      const a = EXAM_PATHWAYS.find((p) => p.id === idA)!.contentExamKeys.filter((k) => k !== "NP");
      const b = EXAM_PATHWAYS.find((p) => p.id === idB)!.contentExamKeys.filter((k) => k !== "NP");
      const overlap = a.filter((k) => b.includes(k));
      assert.equal(overlap.length, 0, `${idA} and ${idB} share specialty keys: ${overlap.join(", ")}`);
    });
  }
});

describe("NP specialty contentExamKeys include shared NP core", () => {
  for (const id of NP_SPECIALTY_IDS) {
    it(`${id} contentExamKeys includes 'NP' (shared core access)`, () => {
      const p = EXAM_PATHWAYS.find((x) => x.id === id)!;
      assert.ok(p.contentExamKeys.includes("NP"), `${id} missing 'NP' shared core key`);
    });
  }
});

describe("PMHNP psych pharm isolation", () => {
  it("PMHNP contentExamKeys do not contain Women's Health or Pediatric tags", () => {
    const p = EXAM_PATHWAYS.find((x) => x.id === "us-np-pmhnp")!;
    const lower = p.contentExamKeys.map((k) => k.toLowerCase());
    assert.ok(!lower.some((k) => k.includes("whnp") || k.includes("womens")), "PMHNP has WHNP key");
    assert.ok(!lower.some((k) => k.includes("pnp") || k.includes("pediatric")), "PMHNP has PNP key");
  });
});

describe("WHNP women's health isolation", () => {
  it("WHNP contentExamKeys do not contain PMHNP or Pediatric tags", () => {
    const p = EXAM_PATHWAYS.find((x) => x.id === "us-np-whnp")!;
    const lower = p.contentExamKeys.map((k) => k.toLowerCase());
    assert.ok(!lower.some((k) => k.includes("pmhnp") || k.includes("psych")), "WHNP has PMHNP key");
    assert.ok(!lower.some((k) => k.includes("pnp") || k.includes("pediatric")), "WHNP has PNP key");
  });
});

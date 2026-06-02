/**
 * Contract: NP specialty isolation — verifies that each US NP specialty is a distinct pathway
 * and that specialty signal arrays have zero overlap (no cross-contamination).
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/np-specialty-isolation.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog.ts";
import {
  isUsNpSpecialtyPathway,
  deriveNpSpecialtyBuckets,
  npPathwaySpecialtyWhere,
} from "../../src/lib/exam-pathways/np-question-specialty-scope.ts";

const NP_SPECIALTY_IDS = ["us-np-fnp", "us-np-agpcnp", "us-np-pmhnp", "us-np-whnp", "us-np-pnp-pc"] as const;

describe("NP specialty pathway registration", () => {
  for (const id of NP_SPECIALTY_IDS) {
    it(`${id} is registered in EXAM_PATHWAYS`, () => {
      const p = EXAM_PATHWAYS.find((x) => x.id === id);
      assert.ok(p, `${id} not found in EXAM_PATHWAYS`);
    });

    it(`${id} is detected as US NP specialty pathway`, () => {
      const p = EXAM_PATHWAYS.find((x) => x.id === id)!;
      assert.ok(isUsNpSpecialtyPathway(p), `${id} not detected as US NP specialty`);
    });

    it(`${id} status is active`, () => {
      const p = EXAM_PATHWAYS.find((x) => x.id === id)!;
      assert.equal(p.status, "active");
    });

    it(`${id} has unique examCode among US NP specialties`, () => {
      const p = EXAM_PATHWAYS.find((x) => x.id === id)!;
      const others = EXAM_PATHWAYS.filter((x) => x.id !== id && x.roleTrack === "np" && x.countryCode === "US");
      const codes = others.map((x) => x.examCode);
      assert.ok(!codes.includes(p.examCode), `${id} examCode ${p.examCode} is duplicated`);
    });
  }
});

describe("NP specialty signal isolation — body system buckets", () => {
  it("PMHNP body system does not bucket as WHNP", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: null, bodySystem: "Psychiatry" });
    assert.ok(buckets.includes("pmhnp"), "Psychiatry should bucket as pmhnp");
    assert.ok(!buckets.includes("whnp"), "Psychiatry must not bucket as whnp");
  });

  it("WHNP body system does not bucket as PMHNP", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: null, bodySystem: "Women's Health" });
    assert.ok(buckets.includes("whnp"), "Women's Health should bucket as whnp");
    assert.ok(!buckets.includes("pmhnp"), "Women's Health must not bucket as pmhnp");
  });

  it("Pediatric body system does not bucket as AGPCNP", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: null, bodySystem: "Pediatrics" });
    assert.ok(buckets.includes("pnp_pc"), "Pediatrics should bucket as pnp_pc");
    assert.ok(!buckets.includes("agpcnp"), "Pediatrics must not bucket as agpcnp");
  });

  it("Geriatrics body system does not bucket as Pediatric", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: null, bodySystem: "Geriatrics" });
    assert.ok(buckets.includes("agpcnp"), "Geriatrics should bucket as agpcnp");
    assert.ok(!buckets.includes("pnp_pc"), "Geriatrics must not bucket as pnp_pc");
  });

  it("Untagged row falls into shared_core only", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: null, bodySystem: null });
    assert.deepEqual(buckets, ["shared_core"]);
  });
});

describe("NP specialty signal isolation — exam value buckets", () => {
  it("PMHNP exam tag does not bucket as FNP", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: "PMHNP", bodySystem: null });
    assert.ok(buckets.includes("pmhnp"), "PMHNP tag should bucket as pmhnp");
    assert.ok(!buckets.includes("fnp"), "PMHNP tag must not bucket as fnp");
  });

  it("WHNP exam tag does not bucket as AGPCNP", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: "WHNP", bodySystem: null });
    assert.ok(buckets.includes("whnp"), "WHNP tag should bucket as whnp");
    assert.ok(!buckets.includes("agpcnp"), "WHNP tag must not bucket as agpcnp");
  });

  it("PNP-PC exam tag does not bucket as FNP", () => {
    const buckets = deriveNpSpecialtyBuckets({ exam: "PNP-PC", bodySystem: null });
    assert.ok(buckets.includes("pnp_pc"), "PNP-PC tag should bucket as pnp_pc");
    assert.ok(!buckets.includes("fnp"), "PNP-PC tag must not bucket as fnp");
  });
});

describe("NP specialty WHERE clause isolation", () => {
  for (const id of NP_SPECIALTY_IDS) {
    it(`${id} returns non-null specialty WHERE clause`, () => {
      const pathway = EXAM_PATHWAYS.find((p) => p.id === id)!;
      const where = npPathwaySpecialtyWhere(pathway);
      assert.ok(where !== null, `${id} returned null WHERE clause`);
    });
  }

  it("non-NP pathway (US RN) returns null WHERE clause", () => {
    const rn = EXAM_PATHWAYS.find((p) => p.id === "us-rn-nclex-rn")!;
    const where = npPathwaySpecialtyWhere(rn);
    assert.equal(where, null);
  });

  it("CNPLE returns null specialty WHERE clause (single-classification CA NP, not US specialty model)", () => {
    const cnple = EXAM_PATHWAYS.find((p) => p.id === "ca-np-cnple")!;
    const where = npPathwaySpecialtyWhere(cnple);
    assert.equal(where, null);
  });
});

describe("NP specialty pathway uniqueness guarantees", () => {
  it("all 5 US NP specialty examCodes are unique", () => {
    const specialtyPathways = EXAM_PATHWAYS.filter((p) =>
      NP_SPECIALTY_IDS.includes(p.id as (typeof NP_SPECIALTY_IDS)[number]),
    );
    const codes = specialtyPathways.map((p) => p.examCode);
    assert.equal(new Set(codes).size, 5);
  });

  it("no NP specialty pathway has an empty boardLabel", () => {
    const specialtyPathways = EXAM_PATHWAYS.filter((p) =>
      NP_SPECIALTY_IDS.includes(p.id as (typeof NP_SPECIALTY_IDS)[number]),
    );
    for (const p of specialtyPathways) {
      assert.ok((p.boardLabel?.trim().length ?? 0) > 0, `${p.id} has empty boardLabel`);
    }
  });
});

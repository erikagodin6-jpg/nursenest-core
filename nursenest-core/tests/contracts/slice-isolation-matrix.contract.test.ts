/**
 * Contract: Cross-slice ecosystem isolation matrix — verifies every major slice has distinct
 * pathway IDs, non-overlapping exam codes, correct Stripe tiers, and CNPLE LOFT routing preserved.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/slice-isolation-matrix.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EXAM_PATHWAYS } from "../../src/lib/exam-pathways/exam-pathways-catalog.ts";
import { ExamFamily, TierCode } from "@prisma/client";
import { isRegionalBlogClusterSlug } from "../../src/lib/blog/blog-scoped-career-hubs.ts";
import { deriveNpSpecialtyBuckets } from "../../src/lib/exam-pathways/np-question-specialty-scope.ts";

const SLICES = {
  CA_RPN: "ca-rpn-rex-pn",
  CA_RN: "ca-rn-nclex-rn",
  CA_NP: "ca-np-cnple",
  US_LPN: "us-lpn-nclex-pn",
  US_RN: "us-rn-nclex-rn",
  US_NP_FNP: "us-np-fnp",
  US_NP_AGPCNP: "us-np-agpcnp",
  US_NP_PMHNP: "us-np-pmhnp",
  US_NP_WHNP: "us-np-whnp",
  US_NP_PNP_PC: "us-np-pnp-pc",
  CA_ALLIED: "ca-allied-core",
  US_ALLIED: "us-allied-core",
} as const;

type SliceId = (typeof SLICES)[keyof typeof SLICES];

function getSlice(id: SliceId) {
  const p = EXAM_PATHWAYS.find((x) => x.id === id);
  if (!p) throw new Error(`Slice not registered: ${id}`);
  return p;
}

describe("All slices are registered in EXAM_PATHWAYS", () => {
  for (const [key, id] of Object.entries(SLICES)) {
    it(`${key} (${id}) is registered`, () => {
      assert.ok(EXAM_PATHWAYS.find((p) => p.id === id), `${id} not found`);
    });
  }
});

describe("Route collision detection", () => {
  it("no two pathways share the same (countrySlug, roleTrack, examCode) triple", () => {
    const routeKeys = EXAM_PATHWAYS.map((p) => `${p.countrySlug}/${p.roleTrack}/${p.examCode}`);
    assert.equal(new Set(routeKeys).size, routeKeys.length);
  });

  it("Canada RN and US RN have different countrySlug", () => {
    assert.notEqual(getSlice(SLICES.CA_RN).countrySlug, getSlice(SLICES.US_RN).countrySlug);
  });

  it("Canada RPN and US LPN have different countrySlug", () => {
    assert.notEqual(getSlice(SLICES.CA_RPN).countrySlug, getSlice(SLICES.US_LPN).countrySlug);
  });
});

describe("Stripe tier separation", () => {
  it("Canada RPN uses RPN tier", () => assert.equal(getSlice(SLICES.CA_RPN).stripeTier, TierCode.RPN));
  it("US LPN uses LVN_LPN tier", () => assert.equal(getSlice(SLICES.US_LPN).stripeTier, TierCode.LVN_LPN));
  it("Canada RN uses RN tier", () => assert.equal(getSlice(SLICES.CA_RN).stripeTier, TierCode.RN));
  it("US RN uses RN tier", () => assert.equal(getSlice(SLICES.US_RN).stripeTier, TierCode.RN));
  it("Canada NP uses NP tier", () => assert.equal(getSlice(SLICES.CA_NP).stripeTier, TierCode.NP));
  it("Allied slices use ALLIED tier", () => {
    assert.equal(getSlice(SLICES.CA_ALLIED).stripeTier, TierCode.ALLIED);
    assert.equal(getSlice(SLICES.US_ALLIED).stripeTier, TierCode.ALLIED);
  });
});

describe("Exam family isolation", () => {
  it("RPN/LPN slices are not NCLEX_RN", () => {
    assert.notEqual(getSlice(SLICES.CA_RPN).examFamily, ExamFamily.NCLEX_RN);
    assert.notEqual(getSlice(SLICES.US_LPN).examFamily, ExamFamily.NCLEX_RN);
  });

  it("RN slices are NCLEX_RN, not NP", () => {
    assert.equal(getSlice(SLICES.CA_RN).examFamily, ExamFamily.NCLEX_RN);
    assert.equal(getSlice(SLICES.US_RN).examFamily, ExamFamily.NCLEX_RN);
  });

  it("All NP slices have NP exam family", () => {
    for (const id of [SLICES.CA_NP, SLICES.US_NP_FNP, SLICES.US_NP_AGPCNP, SLICES.US_NP_PMHNP, SLICES.US_NP_WHNP, SLICES.US_NP_PNP_PC] as SliceId[]) {
      assert.equal(getSlice(id).examFamily, ExamFamily.NP, `${id} should have NP exam family`);
    }
  });
});

describe("Content exam key scope — RPN/LPN must not receive RN or NP keys", () => {
  it("Canada RPN contentExamKeys do not include NCLEX_RN or NP-specific keys", () => {
    const keys = getSlice(SLICES.CA_RPN).contentExamKeys.map((k) => k.toLowerCase());
    assert.ok(!keys.includes("nclex_rn"), "CA RPN has NCLEX_RN key");
    assert.ok(!keys.includes("nclex-rn"), "CA RPN has NCLEX-RN key");
    assert.ok(!keys.some((k) => k.startsWith("np")), "CA RPN has NP key");
  });

  it("US LPN contentExamKeys do not include RN or NP keys", () => {
    const keys = getSlice(SLICES.US_LPN).contentExamKeys.map((k) => k.toLowerCase());
    assert.ok(!keys.includes("nclex_rn"), "US LPN has NCLEX_RN key");
    assert.ok(!keys.some((k) => k.startsWith("np")), "US LPN has NP key");
  });
});

describe("CNPLE LOFT routing preservation", () => {
  it("CNPLE internalNotes mentions LOFT", () => {
    const cnple = getSlice(SLICES.CA_NP);
    assert.ok(cnple.internalNotes?.toLowerCase().includes("loft"), "CNPLE internalNotes must mention LOFT");
  });

  it("CNPLE internalNotes explicitly rejects CAT label", () => {
    const cnple = getSlice(SLICES.CA_NP);
    assert.ok(cnple.internalNotes?.toLowerCase().includes("not cat"), "CNPLE internalNotes must reject CAT label");
  });
});

describe("Blog cluster registration", () => {
  for (const slug of ["canada-rn", "us-rn", "rex-pn", "nclex-pn"] as const) {
    it(`${slug} is a registered regional blog cluster`, () => {
      assert.ok(isRegionalBlogClusterSlug(slug), `${slug} not registered as regional blog cluster`);
    });
  }
  it("generic 'rn' is NOT a regional cluster (stays on /blog/rn)", () => {
    assert.equal(isRegionalBlogClusterSlug("rn"), false);
  });
});

describe("NP specialty bucket isolation — no cross-contamination", () => {
  const CASES: Array<[string, string, string]> = [
    ["Psychiatry", "pmhnp", "whnp"],
    ["Women's Health", "whnp", "pmhnp"],
    ["Pediatrics", "pnp_pc", "agpcnp"],
    ["Geriatrics", "agpcnp", "pnp_pc"],
  ];
  for (const [bodySystem, expected, forbidden] of CASES) {
    it(`${bodySystem} → ${expected}, NOT ${forbidden}`, () => {
      const buckets = deriveNpSpecialtyBuckets({ exam: null, bodySystem });
      assert.ok(buckets.includes(expected as never), `${bodySystem} should bucket into ${expected}`);
      assert.ok(!buckets.includes(forbidden as never), `${bodySystem} must not bucket into ${forbidden}`);
    });
  }
});

describe("All active slices have required SEO fields", () => {
  for (const id of Object.values(SLICES) as SliceId[]) {
    it(`${id} has non-empty seoTitle`, () => {
      const p = getSlice(id);
      assert.ok(p.seoTitle.trim().length > 10, `${id} seoTitle too short: "${p.seoTitle}"`);
    });
  }
});

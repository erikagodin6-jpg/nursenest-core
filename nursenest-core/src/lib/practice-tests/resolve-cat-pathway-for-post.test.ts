import assert from "node:assert/strict";
import test from "node:test";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { resolveCatPathwayIdForCatPost } from "@/lib/practice-tests/resolve-cat-pathway-for-post";

function pathwayStub(id: string): ExamPathwayDefinition {
  return { id } as ExamPathwayDefinition;
}

test("uses explicit pathwayId from request", () => {
  const r = resolveCatPathwayIdForCatPost("us-rn-nclex-rn", [pathwayStub("us-np-agpcnp"), pathwayStub("us-rn-nclex-rn")]);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pathwayId, "us-rn-nclex-rn");
    assert.equal(r.source, "request");
  }
});

test("trims pathwayId", () => {
  const r = resolveCatPathwayIdForCatPost("  us-rn-nclex-rn  ", []);
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.pathwayId, "us-rn-nclex-rn");
});

test("single CAT-eligible pathway: omitted id resolves unambiguously", () => {
  const r = resolveCatPathwayIdForCatPost(null, [pathwayStub("only-one")]);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pathwayId, "only-one");
    assert.equal(r.source, "single_eligible_unambiguous");
  }
});

test("multiple CAT-eligible pathways: omitted id is ambiguous", () => {
  const r = resolveCatPathwayIdForCatPost(undefined, [pathwayStub("a"), pathwayStub("b")]);
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.equal(r.code, PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous);
    assert.equal(r.catEligibleCount, 2);
  }
});

test("no CAT-eligible pathways: required error", () => {
  const r = resolveCatPathwayIdForCatPost(null, []);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_required);
});

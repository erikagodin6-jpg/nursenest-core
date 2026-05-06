import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { alignAccessScopeToPathwayForExamQuestionPool } from "@/lib/exam-pathways/pathway-content-scope";

test("alignAccessScopeToPathwayForExamQuestionPool uses pathway country + stripe tier", () => {
  const pathway = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(pathway);
  const scope = {
    hasAccess: true,
    reason: "active_subscription" as const,
    tier: "RN" as const,
    country: "US" as const,
    alliedCareer: null,
  };
  const aligned = alignAccessScopeToPathwayForExamQuestionPool(scope, pathway);
  assert.equal(aligned.country, pathway.countryCode);
  assert.equal(aligned.tier, pathway.stripeTier);
});

test("alignAccessScope leaves scope unchanged when pathway is null", () => {
  const scope = {
    hasAccess: true,
    reason: "active_subscription" as const,
    tier: "RN" as const,
    country: "US" as const,
    alliedCareer: null,
  };
  const aligned = alignAccessScopeToPathwayForExamQuestionPool(scope, null);
  assert.deepEqual(aligned, scope);
});

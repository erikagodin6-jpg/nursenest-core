import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  alignAccessScopeToPathwayForExamQuestionPool,
  questionAccessWhereWithPathway,
} from "@/lib/exam-pathways/pathway-content-scope";

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

test("questionAccessWhereWithPathway uses case-insensitive tier filters for legacy uppercase rows", () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  const scope = {
    hasAccess: true,
    reason: "active_subscription" as const,
    tier: "RN" as const,
    country: "US" as const,
    alliedCareer: null,
  };
  const where = questionAccessWhereWithPathway(scope, pathway);
  const serialized = JSON.stringify(where);
  assert.match(serialized, /insensitive/);
  assert.match(serialized, /NCLEX-RN/);
  assert.match(serialized, /rn/);
});

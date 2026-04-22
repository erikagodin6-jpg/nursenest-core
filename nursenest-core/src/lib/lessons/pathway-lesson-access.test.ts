import assert from "node:assert/strict";
import { test } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";

function staffScope(partial: Partial<AccessScope> = {}): AccessScope {
  return {
    hasAccess: true,
    reason: "admin_override",
    tier: partial.tier ?? "RN",
    country: partial.country ?? "US",
    alliedCareer: partial.alliedCareer ?? null,
  };
}

test("staff bypass: NP pathway full access even when learnerPath targets a different NP specialty", () => {
  const usNpFnp = getExamPathwayById("us-np-fnp")!;
  const usNpPmhnp = getExamPathwayById("us-np-pmhnp")!;
  const scope = staffScope({ tier: "NP", country: "US" });
  assert.equal(canViewFullPathwayLesson(scope, usNpPmhnp, "us-np-fnp"), true);
  assert.equal(canViewFullPathwayLesson(scope, usNpFnp, "us-np-pmhnp"), true);
});

test("subscriber NP: learnerPath must match pathway for full lesson", () => {
  const usNpPmhnp = getExamPathwayById("us-np-pmhnp")!;
  const scope: AccessScope = {
    hasAccess: true,
    reason: "active_subscription",
    tier: "NP",
    country: "US",
    alliedCareer: null,
  };
  assert.equal(canViewFullPathwayLesson(scope, usNpPmhnp, "us-np-fnp"), false);
  assert.equal(canViewFullPathwayLesson(scope, usNpPmhnp, "us-np-pmhnp"), true);
});

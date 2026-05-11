import assert from "node:assert/strict";
import test from "node:test";
import { TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import {
  evaluateAlliedOccupationAccess,
  pathwayLessonAlliedProfessionAllowsSubscriber,
  pathwayLessonAlliedProfessionWhere,
  subscriberCanonicalAlliedProfessionKey,
  alliedDeckStudyAllowedByProfessionTagSlugs,
} from "@/lib/entitlements/allied-occupation-entitlement";

function scope(partial: Partial<AccessScope> & Pick<AccessScope, "hasAccess" | "reason">): AccessScope {
  return {
    hasAccess: partial.hasAccess,
    reason: partial.reason,
    tier: partial.tier ?? null,
    country: partial.country ?? null,
    alliedCareer: partial.alliedCareer ?? null,
  };
}

test("evaluateAlliedOccupationAccess: not_allied for RN", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: "US",
    alliedCareer: null,
  });
  const r = evaluateAlliedOccupationAccess(s, "respiratory");
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "not_allied");
});

test("evaluateAlliedOccupationAccess: occupation_match", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  const r = evaluateAlliedOccupationAccess(s, "mlt");
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "occupation_match");
});

test("evaluateAlliedOccupationAccess: occupation_mismatch", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  const r = evaluateAlliedOccupationAccess(s, "respiratory");
  assert.equal(r.allowed, false);
  assert.equal(r.reason, "occupation_mismatch");
});

test("evaluateAlliedOccupationAccess: shared_allied_core", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  const r = evaluateAlliedOccupationAccess(s, null);
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "shared_allied_core");
});

test("evaluateAlliedOccupationAccess: staff_preview", () => {
  const s = scope({
    hasAccess: true,
    reason: "admin_override",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  const r = evaluateAlliedOccupationAccess(s, "respiratory");
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "staff_preview");
  assert.equal(r.staffPreview, true);
});

test("subscriberCanonicalAlliedProfessionKey maps billing career to profession key", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  assert.equal(subscriberCanonicalAlliedProfessionKey(s), "mlt");
});

test("pathwayLessonAlliedProfessionAllowsSubscriber allows shared rows (null key)", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  assert.equal(pathwayLessonAlliedProfessionAllowsSubscriber(s, null), true);
});

test("pathwayLessonAlliedProfessionAllowsSubscriber denies wrong occupation", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  assert.equal(pathwayLessonAlliedProfessionAllowsSubscriber(s, "respiratory"), false);
});

test("pathwayLessonAlliedProfessionWhere incomplete metadata only allows shared lessons", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: null,
  });
  const w = pathwayLessonAlliedProfessionWhere(s);
  assert.deepEqual(w, { alliedProfessionKey: null });
});

test("alliedDeckStudyAllowedByProfessionTagSlugs denies other profession tags", () => {
  const s = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.ALLIED,
    country: "US",
    alliedCareer: "mlt",
  });
  assert.equal(alliedDeckStudyAllowedByProfessionTagSlugs(s, ["respiratory"]), false);
  assert.equal(alliedDeckStudyAllowedByProfessionTagSlugs(s, ["mlt"]), true);
});

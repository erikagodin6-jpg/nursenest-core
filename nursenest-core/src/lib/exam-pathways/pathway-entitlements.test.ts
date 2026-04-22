import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwaysCompatibleWithSubscription } from "./pathway-entitlements";
import { subscriptionCoversPathwayBase } from "./pathway-entitlements-policy";

function scope(
  partial: Pick<AccessScope, "hasAccess" | "reason" | "tier" | "country"> & { alliedCareer?: AccessScope["alliedCareer"] },
): AccessScope {
  return {
    hasAccess: partial.hasAccess,
    reason: partial.reason,
    tier: partial.tier,
    country: partial.country,
    alliedCareer: partial.alliedCareer ?? null,
  };
}

describe("subscriptionCoversPathwayBase", () => {
  const caRpn = getExamPathwayById("ca-rpn-rex-pn")!;
  const caRn = getExamPathwayById("ca-rn-nclex-rn")!;
  const usRn = getExamPathwayById("us-rn-nclex-rn")!;
  const usLpn = getExamPathwayById("us-lpn-nclex-pn")!;
  const usAllied = getExamPathwayById("us-allied-core")!;

  it("denies without access", () => {
    assert.equal(subscriptionCoversPathwayBase(scope({ hasAccess: false, reason: "no_access", tier: "RN", country: "CA" }), caRn), false);
  });

  it("RPN only matches RPN pathway in same country", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RPN", country: "CA" });
    assert.equal(subscriptionCoversPathwayBase(s, caRpn), true);
    assert.equal(subscriptionCoversPathwayBase(s, caRn), false);
  });

  it("RN can access RPN and LVN in same country", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RN", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usRn), true);
    assert.equal(subscriptionCoversPathwayBase(s, usLpn), true);
  });

  it("NP can access nursing tiers in same country", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "NP", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usRn), true);
    assert.equal(subscriptionCoversPathwayBase(s, usLpn), true);
  });

  it("Allied only matches allied", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "ALLIED", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usAllied), true);
    assert.equal(subscriptionCoversPathwayBase(s, usRn), false);
  });

  it("no cross-country access", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RN", country: "CA" });
    assert.equal(subscriptionCoversPathwayBase(s, caRn), true);
    assert.equal(subscriptionCoversPathwayBase(s, usRn), false);
  });

  it("denies when country is null (no false match)", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RN", country: null });
    assert.equal(subscriptionCoversPathwayBase(s, caRn), false);
  });

  it("admin override allows visible pathways in profile country", () => {
    const s = scope({ hasAccess: true, reason: "admin_override", tier: "NP", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usRn), true);
  });

  it("admin override may cross country for internal staff catalog access", () => {
    const s = scope({ hasAccess: true, reason: "admin_override", tier: "NP", country: "CA" });
    assert.equal(subscriptionCoversPathwayBase(s, usRn), true);
    assert.equal(subscriptionCoversPathwayBase(s, caRn), true);
  });

  it("LVN_LPN can access RPN pathway in same country (shared PN ladder)", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "LVN_LPN", country: "CA" });
    assert.equal(subscriptionCoversPathwayBase(s, caRpn), true);
  });

  it("RPN cannot access LVN_LPN stripe pathway", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RPN", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usLpn), false);
  });

  it("RN cannot access NP specialty pathway (tier ladder excludes NP)", () => {
    const usNp = getExamPathwayById("us-np-fnp")!;
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RN", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usNp), false);
  });
});

describe("listPathwaysCompatibleWithSubscription", () => {
  it("staff entitlement lists every non-hidden pathway regardless of profile country", async () => {
    const s = scope({ hasAccess: true, reason: "admin_override", tier: "RPN", country: "CA" });
    const list = await listPathwaysCompatibleWithSubscription(s);
    const usRn = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(usRn);
    assert.ok(list.some((p) => p.id === usRn!.id));
  });
});

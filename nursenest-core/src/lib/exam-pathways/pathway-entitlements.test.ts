import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { subscriptionCoversPathwayBase } from "./pathway-entitlements";

function scope(
  partial: Pick<AccessScope, "hasAccess" | "reason" | "tier" | "country">,
): AccessScope {
  return {
    hasAccess: partial.hasAccess,
    reason: partial.reason,
    tier: partial.tier,
    country: partial.country,
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

  it("admin override allows visible pathways", () => {
    const s = scope({ hasAccess: true, reason: "admin_override", tier: "NP", country: "US" });
    assert.equal(subscriptionCoversPathwayBase(s, usRn), true);
  });
});

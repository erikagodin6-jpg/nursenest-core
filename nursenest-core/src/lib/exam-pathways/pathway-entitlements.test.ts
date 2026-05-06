import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { ExamFamily } from "@prisma/client";
import { defaultPracticeTestPathwayId, examPathwaysForStudyHubSubscription, listPathwaysCompatibleWithSubscription } from "./pathway-entitlements";
import { resolveNpSubscriberQuestionPathway } from "./np-subscriber-question-pathway";
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

describe("examPathwaysForStudyHubSubscription", () => {
  it("keeps RN-only lists unchanged for RN subscribers", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "RN", country: "US" });
    const usRn = getExamPathwayById("us-rn-nclex-rn")!;
    const usNp = getExamPathwayById("us-np-fnp")!;
    const out = examPathwaysForStudyHubSubscription(s, [usRn, usNp]);
    assert.equal(out.length, 2);
  });

  it("filters NP subscriber study hubs to NP exam pathways only (no RN cards)", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "NP", country: "US" });
    const usRn = getExamPathwayById("us-rn-nclex-rn")!;
    const usNpFnp = getExamPathwayById("us-np-fnp")!;
    const usNpPmhnp = getExamPathwayById("us-np-pmhnp")!;
    const out = examPathwaysForStudyHubSubscription(s, [usRn, usNpFnp, usNpPmhnp]);
    assert.deepEqual(
      out.map((p) => p.id).sort(),
      ["us-np-fnp", "us-np-pmhnp"],
    );
    assert.ok(out.every((p) => p.examFamily === ExamFamily.NP));
  });

  it("does not filter staff bypass lists", () => {
    const s = scope({ hasAccess: true, reason: "admin_override", tier: "NP", country: "US" });
    const usRn = getExamPathwayById("us-rn-nclex-rn")!;
    const usNp = getExamPathwayById("us-np-fnp")!;
    const out = examPathwaysForStudyHubSubscription(s, [usRn, usNp]);
    assert.equal(out.length, 2);
  });
});

describe("defaultPracticeTestPathwayId", () => {
  it("picks a stable NP id when every compatible pathway is NP (no NCLEX-RN default)", async () => {
    const usNpFnp = getExamPathwayById("us-np-fnp")!;
    const usNpPmhnp = getExamPathwayById("us-np-pmhnp")!;
    const id = await defaultPracticeTestPathwayId([usNpPmhnp, usNpFnp], null, "US");
    assert.equal(id, "us-np-fnp");
  });
});

describe("resolveNpSubscriberQuestionPathway", () => {
  it("fills missing pathwayId from first NP hint for NP tier", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "NP", country: "US" });
    const usNp = getExamPathwayById("us-np-fnp")!;
    const out = resolveNpSubscriberQuestionPathway({
      tier: "NP",
      pathwayIdParam: null,
      pathwayResolved: null,
      pathwayHintIds: ["us-np-fnp"],
      entitlement: s,
      getExamPathwayById: (id) => getExamPathwayById(id),
    });
    assert.equal(out?.id, usNp.id);
  });

  it("ignores RN hints when pathwayId is absent (no silent RN pool)", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "NP", country: "US" });
    const out = resolveNpSubscriberQuestionPathway({
      tier: "NP",
      pathwayIdParam: null,
      pathwayResolved: null,
      pathwayHintIds: ["us-rn-nclex-rn", "us-np-fnp"],
      entitlement: s,
      getExamPathwayById: (id) => getExamPathwayById(id),
    });
    assert.equal(out?.id, "us-np-fnp");
  });

  it("does not substitute hints when pathwayId param is present", () => {
    const s = scope({ hasAccess: true, reason: "active_subscription", tier: "NP", country: "US" });
    const out = resolveNpSubscriberQuestionPathway({
      tier: "NP",
      pathwayIdParam: "us-rn-nclex-rn",
      pathwayResolved: null,
      pathwayHintIds: ["us-np-fnp"],
      entitlement: s,
      getExamPathwayById: (id) => getExamPathwayById(id),
    });
    assert.equal(out, null);
  });
});

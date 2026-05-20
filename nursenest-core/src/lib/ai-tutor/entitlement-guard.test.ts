/**
 * Run: `node --import tsx --test src/lib/ai-tutor/entitlement-guard.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  guardTutoringEntitlementSnapshot,
  isValidTutoringEntitlementSnapshot,
  requireTutoringEntitlementSnapshot,
} from "@/lib/ai-tutor/entitlement-guard";
import type { TutoringEntitlementSnapshot } from "@/lib/ai-tutor/types";

const valid: TutoringEntitlementSnapshot = {
  hasAccess: true,
  reason: "active_subscription",
  tier: "RN",
  country: "US",
  alliedCareer: null,
  pathwayId: "nclex-rn",
};

describe("entitlement-guard", () => {
  it("accepts scoped snapshot", () => {
    assert.equal(isValidTutoringEntitlementSnapshot(valid), true);
    const g = guardTutoringEntitlementSnapshot(valid);
    assert.equal(g.ok, true);
  });

  it("rejects missing pathway", () => {
    const bad = { ...valid, pathwayId: "  " };
    assert.equal(isValidTutoringEntitlementSnapshot(bad), false);
    const g = guardTutoringEntitlementSnapshot(bad);
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.reason, "missing_pathway");
  });

  it("rejects missing entitlement", () => {
    const bad = { ...valid, hasAccess: false };
    const g = guardTutoringEntitlementSnapshot(bad);
    assert.equal(g.ok, false);
    if (!g.ok) assert.equal(g.reason, "missing_entitlement");
  });

  it("require throws on invalid snapshot", () => {
    assert.throws(() => requireTutoringEntitlementSnapshot({ hasAccess: true, pathwayId: "" }));
  });
});

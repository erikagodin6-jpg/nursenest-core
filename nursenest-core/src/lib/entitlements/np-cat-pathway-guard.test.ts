/**
 * NP CAT pathway entitlement regression suite — G2 blocker fix.
 *
 * Run:
 *   node --import tsx --test src/lib/entitlements/np-cat-pathway-guard.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { assertNpCatPathwayEntitlement } from "@/lib/entitlements/np-cat-pathway-guard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeEntitlement(
  overrides: Partial<AccessScope>,
): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: null,
    country: "US",
    alliedCareer: null,
    ...overrides,
  } as AccessScope;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("assertNpCatPathwayEntitlement — NP subscriber allowed", () => {
  it("returns ok=true for an active NP subscription", () => {
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({ tier: "NP" }),
    );
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.isAdminOverride, false);
  });
});

describe("assertNpCatPathwayEntitlement — non-NP subscribers denied", () => {
  it("denies an active RN subscriber with pathway_not_in_plan", () => {
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({ tier: "RN" }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "pathway_not_in_plan");
  });

  it("denies an active RPN subscriber with pathway_not_in_plan", () => {
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({ tier: "RPN" }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "pathway_not_in_plan");
  });

  it("denies an active Allied subscriber with pathway_not_in_plan", () => {
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({ tier: "ALLIED", alliedCareer: "medical_laboratory_technologist" }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "pathway_not_in_plan");
  });

  it("denies a generic active subscriber with no tier (null) with pathway_not_in_plan", () => {
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({ tier: null }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "pathway_not_in_plan");
  });

  it("denies an LVN_LPN subscriber with pathway_not_in_plan", () => {
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({ tier: "LVN_LPN" }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "pathway_not_in_plan");
  });
});

describe("assertNpCatPathwayEntitlement — admin override", () => {
  it("allows admin_override with any tier and flags isAdminOverride=true", () => {
    // Staff bypass must work regardless of subscription tier (e.g. admin account is tier=RN).
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({
        hasAccess: true,
        reason: "admin_override",
        tier: "RN",
      }),
    );
    assert.equal(result.ok, true, "admin_override must pass the NP gate");
    if (result.ok) {
      assert.equal(
        result.isAdminOverride,
        true,
        "isAdminOverride must be true so the route logs the bypass",
      );
    }
  });

  it("does not treat admin_override string as bypass when hasAccess is false", () => {
    // accessScopeIsStaffLearnerEntitlementBypass requires both hasAccess=true AND reason=admin_override.
    // hasAccess=false + non-NP tier must be denied even if reason string says admin_override.
    const result = assertNpCatPathwayEntitlement(
      makeEntitlement({
        hasAccess: false,
        reason: "admin_override",
        tier: "RN",
      }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "pathway_not_in_plan");
  });
});

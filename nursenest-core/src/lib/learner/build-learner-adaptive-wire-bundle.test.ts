/**
 * Run: `node --import tsx --test src/lib/learner/build-learner-adaptive-wire-bundle.test.ts`
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { loadLearnerAdaptiveWireBundle } from "@/lib/learner/build-learner-adaptive-wire-bundle";

const userId = "usr_adaptive_wire_bundle_gate";

function noAccessEntitlement(): AccessScope {
  return {
    hasAccess: false,
    reason: "no_access",
    tier: TierCode.RN,
    country: CountryCode.US,
    alliedCareer: null,
  };
}

describe("loadLearnerAdaptiveWireBundle", () => {
  it("returns null when entitlement denies access (subscriber APIs stay server-gated)", async () => {
    const out = await loadLearnerAdaptiveWireBundle(userId, noAccessEntitlement(), {
      source: "test:adaptive-wire-entitlement",
    });
    assert.equal(out, null);
  });
});

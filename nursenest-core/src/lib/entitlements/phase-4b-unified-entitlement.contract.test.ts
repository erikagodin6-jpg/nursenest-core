/**
 * Phase 4B bounded contracts: server gates, ECG wiring, allied tier isolation, adaptive APIs.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { STAFF_LEARNER_ENTITLEMENT_REASON, accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");

describe("Phase 4B unified entitlement enforcement (static contracts)", () => {
  it("ECG module server gate uses canonical learner access loader (single DB funnel)", () => {
    const src = readFileSync(join(root, "src", "lib", "ecg-module", "ecg-module.server.ts"), "utf8");
    assert.match(src, /loadCanonicalLearnerAccessForUserId/);
    assert.ok(!src.includes("getUserAccess("), "ECG module should not call getUserAccess directly; use canonical adapter");
  });

  it("representative premium learner APIs still use requireSubscriberSession", () => {
    for (const rel of [
      "src/app/api/learner/adaptive-recommendations/route.ts",
      "src/app/api/learner/adaptive-post-miss/route.ts",
      "src/app/api/questions/route.ts",
    ]) {
      const src = readFileSync(join(root, rel), "utf8");
      assert.match(src, /requireSubscriberSession/, `${rel} must gate with requireSubscriberSession`);
    }
  });

  it("staff bypass is detectable only for admin_override + hasAccess (non-subscriber staff path)", () => {
    assert.equal(
      accessScopeIsStaffLearnerEntitlementBypass({
        hasAccess: true,
        reason: STAFF_LEARNER_ENTITLEMENT_REASON,
        tier: "RN",
        country: "US",
        alliedCareer: null,
      }),
      true,
    );
    assert.equal(
      accessScopeIsStaffLearnerEntitlementBypass({
        hasAccess: true,
        reason: "active_subscription",
        tier: "RN",
        country: "US",
        alliedCareer: null,
      }),
      false,
    );
  });

  it("ALLIED tier does not inherit RN exam tiers in the accessibility ladder", () => {
    const allied = prismaTierCodesForProfileTier("ALLIED");
    assert.deepEqual(allied, ["ALLIED"]);
    assert.ok(!allied.includes("RN"));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { RT_VENTILATOR_BANK_TAG } from "@/lib/rt-ventilator/rt-ventilator-content-taxonomy";
import { rtVentilatorPremiumBankGateWhere } from "@/lib/rt-ventilator/rt-ventilator-bank-pool-gate";

describe("rtVentilatorPremiumBankGateWhere", () => {
  it("excludes ventilator bank tag when module flag is off", () => {
    const prev = process.env.ENABLE_RT_VENTILATOR_MODULE;
    try {
      process.env.ENABLE_RT_VENTILATOR_MODULE = "false";
      const w = rtVentilatorPremiumBankGateWhere(baseScope());
      assert.deepEqual(w, { NOT: { tags: { has: RT_VENTILATOR_BANK_TAG } } });
    } finally {
      process.env.ENABLE_RT_VENTILATOR_MODULE = prev;
    }
  });

  it("excludes ventilator bank for guest / non-respiratory allied", () => {
    const prev = process.env.ENABLE_RT_VENTILATOR_MODULE;
    try {
      process.env.ENABLE_RT_VENTILATOR_MODULE = "true";
      const noPremium: AccessScope = {
        hasAccess: false,
        reason: "no_access",
        tier: TierCode.ALLIED,
        country: null,
        alliedCareer: "rrt",
      };
      let w = rtVentilatorPremiumBankGateWhere(noPremium);
      assert.deepEqual(w, { NOT: { tags: { has: RT_VENTILATOR_BANK_TAG } } });

      const wrongCareer: AccessScope = {
        hasAccess: true,
        reason: "active_subscription",
        tier: TierCode.ALLIED,
        country: null,
        alliedCareer: "mlt",
      };
      w = rtVentilatorPremiumBankGateWhere(wrongCareer);
      assert.deepEqual(w, { NOT: { tags: { has: RT_VENTILATOR_BANK_TAG } } });
    } finally {
      process.env.ENABLE_RT_VENTILATOR_MODULE = prev;
    }
  });

  it("allows ventilator bank for paid allied RRT", () => {
    const prev = process.env.ENABLE_RT_VENTILATOR_MODULE;
    try {
      process.env.ENABLE_RT_VENTILATOR_MODULE = "true";
      const ok: AccessScope = {
        hasAccess: true,
        reason: "active_subscription",
        tier: TierCode.ALLIED,
        country: null,
        alliedCareer: "rrt",
      };
      const w = rtVentilatorPremiumBankGateWhere(ok);
      assert.deepEqual(w, {});
    } finally {
      process.env.ENABLE_RT_VENTILATOR_MODULE = prev;
    }
  });
});

function baseScope(): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: null,
    alliedCareer: null,
  };
}

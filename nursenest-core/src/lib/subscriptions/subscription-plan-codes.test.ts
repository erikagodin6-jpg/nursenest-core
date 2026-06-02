import assert from "node:assert/strict";
import test from "node:test";
import {
  isBaseSubscriptionPlanCode,
  isModuleAddOnPlanCode,
  pickLatestBaseSubscription,
} from "@/lib/subscriptions/subscription-plan-codes";

test("module add-on plan codes are excluded from base subscription selection", () => {
  assert.equal(isModuleAddOnPlanCode("module_advanced_ecg_monthly"), true);
  assert.equal(isBaseSubscriptionPlanCode("module_advanced_ecg_monthly"), false);
  assert.equal(isBaseSubscriptionPlanCode("us_rn_monthly"), true);

  const picked = pickLatestBaseSubscription([
    { planCode: "module_advanced_ecg_monthly", label: "add-on" },
    { planCode: "us_rn_monthly", label: "base" },
  ]);
  assert.equal(picked?.label, "base");
});

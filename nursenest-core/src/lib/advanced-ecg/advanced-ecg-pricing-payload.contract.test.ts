import assert from "node:assert/strict";
import test from "node:test";
import { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";

test("base pricing payload does not treat Advanced ECG add-on as an included base plan", () => {
  const payload = buildPricingOptionsPayload();
  const planCodes = [
    ...payload.plans.map((plan) => plan.planCode),
    ...payload.alliedPlans.map((plan) => plan.planCode),
  ];
  assert.equal(planCodes.some((code) => code.includes("module_advanced_ecg")), false);
});

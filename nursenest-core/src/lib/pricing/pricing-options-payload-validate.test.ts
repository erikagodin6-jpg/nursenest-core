import assert from "node:assert/strict";
import test from "node:test";
import { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";
import type { PricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-types";
import { validatePricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-validate";

test("buildPricingOptionsPayload passes public-page validation (happy path)", () => {
  const p = buildPricingOptionsPayload();
  const v = validatePricingOptionsPayload(p);
  assert.equal(v.ok, true, v.errors.join(" | "));
});

test("validatePricingOptionsPayload rejects empty catalog", () => {
  const bad = {
    durations: ["monthly"],
    nursingTiers: [],
    alliedCareers: [],
    alliedCareerLabels: {},
    plans: [],
    alliedPlans: [],
    trialDays: 0,
  } as unknown as PricingOptionsPayload;
  const v = validatePricingOptionsPayload(bad);
  assert.equal(v.ok, false);
  assert.ok(v.errors.some((e) => e.includes("no_plan_rows") || e.includes("nursing_plan_row_count")));
});

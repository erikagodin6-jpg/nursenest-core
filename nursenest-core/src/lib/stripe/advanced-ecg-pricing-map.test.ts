import assert from "node:assert/strict";
import test from "node:test";
import { getAdvancedEcgPriceEntry } from "@/lib/stripe/pricing-map";

test("Advanced ECG pricing map exposes the lifetime package env key and plan code", () => {
  const entry = getAdvancedEcgPriceEntry();
  assert.equal(entry.planCode, "module_advanced_ecg_lifetime");
  assert.equal(entry.envKey, "STRIPE_PRICE_MODULE_ADVANCED_ECG_LIFETIME");
});

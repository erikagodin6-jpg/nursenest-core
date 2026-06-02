/**
 * Build-time guard: public pricing JSON must always assemble a non-empty, valid catalog.
 * Run from `scripts/run-build-prechecks.mjs` (no Next server required).
 */
import { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";
import { validatePricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-validate";

const payload = buildPricingOptionsPayload();
const v = validatePricingOptionsPayload(payload);
if (!v.ok) {
  console.error("[verify-pricing-payload] validation failed", { errors: v.errors, warnings: v.warnings });
  process.exit(1);
}
if (v.warnings.length > 0) {
  console.warn("[verify-pricing-payload] warnings", v.warnings);
}
console.log("[verify-pricing-payload] ok", {
  nursingRows: payload.plans.length,
  alliedRows: payload.alliedPlans.length,
});

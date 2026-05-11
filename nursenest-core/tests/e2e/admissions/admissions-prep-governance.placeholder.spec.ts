/**
 * Placeholder hooks for future HESI / TEAS / admissions governance audits.
 *
 * Intended expansions (non-exhaustive):
 * - Playwright: marketing hub noindex when pathway.status === hidden
 * - Visual regression: internal scaffold + Ocean/Blossom/Midnight/Sunset/Aurora
 * - Mobile overflow: `/us/allied/hesi-a2` scaffold at sm breakpoint
 * - Entitlement: PRE_NURSING vs future admissions SKU boundaries
 * - CAT: cat-eligibility + pathway-readiness-config when CAT ships for admissions tracks
 *
 * Run manually when wiring suites; skipped by default to keep CI light.
 */
import { test } from "@playwright/test";

test.describe.skip("admissions prep governance (placeholder)", () => {
  test("placeholder — enable when Playwright admissions audit lands", async () => {
    // Intentionally empty — hooks documented for Phase 6 governance prep.
  });
});

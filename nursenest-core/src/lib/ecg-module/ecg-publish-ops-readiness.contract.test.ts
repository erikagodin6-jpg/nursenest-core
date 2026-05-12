/**
 * Contract: ECG publish-ops readiness surface.
 *
 * Verifies:
 * - GET /api/admin/modules/ecg/readiness route exists and is admin-only
 * - Route returns canPublish, blockers, env, and readiness shapes
 * - Env-check script exists and references all required vars
 * - Playwright ECG hub smoke spec exists with RPN exclusion test
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../../..");

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel: string): boolean {
  return fs.existsSync(path.join(root, rel));
}

describe("GET /api/admin/modules/ecg/readiness route contract", () => {
  const routePath = "src/app/api/admin/modules/ecg/readiness/route.ts";

  it("readiness route file exists", () => {
    assert.ok(exists(routePath), "readiness route must exist at " + routePath);
  });

  it("readiness route is admin-only", () => {
    const src = read(routePath);
    assert.match(src, /requireAdmin/, "readiness GET must call requireAdmin");
  });

  it("readiness route exports GET handler", () => {
    const src = read(routePath);
    assert.match(src, /export async function GET/, "must export GET handler");
  });

  it("readiness route returns canPublish, blockers, env, and readiness in response", () => {
    const src = read(routePath);
    assert.match(src, /canPublish/, "response must include canPublish");
    assert.match(src, /blockers/, "response must include blockers");
    assert.match(src, /env/, "response must include env check");
    assert.match(src, /readiness\.counts/, "response must include readiness.counts");
  });

  it("readiness route checks ENABLE_ECG_MODULE env var", () => {
    const src = read(routePath);
    assert.match(src, /isEcgModuleEnabled/, "must check ENABLE_ECG_MODULE via isEcgModuleEnabled");
  });

  it("readiness route checks single STRIPE_PRICE_ADVANCED_ECG via advancedEcgStripePriceEnvKey", () => {
    const src = read(routePath);
    // advancedEcgStripePriceEnvKey() ignores duration and always returns "STRIPE_PRICE_ADVANCED_ECG"
    assert.match(src, /advancedEcgStripePriceEnvKey/, "must call advancedEcgStripePriceEnvKey");
    assert.match(src, /STRIPE_PRICE_ADVANCED_ECG|stripeKey|stripeAdvancedEcg/, "must resolve and check the single stripe key");
    // Must NOT iterate billing durations (that was the wrong pattern)
    assert.doesNotMatch(src, /ADVANCED_ECG_BILLING_DURATIONS/, "must not loop over billing durations — single price model");
  });

  it("readiness route is force-dynamic", () => {
    const src = read(routePath);
    assert.match(src, /force-dynamic/, "readiness route must be force-dynamic");
  });
});

describe("scripts/check-ecg-publish-env.mjs contract", () => {
  const scriptPath = "scripts/check-ecg-publish-env.mjs";

  it("env-check script exists", () => {
    assert.ok(exists(scriptPath), "env check script must exist");
  });

  it("env-check script checks ENABLE_ECG_MODULE", () => {
    const src = read(scriptPath);
    assert.match(src, /ENABLE_ECG_MODULE/, "must check ENABLE_ECG_MODULE");
  });

  it("env-check script checks NEXT_PUBLIC_ENABLE_ECG_MODULE", () => {
    const src = read(scriptPath);
    assert.match(src, /NEXT_PUBLIC_ENABLE_ECG_MODULE/, "must check NEXT_PUBLIC_ENABLE_ECG_MODULE");
  });

  it("env-check script checks single STRIPE_PRICE_ADVANCED_ECG (not per-duration vars)", () => {
    const src = read(scriptPath);
    // Single price model — one env var covers all billing durations
    assert.match(src, /STRIPE_PRICE_ADVANCED_ECG/, "must check STRIPE_PRICE_ADVANCED_ECG");
    // Must NOT reference the old per-duration key pattern
    assert.doesNotMatch(
      src,
      /STRIPE_PRICE_MODULE_ADVANCED_ECG_MONTHLY|STRIPE_PRICE_MODULE_ADVANCED_ECG_YEARLY/,
      "must not reference old per-duration key names — those were never the real key",
    );
  });

  it("env-check script exits 1 when vars are missing", () => {
    const src = read(scriptPath);
    assert.match(src, /process\.exit\(1\)/, "must exit 1 on failure");
    assert.match(src, /process\.exit\(0\)/, "must exit 0 on success");
  });

  it("env-check script prints next-step commands on success", () => {
    const src = read(scriptPath);
    assert.match(src, /GET.*readiness/, "must print readiness endpoint instruction");
    assert.match(src, /POST.*ecg\/publish/, "must print publish endpoint instruction");
  });
});

describe("Playwright ECG hub visibility smoke spec contract", () => {
  const specPath = "tests/e2e/ecg-module/ecg-hub-visibility-smoke.spec.ts";

  it("ECG hub visibility smoke spec exists", () => {
    assert.ok(exists(specPath), "ECG hub visibility smoke spec must exist");
  });

  it("spec tests RN hub shows ECG when enabled", () => {
    const src = read(specPath);
    assert.match(src, /RN lesson hub.*ECG|ECG.*RN.*hub|rn.*ecg|ecg.*rn/si, "must test RN hub ECG visibility");
  });

  it("spec tests NP hub shows ECG when enabled", () => {
    const src = read(specPath);
    assert.match(src, /NP lesson hub.*ECG|NP_HUB|np-hub|np\/fnp\/lessons/si, "must test NP hub ECG visibility");
  });

  it("spec tests RPN hub NEVER shows ECG", () => {
    const src = read(specPath);
    assert.match(src, /RPN.*never|RPN.*NEVER|rpn.*exclu|rpn.*no.*ecg/si, "must test RPN hub ECG exclusion");
    assert.match(src, /RPN_HUB|rpn\/rex-pn/, "must include RPN hub route");
  });

  it("spec tests ECG excluded from CAT pool", () => {
    const src = read(specPath);
    assert.match(src, /CAT pool|cat.*ecg|ecg.*cat/si, "must test CAT pool exclusion");
  });

  it("spec tests Advanced ECG checkout blocked without auth", () => {
    const src = read(specPath);
    assert.match(src, /checkout.*blocked|checkout.*401|checkout.*403|Advanced ECG checkout/si);
  });

  it("spec tests admin readiness endpoint returns structured JSON", () => {
    const src = read(specPath);
    assert.match(src, /admin.*readiness|readiness.*admin/si, "must test admin readiness endpoint");
    assert.match(src, /canPublish/, "must assert canPublish field in readiness response");
  });

  it("spec is gated by E2E_ECG_MODULE_ENABLED env var for module-dependent tests", () => {
    const src = read(specPath);
    assert.match(src, /E2E_ECG_MODULE_ENABLED/, "most tests must be opt-in via E2E_ECG_MODULE_ENABLED");
  });

  it("spec includes mobile layout test", () => {
    const src = read(specPath);
    assert.match(src, /mobile|390.*844|viewport.*390/si, "must include mobile layout test");
  });
});

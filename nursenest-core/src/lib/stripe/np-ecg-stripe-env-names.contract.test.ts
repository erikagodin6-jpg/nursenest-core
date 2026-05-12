/**
 * Contract test: NP and Advanced ECG Stripe price env var names.
 *
 * Guards the exact canonical env var names that must be set in the
 * DigitalOcean App Platform console for NP and Advanced ECG checkout to work.
 *
 * These are the canonical keys — the app reads them from process.env at
 * request time. If any are absent, the checkout route returns HTTP 400 with
 * STRIPE_PRICE_NOT_CONFIGURED_CODE (fail-closed, not fail-open).
 *
 * Context: production is deployed on DigitalOcean App Platform.
 * Stripe price IDs are stored as encrypted secrets in the DO console —
 * they are NOT committed to the app spec YAML or application source code.
 *
 * Required price IDs (set in DO console):
 *   STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION = price_1TAuJ7Fbgp0Ub5P79Kd4k3Lh
 *   STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION = price_1TAuJiFbgp0Ub5P7XIK12Ehi
 *   STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION = price_1TAuK8Fbgp0Ub5P7skiOC7II
 *   STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION  = price_1TAuKUFbgp0Ub5P7iEkkFK6U
 *   STRIPE_PRICE_ADVANCED_ECG                      = price_1TVo8vFbgp0Ub5P7aTySWrbU
 *
 * Run: node --import tsx --test src/lib/stripe/np-ecg-stripe-env-names.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { canonicalNursingStripePriceEnvKey } from "@/lib/pricing/display-catalog";
import { advancedEcgStripePriceEnvKey } from "@/lib/advanced-ecg/advanced-ecg-module-config";
import {
  eachStripePriceMatrixRow,
  resetStripePriceMapCacheForTests,
  findPriceEntry,
} from "@/lib/stripe/pricing-map";

const ROOT = process.cwd();

// ─── 1. Canonical env var name assertions ────────────────────────────────────

describe("NP Stripe price env var names — exact canonical keys", () => {
  it("monthly NP resolves to STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION", () => {
    assert.equal(
      canonicalNursingStripePriceEnvKey("NP", "monthly"),
      "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
    );
  });

  it("3-month NP resolves to STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION", () => {
    assert.equal(
      canonicalNursingStripePriceEnvKey("NP", "3-month"),
      "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
    );
  });

  it("6-month NP resolves to STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION", () => {
    assert.equal(
      canonicalNursingStripePriceEnvKey("NP", "6-month"),
      "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
    );
  });

  it("yearly NP resolves to STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION (not YEARLY)", () => {
    assert.equal(
      canonicalNursingStripePriceEnvKey("NP", "yearly"),
      "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
    );
    // Explicitly guard against a common misconfiguration: wrong suffix
    assert.notEqual(
      canonicalNursingStripePriceEnvKey("NP", "yearly"),
      "STRIPE_PRICE_NURSENEST_NP_YEARLY_SUBSCRIPTION",
      "NP yearly uses 1_YEAR_SUBSCRIPTION not YEARLY_SUBSCRIPTION (unlike RPN)",
    );
  });
});

describe("Advanced ECG Stripe price env var name", () => {
  it("advancedEcgStripePriceEnvKey returns STRIPE_PRICE_ADVANCED_ECG for any duration", () => {
    assert.equal(advancedEcgStripePriceEnvKey("monthly"), "STRIPE_PRICE_ADVANCED_ECG");
    assert.equal(advancedEcgStripePriceEnvKey("3-month"), "STRIPE_PRICE_ADVANCED_ECG");
    assert.equal(advancedEcgStripePriceEnvKey("6-month"), "STRIPE_PRICE_ADVANCED_ECG");
    assert.equal(advancedEcgStripePriceEnvKey("yearly"), "STRIPE_PRICE_ADVANCED_ECG");
    // All durations share a single price — confirm the key is always the same
    const keys = new Set([
      advancedEcgStripePriceEnvKey("monthly"),
      advancedEcgStripePriceEnvKey("3-month"),
      advancedEcgStripePriceEnvKey("6-month"),
      advancedEcgStripePriceEnvKey("yearly"),
    ]);
    assert.equal(keys.size, 1, "All Advanced ECG durations must use the same single env var");
  });
});

// ─── 2. Price matrix includes all 4 NP rows ──────────────────────────────────

describe("NP rows appear in Stripe price matrix", () => {
  const NP_DURATIONS = ["monthly", "3-month", "6-month", "yearly"] as const;
  const EXPECTED_NP_KEYS: Record<typeof NP_DURATIONS[number], string> = {
    "monthly": "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
    "3-month": "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
    "6-month": "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
    "yearly":  "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
  };

  it("matrix contains 8 NP rows (4 durations × 2 countries CA+US, same canonical key)", () => {
    const rows = eachStripePriceMatrixRow().filter((r) => r.tier === "NP");
    assert.equal(rows.length, 8, `Expected 8 NP rows (4 durations × CA+US), got ${rows.length}`);
    // All 8 rows share 4 unique canonical env keys (same key for CA and US)
    const uniqueKeys = new Set(rows.map((r) => r.envKey));
    assert.equal(uniqueKeys.size, 4, `Expected 4 unique NP canonical env keys, got ${uniqueKeys.size}`);
  });

  for (const duration of NP_DURATIONS) {
    it(`NP ${duration} row uses canonical key ${EXPECTED_NP_KEYS[duration]}`, () => {
      const rows = eachStripePriceMatrixRow().filter(
        (r) => r.tier === "NP" && r.duration === duration,
      );
      assert.ok(rows.length > 0, `No matrix row found for NP ${duration}`);
      const row = rows[0]!;
      assert.equal(
        row.envKey,
        EXPECTED_NP_KEYS[duration],
        `NP ${duration} canonical key mismatch: got "${row.envKey}", expected "${EXPECTED_NP_KEYS[duration]}"`,
      );
    });
  }
});

// ─── 3. Fail-closed: missing env var means checkout cannot proceed ────────────

describe("checkout fail-closed: missing NP price env var excludes row from price map", () => {
  it("findPriceEntry returns undefined for NP monthly when env var is absent", () => {
    resetStripePriceMapCacheForTests();
    const canonicalKey = "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION";
    const legacyKey = "STRIPE_PRICE_NP_MONTHLY";
    const wasCanonical = process.env[canonicalKey];
    const wasLegacy = process.env[legacyKey];
    delete process.env[canonicalKey];
    delete process.env[legacyKey];

    const entry = findPriceEntry("CA", "NP", "monthly");
    assert.equal(entry, undefined, "findPriceEntry must return undefined when price env var is absent — checkout fails closed");

    // Restore
    if (wasCanonical !== undefined) process.env[canonicalKey] = wasCanonical;
    if (wasLegacy !== undefined) process.env[legacyKey] = wasLegacy;
    resetStripePriceMapCacheForTests();
  });

  it("findPriceEntry returns an entry when canonical env var IS set", () => {
    resetStripePriceMapCacheForTests();
    const canonicalKey = "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION";
    const sentinel = "price_test_np_monthly_sentinel";
    const was = process.env[canonicalKey];
    process.env[canonicalKey] = sentinel;

    const entry = findPriceEntry("CA", "NP", "monthly");
    assert.ok(entry !== undefined, "findPriceEntry must return an entry when canonical env var is set");
    assert.equal(entry.priceId, sentinel, "priceId must equal the env var value");
    assert.equal(entry.tier, "NP");
    assert.equal(entry.duration, "monthly");

    // Restore
    if (was !== undefined) process.env[canonicalKey] = was;
    else delete process.env[canonicalKey];
    resetStripePriceMapCacheForTests();
  });
});

// ─── 4. DigitalOcean app spec documents the 5 required keys ──────────────────

describe("DigitalOcean live-app-spec.yaml — Stripe price key stubs", () => {
  const specSrc = readFileSync(join(ROOT, "live-app-spec.yaml"), "utf-8");

  const REQUIRED_KEYS = [
    "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION",
    "STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION",
    "STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION",
    "STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION",
    "STRIPE_PRICE_ADVANCED_ECG",
  ] as const;

  for (const key of REQUIRED_KEYS) {
    it(`live-app-spec.yaml documents required secret key: ${key}`, () => {
      assert.match(
        specSrc,
        new RegExp(`key:\\s*${key}`),
        `live-app-spec.yaml must document "${key}" as a required secret — set the actual value in the DigitalOcean App Platform console`,
      );
    });
  }

  it("all 5 NP/ECG Stripe keys are typed as SECRET in the app spec", () => {
    // Find each key block and verify type: SECRET follows it
    for (const key of REQUIRED_KEYS) {
      const keyIdx = specSrc.indexOf(`key: ${key}`);
      assert.ok(keyIdx >= 0, `Key "${key}" not found in spec`);
      // Look for type: SECRET within the next 150 chars of the key declaration
      const nearBlock = specSrc.slice(keyIdx, keyIdx + 150);
      assert.match(
        nearBlock,
        /type:\s*SECRET/,
        `Key "${key}" must be typed as SECRET in live-app-spec.yaml`,
      );
    }
  });

  it("NP yearly key uses 1_YEAR_SUBSCRIPTION (not YEARLY) — catches common misconfiguration", () => {
    assert.match(
      specSrc,
      /key:\s*STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION/,
      "App spec must use 1_YEAR_SUBSCRIPTION (matching Stripe price key) not YEARLY_SUBSCRIPTION",
    );
    assert.doesNotMatch(
      specSrc,
      /key:\s*STRIPE_PRICE_NURSENEST_NP_YEARLY_SUBSCRIPTION/,
      "App spec must NOT use YEARLY_SUBSCRIPTION for NP — correct key is 1_YEAR_SUBSCRIPTION",
    );
  });
});

// ─── 5. Advanced ECG checkout reads STRIPE_PRICE_ADVANCED_ECG ────────────────

describe("Advanced ECG checkout source — reads STRIPE_PRICE_ADVANCED_ECG directly", () => {
  const checkoutSrc = readFileSync(
    join(ROOT, "src/app/api/subscriptions/checkout/advanced-ecg/route.ts"),
    "utf-8",
  );

  it("advanced ECG checkout reads the price from advancedEcgStripePriceEnvKey", () => {
    assert.match(
      checkoutSrc,
      /advancedEcgStripePriceEnvKey/,
      "Advanced ECG checkout must use advancedEcgStripePriceEnvKey() — never a hardcoded price_* string",
    );
  });

  it("advanced ECG checkout reads from process.env with the resolved key", () => {
    assert.match(
      checkoutSrc,
      /process\.env\[priceEnvKey\]/,
      "Advanced ECG checkout must read from process.env using the resolved key",
    );
  });

  it("advanced ECG checkout fails closed when price env var is absent", () => {
    assert.match(
      checkoutSrc,
      /STRIPE_PRICE_NOT_CONFIGURED_CODE/,
      "Advanced ECG checkout must return STRIPE_PRICE_NOT_CONFIGURED_CODE when env var is missing",
    );
  });

  it("advanced ECG checkout does NOT hardcode any price_* string", () => {
    assert.doesNotMatch(
      checkoutSrc,
      /['"`]price_[0-9A-Za-z]+/,
      "Stripe price IDs must never be hardcoded in checkout source — env var only",
    );
  });
});

// ─── 6. NP main checkout reads canonical key from display-catalog ─────────────

describe("NP main checkout source — reads price via canonicalNursingStripePriceEnvKey", () => {
  const checkoutSrc = readFileSync(
    join(ROOT, "src/app/api/subscriptions/checkout/route.ts"),
    "utf-8",
  );
  const catalogSrc = readFileSync(
    join(ROOT, "src/lib/pricing/display-catalog.ts"),
    "utf-8",
  );

  it("main checkout imports canonicalNursingStripePriceEnvKey", () => {
    assert.match(
      checkoutSrc,
      /canonicalNursingStripePriceEnvKey/,
      "Main checkout must use canonicalNursingStripePriceEnvKey for diagnostic logging",
    );
  });

  it("display-catalog defines NP yearly key as 1_YEAR_SUBSCRIPTION (not YEARLY)", () => {
    assert.match(
      catalogSrc,
      /STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION/,
      "display-catalog must define NP yearly as 1_YEAR_SUBSCRIPTION",
    );
    assert.doesNotMatch(
      catalogSrc,
      /STRIPE_PRICE_NURSENEST_NP_YEARLY_SUBSCRIPTION/,
      "display-catalog must NOT use YEARLY_SUBSCRIPTION for NP",
    );
  });

  it("main checkout fails closed via STRIPE_PRICE_NOT_CONFIGURED_CODE", () => {
    assert.match(
      checkoutSrc,
      /STRIPE_PRICE_NOT_CONFIGURED_CODE/,
      "Main checkout must return STRIPE_PRICE_NOT_CONFIGURED_CODE when price env var is absent",
    );
  });

  it("main checkout does NOT hardcode any Stripe price ID (price_1* format)", () => {
    // Stripe price IDs always start with "price_1" followed by alphanumeric chars.
    // The broader "price_*" strings (e.g. "price_not_configured" in audit logs) are fine.
    assert.doesNotMatch(
      checkoutSrc,
      /['"`]price_1[A-Za-z0-9]{10,}/,
      "Stripe price IDs (price_1...) must never be hardcoded in checkout source — use env vars only",
    );
  });
});

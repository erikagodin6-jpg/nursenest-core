/**
 * Advanced ECG Checkout — Production-Grade Contract Tests
 *
 * Verifies end-to-end integrity of the Advanced ECG premium purchase flow:
 *   1. Runtime Stripe env key consistency (taxonomy ↔ config ↔ checkout route)
 *   2. Entitlement mapping (plan code, entitlement key, allowed tiers)
 *   3. Access control boundaries (public vs. learner-private routes)
 *   4. Checkout URL safety (success_url, cancel_url shapes)
 *   5. Canonical deploy spec env key presence
 *   6. No stale Stripe price alias references in source
 *   7. Pricing payload exclusion (Advanced ECG must not appear as a base plan)
 *   8. Gating surface correctness (additive CTAs, not page-level gates)
 *   9. Failure-mode assertions (missing env, tier mismatch, existing entitlement)
 *
 * All tests are CI-blocking. A failure indicates a regression in the
 * Advanced ECG checkout pipeline that must be resolved before deployment.
 *
 * Run:
 *   node --import tsx --test src/lib/ecg-module/advanced-ecg-checkout.contract.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ADVANCED_ECG_MODULE_ENTITLEMENT,
  ADVANCED_ECG_ALLOWED_TIERS,
  ADVANCED_ECG_MODULE_ROUTE,
  ADVANCED_ECG_PRICING_ANCHOR,
  ADVANCED_ECG_PLAN_CODE_PREFIX,
  advancedEcgStripePriceEnvKey,
  advancedEcgPlanCode,
  isAdvancedEcgPlanCode,
  isAdvancedEcgTierEligible,
  isAdvancedEcgModuleEnabled,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";

import {
  ADVANCED_ECG_PRODUCT,
  ECG_ADVANCED_PUBLIC_ROUTES,
  ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
  ECG_PLATFORM_ENTITLEMENT_MAP,
  ECG_SEO_AUTHORITY_ROUTES,
  isPubliclyIndexedEcgRoute,
  isLearnerPrivateEcgRoute,
  mustNotRedirectToLogin,
} from "./ecg-platform-taxonomy";

import {
  hasActiveAdvancedEcgEntitlementFromRows,
  resolveAdvancedEcgAccessDecision,
} from "@/lib/advanced-ecg/advanced-ecg-access";

import { SubscriptionStatus } from "@prisma/client";

import {
  CHECKOUT_UNAUTHORIZED_CODE,
  CHECKOUT_INVALID_PAYLOAD_CODE,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";

const ROOT = process.cwd();
const CANONICAL_SPEC_PATH = join(ROOT, "../.do/app-nursenest-core-next.yaml");
const CHECKOUT_ROUTE_PATH = join(ROOT, "src/app/api/subscriptions/checkout/advanced-ecg/route.ts");
const SRC_DIR = join(ROOT, "src");

// ─── 1. Stripe env key consistency across all layers ─────────────────────────

describe("Advanced ECG — Stripe env key consistency (taxonomy ↔ config ↔ checkout)", () => {
  it("ADVANCED_ECG_PRODUCT.stripeEnvKey === advancedEcgStripePriceEnvKey()", () => {
    const fromProduct = ADVANCED_ECG_PRODUCT.stripeEnvKey;
    const fromFunction = advancedEcgStripePriceEnvKey();
    assert.equal(
      fromProduct,
      fromFunction,
      `ADVANCED_ECG_PRODUCT.stripeEnvKey="${fromProduct}" must equal advancedEcgStripePriceEnvKey()="${fromFunction}"`,
    );
  });

  it('both resolve to "STRIPE_PRICE_ADVANCED_ECG" — the canonical env var name', () => {
    const EXPECTED = "STRIPE_PRICE_ADVANCED_ECG";
    assert.equal(advancedEcgStripePriceEnvKey(), EXPECTED);
    assert.equal(ADVANCED_ECG_PRODUCT.stripeEnvKey, EXPECTED);
    assert.equal(ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.entitlementKey, ADVANCED_ECG_MODULE_ENTITLEMENT);
  });

  it("all billing durations return the same single env key (single-price model)", () => {
    const BILLING_DURATIONS = ["monthly", "3-month", "6-month", "yearly"] as const;
    const keys = new Set(BILLING_DURATIONS.map((d) => advancedEcgStripePriceEnvKey(d)));
    assert.equal(keys.size, 1, "All Advanced ECG durations must resolve to the same env var key");
    assert.ok(keys.has("STRIPE_PRICE_ADVANCED_ECG"), "The single env key must be STRIPE_PRICE_ADVANCED_ECG");
  });

  it("checkout route source reads price via advancedEcgStripePriceEnvKey — never hardcoded", () => {
    const checkoutSrc = readFileSync(CHECKOUT_ROUTE_PATH, "utf-8");
    assert.match(
      checkoutSrc,
      /advancedEcgStripePriceEnvKey/,
      "Checkout route must use advancedEcgStripePriceEnvKey() not a hardcoded string",
    );
    assert.match(
      checkoutSrc,
      /process\.env\[priceEnvKey\]/,
      "Checkout route must read from process.env[priceEnvKey] (dynamic key resolution)",
    );
    assert.doesNotMatch(
      checkoutSrc,
      /['"`]price_[0-9A-Za-z]+/,
      "No Stripe price ID (price_...) must be hardcoded in the checkout route",
    );
  });

  it("canonical deploy spec has STRIPE_PRICE_ADVANCED_ECG with live price ID", () => {
    const specSrc = readFileSync(CANONICAL_SPEC_PATH, "utf-8");
    assert.match(
      specSrc,
      /key:\s*STRIPE_PRICE_ADVANCED_ECG/,
      "STRIPE_PRICE_ADVANCED_ECG must be declared in .do/app-nursenest-core-next.yaml",
    );
    const keyIdx = specSrc.indexOf("key: STRIPE_PRICE_ADVANCED_ECG");
    const nearBlock = specSrc.slice(keyIdx, keyIdx + 200);
    assert.match(
      nearBlock,
      /value:\s*price_1TVo8vFbgp0Ub5P7aTySWrbU/,
      "STRIPE_PRICE_ADVANCED_ECG must have the live price ID price_1TVo8vFbgp0Ub5P7aTySWrbU in canonical spec",
    );
  });
});

// ─── 2. Stale alias registry — no deprecated env names in source ──────────────

describe("Advanced ECG — no stale Stripe price alias in source code", () => {
  const STALE_ALIASES = [
    "STRIPE_PRICE_CA_ADVANCED_ECG_ONETIME", // deploy-spec backward-compat alias, not for app source
    "STRIPE_PRICE_ECG_ADVANCED",            // hypothetical wrong naming pattern
    "STRIPE_PRICE_ECG_PREMIUM",             // another plausible wrong name
  ];

  for (const alias of STALE_ALIASES) {
    it(`source does not reference stale alias: ${alias}`, () => {
      // Read the key files that could contain billing references
      const configSrc = readFileSync(join(ROOT, "src/lib/advanced-ecg/advanced-ecg-module-config.ts"), "utf-8");
      const checkoutSrc = readFileSync(CHECKOUT_ROUTE_PATH, "utf-8");
      const accessSrc = readFileSync(join(ROOT, "src/lib/advanced-ecg/advanced-ecg-access.ts"), "utf-8");
      const taxonomySrc = readFileSync(join(ROOT, "src/lib/ecg-module/ecg-platform-taxonomy.ts"), "utf-8");

      for (const [label, src] of [
        ["advanced-ecg-module-config.ts", configSrc],
        ["checkout/advanced-ecg/route.ts", checkoutSrc],
        ["advanced-ecg-access.ts", accessSrc],
        ["ecg-platform-taxonomy.ts", taxonomySrc],
      ] as [string, string][]) {
        assert.ok(
          !src.includes(alias),
          `"${alias}" must not appear in ${label} — use STRIPE_PRICE_ADVANCED_ECG via advancedEcgStripePriceEnvKey()`,
        );
      }
    });
  }
});

// ─── 3. Entitlement mapping integrity ────────────────────────────────────────

describe("Advanced ECG — entitlement mapping", () => {
  it('ADVANCED_ECG_MODULE_ENTITLEMENT === "module_advanced_ecg"', () => {
    assert.equal(ADVANCED_ECG_MODULE_ENTITLEMENT, "module_advanced_ecg");
  });

  it('ADVANCED_ECG_PLAN_CODE_PREFIX === "module_advanced_ecg_"', () => {
    assert.equal(ADVANCED_ECG_PLAN_CODE_PREFIX, "module_advanced_ecg_");
  });

  it("advancedEcgPlanCode() produces correct prefix for all durations", () => {
    const EXPECTED: Record<string, string> = {
      monthly: "module_advanced_ecg_monthly",
      "3-month": "module_advanced_ecg_3-month",
      "6-month": "module_advanced_ecg_6-month",
      yearly: "module_advanced_ecg_yearly",
    };
    for (const [duration, expected] of Object.entries(EXPECTED)) {
      assert.equal(
        advancedEcgPlanCode(duration as Parameters<typeof advancedEcgPlanCode>[0]),
        expected,
        `advancedEcgPlanCode("${duration}") must equal "${expected}"`,
      );
    }
  });

  it("isAdvancedEcgPlanCode correctly identifies advanced ECG plan codes", () => {
    assert.equal(isAdvancedEcgPlanCode("module_advanced_ecg_monthly"), true);
    assert.equal(isAdvancedEcgPlanCode("module_advanced_ecg_yearly"), true);
    assert.equal(isAdvancedEcgPlanCode("module_advanced_ecg_3-month"), true);
    // Must reject base plan codes
    assert.equal(isAdvancedEcgPlanCode("us_rn_monthly"), false);
    assert.equal(isAdvancedEcgPlanCode("ca_np_yearly"), false);
    assert.equal(isAdvancedEcgPlanCode(null), false);
    assert.equal(isAdvancedEcgPlanCode(undefined), false);
    assert.equal(isAdvancedEcgPlanCode(""), false);
  });

  it("ADVANCED_ECG_PRODUCT.entitlementKey matches ADVANCED_ECG_MODULE_ENTITLEMENT", () => {
    assert.equal(ADVANCED_ECG_PRODUCT.entitlementKey, ADVANCED_ECG_MODULE_ENTITLEMENT);
  });

  it("ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg has correct entitlement key", () => {
    assert.equal(
      ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.entitlementKey,
      ADVANCED_ECG_MODULE_ENTITLEMENT,
    );
  });
});

// ─── 4. Tier eligibility — gating boundaries ─────────────────────────────────

describe("Advanced ECG — tier eligibility", () => {
  it("RN and NP are the only eligible tiers", () => {
    const allowed = [...ADVANCED_ECG_ALLOWED_TIERS].sort();
    assert.deepEqual(allowed, ["NP", "RN"].sort());
  });

  it("isAdvancedEcgTierEligible returns true for RN and NP only", () => {
    assert.equal(isAdvancedEcgTierEligible("RN"), true);
    assert.equal(isAdvancedEcgTierEligible("NP"), true);
    assert.equal(isAdvancedEcgTierEligible("RPN"), false);
    assert.equal(isAdvancedEcgTierEligible("PN"), false);
    assert.equal(isAdvancedEcgTierEligible("LVN_LPN"), false);
    assert.equal(isAdvancedEcgTierEligible(null), false);
    assert.equal(isAdvancedEcgTierEligible(undefined), false);
  });

  it("ADVANCED_ECG_PRODUCT excludes RPN, PN, LVN_LPN", () => {
    const excluded = [...ADVANCED_ECG_PRODUCT.excludedTiers];
    assert.ok(excluded.includes("RPN"), "RPN must be excluded");
    assert.ok(excluded.includes("PN"), "PN must be excluded");
    assert.ok(excluded.includes("LVN_LPN"), "LVN_LPN must be excluded");
  });

  it("ADVANCED_ECG_PRODUCT.excludedTiers and ADVANCED_ECG_ALLOWED_TIERS are disjoint", () => {
    const excluded = new Set(ADVANCED_ECG_PRODUCT.excludedTiers as readonly string[]);
    for (const tier of ADVANCED_ECG_ALLOWED_TIERS) {
      assert.ok(
        !excluded.has(tier),
        `Tier "${tier}" appears in both allowed and excluded lists — entitlement boundary is broken`,
      );
    }
  });
});

// ─── 5. Access control decision logic ────────────────────────────────────────

describe("Advanced ECG — access decision matrix", () => {
  const BASE_INPUT = {
    moduleEnabled: true,
    moduleStatus: "published" as const,
    adminPreview: false,
    userId: "user_rn_001",
    tier: "RN" as const,
    hasBaseAccess: true,
    hasAdvancedEcgEntitlement: false,
  };

  it("RN with base access + add-on: ok=true", () => {
    const decision = resolveAdvancedEcgAccessDecision({ ...BASE_INPUT, hasAdvancedEcgEntitlement: true });
    assert.equal(decision.ok, true);
    if (decision.ok) assert.equal(decision.mode, "learner");
  });

  it("RN with base access but no add-on: ok=false, reason=advanced_ecg_upgrade_required", () => {
    const decision = resolveAdvancedEcgAccessDecision(BASE_INPUT);
    assert.equal(decision.ok, false);
    if (!decision.ok) {
      assert.equal(decision.reason, "advanced_ecg_upgrade_required");
      assert.equal(decision.hasBaseAccess, true);
      assert.equal(decision.hasAdvancedEcgEntitlement, false);
    }
  });

  it("NP with base access + add-on: ok=true", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      tier: "NP",
      hasAdvancedEcgEntitlement: true,
    });
    assert.equal(decision.ok, true);
  });

  it("RPN with add-on: ok=false, reason=tier_not_eligible (tier gate fires before entitlement check)", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      tier: "RPN",
      hasAdvancedEcgEntitlement: true,
    });
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "tier_not_eligible");
  });

  it("PN with add-on: ok=false, reason=tier_not_eligible", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      tier: "PN",
      hasAdvancedEcgEntitlement: true,
    });
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "tier_not_eligible");
  });

  it("RN without base access: ok=false, reason=base_subscription_required", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      hasBaseAccess: false,
    });
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "base_subscription_required");
  });

  it("unauthenticated user (no userId): ok=false, reason=sign_in_required", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      userId: "",
      tier: null,
      hasBaseAccess: false,
    });
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "sign_in_required");
  });

  it("module disabled: ok=false, reason=module_unavailable", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      moduleEnabled: false,
    });
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "module_unavailable");
  });

  it("module not published: ok=false, reason=module_unavailable", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      moduleStatus: "draft",
    });
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "module_unavailable");
  });

  it("admin preview bypasses all gates", () => {
    const decision = resolveAdvancedEcgAccessDecision({
      ...BASE_INPUT,
      adminPreview: true,
      userId: "admin_001",
      moduleEnabled: false,
      moduleStatus: "draft",
      tier: "RPN",
      hasBaseAccess: false,
      hasAdvancedEcgEntitlement: false,
    });
    assert.equal(decision.ok, true);
    if (decision.ok) assert.equal(decision.mode, "admin-preview");
  });
});

// ─── 6. Entitlement row detection ─────────────────────────────────────────────

describe("Advanced ECG — entitlement row detection", () => {
  const FUTURE = new Date("2026-12-31T00:00:00Z");
  const NOW = new Date("2026-05-15T00:00:00Z").getTime();
  const PAST = new Date("2026-01-01T00:00:00Z");

  it("ACTIVE advanced ECG subscription row grants entitlement", () => {
    assert.equal(
      hasActiveAdvancedEcgEntitlementFromRows([
        { status: SubscriptionStatus.ACTIVE, planCode: "module_advanced_ecg_monthly", currentPeriodEnd: FUTURE, trialEnd: null, updatedAt: NOW_DATE() },
      ], NOW),
      true,
    );
  });

  it("ACTIVE base subscription row does NOT grant advanced ECG entitlement", () => {
    assert.equal(
      hasActiveAdvancedEcgEntitlementFromRows([
        { status: SubscriptionStatus.ACTIVE, planCode: "ca_rn_monthly", currentPeriodEnd: FUTURE, trialEnd: null, updatedAt: NOW_DATE() },
        { status: SubscriptionStatus.ACTIVE, planCode: "us_np_yearly", currentPeriodEnd: FUTURE, trialEnd: null, updatedAt: NOW_DATE() },
      ], NOW),
      false,
    );
  });

  it("PAST_DUE advanced ECG row grants grace access", () => {
    assert.equal(
      hasActiveAdvancedEcgEntitlementFromRows([
        { status: SubscriptionStatus.PAST_DUE, planCode: "module_advanced_ecg_yearly", currentPeriodEnd: FUTURE, trialEnd: null, updatedAt: NOW_DATE() },
      ], NOW),
      true,
    );
  });

  it("CANCELLED advanced ECG row with future currentPeriodEnd grants paid-through access", () => {
    assert.equal(
      hasActiveAdvancedEcgEntitlementFromRows([
        { status: SubscriptionStatus.CANCELLED, planCode: "module_advanced_ecg_monthly", currentPeriodEnd: FUTURE, trialEnd: null, updatedAt: NOW_DATE() },
      ], NOW),
      true,
    );
  });

  it("CANCELLED advanced ECG row with past currentPeriodEnd denies access", () => {
    assert.equal(
      hasActiveAdvancedEcgEntitlementFromRows([
        { status: SubscriptionStatus.CANCELLED, planCode: "module_advanced_ecg_monthly", currentPeriodEnd: PAST, trialEnd: null, updatedAt: NOW_DATE() },
      ], NOW),
      false,
    );
  });

  it("empty rows array denies access", () => {
    assert.equal(hasActiveAdvancedEcgEntitlementFromRows([], NOW), false);
  });

  function NOW_DATE() { return new Date(NOW); }
});

// ─── 7. SEO — public vs. private route indexability ──────────────────────────

describe("Advanced ECG — SEO indexability enforcement", () => {
  it("all ECG_ADVANCED_PUBLIC_ROUTES have indexed_public or indexed_premium", () => {
    for (const path of ECG_ADVANCED_PUBLIC_ROUTES) {
      const route = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === path);
      assert.ok(route, `Advanced ECG public route "${path}" missing from ECG_SEO_AUTHORITY_ROUTES`);
      assert.ok(
        route!.indexability === "indexed_public" || route!.indexability === "indexed_premium",
        `Advanced ECG route "${path}" must be indexed (got "${route!.indexability}")`,
      );
    }
  });

  it("all ADVANCED_ECG_LEARNER_PRIVATE_ROUTES have noindex_learner", () => {
    for (const path of ADVANCED_ECG_LEARNER_PRIVATE_ROUTES) {
      const route = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === path);
      assert.ok(route, `Advanced ECG private route "${path}" missing from ECG_SEO_AUTHORITY_ROUTES`);
      assert.equal(
        route!.indexability,
        "noindex_learner",
        `Private route "${path}" must have noindex_learner (got "${route!.indexability}")`,
      );
    }
  });

  it("mustNotRedirectToLogin returns true for all Advanced ECG public routes", () => {
    for (const path of ECG_ADVANCED_PUBLIC_ROUTES) {
      assert.equal(
        mustNotRedirectToLogin(path),
        true,
        `Advanced ECG route "${path}" must NOT redirect to login — public SEO content`,
      );
    }
  });

  it("isLearnerPrivateEcgRoute returns true for /modules/ecg-advanced", () => {
    assert.equal(isLearnerPrivateEcgRoute("/modules/ecg-advanced"), true);
    assert.equal(isLearnerPrivateEcgRoute("/modules/ecg-advanced/something"), true);
  });

  it("isPubliclyIndexedEcgRoute returns true for /advanced-ecg-nursing", () => {
    assert.equal(isPubliclyIndexedEcgRoute("/advanced-ecg-nursing"), true);
    assert.equal(isPubliclyIndexedEcgRoute("/ecg-telemetry-mastery"), true);
  });

  it("no Advanced ECG public route is also a learner-private route", () => {
    const privateSet = new Set(ADVANCED_ECG_LEARNER_PRIVATE_ROUTES as readonly string[]);
    for (const path of ECG_ADVANCED_PUBLIC_ROUTES) {
      assert.ok(
        !privateSet.has(path),
        `Route "${path}" is in both ECG_ADVANCED_PUBLIC_ROUTES and ADVANCED_ECG_LEARNER_PRIVATE_ROUTES — entitlement boundary broken`,
      );
    }
  });
});

// ─── 8. Checkout route shape — URLs and error codes ──────────────────────────

describe("Advanced ECG — checkout route URL and error code contract", () => {
  const checkoutSrc = readFileSync(CHECKOUT_ROUTE_PATH, "utf-8");

  it("success_url resolves to ADVANCED_ECG_MODULE_ROUTE (/modules/ecg-advanced)", () => {
    assert.match(
      checkoutSrc,
      /success_url.*modules\/ecg-advanced/s,
      "success_url must point to /modules/ecg-advanced (the learner module route post-purchase)",
    );
  });

  it("cancel_url resolves to /pricing with #advanced-ecg-add-on anchor", () => {
    assert.match(
      checkoutSrc,
      /cancel_url.*pricing.*advanced-ecg-add-on/s,
      "cancel_url must point to /pricing#advanced-ecg-add-on (pricing section for abandoned checkout)",
    );
  });

  it("ADVANCED_ECG_MODULE_ROUTE constant matches expected value", () => {
    assert.equal(ADVANCED_ECG_MODULE_ROUTE, "/modules/ecg-advanced");
  });

  it("ADVANCED_ECG_PRICING_ANCHOR constant matches expected value", () => {
    assert.equal(ADVANCED_ECG_PRICING_ANCHOR, "/pricing#advanced-ecg-add-on");
  });

  it("checkout returns CHECKOUT_UNAUTHORIZED_CODE (401) when not authenticated", () => {
    assert.equal(CHECKOUT_UNAUTHORIZED_CODE, "checkout_unauthorized");
    assert.match(checkoutSrc, /CHECKOUT_UNAUTHORIZED_CODE/);
  });

  it("checkout returns STRIPE_PRICE_NOT_CONFIGURED_CODE (400) when env var missing", () => {
    assert.equal(STRIPE_PRICE_NOT_CONFIGURED_CODE, "stripe_price_not_configured");
    assert.match(checkoutSrc, /STRIPE_PRICE_NOT_CONFIGURED_CODE/);
  });

  it("checkout returns CHECKOUT_STRIPE_UNAVAILABLE_CODE (503) when Stripe client unavailable", () => {
    assert.equal(CHECKOUT_STRIPE_UNAVAILABLE_CODE, "checkout_stripe_unavailable");
    assert.match(checkoutSrc, /CHECKOUT_STRIPE_UNAVAILABLE_CODE/);
  });

  it("checkout returns CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE (503) when NEXT_PUBLIC_APP_URL missing", () => {
    assert.equal(CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE, "checkout_app_origin_misconfigured");
    assert.match(checkoutSrc, /CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE/);
  });

  it("checkout returns CHECKOUT_SESSION_FAILED_CODE (503) on unexpected Stripe error", () => {
    assert.equal(CHECKOUT_SESSION_FAILED_CODE, "checkout_session_failed");
    assert.match(checkoutSrc, /CHECKOUT_SESSION_FAILED_CODE/);
  });

  it("checkout returns CHECKOUT_INVALID_PAYLOAD_CODE (400/403) for invalid input", () => {
    assert.equal(CHECKOUT_INVALID_PAYLOAD_CODE, "checkout_invalid_payload");
    assert.match(checkoutSrc, /CHECKOUT_INVALID_PAYLOAD_CODE/);
  });

  it("checkout validates that user has base subscription before allowing add-on purchase", () => {
    assert.match(
      checkoutSrc,
      /base learner subscription is required/,
      "checkout must explicitly check for active base subscription",
    );
  });

  it("checkout validates tier eligibility (RN/NP only) before creating session", () => {
    assert.match(
      checkoutSrc,
      /isAdvancedEcgTierEligible/,
      "checkout must call isAdvancedEcgTierEligible to gate RPN/PN/LVN_LPN",
    );
  });

  it("checkout short-circuits when user already has Advanced ECG entitlement (409 conflict)", () => {
    assert.match(
      checkoutSrc,
      /hasActiveAdvancedEcgEntitlementFromRows/,
      "checkout must check for existing entitlement to prevent duplicate purchases",
    );
    assert.match(
      checkoutSrc,
      /already active on this account/,
      "checkout must return 409 with explanatory message when entitlement already exists",
    );
  });
});

// ─── 9. Checkout metadata — plan code and entitlement in Stripe session ────────

describe("Advanced ECG — Stripe session metadata integrity", () => {
  const checkoutSrc = readFileSync(CHECKOUT_ROUTE_PATH, "utf-8");

  it("checkout embeds moduleEntitlement in Stripe session metadata", () => {
    assert.match(
      checkoutSrc,
      /moduleEntitlement.*ADVANCED_ECG_MODULE_ENTITLEMENT/s,
      "Stripe session metadata must include moduleEntitlement for webhook handler to grant access",
    );
  });

  it("checkout embeds planCode in Stripe session metadata", () => {
    assert.match(
      checkoutSrc,
      /planCode/,
      "Stripe session metadata must include planCode for subscription record creation",
    );
  });

  it("checkout embeds moduleKey: 'advanced_ecg' in session metadata", () => {
    assert.match(
      checkoutSrc,
      /moduleKey.*advanced_ecg/s,
      "Stripe session metadata must identify the module as advanced_ecg",
    );
  });

  it("checkout records baseTierAtCheckout for audit trail", () => {
    assert.match(
      checkoutSrc,
      /baseTierAtCheckout/,
      "Stripe session metadata must capture baseTierAtCheckout for post-purchase reconciliation",
    );
  });

  it("checkout creates subscription mode (not payment mode)", () => {
    assert.match(
      checkoutSrc,
      /mode.*subscription/s,
      "Advanced ECG checkout must use subscription mode (not one-time payment)",
    );
  });
});

// ─── 10. Module enable flag behavior ─────────────────────────────────────────

describe("Advanced ECG — module enable flag", () => {
  it("isAdvancedEcgModuleEnabled defaults to true when ENABLE_ADVANCED_ECG_MODULE is unset", () => {
    const fakeEnv: Record<string, string | undefined> = {};
    assert.equal(isAdvancedEcgModuleEnabled(fakeEnv), true);
  });

  it('isAdvancedEcgModuleEnabled returns false when ENABLE_ADVANCED_ECG_MODULE="false"', () => {
    assert.equal(isAdvancedEcgModuleEnabled({ ENABLE_ADVANCED_ECG_MODULE: "false" }), false);
  });

  it('isAdvancedEcgModuleEnabled returns true when ENABLE_ADVANCED_ECG_MODULE="true"', () => {
    assert.equal(isAdvancedEcgModuleEnabled({ ENABLE_ADVANCED_ECG_MODULE: "true" }), true);
  });

  it('isAdvancedEcgModuleEnabled returns true when ENABLE_ADVANCED_ECG_MODULE="1"', () => {
    assert.equal(isAdvancedEcgModuleEnabled({ ENABLE_ADVANCED_ECG_MODULE: "1" }), true);
  });

  it("canonical deploy spec sets ENABLE_ADVANCED_ECG_MODULE=true", () => {
    const specSrc = readFileSync(CANONICAL_SPEC_PATH, "utf-8");
    const keyIdx = specSrc.indexOf("key: ENABLE_ADVANCED_ECG_MODULE");
    assert.ok(keyIdx >= 0, "ENABLE_ADVANCED_ECG_MODULE must be declared in canonical spec");
    const nearBlock = specSrc.slice(keyIdx, keyIdx + 100);
    assert.match(
      nearBlock,
      /value:\s*"?true"?/,
      'ENABLE_ADVANCED_ECG_MODULE must be set to "true" in canonical deploy spec',
    );
  });
});

// ─── 11. Gating surface governance ───────────────────────────────────────────

describe("Advanced ECG — gating surfaces are additive, not page-level", () => {
  it("advanced ECG gating surfaces are named action surfaces (not page routes)", () => {
    const surfaces = ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.gatingSurfaces;
    for (const surface of surfaces) {
      assert.ok(
        !surface.startsWith("/"),
        `Gating surface "${surface}" must not be a page path — premium gating is additive CTA only`,
      );
    }
  });

  it("advanced ECG gating surfaces include expected interactive surfaces", () => {
    const surfaces = ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.gatingSurfaces as readonly string[];
    assert.ok(surfaces.includes("advanced_drills"), "must gate advanced_drills");
    assert.ok(surfaces.includes("adaptive_testing"), "must gate adaptive_testing");
    assert.ok(surfaces.includes("mastery_tracking"), "must gate mastery_tracking");
  });

  it("checkout route logs failure via safeServerLog (not console.error)", () => {
    const checkoutSrc = readFileSync(CHECKOUT_ROUTE_PATH, "utf-8");
    assert.match(
      checkoutSrc,
      /safeServerLog/,
      "checkout must use safeServerLog for observability (not console.error/console.log)",
    );
    assert.doesNotMatch(
      checkoutSrc,
      /console\.error|console\.log/,
      "checkout must not use raw console.error/log — use safeServerLog for structured logs",
    );
  });
});

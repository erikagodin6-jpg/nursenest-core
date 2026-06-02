/**
 * Advanced Hemodynamics Checkout — Production-Grade Contract Tests
 *
 * Verifies end-to-end integrity of the Advanced Hemodynamics and Critical Care Bundle
 * premium purchase flows:
 *   1. Runtime Stripe env key consistency (config ↔ checkout route)
 *   2. Entitlement constants correctness
 *   3. Plan code helpers
 *   4. Tier eligibility (RN/NP allowed; RPN/LVN_LPN excluded)
 *   5. Access decision resolver logic
 *   6. Bundle grants both Advanced ECG + Advanced Hemodynamics entitlements
 *   7. Checkout route reads price via env key — never hardcoded
 *   8. Canonical deploy spec has both hemodynamics env keys declared
 *   9. One-time payment mode — no duration suffix on plan codes
 *  10. Public pages must be indexable; learner routes must be noindex
 *  11. Sitemap includes hemodynamics public routes; excludes learner routes
 *  12. Missing env returns structured 400 (fail-closed)
 *  13. RPN excluded from checkout
 *  14. Navigation includes hemodynamics entries
 *
 * All tests are CI-blocking. A failure indicates a regression in the hemodynamics
 * checkout pipeline that must be resolved before deployment.
 *
 * Run:
 *   node --import tsx --test src/lib/advanced-hemodynamics/advanced-hemodynamics-checkout.contract.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SubscriptionStatus } from "@prisma/client";

import {
  HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT,
  ADVANCED_HEMODYNAMICS_ENTITLEMENT,
  CRITICAL_CARE_BUNDLE_ENTITLEMENT,
  ADVANCED_HEMODYNAMICS_PLAN_CODE,
  CRITICAL_CARE_BUNDLE_PLAN_CODE,
  advancedHemodynamicsStripePriceEnvKey,
  criticalCareBundleStripePriceEnvKey,
  isHemodynamicsFundamentalsTierEligible,
  isAdvancedHemodynamicsTierEligible,
  isAdvancedHemodynamicsPlanCode,
  isCriticalCareBundlePlanCode,
  isHemodynamicsModuleEnabled,
  isAdvancedHemodynamicsModuleEnabled,
  HEMODYNAMICS_FUNDAMENTALS_ALLOWED_TIERS,
  ADVANCED_HEMODYNAMICS_ALLOWED_TIERS,
} from "./advanced-hemodynamics-module-config";

import {
  hasActiveAdvancedHemodynamicsEntitlementFromRows,
  resolveAdvancedHemodynamicsAccessDecision,
} from "./advanced-hemodynamics-access";

import {
  HEMODYNAMICS_PUBLIC_ROUTES,
  ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES,
  HEMODYNAMICS_LEARNER_PRIVATE_ROUTES,
  ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES,
  HEMODYNAMICS_FUNDAMENTALS_PRODUCT,
  ADVANCED_HEMODYNAMICS_PRODUCT,
  CRITICAL_CARE_BUNDLE_PRODUCT,
  isLearnerPrivateEcgRoute,
  mustNotRedirectToLogin,
} from "@/lib/ecg-module/ecg-platform-taxonomy";

import {
  CHECKOUT_UNAUTHORIZED_CODE,
  CHECKOUT_INVALID_PAYLOAD_CODE,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";

const ROOT = process.cwd();
const CANONICAL_SPEC_PATH = join(ROOT, "../.do/app-nursenest-core-next.yaml");
const ADVANCED_HEMODYNAMICS_CHECKOUT_PATH = join(ROOT, "src/app/api/subscriptions/checkout/advanced-hemodynamics/route.ts");
const CRITICAL_CARE_BUNDLE_CHECKOUT_PATH = join(ROOT, "src/app/api/subscriptions/checkout/critical-care-bundle/route.ts");

// ─── 1. Entitlement constant correctness ──────────────────────────────────────

describe("Advanced Hemodynamics — entitlement constants", () => {
  it('HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT === "hemodynamics_fundamentals"', () => {
    assert.equal(HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT, "hemodynamics_fundamentals");
  });

  it('ADVANCED_HEMODYNAMICS_ENTITLEMENT === "advanced_hemodynamics_paid"', () => {
    assert.equal(ADVANCED_HEMODYNAMICS_ENTITLEMENT, "advanced_hemodynamics_paid");
  });

  it('CRITICAL_CARE_BUNDLE_ENTITLEMENT === "critical_care_bundle_paid"', () => {
    assert.equal(CRITICAL_CARE_BUNDLE_ENTITLEMENT, "critical_care_bundle_paid");
  });

  it("ADVANCED_HEMODYNAMICS_PLAN_CODE matches entitlement key (one-time, no duration suffix)", () => {
    assert.equal(ADVANCED_HEMODYNAMICS_PLAN_CODE, ADVANCED_HEMODYNAMICS_ENTITLEMENT);
  });

  it("CRITICAL_CARE_BUNDLE_PLAN_CODE matches entitlement key", () => {
    assert.equal(CRITICAL_CARE_BUNDLE_PLAN_CODE, CRITICAL_CARE_BUNDLE_ENTITLEMENT);
  });
});

// ─── 2. Stripe env key consistency ────────────────────────────────────────────

describe("Advanced Hemodynamics — Stripe env key consistency", () => {
  it('advancedHemodynamicsStripePriceEnvKey() === "STRIPE_PRICE_ADVANCED_HEMODYNAMICS"', () => {
    assert.equal(advancedHemodynamicsStripePriceEnvKey(), "STRIPE_PRICE_ADVANCED_HEMODYNAMICS");
  });

  it('criticalCareBundleStripePriceEnvKey() === "STRIPE_PRICE_CRITICAL_CARE_BUNDLE"', () => {
    assert.equal(criticalCareBundleStripePriceEnvKey(), "STRIPE_PRICE_CRITICAL_CARE_BUNDLE");
  });

  it("ADVANCED_HEMODYNAMICS_PRODUCT.stripeEnvKey matches function", () => {
    assert.equal(ADVANCED_HEMODYNAMICS_PRODUCT.stripeEnvKey, advancedHemodynamicsStripePriceEnvKey());
  });

  it("CRITICAL_CARE_BUNDLE_PRODUCT.stripeEnvKey matches function", () => {
    assert.equal(CRITICAL_CARE_BUNDLE_PRODUCT.stripeEnvKey, criticalCareBundleStripePriceEnvKey());
  });

  it("advanced-hemodynamics checkout route reads price via env key — not hardcoded", () => {
    const src = readFileSync(ADVANCED_HEMODYNAMICS_CHECKOUT_PATH, "utf-8");
    assert.match(src, /advancedHemodynamicsStripePriceEnvKey/, "Must use advancedHemodynamicsStripePriceEnvKey()");
    assert.match(src, /process\.env\[priceEnvKey\]/, "Must read from process.env[priceEnvKey]");
    assert.doesNotMatch(src, /['"`]price_[0-9A-Za-z]+/, "No hardcoded Stripe price ID");
  });

  it("critical-care-bundle checkout route reads price via env key — not hardcoded", () => {
    const src = readFileSync(CRITICAL_CARE_BUNDLE_CHECKOUT_PATH, "utf-8");
    assert.match(src, /criticalCareBundleStripePriceEnvKey/, "Must use criticalCareBundleStripePriceEnvKey()");
    assert.match(src, /process\.env\[priceEnvKey\]/, "Must read from process.env[priceEnvKey]");
    assert.doesNotMatch(src, /['"`]price_[0-9A-Za-z]+/, "No hardcoded Stripe price ID");
  });

  it("canonical deploy spec declares STRIPE_PRICE_ADVANCED_HEMODYNAMICS", () => {
    const spec = readFileSync(CANONICAL_SPEC_PATH, "utf-8");
    assert.match(spec, /key:\s*STRIPE_PRICE_ADVANCED_HEMODYNAMICS/, "STRIPE_PRICE_ADVANCED_HEMODYNAMICS must be in DO spec");
  });

  it("canonical deploy spec declares STRIPE_PRICE_CRITICAL_CARE_BUNDLE", () => {
    const spec = readFileSync(CANONICAL_SPEC_PATH, "utf-8");
    assert.match(spec, /key:\s*STRIPE_PRICE_CRITICAL_CARE_BUNDLE/, "STRIPE_PRICE_CRITICAL_CARE_BUNDLE must be in DO spec");
  });

  it("canonical deploy spec declares ENABLE_HEMODYNAMICS_MODULE", () => {
    const spec = readFileSync(CANONICAL_SPEC_PATH, "utf-8");
    assert.match(spec, /key:\s*ENABLE_HEMODYNAMICS_MODULE/, "ENABLE_HEMODYNAMICS_MODULE must be in DO spec");
  });

  it("canonical deploy spec declares ENABLE_ADVANCED_HEMODYNAMICS_MODULE", () => {
    const spec = readFileSync(CANONICAL_SPEC_PATH, "utf-8");
    assert.match(spec, /key:\s*ENABLE_ADVANCED_HEMODYNAMICS_MODULE/, "ENABLE_ADVANCED_HEMODYNAMICS_MODULE must be in DO spec");
  });
});

// ─── 3. Checkout metadata integrity ───────────────────────────────────────────

describe("Advanced Hemodynamics — checkout metadata integrity", () => {
  it("advanced-hemodynamics checkout sets required metadata fields", () => {
    const src = readFileSync(ADVANCED_HEMODYNAMICS_CHECKOUT_PATH, "utf-8");
    for (const field of ["productSlug", "entitlement", "moduleType", "userTier", "pathway", "planCode"]) {
      assert.match(src, new RegExp(field), `Checkout metadata must include "${field}"`);
    }
  });

  it("critical-care-bundle checkout sets bundleIncludes metadata", () => {
    const src = readFileSync(CRITICAL_CARE_BUNDLE_CHECKOUT_PATH, "utf-8");
    assert.match(src, /bundleIncludes/, "Bundle checkout must include bundleIncludes metadata");
    assert.match(src, /module_advanced_ecg/, "Bundle must include module_advanced_ecg in bundleIncludes");
    assert.match(src, /advanced_hemodynamics_paid/, "Bundle must include advanced_hemodynamics_paid in bundleIncludes");
  });

  it("advanced-hemodynamics checkout uses mode: payment (one-time)", () => {
    const src = readFileSync(ADVANCED_HEMODYNAMICS_CHECKOUT_PATH, "utf-8");
    assert.match(src, /mode:\s*["']payment["']/, "Advanced Hemodynamics must use Stripe payment mode (one-time)");
  });

  it("critical-care-bundle checkout uses mode: payment (one-time)", () => {
    const src = readFileSync(CRITICAL_CARE_BUNDLE_CHECKOUT_PATH, "utf-8");
    assert.match(src, /mode:\s*["']payment["']/, "Critical Care Bundle must use Stripe payment mode (one-time)");
  });

  it("missing env key returns STRIPE_PRICE_NOT_CONFIGURED_CODE — fail-closed behavior", () => {
    assert.equal(STRIPE_PRICE_NOT_CONFIGURED_CODE, "stripe_price_not_configured");
    const src = readFileSync(ADVANCED_HEMODYNAMICS_CHECKOUT_PATH, "utf-8");
    assert.match(src, /STRIPE_PRICE_NOT_CONFIGURED_CODE/, "Must return STRIPE_PRICE_NOT_CONFIGURED_CODE when env missing");
    const bundleSrc = readFileSync(CRITICAL_CARE_BUNDLE_CHECKOUT_PATH, "utf-8");
    assert.match(bundleSrc, /STRIPE_PRICE_NOT_CONFIGURED_CODE/, "Bundle must return STRIPE_PRICE_NOT_CONFIGURED_CODE when env missing");
  });
});

// ─── 4. Tier eligibility ────────────────────────────────────────────────────

describe("Advanced Hemodynamics — tier eligibility", () => {
  it("RN and NP are eligible for fundamentals", () => {
    assert.equal(isHemodynamicsFundamentalsTierEligible("RN"), true);
    assert.equal(isHemodynamicsFundamentalsTierEligible("NP"), true);
  });

  it("RPN, PN, LVN_LPN are NOT eligible for fundamentals", () => {
    assert.equal(isHemodynamicsFundamentalsTierEligible("RPN"), false);
    assert.equal(isHemodynamicsFundamentalsTierEligible("PN"), false);
    assert.equal(isHemodynamicsFundamentalsTierEligible("LVN_LPN"), false);
  });

  it("RN and NP are eligible for advanced hemodynamics", () => {
    assert.equal(isAdvancedHemodynamicsTierEligible("RN"), true);
    assert.equal(isAdvancedHemodynamicsTierEligible("NP"), true);
  });

  it("RPN is NOT eligible for advanced hemodynamics (spec requirement)", () => {
    assert.equal(isAdvancedHemodynamicsTierEligible("RPN"), false);
    assert.equal(isAdvancedHemodynamicsTierEligible("PN"), false);
    assert.equal(isAdvancedHemodynamicsTierEligible("LVN_LPN"), false);
  });

  it("advanced-hemodynamics checkout blocks RPN at 403", () => {
    const src = readFileSync(ADVANCED_HEMODYNAMICS_CHECKOUT_PATH, "utf-8");
    assert.match(src, /isAdvancedHemodynamicsTierEligible/, "Checkout must check tier eligibility");
    assert.match(src, /403/, "Checkout must return 403 for ineligible tier");
  });

  it("ALLOWED_TIERS arrays match across fundamentals and advanced", () => {
    assert.deepEqual([...HEMODYNAMICS_FUNDAMENTALS_ALLOWED_TIERS].sort(), [...ADVANCED_HEMODYNAMICS_ALLOWED_TIERS].sort());
  });
});

// ─── 5. Plan code helpers ─────────────────────────────────────────────────────

describe("Advanced Hemodynamics — plan code helpers", () => {
  it("isAdvancedHemodynamicsPlanCode identifies advanced hemodynamics plan codes", () => {
    assert.equal(isAdvancedHemodynamicsPlanCode("advanced_hemodynamics_paid"), true);
    assert.equal(isAdvancedHemodynamicsPlanCode("critical_care_bundle_paid"), true);
  });

  it("isAdvancedHemodynamicsPlanCode rejects base plan codes", () => {
    assert.equal(isAdvancedHemodynamicsPlanCode("us_rn_monthly"), false);
    assert.equal(isAdvancedHemodynamicsPlanCode("module_advanced_ecg_monthly"), false);
    assert.equal(isAdvancedHemodynamicsPlanCode(null), false);
    assert.equal(isAdvancedHemodynamicsPlanCode(undefined), false);
  });

  it("isCriticalCareBundlePlanCode correctly identifies bundle code", () => {
    assert.equal(isCriticalCareBundlePlanCode("critical_care_bundle_paid"), true);
    assert.equal(isCriticalCareBundlePlanCode("advanced_hemodynamics_paid"), false);
    assert.equal(isCriticalCareBundlePlanCode("module_advanced_ecg_monthly"), false);
  });
});

// ─── 6. Entitlement row checking ──────────────────────────────────────────────

describe("Advanced Hemodynamics — entitlement row checking", () => {
  const now = Date.now();

  it("ACTIVE row with correct plan code grants entitlement", () => {
    assert.equal(
      hasActiveAdvancedHemodynamicsEntitlementFromRows([
        { status: SubscriptionStatus.ACTIVE, planCode: "advanced_hemodynamics_paid", currentPeriodEnd: null, trialEnd: null, updatedAt: new Date() },
      ], now),
      true,
    );
  });

  it("ACTIVE row with bundle plan code grants hemodynamics entitlement", () => {
    assert.equal(
      hasActiveAdvancedHemodynamicsEntitlementFromRows([
        { status: SubscriptionStatus.ACTIVE, planCode: "critical_care_bundle_paid", currentPeriodEnd: null, trialEnd: null, updatedAt: new Date() },
      ], now),
      true,
    );
  });

  it("ACTIVE row with null currentPeriodEnd grants lifetime access", () => {
    assert.equal(
      hasActiveAdvancedHemodynamicsEntitlementFromRows([
        { status: SubscriptionStatus.ACTIVE, planCode: "advanced_hemodynamics_paid", currentPeriodEnd: null, trialEnd: null, updatedAt: new Date() },
      ], now),
      true,
    );
  });

  it("no rows returns false", () => {
    assert.equal(hasActiveAdvancedHemodynamicsEntitlementFromRows([], now), false);
  });

  it("wrong plan code returns false", () => {
    assert.equal(
      hasActiveAdvancedHemodynamicsEntitlementFromRows([
        { status: SubscriptionStatus.ACTIVE, planCode: "us_rn_monthly", currentPeriodEnd: null, trialEnd: null, updatedAt: new Date() },
      ], now),
      false,
    );
  });

  it("CANCELLED row without active period returns false", () => {
    const past = new Date(now - 1000 * 60 * 60 * 24);
    assert.equal(
      hasActiveAdvancedHemodynamicsEntitlementFromRows([
        { status: SubscriptionStatus.CANCELLED, planCode: "advanced_hemodynamics_paid", currentPeriodEnd: past, trialEnd: null, updatedAt: new Date() },
      ], now),
      false,
    );
  });
});

// ─── 7. Access decision resolver ─────────────────────────────────────────────

describe("Advanced Hemodynamics — access decision resolver", () => {
  const base = { moduleEnabled: true, moduleStatus: "published" as const, adminPreview: false, userId: "user123", tier: "RN" as const, hasBaseAccess: true, hasAdvancedHemodynamicsEntitlement: true };

  it("grants access for eligible user with entitlement", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision(base);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.mode, "learner");
  });

  it("blocks with sign_in_required when userId empty", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, userId: "" });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "sign_in_required");
  });

  it("blocks with module_unavailable when module disabled", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, moduleEnabled: false });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "module_unavailable");
  });

  it("blocks with module_unavailable when status is not published", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, moduleStatus: "draft" as const });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "module_unavailable");
  });

  it("blocks with base_subscription_required when no base access", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, hasBaseAccess: false });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "base_subscription_required");
  });

  it("blocks RPN with tier_not_eligible", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, tier: "RPN" as const });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "tier_not_eligible");
  });

  it("blocks eligible RN without entitlement with advanced_hemodynamics_upgrade_required", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, hasAdvancedHemodynamicsEntitlement: false });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "advanced_hemodynamics_upgrade_required");
  });

  it("admin preview bypasses all checks", () => {
    const result = resolveAdvancedHemodynamicsAccessDecision({ ...base, adminPreview: true, userId: "admin", tier: null as any, hasBaseAccess: false, hasAdvancedHemodynamicsEntitlement: false });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.mode, "admin-preview");
  });
});

// ─── 8. Bundle grants both entitlements ───────────────────────────────────────

describe("Advanced Hemodynamics — bundle grants both entitlements", () => {
  it("CRITICAL_CARE_BUNDLE_PRODUCT.includes contains both Advanced ECG and Advanced Hemodynamics", () => {
    assert.ok(
      (CRITICAL_CARE_BUNDLE_PRODUCT.includes as readonly string[]).includes("module_advanced_ecg"),
      "Bundle must include module_advanced_ecg",
    );
    assert.ok(
      (CRITICAL_CARE_BUNDLE_PRODUCT.includes as readonly string[]).includes("advanced_hemodynamics_paid"),
      "Bundle must include advanced_hemodynamics_paid",
    );
  });

  it("bundle webhook metadata contains bundleIncludes with both entitlements", () => {
    const src = readFileSync(CRITICAL_CARE_BUNDLE_CHECKOUT_PATH, "utf-8");
    assert.match(src, /bundleIncludes.*module_advanced_ecg.*advanced_hemodynamics_paid|bundleIncludes.*advanced_hemodynamics_paid.*module_advanced_ecg/, "bundleIncludes must contain both entitlements");
  });
});

// ─── 9. SEO — public indexable, learner noindex ────────────────────────────────

describe("Advanced Hemodynamics — SEO route classification", () => {
  it("hemodynamics public routes must not be learner private", () => {
    for (const path of HEMODYNAMICS_PUBLIC_ROUTES) {
      assert.equal(isLearnerPrivateEcgRoute(path), false, `${path} must NOT be learner private`);
    }
  });

  it("advanced hemodynamics public routes must not be learner private", () => {
    for (const path of ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES) {
      assert.equal(isLearnerPrivateEcgRoute(path), false, `${path} must NOT be learner private`);
    }
  });

  it("hemodynamics learner routes are private (noindex)", () => {
    for (const path of HEMODYNAMICS_LEARNER_PRIVATE_ROUTES) {
      assert.equal(isLearnerPrivateEcgRoute(path), true, `${path} must be learner private`);
    }
  });

  it("advanced hemodynamics learner routes are private (noindex)", () => {
    for (const path of ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES) {
      assert.equal(isLearnerPrivateEcgRoute(path), true, `${path} must be learner private`);
    }
  });

  it("hemodynamics public routes must not redirect to login", () => {
    for (const path of HEMODYNAMICS_PUBLIC_ROUTES) {
      assert.equal(mustNotRedirectToLogin(path), true, `${path} must not redirect to login`);
    }
  });

  it("advanced hemodynamics public routes must not redirect to login", () => {
    for (const path of ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES) {
      assert.equal(mustNotRedirectToLogin(path), true, `${path} must not redirect to login`);
    }
  });
});

// ─── 10. Sitemap inclusion verification ───────────────────────────────────────

describe("Advanced Hemodynamics — sitemap coverage", () => {
  it("sitemap file imports hemodynamics public routes", () => {
    const sitemapSrc = readFileSync(join(ROOT, "src/lib/seo/clinical-modules-sitemap-urls.ts"), "utf-8");
    assert.match(sitemapSrc, /HEMODYNAMICS_PUBLIC_ROUTES/, "Sitemap must import HEMODYNAMICS_PUBLIC_ROUTES");
    assert.match(sitemapSrc, /ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES/, "Sitemap must import ADVANCED_HEMODYNAMICS_PUBLIC_ROUTES");
    assert.match(sitemapSrc, /HEMODYNAMICS_LEARNER_PRIVATE_ROUTES/, "Sitemap must import HEMODYNAMICS_LEARNER_PRIVATE_ROUTES");
    assert.match(sitemapSrc, /ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES/, "Sitemap must import ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES");
  });

  it("sitemap collector functions include hemodynamics URLs", () => {
    const sitemapSrc = readFileSync(join(ROOT, "src/lib/seo/clinical-modules-sitemap-urls.ts"), "utf-8");
    assert.match(sitemapSrc, /collectHemodynamicsAuthorityUrls/, "Sitemap must have collectHemodynamicsAuthorityUrls");
    assert.match(sitemapSrc, /collectAdvancedHemodynamicsAuthorityUrls/, "Sitemap must have collectAdvancedHemodynamicsAuthorityUrls");
  });

  it("ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION includes hemodynamics learner routes", () => {
    const sitemapSrc = readFileSync(join(ROOT, "src/lib/seo/clinical-modules-sitemap-urls.ts"), "utf-8");
    assert.match(sitemapSrc, /HEMODYNAMICS_LEARNER_PRIVATE_ROUTES/, "Exclusion set must include hemodynamics learner routes");
    assert.match(sitemapSrc, /ADVANCED_HEMODYNAMICS_LEARNER_PRIVATE_ROUTES/, "Exclusion set must include advanced hemodynamics learner routes");
  });
});

// ─── 11. Navigation visibility ───────────────────────────────────────────────

describe("Advanced Hemodynamics — navigation visibility", () => {
  it("learner primary nav includes hemodynamics entries", () => {
    const navSrc = readFileSync(join(ROOT, "src/lib/navigation/learner-primary-nav.ts"), "utf-8");
    assert.match(navSrc, /hemodynamics-fundamentals/, "Nav must include hemodynamics-fundamentals key");
    assert.match(navSrc, /advanced-hemodynamics/, "Nav must include advanced-hemodynamics key");
    assert.match(navSrc, /\/modules\/hemodynamics/, "Nav must link to /modules/hemodynamics");
    assert.match(navSrc, /\/modules\/hemodynamics-advanced/, "Nav must link to /modules/hemodynamics-advanced");
  });

  it("learner nav marks advanced-hemodynamics as premium", () => {
    const navSrc = readFileSync(join(ROOT, "src/lib/navigation/learner-primary-nav.ts"), "utf-8");
    assert.match(navSrc, /advanced-hemodynamics[\s\S]{0,300}status.*premium|status.*premium[\s\S]{0,300}advanced-hemodynamics/, "Advanced Hemodynamics nav entry must have status: 'premium'");
  });
});

// ─── 12. Feature flag behavior ────────────────────────────────────────────────

describe("Advanced Hemodynamics — feature flags", () => {
  it("isHemodynamicsModuleEnabled returns true by default (no env set)", () => {
    assert.equal(isHemodynamicsModuleEnabled({}), true);
  });

  it("isHemodynamicsModuleEnabled returns false when ENABLE_HEMODYNAMICS_MODULE=false", () => {
    assert.equal(isHemodynamicsModuleEnabled({ ENABLE_HEMODYNAMICS_MODULE: "false" }), false);
    assert.equal(isHemodynamicsModuleEnabled({ ENABLE_HEMODYNAMICS_MODULE: "0" }), false);
  });

  it("isAdvancedHemodynamicsModuleEnabled returns true by default", () => {
    assert.equal(isAdvancedHemodynamicsModuleEnabled({}), true);
  });

  it("isAdvancedHemodynamicsModuleEnabled returns false when disabled", () => {
    assert.equal(isAdvancedHemodynamicsModuleEnabled({ ENABLE_ADVANCED_HEMODYNAMICS_MODULE: "false" }), false);
  });
});

/**
 * Advanced Labs Checkout — Contract Tests
 *
 * Verifies end-to-end integrity of the Advanced Labs and Critical Care Bundle
 * (3-module) purchase flows:
 *   1. Entitlement constants are correct and non-overlapping
 *   2. Plan code helpers work correctly
 *   3. Tier eligibility (RN/NP allowed; RPN/LVN_LPN excluded)
 *   4. Access decision resolver logic
 *   5. Bundle now includes Advanced Labs (bundleIncludes metadata)
 *   6. Stripe env key is correct and stable
 *   7. isAdvancedLabsPlanCode accepts bundle plan code
 *   8. Sitemap includes Labs public routes; excludes learner routes
 *   9. Taxonomy includes ADVANCED_LABS_PUBLIC_ROUTES and ADVANCED_LABS_LEARNER_PRIVATE_ROUTES
 *  10. Labs public routes are not learner-private
 *  11. Labs learner routes are flagged as private
 *  12. CRITICAL_CARE_BUNDLE_PRODUCT.includes now contains advanced_labs_paid
 *
 * Run:
 *   node --import tsx --test src/lib/advanced-labs/advanced-labs-checkout.contract.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SubscriptionStatus } from "@prisma/client";

import {
  ADVANCED_LABS_ENTITLEMENT,
  ADVANCED_LABS_PLAN_CODE,
  CRITICAL_CARE_BUNDLE_ENTITLEMENT,
  CRITICAL_CARE_BUNDLE_PLAN_CODE,
  advancedLabsStripePriceEnvKey,
  criticalCareBundleStripePriceEnvKey,
  isAdvancedLabsTierEligible,
  isAdvancedLabsPlanCode,
  isCriticalCareBundlePlanCode,
  ADVANCED_LABS_ALLOWED_TIERS,
} from "./advanced-labs-module-config";

import {
  hasActiveAdvancedLabsEntitlementFromRows,
  resolveAdvancedLabsAccessDecision,
} from "./advanced-labs-access";

import {
  ADVANCED_LABS_PUBLIC_ROUTES,
  ADVANCED_LABS_LEARNER_PRIVATE_ROUTES,
  CRITICAL_CARE_BUNDLE_PRODUCT,
  isLearnerPrivateEcgRoute,
  mustNotRedirectToLogin,
} from "@/lib/ecg-module/ecg-platform-taxonomy";

import {
  collectAdvancedLabsAuthorityUrls,
  collectClinicalModulesSitemapUrls,
  ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION,
} from "@/lib/seo/clinical-modules-sitemap-urls";

const PACKAGE_ROOT = join(import.meta.dirname ?? __dirname, "../../../..");

function readFile(relPath: string): string {
  return readFileSync(join(PACKAGE_ROOT, relPath), "utf8");
}

// ─── 1. Entitlement constants ─────────────────────────────────────────────────

describe("Advanced Labs entitlement constants", () => {
  it("entitlement key is stable and non-overlapping with ECG and Hemodynamics", () => {
    assert.equal(ADVANCED_LABS_ENTITLEMENT, "advanced_labs_paid");
    assert.notEqual(ADVANCED_LABS_ENTITLEMENT, "module_advanced_ecg");
    assert.notEqual(ADVANCED_LABS_ENTITLEMENT, "advanced_hemodynamics_paid");
    assert.equal(CRITICAL_CARE_BUNDLE_ENTITLEMENT, "critical_care_bundle_paid");
  });

  it("plan code equals entitlement key (one-time purchase — no duration suffix)", () => {
    assert.equal(ADVANCED_LABS_PLAN_CODE, ADVANCED_LABS_ENTITLEMENT);
    assert.equal(CRITICAL_CARE_BUNDLE_PLAN_CODE, CRITICAL_CARE_BUNDLE_ENTITLEMENT);
    assert.ok(!ADVANCED_LABS_PLAN_CODE.includes("monthly"), "Plan code must not include billing duration suffix");
  });
});

// ─── 2. Stripe env key ────────────────────────────────────────────────────────

describe("Advanced Labs Stripe env key", () => {
  it("returns STRIPE_PRICE_ADVANCED_LABS", () => {
    assert.equal(advancedLabsStripePriceEnvKey(), "STRIPE_PRICE_ADVANCED_LABS");
  });

  it("bundle env key is STRIPE_PRICE_CRITICAL_CARE_BUNDLE", () => {
    assert.equal(criticalCareBundleStripePriceEnvKey(), "STRIPE_PRICE_CRITICAL_CARE_BUNDLE");
  });

  it("checkout route reads price via advancedLabsStripePriceEnvKey()", () => {
    const routeSource = readFile("nursenest-core/src/app/api/subscriptions/checkout/advanced-labs/route.ts");
    assert.ok(
      routeSource.includes("advancedLabsStripePriceEnvKey()"),
      "checkout route must call advancedLabsStripePriceEnvKey() — never hardcode the price ID",
    );
    assert.ok(!routeSource.includes("price_"), "price ID must not be hardcoded in checkout route");
  });
});

// ─── 3. Tier eligibility ─────────────────────────────────────────────────────

describe("Advanced Labs tier eligibility", () => {
  it("RN and NP are eligible", () => {
    assert.equal(isAdvancedLabsTierEligible("RN"), true);
    assert.equal(isAdvancedLabsTierEligible("NP"), true);
  });

  it("RPN, LVN_LPN, PN are NOT eligible", () => {
    assert.equal(isAdvancedLabsTierEligible("RPN"), false);
    assert.equal(isAdvancedLabsTierEligible("LVN_LPN"), false);
    assert.equal(isAdvancedLabsTierEligible("PN"), false);
    assert.equal(isAdvancedLabsTierEligible(null), false);
    assert.equal(isAdvancedLabsTierEligible(undefined), false);
  });

  it("ADVANCED_LABS_ALLOWED_TIERS matches eligibility function", () => {
    for (const tier of ADVANCED_LABS_ALLOWED_TIERS) {
      assert.ok(isAdvancedLabsTierEligible(tier), `Expected ${tier} to be eligible`);
    }
  });
});

// ─── 4. Plan code helpers ─────────────────────────────────────────────────────

describe("Advanced Labs plan code helpers", () => {
  it("isAdvancedLabsPlanCode accepts the labs plan code", () => {
    assert.ok(isAdvancedLabsPlanCode(ADVANCED_LABS_PLAN_CODE));
    assert.ok(isAdvancedLabsPlanCode("advanced_labs_paid"));
  });

  it("isAdvancedLabsPlanCode accepts the bundle plan code (bundle grants labs)", () => {
    assert.ok(isAdvancedLabsPlanCode(CRITICAL_CARE_BUNDLE_PLAN_CODE));
    assert.ok(isAdvancedLabsPlanCode("critical_care_bundle_paid"));
  });

  it("isAdvancedLabsPlanCode rejects other plan codes", () => {
    assert.ok(!isAdvancedLabsPlanCode("module_advanced_ecg_monthly"));
    assert.ok(!isAdvancedLabsPlanCode("advanced_hemodynamics_paid"));
    assert.ok(!isAdvancedLabsPlanCode(null));
    assert.ok(!isAdvancedLabsPlanCode(undefined));
    assert.ok(!isAdvancedLabsPlanCode(""));
  });

  it("isCriticalCareBundlePlanCode accepts only the bundle", () => {
    assert.ok(isCriticalCareBundlePlanCode("critical_care_bundle_paid"));
    assert.ok(!isCriticalCareBundlePlanCode("advanced_labs_paid"));
  });
});

// ─── 5. hasActiveAdvancedLabsEntitlementFromRows ──────────────────────────────

describe("hasActiveAdvancedLabsEntitlementFromRows", () => {
  const makeRow = (
    planCode: string,
    status: SubscriptionStatus = SubscriptionStatus.ACTIVE,
    currentPeriodEnd: Date | null = null,
  ) => ({
    status,
    planCode,
    currentPeriodEnd,
    trialEnd: null,
    updatedAt: new Date(),
  });

  it("returns true for active advanced_labs_paid (one-time, no period end)", () => {
    assert.ok(hasActiveAdvancedLabsEntitlementFromRows([makeRow("advanced_labs_paid")]));
  });

  it("returns true for active critical_care_bundle_paid (bundle grants labs)", () => {
    assert.ok(hasActiveAdvancedLabsEntitlementFromRows([makeRow("critical_care_bundle_paid")]));
  });

  it("returns false for cancelled without paid-through window", () => {
    const pastRow = makeRow("advanced_labs_paid", SubscriptionStatus.CANCELLED, new Date(Date.now() - 1000));
    assert.ok(!hasActiveAdvancedLabsEntitlementFromRows([pastRow]));
  });

  it("returns false for empty rows", () => {
    assert.ok(!hasActiveAdvancedLabsEntitlementFromRows([]));
  });

  it("returns false for unrelated plan codes", () => {
    assert.ok(!hasActiveAdvancedLabsEntitlementFromRows([makeRow("module_advanced_ecg_monthly")]));
  });
});

// ─── 6. resolveAdvancedLabsAccessDecision ────────────────────────────────────

describe("resolveAdvancedLabsAccessDecision", () => {
  const base = {
    moduleEnabled: true,
    moduleStatus: "published" as const,
    adminPreview: false,
    userId: "user_123",
    tier: "RN" as const,
    hasBaseAccess: true,
    hasAdvancedLabsEntitlement: true,
  };

  it("returns ok:true for entitled learner", () => {
    const result = resolveAdvancedLabsAccessDecision(base);
    assert.ok(result.ok);
    if (result.ok) {
      assert.equal(result.mode, "learner");
      assert.equal(result.entitlementKey, "advanced_labs_paid");
    }
  });

  it("blocks unauthenticated user with sign_in_required", () => {
    const result = resolveAdvancedLabsAccessDecision({ ...base, userId: "" });
    assert.ok(!result.ok);
    if (!result.ok) assert.equal(result.reason, "sign_in_required");
  });

  it("blocks unavailable module", () => {
    const result = resolveAdvancedLabsAccessDecision({ ...base, moduleStatus: "draft" as const });
    assert.ok(!result.ok);
    if (!result.ok) assert.equal(result.reason, "module_unavailable");
  });

  it("blocks user without base subscription", () => {
    const result = resolveAdvancedLabsAccessDecision({ ...base, hasBaseAccess: false });
    assert.ok(!result.ok);
    if (!result.ok) assert.equal(result.reason, "base_subscription_required");
  });

  it("blocks ineligible tier (RPN)", () => {
    const result = resolveAdvancedLabsAccessDecision({ ...base, tier: "RPN" as never });
    assert.ok(!result.ok);
    if (!result.ok) assert.equal(result.reason, "tier_not_eligible");
  });

  it("blocks entitled-eligible user without labs entitlement", () => {
    const result = resolveAdvancedLabsAccessDecision({ ...base, hasAdvancedLabsEntitlement: false });
    assert.ok(!result.ok);
    if (!result.ok) assert.equal(result.reason, "advanced_labs_upgrade_required");
  });

  it("admin preview bypasses all checks", () => {
    const result = resolveAdvancedLabsAccessDecision({
      ...base,
      adminPreview: true,
      hasBaseAccess: false,
      hasAdvancedLabsEntitlement: false,
    });
    assert.ok(result.ok);
    if (result.ok) assert.equal(result.mode, "admin-preview");
  });
});

// ─── 7. Taxonomy: ADVANCED_LABS routes ───────────────────────────────────────

describe("Advanced Labs platform taxonomy", () => {
  it("ADVANCED_LABS_PUBLIC_ROUTES includes labs-interpretation and advanced-labs-interpretation", () => {
    assert.ok(ADVANCED_LABS_PUBLIC_ROUTES.includes("/labs-interpretation" as never));
    assert.ok(ADVANCED_LABS_PUBLIC_ROUTES.includes("/advanced-labs-interpretation" as never));
  });

  it("ADVANCED_LABS_LEARNER_PRIVATE_ROUTES includes /modules/labs-advanced", () => {
    assert.ok(ADVANCED_LABS_LEARNER_PRIVATE_ROUTES.includes("/modules/labs-advanced" as never));
  });

  it("public labs routes are NOT learner-private", () => {
    for (const route of ADVANCED_LABS_PUBLIC_ROUTES) {
      assert.ok(
        !isLearnerPrivateEcgRoute(route),
        `Public route ${route} must NOT be flagged as learner-private`,
      );
    }
  });

  it("learner labs routes ARE flagged as learner-private", () => {
    for (const route of ADVANCED_LABS_LEARNER_PRIVATE_ROUTES) {
      assert.ok(
        isLearnerPrivateEcgRoute(route),
        `Learner route ${route} must be flagged as learner-private`,
      );
      assert.ok(
        isLearnerPrivateEcgRoute(`${route}/cbc-interpretation`),
        `Sub-route of ${route} must also be flagged as learner-private`,
      );
    }
  });

  it("public labs routes are exempt from login redirect", () => {
    for (const route of ADVANCED_LABS_PUBLIC_ROUTES) {
      assert.ok(
        mustNotRedirectToLogin(route),
        `Public route ${route} must never redirect to login`,
      );
    }
  });
});

// ─── 8. Critical Care Bundle now includes advanced_labs_paid ─────────────────

describe("Critical Care Bundle includes Advanced Labs", () => {
  it("CRITICAL_CARE_BUNDLE_PRODUCT.includes contains advanced_labs_paid", () => {
    assert.ok(
      (CRITICAL_CARE_BUNDLE_PRODUCT.includes as readonly string[]).includes("advanced_labs_paid"),
      "Bundle must include advanced_labs_paid entitlement",
    );
  });

  it("bundle includes all three advanced modules", () => {
    const includes = CRITICAL_CARE_BUNDLE_PRODUCT.includes as readonly string[];
    assert.ok(includes.includes("module_advanced_ecg"), "Bundle must include module_advanced_ecg");
    assert.ok(includes.includes("advanced_hemodynamics_paid"), "Bundle must include advanced_hemodynamics_paid");
    assert.ok(includes.includes("advanced_labs_paid"), "Bundle must include advanced_labs_paid");
  });

  it("bundle checkout route metadata includes advanced_labs_paid", () => {
    const bundleRoute = readFile("nursenest-core/src/app/api/subscriptions/checkout/critical-care-bundle/route.ts");
    assert.ok(
      bundleRoute.includes("advanced_labs_paid"),
      "Critical care bundle checkout must include advanced_labs_paid in bundleIncludes metadata",
    );
  });
});

// ─── 9. Sitemap: Labs routes included ────────────────────────────────────────

describe("Sitemap includes Advanced Labs public routes", () => {
  it("collectAdvancedLabsAuthorityUrls returns expected URLs", () => {
    const urls = collectAdvancedLabsAuthorityUrls("https://nursenest.ca");
    assert.ok(urls.includes("https://nursenest.ca/labs-interpretation"));
    assert.ok(urls.includes("https://nursenest.ca/advanced-labs-interpretation"));
  });

  it("clinical modules sitemap includes labs authority URLs", () => {
    const urls = collectClinicalModulesSitemapUrls("https://nursenest.ca");
    assert.ok(
      urls.includes("https://nursenest.ca/labs-interpretation"),
      "sitemap must include /labs-interpretation",
    );
    assert.ok(
      urls.includes("https://nursenest.ca/advanced-labs-interpretation"),
      "sitemap must include /advanced-labs-interpretation",
    );
  });

  it("clinical modules sitemap EXCLUDES learner-private labs routes", () => {
    const urls = collectClinicalModulesSitemapUrls("https://nursenest.ca");
    assert.ok(
      !urls.some((u) => u.includes("/modules/labs-advanced")),
      "sitemap must NOT include /modules/labs-advanced (learner-private)",
    );
  });

  it("ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION includes /modules/labs-advanced", () => {
    assert.ok(
      (ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION as readonly string[]).includes("/modules/labs-advanced"),
      "Sitemap exclusion list must include /modules/labs-advanced",
    );
  });
});

// ─── 10. Curriculum completeness ─────────────────────────────────────────────

describe("Advanced Labs curriculum integrity", () => {
  it("has 10 lessons", async () => {
    const { ADVANCED_LABS_LESSONS, ADVANCED_LABS_LESSON_INDEX } = await import("./advanced-labs-curriculum");
    assert.equal(ADVANCED_LABS_LESSONS.length, 10);
    assert.equal(ADVANCED_LABS_LESSON_INDEX.length, 10);
  });

  it("all lessons have unique slugs and IDs", async () => {
    const { ADVANCED_LABS_LESSONS } = await import("./advanced-labs-curriculum");
    const slugs = ADVANCED_LABS_LESSONS.map((l) => l.slug);
    const ids = ADVANCED_LABS_LESSONS.map((l) => l.id);
    assert.equal(new Set(slugs).size, slugs.length, "Slugs must be unique");
    assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
  });

  it("all lessons have at least 1 practice question", async () => {
    const { ADVANCED_LABS_LESSONS } = await import("./advanced-labs-curriculum");
    for (const lesson of ADVANCED_LABS_LESSONS) {
      assert.ok(
        lesson.practiceItems.length >= 1,
        `Lesson ${lesson.slug} must have at least 1 practice question`,
      );
    }
  });

  it("all lessons have at least 3 nursing priorities", async () => {
    const { ADVANCED_LABS_LESSONS } = await import("./advanced-labs-curriculum");
    for (const lesson of ADVANCED_LABS_LESSONS) {
      assert.ok(
        lesson.nursingPriorities.length >= 3,
        `Lesson ${lesson.slug} must have at least 3 nursing priorities`,
      );
    }
  });

  it("lesson numbers are sequential 1–10", async () => {
    const { ADVANCED_LABS_LESSONS } = await import("./advanced-labs-curriculum");
    const numbers = ADVANCED_LABS_LESSONS.map((l) => l.number).sort((a, b) => a - b);
    for (let i = 0; i < numbers.length; i++) {
      assert.equal(numbers[i], i + 1, `Expected lesson number ${i + 1}, got ${numbers[i]}`);
    }
  });

  it("getAdvancedLabsLessonBySlug finds all lessons", async () => {
    const { ADVANCED_LABS_LESSON_INDEX, getAdvancedLabsLessonBySlug } = await import("./advanced-labs-curriculum");
    for (const idx of ADVANCED_LABS_LESSON_INDEX) {
      const lesson = getAdvancedLabsLessonBySlug(idx.slug);
      assert.ok(lesson, `getAdvancedLabsLessonBySlug("${idx.slug}") must return a lesson`);
      assert.equal(lesson.id, idx.id);
    }
  });
});

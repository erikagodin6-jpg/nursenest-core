/**
 * ECG Platform Architecture Contract Tests
 *
 * These tests enforce the SEO, indexability, entitlement separation, and
 * hemodynamics expansion readiness rules defined in ecg-platform-taxonomy.ts
 * and ecg-hemodynamics-taxonomy.ts.
 *
 * All tests are CI-blocking. Failure indicates a regression in:
 *   - Public ECG route indexability
 *   - Learner-private route noindex enforcement
 *   - PALS/ACLS entitlement separation
 *   - Sitemap composition (no private routes)
 *   - Hemodynamics reserved route conflicts
 *   - Internal linking map completeness
 *   - Pulsus paradoxus governance
 *
 * Run:
 *   node --import tsx --test src/lib/ecg-module/ecg-platform-architecture.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  ECG_CORE_PUBLIC_ROUTES,
  ECG_ADVANCED_PUBLIC_ROUTES,
  ECG_LEARNER_PRIVATE_ROUTES,
  ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
  ECG_SEO_AUTHORITY_ROUTES,
  ECG_SITEMAP_ELIGIBLE_ROUTES,
  ECG_PLATFORM_ENTITLEMENT_MAP,
  ECG_PUBLIC_RENDERING_REQUIREMENTS,
  isPubliclyIndexedEcgRoute,
  isLearnerPrivateEcgRoute,
  mustNotRedirectToLogin,
  CORE_ECG_PRODUCT,
  ADVANCED_ECG_PRODUCT,
} from "./ecg-platform-taxonomy";

import {
  HEMODYNAMICS_RESERVED_ROUTES,
  HEMODYNAMICS_RESERVED_NAV_ENTRIES,
  HEMODYNAMICS_RESERVED_UNIT_IDS,
  PULSUS_PARADOXUS_TAXONOMY_BRIDGE,
  HEMODYNAMICS_LAUNCH_PREREQUISITES,
} from "./ecg-hemodynamics-taxonomy";

import {
  collectClinicalModulesSitemapUrls,
  ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION,
  collectCoreEcgAuthorityUrls,
  collectAdvancedEcgAuthorityUrls,
} from "../seo/clinical-modules-sitemap-urls";

import {
  buildClinicalModulesNavLinks,
} from "../navigation/learner-primary-nav";

const ROOT = process.cwd();

// ─── 1. Public ECG routes are indexed ─────────────────────────────────────────

describe("ECG public routes — indexability enforcement", () => {
  test("all Core ECG public routes have indexed_public in authority map", () => {
    for (const path of ECG_CORE_PUBLIC_ROUTES) {
      const route = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === path);
      assert.ok(route, `Core ECG route "${path}" missing from ECG_SEO_AUTHORITY_ROUTES`);
      assert.equal(
        route!.indexability,
        "indexed_public",
        `Core ECG route "${path}" must have indexability=indexed_public (must render without auth)`,
      );
    }
  });

  test("all Advanced ECG public routes have indexed_public or indexed_premium", () => {
    for (const path of ECG_ADVANCED_PUBLIC_ROUTES) {
      const route = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === path);
      assert.ok(route, `Advanced ECG route "${path}" missing from ECG_SEO_AUTHORITY_ROUTES`);
      assert.ok(
        route!.indexability === "indexed_public" || route!.indexability === "indexed_premium",
        `Advanced ECG route "${path}" must be indexed (indexed_public or indexed_premium)`,
      );
    }
  });

  test("isPubliclyIndexedEcgRoute returns true for all public routes", () => {
    const allPublic = [...ECG_CORE_PUBLIC_ROUTES, ...ECG_ADVANCED_PUBLIC_ROUTES];
    for (const path of allPublic) {
      assert.equal(
        isPubliclyIndexedEcgRoute(path),
        true,
        `isPubliclyIndexedEcgRoute("${path}") must return true`,
      );
    }
  });

  test("ECG_SITEMAP_ELIGIBLE_ROUTES contains all public routes", () => {
    const eligiblePaths = new Set(ECG_SITEMAP_ELIGIBLE_ROUTES.map((r) => r.path));
    const allPublic = [...ECG_CORE_PUBLIC_ROUTES, ...ECG_ADVANCED_PUBLIC_ROUTES];
    for (const path of allPublic) {
      assert.ok(eligiblePaths.has(path), `Route "${path}" missing from ECG_SITEMAP_ELIGIBLE_ROUTES`);
    }
  });

  test("/ecg and /advanced-ecg-nursing are marked as pillar routes", () => {
    const ecg = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === "/ecg");
    const advanced = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === "/advanced-ecg-nursing");
    assert.ok(ecg, "/ecg must be in authority routes");
    assert.ok(advanced, "/advanced-ecg-nursing must be in authority routes");
    assert.equal(ecg!.linkingRole, "pillar");
    assert.equal(advanced!.linkingRole, "pillar");
  });
});

// ─── 2. No login redirect on ECG authority pages ──────────────────────────────

describe("ECG authority pages — no login redirect rule", () => {
  test("mustNotRedirectToLogin returns true for all Core ECG public routes", () => {
    for (const path of ECG_CORE_PUBLIC_ROUTES) {
      assert.equal(
        mustNotRedirectToLogin(path),
        true,
        `Core ECG route "${path}" must NOT redirect to login`,
      );
    }
  });

  test("mustNotRedirectToLogin returns true for all Advanced ECG public routes", () => {
    for (const path of ECG_ADVANCED_PUBLIC_ROUTES) {
      assert.equal(
        mustNotRedirectToLogin(path),
        true,
        `Advanced ECG route "${path}" must NOT redirect to login`,
      );
    }
  });

  test("ECG public rendering requirements document no-login-redirect rule", () => {
    assert.ok(
      ECG_PUBLIC_RENDERING_REQUIREMENTS.mustNeverRender.includes("login_redirect"),
      "ECG_PUBLIC_RENDERING_REQUIREMENTS must list login_redirect as prohibited",
    );
    assert.ok(
      ECG_PUBLIC_RENDERING_REQUIREMENTS.mustNeverRender.includes("thin_teaser_content"),
      "ECG_PUBLIC_RENDERING_REQUIREMENTS must prohibit thin teaser content",
    );
    assert.equal(ECG_PUBLIC_RENDERING_REQUIREMENTS.premiumCtaIsAdditive, true);
  });
});

// ─── 3. Learner-private routes have noindex ───────────────────────────────────

describe("ECG learner-private routes — noindex enforcement", () => {
  test("all learner-private ECG routes have noindex_learner in authority map", () => {
    const allPrivate = [...ECG_LEARNER_PRIVATE_ROUTES, ...ADVANCED_ECG_LEARNER_PRIVATE_ROUTES];
    for (const path of allPrivate) {
      const route = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === path);
      assert.ok(route, `Private ECG route "${path}" missing from ECG_SEO_AUTHORITY_ROUTES`);
      assert.equal(
        route!.indexability,
        "noindex_learner",
        `Private route "${path}" must have noindex_learner — it must not appear in sitemaps`,
      );
    }
  });

  test("isLearnerPrivateEcgRoute correctly identifies private routes", () => {
    assert.equal(isLearnerPrivateEcgRoute("/modules/ecg"), true);
    assert.equal(isLearnerPrivateEcgRoute("/modules/ecg/basic/lessons"), true);
    assert.equal(isLearnerPrivateEcgRoute("/modules/ecg-advanced"), true);
    assert.equal(isLearnerPrivateEcgRoute("/modules/ecg/pediatric"), true);
    // Not private:
    assert.equal(isLearnerPrivateEcgRoute("/ecg"), false);
    assert.equal(isLearnerPrivateEcgRoute("/advanced-ecg-nursing"), false);
  });

  test("no private ECG route appears in ECG_SITEMAP_ELIGIBLE_ROUTES", () => {
    const allPrivate = new Set([
      ...ECG_LEARNER_PRIVATE_ROUTES,
      ...ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
    ]);
    for (const route of ECG_SITEMAP_ELIGIBLE_ROUTES) {
      assert.ok(
        !allPrivate.has(route.path),
        `Private route "${route.path}" must not appear in ECG_SITEMAP_ELIGIBLE_ROUTES`,
      );
    }
  });
});

// ─── 4. Sitemap composition — no private routes ───────────────────────────────

describe("Sitemap composition — no learner-private ECG routes", () => {
  const TEST_ORIGIN = "https://nursenest.ca";

  test("collectClinicalModulesSitemapUrls contains Core ECG authority routes", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const urlSet = new Set(urls);
    assert.ok(urlSet.has(`${TEST_ORIGIN}/ecg`), "Sitemap must include /ecg");
    assert.ok(urlSet.has(`${TEST_ORIGIN}/ecg-interpretation`), "Sitemap must include /ecg-interpretation");
    assert.ok(urlSet.has(`${TEST_ORIGIN}/advanced-ecg-nursing`), "Sitemap must include /advanced-ecg-nursing");
  });

  test("collectClinicalModulesSitemapUrls does NOT contain learner-private routes", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const privateRoutes = ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION;
    for (const privatePath of privateRoutes) {
      assert.ok(
        !urls.includes(`${TEST_ORIGIN}${privatePath}`),
        `Sitemap must NOT contain private route: "${privatePath}"`,
      );
    }
  });

  test("collectCoreEcgAuthorityUrls covers all Core ECG public routes", () => {
    const urls = collectCoreEcgAuthorityUrls(TEST_ORIGIN);
    const urlPaths = urls.map((u) => u.replace(TEST_ORIGIN, ""));
    for (const route of ECG_CORE_PUBLIC_ROUTES) {
      assert.ok(urlPaths.includes(route), `Core ECG route "${route}" missing from core authority URLs`);
    }
  });

  test("collectAdvancedEcgAuthorityUrls covers all Advanced ECG public routes", () => {
    const urls = collectAdvancedEcgAuthorityUrls(TEST_ORIGIN);
    const urlPaths = urls.map((u) => u.replace(TEST_ORIGIN, ""));
    for (const route of ECG_ADVANCED_PUBLIC_ROUTES) {
      assert.ok(urlPaths.includes(route), `Advanced ECG route "${route}" missing from advanced authority URLs`);
    }
  });
});

// ─── 5. ECG schema validity ───────────────────────────────────────────────────

describe("ECG authority pages — schema type coverage", () => {
  test("all pillar routes have Course schema", () => {
    const pillars = ECG_SEO_AUTHORITY_ROUTES.filter((r) => r.linkingRole === "pillar");
    for (const pillar of pillars) {
      if (pillar.indexability === "indexed_public" || pillar.indexability === "indexed_premium") {
        assert.ok(
          pillar.schemaTypes.includes("Course"),
          `Pillar route "${pillar.path}" must have Course schema`,
        );
      }
    }
  });

  test("/ecg pillar has WebPage, Course, and FAQPage schemas", () => {
    const ecg = ECG_SEO_AUTHORITY_ROUTES.find((r) => r.path === "/ecg");
    assert.ok(ecg, "/ecg must be in authority routes");
    assert.ok(ecg!.schemaTypes.includes("WebPage"), "/ecg must have WebPage schema");
    assert.ok(ecg!.schemaTypes.includes("Course"), "/ecg must have Course schema");
    assert.ok(ecg!.schemaTypes.includes("FAQPage"), "/ecg must have FAQPage schema");
  });

  test("cluster routes have Article schema", () => {
    const clusters = ECG_SEO_AUTHORITY_ROUTES.filter((r) => r.category === "authority_cluster");
    for (const cluster of clusters) {
      assert.ok(
        cluster.schemaTypes.includes("Article"),
        `Cluster route "${cluster.path}" must have Article schema`,
      );
    }
  });

  test("learner-private routes have no schema types", () => {
    const learner = ECG_SEO_AUTHORITY_ROUTES.filter((r) => r.category === "learner_module");
    for (const route of learner) {
      assert.deepEqual(
        [...route.schemaTypes],
        [],
        `Learner route "${route.path}" must not have schema types (not rendered publicly)`,
      );
    }
  });
});

// ─── 6. Entitlement separation ────────────────────────────────────────────────

describe("ECG entitlement separation — Core vs Advanced", () => {
  test("Core ECG and Advanced ECG have different entitlement keys", () => {
    assert.notEqual(
      ECG_PLATFORM_ENTITLEMENT_MAP.core_ecg.entitlementKey,
      ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.entitlementKey,
      "Core ECG and Advanced ECG must have different entitlement keys",
    );
  });

  test("Core ECG entitlement key matches CORE_ECG_PRODUCT", () => {
    assert.equal(
      ECG_PLATFORM_ENTITLEMENT_MAP.core_ecg.entitlementKey,
      CORE_ECG_PRODUCT.entitlementKey,
    );
  });

  test("Advanced ECG entitlement key matches ADVANCED_ECG_PRODUCT", () => {
    assert.equal(
      ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.entitlementKey,
      ADVANCED_ECG_PRODUCT.entitlementKey,
    );
  });

  test("Advanced ECG product has Stripe price env key", () => {
    assert.equal(ADVANCED_ECG_PRODUCT.stripeEnvKey, "STRIPE_PRICE_ADVANCED_ECG");
  });

  test("RPN is excluded from both Core and Advanced ECG", () => {
    const coreExcluded = ECG_PLATFORM_ENTITLEMENT_MAP.core_ecg.excludedTiers;
    const advancedExcluded = ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.excludedTiers;
    assert.ok(coreExcluded.includes("RPN"), "RPN must be excluded from Core ECG");
    assert.ok(advancedExcluded.includes("RPN"), "RPN must be excluded from Advanced ECG");
  });

  test("Premium gating surfaces are additive (never replace educational content)", () => {
    // Premium gating should only apply to specific interactive surfaces,
    // never to public marketing/authority pages.
    const coreSurfaces = ECG_PLATFORM_ENTITLEMENT_MAP.core_ecg.gatingSurfaces;
    const advancedSurfaces = ECG_PLATFORM_ENTITLEMENT_MAP.advanced_ecg.gatingSurfaces;

    // Gating surfaces must be named action surfaces, not page routes
    for (const surface of [...coreSurfaces, ...advancedSurfaces]) {
      assert.ok(
        !surface.startsWith("/"),
        `Gating surface "${surface}" must not be a path — it should be a named action surface`,
      );
    }
  });
});

// ─── 7. Hemodynamics placeholder architecture ─────────────────────────────────

describe("Hemodynamics expansion — reserved route and nav governance", () => {
  test("all hemodynamics reserved marketing routes start with /", () => {
    for (const path of HEMODYNAMICS_RESERVED_ROUTES.marketing) {
      assert.ok(path.startsWith("/"), `Hemodynamics marketing route "${path}" must start with /`);
    }
  });

  test("hemodynamics reserved routes do NOT conflict with existing ECG routes", () => {
    const existingPublic = new Set([...ECG_CORE_PUBLIC_ROUTES, ...ECG_ADVANCED_PUBLIC_ROUTES]);
    for (const path of [
      ...HEMODYNAMICS_RESERVED_ROUTES.marketing,
      ...HEMODYNAMICS_RESERVED_ROUTES.advanced,
    ]) {
      assert.ok(
        !existingPublic.has(path),
        `Hemodynamics reserved route "${path}" conflicts with existing ECG public route`,
      );
    }
  });

  test("hemodynamics reserved learner routes all start with /modules/", () => {
    for (const path of HEMODYNAMICS_RESERVED_ROUTES.learner) {
      assert.ok(
        path.startsWith("/modules/"),
        `Hemodynamics learner route "${path}" must start with /modules/`,
      );
    }
  });

  test("hemodynamics reserved nav entries all have status=coming_soon", () => {
    for (const entry of HEMODYNAMICS_RESERVED_NAV_ENTRIES) {
      assert.equal(
        entry.status,
        "coming_soon",
        `Hemodynamics nav entry "${entry.key}" must have status=coming_soon until content ships`,
      );
    }
  });

  test("hemodynamics reserved nav entries use hemodynamics nav groups", () => {
    const validGroups = new Set(["hemodynamics", "invasive_monitoring", "shock_states", "arterial_waveforms"]);
    for (const entry of HEMODYNAMICS_RESERVED_NAV_ENTRIES) {
      assert.ok(
        validGroups.has(entry.group),
        `Hemodynamics nav entry "${entry.key}" group "${entry.group}" must be a hemodynamics group`,
      );
    }
  });

  test("hemodynamics reserved unit IDs all start with 'hd-'", () => {
    for (const id of HEMODYNAMICS_RESERVED_UNIT_IDS) {
      assert.ok(
        id.startsWith("hd-"),
        `Hemodynamics curriculum unit ID "${id}" must use 'hd-' prefix to avoid ECG ID collision`,
      );
    }
  });

  test("hemodynamics reserved routes are NOT in sitemap eligible routes", () => {
    const eligiblePaths = new Set(ECG_SITEMAP_ELIGIBLE_ROUTES.map((r) => r.path));
    for (const path of HEMODYNAMICS_RESERVED_ROUTES.marketing) {
      assert.ok(
        !eligiblePaths.has(path),
        `Reserved hemodynamics route "${path}" must not be in ECG_SITEMAP_ELIGIBLE_ROUTES until live`,
      );
    }
  });
});

// ─── 8. Pulsus paradoxus governance ──────────────────────────────────────────

describe("Pulsus paradoxus — not a rhythm tag (cross-taxonomy governance)", () => {
  test("pulsus paradoxus taxonomy bridge documents hemodynamic classification", () => {
    assert.equal(
      PULSUS_PARADOXUS_TAXONOMY_BRIDGE.prohibitedRhythmTag,
      "Pulsus paradoxus",
    );
    assert.ok(
      PULSUS_PARADOXUS_TAXONOMY_BRIDGE.canonicalDescription.includes("HEMODYNAMIC"),
      "Taxonomy bridge must explicitly state pulsus paradoxus is a HEMODYNAMIC finding",
    );
    assert.ok(
      PULSUS_PARADOXUS_TAXONOMY_BRIDGE.canonicalDescription.includes("NOT an ECG rhythm"),
      "Taxonomy bridge must state NOT an ECG rhythm",
    );
  });

  test("pulsus paradoxus future curriculum unit uses hd- prefix", () => {
    assert.ok(
      PULSUS_PARADOXUS_TAXONOMY_BRIDGE.futureCurriculumUnit.startsWith("hd-"),
      "Future pulsus paradoxus curriculum unit must use hd- prefix (hemodynamics lane)",
    );
  });
});

// ─── 9. Canonical URLs and sitemap consistency ────────────────────────────────

describe("ECG sitemap — canonical consistency", () => {
  const TEST_ORIGIN = "https://nursenest.ca";

  test("sitemap has no duplicate URLs", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const url of urls) {
      if (seen.has(url)) duplicates.push(url);
      seen.add(url);
    }
    assert.deepEqual(duplicates, [], `Sitemap contains duplicate URLs: ${duplicates.join(", ")}`);
  });

  test("all sitemap URLs start with the expected origin", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    for (const url of urls) {
      assert.ok(
        url.startsWith(TEST_ORIGIN),
        `Sitemap URL "${url}" must start with origin "${TEST_ORIGIN}"`,
      );
    }
  });

  test("sitemap has no query strings or hash fragments", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    for (const url of urls) {
      assert.ok(!url.includes("?"), `Sitemap URL "${url}" must not contain query string`);
      assert.ok(!url.includes("#"), `Sitemap URL "${url}" must not contain hash fragment`);
    }
  });

  test("all sitemap-eligible routes have positive sitemapPriority", () => {
    for (const route of ECG_SITEMAP_ELIGIBLE_ROUTES) {
      assert.ok(
        route.sitemapPriority > 0,
        `Route "${route.path}" in ECG_SITEMAP_ELIGIBLE_ROUTES must have sitemapPriority > 0`,
      );
    }
  });
});

// ─── 10. Clinical Modules nav — hemodynamics groups present ──────────────────

describe("Clinical Modules nav — hemodynamics expansion readiness", () => {
  test("buildClinicalModulesNavLinks includes hemodynamics coming_soon items for RN", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const hemodynamicsLinks = links.filter(
      (l) => l.group === "hemodynamics" || l.group === "invasive_monitoring",
    );
    assert.ok(
      hemodynamicsLinks.length >= 2,
      `Nav must have at least 2 hemodynamics/invasive_monitoring items, got ${hemodynamicsLinks.length}`,
    );
    for (const link of hemodynamicsLinks) {
      assert.equal(link.status, "coming_soon", `Hemodynamics link "${link.key}" must be coming_soon`);
    }
  });

  test("hemodynamics nav groups are valid ClinicalModulesLinkGroup values", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const validGroups = new Set([
      "cardiology", "diagnostics", "calculations", "critical_care",
      "pharmacology", "telemetry", "hemodynamics", "invasive_monitoring",
      "shock_states", "arterial_waveforms",
    ]);
    for (const link of links) {
      assert.ok(
        validGroups.has(link.group),
        `Nav link "${link.key}" has invalid group "${link.group}"`,
      );
    }
  });

  test("ECG nav items use cardiology group and are enabled for RN", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const ecgLinks = links.filter((l) => l.key.startsWith("ecg") || l.key === "pediatric-ecg");
    assert.ok(ecgLinks.length >= 3, "Must have at least 3 ECG nav items for RN");
    for (const link of ecgLinks) {
      assert.notEqual(link.status, "locked", `ECG link "${link.key}" must not be locked for RN`);
    }
  });

  test("Advanced ECG nav item has premium status", () => {
    const links = buildClinicalModulesNavLinks(null, true);
    const advEcg = links.find((l) => l.key === "advanced-ecg");
    assert.ok(advEcg, "Advanced ECG nav item must exist");
    assert.equal(advEcg!.status, "premium", "Advanced ECG nav item must have premium status");
  });

  test("ECG links are excluded when ecgNavEnabled=false (RPN tier)", () => {
    const links = buildClinicalModulesNavLinks(null, false);
    const ecgLinks = links.filter(
      (l) =>
        l.key.includes("ecg") ||
        l.key === "pediatric-ecg" ||
        l.key === "advanced-ecg" ||
        l.key === "ecg-drills",
    );
    assert.deepEqual(
      ecgLinks.map((l) => l.key),
      [],
      "ECG links must be excluded when ecgNavEnabled=false (RPN/LVN_LPN restriction)",
    );
  });
});

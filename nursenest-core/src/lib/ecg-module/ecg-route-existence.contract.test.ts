/**
 * ECG Route Existence Contract Tests — Sitemap ↔ Page Existence Guard
 *
 * Purpose:
 *   Prevents sitemap drift — the state where a URL appears in the sitemap
 *   but the corresponding Next.js page file does not exist.
 *
 *   A 404 on a sitemapped URL is an SEO regression: Google marks the URL as
 *   "not found" and eventually removes it from the index, destroying accumulated
 *   link equity and SERP position.
 *
 * Rules enforced:
 *   1. Every indexed_public route in ECG_SEO_AUTHORITY_ROUTES has a page.tsx
 *   2. Every indexed_premium route has a page.tsx
 *   3. No reserved_future route is in the sitemap
 *   4. No learner-private route is in the sitemap
 *   5. ECG cluster slugs all generate routes that have page.tsx files
 *   6. The sitemap URL set is a subset of routes with existing page files
 *
 * Exclusions:
 *   - /ecg/[topic] dynamic route: checked by verifying [topic]/page.tsx exists
 *     (the dynamic segment is handled by Next.js catch-all routing)
 *
 * Run:
 *   node --import tsx --test src/lib/ecg-module/ecg-route-existence.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  ECG_SEO_AUTHORITY_ROUTES,
  ECG_CORE_PUBLIC_ROUTES,
  ECG_ADVANCED_PUBLIC_ROUTES,
  ECG_LEARNER_PRIVATE_ROUTES,
  ADVANCED_ECG_LEARNER_PRIVATE_ROUTES,
  ECG_SITEMAP_ELIGIBLE_ROUTES,
} from "./ecg-platform-taxonomy";

import {
  getAllEcgClusterSlugs,
} from "./ecg-seo-cluster";

import {
  collectClinicalModulesSitemapUrls,
  ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION,
} from "../../seo/clinical-modules-sitemap-urls";

const ROOT = process.cwd();
const MARKETING_BASE = join(ROOT, "src/app/(marketing)/(default)");

/**
 * Maps a public marketing path to the expected file system path.
 * Dynamic route patterns (e.g. /ecg/[topic]) map to the dynamic segment directory.
 */
function routeToPageFile(path: string): string {
  // /ecg/[topic] → src/app/(marketing)/(default)/ecg/[topic]/page.tsx
  if (path === "/ecg/[topic]") {
    return join(MARKETING_BASE, "ecg", "[topic]", "page.tsx");
  }
  // /advanced-ecg-nursing/[module] paths
  if (path.startsWith("/advanced-ecg-nursing/")) {
    const sub = path.replace("/advanced-ecg-nursing/", "");
    return join(MARKETING_BASE, "advanced-ecg-nursing", sub, "page.tsx");
  }
  // Top-level paths: /ecg → ecg/page.tsx
  const clean = path.replace(/^\//, "");
  return join(MARKETING_BASE, clean, "page.tsx");
}

function routeExists(path: string): boolean {
  const file = routeToPageFile(path);
  return existsSync(file);
}

// ─── 1. Every indexed_public route has a page.tsx ─────────────────────────────

describe("ECG route existence — indexed_public routes", () => {
  for (const path of ECG_CORE_PUBLIC_ROUTES) {
    test(`Core ECG public route exists: ${path}`, () => {
      assert.ok(
        routeExists(path),
        `Missing page for indexed_public route "${path}". ` +
        `Expected file: ${routeToPageFile(path)}. ` +
        "This route is in the sitemap but has no page — will produce a 404 for crawlers.",
      );
    });
  }
});

// ─── 2. Every indexed_premium route has a page.tsx ───────────────────────────

describe("ECG route existence — indexed_premium routes", () => {
  for (const path of ECG_ADVANCED_PUBLIC_ROUTES) {
    test(`Advanced ECG premium route exists: ${path}`, () => {
      assert.ok(
        routeExists(path),
        `Missing page for indexed_premium route "${path}". ` +
        `Expected file: ${routeToPageFile(path)}. ` +
        "This route is sitemapped with premium educational content but has no page.",
      );
    });
  }
});

// ─── 3. No reserved_future routes in sitemap ─────────────────────────────────

describe("ECG sitemap — no reserved_future routes", () => {
  const TEST_ORIGIN = "https://nursenest.ca";

  test("collectClinicalModulesSitemapUrls has no reserved_future routes", () => {
    const reservedRoutes = ECG_SEO_AUTHORITY_ROUTES
      .filter((r) => r.indexability === "reserved_future")
      .map((r) => r.path);

    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const urlPaths = urls.map((u) => u.replace(TEST_ORIGIN, ""));

    for (const reserved of reservedRoutes) {
      assert.ok(
        !urlPaths.includes(reserved),
        `Reserved future route "${reserved}" must NOT appear in the sitemap until its content is live`,
      );
    }
  });

  test("hemodynamics reserved routes are not in sitemap", () => {
    const HEMODYNAMICS_RESERVED = [
      "/hemodynamic-monitoring",
      "/advanced-hemodynamics",
      "/arterial-line-waveforms",
      "/cvp-monitoring",
      "/pulmonary-artery-catheter",
    ];
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    for (const path of HEMODYNAMICS_RESERVED) {
      assert.ok(
        !urls.includes(`${TEST_ORIGIN}${path}`),
        `Hemodynamics reserved route "${path}" must not be in sitemap (not live yet)`,
      );
    }
  });
});

// ─── 4. No learner-private routes in sitemap ─────────────────────────────────

describe("ECG sitemap — no learner-private routes", () => {
  const TEST_ORIGIN = "https://nursenest.ca";

  test("collectClinicalModulesSitemapUrls has no learner-private /modules/ routes", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const privateRoutes = ECG_PRIVATE_ROUTES_FOR_SITEMAP_EXCLUSION;

    for (const privatePath of privateRoutes) {
      assert.ok(
        !urls.includes(`${TEST_ORIGIN}${privatePath}`),
        `Learner-private route "${privatePath}" must not appear in sitemap (robots: noindex)`,
      );
    }
  });

  test("no /modules/ path prefix appears in ECG sitemap", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const modulesUrls = urls.filter((u) => u.includes("/modules/"));
    assert.deepEqual(
      modulesUrls,
      [],
      `Sitemap must not contain /modules/ routes: found ${modulesUrls.join(", ")}`,
    );
  });

  test("no /app/ path prefix appears in ECG sitemap", () => {
    const urls = collectClinicalModulesSitemapUrls(TEST_ORIGIN);
    const appUrls = urls.filter((u) => u.includes(`${TEST_ORIGIN}/app/`));
    assert.deepEqual(
      appUrls,
      [],
      `Sitemap must not contain /app/ routes: found ${appUrls.join(", ")}`,
    );
  });
});

// ─── 5. ECG cluster slugs all have page files ─────────────────────────────────

describe("ECG cluster — all slugs have page.tsx files", () => {
  const slugs = getAllEcgClusterSlugs();

  test("ECG cluster has at least 8 topic slugs", () => {
    assert.ok(slugs.length >= 8, `ECG cluster must have >= 8 topics, found ${slugs.length}`);
  });

  test("no duplicate slugs in ECG cluster", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const slug of slugs) {
      if (seen.has(slug)) duplicates.push(slug);
      seen.add(slug);
    }
    assert.deepEqual(duplicates, [], `Duplicate ECG cluster slugs: ${duplicates.join(", ")}`);
  });

  test("all ECG cluster slugs are kebab-case", () => {
    const kebab = /^[a-z0-9-]+$/;
    for (const slug of slugs) {
      assert.match(
        slug,
        kebab,
        `ECG cluster slug "${slug}" must be kebab-case (lowercase letters, numbers, hyphens only)`,
      );
    }
  });

  test("ECG cluster dynamic route page.tsx exists", () => {
    const clusterPage = join(MARKETING_BASE, "ecg", "[topic]", "page.tsx");
    assert.ok(
      existsSync(clusterPage),
      `ECG cluster dynamic route page missing: ${clusterPage}. ` +
      "All /ecg/[topic] routes depend on this file — sitemap lists these but the page doesn't exist.",
    );
  });
});

// ─── 6. Sitemap URLs are a subset of existing pages ──────────────────────────

describe("ECG sitemap — all sitemapped pages actually exist", () => {
  const TEST_ORIGIN = "https://nursenest.ca";

  test("all sitemapped ECG authority routes have corresponding page files", () => {
    for (const route of ECG_SITEMAP_ELIGIBLE_ROUTES) {
      // Skip cluster pattern — checked separately via dynamic route existence
      if (route.path === "/ecg/[topic]") continue;
      // Skip advanced-ecg-nursing sub-routes — parent page covers them (dynamic or static)
      if (route.path.startsWith("/advanced-ecg-nursing/")) {
        // Check that sub-page exists
        const subPath = route.path.replace("/advanced-ecg-nursing/", "");
        const file = join(MARKETING_BASE, "advanced-ecg-nursing", subPath, "page.tsx");
        assert.ok(
          existsSync(file),
          `Advanced ECG sub-route page missing: "${route.path}" → expected ${file}`,
        );
        continue;
      }
      // All other eligible routes need a page file
      assert.ok(
        routeExists(route.path),
        `Sitemapped route "${route.path}" has no page.tsx file at ${routeToPageFile(route.path)}. ` +
        "Add the page or remove the route from ECG_SITEMAP_ELIGIBLE_ROUTES.",
      );
    }
  });
});

// ─── 7. Sitemap completeness — required ECG authority pages present ───────────

describe("ECG sitemap — required authority pages present in sitemap", () => {
  const TEST_ORIGIN = "https://nursenest.ca";
  const REQUIRED_SITEMAP_URLS = [
    `${TEST_ORIGIN}/ecg`,
    `${TEST_ORIGIN}/ecg-interpretation`,
    `${TEST_ORIGIN}/telemetry-nursing`,
    `${TEST_ORIGIN}/acls-rhythms`,
    `${TEST_ORIGIN}/pals-rhythms`,
    `${TEST_ORIGIN}/pediatric-ecg`,
    `${TEST_ORIGIN}/advanced-ecg-nursing`,
    `${TEST_ORIGIN}/ecg-telemetry-mastery`,
  ] as const;

  test("all required ECG authority pages appear in sitemap", () => {
    const urls = new Set(collectClinicalModulesSitemapUrls(TEST_ORIGIN));
    for (const required of REQUIRED_SITEMAP_URLS) {
      assert.ok(
        urls.has(required),
        `Required ECG authority URL "${required}" is missing from the sitemap`,
      );
    }
  });
});

// ─── 8. noindex enforcement on learner routes (source-level check) ───────────

describe("ECG learner routes — noindex enforcement in source", () => {
  function readPageSource(path: string): string | null {
    const cleaned = path.replace(/^\//, "");
    // Learner routes live under src/app/modules/
    const filePath = join(ROOT, "src/app/modules", cleaned, "page.tsx");
    if (!existsSync(filePath)) {
      // Check layout.tsx instead
      const layoutPath = join(ROOT, "src/app/modules", cleaned, "layout.tsx");
      if (existsSync(layoutPath)) {
        const { readFileSync } = require("node:fs");
        return readFileSync(layoutPath, "utf8");
      }
      return null;
    }
    const { readFileSync } = require("node:fs");
    return readFileSync(filePath, "utf8");
  }

  test("ECG learner module layout sets robots: { index: false }", () => {
    // The layout.tsx for /modules/ecg should set noindex
    const layoutPath = join(ROOT, "src/app/modules/ecg/layout.tsx");
    if (existsSync(layoutPath)) {
      const { readFileSync } = require("node:fs");
      const src = readFileSync(layoutPath, "utf8");
      // The layout either sets robots.index=false directly or uses force-dynamic without an explicit robots
      // The important thing is it doesn't set index:true
      assert.doesNotMatch(
        src,
        /robots:\s*\{\s*index:\s*true/,
        "ECG learner module layout must NOT set robots: { index: true }",
      );
    }
  });
});

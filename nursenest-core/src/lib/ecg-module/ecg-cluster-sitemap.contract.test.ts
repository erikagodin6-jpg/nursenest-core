/**
 * ECG Cluster → Sitemap Cross-Validation Contract Tests
 *
 * Fails CI when any of these conditions break:
 *   1. A cluster slug in the registry is missing from the sitemap
 *   2. A sitemap ECG cluster URL has no corresponding page file (404 risk)
 *   3. Duplicate slugs exist in the combined registry
 *   4. A cluster page does not link back to /ecg-interpretation
 *   5. An ECG internal link points to /modules/* (auth-gated)
 *   6. Hub pages that should reference ECG fail to include ECG links
 *   7. ECG_PILLAR_MARKETING_PATH is /ecg-interpretation (not /advanced-ecg-nursing)
 *   8. New cluster slugs are present in generateStaticParams (not just in registry)
 *
 * Run:
 *   node --import tsx --test src/lib/ecg-module/ecg-cluster-sitemap.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  getAllEcgClusterSlugs,
} from "./ecg-seo-cluster";

import {
  getAllEcgClusterSlugsFromRegistry,
  getAdditionalEcgClusterTopic,
  validateEcgClusterRegistry,
} from "./ecg-seo-cluster-registry";

import {
  collectEcgClusterUrls,
  collectClinicalModulesSitemapUrls,
} from "../../seo/clinical-modules-sitemap-urls";

import {
  ECG_PILLAR_MARKETING_PATH,
  ECG_ADVANCED_MARKETING_PATH,
  ECG_ECOSYSTEM_SUBPAGE_PATHS,
} from "./ecg-linked-learning";

const ROOT = process.cwd();
const TEST_ORIGIN = "https://nursenest.ca";
const CLUSTER_PAGE_DIR = join(ROOT, "src/app/(marketing)/(default)/ecg/[topic]");
const MARKETING_BASE = join(ROOT, "src/app/(marketing)/(default)");

// ─── 1. Sitemap contains all registry slugs ────────────────────────────────────

describe("ECG cluster → sitemap: every registry slug appears in sitemap", () => {
  const sitemapUrls = collectEcgClusterUrls(TEST_ORIGIN);
  const sitemapSlugs = new Set(sitemapUrls.map((u) => u.split("/ecg/")[1]).filter(Boolean));

  test("collectEcgClusterUrls uses getAllEcgClusterSlugsFromRegistry (not just original 10)", () => {
    const originalSlugs = getAllEcgClusterSlugs();
    const registrySlugs = getAllEcgClusterSlugsFromRegistry();
    // Registry must be a superset of original (original is included in registry)
    for (const slug of originalSlugs) {
      assert.ok(
        registrySlugs.includes(slug),
        `Original cluster slug "${slug}" must be in getAllEcgClusterSlugsFromRegistry()`,
      );
    }
    // Registry must also include additional slugs
    assert.ok(
      registrySlugs.length > originalSlugs.length,
      `Registry (${registrySlugs.length} slugs) must be larger than original (${originalSlugs.length} slugs)`,
    );
  });

  test("sitemap includes all original ECG cluster slugs", () => {
    for (const slug of getAllEcgClusterSlugs()) {
      assert.ok(
        sitemapSlugs.has(slug),
        `Original cluster slug "${slug}" missing from sitemap URLs — ` +
        "collectEcgClusterUrls() must use getAllEcgClusterSlugsFromRegistry()",
      );
    }
  });

  test("sitemap includes all additional ECG cluster registry slugs", () => {
    const allSlugs = getAllEcgClusterSlugsFromRegistry();
    for (const slug of allSlugs) {
      assert.ok(
        sitemapSlugs.has(slug),
        `Registry slug "${slug}" is in the registry but missing from sitemap — ` +
        "collectEcgClusterUrls() must derive from getAllEcgClusterSlugsFromRegistry()",
      );
    }
  });

  test("new required cluster slugs are present in registry", () => {
    const REQUIRED_NEW_SLUGS = [
      "how-to-read-ecg-strips",
      "normal-sinus-rhythm-ecg",
      "atrial-fibrillation-ecg",
      "telemetry-interpretation-nurses",
      "heart-rate-calculation-ecg",
    ];
    const registrySlugs = new Set(getAllEcgClusterSlugsFromRegistry());
    for (const slug of REQUIRED_NEW_SLUGS) {
      assert.ok(
        registrySlugs.has(slug),
        `Required new cluster slug "${slug}" is missing from the combined registry`,
      );
    }
  });
});

// ─── 2. Sitemap URLs have corresponding page files ─────────────────────────────

describe("ECG cluster → sitemap: sitemapped URLs resolve to real pages", () => {
  test("dynamic cluster route [topic]/page.tsx exists (handles all slugs)", () => {
    const pageFile = join(CLUSTER_PAGE_DIR, "page.tsx");
    assert.ok(
      existsSync(pageFile),
      `ECG cluster dynamic page missing: ${pageFile}\n` +
      "All /ecg/[slug] URLs depend on this file — 404 for crawlers without it",
    );
  });

  test("[topic]/page.tsx generateStaticParams uses getAllEcgClusterSlugsFromRegistry", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(join(CLUSTER_PAGE_DIR, "page.tsx"), "utf-8");
    assert.match(
      src,
      /getAllEcgClusterSlugsFromRegistry/,
      "[topic]/page.tsx generateStaticParams must use getAllEcgClusterSlugsFromRegistry() — " +
      "using only getAllEcgClusterSlugs() omits registry slugs from static generation",
    );
    assert.doesNotMatch(
      src,
      /generateStaticParams[\s\S]{0,200}getAllEcgClusterSlugs\(\)[^F]/,
      "generateStaticParams must not use getAllEcgClusterSlugs() directly — use the registry version",
    );
  });

  test("cluster page resolves both original and additional topics", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(join(CLUSTER_PAGE_DIR, "page.tsx"), "utf-8");
    assert.match(
      src,
      /getAdditionalEcgClusterTopic/,
      "[topic]/page.tsx must call getAdditionalEcgClusterTopic to resolve registry-only slugs",
    );
    assert.match(
      src,
      /getEcgClusterTopic/,
      "[topic]/page.tsx must call getEcgClusterTopic to resolve original slugs",
    );
  });
});

// ─── 3. Cluster registry integrity ────────────────────────────────────────────

describe("ECG cluster registry — no duplicates, valid slugs", () => {
  test("validateEcgClusterRegistry() returns no errors", () => {
    const errors = validateEcgClusterRegistry();
    assert.deepEqual(
      errors,
      [],
      `ECG cluster registry validation errors: ${errors.join("; ")}`,
    );
  });

  test("no duplicate slugs between original and registry", () => {
    const originalSlugs = new Set(getAllEcgClusterSlugs());
    const allSlugs = getAllEcgClusterSlugsFromRegistry();
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const slug of allSlugs) {
      if (seen.has(slug)) duplicates.push(slug);
      seen.add(slug);
    }
    assert.deepEqual(
      duplicates,
      [],
      `Duplicate ECG cluster slugs found: ${duplicates.join(", ")}`,
    );
  });

  test("all cluster slugs are kebab-case", () => {
    const kebab = /^[a-z0-9-]+$/;
    for (const slug of getAllEcgClusterSlugsFromRegistry()) {
      assert.match(slug, kebab, `Cluster slug "${slug}" must be kebab-case`);
    }
  });

  test("sitemap has no ECG cluster URL duplicates", () => {
    const sitemapUrls = collectEcgClusterUrls(TEST_ORIGIN);
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const url of sitemapUrls) {
      if (seen.has(url)) duplicates.push(url);
      seen.add(url);
    }
    assert.deepEqual(duplicates, [], `Duplicate ECG sitemap URLs: ${duplicates.join(", ")}`);
  });
});

// ─── 4. Cluster pages link up to /ecg-interpretation ─────────────────────────

describe("ECG cluster page — links up to /ecg-interpretation (pillar backlink)", () => {
  test("[topic]/page.tsx breadcrumb includes /ecg-interpretation", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(join(CLUSTER_PAGE_DIR, "page.tsx"), "utf-8");
    assert.match(
      src,
      /\/ecg-interpretation/,
      "[topic]/page.tsx breadcrumb must link to /ecg-interpretation — " +
      "all cluster pages must funnel authority upward to the ECG pillar",
    );
  });

  test("[topic]/page.tsx does NOT use /advanced-ecg-nursing as breadcrumb pillar", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(join(CLUSTER_PAGE_DIR, "page.tsx"), "utf-8");
    // /advanced-ecg-nursing should not appear as the pillar breadcrumb
    const breadcrumbSection = src.match(/breadcrumbs\s*=\s*\[[\s\S]*?\];/)?.[0] ?? "";
    assert.doesNotMatch(
      breadcrumbSection,
      /advanced-ecg-nursing/,
      "ECG cluster breadcrumb must use /ecg-interpretation as the pillar, not /advanced-ecg-nursing",
    );
  });
});

// ─── 5. No ECG links pointing to /modules/* ──────────────────────────────────

describe("ECG internal links — no /modules/* in marketing/public surfaces", () => {
  test("ECG_ECOSYSTEM_SUBPAGE_PATHS has no /modules/ paths", () => {
    for (const [key, path] of Object.entries(ECG_ECOSYSTEM_SUBPAGE_PATHS)) {
      assert.ok(
        !path.startsWith("/modules/"),
        `ECG_ECOSYSTEM_SUBPAGE_PATHS["${key}"] = "${path}" must not use /modules/ — ` +
        "these paths are used in marketing contexts where auth is not guaranteed",
      );
    }
  });

  test("ECG_PILLAR_MARKETING_PATH does not use /modules/", () => {
    assert.ok(
      !ECG_PILLAR_MARKETING_PATH.startsWith("/modules/"),
      `ECG_PILLAR_MARKETING_PATH "${ECG_PILLAR_MARKETING_PATH}" must not use /modules/`,
    );
  });

  test("EcgAuthorityLinkBlock links do not include /modules/ paths", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(
      join(ROOT, "src/components/ecg-module/ecg-authority-link-block.tsx"),
      "utf-8",
    );
    const modulesLinks = src.match(/href=["']\/modules\/[^"']+["']/g) ?? [];
    assert.deepEqual(
      modulesLinks,
      [],
      `EcgAuthorityLinkBlock must not link to /modules/ paths — found: ${modulesLinks.join(", ")}`,
    );
  });
});

// ─── 6. ECG pillar path is /ecg-interpretation ────────────────────────────────

describe("ECG_PILLAR_MARKETING_PATH — /ecg-interpretation (not /advanced-ecg-nursing)", () => {
  test("ECG_PILLAR_MARKETING_PATH is /ecg-interpretation", () => {
    assert.equal(
      ECG_PILLAR_MARKETING_PATH,
      "/ecg-interpretation",
      `ECG_PILLAR_MARKETING_PATH must be "/ecg-interpretation" — ` +
      "this is the Core ECG canonical hub, always public, highest search volume. " +
      `Got: "${ECG_PILLAR_MARKETING_PATH}"`,
    );
  });

  test("ECG_ADVANCED_MARKETING_PATH is /advanced-ecg-nursing", () => {
    assert.equal(
      ECG_ADVANCED_MARKETING_PATH,
      "/advanced-ecg-nursing",
      "ECG_ADVANCED_MARKETING_PATH must be '/advanced-ecg-nursing' for Advanced ECG add-on links",
    );
  });

  test("ecg-linked-learning source does NOT assign /advanced-ecg-nursing to ECG_PILLAR_MARKETING_PATH", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(
      join(ROOT, "src/lib/ecg-module/ecg-linked-learning.ts"),
      "utf-8",
    );
    // The pillar path assignment must not use /advanced-ecg-nursing
    const pillarAssignment = src.match(/ECG_PILLAR_MARKETING_PATH\s*=\s*["']([^"']+)["']/);
    if (pillarAssignment) {
      assert.equal(
        pillarAssignment[1],
        "/ecg-interpretation",
        "ECG_PILLAR_MARKETING_PATH must be assigned '/ecg-interpretation'",
      );
    }
  });
});

// ─── 7. Sitemap cluster segment integrity ─────────────────────────────────────

describe("Sitemap cluster segment — complete and no private URLs", () => {
  test("collectClinicalModulesSitemapUrls includes the 5 new required cluster URLs", () => {
    const allUrls = new Set(collectClinicalModulesSitemapUrls(TEST_ORIGIN));
    const REQUIRED_NEW_CLUSTER_URLS = [
      `${TEST_ORIGIN}/ecg/how-to-read-ecg-strips`,
      `${TEST_ORIGIN}/ecg/normal-sinus-rhythm-ecg`,
      `${TEST_ORIGIN}/ecg/atrial-fibrillation-ecg`,
      `${TEST_ORIGIN}/ecg/telemetry-interpretation-nurses`,
      `${TEST_ORIGIN}/ecg/heart-rate-calculation-ecg`,
    ];
    for (const url of REQUIRED_NEW_CLUSTER_URLS) {
      assert.ok(
        allUrls.has(url),
        `Required new cluster URL "${url}" missing from sitemap — ` +
        "verify ecg-seo-cluster.ts has the slug and sitemap uses registry",
      );
    }
  });

  test("all ECG cluster sitemap URLs are valid (no query strings or hashes)", () => {
    const clusterUrls = collectEcgClusterUrls(TEST_ORIGIN);
    for (const url of clusterUrls) {
      assert.ok(!url.includes("?"), `Cluster URL "${url}" must not have query string`);
      assert.ok(!url.includes("#"), `Cluster URL "${url}" must not have hash fragment`);
      assert.ok(url.startsWith(TEST_ORIGIN), `Cluster URL "${url}" must start with origin`);
    }
  });

  test("ECG cluster URLs in sitemap >= 15 (original 10 + new 5+)", () => {
    const clusterUrls = collectEcgClusterUrls(TEST_ORIGIN);
    assert.ok(
      clusterUrls.length >= 15,
      `Expected >= 15 ECG cluster URLs in sitemap, got ${clusterUrls.length}. ` +
      "Verify all cluster topics are registered and sitemap uses getAllEcgClusterSlugsFromRegistry()",
    );
  });
});

// ─── 8. Lessons hub ECG block ─────────────────────────────────────────────────

describe("Learner lessons hub — ECG authority block integrated", () => {
  test("lessons/page.tsx imports EcgAuthorityLinkBlock", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(
      join(ROOT, "src/app/(app)/app/(learner)/lessons/page.tsx"),
      "utf-8",
    );
    assert.match(
      src,
      /EcgAuthorityLinkBlock/,
      "lessons/page.tsx must import and use EcgAuthorityLinkBlock — " +
      "ECG links must be discoverable from the learner lessons hub for RN/NP users",
    );
  });

  test("lessons/page.tsx ECG block is gated to RN/NP tier only", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(
      join(ROOT, "src/app/(app)/app/(learner)/lessons/page.tsx"),
      "utf-8",
    );
    // The ECG block must be inside a tier check
    const ecgBlockContext = src.match(/EcgAuthorityLinkBlock[\s\S]{0,300}/)?.[0] ?? "";
    assert.ok(
      ecgBlockContext.includes("RN") && ecgBlockContext.includes("NP"),
      "EcgAuthorityLinkBlock in lessons hub must be gated to RN/NP tier",
    );
    assert.doesNotMatch(
      ecgBlockContext.slice(0, 50),
      /^EcgAuthorityLinkBlock/,
      "EcgAuthorityLinkBlock must be inside a conditional (not always rendered)",
    );
  });

  test("EcgAuthorityLinkBlock component has no /modules/ links", () => {
    const { readFileSync } = require("node:fs");
    const src = readFileSync(
      join(ROOT, "src/components/ecg-module/ecg-authority-link-block.tsx"),
      "utf-8",
    );
    assert.doesNotMatch(
      src,
      /href=["']\/modules\//,
      "EcgAuthorityLinkBlock must not link to /modules/ — marketing-safe public URLs only",
    );
  });
});

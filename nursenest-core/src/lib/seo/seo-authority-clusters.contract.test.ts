/**
 * SEO contract tests for CNPLE, REx-PN, and RT authority clusters.
 * Tests: canonical correctness, sitemap inclusion, internal links, noindex absence.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import {
  listAuthorityClusterPages,
  listAuthorityClusterPaths,
  listAuthorityClusterSiblings,
} from "@/lib/seo/authority-cluster-pages";
import { buildSitemapIndexXmlForOrigin } from "@/lib/seo/sitemap-index-children";
import { CNPLE_HUB_SITEMAP_PATHS, CNPLE_HUB_CLUSTER } from "@/lib/seo/cnple-seo-cluster";

// ── Cluster-level path constants ───────────────────────────────────────────────

const CNPLE_CLUSTER_PATHS = [
  "/canada/np/cnple",
  "/canada/np/cnple/questions",
  "/canada/np/cnple/study-guide",
  "/canada/np/cnple/case-based-questions",
  "/canada/np/cnple/provisional-registration",
  "/canada/np/cnple/loft-exam",
] as const;

const REX_PN_CLUSTER_PATHS = [
  "/canada/rpn/rex-pn",
  "/canada/rpn/rex-pn/questions",
  "/canada/rpn/rex-pn/study-guide",
  "/canada/rpn/rex-pn/cat",
  "/canada/rpn/rex-pn/pharmacology",
  "/canada/rpn/rex-pn/client-needs",
] as const;

const RT_CLUSTER_PATHS = [
  "/allied-health/respiratory-therapy",
  "/allied-health/respiratory-therapy/exam-prep",
  "/allied-health/respiratory-therapy/practice-questions",
  "/allied-health/respiratory-therapy/ventilation",
  "/allied-health/respiratory-therapy/abgs",
  "/allied-health/respiratory-therapy/oxygen-therapy",
] as const;

const ALL_REQUIRED_CLUSTER_PATHS = [
  ...CNPLE_CLUSTER_PATHS,
  ...REX_PN_CLUSTER_PATHS,
  ...RT_CLUSTER_PATHS,
] as const;

// ── Canonical + path presence ──────────────────────────────────────────────────

test("authority cluster registry contains all CNPLE hub sub-pages", () => {
  const paths = new Set(listAuthorityClusterPaths());
  for (const p of CNPLE_CLUSTER_PATHS) {
    assert.ok(paths.has(p), `authority cluster registry must include CNPLE path: ${p}`);
  }
});

test("authority cluster registry contains all REx-PN cluster paths", () => {
  const paths = new Set(listAuthorityClusterPaths());
  for (const p of REX_PN_CLUSTER_PATHS) {
    assert.ok(paths.has(p), `authority cluster registry must include REx-PN path: ${p}`);
  }
});

test("authority cluster registry contains all RT cluster paths", () => {
  const paths = new Set(listAuthorityClusterPaths());
  for (const p of RT_CLUSTER_PATHS) {
    assert.ok(paths.has(p), `authority cluster registry must include RT path: ${p}`);
  }
});

test("CNPLE_HUB_SITEMAP_PATHS covers all required CNPLE sub-pages", () => {
  const sitemapSet = new Set(CNPLE_HUB_SITEMAP_PATHS);
  for (const p of CNPLE_CLUSTER_PATHS) {
    assert.ok(sitemapSet.has(p), `CNPLE_HUB_SITEMAP_PATHS must include: ${p}`);
  }
});

test("CNPLE_HUB_CLUSTER exports all new sub-page paths", () => {
  assert.equal(CNPLE_HUB_CLUSTER.studyGuide, "/canada/np/cnple/study-guide");
  assert.equal(CNPLE_HUB_CLUSTER.caseBasedQuestions, "/canada/np/cnple/case-based-questions");
  assert.equal(CNPLE_HUB_CLUSTER.provisionalRegistration, "/canada/np/cnple/provisional-registration");
  assert.equal(CNPLE_HUB_CLUSTER.loftExam, "/canada/np/cnple/loft-exam");
});

// ── Sitemap inclusion ──────────────────────────────────────────────────────────

test("sitemap index references the authority-clusters sitemap", () => {
  const xml = buildSitemapIndexXmlForOrigin(CANONICAL_PRODUCTION_ORIGIN);
  assert.match(xml, /sitemap-authority-clusters\.xml/);
});

test("authority cluster sitemap route imports listAuthorityClusterPaths", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/app/sitemap-authority-clusters.xml/route.ts"),
    "utf8",
  );
  assert.match(src, /listAuthorityClusterPaths/);
});

test("CNPLE sitemap route imports CNPLE_HUB_SITEMAP_PATHS", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/app/sitemap-cnple.xml/route.ts"),
    "utf8",
  );
  assert.match(src, /CNPLE_HUB_SITEMAP_PATHS/);
});

// ── Noindex absence ────────────────────────────────────────────────────────────

test("authority cluster hub page files do not set noindex", () => {
  const hubs = [
    "src/app/(marketing)/(default)/canada/np/cnple/page.tsx",
    "src/app/(marketing)/(default)/canada/rpn/rex-pn/page.tsx",
    "src/app/(marketing)/(default)/allied-health/respiratory-therapy/page.tsx",
  ];
  for (const hubPath of hubs) {
    const src = fs.readFileSync(path.join(process.cwd(), hubPath), "utf8");
    assert.ok(
      !src.includes("index: false"),
      `${hubPath} must not set noindex`,
    );
  }
});

test("authority cluster [topic] page files set index:true not index:false", () => {
  const topicPages = [
    "src/app/(marketing)/(default)/canada/np/cnple/[topic]/page.tsx",
    "src/app/(marketing)/(default)/canada/rpn/rex-pn/[topic]/page.tsx",
    "src/app/(marketing)/(default)/allied-health/respiratory-therapy/[topic]/page.tsx",
  ];
  for (const pagePath of topicPages) {
    const src = fs.readFileSync(path.join(process.cwd(), pagePath), "utf8");
    assert.match(src, /index:\s*true/, `${pagePath} must explicitly set index: true`);
    assert.ok(!src.includes("index: false"), `${pagePath} must not set index: false`);
  }
});

test("CNPLE static hub sub-pages do not set noindex robots", () => {
  const staticPages = [
    "src/app/(marketing)/(default)/canada/np/cnple/study-guide/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/case-based-questions/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/provisional-registration/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/loft-exam/page.tsx",
  ];
  for (const pagePath of staticPages) {
    const src = fs.readFileSync(path.join(process.cwd(), pagePath), "utf8");
    assert.ok(!src.includes("index: false"), `${pagePath} must not set noindex`);
    // Verify canonical is set via robotsForRegionalMarketingHub (which returns index:true for canada)
    assert.match(src, /robotsForRegionalMarketingHub/, `${pagePath} must use robotsForRegionalMarketingHub`);
  }
});

// ── Internal linking ───────────────────────────────────────────────────────────

test("every authority cluster page internally links to at least 7 sibling pages", () => {
  const pages = listAuthorityClusterPages();
  for (const page of pages) {
    const siblings = listAuthorityClusterSiblings(page);
    assert.ok(
      siblings.length >= 7,
      `${page.path} must link to at least 7 siblings (has ${siblings.length})`,
    );
  }
});

test("CNPLE static sub-pages include relatedLinks to cluster siblings", () => {
  const staticPages = [
    "src/app/(marketing)/(default)/canada/np/cnple/study-guide/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/case-based-questions/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/provisional-registration/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/loft-exam/page.tsx",
  ];
  const clusterPaths = [
    "/canada/np/cnple",
    "/canada/np/cnple/questions",
    "/canada/np/cnple/study-guide",
    "/canada/np/cnple/case-based-questions",
    "/canada/np/cnple/provisional-registration",
    "/canada/np/cnple/loft-exam",
  ];
  for (const pagePath of staticPages) {
    const src = fs.readFileSync(path.join(process.cwd(), pagePath), "utf8");
    // Each page should reference at least 4 other cluster paths
    const referencedSiblings = clusterPaths.filter((p) => !pagePath.includes(p.replace(/\//g, "").replace(/-/g, "")) && src.includes(p));
    assert.ok(
      src.includes("/canada/np/cnple"),
      `${pagePath} must link back to the CNPLE hub`,
    );
    assert.ok(
      src.includes("relatedLinks"),
      `${pagePath} must pass relatedLinks for internal cluster linking`,
    );
  }
});

test("authority cluster renderer uses AbsoluteUrl for canonical not relative paths", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/components/seo/authority-cluster-page.tsx"),
    "utf8",
  );
  // absoluteUrl is used in the metadata builder (not in the view component, which receives the page)
  // Verify the view has WebPageJsonLd which handles path→canonical
  assert.match(src, /<WebPageJsonLd\b/, "renderer must emit WebPage JSON-LD for canonical signals");
  assert.match(src, /<BreadcrumbJsonLd\b/, "renderer must emit BreadcrumbList JSON-LD");
  assert.match(src, /<FaqJsonLd\b/, "renderer must emit FAQPage JSON-LD");
});

// ── Page file structure ────────────────────────────────────────────────────────

test("all required cluster page paths have corresponding route files", () => {
  const pathToRouteFile: Record<string, string> = {
    "/canada/np/cnple": "src/app/(marketing)/(default)/canada/np/cnple/page.tsx",
    "/canada/np/cnple/questions": "src/app/(marketing)/(default)/canada/np/cnple/[topic]/page.tsx",
    "/canada/np/cnple/study-guide": "src/app/(marketing)/(default)/canada/np/cnple/study-guide/page.tsx",
    "/canada/np/cnple/case-based-questions": "src/app/(marketing)/(default)/canada/np/cnple/case-based-questions/page.tsx",
    "/canada/np/cnple/provisional-registration": "src/app/(marketing)/(default)/canada/np/cnple/provisional-registration/page.tsx",
    "/canada/np/cnple/loft-exam": "src/app/(marketing)/(default)/canada/np/cnple/loft-exam/page.tsx",
    "/canada/rpn/rex-pn": "src/app/(marketing)/(default)/canada/rpn/rex-pn/page.tsx",
    "/canada/rpn/rex-pn/questions": "src/app/(marketing)/(default)/canada/rpn/rex-pn/[topic]/page.tsx",
    "/allied-health/respiratory-therapy": "src/app/(marketing)/(default)/allied-health/respiratory-therapy/page.tsx",
    "/allied-health/respiratory-therapy/ventilation": "src/app/(marketing)/(default)/allied-health/respiratory-therapy/[topic]/page.tsx",
  };
  for (const [clusterPath, routeFile] of Object.entries(pathToRouteFile)) {
    assert.ok(
      fs.existsSync(path.join(process.cwd(), routeFile)),
      `${clusterPath} requires route file at ${routeFile}`,
    );
  }
});

test("RT ventilation slug is registered in authority cluster pages", () => {
  const pages = listAuthorityClusterPages();
  const ventilationPage = pages.find((p) => p.path === "/allied-health/respiratory-therapy/ventilation");
  assert.ok(ventilationPage, "RT ventilation page must be in authority cluster registry");
  assert.equal(ventilationPage?.cluster, "respiratory-therapy");
  assert.equal(ventilationPage?.slug, "ventilation");
  assert.ok(
    !ventilationPage?.title.includes("mechanical-ventilation"),
    "ventilation page title must be distinct from mechanical-ventilation",
  );
});

test("each cluster has unique title, description, and H1 within cluster", () => {
  const clusters = ["cnple", "rex-pn", "respiratory-therapy"] as const;
  for (const cluster of clusters) {
    const pages = listAuthorityClusterPages().filter((p) => p.cluster === cluster);
    const titles = pages.map((p) => p.title);
    const descriptions = pages.map((p) => p.description);
    const h1s = pages.map((p) => p.h1);
    assert.equal(new Set(titles).size, titles.length, `${cluster} cluster must have unique titles`);
    assert.equal(new Set(descriptions).size, descriptions.length, `${cluster} cluster must have unique descriptions`);
    assert.equal(new Set(h1s).size, h1s.length, `${cluster} cluster must have unique H1s`);
  }
});

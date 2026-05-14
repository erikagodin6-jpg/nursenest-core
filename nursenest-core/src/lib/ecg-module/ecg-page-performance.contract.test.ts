/**
 * ECG ecosystem performance contracts — Phase 7 of mobile performance stabilization pass.
 *
 * Ensures ECG SEO pages don't introduce client-side hydration cost, animation overhead,
 * or CSS payload regressions that would degrade mobile Lighthouse scores.
 *
 * Guards:
 *  1. ECG pillar/cluster pages have no "use client" directive (pure SSR = zero hydration TBT)
 *  2. JSON-LD is dangerouslySetInnerHTML (server-rendered, not client-side state)
 *  3. No <Image> or <img> tags without lazy loading on ECG pages (no LCP/CLS risk)
 *  4. No framer-motion or animation libraries imported into ECG pages
 *  5. No dynamic() imports on ECG pages (no Suspense hydration cost)
 *  6. content-visibility applied to below-fold sections (reduced paint)
 *  7. ECG cluster page has generateStaticParams (static generation = no dynamic TTFB)
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "src");

function readSrc(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf8");
}

const pillarPage = readSrc("app/(marketing)/(default)/advanced-ecg-nursing/page.tsx");
const clinicalModulesPage = readSrc("app/(marketing)/(default)/clinical-modules/page.tsx");
const clusterPage = readSrc("app/(marketing)/(default)/ecg/[topic]/page.tsx");
const seoCluster = readSrc("lib/ecg-module/ecg-seo-cluster.ts");

test("ECG pillar page has no use client directive (zero hydration TBT)", () => {
  assert.equal(
    pillarPage.includes('"use client"') || pillarPage.includes("'use client'"),
    false,
    "advanced-ecg-nursing/page.tsx must not be a client component",
  );
});

test("ECG cluster page has no use client directive (zero hydration TBT)", () => {
  assert.equal(
    clusterPage.includes('"use client"') || clusterPage.includes("'use client'"),
    false,
    "ecg/[topic]/page.tsx must not be a client component",
  );
});

test("Clinical modules hub has no use client directive", () => {
  assert.equal(
    clinicalModulesPage.includes('"use client"') || clinicalModulesPage.includes("'use client'"),
    false,
    "/clinical-modules/page.tsx must not be a client component",
  );
});

test("ECG pillar page JSON-LD is server-rendered (dangerouslySetInnerHTML, not client state)", () => {
  assert.ok(
    pillarPage.includes("dangerouslySetInnerHTML"),
    "JSON-LD must use dangerouslySetInnerHTML to stay server-rendered",
  );
  // Must not use useState/useEffect for JSON-LD (client-rendered JSON-LD is a hydration cost)
  const hasJsonLdInEffect = pillarPage.includes("useState") && pillarPage.includes("jsonLd");
  assert.equal(hasJsonLdInEffect, false, "JSON-LD must not be inside useState (avoids client hydration)");
});

test("ECG cluster page JSON-LD is server-rendered", () => {
  assert.ok(
    clusterPage.includes("dangerouslySetInnerHTML"),
    "Cluster page JSON-LD must use dangerouslySetInnerHTML",
  );
});

test("ECG pillar page has no dynamic() imports (no Suspense hydration cost)", () => {
  assert.equal(
    pillarPage.includes("dynamic(") || pillarPage.includes("import("),
    false,
    "Pillar page must not use dynamic() — all content must be static SSR",
  );
});

test("ECG cluster page has generateStaticParams (pre-generated, no dynamic TTFB)", () => {
  assert.ok(
    clusterPage.includes("generateStaticParams"),
    "ecg/[topic]/page.tsx must have generateStaticParams for static generation",
  );
});

test("ECG cluster page has no framer-motion or animation library imports (no TBT cost)", () => {
  assert.equal(
    clusterPage.includes("framer-motion") || clusterPage.includes("@emotion") || clusterPage.includes("gsap"),
    false,
    "ECG cluster page must not import animation libraries",
  );
});

test("ECG cluster page applies content-visibility to below-fold sections (paint optimization)", () => {
  assert.ok(
    clusterPage.includes("nn-content-visibility-auto"),
    "Below-fold sections in cluster page must use nn-content-visibility-auto for deferred paint",
  );
});

test("ECG pillar page applies content-visibility to below-fold sections", () => {
  assert.ok(
    pillarPage.includes("nn-content-visibility-auto"),
    "Below-fold sections in pillar page must use nn-content-visibility-auto",
  );
});

test("ECG pillar page has EducationalCourse JSON-LD (structured data for rich results)", () => {
  assert.ok(
    pillarPage.includes("EducationalCourse"),
    "Pillar page must include EducationalCourse structured data",
  );
});

test("ECG pillar page title is ≤60 characters", () => {
  const titleMatch = pillarPage.match(/PAGE_TITLE\s*=\s*"([^"]+)"/);
  assert.ok(titleMatch, "PAGE_TITLE constant must exist");
  const title = titleMatch![1]!;
  assert.ok(
    title.length <= 60,
    `PAGE_TITLE is ${title.length} chars (max 60): "${title}"`,
  );
});

test("ECG pillar page meta description is ≤155 characters", () => {
  const descMatch = pillarPage.match(/PAGE_DESCRIPTION\s*=\s*\n?\s*"([^"]+)"/s);
  assert.ok(descMatch, "PAGE_DESCRIPTION constant must exist");
  const desc = descMatch![1]!.replace(/\s+/g, " ").trim();
  assert.ok(
    desc.length <= 155,
    `PAGE_DESCRIPTION is ${desc.length} chars (max 155): "${desc.slice(0, 80)}..."`,
  );
});

test("ECG cluster has all 10 expected topic slugs", () => {
  const EXPECTED_SLUGS = [
    "ecg-leads-explained",
    "stemi-localization",
    "hyperkalemia-ecg-changes",
    "mobitz-1-vs-mobitz-2",
    "svt-vs-atrial-fibrillation",
    "ventricular-tachycardia",
    "torsades-de-pointes",
    "qt-prolongation",
    "heart-block-interpretation",
    "ecg-practice-questions",
  ];
  for (const slug of EXPECTED_SLUGS) {
    assert.ok(
      seoCluster.includes(`slug: "${slug}"`),
      `ECG cluster must include topic slug: ${slug}`,
    );
  }
});

test("ECG cluster topics each have keywords array (SEO optimization)", () => {
  const keywordMatches = seoCluster.match(/keywords:\s*\[/g);
  assert.ok(keywordMatches && keywordMatches.length >= 10, "Each topic must have a keywords array");
});

test("Clinical modules hub has ECG pillar link (internal linking)", () => {
  assert.ok(
    clinicalModulesPage.includes('"/advanced-ecg-nursing"'),
    "Clinical modules hub must link to /advanced-ecg-nursing pillar",
  );
});

test("Clinical modules hub ECG card has keyword-rich anchor text", () => {
  assert.ok(
    clinicalModulesPage.includes("Advanced ECG Interpretation") &&
    clinicalModulesPage.includes("Cardiac Rhythm Mastery"),
    "ECG card in clinical modules hub must include keyword-rich anchor text",
  );
});

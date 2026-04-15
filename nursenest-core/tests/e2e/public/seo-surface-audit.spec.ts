/**
 * Public marketing SEO surface audit: HTTP 200, title/description, canonical, hreflang,
 * robots, headings, internal links, breadcrumbs; flags thin content and duplicate metadata fingerprints.
 *
 * Run: `PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/e2e/public/seo-surface-audit.spec.ts --project=chromium`
 *
 * Output: `test-results/seo-audit/seo-surface-audit-report.{json,md}`
 */
import { test, type APIResponse } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  buildAbsolutePath,
  captureSeoScreenshot,
  extractHeadSignals,
  isGenericTitle,
  writeSeoAuditReport,
  type HeadSignals,
  type SeoCheckKey,
  type SeoRouteConfig,
  type SeoRouteResult,
} from "../helpers/seo-surface-audit";

const base = getE2eBaseURL();

/** Curated major public routes (English-default marketing + auth). */
const ROUTES: SeoRouteConfig[] = [
  { path: "/", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 4 },
  { path: "/pricing", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 3 },
  { path: "/faq", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 3 },
  { path: "/blog", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/pre-nursing", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/question-bank", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/lessons", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/for-institutions", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/flashcards", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/practice-exams", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 3, expectBreadcrumb: false, minInternalLinks: 2 },
  /** Hub root `…/[examCode]/page.tsx` — no visible `BreadcrumbTrail` (child routes add it). */
  { path: "/us/rn/nclex-rn", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 2, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/canada/rn/nclex-rn", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 2, expectBreadcrumb: false, minInternalLinks: 2 },
  { path: "/allied-health", mustBeIndexable: true, expectCanonical: true, minAlternateLinks: 2, expectBreadcrumb: true, minInternalLinks: 2 },
  { path: "/login", mustBeIndexable: false, expectCanonical: true, minAlternateLinks: 0, expectBreadcrumb: false, minInternalLinks: 1 },
  { path: "/signup", mustBeIndexable: false, expectCanonical: true, minAlternateLinks: 0, expectBreadcrumb: false, minInternalLinks: 1 },
  { path: "/forgot-password", mustBeIndexable: false, expectCanonical: true, minAlternateLinks: 0, expectBreadcrumb: false, minInternalLinks: 1 },
];

const results: SeoRouteResult[] = [];

function emptyChecks(): Record<SeoCheckKey, boolean> {
  return {
    http_200: false,
    title_present: false,
    title_not_generic: false,
    meta_description: false,
    canonical: false,
    hreflang_alternates: false,
    robots_indexability: false,
    heading_h1_reasonable: false,
    internal_links: false,
    breadcrumb_when_expected: false,
  };
}

function canonicalMatchesSite(canonical: string | null, cfg: SeoRouteConfig): boolean {
  if (!cfg.expectCanonical) return true;
  if (!canonical || !/^https?:\/\//i.test(canonical)) return false;
  try {
    const u = new URL(canonical);
    const b = new URL(base);
    return u.origin === b.origin;
  } catch {
    return false;
  }
}

function robotsOk(robots: string | null, cfg: SeoRouteConfig): boolean {
  const r = (robots ?? "").toLowerCase();
  if (cfg.mustBeIndexable) {
    return !r.includes("noindex");
  }
  return r.includes("noindex");
}

function h1Reasonable(h: HeadSignals): boolean {
  return h.h1Count >= 1 && h.h1Count <= 5;
}

function fingerprint(h: HeadSignals): string {
  const t = h.title.trim().toLowerCase().replace(/\s+/g, " ");
  const d = (h.metaDescription ?? "").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 96);
  return `${t}||${d}`;
}

function applyDuplicateFlags(rows: SeoRouteResult[]): void {
  const map = new Map<string, string[]>();
  for (const r of rows) {
    if (!r.head?.title.trim()) continue;
    const fp = fingerprint(r.head);
    if (fp.length < 16) continue;
    const list = map.get(fp) ?? [];
    list.push(r.route);
    map.set(fp, list);
  }
  for (const [, paths] of map) {
    const uniq = [...new Set(paths)].sort();
    if (uniq.length < 2) continue;
    const label = `DUPLICATE_META_FINGERPRINT:${uniq.join(" ↔ ")}`;
    for (const r of rows) {
      if (uniq.includes(r.route)) r.flags.push(label);
    }
  }
}

async function measureMainAndLinks(page: import("@playwright/test").Page): Promise<{ mainLen: number; internal: number }> {
  const main = page.locator("main.nn-marketing-x").first();
  const hasNn = await main.isVisible().catch(() => false);
  const scope = hasNn ? main : page.locator("main").first();
  const mainText = await scope.innerText().catch(() => "");
  const internal = await scope.locator('a[href^="/"]').count().catch(() => 0);
  const footerLinks = await page.locator('footer a[href^="/"]').count().catch(() => 0);
  const totalInternal = internal + Math.min(footerLinks, 8);
  return { mainLen: mainText.trim().length, internal: totalInternal };
}

test.describe("SEO surface audit", () => {
  /** Avoid flaky timeouts on cold CDN / first navigation vs default 180s. */
  test.describe.configure({ mode: "serial", timeout: 240_000 });

  test.afterAll(async () => {
    applyDuplicateFlags(results);
    await writeSeoAuditReport(results, base);
  });

  for (const cfg of ROUTES) {
    test(`route ${cfg.path}`, async ({ page }) => {
      const url = buildAbsolutePath(cfg.path, base);
      const checks = emptyChecks();
      const flags: string[] = [];
      let httpStatus: number | null = null;
      let head: HeadSignals | null = null;
      let mainTextLength = 0;
      let internalLinkCount = 0;
      let screenshotPath: string | undefined;
      let response: APIResponse | null = null;

      try {
        response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
        httpStatus = response?.status() ?? null;
        checks.http_200 = httpStatus === 200;

        await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });
        head = await extractHeadSignals(page);
        const m = await measureMainAndLinks(page);
        mainTextLength = m.mainLen;
        internalLinkCount = m.internal;

        checks.title_present = head.title.trim().length > 0;
        checks.title_not_generic = !isGenericTitle(head.title);
        checks.meta_description = Boolean(head.metaDescription && head.metaDescription.trim().length >= 20);
        checks.canonical = canonicalMatchesSite(head.canonical, cfg);
        checks.hreflang_alternates =
          cfg.minAlternateLinks === 0 ? true : head.alternates.length >= cfg.minAlternateLinks;
        checks.robots_indexability = robotsOk(head.robots, cfg);
        checks.heading_h1_reasonable = h1Reasonable(head);
        checks.internal_links = internalLinkCount >= cfg.minInternalLinks;
        const bc = page.locator('nav[aria-label="Breadcrumb"]');
        checks.breadcrumb_when_expected = !cfg.expectBreadcrumb || (await bc.count()) > 0;

        if (cfg.mustBeIndexable && mainTextLength < 350) {
          flags.push("THIN_OR_EMPTY_MAIN");
        }
        if (cfg.mustBeIndexable && !checks.meta_description) {
          flags.push("MISSING_OR_SHORT_META_DESCRIPTION");
        }

        const anyFail = Object.values(checks).some((v) => !v);
        const visualIssue =
          !checks.http_200 ||
          flags.includes("THIN_OR_EMPTY_MAIN") ||
          (cfg.mustBeIndexable && (!checks.title_not_generic || !checks.meta_description));

        if (anyFail || visualIssue) {
          screenshotPath = await captureSeoScreenshot(page, cfg.path);
        }
      } catch (e) {
        flags.push(`NAVIGATION_ERROR: ${e instanceof Error ? e.message : String(e)}`);
        screenshotPath = await captureSeoScreenshot(page, cfg.path).catch(() => undefined);
      }

      results.push({
        route: cfg.path,
        finalUrl: page.url(),
        httpStatus,
        checks,
        flags,
        head,
        mainTextLength,
        internalLinkCount,
        screenshotPath,
      });
    });
  }
});

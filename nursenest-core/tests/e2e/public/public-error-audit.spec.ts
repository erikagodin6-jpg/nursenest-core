/**
 * Playwright error audit — console, page errors, failed requests, HTTP 4xx/5xx, hydration, assets, images.
 *
 * Run: `PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/e2e/public/public-error-audit.spec.ts --project=chromium`
 *
 * Output: `test-results/public-error-audit/public-error-audit-report.{json,md}`
 */
import { test, type Page } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  attachPublicErrorAudit,
  writePublicErrorAuditReport,
  type PublicErrorAuditRow,
} from "../helpers/public-error-audit";

const base = getE2eBaseURL();
const origin = new URL(base).origin;

/** Stable lesson detail URLs used elsewhere in e2e typography / flows smoke. */
const SAMPLE_LESSON_PATHS = [
  "/us/rn/nclex-rn/lessons/respiratory-assessment-ngn",
  "/us/lpn/nclex-pn/lessons/lpn-scope-delegation-priority",
  "/canada/rn/nclex-rn/lessons/fluid-balance-acute-care",
] as const;

/** Representative country / expansion marketing landings */
const COUNTRY_LANDING_PATHS = [
  "/exams/philippines",
  "/exams/uk",
  "/exams/australia",
  "/exams/middle-east",
] as const;

async function dismissScrims(page: Page) {
  for (let i = 0; i < 5; i++) await page.keyboard.press("Escape");
}

async function gotoWithAudit(
  page: Page,
  audit: ReturnType<typeof attachPublicErrorAudit>,
  fullUrl: string,
  opts?: { timeout?: number },
) {
  const timeout = opts?.timeout ?? 240_000;
  audit.beginRoute(fullUrl);
  try {
    /** `load` can hang on third-party beacons; `domcontentloaded` matches other marketing e2e smoke. */
    const r = await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout });
    audit.setRouteLabel(page.url());
    if (!r?.ok()) {
      audit.addEntry({
        route: page.url(),
        errorType: "http_4xx",
        message: `Document navigation HTTP ${r?.status() ?? "?"} for ${fullUrl}`,
        severity: "high",
        detailUrl: fullUrl,
        httpStatus: r?.status() ?? undefined,
        resourceType: "document",
      });
    }
  } catch (e) {
    audit.addEntry({
      route: fullUrl,
      errorType: "request_failed",
      message: `Navigation failed: ${e instanceof Error ? e.message : String(e)}`,
      severity: "critical",
      detailUrl: fullUrl,
    });
  }
  await page.locator("body").waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
  await dismissScrims(page);
  /** Let late requests + React settle */
  await page.waitForTimeout(800);
}

test.describe.configure({ mode: "serial", timeout: 900_000 });

test("public error audit — main routes", async ({ page }) => {
  test.setTimeout(900_000);
  const audit = attachPublicErrorAudit(page, { origin });
  const allRows: PublicErrorAuditRow[] = [];

  const flush = () => {
    allRows.push(...audit.getEntries());
    audit.clearEntries();
  };

  try {
    const staticPaths: string[] = [
      "/",
      "/pricing",
      "/login",
      "/signup",
      "/lessons",
      "/faq",
      "/flashcards",
      "/practice-exams",
      "/pre-nursing",
      "/question-bank",
      "/for-institutions",
      ...COUNTRY_LANDING_PATHS,
    ];

    for (const p of staticPaths) {
      const fullUrl = new URL(p, base).href;
      await gotoWithAudit(page, audit, fullUrl);
      flush();
    }

    for (const cfg of LESSON_FLOW_PATHWAY_QA) {
      await page.context().addCookies([
        { name: MARKETING_REGION_COOKIE, value: cfg.marketingRegionCookie, url: base },
      ]);
      const hubUrl = new URL(cfg.hubPath, base).href;
      await gotoWithAudit(page, audit, hubUrl);
      flush();

      const lessonsHubUrl = new URL(cfg.lessonsPath, base).href;
      await gotoWithAudit(page, audit, lessonsHubUrl);
      flush();
    }

    for (const p of SAMPLE_LESSON_PATHS) {
      const cfg = LESSON_FLOW_PATHWAY_QA.find(
        (c) => p.startsWith(c.hubPath) || p.startsWith(c.marketingPathPrefix),
      );
      if (cfg) {
        await page.context().addCookies([
          { name: MARKETING_REGION_COOKIE, value: cfg.marketingRegionCookie, url: base },
        ]);
      }
      const fullUrl = new URL(p, base).href;
      await gotoWithAudit(page, audit, fullUrl);
      flush();
    }

    /** Blog index → first post (if present) */
    const blogIndex = new URL("/blog", base).href;
    audit.beginRoute(blogIndex);
    await page.goto(blogIndex, { waitUntil: "domcontentloaded", timeout: 120_000 });
    audit.setRouteLabel(page.url());
    await dismissScrims(page);
    await page.waitForTimeout(600);
    flush();

    const firstPostPath = await page.evaluate(() => {
      const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="/blog/"]')];
      for (const a of links) {
        const u = a.getAttribute("href") || "";
        if (u === "/blog" || u.startsWith("/blog/tag") || u.startsWith("/blog/category")) continue;
        if (/^\/blog\/[^/]+\/?$/.test(u)) return u;
      }
      return null;
    });
    if (firstPostPath) {
      const postUrl = new URL(firstPostPath, base).href;
      await gotoWithAudit(page, audit, postUrl);
      flush();
    }
  } finally {
    audit.dispose();
    await writePublicErrorAuditReport(allRows, base);
  }

  // eslint-disable-next-line no-console
  console.log(`[public-error-audit] recorded ${allRows.length} findings → test-results/public-error-audit/`);
});

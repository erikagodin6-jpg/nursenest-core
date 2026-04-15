/**
 * Lesson & content stability: hubs, filtered libraries, lesson detail, search, section nav, CTAs, links.
 *
 * Outputs: test-results/lesson-content-stability/lesson-content-stability-report.{json,md}
 *
 * Run: `npx playwright test tests/e2e/lessons/lesson-content-stability.spec.ts --project=chromium`
 *
 * Optional: `E2E_LESSON_STABILITY_MAX=4` (lessons per pathway, default 3)
 */
import { expect, test } from "@playwright/test";
import { setGlobalRegionCookie } from "../helpers/country-selector";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  captureStabilityShot,
  checkInternalLinksSample,
  collectLessonDetailPathsFromHub,
  findPlaceholderHits,
  writeLessonStabilityReports,
  type StabilityFinding,
} from "../helpers/lesson-content-stability";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";

const baseURL = getE2eBaseURL();
const origin = new URL(baseURL).origin;

const MAX_LESSONS_PER_PATHWAY = Math.max(1, Math.min(12, Number(process.env.E2E_LESSON_STABILITY_MAX ?? "3") || 3));

/** Force navigation to the configured dev/prod base (ignore absolute www links in markup). */
function urlOnBase(hrefOrPath: string): string {
  try {
    const u = hrefOrPath.startsWith("http") ? new URL(hrefOrPath) : new URL(hrefOrPath, baseURL);
    return new URL(u.pathname + u.search + u.hash, baseURL).href;
  } catch {
    return new URL(hrefOrPath, baseURL).href;
  }
}

test.use({ trace: "off" });
test.describe.configure({ mode: "serial" });

test("lesson content stability (hubs, lessons, search, CTAs)", async ({ page, context }, testInfo) => {
  test.setTimeout(900_000);

  await context.addInitScript(() => {
    try {
      localStorage.removeItem("nursenest-region");
    } catch {
      /* ignore */
    }
  });

  const workingRoutes: string[] = [];
  const findings: StabilityFinding[] = [];
  /** Duplicate titles within the same pathway only (not US vs CA). */
  const titleByPathway = new Map<string, Map<string, string[]>>();

  const record = (f: StabilityFinding) => {
    findings.push(f);
  };

  await page.setViewportSize({ width: 1280, height: 900 });

  for (const cfg of LESSON_FLOW_PATHWAY_QA) {
    await context.addCookies([
      { name: MARKETING_REGION_COOKIE, value: cfg.marketingRegionCookie, url: baseURL },
    ]);
    await setGlobalRegionCookie(page, cfg.pathway.countrySlug === "us" ? "us" : "canada", baseURL);

    const hubRoutes = [cfg.hubPath, cfg.lessonsPath] as const;
    for (const hubUrl of hubRoutes) {
      const r = await page.goto(urlOnBase(hubUrl), { waitUntil: "domcontentloaded", timeout: 180_000 });
      if (!r?.ok()) {
        record({
          route: hubUrl,
          pathwayId: cfg.pathwayId,
          kind: "broken",
          message: `HTTP ${r?.status() ?? "?"}`,
          severity: "error",
        });
        await captureStabilityShot(page, testInfo, `hub-${cfg.pathwayId}-fail`);
        continue;
      }
      if (page.url().includes("/404") || (await page.title()).toLowerCase().includes("404")) {
        record({
          route: hubUrl,
          pathwayId: cfg.pathwayId,
          kind: "broken",
          message: "404 or not found title",
          severity: "error",
        });
        await captureStabilityShot(page, testInfo, `hub-404-${cfg.pathwayId}`);
        continue;
      }
      workingRoutes.push(urlOnBase(hubUrl));

      /* Exam hub + lessons index use JSON-LD only — visible BreadcrumbTrail is on lesson detail / some subpages. */

      const hubMain = await page.locator("main").first().innerText().catch(() => "");
      const hubBad = findPlaceholderHits(hubMain);
      for (const b of hubBad) {
        record({
          route: hubUrl,
          pathwayId: cfg.pathwayId,
          kind: "content",
          message: `Placeholder signal in hub main: ${b}`,
          severity: "warn",
        });
      }
    }

    /* Filtered lesson library */
    const searchQuery = "heart";
    const filteredPath = `${cfg.lessonsPath}?q=${encodeURIComponent(searchQuery)}`;
    const fr = await page.goto(urlOnBase(filteredPath), { waitUntil: "domcontentloaded", timeout: 180_000 });
    if (fr?.ok()) {
      workingRoutes.push(urlOnBase(filteredPath));
      if (!page.url().includes("q=")) {
        record({
          route: filteredPath,
          pathwayId: cfg.pathwayId,
          kind: "layout",
          message: "Search URL did not retain q= query param",
          severity: "info",
        });
      }
      const fmain = await page.locator("main").first().innerText().catch(() => "");
      for (const b of findPlaceholderHits(fmain)) {
        record({
          route: filteredPath,
          pathwayId: cfg.pathwayId,
          kind: "content",
          message: `Placeholder in filtered hub main: ${b}`,
          severity: "warn",
        });
      }
    } else {
      record({
        route: filteredPath,
        pathwayId: cfg.pathwayId,
        kind: "broken",
        message: `Filtered hub HTTP ${fr?.status() ?? "?"}`,
        severity: "error",
      });
    }

    /* Discover lesson paths from unfiltered hub */
    const lr = await page.goto(urlOnBase(cfg.lessonsPath), { waitUntil: "domcontentloaded", timeout: 180_000 });
    if (!lr?.ok()) {
      record({
        route: cfg.lessonsPath,
        pathwayId: cfg.pathwayId,
        kind: "broken",
        message: `Lessons hub HTTP ${lr?.status() ?? "?"}`,
        severity: "error",
      });
      continue;
    }
    await page.locator("#pathway-lesson-library").waitFor({ state: "visible", timeout: 60_000 }).catch(() => {});
    const emptyVisible = await page
      .locator('[data-nn-empty="curriculum-hub-empty"]')
      .isVisible({ timeout: 4000 })
      .catch(() => false);
    if (!emptyVisible) {
      await page.locator('#pathway-lesson-library a[href*="/lessons"]').first().waitFor({ state: "visible", timeout: 25_000 }).catch(() => {});
      await page.waitForTimeout(500);
    }

    const empty = await page.locator('[data-nn-empty="curriculum-hub-empty"]').count();
    if (empty > 0) {
      record({
        route: cfg.lessonsPath,
        pathwayId: cfg.pathwayId,
        kind: "content",
        message: "Curriculum hub empty state (no lessons to crawl in this environment)",
        severity: "info",
      });
      continue;
    }

    await page.waitForSelector("#pathway-lesson-library", { state: "visible", timeout: 60_000 }).catch(() => {});
    const paths = await collectLessonDetailPathsFromHub(page, origin);
    const chosen = paths.slice(0, MAX_LESSONS_PER_PATHWAY);
    if (chosen.length === 0) {
      record({
        route: cfg.lessonsPath,
        pathwayId: cfg.pathwayId,
        kind: "content",
        message: "No lesson detail links found under #pathway-lesson-library",
        severity: "warn",
      });
      await captureStabilityShot(page, testInfo, `no-lessons-${cfg.pathwayId}`);
      continue;
    }

    for (const pathOnly of chosen) {
      const fullUrl = urlOnBase(pathOnly);
      const res = await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 180_000 });
      if (!res?.ok()) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "broken",
          message: `HTTP ${res?.status() ?? "?"}`,
          severity: "error",
          screenshotPath: await captureStabilityShot(page, testInfo, "http-fail"),
        });
        continue;
      }
      if ((await page.title()).toLowerCase().includes("not found") || page.url().includes("/404")) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "broken",
          message: "404 / not found",
          severity: "error",
          screenshotPath: await captureStabilityShot(page, testInfo, "404"),
        });
        continue;
      }
      workingRoutes.push(urlOnBase(page.url()));

      const header = page.locator(`header[data-nn-pathway-id="${cfg.pathwayId}"]`).first();
      await header.waitFor({ state: "visible", timeout: 90_000 }).catch(() => {});
      if (!(await header.isVisible().catch(() => false))) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "layout",
          message: "Missing lesson hero header[data-nn-pathway-id]",
          severity: "error",
          screenshotPath: await captureStabilityShot(page, testInfo, "no-hero"),
        });
      }

      const h1 = page.locator("h1.nn-lesson-page-title").first();
      if (!(await h1.isVisible({ timeout: 45_000 }).catch(() => false))) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "layout",
          message: "Missing h1.nn-lesson-page-title",
          severity: "error",
        });
      } else {
        const titleText = (await h1.innerText()).trim();
        if (titleText.length < 3) {
          record({
            route: fullUrl,
            pathwayId: cfg.pathwayId,
            kind: "content",
            message: "Lesson title almost empty",
            severity: "error",
          });
        } else {
          let m = titleByPathway.get(cfg.pathwayId);
          if (!m) {
            m = new Map();
            titleByPathway.set(cfg.pathwayId, m);
          }
          const list = m.get(titleText) ?? [];
          list.push(fullUrl);
          m.set(titleText, list);
        }
      }

      const lessonCrumb = page.getByRole("navigation", { name: /breadcrumb/i });
      if (!(await lessonCrumb.isVisible().catch(() => false))) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "layout",
          message: "Missing breadcrumb on lesson page",
          severity: "error",
        });
      }

      const main = page.locator("main").first();
      const mainText = await main.innerText().catch(() => "");
      if (mainText.trim().length < 120) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "content",
          message: "Main content unusually short (possible empty shell)",
          severity: "error",
          screenshotPath: await captureStabilityShot(page, testInfo, "short-main"),
        });
      }
      for (const b of findPlaceholderHits(mainText)) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "content",
          message: `Placeholder / bad copy in main: ${b}`,
          severity: "warn",
        });
      }

      const prose = page.locator(".nn-lesson-prose").first();
      if (!(await prose.isVisible().catch(() => false))) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "layout",
          message: "Missing .nn-lesson-prose block",
          severity: "warn",
        });
      }

      const ctaCount = await page.locator('[data-testid^="pathway-lesson-cta"]').count();
      const visibleCta = await page.locator('[data-testid^="pathway-lesson-cta"]').first().isVisible().catch(() => false);
      if (ctaCount === 0 || !visibleCta) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "layout",
          message: "No visible pathway-lesson-cta buttons",
          severity: "error",
          screenshotPath: await captureStabilityShot(page, testInfo, "no-cta"),
        });
      }

      /* Section quick-nav (desktop): jump to first #anchor */
      const navLink = page.locator(".nn-lesson-section-nav a[href^='#']").first();
      if (await navLink.isVisible().catch(() => false)) {
        const href = await navLink.getAttribute("href");
        const id = href?.replace(/^#/, "") ?? "";
        await navLink.click();
        await page.waitForTimeout(400);
        if (id) {
          const visible = await page.evaluate((sectionId) => {
            const el = document.getElementById(sectionId);
            if (!el) return false;
            const r = el.getBoundingClientRect();
            return r.height > 0 && r.width >= 0;
          }, id);
          if (!visible) {
            record({
              route: fullUrl,
              pathwayId: cfg.pathwayId,
              kind: "layout",
              message: `Section nav target #${id} not found or not laid out`,
              severity: "warn",
            });
          }
        }
      }

      /* Related lesson link (optional) */
      const related = page.locator('[data-nn-qa-related-lesson="true"]').first();
      if (await related.isVisible().catch(() => false)) {
        const href = await related.getAttribute("href");
        if (href?.startsWith("/") || href?.startsWith("http")) {
          const target = urlOnBase(href);
          const rr = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 120_000 });
          if (!rr?.ok()) {
            record({
              route: fullUrl,
              pathwayId: cfg.pathwayId,
              kind: "broken",
              message: `Related lesson link ${href} → HTTP ${rr?.status() ?? "?"}`,
              severity: "error",
            });
          } else {
            workingRoutes.push(urlOnBase(page.url()));
          }
          await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });
        }
      }

      const internalBroken = await checkInternalLinksSample({
        page,
        request: context.request,
        baseURL,
        maxChecks: 6,
      });
      for (const msg of internalBroken) {
        record({
          route: fullUrl,
          pathwayId: cfg.pathwayId,
          kind: "broken",
          message: `Internal link check: ${msg}`,
          severity: "warn",
        });
      }
    }
  }

  for (const [, titles] of titleByPathway) {
    for (const [title, routes] of titles) {
      if (routes.length > 1) {
        record({
          route: routes.join(", "),
          kind: "content",
          message: `Duplicate lesson title "${title.slice(0, 120)}${title.length > 120 ? "…" : ""}" (${routes.length} routes in same pathway)`,
          severity: "warn",
        });
      }
    }
  }

  const { json, md } = await writeLessonStabilityReports({ workingRoutes, findings });
  await testInfo.attach("lesson-content-stability-report.json", { path: json });
  await testInfo.attach("lesson-content-stability-report.md", { path: md });

  const hardBroken = findings.filter((f) => f.kind === "broken" && f.severity === "error");
  expect(hardBroken, hardBroken.map((f) => f.message).join("; ")).toEqual([]);
});

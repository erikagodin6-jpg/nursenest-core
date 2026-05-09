/**
 * Full-platform regression orchestration — SEO, screenshots, stability probes, guest learner entrypoints.
 *
 * Complements pathway-hub + CAT + public smoke suites (run via `playwright.full-regression.config.ts`).
 *
 * @slow — shard with `E2E_REGRESSION_SHARD=1|2` (optional).
 */
import { expect, test } from "@playwright/test";

import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";
import {
  assertNoAdminAnchorsInSample,
  assertSeoBasics,
  attachRegressionDiagnostics,
  benignConsoleText,
  captureRegressionShot,
  ensureScreenshotDir,
  FULL_REGRESSION_SCREENSHOT_DIR,
  probeInternalLinks,
  softOverflowDelta,
  type RegressionDiagnostics,
} from "./full-platform.helpers";

const VIEWPORTS = [
  { tag: "desktop", width: 1280, height: 900 },
  { tag: "mobile", width: 390, height: 844 },
] as const;

const THEMES = ["ocean", "midnight"] as const;

function shardAllows(name: string): boolean {
  const s = process.env.E2E_REGRESSION_SHARD?.trim();
  if (!s || s === "all") return true;
  const seoMarketing = ["seo-marketing-sample", "screenshot-matrix"];
  const learnerGuest = ["guest-cat-ecg-labs-probes", "locale-theme-footer"];
  if (s === "1") return seoMarketing.includes(name);
  if (s === "2") return learnerGuest.includes(name);
  return true;
}

function finishDiag(d: RegressionDiagnostics) {
  const ce = d.consoleErrors.filter((x) => !benignConsoleText(x));
  expect.soft(ce, ce.join(" | ")).toEqual([]);
  expect.soft(d.pageErrors, d.pageErrors.join(" | ")).toEqual([]);
  expect.soft(d.http500, d.http500.join(" | ")).toEqual([]);
}

test.describe.configure({ mode: "parallel", timeout: 420_000 });

test.describe("@slow full-platform regression (guest)", () => {
  test.beforeAll(async () => {
    await ensureScreenshotDir();
  });

  test("seo-marketing-sample — canonical, title, description @slow", async ({ page, baseURL }, testInfo) => {
    test.skip(!shardAllows("seo-marketing-sample"));
    testInfo.annotations.push({ type: "slow", description: "SEO bundle" });
    const paths = ["/", "/pricing", "/blog", "/us/rn/nclex-rn"];
    const origin = resolveE2eAppBaseUrl(baseURL);
    for (const path of paths) {
      const d = attachRegressionDiagnostics(page);
      const r = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(r?.ok(), `${path} HTTP ${r?.status()}`).toBeTruthy();
      await page.waitForTimeout(5000);
      await assertSeoBasics(page);
      if (path === "/") {
        const hreflang = await page.locator('link[rel="alternate"][hreflang]').count();
        expect(hreflang, "homepage should expose hreflang alternates").toBeGreaterThan(0);
      }
      finishDiag(d);
    }
    await assertNoAdminAnchorsInSample(page);
    testInfo.annotations.push({
      type: "screenshots",
      description: FULL_REGRESSION_SCREENSHOT_DIR,
    });
  });

  test("screenshot-matrix — hubs + entry routes (desktop/mobile × themes) @slow", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(900_000);
    test.skip(!shardAllows("screenshot-matrix"));
    testInfo.annotations.push({ type: "slow", description: "visual evidence" });
    const origin = resolveE2eAppBaseUrl(baseURL);
    await seedUsMarketingCookie(page, origin);

    const routes: { name: string; path: string }[] = [
      { name: "home", path: "/" },
      { name: "pricing", path: "/pricing" },
      { name: "hub-rn", path: "/us/rn/nclex-rn" },
      { name: "hub-rpn", path: "/canada/pn/rex-pn" },
      { name: "hub-np", path: "/us/np/fnp" },
      { name: "hub-newgrad", path: "/us/rn/new-grad-transition" },
      { name: "hub-allied", path: "/allied/allied-health" },
      { name: "hub-prenursing", path: "/pre-nursing" },
      { name: "lessons-entry", path: "/us/rn/nclex-rn/lessons" },
      { name: "tools-hub", path: "/tools" },
      { name: "practice-questions", path: "/us/rn/nclex-rn/questions" },
      { name: "cat", path: "/us/rn/nclex-rn/cat" },
      { name: "faq", path: "/faq" },
    ];

    for (const { name, path } of routes) {
      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await gotoExpectOk(page, path);
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(5000);
        for (const th of THEMES) {
          await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), th);
          await page.waitForTimeout(400);
          await captureRegressionShot(page, `${name}-${vp.tag}-${th}`);
        }
      }
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await page.waitForTimeout(3000);
    const od = await softOverflowDelta(page);
    expect(od, "RN hub overflow").toBeLessThanOrEqual(16);
  });

  test("guest-cat-ecg-labs-probes — marketing CAT surface, ECG marker, med-math tool @slow", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.skip(!shardAllows("guest-cat-ecg-labs-probes"));
    testInfo.annotations.push({ type: "slow", description: "learner entry" });
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    const d = attachRegressionDiagnostics(page);

    await gotoExpectOk(page, "/us/rn/nclex-rn/cat");
    await page.waitForTimeout(5000);
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    const body = await page.content();
    expect(body.length).toBeGreaterThan(500);

    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await page.waitForTimeout(5000);
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(1);

    await gotoExpectOk(page, "/tools/med-math");
    await expect(page.getByTestId("marketing-tool-med-math")).toBeVisible({ timeout: 45_000 });
    const hasInput = await page.locator('input[type="text"], input[inputmode="decimal"]').first().isVisible().catch(() => false);
    expect(hasInput || (await page.locator("input").count()) > 0, "med-math has an input").toBeTruthy();

    finishDiag(d);
  });

  test("locale-theme-footer — language chrome + footer CTAs + link probe @slow", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.skip(!shardAllows("locale-theme-footer"));
    testInfo.annotations.push({ type: "slow", description: "nav/i18n" });
    const origin = resolveE2eAppBaseUrl(baseURL);
    const d = attachRegressionDiagnostics(page);

    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await page.waitForTimeout(5000);

    const localeBtn = page.getByRole("button", { name: /language|locale|français|español/i }).first();
    if (await localeBtn.isVisible().catch(() => false)) {
      await localeBtn.click().catch(() => {});
      await page.waitForTimeout(1500);
    }

    await probeInternalLinks(page, origin, "/", { maxLinks: 15 });
    await assertNoAdminAnchorsInSample(page);

    const footer = page.locator("footer").first();
    if (await footer.isVisible().catch(() => false)) {
      await assertNoAdminAnchorsInSample(page, "footer");
    }

    finishDiag(d);
  });
});

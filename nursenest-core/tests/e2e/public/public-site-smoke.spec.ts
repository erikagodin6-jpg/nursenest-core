/**
 * Public site smoke: core marketing routes, nav, country/language chrome, hubs, blog, footer.
 *
 * Requires dev server: `npm run dev` (default BASE_URL http://127.0.0.1:3000).
 *
 * Run: `npx playwright test tests/e2e/public/public-site-smoke.spec.ts`
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { GLOBAL_REGION_COOKIE, HEADER_CHROME, getE2eBaseURL } from "../helpers/country-selector";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";

const baseURL = getE2eBaseURL();

async function gotoOk(page: Page, path: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(r?.ok(), `HTTP ${r?.status()} for ${path}`).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
}

test.describe("Public site smoke", () => {
  test("homepage loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("link", { name: /NurseNest home/i })).toBeVisible();
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors, "unexpected console errors").toEqual([]);
    expect(d.failedRequests, "unexpected network failures").toEqual([]);
  });

  test("top navigation — Pricing reachable from header", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    // Header primary nav (avoid footer duplicate links; grid class alone is not always present in DOM).
    const pricing = page.locator(`${HEADER_CHROME} a[href="/pricing"]`).first();
    await expect(pricing).toBeVisible({ timeout: 30_000 });
    await pricing.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toMatch(/\/pricing/);
    await expect(page.locator("main, [role='main']").first()).toBeVisible();
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("country selector — opens listbox and shows options (desktop)", async ({ page }, testInfo) => {
    await page.context().addCookies([{ name: GLOBAL_REGION_COOKIE, value: "us", url: baseURL }]);
    const o = attachPageObservers(page);
    await gotoOk(page, "/");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const regionBtn = page
      .locator(HEADER_CHROME)
      .getByRole("button", { name: /Country: United States|Region: United States/i })
      .first();
    await expect(regionBtn).toBeVisible({ timeout: 30_000 });
    await regionBtn.click({ force: true });
    await page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`).waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await expect(page.getByRole("option", { name: /^Canada$/ }).first()).toBeVisible();
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("language selector — switch locale without 404", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const langBtn = page.locator(HEADER_CHROME).getByRole("button", { name: /language/i }).first();
    await langBtn.click();
    await page.getByRole("button", { name: /Français|French/i }).first().click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).not.toMatch(/\/404/);
    const r = await page.goto(page.url(), { waitUntil: "domcontentloaded" });
    expect(r?.ok()).toBeTruthy();
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("login page loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/login");
    await expect(page.getByRole("heading", { name: /log in|sign in/i })).toBeVisible({ timeout: 30_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("signup page loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/signup");
    await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 30_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("pricing page loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/pricing");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("US RN lesson hub loads", async ({ page }, testInfo) => {
    const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
    expect(cfg).toBeTruthy();
    const o = attachPageObservers(page);
    await gotoOk(page, cfg!.hubPath);
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("Canada RN lesson hub loads", async ({ page }, testInfo) => {
    const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "ca-rn-nclex-rn");
    expect(cfg).toBeTruthy();
    const o = attachPageObservers(page);
    await gotoOk(page, cfg!.hubPath);
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("US RN lessons index loads", async ({ page }, testInfo) => {
    const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
    expect(cfg).toBeTruthy();
    const o = attachPageObservers(page);
    await gotoOk(page, cfg!.lessonsPath);
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("US RN — first primary lesson detail loads", async ({ page }, testInfo) => {
    const cfg = LESSON_FLOW_PATHWAY_QA.find((x) => x.pathwayId === "us-rn-nclex-rn");
    expect(cfg).toBeTruthy();
    const o = attachPageObservers(page);
    await gotoOk(page, cfg!.lessonsPath);
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const primary = page.locator('[data-nn-qa-primary-lesson="true"]').first();
    await expect(primary).toBeVisible({ timeout: 120_000 });
    await primary.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/lessons/");
    await expect(page.locator(`header[data-nn-pathway-id="${cfg!.pathwayId}"]`)).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("blog index loads", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/blog");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("footer internal links — sample of routes return 200", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await gotoOk(page, "/");
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const footer = page.locator("footer");
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) =>
      [...new Set(els.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""))].filter(
        (h) => h && !h.startsWith("/app") && h !== "/",
      ),
    );
    const sample = hrefs.slice(0, 6);
    expect(sample.length, "expected footer internal links").toBeGreaterThan(0);
    for (const path of sample) {
      const r = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `${path} HTTP ${r?.status()}`).toBeTruthy();
      const notFound = await page.getByRole("heading", { name: /404|not found/i }).isVisible().catch(() => false);
      expect(notFound, `unexpected 404 page for ${path}`).toBe(false);
    }
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });

  test("primary routes — no 404 on key paths", async ({ page }, testInfo) => {
    const paths = ["/", "/pricing", "/faq", "/pre-nursing", "/question-bank", "/blog", "/us/rn/nclex-rn", "/canada/rn/nclex-rn"];
    const o = attachPageObservers(page);
    for (const path of paths) {
      const r = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `${path} → ${r?.status()}`).toBeTruthy();
      const h404 = await page.getByRole("heading", { name: /^404|^Not [Ff]ound/ }).isVisible().catch(() => false);
      expect(h404, `404 heading on ${path}`).toBe(false);
    }
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });
});

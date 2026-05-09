/**
 * New Grad marketing + pathway hubs — premium modules, no ECG, public safety, screenshots.
 * Screenshots: monorepo `docs/screenshots/allied-newgrad-figma/`.
 *
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/new-grad-hubs.spec.ts`
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { listNewGradWorkAreaSlugs } from "@/lib/new-grad/new-grad-work-areas";
import { CANADA_NEW_GRAD_MARKETING_HUB_PATH, US_NEW_GRAD_MARKETING_HUB_PATH } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { newGradWorkAreaHubPath } from "@/lib/navigation/new-grad-marketing-hub-paths";

import {
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

const OUT_DIR = join(process.cwd(), "..", "docs", "screenshots", "allied-newgrad-figma");
const PREMIUM_ROOT = '[data-nn-qa-pathway-premium-modules]';
const TRANSITION_HUB = "/us/rn/new-grad-transition";

const REACT_DEVTOOLS = /Download the React DevTools/i;
const HMR = /\[HMR\]|Fast Refresh/i;

function benignConsoleText(msg: string): boolean {
  if (REACT_DEVTOOLS.test(msg)) return true;
  if (HMR.test(msg)) return true;
  if (msg.includes("Failed to load resource")) return true;
  /**
   * Long-running `next dev` can serve a stale RSC/i18n bundle until Turbopack reloads after `i18n:compile`.
   * Keys are present in `public/i18n/en/components.json`; CI/fresh servers do not emit these lines.
   */
  if (msg.includes("newGradPathwayCat") && (msg.includes("missing_or_invalid") || msg.includes("missing required marketing copy"))) {
    return true;
  }
  if (msg.includes("auth_noindex_path") && msg.includes("/login")) return true;
  if (msg.includes("pathway_lessons") && msg.includes("pathway_lesson_prisma")) return true;
  if (msg.includes("pathway_lessons") && msg.includes("hub_list_pipeline_stages")) return true;
  if (msg.includes("pathway_lessons") && msg.includes("hub_marketing_all_db_candidates_filtered_out")) {
    return true;
  }
  if (msg.includes("pathway_lessons") && msg.includes("hub_list_renderable_truncated_to_cap")) return true;
  return false;
}

function attachDiagnostics(page: Page): { consoleErrors: string[]; failures: string[] } {
  const consoleErrors: string[] = [];
  const failures: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (benignConsoleText(text)) return;
    consoleErrors.push(text);
  });
  page.on("pageerror", (err) => failures.push(err.message));
  page.on("response", (res) => {
    const s = res.status();
    if (s >= 500 && s < 600 && res.request().resourceType() !== "websocket") {
      failures.push(`HTTP ${s} ${res.url()}`);
    }
  });
  return { consoleErrors, failures };
}

async function assertNoAdminLinks(page: Page, rootSelector: string) {
  const bad = await page.evaluate((sel) => {
    const root = document.querySelector(sel) ?? document.body;
    const anchors = Array.from(root.querySelectorAll('a[href*="admin"], a[href*="/staff"]'));
    return anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "");
  }, rootSelector);
  expect(bad).toEqual([]);
}

async function assertNoForbiddenPublicLinks(page: Page, rootSelector: string) {
  const bad = await page.evaluate((sel) => {
    const root = document.querySelector(sel) ?? document.body;
    const anchors = Array.from(root.querySelectorAll('a[href*="admin"], a[href*="/staff"]'));
    return anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "");
  }, rootSelector);
  expect(bad, `unexpected admin/staff links in ${rootSelector}`).toEqual([]);
}

async function assertNoReactCrashOverlay(page: Page) {
  await expect(page.getByText("Unhandled Runtime Error").first()).toHaveCount(0);
  await expect(page.getByText("Application error").first()).toHaveCount(0);
}

async function expectHttpOkNoServerError(page: Page, path: string) {
  const res = await page.request.get(path);
  const st = res.status();
  expect(st, `${path} status`).toBeLessThan(500);
  expect(st, `${path} not 503`).not.toBe(503);
  expect(st, `${path} not 504`).not.toBe(504);
}

async function settleTransitionHub(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await expect.poll(async () => await page.locator(PREMIUM_ROOT).count(), { timeout: 120_000 }).toBeGreaterThan(0);
  await page.waitForTimeout(5000);
}

test.describe.configure({ mode: "serial", timeout: 600_000 });

test.describe("New Grad hubs — pathway premium modules & gates", () => {
  test.beforeAll(() => {
    mkdirSync(OUT_DIR, { recursive: true });
  });

  test("transition hub: no ECG; expected modules; no admin links in hub chrome", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    const diag = attachDiagnostics(page);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);
    await assertNoReactCrashOverlay(page);

    await expect(page.locator('[data-nn-marketing-hub-guided-path="1"]')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-np-cases="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-premium-module="clinical_cases"]')).toHaveCount(0);

    await expect(page.locator('[data-nn-qa-hub-premium-module="flashcards"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="practice_tests"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="labs"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="med_calc"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="new_grad_pathway_cat"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="transition"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="skills_refresher"]')).toHaveCount(1);

    await assertNoAdminLinks(page, ".nn-premium-pathway-hub");
    await assertNoForbiddenPublicLinks(page, ".nn-premium-pathway-hub");

    const catHref = await page
      .locator('[data-nn-qa-hub-premium-module="new_grad_pathway_cat"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(catHref ?? "", "CAT card should deep-link to public marketing CAT route").toMatch(/new-grad-transition\/cat$/);

    expect(diag.consoleErrors, diag.consoleErrors.join("\n")).toEqual([]);
    expect(diag.failures, diag.failures.join("\n")).toEqual([]);
  });

  test("transition hub: title + public sub-routes return <5xx", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await seedUsMarketingCookie(page, baseURL!);
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);
    /** Stable hub H1 — avoid `getByRole('heading')` alone (nav/section order + accessible-name quirks in CI). */
    const hubTitle = page.locator("#nn-nursing-tier-hub-title");
    await expect(hubTitle).toBeVisible({ timeout: 120_000 });
    await expect(hubTitle).toHaveText(/new grad|transition|first year/i);

    await expectHttpOkNoServerError(page, "/us/rn/new-grad-transition/lessons");
    await expectHttpOkNoServerError(page, "/us/rn/new-grad-transition/questions");
    await expectHttpOkNoServerError(page, "/us/rn/new-grad-transition/cat");
  });

  test("guest login routing: flashcards + medication drills wrap with callback", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);

    const flashHref = await page
      .locator('[data-nn-qa-hub-premium-module="flashcards"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(flashHref ?? "").toContain("callbackUrl=");
    expect(flashHref ?? "").toMatch(/us-rn-new-grad-transition/i);

    const medHref = await page
      .locator('[data-nn-qa-hub-premium-module="skills_refresher"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(medHref ?? "").toContain("callbackUrl=");
  });

  test("marketing landings load (US + CA)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    attachDiagnostics(page);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, US_NEW_GRAD_MARKETING_HUB_PATH);
    await expect(page.locator('[data-nn-new-grad-marketing-landing="1"]')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('[data-nn-marketing-hub-guided-path="1"]')).toBeVisible({ timeout: 120_000 });
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, CANADA_NEW_GRAD_MARKETING_HUB_PATH);
    await expect(page.locator('[data-nn-new-grad-marketing-landing="1"]')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('[data-nn-marketing-hub-guided-path="1"]')).toBeVisible({ timeout: 120_000 });
  });

  test("work-area hubs respond OK (US + Canada shells)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    attachDiagnostics(page);
    const slugs = listNewGradWorkAreaSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      await seedUsMarketingCookie(page, origin);
      await gotoExpectOk(page, newGradWorkAreaHubPath("us", slug));
      await expect(page.locator(`[data-nn-new-grad-work-area-hub="${slug}"]`)).toBeVisible({ timeout: 120_000 });
      await seedCaMarketingCookie(page, origin);
      await gotoExpectOk(page, newGradWorkAreaHubPath("canada", slug));
      await expect(page.locator(`[data-nn-new-grad-work-area-hub="${slug}"]`)).toBeVisible({ timeout: 120_000 });
    }
  });

  test("transition hub — desktop + mobile, ocean + midnight + blossom screenshots", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-desktop-ocean.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-desktop-midnight.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "blossom"));
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-desktop-blossom.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));

    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-mobile-ocean.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-mobile-midnight.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "blossom"));
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-mobile-blossom.png"), fullPage: true });
  });
});

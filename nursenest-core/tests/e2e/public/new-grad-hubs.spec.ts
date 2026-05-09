/**
 * New Grad marketing + pathway hubs — premium modules, no ECG, public safety, screenshots.
 * Output: `nursenest-core/docs/screenshots/new-grad-e2e/`
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

const OUT_DIR = join(process.cwd(), "docs", "screenshots", "new-grad-e2e");
const PREMIUM_ROOT = '[data-nn-qa-pathway-premium-modules]';
const TRANSITION_HUB = "/us/rn/new-grad-transition";

const REACT_DEVTOOLS = /Download the React DevTools/i;
const HMR = /\[HMR\]|Fast Refresh/i;

function benignConsoleText(msg: string): boolean {
  if (REACT_DEVTOOLS.test(msg)) return true;
  if (HMR.test(msg)) return true;
  if (msg.includes("Failed to load resource")) return true;
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

    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-premium-module="flashcards"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="practice_tests"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="labs"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="med_calc"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="new_grad_pathway_cat"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="transition"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-premium-module="skills_refresher"]')).toHaveCount(1);

    await assertNoAdminLinks(page, ".nn-premium-pathway-hub");

    expect(diag.consoleErrors, diag.consoleErrors.join("\n")).toEqual([]);
    expect(diag.failures, diag.failures.join("\n")).toEqual([]);
  });

  test("marketing landings load (US + CA)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    attachDiagnostics(page);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, US_NEW_GRAD_MARKETING_HUB_PATH);
    await expect(page.locator('[data-nn-new-grad-marketing-landing="1"]')).toBeVisible({ timeout: 120_000 });
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, CANADA_NEW_GRAD_MARKETING_HUB_PATH);
    await expect(page.locator('[data-nn-new-grad-marketing-landing="1"]')).toBeVisible({ timeout: 120_000 });
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

  test("transition hub — desktop + mobile, light + dark screenshots", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-desktop-light.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-desktop-dark.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));

    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, TRANSITION_HUB);
    await settleTransitionHub(page);
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-mobile-light.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.screenshot({ path: join(OUT_DIR, "new-grad-transition-mobile-dark.png"), fullPage: true });
  });
});

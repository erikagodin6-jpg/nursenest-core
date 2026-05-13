import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { loginWithCredentials } from "./helpers/learner-login";
import { getQaPaidCredentials } from "./helpers/smoke-credentials";

const PREMIUM_LAYOUT_VERSION = "2026-05-live-redesign-v1";
const SCREENSHOT_DIR = path.join("test-results", "live-redesign-deployment-proof");

const PUBLIC_TARGETS = [
  { id: "homepage", path: "/", surface: "marketing-default" },
  { id: "rn-hub", path: "/canada/rn/nclex-rn", surface: "marketing-default" },
  { id: "rpn-hub", path: "/canada/pn/rex-pn", surface: "marketing-default" },
  { id: "np-hub", path: "/canada/np/cnple", surface: "marketing-default" },
  { id: "allied-hub", path: "/allied/allied-health", surface: "marketing-default" },
  { id: "ecg-basic-marketing", path: "/ecg-interpretation", surface: "marketing-default" },
  { id: "ecg-advanced-marketing", path: "/ecg-telemetry-mastery", surface: "marketing-default" },
] as const;

const AUTH_TARGETS = [
  { id: "lesson-hub", path: "/app/lessons", surface: "learner-shell" },
  { id: "lesson-page", path: "/app/lessons", surface: "learner-shell", clickFirstLesson: true },
  { id: "practice-exams", path: "/app/practice-tests", surface: "learner-shell" },
  { id: "cat-exams", path: "/app/practice-tests?cat=1", surface: "learner-shell" },
  { id: "flashcards", path: "/app/flashcards", surface: "learner-shell" },
  { id: "ecg-basic-module", path: "/modules/ecg", surface: "ecg-module" },
  { id: "ecg-advanced-module", path: "/modules/ecg-advanced", surface: "advanced-ecg-module" },
] as const;

const OLD_LAYOUT_SELECTORS = [
  "[data-legacy-layout]",
  "[data-old-layout]",
  ".legacy-layout",
  ".old-layout",
  ".legacy-marketing-shell",
];

async function expectPremiumMarker(page: Page, surface: string) {
  const marker = page
    .locator(`[data-premium-layout-version="${PREMIUM_LAYOUT_VERSION}"][data-premium-layout-surface="${surface}"]`)
    .first();
  await expect(marker).toHaveCount(1);
}

async function expectNoOldLayoutSelectors(page: Page) {
  for (const selector of OLD_LAYOUT_SELECTORS) {
    await expect(page.locator(selector), `${selector} should not be present`).toHaveCount(0);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    return Math.max(root.scrollWidth, body.scrollWidth) - Math.max(root.clientWidth, body.clientWidth);
  });
  expect(overflow, "horizontal overflow px").toBeLessThanOrEqual(1);
}

async function expectPrimaryCta(page: Page) {
  const cta = page
    .locator('main a[href], main button:not([disabled]), [data-testid*="cta"], .nn-btn-primary')
    .filter({ visible: true })
    .first();
  await expect(cta, "primary CTA or actionable study control").toBeVisible({ timeout: 30_000 });
}

async function captureProofScreenshots(page: Page, testInfo: TestInfo, id: string) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${testInfo.project.name}-${id}-desktop.png`),
    fullPage: true,
  });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${testInfo.project.name}-${id}-mobile-375.png`),
    fullPage: true,
  });
}

async function verifyInternalNavigationWorks(page: Page) {
  const current = new URL(page.url());
  const candidates = page
    .locator('header a[href^="/"], nav a[href^="/"], [data-nn-learner-shell-study-nav] a[href^="/"]')
    .filter({ hasNotText: /sign out|logout/i });
  const count = await candidates.count();
  for (let i = 0; i < Math.min(count, 20); i += 1) {
    const candidate = candidates.nth(i);
    if (!(await candidate.isVisible().catch(() => false))) continue;
    const href = await candidate.getAttribute("href");
    if (!href || href.startsWith("#")) continue;
    const url = new URL(href, current.origin);
    if (url.pathname === current.pathname && url.search === current.search) continue;
    await candidate.click();
    await page.waitForURL((nextUrl) => nextUrl.pathname === url.pathname, { timeout: 15_000 });
    return;
  }
}

async function runTarget(page: Page, testInfo: TestInfo, target: { id: string; path: string; surface: string; clickFirstLesson?: boolean }) {
  await page.goto(target.path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.locator("body")).toBeVisible({ timeout: 30_000 });

  if (target.clickFirstLesson) {
    const firstLesson = page
      .locator('main a[href^="/app/lessons/"], main a[href*="/app/lessons/"]')
      .filter({ visible: true })
      .first();
    await expect(firstLesson, "first lesson link").toBeVisible({ timeout: 60_000 });
    await firstLesson.click();
    await page.waitForURL(/\/app\/lessons\/[^/?#]+/, { timeout: 30_000 });
  }

  await expectPremiumMarker(page, target.surface);
  await expectNoOldLayoutSelectors(page);
  await expectPrimaryCta(page);
  await captureProofScreenshots(page, testInfo, target.id);
  await verifyInternalNavigationWorks(page);
}

test.describe("live redesign deployment proof", () => {
  for (const target of PUBLIC_TARGETS) {
    test(`public ${target.id} uses the 2026-05 premium layout`, async ({ page }, testInfo) => {
      await runTarget(page, testInfo, target);
    });
  }

  test("authenticated learner and ECG targets use the 2026-05 premium layout", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E/PLAYWRIGHT equivalents) for protected surfaces.");
    await loginWithCredentials(page, creds!.email, creds!.password);
    for (const target of AUTH_TARGETS) {
      await test.step(target.id, async () => {
        await runTarget(page, testInfo, target);
      });
    }
  });
});

/**
 * Minimal pixel-diff regression for critical learner surfaces (requires `setup-visual-qa-auth`).
 *
 * Update baselines after intentional UI changes:
 *   npx playwright test -c playwright.visual-qa.config.ts --project=visual-qa-critical-regression --update-snapshots
 */
import { existsSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";

const pid = PAID_E2E_DEFAULT_PATHWAY_ID;

const screenshotOpts = {
  fullPage: true,
  animations: "disabled" as const,
  caret: "hide" as const,
  maxDiffPixelRatio: 0.02,
  threshold: 0.25,
};

async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function captureWhenReady(page: Page, name: string, ready: Locator): Promise<void> {
  await ready.first().waitFor({ state: "visible", timeout: 120_000 });
  await waitForFonts(page);
  await expect(page).toHaveScreenshot(`${name}.png`, screenshotOpts);
}

test.describe.configure({ mode: "serial" });

test.beforeAll(({}, testInfo) => {
  if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
    testInfo.skip(true, `Missing ${VISUAL_QA_LEARNER_AUTH_FILE} — run npm run visual-qa:auth`);
  }
});

test("study home / app root", async ({ page }) => {
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  expect(page.url()).not.toMatch(/\/login/i);
  await captureWhenReady(
    page,
    "critical-study-home",
    page.locator("#nn-learner-main").or(page.locator("[data-nn-learner-main]")).or(page.locator(".nn-learner-app main").first()),
  );
});

test("flashcards hub", async ({ page }) => {
  await page.goto(`/app/flashcards?pathwayId=${encodeURIComponent(pid)}`, { waitUntil: "domcontentloaded" });
  expect(page.url()).not.toMatch(/\/login/i);
  await captureWhenReady(
    page,
    "critical-flashcards-hub",
    page.locator("[data-nn-e2e-flashcards-hub]").or(page.locator("[data-nn-e2e-start-review]")).first(),
  );
});

test("practice tests hub hero", async ({ page }) => {
  await page.goto(`/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`, { waitUntil: "domcontentloaded" });
  expect(page.url()).not.toMatch(/\/login/i);
  await captureWhenReady(page, "critical-practice-tests", page.locator("[data-route='practice-tests']").first());
});

/**
 * Production stability smoke: public pages must render independently and learner
 * entrypoints must fail closed/redirect without 5xx for unauthenticated users.
 *
 * Post-deploy:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://nursenest.ca \
 *     npx playwright test -c playwright.config.ts tests/e2e/production-stability-smoke.spec.ts --project=chromium
 */
import { expect, test, type Page } from "@playwright/test";

const publicRoutes = [
  "/pricing",
  "/blog",
  "/canada/rn/nclex-rn",
  "/canada/np/cnple",
  "/canada/rpn/rex-pn",
];

const learnerRoutes = [
  "/login",
  "/app/flashcards",
  "/app/practice-tests/cat-launch",
  "/app/practice-tests",
  "/app/cat",
];

async function gotoWithoutServerCrash(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response, `${path} returned no response`).toBeTruthy();
  expect(response!.status(), `${path} returned ${response!.status()}`).toBeLessThan(500);
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/useSession must be wrapped/i);
  await expect(page.locator("body")).not.toContainText(/Application error|Internal Server Error/i);
}

test.describe("Production stability smoke", () => {
  for (const route of publicRoutes) {
    test(`public route renders: ${route}`, async ({ page }) => {
      await gotoWithoutServerCrash(page, route);
      await expect(page.locator("main, [role='main'], body").first()).toBeVisible();
    });
  }

  for (const route of learnerRoutes) {
    test(`learner/auth route does not 5xx: ${route}`, async ({ page }) => {
      await gotoWithoutServerCrash(page, route);
      expect(new URL(page.url()).pathname).toMatch(/^\/(app|login|signup)/);
    });
  }
});

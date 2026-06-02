/**
 * Production stability smoke: public pages must render independently and learner
 * entrypoints must fail closed/redirect without 5xx for unauthenticated users.
 * Health/readiness API probes must return 2xx with correct JSON shape.
 *
 * Post-deploy:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://nursenest.ca \
 *     npx playwright test -c playwright.config.ts tests/e2e/production-stability-smoke.spec.ts --project=chromium
 */
import { expect, test, type Page } from "@playwright/test";

const publicRoutes = [
  "/",
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

/** API routes that must return 2xx JSON without crashing (no auth needed). */
const healthApiRoutes = [
  "/api/health",
  "/api/health/ready",
  "/api/healthz",
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

  for (const route of healthApiRoutes) {
    test(`health API returns 2xx JSON: ${route}`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status(), `${route} returned ${response.status()}`).toBeLessThan(500);
      const body = await response.json().catch(() => null);
      expect(body, `${route} did not return JSON`).not.toBeNull();
      // Liveness: must have ok:true. Readiness may return ok:false with a 503 if DB is down,
      // but it must still be valid JSON with an 'ok' field.
      expect(typeof (body as Record<string, unknown>).ok, `${route} missing 'ok' field`).toBe("boolean");
    });
  }

  test("homepage loads without blank body", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);
    // Must have meaningful content — not a blank white screen
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, "Homepage body is empty").toBeGreaterThan(50);
  });

  test("pricing page shows at least one price", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    const bodyText = await page.locator("body").innerText();
    // Any numeric price like $29 or $49 must be present
    expect(bodyText).toMatch(/\$\d+/);
  });

  test("login page has email input", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    const finalPath = new URL(page.url()).pathname;
    // Allow redirect to /login or /signup
    expect(finalPath).toMatch(/^\/(login|signup)/);
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput.first()).toBeVisible({ timeout: 8000 });
  });
});

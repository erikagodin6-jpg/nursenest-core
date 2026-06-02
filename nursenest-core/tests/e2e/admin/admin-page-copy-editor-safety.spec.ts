/**
 * Page copy editor + admin-only preview (staff credentials required).
 *
 * ```
 * npx playwright test tests/e2e/admin/admin-page-copy-editor-safety.spec.ts --project=chromium
 * ```
 */
import { expect, test } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Admin — page copy editor safety", () => {
  test("staged preview page renders for staff (RBAC)", async ({ page, baseURL }) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
    const creds = getAdminE2eCredentials();
    if (!creds) return;

    const origin = (() => {
      try {
        return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
      } catch {
        return "http://127.0.0.1:3000";
      }
    })();

    await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await marketingLoginSubmitButton(page).click();
    await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
      timeout: LOGIN_TIMEOUT_MS,
    });

    const previewUrl = `${origin}/admin/content/page-copy/preview?messageKey=${encodeURIComponent(
      "pages.home.hero.headline",
    )}&locale=en`;
    await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });

    await expect(page.getByRole("heading", { name: "Copy slot preview" })).toBeVisible({ timeout: NAV_TIMEOUT_MS });
    await expect(page.getByText("Staged draft")).toBeVisible();
  });

  test("anonymous GET of admin preview redirects or denies (no staff session)", async ({ browser, baseURL }) => {
    const origin = (() => {
      try {
        return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
      } catch {
        return "http://127.0.0.1:3000";
      }
    })();
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const previewUrl = `${origin}/admin/content/page-copy/preview?messageKey=pages.home.hero.headline&locale=en`;
    await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    const url = page.url();
    const isLogin = url.includes("/login");
    const isNotFound = url.includes("/404") || (await page.getByRole("heading", { name: /not found/i }).count()) > 0;
    expect(isLogin || isNotFound, `expected unauthenticated user to land on login or not-found; got ${url}`).toBe(
      true,
    );
    await ctx.close();
  });
});

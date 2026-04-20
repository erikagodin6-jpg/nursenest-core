/**
 * Regression: `/admin` proxy JWT read (secure cookie hint + fallback), staff DB gate, and tool reachability.
 *
 * Scheduling surface: `/admin/queue` (support + content + super tiers).
 * AI / generation hub: `/admin/generation` (same).
 *
 * Production (requires secrets in env, never committed):
 *   BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/admin/admin-auth-jwt-gate-regression.spec.ts --project=chromium
 *
 * Server-side gate proof (no token bodies): set `ADMIN_ACCESS_DEBUG=1` on the app briefly; stderr shows
 * `proxy_admin_gate` with `httpsSignal`, `primaryJwtReadOk`, `fallbackJwtReadOk`, `dbAdminRoleOk`, `correlationId`.
 */
import { expect, test } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { loginWithCredentials } from "../helpers/learner-login";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";
import { waitForLoginToCompleteOrAttachFailure } from "../helpers/smoke-login-diagnostics";
import { attachPageObservers } from "../helpers/attach-observers";

test.use({ storageState: { cookies: [], origins: [] } });

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;

function originFromBaseURL(baseURL: string | undefined): string {
  try {
    return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

async function assertAdminSurfaceNotLogin(page: import("@playwright/test").Page) {
  await expect(page).not.toHaveURL(/\/login/i, { timeout: 5_000 });
  await expect(page.locator("#login-identifier")).toHaveCount(0);
}

test.describe("Admin JWT gate regression — unauthenticated", () => {
  test("/admin redirects to sign-in (no oscillation)", async ({ page, baseURL }) => {
    const origin = originFromBaseURL(baseURL);
    const urls: string[] = [];
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) {
        try {
          urls.push(frame.url());
        } catch {
          /* ignore */
        }
      }
    });
    await page.context().clearCookies();
    await page.goto("about:blank");
    await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page).toHaveURL(/\/login/i, { timeout: 45_000 });
    await expect(page.locator("#login-identifier")).toBeVisible({ timeout: 15_000 });
    const tail = urls.slice(-12);
    const oscillation =
      tail.length >= 6 &&
      tail[tail.length - 1] === tail[tail.length - 3] &&
      tail[tail.length - 2] === tail[tail.length - 4];
    expect(oscillation, `possible redirect loop: ${JSON.stringify(tail)}`).toBe(false);
  });
});

test.describe("Admin JWT gate regression — non-admin", () => {
  test("signed-in learner cannot stay on /admin", async ({ page, baseURL }) => {
    const creds = getQaFreeCredentials();
    test.skip(!creds, "Set E2E_FREE_EMAIL + E2E_FREE_PASSWORD (or QA_FREE_*)");
    const origin = originFromBaseURL(baseURL);
    await loginWithCredentials(page, creds!.email, creds!.password, { navigationOrigin: origin });
    await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect
      .poll(() => new URL(page.url()).pathname, { timeout: 45_000 })
      .toMatch(/^\/app(\/|$)/);
    expect(new URL(page.url()).pathname.startsWith("/admin")).toBe(false);
  });
});

test.describe("Admin JWT gate regression — staff", () => {
  test("login, Admin dashboard link, direct /admin, reload, queue + generation hubs", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
    const creds = getAdminE2eCredentials();
    if (!creds) return;
    const origin = originFromBaseURL(baseURL);

    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true, probeAuthApi: true });
    try {
      await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.locator("#login-identifier").fill(creds.email);
      await page.locator("#login-password").fill(creds.password);
      await marketingLoginSubmitButton(page).click();
      await waitForLoginToCompleteOrAttachFailure(page, testInfo, observers, {
        label: "admin-jwt-gate-regression",
        timeoutMs: LOGIN_TIMEOUT_MS,
      });
    } finally {
      observers.dispose();
    }

    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    const adminCta = page.getByRole("link", { name: /Admin dashboard/i }).first();
    await expect(adminCta).toBeVisible({ timeout: 30_000 });
    await expect(adminCta).toHaveAttribute("href", "/admin");
    await adminCta.click();
    await expect(page).toHaveURL(/\/admin(?:\/|$)/, { timeout: 45_000 });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 45_000 });
    await expect(page.getByRole("heading", { name: /Admin Dashboard/i })).toBeVisible({ timeout: 30_000 });
    await assertAdminSurfaceNotLogin(page);

    await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 45_000 });
    await assertAdminSurfaceNotLogin(page);

    await page.reload({ waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 45_000 });
    expect(new URL(page.url()).pathname.startsWith("/admin")).toBe(true);
    await assertAdminSurfaceNotLogin(page);

    const secondTab = await page.context().newPage();
    try {
      await secondTab.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await expect(secondTab.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 45_000 });
      expect(new URL(secondTab.url()).pathname.startsWith("/admin")).toBe(true);
      await expect(secondTab).not.toHaveURL(/\/login/i, { timeout: 5_000 });
      await expect(secondTab.locator("#login-identifier")).toHaveCount(0);
    } finally {
      await secondTab.close();
    }

    await page.goto(`${origin}/admin/queue`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await assertAdminSurfaceNotLogin(page);
    await expect(page.getByRole("heading", { name: /Queue & background jobs/i })).toBeVisible({ timeout: 45_000 });

    await page.goto(`${origin}/admin/generation`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await assertAdminSurfaceNotLogin(page);
    await expect(page.getByRole("heading", { name: /Content generation/i })).toBeVisible({ timeout: 45_000 });

    expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
  });
});

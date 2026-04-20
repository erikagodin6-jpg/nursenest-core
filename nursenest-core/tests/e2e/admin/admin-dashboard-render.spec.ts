/**
 * Admin dashboard — shell renders quickly, data sections settle, no error fallbacks or console noise.
 *
 * **Credentials:** `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (`helpers/admin-e2e-credentials.ts`).
 *
 * ```
 * npx playwright test tests/e2e/admin/admin-dashboard-render.spec.ts --project=chromium
 * ```
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;
/** Shell + primary heading must appear within this window after navigation to `/admin` starts. */
const FIRST_PAINT_BUDGET_MS = 5000;
/** Suspense/streamed sections should finish within this window after first paint. */
const DATA_SETTLE_MS = 90_000;

test.use({ storageState: { cookies: [], origins: [] } });

function isIgnorableAdminDashboardConsole(text: string): boolean {
  return (
    /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text) ||
    /webpack-hmr|WebSocket connection.*_next\/webpack-hmr/i.test(text)
  );
}

test.describe("Admin — dashboard render contract", () => {
  test("Admin Dashboard + shell ≤5s; data settles; no error fallbacks; clean console", async ({
    page,
    baseURL,
  }, testInfo) => {
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

    const observers = attachPageObservers(page, {
      profile: "app",
      captureConsoleContext: true,
      probeAuthApi: false,
    });

    try {
      await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.locator("#login-identifier").fill(creds.email);
      await page.locator("#login-password").fill(creds.password);
      await marketingLoginSubmitButton(page).click();
      await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
        timeout: LOGIN_TIMEOUT_MS,
      });

      const navStart = Date.now();
      await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });

      await Promise.all([
        expect(page.getByTestId("admin-dashboard-shell"), "admin shell within first-paint budget").toBeVisible({
          timeout: FIRST_PAINT_BUDGET_MS,
        }),
        expect(
          page.getByRole("heading", { name: "Admin Dashboard", exact: true }),
          "Admin Dashboard heading within first-paint budget",
        ).toBeVisible({
          timeout: FIRST_PAINT_BUDGET_MS,
        }),
      ]);

      const firstPaintMs = Date.now() - navStart;
      expect(
        firstPaintMs,
        `Shell + heading visible within ${FIRST_PAINT_BUDGET_MS}ms wall clock (got ${firstPaintMs}ms)`,
      ).toBeLessThanOrEqual(FIRST_PAINT_BUDGET_MS);

      const adminPath = await page.evaluate(() => window.location.pathname);
      expect(adminPath.startsWith("/admin"), `expected /admin/*, got ${page.url()}`).toBe(true);
      expect(adminPath.includes("/login"), "staff should not be redirected to login on /admin").toBe(false);

      await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);
      await expect(page.getByText(/Application error/i)).toHaveCount(0);

      await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {
        /* dev / long-poll — non-fatal */
      });

      await page.waitForFunction(
        () => {
          const pendingOverview = document.querySelector('[data-testid="admin-overview-pending"]');
          const pendingCmd = document.querySelector('[data-testid="admin-command-center-pending"]');
          return !pendingOverview && !pendingCmd;
        },
        undefined,
        { timeout: DATA_SETTLE_MS },
      );

      await expect(page.getByTestId("admin-overview-fallback")).toHaveCount(0);
      await expect(page.getByTestId("admin-command-center-fallback")).toHaveCount(0);
      await expect(page.getByTestId("admin-legacy-operations-hub")).toBeVisible();

      const serious = observers.consoleErrors.filter((t) => !isIgnorableAdminDashboardConsole(t));
      expect(serious, serious.join(" | ")).toEqual([]);

      await testInfo.attach("admin-dashboard-render.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              origin,
              finalUrl: page.url(),
              firstPaintMs,
              firstPaintBudgetMs: FIRST_PAINT_BUDGET_MS,
            },
            null,
            2,
          ),
        ),
        contentType: "application/json",
      });
    } finally {
      observers.dispose();
    }
  });
});

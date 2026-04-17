/**
 * Staff admin: login → `/admin` — dashboard shell, nav probes, authorized admin APIs.
 *
 * **Credentials:** `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (see `helpers/admin-e2e-credentials.ts`).
 *
 * Run: `npx playwright test tests/e2e/admin/admin-dashboard-access.spec.ts --project=chromium`
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { attachAdminResponseTap, attachRedirectLog, attachSlowRequestTap } from "../helpers/smoke-evidence";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;
const SLOW_MS = 3000;

test.use({ storageState: { cookies: [], origins: [] } });

async function attachFailureScreenshot(page: Page, testInfo: import("@playwright/test").TestInfo, name: string) {
  const buf = await page.screenshot({ fullPage: true }).catch(() => null);
  if (buf) {
    await testInfo.attach(name, { body: buf, contentType: "image/png" });
  }
}

function isIgnorableAuthMarketingConsole(text: string): boolean {
  return (
    /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text) ||
    /hydration mismatch|hydrated but some attributes of the server rendered HTML/i.test(text) ||
    /\[marketing-i18n\]/i.test(text) ||
    /\[MarketingI18nProvider\]/i.test(text) ||
    /next-image-unconfigured-qualities|images\.qualities/i.test(text) ||
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text) ||
    /webpack-hmr|WebSocket connection.*_next\/webpack-hmr/i.test(text)
  );
}

test.describe("Admin — dashboard access", () => {
  test("QA admin login, /admin loads, nav clickable, admin APIs authorized", async ({ page, baseURL }, testInfo) => {
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

    const redirects: string[] = [];
    const detachRedirect = attachRedirectLog(page, redirects);

    const apiHits: { url: string; status: number; method: string }[] = [];
    const apiErrors: { url: string; status: number; method: string }[] = [];
    const adminApiHits: { url: string; status: number; method: string }[] = [];
    const detachResponse = attachAdminResponseTap(page, origin, apiHits, apiErrors, adminApiHits);

    const slowRequests: { url: string; ms: number }[] = [];
    const detachSlow = attachSlowRequestTap(page, origin, slowRequests, SLOW_MS);

    const observers: PageObservers = attachPageObservers(page, {
      profile: "app",
      captureConsoleContext: true,
      probeAuthApi: true,
    });

    try {
      await test.step("Sign in", async () => {
        await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
        await page.locator("#login-identifier").fill(creds.email);
        await page.locator("#login-password").fill(creds.password);
        await marketingLoginSubmitButton(page).click();
        await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
          timeout: LOGIN_TIMEOUT_MS,
        });
      });

      await test.step("Open /admin", async () => {
        await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
        await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});

        const adminPath = await page.evaluate(() => window.location.pathname).catch(() => "");
        expect(adminPath.startsWith("/admin"), `expected /admin/*, got ${page.url()}`).toBe(true);
        expect(adminPath.includes("/login"), "admin should not bounce to login for staff").toBe(false);
      });

      await test.step("Header Admin link → /admin (marketing shell)", async () => {
        await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
        const adminCta = page.getByRole("link", { name: /Admin dashboard/i }).first();
        await expect(adminCta, "site header should expose /admin for staff").toBeVisible({ timeout: 20_000 });
        await expect(adminCta).toHaveAttribute("href", "/admin");
        await adminCta.click();
        await page.waitForURL((url) => url.pathname.startsWith("/admin"), { timeout: 45_000 });
        await expect(page.getByRole("heading", { name: /Admin Dashboard/i })).toBeVisible({ timeout: 90_000 });
        await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);
      });

      await test.step("Dashboard content", async () => {
        const headings = await page
          .locator("h1, h2")
          .allInnerTexts()
          .then((xs) => xs.map((t) => t.trim()).filter(Boolean))
          .catch(() => [] as string[]);
        const hasAdminHeading =
          (await page.getByRole("heading", { name: /Admin Dashboard/i }).count().catch(() => 0)) > 0;
        expect(
          hasAdminHeading || headings.some((h) => /admin/i.test(h)),
          "admin dashboard should show a recognizable heading",
        ).toBe(true);
      });

      await test.step("Key nav links", async () => {
        const tryLinks = ["/admin/access", "/admin/users"] as const;
        for (const href of tryLinks) {
          const link = page.locator(`a[href="${href}"]`).first();
          if ((await link.count()) === 0) continue;
          await link.click({ timeout: 15_000 }).catch(() => {});
          await page.waitForLoadState("domcontentloaded", { timeout: 20_000 }).catch(() => {});
          await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
        }
        const menuBtn = page.getByRole("button", { name: /^Menu$/i }).first();
        if (await menuBtn.isVisible().catch(() => false)) {
          await menuBtn.click().catch(() => {});
        }
      });

      await test.step("Admin APIs", async () => {
        const health = await page.request.get(`${origin}/api/admin/operations-health`);
        expect(health.status(), "operations-health must not be 401/403 for staff").not.toBe(401);
        expect(health.status()).not.toBe(403);

        const adminAuthFailures = adminApiHits.filter((h) => h.status === 401 || h.status === 403);
        expect(
          adminAuthFailures.length,
          `unexpected 401/403 admin XHR: ${JSON.stringify(adminAuthFailures)}`,
        ).toBe(0);
      });

      const significantConsole = observers.consoleErrors.filter((t) => !isIgnorableAuthMarketingConsole(t));
      expect(significantConsole, significantConsole.join(" | ")).toEqual([]);
    } catch (e) {
      await attachFailureScreenshot(page, testInfo, "admin-dashboard-access-failure.png");
      throw e;
    } finally {
      detachRedirect();
      detachResponse();
      detachSlow();
      await testInfo.attach("admin-dashboard-access-capture.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              finalUrl: page.url(),
              redirects: redirects.slice(-40),
              consoleErrors: observers.consoleErrors,
              failedRequests: observers.failedRequests,
              authHttp: observers.authHttp ?? [],
              slowRequestsMs: slowRequests.slice(-25),
              adminApiSample: adminApiHits.slice(-25),
              apiErrorsSample: apiErrors.slice(-20),
            },
            null,
            2,
          ),
          "utf-8",
        ),
        contentType: "application/json",
      });
      observers.dispose();
    }
  });
});

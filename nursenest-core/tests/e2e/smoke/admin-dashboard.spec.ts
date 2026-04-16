import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachAdminResponseTap,
  attachRedirectLog,
  attachSlowRequestTap,
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/smoke-credentials";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;
const SLOW_MS = 3000;

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — admin dashboard", () => {
  test("staff login, /admin loads, nav probes, admin API authorized", async ({ page, baseURL }, testInfo) => {
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

    const observers = attachPageObservers(page, {
      profile: "app",
      captureConsoleContext: true,
      probeAuthApi: true,
    });

    try {
      await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.locator("#login-identifier").fill(creds.email);
      await page.locator("#login-password").fill(creds.password);
      await page.getByRole("button", { name: /^Sign In$/i }).click();

      await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
        timeout: LOGIN_TIMEOUT_MS,
      });

      await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});

      const adminPath = await page.evaluate(() => window.location.pathname).catch(() => "");
      expect(adminPath.startsWith("/admin"), `expected /admin/*, got ${page.url()}`).toBe(true);
      expect(adminPath.includes("/login"), "admin route should not redirect to login when staff").toBe(false);

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

      const health = await page.request.get(`${origin}/api/admin/operations-health`);
      expect(health.status(), "admin operations-health must not be 401/403 for staff").not.toBe(401);
      expect(health.status()).not.toBe(403);

      const adminAuthFailures = adminApiHits.filter((h) => h.status === 401 || h.status === 403);
      expect(
        adminAuthFailures.length,
        `unexpected 401/403 admin XHR: ${JSON.stringify(adminAuthFailures)}`,
      ).toBe(0);

      await attachSmokeCapture(testInfo, "admin-dashboard", {
        ...buildCaptureFromObservers(page, observers, {
          slowRequestsMs: slowRequests.slice(-25),
          redirects: redirects.slice(-40),
        }),
      });

      await testInfo.attach("admin-dashboard-detail.json", {
        body: Buffer.from(
          JSON.stringify(
            {
              finalUrl: page.url(),
              redirects,
              visibleHeadingsSample: headings.slice(0, 20),
              adminApiSample: adminApiHits.slice(-25),
              apiErrorsSample: apiErrors.slice(-20),
              slowRequestsMs: slowRequests.slice(-25),
              operationsHealthStatus: health.status(),
            },
            null,
            2,
          ),
          "utf-8",
        ),
        contentType: "application/json",
      });

      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeFailureScreenshot(page, testInfo, "admin-dashboard-failure.png");
      throw e;
    } finally {
      detachRedirect();
      detachResponse();
      detachSlow();
      observers.dispose();
    }
  });
});

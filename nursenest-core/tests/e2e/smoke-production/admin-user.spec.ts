/**
 * Staff admin QA — `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (read-only navigation).
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  buildCaptureFromObservers,
} from "../helpers/smoke-evidence";
import { attachSmokeProductionFailure } from "../helpers/smoke-production-diagnostics";
import { waitForLoginToCompleteOrAttachFailure } from "../helpers/smoke-login-diagnostics";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Admin user", () => {
  test("login, /admin loads, key pages reachable", async ({ page, baseURL }, testInfo) => {
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

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
    try {
      await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.locator("#login-identifier").fill(creds.email);
      await page.locator("#login-password").fill(creds.password);
      await page.getByRole("button", { name: /^Sign In$/i }).click();

      await waitForLoginToCompleteOrAttachFailure(page, testInfo, observers, {
        label: "admin-user",
        timeoutMs: 120_000,
      });

      await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});

      const adminPath = await page.evaluate(() => window.location.pathname).catch(() => "");
      expect(adminPath.startsWith("/admin"), `expected /admin/*, got ${page.url()}`).toBe(true);
      expect(adminPath.includes("/login"), "admin should not redirect to login for staff").toBe(false);

      const hasAdminHeading =
        (await page.getByRole("heading", { name: /Admin Dashboard/i }).count().catch(() => 0)) > 0;
      const headings = await page
        .locator("h1, h2")
        .allInnerTexts()
        .then((xs) => xs.map((t) => t.trim()).filter(Boolean))
        .catch(() => [] as string[]);
      expect(
        hasAdminHeading || headings.some((h) => /admin/i.test(h)),
        "admin dashboard should show a recognizable heading",
      ).toBe(true);

      const tryLinks = ["/admin/access", "/admin/users"] as const;
      for (const href of tryLinks) {
        const link = page.locator(`a[href="${href}"]`).first();
        if ((await link.count()) === 0) continue;
        await expect(link).toBeVisible({ timeout: 10_000 });
        await expect(link).toBeEnabled({ timeout: 5_000 });
        await link.click({ timeout: 15_000 }).catch(() => {});
        await page.waitForLoadState("domcontentloaded", { timeout: 25_000 }).catch(() => {});
        await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
      }

      const menuBtn = page.getByRole("button", { name: /^Menu$/i }).first();
      if (await menuBtn.isVisible().catch(() => false)) {
        await menuBtn.click().catch(() => {});
      }

      const health = await page.request.get(`${origin}/api/admin/operations-health`);
      expect(health.status(), "operations-health must not be 401/403 for staff").not.toBe(401);
      expect(health.status()).not.toBe(403);

      await attachSmokeCapture(testInfo, "admin-user", buildCaptureFromObservers(page, observers));
      expect(observers.consoleErrors, observers.consoleErrors.join(" | ")).toEqual([]);
    } catch (e) {
      await attachSmokeProductionFailure(testInfo, page, observers, "admin-user");
      await attachSmokeFailureScreenshot(page, testInfo, "admin-user-failure.png");
      throw e;
    } finally {
      observers.dispose();
    }
  });
});

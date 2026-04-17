/**
 * Production-safe admin flow verification (bounded; uses env credentials only).
 *
 * Admin: E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD
 * Non-admin: E2E_FREE_EMAIL + E2E_FREE_PASSWORD (or QA_FREE_*)
 */
import { expect, test } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";

test.use({ storageState: { cookies: [], origins: [] } });

const TIMEOUT = 120_000;

/** Decorative / full-mark CDN patterns we do not want on admin shells (leaf-only policy on errors). */
const FORBIDDEN_IMG_SRC_SUBSTR = ["full-mark", "brand-arch", "arch-transparent", "logo-full", "wordmark-full"];

test("1–5 Admin: login, header, /admin, dashboard shell, no forbidden mark assets", async ({
  page,
  baseURL,
}, testInfo) => {
  test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
  const adminCreds = getAdminE2eCredentials();
  if (!adminCreds) return;

  const origin = (() => {
    try {
      return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    } catch {
      return "http://127.0.0.1:3000";
    }
  })();

  try {
    await test.step("1. Admin login", async () => {
      await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.locator("#login-identifier").fill(adminCreds.email);
      await page.locator("#login-password").fill(adminCreds.password);
      await marketingLoginSubmitButton(page).click();
      await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
        timeout: TIMEOUT,
      });
    });

    await test.step("2–3. Header Admin dashboard link → /admin", async () => {
      await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
      const adminCta = page.getByRole("link", { name: /Admin dashboard/i }).first();
      await expect(adminCta).toBeVisible({ timeout: 25_000 });
      await expect(adminCta).toHaveAttribute("href", "/admin");
      await adminCta.click();
      await page.waitForURL((u) => u.pathname.startsWith("/admin"), { timeout: 60_000 });
    });

    await test.step("4. Real dashboard shell (not error recovery)", async () => {
      await expect(page.getByRole("heading", { name: /Admin Dashboard/i })).toBeVisible({
        timeout: 90_000,
      });
      await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);
    });

    await test.step("5. No forbidden full-mark / arch imagery in main", async () => {
      const imgs = page.locator("main img[src]");
      const n = await imgs.count();
      for (let i = 0; i < Math.min(n, 50); i++) {
        const src = (await imgs.nth(i).getAttribute("src")) ?? "";
        const lower = src.toLowerCase();
        for (const sub of FORBIDDEN_IMG_SRC_SUBSTR) {
          expect(lower.includes(sub), `unexpected asset fragment "${sub}" in src=${src.slice(0, 160)}`).toBe(false);
        }
      }
    });
  } catch (e) {
    const buf = await page.screenshot({ fullPage: true }).catch(() => null);
    if (buf) {
      await testInfo.attach("admin-verify-1-5-failure.png", { body: buf, contentType: "image/png" });
    }
    throw e;
  }
});

test("6 Non-admin: cannot stay on /admin", async ({ page, baseURL }, testInfo) => {
  const free = getQaFreeCredentials();
  test.skip(!free, "Set E2E_FREE_EMAIL + E2E_FREE_PASSWORD (or QA_FREE_*)");

  const origin = (() => {
    try {
      return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    } catch {
      return "http://127.0.0.1:3000";
    }
  })();

  try {
    await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("#login-identifier").fill(free.email);
    await page.locator("#login-password").fill(free.password);
    await marketingLoginSubmitButton(page).click();
    await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
      timeout: TIMEOUT,
    });
    await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForTimeout(2000);
    const path = await page.evaluate(() => window.location.pathname);
    expect(path.startsWith("/admin"), `expected redirect off /admin for learner; still on ${page.url()}`).toBe(
      false,
    );
  } catch (e) {
    const buf = await page.screenshot({ fullPage: true }).catch(() => null);
    if (buf) {
      await testInfo.attach("admin-verify-6-failure.png", { body: buf, contentType: "image/png" });
    }
    throw e;
  }
});

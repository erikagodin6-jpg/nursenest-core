/**
 * Admin chrome + /admin navigation — real browser verification (marketing, locale, learner bar, admin shell).
 *
 * Credentials:
 * - Staff: `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD` (see `helpers/admin-e2e-credentials.ts`)
 * - Non-admin learner: `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD` (or `QA_FREE_*` — `helpers/smoke-credentials.ts`)
 *
 * Run (from `nursenest-core/`):
 *   npx playwright test tests/e2e/admin/admin-access-shell-verification.spec.ts --project=chromium
 */
import { expect, test, type Frame, type Page } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { loginWithCredentials } from "../helpers/learner-login";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";
import { getQaFreeCredentials } from "../helpers/smoke-credentials";
import { waitForLoginToCompleteOrAttachFailure } from "../helpers/smoke-login-diagnostics";
import { attachPageObservers } from "../helpers/attach-observers";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;

test.use({ storageState: { cookies: [], origins: [] } });

function originFromBaseURL(baseURL: string | undefined): string {
  try {
    return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

function attachMainFrameUrlTap(page: Page, urls: string[]): () => void {
  const fn = (frame: Frame) => {
    if (frame === page.mainFrame()) {
      try {
        urls.push(frame.url());
      } catch {
        /* ignore */
      }
    }
  };
  page.on("framenavigated", fn);
  return () => page.off("framenavigated", fn);
}

async function loginStaffViaMarketingForm(page: Page, baseURL: string | undefined, testInfo: import("@playwright/test").TestInfo) {
  const creds = getAdminE2eCredentials();
  if (!creds) throw new Error("missing admin creds");
  const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true, probeAuthApi: true });
  try {
    await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await marketingLoginSubmitButton(page).click();
    await waitForLoginToCompleteOrAttachFailure(page, testInfo, observers, {
      label: "admin-access-verification",
      timeoutMs: LOGIN_TIMEOUT_MS,
    });
  } finally {
    observers.dispose();
  }
}

test.describe("Admin access — guest", () => {
  test("direct /admin redirects to login; marketing header has no /admin link", async ({ page, baseURL }) => {
    const origin = originFromBaseURL(baseURL);
    const urls: string[] = [];
    const detach = attachMainFrameUrlTap(page, urls);

    try {
      await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await expect(page).toHaveURL(/\/login/i, { timeout: 30_000 });
      const path = new URL(page.url()).pathname;
      expect(path.includes("login"), `expected login surface, got ${page.url()}`).toBe(true);

      await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await expect(page.locator("header").locator('a[href="/admin"]')).toHaveCount(0);
    } finally {
      detach();
    }

    const tail = urls.slice(-12);
    const oscillation =
      tail.length >= 6 &&
      tail[tail.length - 1] === tail[tail.length - 3] &&
      tail[tail.length - 2] === tail[tail.length - 4];
    expect(oscillation, `possible redirect loop (last URLs): ${JSON.stringify(tail)}`).toBe(false);
  });
});

test.describe("Admin access — authenticated non-admin learner", () => {
  test("no admin chrome on marketing + learner menu; /admin sends user away from admin surface", async ({
    page,
    baseURL,
  }) => {
    const creds = getQaFreeCredentials();
    test.skip(!creds, "Set E2E_FREE_EMAIL + E2E_FREE_PASSWORD (or QA_FREE_*)");

    const origin = originFromBaseURL(baseURL);
    await loginWithCredentials(page, creds!.email, creds!.password);

    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.locator("header").locator('a[href="/admin"]')).toHaveCount(0);
    await expect(page.locator("footer").locator('a[href="/admin"]')).toHaveCount(0);

    await page.goto(`${origin}/de`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS }).catch(() => {});
    if (new URL(page.url()).pathname.startsWith("/de")) {
      await expect(page.locator("header").locator('a[href="/admin"]')).toHaveCount(0);
    }

    await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    const userMenuBtn = page.locator('button[aria-haspopup="menu"]').filter({ has: page.locator("text=/@/") }).first();
    if ((await userMenuBtn.count()) > 0 && (await userMenuBtn.isVisible().catch(() => false))) {
      await userMenuBtn.click({ timeout: 10_000 }).catch(() => {});
      await expect(page.locator('[role="menu"] a[href="/admin"]')).toHaveCount(0);
    }

    const urls: string[] = [];
    const detach = attachMainFrameUrlTap(page, urls);
    try {
      await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
      await expect
        .poll(() => new URL(page.url()).pathname, { timeout: 45_000 })
        .toMatch(/^\/app(\/|$)/);
      expect(new URL(page.url()).pathname.startsWith("/admin"), "learner must not remain on /admin").toBe(false);
    } finally {
      detach();
    }

    const tail = urls.slice(-15);
    const oscillation =
      tail.length >= 6 &&
      tail[tail.length - 1] === tail[tail.length - 3] &&
      tail[tail.length - 2] === tail[tail.length - 4];
    expect(oscillation, `possible redirect loop: ${JSON.stringify(tail)}`).toBe(false);
  });
});

test.describe("Admin access — staff (DB + JWT)", () => {
  test("marketing + locale header, click/direct/reload/return; learner bar; mobile menu; admin shell usable", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
    const origin = originFromBaseURL(baseURL);

    await loginStaffViaMarketingForm(page, baseURL, testInfo);

    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    const marketingAdmin = page.locator("header").locator('a[href="/admin"]').first();
    await expect(marketingAdmin).toBeVisible({ timeout: 30_000 });
    await expect(marketingAdmin).toHaveAttribute("href", "/admin");

    await page.goto(`${origin}/de`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS }).catch(() => {});
    if (new URL(page.url()).pathname.startsWith("/de")) {
      const deAdmin = page.locator("header").locator('a[href="/admin"]').first();
      await expect(deAdmin).toBeVisible({ timeout: 20_000 });
    }

    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await page.locator("header").locator('a[href="/admin"]').first().click();
    await expect(page).toHaveURL(/\/admin(?:\/|$)/, { timeout: 30_000 });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 25_000 });
    await expect(page.getByRole("heading", { name: "Admin Dashboard", exact: true })).toBeVisible({
      timeout: 25_000,
    });

    await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 25_000 });

    await page.reload({ waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 25_000 });
    expect(new URL(page.url()).pathname.startsWith("/admin"), `hard refresh should stay on admin, got ${page.url()}`).toBe(
      true,
    );

    await page.goto(`${origin}/pricing`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await page.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 25_000 });

    await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    const learnerMenuBtn = page.locator('button[aria-haspopup="menu"]').filter({ has: page.locator("text=/@/") }).first();
    if ((await learnerMenuBtn.count()) > 0 && (await learnerMenuBtn.isVisible().catch(() => false))) {
      await learnerMenuBtn.click({ timeout: 10_000 }).catch(() => {});
      const barAdmin = page.locator('[role="menu"] a[href="/admin"]').first();
      if ((await barAdmin.count()) > 0) {
        await barAdmin.click({ timeout: 15_000 });
        await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 25_000 });
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    const menuBtn = page.getByRole("button", { name: /open menu|menu/i }).first();
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click();
      const mobileAdmin = page.locator('a[href="/admin"]').filter({ visible: true }).first();
      await expect(mobileAdmin).toBeVisible({ timeout: 15_000 });
    }
  });
});

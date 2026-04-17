import { expect, type Browser, type Page } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "./admin-e2e-credentials";
import { marketingLoginSubmitButton } from "./marketing-login-locators";
import { getQaFreeCredentials } from "./smoke-credentials";

const LOGIN_TIMEOUT_MS = 120_000;
const ADMIN_ROLE_NAMES = new Set(["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "SUPPORT_ADMIN"]);

function resolveOrigin(baseURL?: string): string {
  try {
    return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

async function loginThroughMarketingForm(page: Page, origin: string, email: string, password: string): Promise<void> {
  await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator("#login-identifier").fill(email);
  await page.locator("#login-password").fill(password);
  await marketingLoginSubmitButton(page).click();
  await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
    timeout: LOGIN_TIMEOUT_MS,
  });
}

async function debugMeSnapshot(page: Page, origin: string): Promise<{ role: string | null; isAdmin: boolean } | null> {
  const response = await page.request.get(`${origin}/api/debug/me`);
  if (response.status() !== 200) return null;

  const payload = (await response.json()) as { role?: string | null; isAdmin?: boolean };
  return {
    role: payload.role ?? null,
    isAdmin: Boolean(payload.isAdmin),
  };
}

export async function verifyTestAccounts(browser: Browser, baseURL?: string): Promise<void> {
  const admin = getAdminE2eCredentials();
  const free = getQaFreeCredentials();
  if (!hasAdminE2eCredentials() || !admin || !free) return;

  const origin = resolveOrigin(baseURL);

  const adminContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  try {
    const adminPage = await adminContext.newPage();
    await loginThroughMarketingForm(adminPage, origin, admin.email, admin.password);
    const adminDebug = await debugMeSnapshot(adminPage, origin);
    if (adminDebug) {
      expect(adminDebug.isAdmin, `expected ${admin.email} to be admin in /api/debug/me`).toBe(true);
      expect(
        adminDebug.role && ADMIN_ROLE_NAMES.has(adminDebug.role),
        `unexpected admin role for ${admin.email}: ${adminDebug.role ?? "null"}`,
      ).toBe(true);
    }
    await adminPage.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await adminPage.waitForURL((u) => u.pathname.startsWith("/admin"), { timeout: 60_000 });
  } finally {
    await adminContext.close();
  }

  const freeContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  try {
    const freePage = await freeContext.newPage();
    await loginThroughMarketingForm(freePage, origin, free.email, free.password);
    const freeDebug = await debugMeSnapshot(freePage, origin);
    if (freeDebug) {
      expect(freeDebug.isAdmin, `expected ${free.email} to be non-admin in /api/debug/me`).toBe(false);
      expect(
        freeDebug.role == null || !ADMIN_ROLE_NAMES.has(freeDebug.role),
        `free QA account is incorrectly admin: ${free.email} (${freeDebug.role ?? "null"})`,
      ).toBe(true);
    }
    await freePage.goto(`${origin}/admin`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await freePage.waitForTimeout(1500);
    const redirectedPath = new URL(freePage.url()).pathname;
    expect(redirectedPath, `expected ${free.email} to be redirected off /admin`).not.toContain("/admin");
    expect(
      redirectedPath === "/" || redirectedPath === "/app" || redirectedPath.startsWith("/app/"),
      `expected ${free.email} to land on / or /app, got ${redirectedPath}`,
    ).toBe(true);
  } finally {
    await freeContext.close();
  }
}

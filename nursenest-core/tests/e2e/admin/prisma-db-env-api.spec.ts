/**
 * Prisma datasource env — staff-only `/api/debug/db-env` returns safe booleans (no secrets).
 *
 * Validates production-style configuration: `DATABASE_URL` + `DIRECT_URL` both present (Prisma `directUrl`).
 *
 * **Credentials:** `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (staff session required).
 *
 * ```
 * npx playwright test tests/e2e/admin/prisma-db-env-api.spec.ts --project=chromium
 * ```
 */
import { expect, test } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";

const LOGIN_TIMEOUT_MS = 120_000;
const NAV_TIMEOUT_MS = 60_000;

test.use({ storageState: { cookies: [], origins: [] } });

type DbEnvPayload = {
  hasDatabaseUrl: boolean;
  hasDirectUrl: boolean;
  usingDirectUrl: boolean;
};

test.describe("Admin — Prisma db env API", () => {
  test("/api/debug/db-env returns safe flags; production expects all true", async ({ page, baseURL }) => {
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

    const res = await page.request.get(`${origin}/api/debug/db-env`);
    expect(res.status(), `GET /api/debug/db-env → HTTP ${res.status()}`).toBe(200);

    const json = (await res.json()) as DbEnvPayload;
    expect(typeof json.hasDatabaseUrl, "hasDatabaseUrl must be boolean").toBe("boolean");
    expect(typeof json.hasDirectUrl, "hasDirectUrl must be boolean").toBe("boolean");
    expect(typeof json.usingDirectUrl, "usingDirectUrl must be boolean").toBe("boolean");

    expect(json.hasDatabaseUrl, "DATABASE_URL must be set for Prisma").toBe(true);
    expect(json.hasDirectUrl, "DIRECT_URL must be set (Prisma directUrl / migrate)").toBe(true);
    expect(
      json.usingDirectUrl,
      "Prisma must have both DATABASE_URL and DIRECT_URL (pooled + direct datasource pattern)",
    ).toBe(true);
  });
});

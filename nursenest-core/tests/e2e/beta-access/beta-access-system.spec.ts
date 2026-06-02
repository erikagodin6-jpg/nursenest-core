import { expect, test } from "@playwright/test";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

const NAV_TIMEOUT_MS = 60_000;
const LOGIN_TIMEOUT_MS = 120_000;

test.describe("Beta access system", () => {
  test("admin reporting surface renders and tester export is authorized", async ({ page, baseURL }) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
    const creds = getAdminE2eCredentials();
    if (!creds) return;
    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;

    await page.context().clearCookies();
    await page.goto("/login", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await marketingLoginSubmitButton(page).click();
    await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
      timeout: LOGIN_TIMEOUT_MS,
    });

    await page.goto(`${origin}/admin/beta`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    await expect(page.getByRole("heading", { name: "Beta Access Management" })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("heading", { name: "Create beta code" })).toBeVisible();
    await expect(page.getByText("Tester analytics")).toBeVisible();

    const exportResponse = await page.request.get(`${origin}/api/admin/beta/testers/export`);
    expect(exportResponse.status(), "tester CSV export should be available to staff").toBe(200);
    expect(exportResponse.headers()["content-type"] ?? "").toContain("text/csv");
  });

  test("learner redemption and feedback surface is discoverable from Account Settings", async ({ page }) => {
    test.skip(!getPaidTestCredentials(), "Requires paid learner credentials/storage state");

    await page.goto("/app/account/settings", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    expectNotLoginUrl(page, "account settings");
    await expect(page.getByRole("link", { name: /Beta Program/i })).toBeVisible({ timeout: 30_000 });

    await page.goto("/app/account/beta", { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
    expectNotLoginUrl(page, "beta program");
    await expect(page.getByRole("heading", { name: "Beta Program" })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByPlaceholder("FLASHCARDS-V2")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send feedback" })).toBeVisible();
  });
});

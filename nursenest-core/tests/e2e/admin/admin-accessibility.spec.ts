import { expect, test } from "@playwright/test";
import { expectNoBlockingA11yViolations } from "../helpers/accessibility";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";

test.describe("Admin accessibility smoke", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("admin shell", async ({ page }, testInfo) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
    const creds = getAdminE2eCredentials();
    if (!creds) return;

    await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await marketingLoginSubmitButton(page).click();
    await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, {
      timeout: 120_000,
    });

    await page.goto("/admin", { waitUntil: "domcontentloaded", timeout: 60_000 });
    await expect(page.getByTestId("admin-dashboard-shell")).toBeVisible({ timeout: 60_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "admin-shell" });
  });
});

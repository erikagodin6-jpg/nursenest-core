import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke — post-login marketing shell continuity", () => {
  test("homepage → login with resume=/ → stays on marketing shell; navigation landmarks stable", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".nn-marketing-surface")).toBeVisible({ timeout: 30_000 });

    const navCountBefore = await page.getByRole("navigation").count();
    expect(navCountBefore, "homepage should expose at least one navigation landmark").toBeGreaterThan(0);

    const resume = "/";
    await loginWithCredentials(page, creds!.email, creds!.password, {
      enterLearnerApp: false,
      loginUrl: `/login?callbackUrl=${encodeURIComponent(resume)}`,
    });

    const pathname = new URL(page.url()).pathname;
    expect(pathname, "should leave /login").not.toMatch(/\/login/i);
    expect(pathname.startsWith("/app"), "resume=/ must not jump into learner app shell").toBe(false);

    await expect(page).not.toHaveURL(/\/app(\/|$)/);
    await expect(page.locator(".nn-marketing-surface")).toBeVisible({ timeout: 45_000 });

    const navCountAfter = await page.getByRole("navigation").count();
    expect(
      navCountAfter,
      "navigation landmarks should not collapse after login (same marketing chrome family)",
    ).toBeGreaterThanOrEqual(navCountBefore);
  });
});

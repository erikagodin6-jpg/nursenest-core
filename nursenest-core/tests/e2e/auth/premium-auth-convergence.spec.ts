import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

const authRoutes = [
  { path: "/login", hook: '[data-nn-premium-auth-system="login"]', heading: /sign in|welcome back/i },
  { path: "/signup", hook: '[data-nn-premium-auth-system="signup"]', heading: /create account|start/i },
  { path: "/forgot-password", hook: '[data-nn-premium-auth-system="recovery"]', heading: /forgot|reset.*password/i },
  { path: "/reset-password?token=short", hook: '[data-nn-premium-auth-system="reset"]', heading: /reset|new password|choose/i },
] as const;

const themes = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "page should not horizontally overflow").toBeLessThanOrEqual(2);
}

test.describe("Premium auth convergence", () => {
  for (const route of authRoutes) {
    test(`${route.path} renders premium auth shell`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.ok(), `HTTP ${response?.status()} for ${route.path}`).toBeTruthy();

      await expect(page.locator(route.hook)).toBeVisible({ timeout: 30_000 });
      await expect(page.locator("[data-nn-premium-auth-card]")).toBeVisible();
      await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /terms/i }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /privacy/i }).first()).toBeVisible();
      await expect(
        page.locator("[data-nn-premium-auth-legal]").getByText(/does not provide medical advice, diagnosis, or treatment/i),
      ).toBeVisible();
    });
  }

  test("Sign Up exposes pathway selection and legal links", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-premium-auth-signup-pathway]')).toBeVisible();
    await expect(page.locator('[data-nn-premium-auth-signup-pathway]').getByText("Choose Your Pathway")).toBeVisible();
    await expect(page.locator("[data-nn-premium-auth-pathways]").getByText("RN / NCLEX-RN")).toBeVisible();
    await expect(page.locator("[data-nn-premium-auth-pathways]").getByText("Pre-Nursing")).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("session expired recovery preserves premium shell", async ({ page }) => {
    await page.goto("/login?session=expired&callbackUrl=%2Fapp%2Fflashcards%3FpathwayId%3Dus-rn-nclex-rn", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("[data-nn-premium-auth-session-expired]")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/please sign in again/i)).toBeVisible();
    await expect(page.getByText(/progress is saved/i)).toBeVisible();
  });

  test("Sign In exposes recovery, legal, account-creation, and premium OAuth hooks", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /reset.*password|forgot password/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up|create account/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    const oauthRegion = page.locator("[data-nn-premium-auth-oauth]");
    const oauthCount = await oauthRegion.count();
    if (oauthCount > 0) {
      await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
      await expect(oauthRegion.locator(".nn-premium-auth-oauth-button").first()).toBeVisible();
    }
  });

  test("verification and auth error states render inside premium shell", async ({ page }) => {
    await page.goto("/login?verify=expired", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-nn-premium-auth-verification]")).toBeVisible();
    await expect(page.getByText(/expired/i)).toBeVisible();

    await page.goto("/reset-password?token=short", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-nn-premium-auth-error-state]")).toBeVisible();
  });

  test("mobile auth layout is keyboard-safe and does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-premium-auth-system="signup"]')).toBeVisible();
    await expect(page.locator("[data-nn-premium-auth-story]")).toBeHidden();
    await expect(page.locator("[data-nn-premium-auth-card]")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("theme parity preserves premium auth structure across all five themes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const theme of themes) {
      await page.goto(`/login?theme=${theme}`, { waitUntil: "domcontentloaded" });
      await page.evaluate((themeName) => document.documentElement.setAttribute("data-theme", themeName), theme);
      await expect(page.locator('[data-nn-premium-auth-system="login"]')).toBeVisible();
      await expect(page.locator("[data-nn-premium-auth-story]")).toBeVisible();
      await expect(page.locator("[data-nn-premium-auth-card]")).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });
});

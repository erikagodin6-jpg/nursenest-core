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
    await expect(page.locator("[data-nn-auth-signup-pathways]")).toBeVisible();
    await expect(page.getByText("Choose your pathway").first()).toBeVisible();
    await expect(page.locator("[data-nn-auth-signup-pathways]").getByText("RN")).toBeVisible();
    await expect(page.locator("[data-nn-auth-signup-pathways]").getByText("NCLEX-RN")).toBeVisible();
    await expect(page.getByRole("button", { name: /^continue$/i })).toBeVisible();
  });

  test("session expired recovery preserves premium shell", async ({ page }) => {
    await page.goto("/login?session=expired&callbackUrl=%2Fapp%2Fflashcards%3FpathwayId%3Dus-rn-nclex-rn", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator('[data-auth-transition-kind="session-expired"]')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("[data-nn-premium-auth-session-expired]")).toBeVisible();
    await expect(page.getByText(/session paused while you were away/i)).toBeVisible();
    await expect(page.getByText(/study progress is saved/i)).toBeVisible();
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
    await expect(page.locator('[data-auth-transition-kind="magic-link-confirmation"]')).toBeVisible();
  });

  test("mobile auth layout is keyboard-safe and does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-premium-auth-system="signup"]')).toBeVisible();
    await expect(page.locator("[data-nn-premium-auth-signup-story], [data-nn-premium-auth-story]").first()).toBeHidden();
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

  test("login form supports keyboard focus order and visible focus rings", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
    const outline = await focused.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return `${style.outlineWidth}|${style.boxShadow}`;
    });
    expect(outline).not.toBe("0px|none");
  });

  test("reduced motion disables auth transition animations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    const anim = await page.evaluate(() => {
      const el = document.querySelector(".nn-auth-leaf-watermark--drift, .nn-auth-leaf-watermark--drift-slow");
      if (!el) return "none";
      return window.getComputedStyle(el).animationName;
    });
    expect(anim === "none" || anim === "").toBeTruthy();
  });

  test("forgot password idle state exposes labeled email field", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.locator('[data-nn-premium-auth-form="forgot-password"]')).toBeVisible();
  });

  test("auth error banner uses alert semantics on login validation", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.locator('[data-nn-auth-message-banner][role="alert"]')).toBeVisible({ timeout: 10_000 });
  });
});

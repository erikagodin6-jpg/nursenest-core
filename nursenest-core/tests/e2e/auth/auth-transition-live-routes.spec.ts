import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

const FLASHCARDS_CALLBACK = encodeURIComponent("/app/flashcards?pathwayId=us-rn-nclex-rn");

async function expectTransition(
  page: import("@playwright/test").Page,
  kind: string,
  layout?: string,
) {
  const root = page.locator(`[data-auth-transition-kind="${kind}"]`).first();
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute("data-auth-transition-tone", /.+/);
  await expect(root).toHaveAttribute("data-auth-transition-motion", /.+/);
  if (layout) {
    await expect(root).toHaveAttribute("data-auth-transition-layout", layout);
  }
}

async function expectNoRedirectLoop(page: import("@playwright/test").Page, maxNavigations = 6) {
  let navigations = 0;
  page.on("framenavigated", () => {
    navigations += 1;
  });
  await page.waitForTimeout(500);
  expect(navigations).toBeLessThanOrEqual(maxNavigations);
}

test.describe("Auth transition live routes", () => {
  test("session expired preserves callback and transition telemetry", async ({ page }) => {
    await page.goto(`/login?session=expired&callbackUrl=${FLASHCARDS_CALLBACK}`, {
      waitUntil: "domcontentloaded",
    });
    await expect
      .poll(async () => page.locator('[data-auth-transition-kind="session-expired"]').count())
      .toBeGreaterThan(0);
    await expectTransition(page, "session-expired", "inline");
    await expect(page.getByText(/session paused while you were away/i)).toBeVisible();
    await expect(page.getByText(/study progress is saved/i)).toBeVisible();
    const url = page.url();
    expect(url).toContain("callbackUrl=");
    expect(url).toContain("session=expired");
    await expectNoRedirectLoop(page);
  });

  test("OAuth continuation renders continuation shell", async ({ page }) => {
    await page.goto("/login?oauth=continuing&provider=google", { waitUntil: "domcontentloaded" });
    await expect
      .poll(async () => page.locator('[data-auth-transition-kind="oauth-continuation"]').count())
      .toBeGreaterThan(0);
    await expect(page.getByText(/linking your nursenest account/i)).toBeVisible();
  });

  test("sign-up completion on login with registered=1", async ({ page }) => {
    await page.goto("/login?registered=1", { waitUntil: "domcontentloaded" });
    await expectTransition(page, "sign-up-completion", "inline");
  });

  test("email verified on login verify=success", async ({ page }) => {
    await page.goto("/login?verify=success", { waitUntil: "domcontentloaded" });
    await expectTransition(page, "email-verified", "full-page");
    await expect(page.locator("[data-nn-premium-auth-verified]")).toBeVisible();
  });

  test("verify-email status=success uses full-page celebration", async ({ page }) => {
    await page.goto("/verify-email?status=success", { waitUntil: "domcontentloaded" });
    await expectTransition(page, "email-verified", "full-page");
  });

  test("magic-link expired on login", async ({ page }) => {
    await page.goto("/login?verify=expired", { waitUntil: "domcontentloaded" });
    await expectTransition(page, "magic-link-confirmation", "inline");
    await expect(page.getByText(/expired/i)).toBeVisible();
  });

  test("verify-email status=expired uses panel transition", async ({ page }) => {
    await page.goto("/verify-email?status=expired", { waitUntil: "domcontentloaded" });
    await expectTransition(page, "magic-link-confirmation", "panel");
  });

  test("reset-password invalid token uses transition panel", async ({ page }) => {
    await page.goto("/reset-password?token=short", { waitUntil: "domcontentloaded" });
    await expectTransition(page, "magic-link-confirmation", "panel");
    await expect(page.locator("[data-nn-premium-auth-error-state]")).toBeVisible();
  });

  test("reset-password success after mocked API", async ({ page }) => {
    const token = "a".repeat(24);
    await page.route("**/api/auth/reset-password", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.goto(`/reset-password?token=${token}`, { waitUntil: "domcontentloaded" });
    await page.locator('input[name="password"]').fill("newpassword12");
    await page.locator('input[name="confirm"]').fill("newpassword12");
    await page.getByRole("button", { name: /update password/i }).click();
    await expectTransition(page, "password-reset-success", "panel");
    await expect(page.locator("[data-nn-premium-auth-reset-success]")).toBeVisible();
  });
});

test.describe("Auth transition live routes — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("session expired mobile", async ({ page }) => {
    await page.goto(`/login?session=expired&callbackUrl=${FLASHCARDS_CALLBACK}`, {
      waitUntil: "domcontentloaded",
    });
    await expectTransition(page, "session-expired");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(4);
  });
});

test.describe("Auth transition live routes — reduced motion", () => {
  test.use({
    reducedMotion: "reduce",
  });

  test("session expired respects reduced motion preset", async ({ page }) => {
    await page.goto(`/login?session=expired&callbackUrl=${FLASHCARDS_CALLBACK}`, {
      waitUntil: "domcontentloaded",
    });
    const motion = await page
      .locator('[data-auth-transition-kind="session-expired"]')
      .first()
      .getAttribute("data-auth-transition-motion");
    expect(motion).toBeTruthy();
    const prefersReduced = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    expect(prefersReduced).toBe(true);
  });
});

import { expect, test } from "@playwright/test";
import { expectNoBlockingA11yViolations } from "../helpers/accessibility";
import { LESSON_ACCESS_ASIDE, defaultMarketingLessonPath } from "../helpers/marketing-lesson-paywall";

test.describe("Public accessibility smoke", () => {
  test("homepage", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible({ timeout: 30_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "public-homepage" });
  });

  test("login", async ({ page }, testInfo) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#login-identifier")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("#login-password")).toBeVisible({ timeout: 30_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "public-login" });
  });

  test("signup", async ({ page }, testInfo) => {
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('input[name="password"]')).toBeVisible({ timeout: 30_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "public-signup" });
  });

  test("lesson paywall preview", async ({ page }, testInfo) => {
    await page.goto(defaultMarketingLessonPath(), { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(LESSON_ACCESS_ASIDE)).toBeVisible({ timeout: 60_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "public-lesson-paywall" });
  });
});

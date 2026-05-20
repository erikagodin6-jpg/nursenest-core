/**
 * Free-tier guest: paywall surfaces must render real copy + CTAs (never a blank broken page).
 *
 * Requires `chromium-free` + `E2E_FREE_EMAIL` / `E2E_FREE_PASSWORD` (`setup-free-auth`).
 *
 * Selectors:
 * - `role=heading`, name `Subscription required` — paywall title
 * - `a[href="/pricing"]` — upgrade CTA
 * - `role=heading`, name `Lesson preview` — lessons hub preview band
 * - `[data-testid="learner-shell"]` — learner chrome when present on /app routes
 */
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound } from "../helpers/navigation-e2e";
import { SEL_LEARNER_SHELL } from "../helpers/site-never-broken-contract";

test.describe("Guest — paywall never broken (free user contract)", () => {
  test("/app/lessons: subscription gate + pricing CTA + preview copy + shell", async ({ page }) => {
    await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    await expectNotPageNotFound(page);

    await expect(page.getByRole("heading", { name: "Subscription required" })).toBeVisible({
      timeout: 45_000,
    });
    const pricing = page.locator('a[href="/pricing"]').first();
    await expect(pricing).toBeVisible();
    await expect(page.getByText(/NurseNest subscription/i).first()).toBeVisible();

    await expect(page.getByRole("heading", { name: "Lesson preview" })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText(/Full lesson bodies unlock with a subscription/i)).toBeVisible();

    const shell = page.locator(SEL_LEARNER_SHELL);
    if (await shell.count()) {
      await expect(shell).toBeVisible();
    }
    const bodyLen = (await page.locator("body").innerText()).trim().length;
    expect(bodyLen, "document body should have substantial text").toBeGreaterThan(200);
  });

  test("/app/questions: paywall + body text (peek or plans path)", async ({ page }) => {
    await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { name: "Subscription required" }).first()).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
    await page.waitForFunction(
      () => {
        const t = document.body?.innerText ?? "";
        return (
          t.includes("Try a few questions") ||
          t.includes("Complimentary preview") ||
          t.includes("View plans")
        );
      },
      null,
      { timeout: 120_000 },
    );
  });
});

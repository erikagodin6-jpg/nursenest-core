import { expect, test } from "@playwright/test";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

test.describe("Paid user — social study dashboard", () => {
  test.skip(!getPaidTestCredentials(), "Requires E2E paid credentials");

  test("dashboard card and social settings render without mobile overflow across themes", async ({ page }) => {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    const main = learnerAppMainLandmark(page);
    const card = page.getByTestId("social-study-dashboard-card");
    await expect(card).toBeVisible({ timeout: 45_000 });
    await expect(card.getByRole("heading", { name: "Study With Friends" })).toBeVisible();

    for (const theme of ["ocean", "blossom", "midnight", "sunset", "aurora"] as const) {
      await page.evaluate((id) => document.documentElement.setAttribute("data-theme", id), theme);
      await expect(card).toBeVisible();
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.getByTestId("social-study-dashboard-card")).toBeVisible({ timeout: 45_000 });
    const mobileOverflow = await main.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(mobileOverflow, "social dashboard should not horizontally overflow on mobile").toBe(false);

    await page.goto("/app/account/social", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.getByTestId("social-study-settings")).toBeVisible({ timeout: 45_000 });
    const settingsOverflow = await learnerAppMainLandmark(page).evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(settingsOverflow, "social settings should not horizontally overflow on mobile").toBe(false);
  });
});

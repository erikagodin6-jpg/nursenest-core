/**
 * Public marketing: Canada RN NCLEX lessons hub should list multiple lesson cards (not a single-row regression).
 *
 * Run: `BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/public/canada-rn-lessons-hub-cards.spec.ts`
 */
import { expect, test } from "@playwright/test";

test.describe("Canada RN lessons hub (public)", () => {
  test("/canada/rn/nclex-rn/lessons shows more than one lesson link in the library", async ({ page }) => {
    const r = await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded" });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();

    await expect(page.locator("#pathway-lesson-library")).toBeVisible({ timeout: 60_000 });

    const lessonLinks = page.locator('#pathway-lesson-library a[href*="/lessons/"]');
    await expect(lessonLinks.first()).toBeVisible({ timeout: 60_000 });
    await expect(lessonLinks.nth(1)).toBeVisible({ timeout: 60_000 });
  });
});

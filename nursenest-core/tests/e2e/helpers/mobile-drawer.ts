import { expect, type Page } from "@playwright/test";

/** Mobile header: opens the region & language drawer (public marketing layout). */
export async function openMobileRegionLanguageDrawer(page: Page) {
  await page.getByRole("button", { name: /Region and language settings/i }).click();
}

export async function expectMobileRegionSettingsHeading(page: Page) {
  await expect(page.getByRole("heading", { name: /Region & Settings/i })).toBeVisible();
}

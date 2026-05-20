import type { Page } from "@playwright/test";

/** Full-screen scrims (e.g. exam/onboarding overlays) sit above the header and block nav clicks. */
export async function dismissMarketingScrims(page: Page) {
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Escape");
  }
}

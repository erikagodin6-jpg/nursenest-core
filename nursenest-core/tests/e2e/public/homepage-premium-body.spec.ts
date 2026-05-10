import { expect, test } from "@playwright/test";
import type { APIRequestContext, APIResponse } from "@playwright/test";

const SECTION_IDS = [
  "section-premium-pathway-showcase",
  "section-premium-clinical-depth",
  "section-premium-study-ecosystem",
  "section-premium-social-study",
  "section-premium-home-ecg",
  "section-premium-readiness-preview",
  "section-premium-homepage-trust",
  "section-premium-homepage-final-cta",
] as const;

const KEY_LINK_SELECTORS = [
  '[data-testid="premium-pathway-card-rn"]',
  '[data-testid="premium-pathway-card-pn"]',
  '[data-testid="premium-pathway-card-np"]',
  '[data-testid="premium-pathway-card-international-rn"]',
  '[data-testid="premium-pathway-card-allied"]',
  '[data-testid="premium-social-study-primary"]',
  '[data-testid="premium-social-study-secondary"]',
  '[data-testid="premium-final-cta-primary"]',
  '[data-testid="premium-final-cta-secondary"]',
] as const;

async function getWithTransientRetry(request: APIRequestContext, href: string): Promise<APIResponse> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await request.get(href, { timeout: 30_000 });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

test.describe("Premium homepage body", () => {
  test("loads live homepage body sections, key CTAs, and mobile layout safely", async ({ page, request }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err?.message ?? String(err)));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    const main = page.locator("main");
    await expect(main).toBeVisible({ timeout: 60_000 });
    await expect(main.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 60_000 });

    // Premium hero stat tiles must never concatenate label + unit (regression: "MASTERED TOPICScards").
    const heroPanelHtml = (await page.locator(".nn-premium-hero-panel").innerHTML()).toLowerCase();
    expect(heroPanelHtml, "hero panel HTML").not.toContain("topicscards");

    for (const id of SECTION_IDS) {
      await expect(page.getByTestId(id)).toBeVisible({ timeout: 30_000 });
    }

    const social = page.getByTestId("section-premium-social-study");
    await expect(social.getByRole("heading", { name: "Study With Friends. Challenge Your Scores." })).toBeVisible();
    await expect(social.getByText("Hide your stats, pause visibility, or leave a challenge whenever you want.")).toBeVisible();
    await expect(social.getByRole("link", { name: /Start a Study Challenge/i })).toBeVisible();
    await expect(social.getByRole("link", { name: /Explore NurseNest Features/i })).toBeVisible();
    await expect(social.getByText("Compare progress in a supportive way — not a public leaderboard.")).toBeVisible();

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByText(/updating the site right now/i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);

    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(horizontalOverflow, "homepage should not horizontally scroll on mobile").toBe(false);

    for (const selector of KEY_LINK_SELECTORS) {
      const href = await page.locator(selector).first().getAttribute("href");
      expect(href, `${selector} href`).toBeTruthy();
      expect(href, `${selector} must not be a placeholder`).not.toBe("#");
      const res = await getWithTransientRetry(request, href!);
      expect(res.status(), `${href} should not 404`).not.toBe(404);
    }

    expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    const fatalConsole = consoleErrors.filter((text) => /hydration|Minified React error|Cannot read properties/i.test(text));
    expect(fatalConsole, `fatal console errors: ${fatalConsole.join(" | ")}`).toEqual([]);
  });
});

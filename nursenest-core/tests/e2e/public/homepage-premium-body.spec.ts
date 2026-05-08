import { expect, test } from "@playwright/test";

const SECTION_IDS = [
  "section-premium-pathway-showcase",
  "section-premium-clinical-depth",
  "section-premium-study-ecosystem",
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
  '[data-testid="premium-final-cta-primary"]',
  '[data-testid="premium-final-cta-secondary"]',
] as const;

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
    await expect(main.getByRole("heading", { level: 1 }).first()).toBeVisible();

    for (const id of SECTION_IDS) {
      await expect(page.getByTestId(id)).toBeVisible({ timeout: 30_000 });
    }

    await expect(page.locator('[data-nn-home-safe-mode="1"]')).toHaveCount(0);
    await expect(page.getByText(/updating the site right now/i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Just a moment$/i })).toHaveCount(0);

    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(horizontalOverflow, "homepage should not horizontally scroll on mobile").toBe(false);

    for (const selector of KEY_LINK_SELECTORS) {
      const href = await page.locator(selector).first().getAttribute("href");
      expect(href, `${selector} href`).toBeTruthy();
      expect(href, `${selector} must not be a placeholder`).not.toBe("#");
      const res = await request.get(href!);
      expect(res.status(), `${href} should not 404`).not.toBe(404);
    }

    expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    const fatalConsole = consoleErrors.filter((text) => /hydration|Minified React error|Cannot read properties/i.test(text));
    expect(fatalConsole, `fatal console errors: ${fatalConsole.join(" | ")}`).toEqual([]);
  });
});

/**
 * DOM-level regression: default marketing `/` and `/pricing` must not show placeholder / stub copy.
 *
 * Complements static shard validation — this proves visible output after RSC + client composition.
 * Uses `body` `innerText()` so `<script>` / JSON-LD does not pollute checks.
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../e2e/helpers/marketing-navigation-audit";
import {
  collectMarketingDomPlaceholderViolations,
  formatMarketingDomViolationMessage,
  normalizeMarketingDomText,
} from "./forbidden-marketing-placeholders";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

test.beforeEach(async ({ context }) => {
  await context.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
  }, SELECTOR_DISMISSED_LS);
});

test.describe("Marketing placeholder DOM (public)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const path of ["/", "/pricing"] as const) {
    test(`${path} — visible body must not contain forbidden placeholder patterns`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load", timeout: 120_000 });
      await dismissMarketingScrims(page);

      const raw = await page.locator("body").innerText();
      const violations = collectMarketingDomPlaceholderViolations(raw);
      expect(violations, formatMarketingDomViolationMessage(path, violations)).toEqual([]);
    });
  }

  test("home — hero heading and how-it-works kicker are non-empty shells", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const heroHeading = page.getByTestId("text-hero-heading");
    await expect(heroHeading).toBeVisible({ timeout: 60_000 });
    const heroText = normalizeMarketingDomText(await heroHeading.innerText());
    expect(heroText.length, "hero heading must not be empty").toBeGreaterThan(3);
    expect(collectMarketingDomPlaceholderViolations(heroText), "hero heading alone must not be placeholder").toEqual([]);

    const howSection = page.getByTestId("section-how-it-works");
    await expect(howSection).toBeVisible({ timeout: 30_000 });
    const kicker = howSection.locator("p.nn-marketing-caption").first();
    await expect(kicker).toBeVisible();
    const kickerText = normalizeMarketingDomText(await kicker.innerText());
    expect(kickerText.length, "how-it-works kicker paragraph must not be an empty shell").toBeGreaterThan(2);
    expect(collectMarketingDomPlaceholderViolations(kickerText), "kicker line must not be placeholder").toEqual([]);
  });

  test("pricing — marketing hero and conversion section have substantive copy", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const hero = page.getByTestId("pricing-marketing-hero");
    await expect(hero).toBeVisible({ timeout: 60_000 });
    const heroText = normalizeMarketingDomText(await hero.innerText());
    expect(heroText.length).toBeGreaterThan(40);
    expect(collectMarketingDomPlaceholderViolations(heroText)).toEqual([]);

    const clarity = page.getByTestId("section-pricing-conversion-clarity");
    await expect(clarity).toBeVisible();
    const clarityText = normalizeMarketingDomText(await clarity.innerText());
    expect(clarityText.length).toBeGreaterThan(80);
    expect(collectMarketingDomPlaceholderViolations(clarityText)).toEqual([]);
  });
});

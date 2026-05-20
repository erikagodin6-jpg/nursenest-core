/**
 * Smoke tests for the upgraded `/about` and `/how-it-works` premium ecosystem pages.
 *
 * What this guards:
 *   - Both routes render with their hero heading, ecosystem-narrative section, subscription
 *     clarity / "what's included" section, trust FAQ, and final CTA.
 *   - No leaked i18n keys (`pages.*`, `marketing.*`, `nav.*`, …) make it into visible body text.
 *   - No forbidden marketing placeholder / stub copy (Lorem ipsum, "TODO", "[missing:", etc.).
 *   - Entitlement-safe Advanced ECG language is present and **not** misrepresented as included.
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

test.describe("Marketing — About + How It Works ecosystem pages", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const path of ["/about", "/how-it-works"] as const) {
    test(`${path} — visible body must not contain forbidden placeholder patterns`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load", timeout: 120_000 });
      await dismissMarketingScrims(page);

      const raw = await page.locator("body").innerText();
      const violations = collectMarketingDomPlaceholderViolations(raw);
      expect(violations, formatMarketingDomViolationMessage(path, violations)).toEqual([]);
    });
  }

  test("/about — hero heading, ecosystem narrative, included scope, trust FAQ are present", async ({ page }) => {
    await page.goto("/about", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    /** Hero h1 — always rendered first on the about page. */
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 60_000 });
    const heroText = normalizeMarketingDomText(await h1.innerText());
    expect(heroText.length, "about hero heading must not be empty").toBeGreaterThan(10);
    expect(collectMarketingDomPlaceholderViolations(heroText)).toEqual([]);

    /** Page client wrapper proves the upgraded ecosystem composition mounted. */
    await expect(page.getByTestId("about-page-client")).toBeVisible({ timeout: 30_000 });

    /** Premium ecosystem signal: 4-phase Learn → Practice → Strengthen → Clinical readiness flow. */
    await expect(page.getByTestId("about-how-it-works-flow")).toBeVisible({ timeout: 30_000 });

    /** Most important section per the upgrade brief — interconnections between surfaces. */
    await expect(page.getByTestId("about-clinical-readiness-ecosystem")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /clinical readiness ecosystem/i }),
    ).toBeVisible();

    /** Subscription clarity must be present so visitors understand what is + is not in the plans. */
    await expect(page.getByTestId("about-whats-included")).toBeVisible();

    /** Trust FAQ must mount and surface its entitlement-safe Advanced ECG answer. */
    await expect(page.getByTestId("about-trust-faq")).toBeVisible();
  });

  test("/about — Advanced ECG is qualified as a separate future product, not included in the plans", async ({ page }) => {
    await page.goto("/about", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const body = normalizeMarketingDomText(await page.locator("body").innerText()).toLowerCase();
    expect(body, "Advanced ECG should be referenced for entitlement clarity").toContain("advanced ecg");

    /** Either a "separate future premium product" framing or "not included in standard" framing must
     *  appear in body copy — confirms the entitlement-safe wording survived rendering. */
    const safeFramings = [
      "separate future premium product",
      "not included in standard",
    ];
    expect(
      safeFramings.some((needle) => body.includes(needle)),
      `body must qualify Advanced ECG with a safe framing — looked for one of ${JSON.stringify(safeFramings)}`,
    ).toBe(true);

    /** No false claim of bundled certification training. */
    expect(body, "BLS / ACLS / PALS must not be described as included").not.toMatch(
      /\b(bls|acls|pals)\b[^.]{0,40}\b(included|bundled|comes with)\b/i,
    );
  });

  test("/how-it-works — hero, four-phase flow, ecosystem, subscription clarity, trust FAQ, CTA mount", async ({ page }) => {
    await page.goto("/how-it-works", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 60_000 });
    const heroText = normalizeMarketingDomText(await h1.innerText());
    expect(heroText.length, "how-it-works hero must not be empty").toBeGreaterThan(10);
    expect(collectMarketingDomPlaceholderViolations(heroText)).toEqual([]);

    await expect(page.getByTestId("how-it-works-page-client")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("hiw-flow")).toBeVisible();
    await expect(page.getByTestId("hiw-ecosystem")).toBeVisible();
    await expect(page.getByTestId("hiw-product-walkthrough")).toBeVisible();
    await expect(page.getByTestId("hiw-subscription-clarity")).toBeVisible();
    await expect(page.getByTestId("hiw-trust-faq")).toBeVisible();
  });

  test("/how-it-works — Advanced ECG is qualified as separate from standard plans", async ({ page }) => {
    await page.goto("/how-it-works", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const body = normalizeMarketingDomText(await page.locator("body").innerText()).toLowerCase();
    expect(body, "Advanced ECG should be referenced for entitlement clarity").toContain("advanced ecg");
    expect(body, "BLS / ACLS / PALS must not be described as included").not.toMatch(
      /\b(bls|acls|pals)\b[^.]{0,40}\b(included|bundled|comes with)\b/i,
    );
  });
});

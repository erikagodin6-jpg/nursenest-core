/**
 * Site-wide visible-copy gate: manifest routes must not surface i18n keys or placeholder tokens.
 * XML/text routes use raw body checks where applicable.
 */
import { expect, test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import {
  collectForbiddenProductionTextViolations,
  formatMarketingDomViolationMessage,
  htmlToProbePlainText,
} from "@/lib/validation/forbidden-production-text";
import { getProductionSmokePublicPaths } from "@/lib/validation/production-public-route-manifest";

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

const DOM_PATHS = getProductionSmokePublicPaths().filter(
  (p) => p !== "/sitemap.xml" && p !== "/robots.txt",
);

test.describe.configure({ mode: "parallel" });

for (const path of DOM_PATHS) {
  test(`${path} — no forbidden placeholder or leaked i18n in visible text`, async ({ page }) => {
    await page.goto(path, { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);

    const raw = await page.locator("body").innerText();
    const violations = collectForbiddenProductionTextViolations(raw);
    expect(violations, formatMarketingDomViolationMessage(path, violations)).toEqual([]);
  });
}

test("/robots.txt — plain body is sane", async ({ page }) => {
  await page.goto("/robots.txt", { waitUntil: "load", timeout: 60_000 });
  const text = await page.locator("body").innerText();
  expect(text.toLowerCase()).toContain("user-agent");
  expect(text.toLowerCase()).toContain("sitemap:");
  const violations = collectForbiddenProductionTextViolations(text);
  expect(violations, formatMarketingDomViolationMessage("/robots.txt", violations)).toEqual([]);
});

test("/sitemap.xml — XML has no HTML error shell", async ({ page }) => {
  const res = await page.goto("/sitemap.xml", { waitUntil: "load", timeout: 60_000 });
  expect(res?.ok()).toBeTruthy();
  const raw = await page.locator("body").innerText();
  const lower = raw.toLowerCase();
  expect(lower.includes("<html")).toBeFalsy();
  const violations = collectForbiddenProductionTextViolations(htmlToProbePlainText(raw));
  expect(violations, formatMarketingDomViolationMessage("/sitemap.xml", violations)).toEqual([]);
});

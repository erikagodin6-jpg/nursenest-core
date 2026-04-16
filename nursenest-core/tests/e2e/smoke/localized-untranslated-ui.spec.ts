/**
 * Heuristic checks for raw i18n keys and broken copy on non-English marketing homes.
 * Does not assert exact translations — structural / pattern-based only.
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { recordLocalizedSmoke, seriousLocalizedGuestConsoleErrors } from "../helpers/localized-smoke-diagnostics";
import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";
import { scanMarketingChromeForUntranslatedSignals } from "../helpers/smoke-untranslated-heuristics";
import {
  DEFAULT_MARKETING_LOCALE,
  expectPathMatchesMarketingLocale,
  getSmokeMarketingLocaleMatrix,
} from "../helpers/smoke-marketing-locales";

const locales = getSmokeMarketingLocaleMatrix();

test.describe("Localized untranslated UI (heuristics)", () => {
  for (const { code, homePath } of locales) {
    test(`${code}: no obvious raw keys or placeholder tokens in chrome`, async ({ page }, testInfo) => {
      test.skip(
        code === DEFAULT_MARKETING_LOCALE,
        "Untranslated heuristics target non-English locales; English is covered by guest homepage smoke.",
      );
      test.setTimeout(120_000);
      const o = attachPageObservers(page, { profile: "public" });
      try {
        await page.setViewportSize({ width: 1440, height: 900 });
        const r = await page.goto(homePath, { waitUntil: "domcontentloaded" });
        expect(r?.ok(), `HTTP ${r?.status()} for ${homePath}`).toBeTruthy();
        await dismissMarketingScrims(page);

        await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
        expectPathMatchesMarketingLocale(page.url(), code);

        const scan = await scanMarketingChromeForUntranslatedSignals(page, code);

        await testInfo.attach(`untranslated-scan-${code}.json`, {
          body: Buffer.from(
            JSON.stringify(
              {
                locale: code,
                finalUrl: page.url(),
                violations: scan.violations,
                scriptLocaleHeuristic: scan.scriptLocaleHeuristic ?? null,
              },
              null,
              2,
            ),
            "utf-8",
          ),
          contentType: "application/json",
        });

        expect(
          scan.violations,
          `suspicious copy — ${scan.violations.map((v) => `${v.region}:${v.code}:${v.excerpt}`).join(" | ")}`,
        ).toEqual([]);

        const cap = await recordLocalizedSmoke(o, testInfo, `untranslated-ui-${code}`, page.url(), code);
        const serious = seriousLocalizedGuestConsoleErrors(cap.consoleErrors);
        expect(serious, `console errors (locale ${code})`).toEqual([]);
        expect(cap.failedRequests, `failed requests (locale ${code})`).toEqual([]);
      } finally {
        o.dispose();
      }
    });
  }
});

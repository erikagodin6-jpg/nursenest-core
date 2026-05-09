/**
 * Marketing footer: responsive overflow, themes (ocean / blossom / midnight), contrast + focus sanity.
 *
 * From nursenest-core:
 *   npx playwright test tests/e2e/public/footer-premium-responsive.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { CANONICAL_PATHWAY_HUB } from "../../../src/lib/marketing/canonical-pathway-hubs";
import {
  expectMarketingPublicShell,
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { assertDocumentNoHorizontalOverflow, assertElementNoHorizontalOverflow } from "../helpers/visual-layout-assertions";

const FOOTER = '[data-nn-footer-layout="marketing"]';
const THEME_STORAGE_KEY = "nursenest-theme";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context, browserName }) => {
  test.skip(browserName !== "chromium", "Footer responsive checks run on Chromium only.");
  await context.addInitScript(({ themeKey }: { themeKey: string }) => {
    try {
      localStorage.setItem(themeKey, "ocean");
    } catch {
      /* ignore */
    }
  }, { themeKey: THEME_STORAGE_KEY });
});

async function applyTheme(page: import("@playwright/test").Page, themeId: string): Promise<void> {
  await page.evaluate(
    ({ themeKey, id }) => {
      try {
        localStorage.setItem(themeKey, id);
        document.documentElement.setAttribute("data-theme", id);
      } catch {
        /* ignore */
      }
    },
    { themeKey: THEME_STORAGE_KEY, id: themeId },
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeId);
}

test.describe("Marketing footer — premium responsive", () => {
  test.setTimeout(240_000);

  test("viewports: no horizontal overflow on homepage + RN hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    const sizes = [
      { w: 1280, h: 900, label: "desktop" },
      { w: 820, h: 1100, label: "tablet" },
      { w: 390, h: 844, label: "mobile" },
    ] as const;
    for (const size of sizes) {
      await page.setViewportSize({ width: size.w, height: size.h });
      for (const path of ["/", CANONICAL_PATHWAY_HUB.usRn] as const) {
        await gotoExpectOk(page, path);
        await dismissMarketingScrims(page);
        await expectMarketingPublicShell(page);
        await expectNotPageNotFound(page);
        const footer = page.locator(FOOTER).first();
        await footer.scrollIntoViewIfNeeded();
        await expect(footer).toBeVisible({ timeout: 60_000 });
        await assertDocumentNoHorizontalOverflow(page);
        await assertElementNoHorizontalOverflow(page, FOOTER);
      }
    }
  });

  test("themes ocean / blossom / midnight: links + contrast + focus", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/");
    await dismissMarketingScrims(page);
    await expectMarketingPublicShell(page);

    for (const themeId of ["ocean", "blossom", "midnight"] as const) {
      await applyTheme(page, themeId);
      const footer = page.locator(FOOTER).first();
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible({ timeout: 45_000 });

      const anchors = footer.locator("a[href]");
      const count = await anchors.count();
      expect(count, "footer should expose links").toBeGreaterThan(4);
      for (let i = 0; i < Math.min(count, 14); i += 1) {
        const href = await anchors.nth(i).getAttribute("href");
        expect(href?.trim().length ?? 0, `anchor ${i} href`).toBeGreaterThan(1);
      }

      const heading = footer.locator(".nn-footer-col-heading").first();
      const fg = await heading.evaluate((el) => getComputedStyle(el).color);
      expect(fg).not.toMatch(/^rgba\(0,\s*0,\s*0,\s*0\)$/);

      const firstFooterLink = footer.locator("a[href]").first();
      await firstFooterLink.focus();
      await expect(firstFooterLink).toBeFocused();
    }

    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
  });
});

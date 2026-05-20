/**
 * PN / REx-PN marketing hub — readiness band + themes (documentation screenshots).
 *
 * From nursenest-core/ (with dev server or PLAYWRIGHT_TEST_BASE_URL):
 *   npx playwright test tests/e2e/public/pn-marketing-hub-readiness-screenshots.spec.ts --project=chromium
 */
import { test } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { gotoExpectOk } from "../helpers/navigation-e2e";
import path from "node:path";

const THEME_KEY = "nursenest-theme";
const DISMISSED = "nn_selector_dismissed";
const OUT_DIR = path.join(process.cwd(), "reports", "rpn-pn-hub-app-screenshots");

async function setTheme(page: import("@playwright/test").Page, theme: "ocean" | "blossom" | "midnight") {
  await page.addInitScript(
    ({ k, t, d }: { k: string; t: string; d: string }) => {
      try {
        localStorage.setItem(d, "1");
        localStorage.setItem(k, t);
      } catch {
        /* ignore */
      }
    },
    { k: THEME_KEY, t: theme, d: DISMISSED },
  );
}

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context, browserName }) => {
  test.skip(browserName !== "chromium", "Screenshot capture uses Chromium only.");
  await context.addInitScript(
    ({ k, d }: { k: string; d: string }) => {
      try {
        localStorage.setItem(d, "1");
        localStorage.setItem(k, "ocean");
      } catch {
        /* ignore */
      }
    },
    { k: THEME_KEY, d: DISMISSED },
  );
});

test("PN hub screenshots — desktop themes + mobile ocean", async ({ page }) => {
  for (const theme of ["ocean", "blossom", "midnight"] as const) {
    await setTheme(page, theme);
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoExpectOk(page, "/canada/pn/rex-pn");
    await page.evaluate(
      ({ k, t }: { k: string; t: string }) => {
        try {
          localStorage.setItem(k, t);
          document.documentElement.setAttribute("data-theme", t);
        } catch {
          /* ignore */
        }
      },
      { k: THEME_KEY, t: theme },
    );
    await page.waitForLoadState("domcontentloaded", { timeout: 60_000 }).catch(() => {});
    await dismissMarketingScrims(page);
    const band = page.locator('[data-nn-pn-hub-readiness-band="1"]');
    await band.waitFor({ state: "visible", timeout: 120_000 }).catch(() => {});
    await page.screenshot({
      path: path.join(OUT_DIR, `${theme}-desktop.png`),
      fullPage: true,
    });
  }

  await setTheme(page, "ocean");
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoExpectOk(page, "/canada/pn/rex-pn");
  await page.evaluate(
    ({ k, t }: { k: string; t: string }) => {
      try {
        localStorage.setItem(k, t);
        document.documentElement.setAttribute("data-theme", t);
      } catch {
        /* ignore */
      }
    },
    { k: THEME_KEY, t: "ocean" },
  );
  await page.waitForLoadState("domcontentloaded", { timeout: 60_000 }).catch(() => {});
  await dismissMarketingScrims(page);
  await page.screenshot({
    path: path.join(OUT_DIR, "ocean-mobile.png"),
    fullPage: true,
  });
});

/**
 * PN / REx-PN marketing hub — theme screenshots for convergence QA.
 *
 *   cd nursenest-core && npx playwright test -c playwright.nursing-hubs.config.ts tests/e2e/public/practical-nursing-hub-convergence-screenshots.spec.ts
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.nursing-hubs.config.ts tests/e2e/public/practical-nursing-hub-convergence-screenshots.spec.ts
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedCaMarketingCookie } from "../helpers/navigation-e2e";

const OUT = join(process.cwd(), "reports", "premium-rpn-pn-hub-screenshots");
const HUB = "/canada/pn/rex-pn";
const READY = '[data-nn-qa-pathway-premium-modules=""]';

const DESKTOP_THEMES = [
  { id: "ocean", file: "ca-rex-pn-desktop-ocean.png" },
  { id: "blossom", file: "ca-rex-pn-desktop-blossom.png" },
  { id: "midnight", file: "ca-rex-pn-desktop-midnight.png" },
] as const;

test.describe("Practical nursing hub — premium screenshots", () => {
  test.beforeAll(() => {
    mkdirSync(OUT, { recursive: true });
  });

  test("Canada REx-PN — desktop Ocean / Blossom / Midnight", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, HUB);
    await expectNotPageNotFound(page);
    await page.locator(READY).waitFor({ state: "visible", timeout: 120_000 });

    for (const th of DESKTOP_THEMES) {
      await page.evaluate((id: string) => {
        document.documentElement.setAttribute("data-theme", id);
      }, th.id);
      await page.waitForTimeout(350);
      await page.screenshot({ path: join(OUT, th.file), fullPage: true });
    }
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
  });

  test("Canada REx-PN — mobile Ocean", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 390, height: 844 });
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, HUB);
    await expectNotPageNotFound(page);
    await page.locator(READY).waitFor({ state: "visible", timeout: 120_000 });
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "ocean"));
    await page.waitForTimeout(350);
    await page.screenshot({ path: join(OUT, "ca-rex-pn-mobile-ocean.png"), fullPage: true });
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
  });
});

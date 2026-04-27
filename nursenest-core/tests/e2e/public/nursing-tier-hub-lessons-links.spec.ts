/**
 * Marketing exam hub (nursing tier overview): Lessons study card must use pathway lessons URLs
 * (never `href="#"` or `/lessons/lessons`).
 *
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/nursing-tier-hub-lessons-links.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

test.describe("Nursing tier hub — Lessons card destinations", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("US RN hub — Lessons card opens RN pathway lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await expect(section.getByRole("link", { name: /^Lessons$/ }).first()).toBeVisible({ timeout: 60_000 });
    await expect(section.locator('a[href="#"]')).toHaveCount(0);

    await section.getByRole("link", { name: /^Lessons$/ }).first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn\/lessons(?:\/|\?|#|$)/);
    await expectNotPageNotFound(page);
  });

  test("US PN hub — Lessons card opens PN pathway lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/pn/nclex-pn");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await section.getByRole("link", { name: /^Lessons$/ }).first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/pn\/nclex-pn\/lessons(?:\/|\?|#|$)/);
    await expectNotPageNotFound(page);
  });

  test("US NP hub — Lessons card opens NP pathway lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/np/fnp");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await section.getByRole("link", { name: /^Lessons$/ }).first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/np\/fnp\/lessons(?:\/|\?|#|$)/);
    await expectNotPageNotFound(page);
  });
});

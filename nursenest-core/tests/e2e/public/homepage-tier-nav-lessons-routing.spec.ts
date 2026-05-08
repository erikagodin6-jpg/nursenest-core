/**
 * Homepage tier cards → pathway hubs → Lessons tile → pathway lessons index.
 *
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/homepage-tier-nav-lessons-routing.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

const TIER_CARD = (id: string) => `a[data-nn-home-tier-card="${id}"]`;
const TIER_HUB_LESSONS_CARD = "a.nn-qa-nursing-tier-hub-lessons-card";
const PATHWAYS_BAND = '[data-testid="section-premium-pathway-showcase"]';

async function navigateTierCard(page: import("@playwright/test").Page, id: string) {
  const card = page.locator(`${PATHWAYS_BAND} ${TIER_CARD(id)}`).first();
  await page.waitForTimeout(1000);
  await expect(card).toBeVisible();
  const href = await card.getAttribute("href");
  expect(href, `${id} card href`).toBeTruthy();
  expect(href, `${id} card href must not be placeholder`).not.toBe("#");
  await page.goto(href!, { waitUntil: "domcontentloaded" });
}

test.describe("Homepage tier nav → hub → Lessons (US)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("RN card → US RN hub → Lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectNotPageNotFound(page);

    const band = page.locator(PATHWAYS_BAND);
    await expect(band.locator(TIER_CARD("rn"))).toBeVisible({ timeout: 60_000 });
    await expect(band.locator('a[href="#"]')).toHaveCount(0);

    await navigateTierCard(page, "rn");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const lessons = section.locator(TIER_HUB_LESSONS_CARD);
    await expect(lessons).toHaveAttribute("href", /\/us\/rn\/nclex-rn\/lessons/);
    await lessons.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
  });

  test("PN card → US PN hub → Lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectNotPageNotFound(page);

    await navigateTierCard(page, "pn");
    await expect(page).toHaveURL(/\/us\/pn\/nclex-pn(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await section.locator(TIER_HUB_LESSONS_CARD).click();
    await expect(page).toHaveURL(/\/us\/pn\/nclex-pn\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
  });

  test("NP card → US NP hub → Lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/");
    await expectNotPageNotFound(page);

    await navigateTierCard(page, "np");
    await expect(page).toHaveURL(/\/us\/np\/fnp(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await section.locator(TIER_HUB_LESSONS_CARD).click();
    await expect(page).toHaveURL(/\/us\/np\/fnp\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
  });
});

test.describe("Homepage tier nav → hub → Lessons (Canada / RPN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("PN (RPN) card → REx-PN hub → Lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([{ name: MARKETING_REGION_COOKIE, value: "CA", url: origin }]);
    await gotoExpectOk(page, "/");
    await expectNotPageNotFound(page);

    const band = page.locator(PATHWAYS_BAND);
    await expect(band.locator('a[href="#"]')).toHaveCount(0);
    await navigateTierCard(page, "pn");
    await expect(page).toHaveURL(/\/canada\/pn\/rex-pn(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await section.locator(TIER_HUB_LESSONS_CARD).click();
    await expect(page).toHaveURL(/\/canada\/pn\/rex-pn\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
  });
});

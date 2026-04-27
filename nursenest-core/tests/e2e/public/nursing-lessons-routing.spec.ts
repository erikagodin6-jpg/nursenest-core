/**
 * Evidence-based routing: tier hub Lessons card → real marketing lessons hub (not `#`, not tier duplicate).
 *
 * Production-like server: `npm run build && npm run start` then:
 *   `BASE_URL=http://localhost:3000 npx playwright test tests/e2e/public/nursing-lessons-routing.spec.ts`
 *
 * Traces: `npx playwright test … --trace on`
 */
import { expect, test, type Page } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

const LESSONS_CARD = "a.nn-qa-nursing-tier-hub-lessons-card";

async function assertLessonsHubContent(page: Page) {
  await expectNotPageNotFound(page);
  await expect(page.getByRole("heading", { name: /page not found/i })).toHaveCount(0);
  await expect(page.getByText(/hub content failed|exam hub unavailable|lessons page failed/i)).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: /how to use|clinical topic|lessons|lesson library|NCLEX|NP|Family|REx-PN|Browse/i }).first(),
  ).toBeVisible({ timeout: 60_000 });
}

test.describe("Nursing tier hub → lessons hub (routing evidence)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("RN: log href, assert safe URL, navigate to lessons hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    const card = page.locator(LESSONS_CARD).first();
    await expect(card).toBeVisible({ timeout: 60_000 });
    const href = await card.getAttribute("href");
    // eslint-disable-next-line no-console
    console.log("[E2E evidence] RN Lessons card href:", href);
    expect(href).toBeTruthy();
    expect(href).not.toMatch(/^#$/);
    expect(href).not.toMatch(/^#topics$/);
    expect(href?.trim().length).toBeGreaterThan(0);
    expect(href?.startsWith("javascript:")).toBe(false);
    expect(href?.startsWith("data:")).toBe(false);
    expect(href).toMatch(/\/us\/rn\/nclex-rn\/lessons/);
    expect(href).not.toMatch(/\/us\/rn\/nclex-rn$/);

    await card.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn\/lessons(?:\/|\?|#|$)/, { timeout: 25_000 });
    await assertLessonsHubContent(page);
  });

  test("RPN/PN (US): log href, navigate to PN lessons hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/pn/nclex-pn");
    const card = page.locator(LESSONS_CARD).first();
    await expect(card).toBeVisible({ timeout: 60_000 });
    const href = await card.getAttribute("href");
    // eslint-disable-next-line no-console
    console.log("[E2E evidence] US PN Lessons card href:", href);
    expect(href).toMatch(/\/us\/pn\/nclex-pn\/lessons/);
    await card.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/pn\/nclex-pn\/lessons(?:\/|\?|#|$)/, { timeout: 25_000 });
    await assertLessonsHubContent(page);
  });

  test("NP (FNP): log href, navigate to NP lessons hub", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/np/fnp");
    const card = page.locator(LESSONS_CARD).first();
    await expect(card).toBeVisible({ timeout: 60_000 });
    const href = await card.getAttribute("href");
    // eslint-disable-next-line no-console
    console.log("[E2E evidence] NP FNP Lessons card href:", href);
    expect(href).toMatch(/\/us\/np\/fnp\/lessons/);
    await card.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/np\/fnp\/lessons(?:\/|\?|#|$)/, { timeout: 25_000 });
    await assertLessonsHubContent(page);
  });
});

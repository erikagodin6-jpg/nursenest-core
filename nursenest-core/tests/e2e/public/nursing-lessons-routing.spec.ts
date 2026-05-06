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

async function assertLessonsHubSurface(page: Page) {
  await expectNotPageNotFound(page);
  await expect(page.getByRole("heading", { name: /page not found/i })).toHaveCount(0);
  await expect(page.getByText(/application error|just a moment|safe mode|something went wrong/i)).toHaveCount(0);
  await expect(page.getByText(/\b404\b/)).toHaveCount(0);
  await expect(page.locator(LESSONS_CARD)).toHaveCount(0);
  const hubLandmark = page.locator('[data-nn-qa-pathway-lessons-hub="true"]');
  const emptyState = page.locator('[data-nn-qa-pathway-lessons-empty="true"]');
  const grid = page.locator(".nn-qa-pathway-lessons-grid");
  await expect(hubLandmark.or(emptyState).or(grid).first()).toBeVisible({ timeout: 60_000 });
  const cards = await page.locator(".nn-qa-pathway-lesson-card").count();
  const groups = await page.locator(".nn-qa-pathway-lessons-group").count();
  const empty = await emptyState.count();
  expect(cards + groups + empty).toBeGreaterThan(0);
  if (empty === 0) {
    await expect(
      page.getByRole("heading", { name: /lesson library|how to use|clinical topic|lessons|NCLEX|NP|Family|REx-PN/i }).first(),
    ).toBeVisible({ timeout: 30_000 });
  } else {
    await expect(page.getByText(/no lessons are available for this pathway yet/i)).toBeVisible();
  }
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
    await assertLessonsHubSurface(page);
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
    await assertLessonsHubSurface(page);
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
    await assertLessonsHubSurface(page);
  });

  test("invalid pathway lessons URL shows unavailable state (not tier hub)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/__nonexistent_exam__/lessons");
    await expect(page.locator('[data-nn-qa-pathway-lessons-unavailable="true"]')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/lessons hub unavailable for this pathway/i)).toBeVisible();
    await expect(page.locator(LESSONS_CARD)).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-pathway-lessons-hub="true"]')).toHaveCount(0);
  });
});

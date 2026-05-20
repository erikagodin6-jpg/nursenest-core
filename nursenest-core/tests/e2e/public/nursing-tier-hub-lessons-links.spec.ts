/**
 * Marketing exam hub (nursing tier overview): Lessons study card must use pathway lessons URLs
 * (never `href="#"` or `/lessons/lessons`).
 *
 * Prerequisites:
 * - `BASE_URL` (see `playwright.config.ts`) must point at an origin that serves marketing hubs
 *   such as `/us/rn/nclex-rn` with HTTP 200. A remote URL that only serves `/app` will 404 here.
 * - For local runs: start `npm run dev`, then either unset conflicting vars or run with
 *   `BASE_URL=http://localhost:3000` so Playwright hits the same origin as the dev server.
 *
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/nursing-tier-hub-lessons-links.spec.ts`
 */
import { expect, test, type Page } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

/** Stable hooks on tier hub study tiles — see {@link NursingTierHubPage}. */
const TIER_HUB_LESSONS_CARD = "a.nn-qa-nursing-tier-hub-lessons-card";
const TIER_HUB_FLASHCARDS_CARD = "a.nn-qa-nursing-tier-hub-flashcards-card";
const TIER_HUB_PRACTICE_CARD = "a.nn-qa-nursing-tier-hub-practice-card";
const TIER_HUB_EXAMS_CARD = "a.nn-qa-nursing-tier-hub-exams-card";

/** Lessons index should show hub guidance, not a bare error shell. */
async function expectLessonsHubSurfaceVisible(page: Page) {
  await expect(
    page.getByRole("heading", { name: /how to use|clinical topic|lessons|NCLEX|NP|Family|REx-PN/i }).first(),
  ).toBeVisible({ timeout: 45_000 });
}

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
    const lessonsCard = section.locator(TIER_HUB_LESSONS_CARD);
    await expect(lessonsCard).toBeVisible({ timeout: 60_000 });
    await expect(lessonsCard).toHaveAttribute("href", /\/us\/rn\/nclex-rn\/lessons/);
    await expect(section.locator('a[href="#"]')).toHaveCount(0);
    await expect(section.locator('a[href=""]')).toHaveCount(0);

    await lessonsCard.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
    await expectLessonsHubSurfaceVisible(page);
  });

  test("US RN hub — Flashcards card href carries pathway (guests: login callback or direct app)", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const flash = section.locator(TIER_HUB_FLASHCARDS_CARD);
    await expect(flash).toBeVisible({ timeout: 60_000 });
    const h = await flash.getAttribute("href");
    expect(h).toBeTruthy();
    expect(h!.includes("flashcards") && h!.includes("us-rn-nclex-rn")).toBe(true);
  });

  test("US RN hub — Practice Questions card opens pathway question bank", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const practice = section.locator(TIER_HUB_PRACTICE_CARD);
    await expect(practice).toBeVisible({ timeout: 60_000 });
    await expect(practice).toHaveAttribute("href", /\/us\/rn\/nclex-rn\/questions/);
    await practice.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn\/questions/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { name: /practice questions/i }).first()).toBeVisible({ timeout: 30_000 });
  });

  test("US RN hub — Practice Exam card href carries pathway (guests: login callback or direct app)", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);
    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const exams = section.locator(TIER_HUB_EXAMS_CARD);
    await expect(exams).toBeVisible({ timeout: 60_000 });
    const h = await exams.getAttribute("href");
    expect(h).toBeTruthy();
    expect(h!.includes("practice-tests") && h!.includes("us-rn-nclex-rn")).toBe(true);
  });

  test("US PN hub — Lessons card opens PN pathway lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/pn/nclex-pn");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const lessonsCard = section.locator(TIER_HUB_LESSONS_CARD);
    await expect(lessonsCard).toHaveAttribute("href", /\/us\/pn\/nclex-pn\/lessons/);
    await expect(section.locator('a[href="#"]')).toHaveCount(0);
    await expect(section.locator('a[href=""]')).toHaveCount(0);
    await lessonsCard.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/pn\/nclex-pn\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
    await expectLessonsHubSurfaceVisible(page);
  });

  test("US NP hub — Lessons card opens NP pathway lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/np/fnp");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const lessonsCard = section.locator(TIER_HUB_LESSONS_CARD);
    await expect(lessonsCard).toHaveAttribute("href", /\/us\/np\/fnp\/lessons/);
    await expect(section.locator('a[href="#"]')).toHaveCount(0);
    await expect(section.locator('a[href=""]')).toHaveCount(0);
    await lessonsCard.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/np\/fnp\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
    await expectLessonsHubSurfaceVisible(page);
  });

  test("Canada RN hub — Lessons card opens Canada RN pathway lessons index", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.context().addCookies([{ name: MARKETING_REGION_COOKIE, value: "CA", url: origin }]);
    await gotoExpectOk(page, "/canada/rn/nclex-rn");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const lessonsCard = section.locator(TIER_HUB_LESSONS_CARD);
    await expect(lessonsCard).toHaveAttribute("href", /\/canada\/rn\/nclex-rn\/lessons/);
    await expect(section.locator('a[href="#"]')).toHaveCount(0);
    await expect(section.locator('a[href=""]')).toHaveCount(0);
    await lessonsCard.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/canada\/rn\/nclex-rn\/lessons(?:\/|\?|#|$)/, { timeout: 20_000 });
    await expectNotPageNotFound(page);
    await expectLessonsHubSurfaceVisible(page);
  });
});

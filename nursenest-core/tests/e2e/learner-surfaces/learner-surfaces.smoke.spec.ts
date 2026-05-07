/**
 * Stabilization smoke: public marketing pathway, lesson navigation, inventory CTAs,
 * paid dashboard / practice / flashcards shells, staff banner, anonymous API paywall.
 *
 * Run: `npm run test:e2e:learner-surfaces-smoke` (from `nursenest-core/`).
 */
import { expect, test } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { loginWithCredentials } from "../helpers/learner-login";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { LESSON_HUB_CARD_LINKS, paidFlashcardsHubUrl, paidLessonsHubUrl, paidQuestionsHubUrl } from "../helpers/paid-content-discovery";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { SEL_LEARNER_SHELL } from "../helpers/site-never-broken-contract";
import { learnerAppMainLandmark, expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";

const TIER_HUB_LESSONS_CARD = "a.nn-qa-nursing-tier-hub-lessons-card";

test.describe("Learner surfaces smoke — public (guest)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("US RN pathway hub loads and Lessons card navigates with a valid href", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);

    const section = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    const lessonsCard = section.locator(TIER_HUB_LESSONS_CARD);
    await expect(lessonsCard).toBeVisible({ timeout: 60_000 });
    const href = await lessonsCard.getAttribute("href");
    expect(href, "Lessons card must not be inert").toBeTruthy();
    expect(href, "Lessons card href must be real").not.toMatch(/^(#|$)/);
    expect(href).toMatch(/\/us\/rn\/nclex-rn\/lessons/);
    await expect(section.locator('a[href="#"]')).toHaveCount(0);

    await lessonsCard.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn\/lessons/, { timeout: 25_000 });
    await expectNotPageNotFound(page);
  });

  test("marketing practice hub: CAT / linear CTAs stay gated together (no orphan adaptive start)", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.context().addCookies([{ name: MARKETING_REGION_COOKIE, value: "US", url: origin }]);
    await gotoExpectOk(page, "/us/rn/nclex-rn/questions");
    await expectNotPageNotFound(page);

    const hub = page.locator('[data-testid="marketing-practice-questions-hub"]');
    await expect(hub).toBeVisible({ timeout: 60_000 });
    const adaptiveStarts = hub.locator('[data-testid="start-adaptive-selected-systems"]');
    const quickCat = hub.locator('[data-testid="quick-cat-app-link"]');
    const nAdaptive = await adaptiveStarts.count();
    const nQuick = await quickCat.count();
    if (nAdaptive === 0) {
      expect(nQuick, "When adaptive pool is below threshold, quick CAT link must not appear alone").toBe(0);
    } else {
      expect(nQuick, "When adaptive CTAs render, quick CAT entry must also be available").toBeGreaterThanOrEqual(1);
    }

    const linear = hub.locator('[data-testid="start-selected-systems-practice"]');
    const nLinear = await linear.count();
    expect(nLinear, "Linear practice control is either hidden or a single primary CTA").toBeLessThanOrEqual(2);
  });

  test("anonymous cannot read subscriber lessons API (401)", async ({ request, baseURL }) => {
    const origin = requireOrigin(baseURL);
    const res = await request.get(`${origin}/api/lessons`, { failOnStatusCode: false });
    expect(res.status(), "Unauthenticated lessons list must not succeed").toBe(401);
  });
});

test.describe("Learner surfaces smoke — paid subscriber", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("dashboard + hubs load; lesson cards have navigable hrefs", async ({ page }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnPaidSubscriberApp(page);

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expectNoSubscriptionPaywall(page, "learner-smoke-dashboard");
    await expectPaidLearnerShellReady(page, "learner-smoke /app");
    const mainDash = learnerAppMainLandmark(page);
    await expect(mainDash).toBeVisible({ timeout: 60_000 });
    const dashText = await mainDash.innerText().catch(() => "");
    expect(dashText.length, "dashboard main should render text").toBeGreaterThan(40);

    await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
    await expect(page.locator(SEL_LEARNER_SHELL)).toBeVisible({ timeout: 60_000 });
    const first = page.locator(LESSON_HUB_CARD_LINKS).first();
    await expect(first).toBeVisible({ timeout: 90_000 });
    const lessonHref = await first.getAttribute("href");
    expect(lessonHref).toBeTruthy();
    expect(lessonHref).not.toMatch(/^#$|^$/);
    expect(lessonHref).toMatch(/^\/(app\/)?lessons\//);

    await page.goto(paidQuestionsHubUrl(), { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "learner-smoke questions");
    const qMain = learnerAppMainLandmark(page);
    await expect(qMain).toBeVisible({ timeout: 60_000 });

    await page.goto(paidFlashcardsHubUrl(), { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "learner-smoke flashcards");
    const fMain = learnerAppMainLandmark(page);
    await expect(fMain).toBeVisible({ timeout: 60_000 });
    const fcBody = await fMain.innerText().catch(() => "");
    expect(fcBody.length, "flashcards hub should render body text or empty state").toBeGreaterThan(20);
  });
});

test.describe("Learner surfaces smoke — staff session copy", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("staff user sees Staff access banner on /app (distinct from paid billing)", async ({ page }) => {
    test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL + E2E_ADMIN_PASSWORD for staff smoke");
    const admin = getAdminE2eCredentials()!;

    await loginWithCredentials(page, admin.email, admin.password);
    await page.goto("/app", { waitUntil: "domcontentloaded" });

    const banner = page.locator("[data-nn-staff-access-banner]");
    await expect(banner).toBeVisible({ timeout: 90_000 });
    await expect(banner.getByText(/Staff access/i)).toBeVisible();
    await expect(banner.getByText(/not paid billing or a subscriber/i)).toBeVisible();
  });
});

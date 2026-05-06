/**
 * Anonymous marketing: tier hubs render; learner `/app/*` routes do not expose paid content;
 * `/app/practice` alias preserves `pathwayId` when redirecting.
 *
 * Run: `npx playwright test -c playwright.tier-matrix.config.ts tests/e2e/tier-matrix/tier-matrix-public-marketing-smoke.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";
import {
  learnerLessonsUrl,
  learnerPracticeAliasUrl,
  learnerFlashcardsUrl,
} from "../helpers/tier-product-matrix";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Tier matrix — public marketing + anonymous gates", () => {
  test("US RN marketing hub — study cards carry pathway-scoped hrefs", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expectNotPageNotFound(page);

    const lessons = page.locator("a.nn-qa-nursing-tier-hub-lessons-card");
    await expect(lessons).toBeVisible({ timeout: 60_000 });
    await expect(lessons).toHaveAttribute("href", /\/us\/rn\/nclex-rn\/lessons/);

    const practice = page.locator("a.nn-qa-nursing-tier-hub-practice-card");
    await expect(practice).toBeVisible({ timeout: 30_000 });
    await expect(practice).toHaveAttribute("href", /\/us\/rn\/nclex-rn\/questions|practice/);
  });

  test("anonymous cannot load paid learner lessons hub HTML body", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.goto(new URL(learnerLessonsUrl("us-rn-nclex-rn"), origin).toString(), { waitUntil: "domcontentloaded" });
    const signIn = page.getByRole("link", { name: /sign in/i }).first();
    await expect(signIn).toBeVisible({ timeout: 45_000 });
    await expect(page.locator("#nn-learner-main")).toHaveCount(0);
  });

  test("/app/practice alias → /app/practice-tests (anonymous preserves pathwayId)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    const from = new URL(learnerPracticeAliasUrl("ca-rn-nclex-rn"), origin).toString();
    await page.goto(from, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/app\/practice-tests/, { timeout: 60_000 });
    expect(new URL(page.url()).searchParams.get("pathwayId")).toBe("ca-rn-nclex-rn");
  });

  test("marketing flashcards href includes pathway context (US RN hub)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    const fc = page.locator("section a[href*='flashcards']").first();
    await expect(fc).toBeVisible({ timeout: 60_000 });
    const href = await fc.getAttribute("href");
    expect(href && /nclex-rn/i.test(href), `flashcards link should stay on RN hub path: ${href}`).toBeTruthy();
  });

  test("blog tag index → first article resolves (SEO smoke)", async ({ page }) => {
    const response = await page.goto("/blog/tag/pathophysiology", { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(response?.status() ?? 0, "blog tag HTTP status").toBeLessThan(400);
    const firstPostLink = page.locator('main li a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute("href");
    expect(href, "first blog result href").toMatch(/^\/blog\/[^/?#]+$/);
  });

  test("anonymous flashcards URL shows sign-in (no hub mount)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.goto(new URL(learnerFlashcardsUrl("us-rn-nclex-rn"), origin).toString(), { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible({ timeout: 45_000 });
    await expect(page.locator("[data-nn-e2e-flashcards-hub]")).toHaveCount(0);
  });
});

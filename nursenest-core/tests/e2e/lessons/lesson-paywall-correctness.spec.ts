/**
 * Paywall correctness on **marketing** pathway lesson pages (preview vs full access).
 *
 * `/app/lessons/[id]` uses a different gate (subscriber-only shell) — this spec targets the public lesson
 * document where `PathwayLessonPreviewBanner` + locked-section teasers apply to guests.
 *
 * **Guest:** no auth — expects preview banner (“Free preview”), pricing CTA, and truncation affordances.
 * **Paid:** `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` — same URL must show full lesson (no Lesson access preview aside).
 *
 * ```
 * npx playwright test tests/e2e/lessons/lesson-paywall-correctness.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { defaultMarketingLessonPath, LESSON_ACCESS_ASIDE } from "../helpers/marketing-lesson-paywall";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

test.describe("Lesson paywall — guest (marketing pathway)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("preview + access gate visible; content not fully unlocked", async ({ page }, testInfo) => {
    const lessonPath = defaultMarketingLessonPath();
    const res = await page.goto(lessonPath, { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `expected 2xx for ${lessonPath}, got ${res?.status()}`).toBeTruthy();

    const accessAside = page.locator(LESSON_ACCESS_ASIDE);
    await expect(accessAside).toBeVisible({ timeout: 60_000 });
    await expect(accessAside.getByText(/Free preview/i)).toBeVisible();

    const startTrial = page.getByRole("link", { name: /^Start free trial$/i });
    await expect(startTrial).toBeVisible({ timeout: 15_000 });
    await expect(startTrial).toHaveAttribute("href", "/pricing");

    const mainArticle = page.locator("article").first();
    await expect(mainArticle).toBeVisible({ timeout: 30_000 });
    const articleText = (await mainArticle.innerText().catch(() => "")).trim();
    expect(articleText.length).toBeGreaterThan(80);

    const lockedTeaser = page.getByText(/Unlock full lesson \+ practice questions/i);
    const hasLockedSections = await lockedTeaser.isVisible().catch(() => false);
    if (hasLockedSections) {
      await expect(lockedTeaser).toBeVisible();
      await expect(page.getByRole("link", { name: /^Start free trial$/i }).first()).toBeVisible();
    }

    await expect(page.getByText(/Premium subscriber content/i)).toHaveCount(0);

    await testInfo.attach("lesson-paywall-guest.json", {
      body: Buffer.from(
        JSON.stringify({
          lessonPath,
          finalUrl: page.url(),
          hadLockedSectionTeaser: hasLockedSections,
        }),
        null,
        2,
      ),
      contentType: "application/json",
    });
  });
});

test.describe("Lesson paywall — paid subscriber (marketing pathway)", () => {
  test("full lesson surface; no guest preview paywall", async ({ page }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);

    const lessonPath = defaultMarketingLessonPath();
    const res = await page.goto(lessonPath, { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `expected 2xx for ${lessonPath}, got ${res?.status()}`).toBeTruthy();

    await expect(page.locator(LESSON_ACCESS_ASIDE)).toHaveCount(0);
    await expect(page.getByText(/^Free preview$/i)).toHaveCount(0);
    await expect(page.getByText(/Unlock the full lesson$/i)).toHaveCount(0);

    const mainArticle = page.locator("article").first();
    await expect(mainArticle).toBeVisible({ timeout: 60_000 });
    const articleText = (await mainArticle.innerText().catch(() => "")).trim();
    expect(articleText.length, "paid user should see substantive lesson body").toBeGreaterThan(400);

    await expect(page.getByText(/Unlock full lesson \+ practice questions/i)).toHaveCount(0);

    await expect(page.getByRole("heading", { name: /^Subscription required$/i })).toHaveCount(0);

    await testInfo.attach("lesson-paywall-paid.json", {
      body: Buffer.from(
        JSON.stringify({
          lessonPath,
          finalUrl: page.url(),
        }),
        null,
        2,
      ),
      contentType: "application/json",
    });
  });
});

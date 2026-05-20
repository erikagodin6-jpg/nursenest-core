/**
 * Mobile touch flows for study surfaces (paid storage state).
 * Requires `setup-paid-auth` + E2E paid credentials (see playwright.mobile.config.ts).
 */
import { expect, test, type Page } from "@playwright/test";
import {
  learnerAppMainLandmark,
  PAID_E2E_DEFAULT_PATHWAY_ID,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { assertMobileHorizontalLayoutHealth } from "../helpers/mobile-layout-health";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import {
  answerOneCatExamItem,
  clickBeginExamAfterPracticeHubStart,
} from "../helpers/cat-practice-exam-flow";
import {
  clickLinearPracticeNextItemIfPresent,
  startLinearPracticeTestFromHub,
  submitFirstLinearPracticeAnswerAndExpectRationale,
} from "../helpers/linear-practice-exam-flow";
import { learnerShellStudyNavigation } from "../helpers/learner-shell-locators";
import { learnerCatHubUrl, learnerPracticeTestsUrl } from "../helpers/tier-product-matrix";
import {
  dismissFlashcardResumeIfPresent,
  expectNoSubscriberPaywallSurface,
  expectNotLoginUrl,
} from "../helpers/paid-user-suite";

const pathwayId = PAID_E2E_DEFAULT_PATHWAY_ID;

async function skipIfPathwayNotOwned(page: Page): Promise<void> {
  const notOnAccount = page.getByText("This study track is not on your account");
  if (await notOnAccount.isVisible().catch(() => false)) {
    test.skip(true, `Fixture not entitled for pathwayId=${pathwayId}.`);
  }
}

test.describe("Mobile — learner study interactions", () => {
  test("account overview — cards + landmark + bounded width", async ({ page }) => {
    await page.goto("/app/account/overview", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "/app/account/overview");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("[data-nn-learner-account-shell]").first()).toBeVisible({ timeout: 45_000 });
    await expect(page.locator("[data-nn-learner-profile-summary-card]").first()).toBeVisible({ timeout: 45_000 });
    await assertMobileHorizontalLayoutHealth(page, "/app/account/overview");
  });

  test("account billing — main + bounded width (billing surface)", async ({ page }) => {
    await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "/app/account/billing");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 45_000 });
    await assertMobileHorizontalLayoutHealth(page, "/app/account/billing");
  });

  test("learner bottom nav — tap Lessons from /app", async ({ page }) => {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "/app");
    const nav = learnerShellStudyNavigation(page);
    await expect(nav).toBeVisible({ timeout: 60_000 });
    const lessons = nav.getByRole("link", { name: /lessons/i }).first();
    await expect(lessons).toBeVisible({ timeout: 30_000 });
    await lessons.click();
    await page.waitForURL(/\/app\/lessons/, { timeout: 60_000 });
    await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 60_000 });
    await assertMobileHorizontalLayoutHealth(page, "/app/lessons (bottom nav)");
  });

  test("flashcards hub — reveal, rating controls, bounded width", async ({ page }) => {
    await page.goto(paidFlashcardsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectNoSubscriberPaywallSurface(page, "/app/flashcards");
    await dismissFlashcardResumeIfPresent(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 120_000 });
    await assertMobileHorizontalLayoutHealth(page, "/app/flashcards hub");

    const start = page.locator("[data-nn-e2e-start-review]").first();
    await expect(start).toBeVisible({ timeout: 120_000 });
    await start.click();
    await page.waitForLoadState("domcontentloaded");
    const reveal = page.getByRole("button", { name: /show answer|reveal answer/i });
    await expect(reveal).toBeVisible({ timeout: 120_000 });
    await assertMobileHorizontalLayoutHealth(page, "flashcard session (front)");
    await reveal.click();
    await expect(page.getByRole("button", { name: /^Known$/i })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: /^Incorrect$/i })).toBeVisible({ timeout: 15_000 });
    await assertMobileHorizontalLayoutHealth(page, "flashcard session (revealed + ratings)");
  });

  test("linear practice — CAT-style runner stem, submit answer, rationale, bounded width", async ({ page }) => {
    test.setTimeout(240_000);
    await page.goto(learnerPracticeTestsUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "practice-tests linear");
    await skipIfPathwayNotOwned(page);

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });
    await expect(
      page.getByText("NN_RENDER_TRACE: practice exams live route (/app/practice-tests)"),
    ).toBeVisible({ timeout: 30_000 });

    await startLinearPracticeTestFromHub(page, pathwayId);

    await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({ timeout: 120_000 });
    await assertMobileHorizontalLayoutHealth(page, "linear practice (stem visible)");
    await submitFirstLinearPracticeAnswerAndExpectRationale(page);
    await assertMobileHorizontalLayoutHealth(page, "linear practice (after rationale)");
    await clickLinearPracticeNextItemIfPresent(page);
    await assertMobileHorizontalLayoutHealth(page, "linear practice (after optional next)");
  });

  test("CAT exam mode — stem + options, submit one item, bounded width", async ({ page }) => {
    test.setTimeout(240_000);
    await page.goto(learnerCatHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "CAT hub");
    await skipIfPathwayNotOwned(page);

    await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
    await page.locator("[data-nn-qa-practice-hub-start-test]").click();
    await clickBeginExamAfterPracticeHubStart(page);
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

    await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({ timeout: 120_000 });
    await assertMobileHorizontalLayoutHealth(page, "CAT session (stem)");
    const list = page.locator("ul.nn-cat-opt-list").first();
    await expect(list).toBeVisible({ timeout: 60_000 });
    await assertMobileHorizontalLayoutHealth(page, "CAT session (options)");

    await answerOneCatExamItem(page);
    await assertMobileHorizontalLayoutHealth(page, "CAT session (after one advance)");
  });

  test("questions hub — bounded width (practice entry surface)", async ({ page }) => {
    await page.goto(`/app/questions?pathwayId=${encodeURIComponent(pathwayId)}`, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectNoSubscriberPaywallSurface(page, "/app/questions");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
    await assertMobileHorizontalLayoutHealth(page, "/app/questions mobile");
  });
});

import { expect, test } from "@playwright/test";
import { expectNoBlockingA11yViolations } from "../helpers/accessibility";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { PAID_E2E_DEFAULT_PATHWAY_ID, learnerAppMainLandmark, waitForAuthenticatedLearnerShell } from "../helpers/paid-learner-shell";
import { dismissFlashcardResumeIfPresent } from "../helpers/paid-user-suite";

test.describe("Paid learner accessibility smoke", () => {
  test("lesson detail", async ({ page }, testInfo) => {
    await page.goto(paidLessonsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    const lessonLink = page.locator(LESSON_HUB_CARD_LINKS).first();
    await expect(lessonLink).toBeVisible({ timeout: 120_000 });
    const lessonHref = await lessonLink.getAttribute("href");
    expect(lessonHref, "expected at least one lesson detail href").toBeTruthy();
    await page.goto(lessonHref!, { waitUntil: "domcontentloaded" });
    await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 60_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "paid-lesson-detail" });
  });

  test("flashcards study surface", async ({ page }, testInfo) => {
    await page.goto(paidFlashcardsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    const learnLink = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
    await expect(learnLink).toBeVisible({ timeout: 120_000 });
    const deckHref = await learnLink.getAttribute("href");
    expect(deckHref, "expected a flashcards learn-mode href").toBeTruthy();
    await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
    await dismissFlashcardResumeIfPresent(page);
    await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 60_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "paid-flashcards" });
  });

  test("question bank", async ({ page }, testInfo) => {
    await page.goto(paidQuestionsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(".nn-qopt-list").first()).toBeVisible({ timeout: 120_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "paid-question-bank" });
  });

  test("CAT start flow", async ({ page }, testInfo) => {
    await page.goto(`/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForAuthenticatedLearnerShell(page);
    const start = page.locator("[data-nn-qa-practice-hub-start-test]");
    await expect(start).toBeVisible({ timeout: 60_000 });
    await start.click();
    await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 30_000 });
    await expectNoBlockingA11yViolations({ page, testInfo, label: "paid-cat-start-flow" });
  });
});

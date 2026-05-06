/**
 * Phase 3 — credential-gated synthetic paid learner journey (read-only, no purchases).
 * Runs after `setup-paid-auth` when `E2E_PAID_*` / `QA_PAID_*` / `PLAYWRIGHT_TEST_*` are set;
 * otherwise the whole describe is skipped (exit 0, not a failure).
 */
import { expect, test } from "@playwright/test";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { LESSON_HUB_CARD_LINKS, paidFlashcardsHubUrl, paidLessonsHubUrl } from "../helpers/paid-content-discovery";
import {
  clickLinearPracticeNextItemIfPresent,
  startLinearPracticeTestFromHub,
  submitFirstLinearPracticeAnswerAndExpectRationale,
} from "../helpers/linear-practice-exam-flow";
import { dismissFlashcardResumeIfPresent, expectNoSubscriberPaywallSurface, expectNotLoginUrl } from "../helpers/paid-user-suite";
import {
  answerOneCatExamItem,
  clickBeginExamAfterPracticeHubStart,
} from "../helpers/cat-practice-exam-flow";
import { hasPaidTestCredentials } from "../helpers/paid-test-credentials";
import { attachFailureClassification } from "../helpers/failure-classification-tags";

const pathwayId = PAID_E2E_DEFAULT_PATHWAY_ID;

test.describe("Phase 3 — synthetic paid learner smoke", () => {
  test.describe.configure({ mode: "serial" });
  test.skip(
    !hasPaidTestCredentials(),
    "Credential-gated (explicit skip, not a failure): set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD). See docs/RELEASE_QA.md.",
  );

  test("app shell loads", async ({ page }) => {
    attachFailureClassification(test.info(), "route_crash");
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase3 /app");
  });

  test("pathway lessons hub", async ({ page }) => {
    attachFailureClassification(test.info(), "route_crash");
    await page.goto(paidLessonsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase3 lessons hub");
    await expect(page.locator(LESSON_HUB_CARD_LINKS).first()).toBeVisible({ timeout: 120_000 });
  });

  test("flashcards hub → start session → reveal (read-only)", async ({ page }) => {
    attachFailureClassification(test.info(), "route_crash");
    test.setTimeout(300_000);
    await page.goto(paidFlashcardsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectNoSubscriberPaywallSurface(page, "phase3 flashcards hub");
    await dismissFlashcardResumeIfPresent(page);
    const start = page.locator("[data-nn-e2e-start-review]").first();
    await expect(start).toBeVisible({ timeout: 120_000 });
    await start.click();
    const reveal = page.getByRole("button", { name: /show answer|reveal answer/i });
    await expect(reveal).toBeVisible({ timeout: 120_000 });
    await reveal.click();
    await expect(page.getByRole("button", { name: /^Known$/i })).toBeVisible({ timeout: 30_000 });
  });

  test("CAT hub → first question only", async ({ page }) => {
    attachFailureClassification(test.info(), "route_crash");
    test.setTimeout(300_000);
    await page.goto(`/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pathwayId)}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase3 CAT hub");
    const startCat = page.locator("[data-nn-qa-practice-hub-start-test]");
    const visible = await startCat.isVisible().catch(() => false);
    test.skip(
      !visible,
      "empty_pool: CAT hub has no startable session for this pathway (explicit harness skip, not a failure).",
    );
    await startCat.click();
    await clickBeginExamAfterPracticeHubStart(page);
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
    await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({ timeout: 120_000 });
    await answerOneCatExamItem(page);
  });

  test("practice hub → linear first question", async ({ page }) => {
    attachFailureClassification(test.info(), "route_crash");
    test.setTimeout(300_000);
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    await startLinearPracticeTestFromHub(page, pathwayId);
    await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({ timeout: 120_000 });
    await submitFirstLinearPracticeAnswerAndExpectRationale(page);
    await clickLinearPracticeNextItemIfPresent(page);
  });

  test("account billing (read-only)", async ({ page }) => {
    attachFailureClassification(test.info(), "route_crash");
    await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase3 billing");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 45_000 });
  });
});

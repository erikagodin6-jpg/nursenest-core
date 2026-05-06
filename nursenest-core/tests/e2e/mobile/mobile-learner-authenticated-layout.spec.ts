/**
 * Paid learner surfaces on mobile — requires `setup-paid-auth` + storage state
 * (see playwright.mobile.config.ts).
 */
import { expect, test } from "@playwright/test";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { assertMobileHorizontalLayoutHealth } from "../helpers/mobile-layout-health";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
} from "../helpers/paid-content-discovery";
import {
  dismissFlashcardResumeIfPresent,
  expectNoSubscriberPaywallSurface,
  expectNotLoginUrl,
} from "../helpers/paid-user-suite";

const pathwayId = PAID_E2E_DEFAULT_PATHWAY_ID;

test.describe("Mobile — authenticated learner width", () => {
  test("dashboard, onboarding, lessons, practice, flashcards, billing, questions, CAT hub, labs, ECG", async ({
    page,
  }) => {
    await test.step("Dashboard", async () => {
      await page.goto("/app", { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForAuthenticatedLearnerShell(page);
      await expectNoSubscriberPaywallSurface(page, "/app");
      await assertMobileHorizontalLayoutHealth(page, "/app");
    });

    await test.step("Onboarding route", async () => {
      await page.goto("/app/onboarding", { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expect(page.locator("main").first()).toBeVisible({ timeout: 30_000 });
      await assertMobileHorizontalLayoutHealth(page, "/app/onboarding");
    });

    await test.step("Lesson hub + first lesson", async () => {
      await page.goto(paidLessonsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectNoSubscriberPaywallSurface(page, "/app/lessons");
      const first = page.locator(LESSON_HUB_CARD_LINKS).first();
      await expect(first).toBeVisible({ timeout: 120_000 });
      await first.click();
      await page.waitForLoadState("domcontentloaded");
      expectNotLoginUrl(page);
      await expectNoSubscriberPaywallSurface(page, "lesson mobile");
      const main = page.locator("#nn-learner-main").or(page.locator("[data-nn-learner-main]")).or(page.locator("main"));
      await expect(main.first()).toBeVisible({ timeout: 30_000 });
      const text = await main.first().innerText();
      expect(text.length).toBeGreaterThan(120);
      await assertMobileHorizontalLayoutHealth(page, "lesson detail");
    });

    await test.step("Practice tests hub", async () => {
      await page.goto(`/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}`, {
        waitUntil: "domcontentloaded",
      });
      expectNotLoginUrl(page);
      await expectNoSubscriberPaywallSurface(page, "/app/practice-tests");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 60_000 });
      await assertMobileHorizontalLayoutHealth(page, "/app/practice-tests");
    });

    await test.step("CAT entry hub", async () => {
      await page.goto(`/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pathwayId)}`, {
        waitUntil: "domcontentloaded",
      });
      expectNotLoginUrl(page);
      await expectNoSubscriberPaywallSurface(page, "CAT hub");
      await assertMobileHorizontalLayoutHealth(page, "/app/practice-tests cat");
    });

    await test.step("Flashcards hub", async () => {
      await page.goto(paidFlashcardsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectNoSubscriberPaywallSurface(page, "/app/flashcards");
      await dismissFlashcardResumeIfPresent(page);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 120_000 });
      await assertMobileHorizontalLayoutHealth(page, "/app/flashcards");
    });

    await test.step("Account billing", async () => {
      await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expect(page.locator("main").first()).toBeVisible({ timeout: 60_000 });
      await assertMobileHorizontalLayoutHealth(page, "/app/account/billing");
    });

    await test.step("Questions hub", async () => {
      await page.goto(`/app/questions?pathwayId=${encodeURIComponent(pathwayId)}`, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectNoSubscriberPaywallSurface(page, "/app/questions");
      await assertMobileHorizontalLayoutHealth(page, "/app/questions");
    });

    await test.step("Labs index", async () => {
      await page.goto("/app/labs", { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await assertMobileHorizontalLayoutHealth(page, "/app/labs");
    });

    await test.step("ECG video quiz", async () => {
      await page.goto("/app/ecg-video-quiz", { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await assertMobileHorizontalLayoutHealth(page, "/app/ecg-video-quiz");
    });
  });
});

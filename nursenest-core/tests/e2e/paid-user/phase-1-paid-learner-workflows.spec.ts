/**
 * Phase 1 — deep paid learner workflows for the production release gate.
 * Requires `setup-paid-auth` + paid storage state (see playwright.release-gate.config.ts).
 *
 * @see reports/phase-1-operational-hardening.md
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
import {
  dismissFlashcardResumeIfPresent,
  expectNoSubscriberPaywallSurface,
  expectNotLoginUrl,
} from "../helpers/paid-user-suite";
import { hasAdminE2eCredentials, getAdminE2eCredentials } from "../helpers/smoke-credentials";
import { loginWithCredentials } from "../helpers/learner-login";

const pathwayId = PAID_E2E_DEFAULT_PATHWAY_ID;

test.describe("Phase 1 — paid learner workflows (release)", () => {
  test("pathway lessons hub + lesson detail + mark studied (no crash)", async ({ page }) => {
    test.setTimeout(240_000);
    await page.goto(paidLessonsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase1 lessons hub");
    const first = page.locator(LESSON_HUB_CARD_LINKS).first();
    await expect(first).toBeVisible({ timeout: 120_000 });
    await first.click();
    await page.waitForLoadState("domcontentloaded");
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase1 lesson detail");
    const markBtn = page.getByRole("button", { name: /mark.*studied|mark as studied/i }).first();
    if (await markBtn.isVisible().catch(() => false)) {
      await markBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("flashcards pool is non-zero when CAT hub exposes start; session reveal works", async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto(`/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pathwayId)}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "CAT hub inventory probe");
    const startCat = page.locator("[data-nn-qa-practice-hub-start-test]");
    const catStartVisible = await startCat.isVisible().catch(() => false);

    await page.goto(paidFlashcardsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectNoSubscriberPaywallSurface(page, "phase1 flashcards hub");
    await dismissFlashcardResumeIfPresent(page);
    const poolLine = page.getByText(/\d+\s+cards in pool/i);
    await expect(poolLine).toBeVisible({ timeout: 120_000 });
    const poolText = (await poolLine.innerText()).trim();
    const m = poolText.match(/(\d+)\s+cards in pool/i);
    expect(m, "expected flashcards pool count in hub header").toBeTruthy();
    const n = Number(m![1]);
    if (catStartVisible) {
      expect(n, "flashcards pool should be >0 when CAT hub shows a startable session").toBeGreaterThan(0);
    } else {
      expect(n).toBeGreaterThanOrEqual(0);
    }

    const start = page.locator("[data-nn-e2e-start-review]").first();
    await expect(start).toBeVisible({ timeout: 120_000 });
    await start.click();
    const reveal = page.getByRole("button", { name: /show answer|reveal answer/i });
    await expect(reveal).toBeVisible({ timeout: 120_000 });
    await reveal.click();
    await expect(page.getByRole("button", { name: /^Known$/i })).toBeVisible({ timeout: 30_000 });
  });

  test("linear practice: first question, rationale after submit, optional next (no CAT-only deferral leak)", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    await startLinearPracticeTestFromHub(page, pathwayId);
    await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({ timeout: 120_000 });
    await submitFirstLinearPracticeAnswerAndExpectRationale(page);

    const advanced = await clickLinearPracticeNextItemIfPresent(page);
    if (advanced) {
      await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({ timeout: 60_000 });
    }
  });

  test("onboarding entry loads for authenticated subscriber", async ({ page }) => {
    await page.goto("/app/onboarding", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expect(page.locator("main").first()).toBeVisible({ timeout: 45_000 });
  });

  test("account billing route loads for subscriber", async ({ page }) => {
    await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriberPaywallSurface(page, "phase1 billing");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 45_000 });
  });

  test("admin shell smoke (staff credentials only)", async ({ browser }) => {
    test.skip(!hasAdminE2eCredentials(), "Credential-gated: set E2E_ADMIN_EMAIL + E2E_ADMIN_PASSWORD");
    const creds = getAdminE2eCredentials()!;
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      await loginWithCredentials(page, creds.email, creds.password);
      await page.goto("/admin", { waitUntil: "domcontentloaded", timeout: 90_000 });
      await expect(page.locator("main, [data-nn-admin-root], body")).toBeVisible({ timeout: 45_000 });
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body.length).toBeGreaterThan(40);
    } finally {
      await ctx.close();
    }
  });
});

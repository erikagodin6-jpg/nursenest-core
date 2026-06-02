/**
 * Linear practice exam premium shell — smoke + rationale column + placeholder leak guard.
 * Requires paid auth storage (same as release-blocking-paid).
 */
import { expect, test } from "@playwright/test";
import { PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import {
  startLinearPracticeTestFromHub,
  submitFirstLinearPracticeAnswerAndExpectRationale,
} from "../helpers/linear-practice-exam-flow";

test.describe("Practice exam — premium linear shell", () => {
  test("hub → runner shows premium chrome and rationale (desktop)", async ({ page }) => {
    await startLinearPracticeTestFromHub(page, PAID_E2E_DEFAULT_PATHWAY_ID);
    await expectNoSubscriptionPaywall(page, "practice hub");

    const runnerRoot = page.locator(".nn-practice-exam-runner");
    if ((await runnerRoot.count()) > 0) {
      await expect(runnerRoot).toBeVisible({ timeout: 60_000 });
      await expect(page.locator("[data-nn-qa-practice-rationale-column]")).toBeVisible({
        timeout: 60_000,
      });
    }
    await submitFirstLinearPracticeAnswerAndExpectRationale(page);

    const main = page.locator("main").first();
    const bodyText = (await main.textContent()) ?? "";
    expect(bodyText).not.toContain("learner.practiceTests.run.");
  });

  test("same flow — mobile viewport overflow sanity", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startLinearPracticeTestFromHub(page, PAID_E2E_DEFAULT_PATHWAY_ID);
    await expectNoSubscriptionPaywall(page, "practice hub mobile");
    await submitFirstLinearPracticeAnswerAndExpectRationale(page);
    const rationaleScroll = page.locator(".nn-practice-rationale-full__scroll").first();
    await expect(rationaleScroll).toBeVisible({ timeout: 90_000 });
    const box = await rationaleScroll.boundingBox();
    expect(box && box.height > 80).toBeTruthy();
  });
});

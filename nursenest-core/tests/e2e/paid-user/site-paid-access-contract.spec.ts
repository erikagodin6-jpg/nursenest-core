/**
 * Paid subscriber: app shell + lessons content must render (not paywall, not blank).
 *
 * Requires `chromium-paid` + `E2E_PAID_*` credentials (see `tests/e2e/helpers/paid-test-credentials.ts`).
 *
 * Selectors:
 * - `[data-testid="learner-shell"]` — learner chrome root (`(learner)/layout.tsx`)
 * - `#nn-learner-main`, `[data-nn-learner-main]`, or `.nn-learner-app main` — main landmark (`paid-learner-shell.ts`)
 * - `a[href*="/app/lessons/"]` — lesson hub cards (`LESSON_HUB_CARD_LINKS` in `paid-content-discovery.ts`)
 */
import { expect, test } from "@playwright/test";
import { LESSON_HUB_CARD_LINKS, paidLessonsHubUrl } from "../helpers/paid-content-discovery";
import { expectNoSubscriberPaywallSurface, expectNotLoginUrl } from "../helpers/paid-user-suite";
import { expectPaidLearnerShellReady, learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { SEL_LEARNER_SHELL } from "../helpers/site-never-broken-contract";

test.describe("Paid user — site never broken (access contract)", () => {
  test("/app dashboard: shell + main, no paywall", async ({ page }) => {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "contract /app");
    await expectNoSubscriberPaywallSurface(page, "contract /app");
    await expect(page.locator(SEL_LEARNER_SHELL)).toBeVisible({ timeout: 60_000 });
    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 60_000 });
    const box = await main.boundingBox();
    expect(box && box.height > 120, "main content region has height").toBe(true);
  });

  test("/app/lessons hub: shell + lesson links, no paywall", async ({ page }) => {
    await page.goto(paidLessonsHubUrl(), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "contract /app/lessons");
    await expectNoSubscriberPaywallSurface(page, "contract lessons hub");
    await expect(page.locator(SEL_LEARNER_SHELL)).toBeVisible({ timeout: 60_000 });
    const cards = page.locator(LESSON_HUB_CARD_LINKS);
    await expect(cards.first()).toBeVisible({ timeout: 45_000 });
  });
});

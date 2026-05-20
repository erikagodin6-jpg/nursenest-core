/**
 * Paid account hub — optional release gate (set E2E_RELEASE_SKIP_BILLING=1 to skip).
 * Does not hit Stripe checkout; read-only smoke.
 */
import { expect, test } from "@playwright/test";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import { expectNoSubscriberPaywallSurface } from "../helpers/paid-user-suite";

test.describe("Release — account / billing smoke", () => {
  test("account overview shell", async ({ page, baseURL }) => {
    test.skip(process.env.E2E_RELEASE_SKIP_BILLING === "1", "E2E_RELEASE_SKIP_BILLING=1");

    await page.goto("/app/account/overview", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "release account/overview");
    await expectNoSubscriberPaywallSurface(page, "release account overview");
    await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
  });
});

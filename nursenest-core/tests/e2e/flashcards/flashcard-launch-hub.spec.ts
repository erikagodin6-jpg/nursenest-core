/**
 * Flashcard Launch Hub failure/regression guard.
 *
 * The hub must render a usable shell and deck categories quickly, even when the
 * live inventory endpoint is slow. This catches the production failure mode
 * where clicking Flashcards appeared to do nothing while inventory/analytics
 * blocked the route.
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";

const FLASHCARDS_HUB = "/app/flashcards?pathwayId=ca-rn-nclex-rn";

test.describe("Flashcard Launch Hub", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders deck categories within SLA when inventory is delayed", async ({ page, baseURL }) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD or E2E_PAID_* for authenticated flashcards launch.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: new URL(baseURL ?? "http://127.0.0.1:3000").origin,
    });

    await page.route("**/api/flashcards/inventory**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await route.continue();
    });

    const startedAt = Date.now();
    await page.goto(FLASHCARDS_HUB, { waitUntil: "domcontentloaded", timeout: 60_000 });

    const main = learnerAppMainLandmark(page);
    await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 1000 });
    await expect(main.locator("[data-nn-e2e-flashcards-canonical-grid]")).toBeVisible({ timeout: 1000 });
    await expect(main.locator("[data-nn-e2e-flashcards-system-card]").first()).toBeVisible({ timeout: 1000 });
    await expect(main.locator("[data-nn-e2e-start-review]").first()).toBeVisible({ timeout: 2000 });

    const firstContentMs = Date.now() - startedAt;
    expect(firstContentMs, `Flashcard hub first content took ${firstContentMs}ms`).toBeLessThanOrEqual(2000);
    await expect(page.locator("[data-nn-e2e-flashcards-recovery-shell]")).toHaveCount(0);
  });
});

/**
 * Post-login paid surfaces smoke (inventory > 0) — **credential gated**.
 * Without E2E_PAID_SMOKE_EMAIL + E2E_PAID_SMOKE_PASSWORD the suite skips (CI-friendly).
 *
 * Run: `npm run smoke:paid-unlock` from `nursenest-core/` (or `npx playwright test` on this file).
 */
import { test } from "@playwright/test";
import { assertSafeSubscriberJourneyBaseUrl } from "../helpers/e2e-safety-guards";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectAtLeastOneLessonLink, paidLessonsHubUrl } from "../helpers/paid-content-discovery";

const email = process.env.E2E_PAID_SMOKE_EMAIL?.trim();
const password = process.env.E2E_PAID_SMOKE_PASSWORD?.trim();

test.describe("paid unlock smoke (credential-gated)", () => {
  test.skip(!email || !password, "Set E2E_PAID_SMOKE_EMAIL and E2E_PAID_SMOKE_PASSWORD to run paid unlock smoke");

  test("lessons hub shows at least one lesson link after login", async ({ page }) => {
    assertSafeSubscriberJourneyBaseUrl();
    await loginWithCredentials(page, email!, password!);
    await page.goto(paidLessonsHubUrl());
    await expectAtLeastOneLessonLink(page, { timeoutMs: 120_000 });
  });
});

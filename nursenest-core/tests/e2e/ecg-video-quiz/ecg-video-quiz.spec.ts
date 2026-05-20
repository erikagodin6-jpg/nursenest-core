import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test("ECG video quiz hub loads and keeps CAT/practice safety copy visible", async ({ page }, testInfo) => {
  const creds = getQaPaidCredentials();
  test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");
  const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });
  try {
    await loginWithCredentials(page, creds!.email, creds!.password);
    await expectOnPaidSubscriberApp(page);
    await page.goto("/app/ecg-video-quiz", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /ECG video quiz/i })).toBeVisible();
    await expect(page.getByText(/rationales, recognition clues/i)).toBeVisible();
    await expect(page.getByText(/CAT and exam modes keep teaching feedback hidden/i)).toBeVisible();
    expect(observers.failedRequests, observers.failedRequests.join(" | ")).toEqual([]);
  } finally {
    await logObserverDiagnostics(observers, testInfo.title);
    observers.dispose();
  }
});

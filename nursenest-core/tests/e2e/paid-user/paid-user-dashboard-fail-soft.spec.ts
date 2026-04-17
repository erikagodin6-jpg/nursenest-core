/**
 * Fail-soft dashboard: optional client refresh fails with 500 while the shell and SSR snapshot stay up.
 *
 * **Note on `/api/report-card`:** the learner report card is loaded on `/app/account/report-card` via server
 * data (`loadReportCardData`), not a `/api/report-card` fetch from `/app`. The dashboard **Topic performance**
 * panel calls **`GET /api/learner/weak-areas`** (see `WeakAreasDashboardClient`) and shows inline fallback copy
 * when refresh fails — that is what we intercept here.
 *
 * **Auth:** `chromium-paid` + `setup-paid-auth` storage — no UI login.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-dashboard-fail-soft.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

const FAIL_SOFT_API_GLOB = "**/api/learner/weak-areas*";

test.describe("Paid user — dashboard fail-soft (weak-areas 500)", () => {
  test("shell + main render; Topic performance shows inline fallback; no blank / crash", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;

    let interceptCount = 0;
    await page.route(FAIL_SOFT_API_GLOB, async (route) => {
      interceptCount += 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "e2e_synthetic_weak_areas_500" }),
      });
    });

    await page.goto("/app", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForLoadState("networkidle").catch(() => {
      /* dev long-poll / analytics — best-effort */
    });

    await expect(page.getByTestId("learner-shell")).toBeVisible({ timeout: 30_000 });
    await expectNoSubscriptionPaywall(page, "dashboard fail-soft /app");

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 30_000 });
    const mainText = (await main.innerText().catch(() => "")).trim();
    expect(mainText.length, "learner main should not be blank after synthetic API failure").toBeGreaterThan(80);

    await expect(page.locator("#nn-learner-main").getByRole("heading", { level: 1 }).first()).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByRole("heading", { name: /^Topic performance$/i })).toBeVisible({ timeout: 45_000 });

    await expect(page.getByText(/e2e_synthetic_weak_areas_500/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Showing last loaded data/i)).toBeVisible({ timeout: 10_000 });

    await testInfo.attach("dashboard-fail-soft.json", {
      body: Buffer.from(
        JSON.stringify(
          {
            appOrigin,
            interceptedPattern: FAIL_SOFT_API_GLOB,
            fulfillStatus: 500,
            interceptCount,
            finalUrl: page.url(),
          },
          null,
          2,
        ),
      ),
      contentType: "application/json",
    });

    expect(interceptCount, "expected at least one intercepted weak-areas refresh").toBeGreaterThan(0);
  });
});

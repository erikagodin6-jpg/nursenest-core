/**
 * Flashcards Hub Instant Startup
 *
 * Guards the production failure mode where `/app/flashcards` blocked first paint
 * on inventory aggregation, adaptive analytics, or progress/recommendation calls.
 *
 * Run:
 *   npx playwright test tests/e2e/performance/flashcards-hub-instant-startup.spec.ts --project=chromium
 */

import { expect, test, type Request } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

const FLASHCARDS_PATH = "/app/flashcards?pathwayId=ca-rn-nclex-rn";
const FIRST_CONTENT_BUDGET_MS = Number(process.env.E2E_FLASHCARDS_HUB_BUDGET_MS ?? "2000");
const DEFERRED_API_GRACE_MS = Number(process.env.E2E_FLASHCARDS_DEFERRED_API_GRACE_MS ?? "100");

const DEFERRED_STARTUP_ENDPOINTS = [
  "/api/learner/weak-areas",
  "/api/flashcards/stats",
  "/api/flashcards/due-summary",
  "/api/flashcards/study-queue",
];

test.describe("Flashcards hub instant startup", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders the study shell before deferred analytics endpoints start", async ({ page, baseURL }) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD or E2E_PAID_* for authenticated flashcards performance.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: new URL(baseURL ?? "http://127.0.0.1:3000").origin,
    });

    const apiStarts: Array<{ pathname: string; elapsedMs: number }> = [];
    let navStartedAt = 0;

    page.on("request", (request: Request) => {
      if (!navStartedAt) return;
      if (request.resourceType() !== "fetch" && request.resourceType() !== "xhr") return;
      const url = new URL(request.url());
      if (!DEFERRED_STARTUP_ENDPOINTS.some((path) => url.pathname === path)) return;
      apiStarts.push({
        pathname: url.pathname,
        elapsedMs: Date.now() - navStartedAt,
      });
    });

    navStartedAt = Date.now();
    await page.goto(FLASHCARDS_PATH, { waitUntil: "domcontentloaded", timeout: 60_000 });

    const hub = page.locator("[data-nn-e2e-flashcards-hub]").first();
    await hub.waitFor({ state: "visible", timeout: FIRST_CONTENT_BUDGET_MS });
    const firstContentMs = Date.now() - navStartedAt;

    await expect(page.locator("[data-nn-e2e-flashcards-canonical-grid]")).toBeVisible({
      timeout: FIRST_CONTENT_BUDGET_MS,
    });

    const blockingDeferredCalls = apiStarts.filter(
      (sample) => sample.elapsedMs < firstContentMs + DEFERRED_API_GRACE_MS,
    );

    expect(
      firstContentMs,
      `Flashcards shell took ${firstContentMs}ms; budget is ${FIRST_CONTENT_BUDGET_MS}ms.`,
    ).toBeLessThanOrEqual(FIRST_CONTENT_BUDGET_MS);
    expect(
      blockingDeferredCalls,
      `Deferred analytics/progress endpoints started before first content: ${JSON.stringify(blockingDeferredCalls)}`,
    ).toHaveLength(0);
  });
});

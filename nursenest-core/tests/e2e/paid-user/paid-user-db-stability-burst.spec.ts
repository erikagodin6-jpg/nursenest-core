/**
 * DB stability burst: 10 parallel browser contexts each perform credentials login, then GET `/app` and `/app/lessons`.
 *
 * - **Auth:** fresh context per user (no `storageState`) — exercises login + session under parallel load.
 * - **Pass criteria:** failure rate ≤ 1% over all attempted steps; no 5xx on document navigations; no Playwright timeouts.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-db-stability-burst.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

const PARALLEL_USERS = 10;
/** Document navigations after login — generous for cold SSR + DB. */
const DOCUMENT_NAV_TIMEOUT_MS = 90_000;
const MAX_FAILURE_RATE = 0.01;

type BurstStepRecord = {
  userIndex: number;
  step: "login" | "GET /app" | "GET /app/lessons";
  durationMs: number;
  httpStatus?: number;
  ok: boolean;
  error?: string;
};

type UserBurstResult = {
  userIndex: number;
  steps: BurstStepRecord[];
  attempts: number;
  failures: number;
};

function isDocumentOk(status: number | undefined): boolean {
  if (status === undefined) return false;
  if (status >= 500) return false;
  return status === 200;
}

async function runOneParallelUser(
  browser: Browser,
  baseURL: string,
  email: string,
  password: string,
  userIndex: number,
): Promise<UserBurstResult> {
  const steps: BurstStepRecord[] = [];
  let attempts = 0;
  let failures = 0;

  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    attempts += 1;
    const loginStart = Date.now();
    try {
      await loginWithCredentials(page, email, password);
      steps.push({
        userIndex,
        step: "login",
        durationMs: Date.now() - loginStart,
        ok: true,
      });
    } catch (e) {
      failures += 1;
      const msg = e instanceof Error ? e.message : String(e);
      steps.push({
        userIndex,
        step: "login",
        durationMs: Date.now() - loginStart,
        ok: false,
        error: msg,
      });
      return { userIndex, steps, attempts, failures };
    }

    for (const path of ["/app", "/app/lessons"] as const) {
      attempts += 1;
      const label = path === "/app" ? "GET /app" : "GET /app/lessons";
      const t0 = Date.now();
      try {
        const response = await page.goto(path, {
          waitUntil: "domcontentloaded",
          timeout: DOCUMENT_NAV_TIMEOUT_MS,
        });
        const status = response?.status();
        const ok = isDocumentOk(status);
        if (!ok) failures += 1;
        steps.push({
          userIndex,
          step: label,
          durationMs: Date.now() - t0,
          httpStatus: status,
          ok,
          error: ok
            ? undefined
            : status !== undefined && status >= 500
              ? `HTTP ${status} (server error)`
              : status !== undefined
                ? `HTTP ${status} (expected 200)`
                : "No response from navigation",
        });
      } catch (e) {
        failures += 1;
        const msg = e instanceof Error ? e.message : String(e);
        steps.push({
          userIndex,
          step: label,
          durationMs: Date.now() - t0,
          ok: false,
          error: msg.includes("Timeout") ? `Timeout: ${msg}` : msg,
        });
      }
    }

    return { userIndex, steps, attempts, failures };
  } finally {
    await context.close();
  }
}

test.describe("Paid user — DB stability burst (parallel logins + app navigations)", () => {
  test("10 parallel users: login → /app → /app/lessons; failure rate ≤ 1%", async ({ browser, baseURL }, testInfo) => {
    test.setTimeout(420_000);

    const creds = getPaidTestCredentials();
    test.skip(!creds, "Requires E2E_PAID_EMAIL / E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    const origin = baseURL ?? "http://127.0.0.1:3000";

    const userResults = await Promise.all(
      Array.from({ length: PARALLEL_USERS }, (_, i) =>
        runOneParallelUser(browser, origin, creds!.email, creds!.password, i),
      ),
    );

    let totalAttempts = 0;
    let totalFailures = 0;
    const allSteps: BurstStepRecord[] = [];

    for (const r of userResults) {
      totalAttempts += r.attempts;
      totalFailures += r.failures;
      allSteps.push(...r.steps);
    }

    const failureRate = totalAttempts > 0 ? totalFailures / totalAttempts : 0;

    const summary = {
      parallelUsers: PARALLEL_USERS,
      totalAttempts,
      totalFailures,
      failureRate,
      maxAllowedFailureRate: MAX_FAILURE_RATE,
      baseURL: origin,
      steps: allSteps,
    };

    await testInfo.attach("db-stability-burst-results.json", {
      body: Buffer.from(JSON.stringify(summary, null, 2)),
      contentType: "application/json",
    });

    expect(
      failureRate,
      `Burst failure rate ${(failureRate * 100).toFixed(2)}% exceeds ${MAX_FAILURE_RATE * 100}% (${totalFailures}/${totalAttempts} failed steps). Step failures count timeouts, HTTP 5xx, and non-200 document responses. See db-stability-burst-results.json.`,
    ).toBeLessThanOrEqual(MAX_FAILURE_RATE);
  });
});

/**
 * DB **connection** burst: N parallel browser contexts each log in, hit `/app` three times, then `/app/lessons`.
 *
 * - **Auth:** fresh context per user (no `storageState`) — stresses DB pool + sessions under parallel load.
 * - **Pass criteria:** no aggregated error text matching Postgres/network failure signals; mean navigation time
 *   (successful document loads only) &lt; 2s; zero failed navigations / connection error patterns.
 *
 * **Env:** `E2E_DB_CONN_BURST_USERS` (default `10`, clamped 1–50); optional `E2E_DB_CONN_BURST_MEAN_SLA_MS`
 *   (default `2000`) relaxes mean navigation SLA on cold `next dev` if needed.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-db-connection-burst.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

function parallelUserCountFromEnv(): number {
  const raw = process.env.E2E_DB_CONN_BURST_USERS?.trim();
  if (!raw) return 10;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return 10;
  return Math.min(50, Math.max(1, n));
}

/** Document navigations after login. */
const DOCUMENT_NAV_TIMEOUT_MS = 90_000;
function meanNavSlaMsFromEnv(): number {
  const raw = process.env.E2E_DB_CONN_BURST_MEAN_SLA_MS?.trim();
  if (!raw) return 2_000;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 2_000;
}

/**
 * Substrings that indicate pool exhaustion / network reset / time budget failures on the DB path.
 * Uses `\btimeout\b` to avoid matching `setTimeout` identifiers in stack traces.
 */
const DB_CONNECTION_ERROR_RES = [/too many connections/i, /\btimeout\b/i, /ECONNRESET/i] as const;

function isDocumentOk(status: number | undefined): boolean {
  if (status === undefined) return false;
  if (status >= 500) return false;
  return status === 200;
}

function textLooksLikeDbConnectionFailure(text: string): boolean {
  return DB_CONNECTION_ERROR_RES.some((re) => re.test(text));
}

function collectForbiddenMatches(lines: string[]): string[] {
  const out: string[] = [];
  for (const line of lines) {
    if (textLooksLikeDbConnectionFailure(line)) {
      out.push(line);
    }
  }
  return out;
}

type BurstStepRecord = {
  userIndex: number;
  step: string;
  durationMs: number;
  httpStatus?: number;
  ok: boolean;
  error?: string;
};

type UserConnBurstResult = {
  userIndex: number;
  steps: BurstStepRecord[];
  observers: Pick<PageObservers, "consoleErrors" | "failedRequests">;
};

async function runOneParallelUser(
  browser: Browser,
  baseURL: string,
  email: string,
  password: string,
  userIndex: number,
): Promise<UserConnBurstResult> {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
  const steps: BurstStepRecord[] = [];

  try {
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
      const msg = e instanceof Error ? e.message : String(e);
      steps.push({
        userIndex,
        step: "login",
        durationMs: Date.now() - loginStart,
        ok: false,
        error: msg,
      });
      return {
        userIndex,
        steps,
        observers: { consoleErrors: [...observers.consoleErrors], failedRequests: [...observers.failedRequests] },
      };
    }

    for (let i = 1; i <= 3; i += 1) {
      const label = `GET /app (${i}/3)`;
      const t0 = Date.now();
      try {
        const response = await page.goto("/app", {
          waitUntil: "domcontentloaded",
          timeout: DOCUMENT_NAV_TIMEOUT_MS,
        });
        const status = response?.status();
        const ok = isDocumentOk(status);
        steps.push({
          userIndex,
          step: label,
          durationMs: Date.now() - t0,
          httpStatus: status,
          ok,
          error: ok
            ? undefined
            : status !== undefined && status >= 500
              ? `HTTP ${status}`
              : status !== undefined
                ? `HTTP ${status} (expected 200)`
                : "No response",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        steps.push({
          userIndex,
          step: label,
          durationMs: Date.now() - t0,
          ok: false,
          error: msg,
        });
      }
    }

    {
      const label = "GET /app/lessons";
      const t0 = Date.now();
      try {
        const response = await page.goto("/app/lessons", {
          waitUntil: "domcontentloaded",
          timeout: DOCUMENT_NAV_TIMEOUT_MS,
        });
        const status = response?.status();
        const ok = isDocumentOk(status);
        steps.push({
          userIndex,
          step: label,
          durationMs: Date.now() - t0,
          httpStatus: status,
          ok,
          error: ok
            ? undefined
            : status !== undefined && status >= 500
              ? `HTTP ${status}`
              : status !== undefined
                ? `HTTP ${status} (expected 200)`
                : "No response",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        steps.push({
          userIndex,
          step: label,
          durationMs: Date.now() - t0,
          ok: false,
          error: msg,
        });
      }
    }

    return {
      userIndex,
      steps,
      observers: { consoleErrors: [...observers.consoleErrors], failedRequests: [...observers.failedRequests] },
    };
  } finally {
    observers.dispose();
    await context.close();
  }
}

test.describe("Paid user — DB connection burst", () => {
  test("10 concurrent users: login → /app×3 → /app/lessons; no pool/reset errors; mean nav < 2s", async ({
    browser,
    baseURL,
  }, testInfo) => {
    test.setTimeout(420_000);

    const creds = getPaidTestCredentials();
    test.skip(!creds, "Requires E2E_PAID_EMAIL / E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    const origin = baseURL ?? "http://127.0.0.1:3000";
    const parallelUsers = parallelUserCountFromEnv();
    const meanNavSlaMs = meanNavSlaMsFromEnv();

    const userResults = await Promise.all(
      Array.from({ length: parallelUsers }, (_, i) =>
        runOneParallelUser(browser, origin, creds!.email, creds!.password, i),
      ),
    );

    const allSteps: BurstStepRecord[] = [];
    const allConsole: string[] = [];
    const allFailedReq: string[] = [];

    for (const r of userResults) {
      allSteps.push(...r.steps);
      allConsole.push(...r.observers.consoleErrors);
      allFailedReq.push(...r.observers.failedRequests);
    }

    const failedSteps = allSteps.filter((s) => !s.ok).length;

    const stepErrorLines = allSteps.filter((s) => !s.ok && s.error).map((s) => s.error!);
    const aggregateForScan = [...allConsole, ...allFailedReq, ...stepErrorLines];
    const forbiddenHits = collectForbiddenMatches(aggregateForScan);

    const successfulNavDurations = allSteps
      .filter((s) => s.ok && s.step !== "login")
      .map((s) => s.durationMs);
    const meanNavMs =
      successfulNavDurations.length > 0
        ? successfulNavDurations.reduce((a, b) => a + b, 0) / successfulNavDurations.length
        : Number.NaN;

    const summary = {
      parallelUsers,
      burstUsersEnv: process.env.E2E_DB_CONN_BURST_USERS ?? null,
      meanNavSlaMs,
      meanNavSlaEnv: process.env.E2E_DB_CONN_BURST_MEAN_SLA_MS ?? null,
      meanNavigationMs: meanNavMs,
      successfulNavigationSamples: successfulNavDurations.length,
      expectedNavigationSamples: parallelUsers * 4,
      failedSteps,
      forbiddenPatternHits: forbiddenHits,
      stepErrorsSample: stepErrorLines.slice(0, 20),
      consoleErrorsSample: allConsole.slice(0, 20),
      failedRequestsSample: allFailedReq.slice(0, 20),
      steps: allSteps,
    };

    await testInfo.attach("db-connection-burst-results.json", {
      body: Buffer.from(JSON.stringify(summary, null, 2)),
      contentType: "application/json",
    });

    expect(
      forbiddenHits,
      `Disallowed DB/network error substrings (too many connections / timeout / ECONNRESET): ${forbiddenHits.join(" | ")}`,
    ).toEqual([]);

    expect(failedSteps, "Every step (login + navigations) should succeed (HTTP 200, no throw)").toBe(0);

    expect(
      Number.isFinite(meanNavMs) && meanNavMs < meanNavSlaMs,
      `Mean successful navigation time ${meanNavMs.toFixed(0)}ms must be < ${meanNavSlaMs}ms (see db-connection-burst-results.json)`,
    ).toBe(true);
  });
});

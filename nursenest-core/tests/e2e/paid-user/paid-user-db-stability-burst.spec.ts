/**
 * DB stability burst: N parallel browser contexts each perform credentials login, then GET `/app` and `/app/lessons`.
 *
 * - **Auth:** fresh context per user (no `storageState`) — exercises login + session under parallel load.
 * - **Pass criteria:** failure rate ≤ 1% over all attempted steps; no 5xx on document navigations; no Playwright timeouts; document responses must be HTTP 200.
 *
 * **Env:** `E2E_DB_BURST_USERS` (default `10`, clamped 1–50) overrides parallel fan-out.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-db-stability-burst.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

function parallelUserCountFromEnv(): number {
  const raw = process.env.E2E_DB_BURST_USERS?.trim();
  if (!raw) return 10;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return 10;
  return Math.min(50, Math.max(1, n));
}

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

function percentile(sorted: number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))] ?? null;
}

function timingStatsMs(durations: number[]): {
  count: number;
  minMs: number | null;
  maxMs: number | null;
  avgMs: number | null;
  p95Ms: number | null;
} {
  if (durations.length === 0) {
    return { count: 0, minMs: null, maxMs: null, avgMs: null, p95Ms: null };
  }
  const sorted = [...durations].sort((a, b) => a - b);
  const sum = durations.reduce((a, b) => a + b, 0);
  return {
    count: durations.length,
    minMs: sorted[0] ?? null,
    maxMs: sorted[sorted.length - 1] ?? null,
    avgMs: sum / durations.length,
    p95Ms: percentile(sorted, 95),
  };
}

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
  test("parallel users: login → /app → /app/lessons; failure rate ≤ 1%", async ({ browser, baseURL }, testInfo) => {
    test.setTimeout(420_000);

    const creds = getPaidTestCredentials();
    test.skip(!creds, "Requires E2E_PAID_EMAIL / E2E_PAID_PASSWORD (or QA_PAID_* / PLAYWRIGHT_TEST_*)");

    const origin = baseURL ?? "http://127.0.0.1:3000";
    const parallelUsers = parallelUserCountFromEnv();

    const userResults = await Promise.all(
      Array.from({ length: parallelUsers }, (_, i) =>
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

    let navigationTimeouts = 0;
    let http5xxSteps = 0;
    let non200DocumentSteps = 0;
    let loginFailSteps = 0;

    const durationsByStep: Record<BurstStepRecord["step"], number[]> = {
      login: [],
      "GET /app": [],
      "GET /app/lessons": [],
    };

    for (const s of allSteps) {
      if (s.ok) {
        durationsByStep[s.step].push(s.durationMs);
        continue;
      }
      if (s.step === "login") {
        loginFailSteps += 1;
        continue;
      }
      if (s.error && /timeout/i.test(s.error)) {
        navigationTimeouts += 1;
        continue;
      }
      if (s.httpStatus !== undefined && s.httpStatus >= 500) {
        http5xxSteps += 1;
        continue;
      }
      if (s.httpStatus !== undefined && s.httpStatus !== 200) {
        non200DocumentSteps += 1;
        continue;
      }
      navigationTimeouts += 1;
    }

    const responseTimeMsByStep = {
      login: timingStatsMs(durationsByStep.login ?? []),
      "GET /app": timingStatsMs(durationsByStep["GET /app"] ?? []),
      "GET /app/lessons": timingStatsMs(durationsByStep["GET /app/lessons"] ?? []),
    };

    const summary = {
      parallelUsers,
      burstUsersEnv: process.env.E2E_DB_BURST_USERS ?? null,
      totalAttempts,
      totalFailures,
      failureRate,
      maxAllowedFailureRate: MAX_FAILURE_RATE,
      failureBreakdown: {
        loginFailures: loginFailSteps,
        navigationTimeouts,
        http5xx: http5xxSteps,
        non200Document: non200DocumentSteps,
      },
      responseTimeMsByStep,
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

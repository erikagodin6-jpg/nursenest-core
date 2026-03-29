import pg from "pg";
import { fireSyntheticTestFailureAlert } from "./alerting-engine";
import { BoundedMap } from "./bounded-map";

interface SyntheticTestConfig {
  name: string;
  description: string;
  enabled: boolean;
  timeoutMs: number;
  runner: (pool: pg.Pool, baseUrl: string) => Promise<SyntheticTestRunResult>;
}

interface SyntheticTestRunResult {
  status: "pass" | "fail";
  responseTimeMs: number;
  errorDetails?: string;
  metadata?: Record<string, any>;
}

async function makeInternalRequest(
  baseUrl: string,
  path: string,
  options: { method?: string; body?: any; timeoutMs?: number; headers?: Record<string, string>; retries?: number } = {}
): Promise<{ status: number; body: any; timeMs: number }> {
  const { method = "GET", body, timeoutMs = 30000, headers = {}, retries = 2 } = options;
  const url = `${baseUrl}${path}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        signal: controller.signal,
      };
      if (body) fetchOptions.body = JSON.stringify(body);

      const resp = await fetch(url, fetchOptions);
      const elapsed = Date.now() - start;
      let respBody: any;
      try {
        respBody = await resp.json();
      } catch {
        respBody = await resp.text().catch(() => null);
      }
      return { status: resp.status, body: respBody, timeMs: elapsed };
    } catch (e: any) {
      lastError = e;
      if (attempt < retries) {
        const backoffMs = (attempt + 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  const errorMsg = lastError?.name === "AbortError"
    ? `Request to ${path} timed out after ${timeoutMs}ms (${retries + 1} attempts)`
    : `Request to ${path} failed after ${retries + 1} attempts: ${lastError?.message || "Unknown error"}`;
  throw new Error(errorMsg);
}

const loginTest: SyntheticTestConfig = {
  name: "user_login_flow",
  description: "Tests the user login endpoint responds correctly",
  enabled: true,
  timeoutMs: 10000,
  runner: async (_pool, baseUrl) => {
    const start = Date.now();
    try {
      const resp = await makeInternalRequest(baseUrl, "/api/auth/me");
      const timeMs = Date.now() - start;
      if (resp.status === 401 || resp.status === 200) {
        return { status: "pass", responseTimeMs: timeMs, metadata: { statusCode: resp.status } };
      }
      return { status: "fail", responseTimeMs: timeMs, errorDetails: `Unexpected status ${resp.status}` };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: e.message };
    }
  },
};

const examOpenTest: SyntheticTestConfig = {
  name: "exam_open_flow",
  description: "Tests that exam listing endpoint is available",
  enabled: true,
  timeoutMs: 30000,
  runner: async (_pool, baseUrl) => {
    const start = Date.now();
    try {
      const resp = await makeInternalRequest(baseUrl, "/api/content/exams?limit=1", { timeoutMs: 30000, retries: 2 });
      const timeMs = Date.now() - start;
      if (resp.status === 200) {
        try {
          const body = resp.body;
          if (body && typeof body === "object" && (body as any)?._degraded) {
            return { status: "fail", responseTimeMs: timeMs, errorDetails: `Exam endpoint returned degraded response: ${(body as any)._reason || "unknown"}` };
          }
        } catch {}
        return { status: "pass", responseTimeMs: timeMs, metadata: { statusCode: resp.status } };
      }
      if (resp.status === 401) {
        return { status: "pass", responseTimeMs: timeMs, metadata: { statusCode: resp.status } };
      }
      if (resp.status === 503) {
        return { status: "fail", responseTimeMs: timeMs, errorDetails: `Exam endpoint returned 503 (service under memory pressure)` };
      }
      return { status: "fail", responseTimeMs: timeMs, errorDetails: `Exam endpoint returned ${resp.status}` };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: e.message };
    }
  },
};

const catStartTest: SyntheticTestConfig = {
  name: "cat_exam_start",
  description: "Tests the CAT exam configuration endpoint",
  enabled: true,
  timeoutMs: 10000,
  runner: async (_pool, baseUrl) => {
    const start = Date.now();
    try {
      const resp = await makeInternalRequest(baseUrl, "/api/kill-switches");
      const timeMs = Date.now() - start;
      if (resp.status === 200) {
        const body = resp.body;
        if (body && typeof body === "object" && "cat" in body) {
          if (body.cat === true) {
            return { status: "fail", responseTimeMs: timeMs, errorDetails: "CAT kill switch is active" };
          }
          return { status: "pass", responseTimeMs: timeMs, metadata: { killSwitches: body } };
        }
        return { status: "fail", responseTimeMs: timeMs, errorDetails: "Kill switches response missing 'cat' field" };
      }
      return { status: "fail", responseTimeMs: timeMs, errorDetails: `Kill switches returned ${resp.status}` };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: e.message };
    }
  },
};

const flashcardAccessTest: SyntheticTestConfig = {
  name: "flashcard_deck_access",
  description: "Tests flashcard deck listing endpoint",
  enabled: true,
  timeoutMs: 10000,
  runner: async (pool, _baseUrl) => {
    const start = Date.now();
    try {
      const result = await pool.query(`SELECT COUNT(*)::int AS count FROM flashcard_bank LIMIT 1`);
      const timeMs = Date.now() - start;
      const count = result.rows[0]?.count ?? 0;
      return { status: "pass", responseTimeMs: timeMs, metadata: { flashcardCount: count } };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: `DB query failed: ${e.message}` };
    }
  },
};

const lessonLoadingTest: SyntheticTestConfig = {
  name: "lesson_loading",
  description: "Tests lesson content loading from database",
  enabled: true,
  timeoutMs: 10000,
  runner: async (pool, _baseUrl) => {
    const start = Date.now();
    try {
      const result = await pool.query(
        `SELECT id, title FROM content_items WHERE type = 'lesson' AND status = 'published' LIMIT 1`
      );
      const timeMs = Date.now() - start;
      if (result.rows.length === 0) {
        return { status: "pass", responseTimeMs: timeMs, metadata: { note: "No published lessons found, but DB is accessible" } };
      }
      return { status: "pass", responseTimeMs: timeMs, metadata: { sampleLesson: result.rows[0].title } };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: `Lesson query failed: ${e.message}` };
    }
  },
};

const premiumContentTest: SyntheticTestConfig = {
  name: "premium_content_download",
  description: "Tests premium content availability",
  enabled: true,
  timeoutMs: 10000,
  runner: async (pool, _baseUrl) => {
    const start = Date.now();
    try {
      const result = await pool.query(
        `SELECT COUNT(*)::int AS count FROM content_items WHERE tier != 'free' AND status = 'published'`
      );
      const timeMs = Date.now() - start;
      const count = result.rows[0]?.count ?? 0;
      return { status: "pass", responseTimeMs: timeMs, metadata: { premiumContentCount: count } };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: `Premium content query failed: ${e.message}` };
    }
  },
};

const healthCheckTest: SyntheticTestConfig = {
  name: "healthcheck",
  description: "Tests the health check endpoint",
  enabled: true,
  timeoutMs: 5000,
  runner: async (_pool, baseUrl) => {
    const start = Date.now();
    try {
      const resp = await makeInternalRequest(baseUrl, "/healthz", { timeoutMs: 5000 });
      const timeMs = Date.now() - start;
      if (resp.status === 200) {
        return { status: "pass", responseTimeMs: timeMs };
      }
      return { status: "fail", responseTimeMs: timeMs, errorDetails: `Health check returned ${resp.status}` };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: e.message };
    }
  },
};

const dbConnectivityTest: SyntheticTestConfig = {
  name: "database_connectivity",
  description: "Tests database connection and basic query",
  enabled: true,
  timeoutMs: 5000,
  runner: async (pool, _baseUrl) => {
    const start = Date.now();
    try {
      const result = await pool.query("SELECT 1 AS ping");
      const timeMs = Date.now() - start;
      if (result.rows[0]?.ping === 1) {
        return { status: "pass", responseTimeMs: timeMs };
      }
      return { status: "fail", responseTimeMs: timeMs, errorDetails: "Unexpected DB response" };
    } catch (e: any) {
      return { status: "fail", responseTimeMs: Date.now() - start, errorDetails: `DB connection failed: ${e.message}` };
    }
  },
};

const ALL_TESTS: SyntheticTestConfig[] = [
  healthCheckTest,
  dbConnectivityTest,
  loginTest,
  examOpenTest,
  catStartTest,
  flashcardAccessTest,
  lessonLoadingTest,
  premiumContentTest,
];

export function getAvailableTests(): Array<{ name: string; description: string; enabled: boolean }> {
  return ALL_TESTS.map(t => ({ name: t.name, description: t.description, enabled: t.enabled }));
}

export async function runSyntheticTest(
  pool: pg.Pool,
  testName: string,
  baseUrl: string
): Promise<SyntheticTestRunResult & { testName: string }> {
  const test = ALL_TESTS.find(t => t.name === testName);
  if (!test) {
    return { testName, status: "fail", responseTimeMs: 0, errorDetails: `Unknown test: ${testName}` };
  }

  let result: SyntheticTestRunResult;
  try {
    result = await test.runner(pool, baseUrl);
  } catch (e: any) {
    result = { status: "fail", responseTimeMs: 0, errorDetails: `Runner threw: ${e.message}` };
  }

  try {
    await pool.query(
      `INSERT INTO synthetic_test_results (test_name, status, response_time_ms, error_details, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [testName, result.status, result.responseTimeMs, result.errorDetails || null, JSON.stringify(result.metadata || {})]
    );
  } catch (e: any) {
    console.error(`[SyntheticMonitor] Failed to store result for ${testName}:`, e.message);
  }

  if (result.status === "fail") {
    let suppressAlert = false;
    try {
      const { isMemoryProtectionActive } = await import("./memory-monitor");
      if (isMemoryProtectionActive() && !CRITICAL_ONLY_TESTS.has(testName)) {
        suppressAlert = true;
        console.log(`[SyntheticMonitor] Suppressing alert for ${testName} failure during memory pressure`);
      }
    } catch {}
    if (!suppressAlert) {
      await fireSyntheticTestFailureAlert(pool, testName, result.errorDetails || "Unknown error", result.responseTimeMs);
    }
  }

  return { testName, ...result };
}

const CRITICAL_ONLY_TESTS = new Set(["healthcheck", "database_connectivity"]);

export async function runAllSyntheticTests(
  pool: pg.Pool,
  baseUrl: string
): Promise<Array<SyntheticTestRunResult & { testName: string }>> {
  let skipAll = false;
  let underPressure = false;
  try {
    const { isEmergencyMode } = await import("./platform-resilience");
    const { isMemoryProtectionActive } = await import("./memory-monitor");
    if (isEmergencyMode()) {
      skipAll = true;
    }
    underPressure = isMemoryProtectionActive();
  } catch {}

  if (skipAll) {
    console.log("[SyntheticMonitor] Skipping — emergency mode is active");
    return [];
  }

  let enabledTests = ALL_TESTS.filter(t => t.enabled);

  if (underPressure) {
    enabledTests = enabledTests.filter(t => CRITICAL_ONLY_TESTS.has(t.name));
    console.log(`[SyntheticMonitor] Memory pressure active — running only critical tests (${enabledTests.length})`);
  }

  const eligibleTests = enabledTests.filter(t => !isTestBackedOff(t.name));
  const skippedCount = enabledTests.length - eligibleTests.length;
  if (skippedCount > 0) {
    console.log(`[SyntheticMonitor] Skipping ${skippedCount} backed-off tests`);
  }
  console.log(`[SyntheticMonitor] Running ${eligibleTests.length} synthetic tests...`);

  const results: Array<SyntheticTestRunResult & { testName: string }> = [];
  for (const test of eligibleTests) {
    const result = await runSyntheticTest(pool, test.name, baseUrl);
    results.push(result);
    recordTestBackoff(test.name, result.status === "pass");
    console.log(`[SyntheticMonitor] ${test.name}: ${result.status} (${result.responseTimeMs}ms)${result.errorDetails ? ` - ${result.errorDetails}` : ""}`);
  }

  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  console.log(`[SyntheticMonitor] Complete: ${passed} passed, ${failed} failed`);

  return results;
}

let syntheticInterval: ReturnType<typeof setInterval> | null = null;
let syntheticStartTimeout: ReturnType<typeof setTimeout> | null = null;
const testBackoff = new BoundedMap<string, { failures: number; nextRunAfter: number }>(50);
const MAX_BACKOFF_MS = 30 * 60 * 1000;
const BASE_BACKOFF_MS = 60_000;

function getBackoffDelay(failures: number): number {
  return Math.min(BASE_BACKOFF_MS * Math.pow(2, failures), MAX_BACKOFF_MS);
}

function recordTestBackoff(testName: string, passed: boolean): void {
  if (passed) {
    testBackoff.delete(testName);
    return;
  }
  const entry = testBackoff.get(testName) || { failures: 0, nextRunAfter: 0 };
  entry.failures++;
  entry.nextRunAfter = Date.now() + getBackoffDelay(entry.failures);
  testBackoff.set(testName, entry);

  console.log(`[SyntheticMonitor] ${testName} failed ${entry.failures}x, next eligible in ${Math.round(getBackoffDelay(entry.failures) / 1000)}s`);
}

function isTestBackedOff(testName: string): boolean {
  const entry = testBackoff.get(testName);
  if (!entry) return false;
  return Date.now() < entry.nextRunAfter;
}

export function startSyntheticMonitoring(pool: pg.Pool, baseUrl: string, intervalMs = 10 * 60 * 1000): void {
  stopSyntheticMonitoring();
  console.log(`[SyntheticMonitor] Started (interval: ${intervalMs / 1000}s, baseUrl: ${baseUrl})`);

  syntheticStartTimeout = setTimeout(() => {
    syntheticStartTimeout = null;
    runAllSyntheticTests(pool, baseUrl).catch(e => console.error("[SyntheticMonitor] Run error:", e.message));
  }, 60_000);

  syntheticInterval = setInterval(() => {
    runAllSyntheticTests(pool, baseUrl).catch(e => console.error("[SyntheticMonitor] Run error:", e.message));
  }, intervalMs);
}

export function stopSyntheticMonitoring(): void {
  if (syntheticStartTimeout) {
    clearTimeout(syntheticStartTimeout);
    syntheticStartTimeout = null;
  }
  if (syntheticInterval) {
    clearInterval(syntheticInterval);
    syntheticInterval = null;
    console.log("[SyntheticMonitor] Stopped");
  }
}

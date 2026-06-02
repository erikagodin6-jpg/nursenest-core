type ProbeResult = {
  environment: "primary" | "standby";
  path: string;
  label: string;
  critical: boolean;
  ok: boolean;
  status?: number;
  durationMs: number;
  error?: string;
  body?: Record<string, unknown>;
};

const TIMEOUT_MS = Number(process.env.HA_VALIDATE_TIMEOUT_MS ?? 15_000);

function normalizeBaseUrl(raw: string | undefined, label: string): string {
  const value = raw?.trim().replace(/\/$/, "") ?? "";
  if (!value.startsWith("http")) {
    throw new Error(`${label} must be an absolute URL`);
  }
  return value;
}

function isTruthy(value: unknown): boolean {
  return value === true || value === "true" || value === "ok" || value === "configured";
}

function safeJson(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function probe(
  environment: ProbeResult["environment"],
  baseUrl: string,
  path: string,
  label: string,
  options: {
    critical?: boolean;
    json?: boolean;
    expectOkField?: boolean;
    headers?: HeadersInit;
    maxMs?: number;
  } = {},
): Promise<ProbeResult> {
  const critical = options.critical ?? true;
  const started = Date.now();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      signal: ac.signal,
      headers: {
        "user-agent": "nursenest-ha-validate/1.0",
        ...options.headers,
      },
      redirect: "follow",
    });
    const text = await res.text();
    const durationMs = Date.now() - started;
    const body = options.json ? safeJson(text) : null;
    let ok = res.status < 500;
    let error: string | undefined;
    if (!ok) error = `HTTP ${res.status}`;
    if (ok && options.expectOkField && !isTruthy(body?.ok)) {
      ok = false;
      error = "JSON ok field was not truthy";
    }
    if (ok && options.maxMs && durationMs > options.maxMs) {
      ok = false;
      error = `slow: ${durationMs}ms > ${options.maxMs}ms`;
    }
    return {
      environment,
      path,
      label,
      critical,
      ok,
      status: res.status,
      durationMs,
      error,
      body: body ?? undefined,
    };
  } catch (error) {
    return {
      environment,
      path,
      label,
      critical,
      ok: false,
      durationMs: Date.now() - started,
      error: ac.signal.aborted ? `timeout after ${TIMEOUT_MS}ms` : error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeEnvironment(environment: ProbeResult["environment"], baseUrl: string): Promise<ProbeResult[]> {
  const envSecret = process.env.NN_RUNTIME_ENV_HEALTH_SECRET?.trim();
  const probes: Array<Promise<ProbeResult>> = [
    probe(environment, baseUrl, "/healthz", "liveness", { critical: true, maxMs: 2000 }),
    probe(environment, baseUrl, "/api/health", "public-health", { critical: true, json: true, expectOkField: true, maxMs: 2000 }),
    probe(environment, baseUrl, "/api/health/ready", "database-readiness", {
      critical: true,
      json: true,
      expectOkField: true,
      maxMs: 5000,
    }),
    probe(environment, baseUrl, "/api/health/activity-startup", "activity-startup", {
      critical: true,
      json: true,
      expectOkField: true,
      maxMs: 7000,
    }),
    probe(environment, baseUrl, "/login", "login-page", { critical: true, maxMs: 5000 }),
    probe(environment, baseUrl, "/pricing", "pricing-page", { critical: false, maxMs: 5000 }),
  ];

  if (envSecret) {
    probes.push(
      probe(environment, baseUrl, "/api/internal/runtime-env-health", "runtime-env", {
        critical: true,
        json: true,
        expectOkField: true,
        maxMs: 5000,
        headers: { "x-nursenest-env-health-secret": envSecret },
      }),
    );
  }

  return Promise.all(probes);
}

function printResults(results: ProbeResult[]): void {
  console.log(`${"ENV".padEnd(9)} ${"PATH".padEnd(32)} ${"LABEL".padEnd(20)} ${"STATUS".padEnd(8)} ${"MS".padEnd(8)} RESULT`);
  console.log("─".repeat(98));
  for (const result of results) {
    const tag = result.ok ? "OK" : result.critical ? "FAIL" : "WARN";
    console.log(
      `${result.environment.padEnd(9)} ${result.path.padEnd(32)} ${result.label.padEnd(20)} ${String(result.status ?? "—").padEnd(8)} ${String(result.durationMs).padEnd(8)} ${tag}${result.error ? ` — ${result.error}` : ""}`,
    );
  }
}

function databaseFingerprint(results: ProbeResult[], environment: ProbeResult["environment"]): string | null {
  const row = results.find((r) => r.environment === environment && r.path === "/api/health");
  const fingerprint = row?.body?.dbUrlFingerprintPrefix10;
  return typeof fingerprint === "string" && fingerprint.length > 0 ? fingerprint : null;
}

async function main() {
  const primaryUrl = normalizeBaseUrl(process.argv[2] ?? process.env.HA_PRIMARY_URL ?? process.env.PRODUCTION_BASE_URL, "HA_PRIMARY_URL");
  const standbyUrl = normalizeBaseUrl(process.argv[3] ?? process.env.HA_STANDBY_URL ?? process.env.STANDBY_BASE_URL, "HA_STANDBY_URL");

  console.log(`[ha-validate] primary=${primaryUrl}`);
  console.log(`[ha-validate] standby=${standbyUrl}`);
  console.log(`[ha-validate] timeout=${TIMEOUT_MS}ms\n`);

  const results = (await Promise.all([probeEnvironment("primary", primaryUrl), probeEnvironment("standby", standbyUrl)])).flat();

  const primaryFingerprint = databaseFingerprint(results, "primary");
  const standbyFingerprint = databaseFingerprint(results, "standby");
  const allowSharedDatabase = process.env.HA_ALLOW_SHARED_DATABASE_URL === "1";

  if (primaryFingerprint && standbyFingerprint && primaryFingerprint === standbyFingerprint && !allowSharedDatabase) {
    results.push({
      environment: "standby",
      path: "/api/health",
      label: "database-isolation",
      critical: true,
      ok: false,
      status: 200,
      durationMs: 0,
      error: "standby DATABASE_URL fingerprint matches primary; set HA_ALLOW_SHARED_DATABASE_URL=1 only for temporary drills",
    });
  }

  printResults(results);
  const criticalFailures = results.filter((r) => !r.ok && r.critical);
  const warnings = results.filter((r) => !r.ok && !r.critical);
  console.log(`\n[ha-validate] ${results.length} checks, ${criticalFailures.length} critical failures, ${warnings.length} warnings`);

  if (criticalFailures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[ha-validate] failed:", error instanceof Error ? error.message : error);
  process.exit(2);
});

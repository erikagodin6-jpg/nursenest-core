/**
 * Production HTTP smoke: HEAD/GET with timeouts. No secrets logged.
 * Base URL: BASE_URL or PLAYWRIGHT_BASE_URL (see nursenest-core/reports/phase-3-reliability-automation.md).
 * Default exit 0; use --strict-exit to exit with suggestedExitCode.
 */
const TIMEOUT_MS = Number(process.env.NN_HEALTH_CHECK_TIMEOUT_MS ?? 12000);

async function fetchWithTimeout(url, method) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      signal: ctrl.signal,
      redirect: method === "HEAD" ? "follow" : "manual",
    });
  } finally {
    clearTimeout(t);
  }
}

function baseUrl() {
  const a = process.env.BASE_URL?.trim();
  const b = process.env.PLAYWRIGHT_BASE_URL?.trim();
  return a || b || null;
}

function classifyPage(status) {
  if (status === null) return "outage";
  if (status >= 500) return "outage";
  if (status >= 200 && status < 400) return "ok";
  if (status === 401 || status === 403) return "auth_required";
  return "degraded";
}

async function runChecks() {
  const rows = [];
  const base = baseUrl();
  if (!base) {
    rows.push({
      name: "config",
      method: "GET",
      path: "(no base)",
      status: null,
      outcome: "skipped",
      ms: 0,
      note: "Set BASE_URL or PLAYWRIGHT_BASE_URL.",
    });
    return rows;
  }

  const origin = base.replace(/\/$/, "");
  const pathwayId = "us-rn-nclex-rn";
  const pagePaths = [
    { name: "homepage", path: "/" },
    { name: "pricing", path: "/pricing" },
    { name: "signup", path: "/signup" },
    { name: "login", path: "/login" },
    { name: "marketing_lessons_hub", path: "/lessons" },
  ];

  for (const p of pagePaths) {
    const url = `${origin}${p.path}`;
    const t0 = Date.now();
    try {
      const res = await fetchWithTimeout(url, "HEAD");
      const ms = Date.now() - t0;
      const oc = classifyPage(res.status);
      rows.push({
        name: p.name,
        method: "HEAD",
        path: p.path,
        status: res.status,
        outcome: oc,
        ms,
        note: oc === "ok" ? undefined : `HEAD ${res.status}`,
      });
    } catch {
      rows.push({
        name: p.name,
        method: "HEAD",
        path: p.path,
        status: null,
        outcome: "outage",
        ms: Date.now() - t0,
        note: "timeout_or_network",
      });
    }
  }

  const apiChecks = [
    { name: "api_health", path: "/api/health", expect: "http_ok" },
    { name: "api_health_ready", path: "/api/health/ready", expect: "http_ok" },
    {
      name: "api_flashcards_inventory_unauth",
      path: `/api/flashcards/inventory?pathwayId=${encodeURIComponent(pathwayId)}`,
      expect: "unauthorized_expected",
    },
    { name: "api_practice_tests_list_unauth", path: "/api/practice-tests", expect: "unauthorized_expected" },
  ];

  for (const a of apiChecks) {
    const url = `${origin}${a.path}`;
    const t0 = Date.now();
    try {
      const res = await fetchWithTimeout(url, "GET");
      const ms = Date.now() - t0;
      if (a.expect === "http_ok") {
        const oc = res.status >= 200 && res.status < 300 ? "ok" : res.status >= 500 ? "outage" : "degraded";
        rows.push({
          name: a.name,
          method: "GET",
          path: a.path,
          status: res.status,
          outcome: oc,
          ms,
          note: oc === "ok" ? undefined : `expected 2xx got ${res.status}`,
        });
      } else {
        const okUnauth = res.status === 401 || res.status === 403;
        rows.push({
          name: a.name,
          method: "GET",
          path: a.path,
          status: res.status,
          outcome: okUnauth ? "auth_required" : res.status >= 500 ? "outage" : "degraded",
          ms,
          note: okUnauth ? "401/403 without auth (expected)" : `expected 401/403 got ${res.status}`,
        });
      }
    } catch {
      rows.push({
        name: a.name,
        method: "GET",
        path: a.path,
        status: null,
        outcome: "outage",
        ms: Date.now() - t0,
        note: "timeout_or_network",
      });
    }
  }

  return rows;
}

const strictExit = process.argv.includes("--strict-exit");

runChecks().then((rows) => {
  const outage = rows.some((r) => r.outcome === "outage");
  const degraded = rows.some((r) => r.outcome === "degraded");
  const skippedConfig = rows.some((r) => r.outcome === "skipped");
  let suggestedExitCode = 0;
  if (skippedConfig) suggestedExitCode = 2;
  else if (outage || degraded) suggestedExitCode = 1;

  const summary = {
    kind: "production_health_check",
    baseUrl: baseUrl() ?? null,
    timeoutMs: TIMEOUT_MS,
    generatedAt: new Date().toISOString(),
    rows,
    suggestedExitCode,
    notes: [
      "GET /api/flashcards/inventory and GET /api/practice-tests without cookies: expect 401 or 403.",
      "Default exit code is 0; pass --strict-exit to use suggestedExitCode.",
    ],
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(strictExit ? suggestedExitCode : 0);
});

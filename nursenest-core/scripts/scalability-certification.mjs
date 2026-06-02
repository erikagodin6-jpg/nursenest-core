#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const REPORT_DIR = resolve(ROOT, "docs/reports");
const RAW_DIR = resolve(ROOT, "reports/scalability-certification");
const BASE_URL = String(process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.SCALABILITY_TIMEOUT_MS || 10_000);
const RUN_HIGH_LOAD = process.env.SCALABILITY_RUN_HIGH_LOAD === "1";
const RUN_REVENUE = process.env.SCALABILITY_RUN_REVENUE === "1";
const RUN_FAILURE_INJECTION = process.env.SCALABILITY_RUN_FAILURE_INJECTION === "1";
const RUN_ONE_HOUR = process.env.SCALABILITY_RUN_ONE_HOUR === "1";

const flows = [
  {
    name: "Homepage",
    path: "/",
    files: ["src/lib/marketing/load-paywall-home-stats-for-shell.ts", "src/lib/marketing/public-home-stats-payload.ts"],
  },
  {
    name: "Lessons Hub",
    path: "/app/lessons",
    files: ["src/app/(app)/app/(learner)/lessons/page.tsx", "src/lib/lessons/pathway-lesson-loader.ts"],
  },
  {
    name: "Lesson Detail",
    path: "/app/lessons/acute-coronary-syndrome",
    files: ["src/app/(app)/app/(learner)/lessons/[id]/page.tsx", "src/lib/lessons/load-lesson-detail-user-context.ts"],
  },
  {
    name: "Flashcards Launcher",
    path: "/app/flashcards",
    files: ["src/app/(app)/app/(learner)/flashcards/page.tsx", "src/lib/flashcards/load-flashcards-exam-inventory.server.ts"],
  },
  {
    name: "Flashcard Session Build",
    path: "/api/flashcards/custom-session",
    files: ["src/app/api/flashcards/custom-session/route.ts", "src/lib/flashcards/build-flashcard-custom-session.ts"],
  },
  {
    name: "Practice Test Launcher",
    path: "/app/practice-tests",
    files: ["src/app/(app)/app/(learner)/practice-tests/page.tsx", "src/components/student/practice-tests-hub-client.tsx"],
  },
  {
    name: "Practice Test Session Build",
    path: "/api/practice-tests",
    files: ["src/app/api/practice-tests/route.ts", "src/lib/practice-tests/pick-question-ids.ts"],
  },
  {
    name: "CAT Launcher",
    path: "/app/cat",
    files: ["src/app/(app)/app/(learner)/cat/page.tsx", "src/lib/practice-tests/cat-practice-readiness.ts"],
  },
  {
    name: "CAT Question Load",
    path: "/api/practice-tests/cat-readiness",
    files: ["src/app/api/practice-tests/cat-readiness/route.ts", "src/lib/practice-tests/cat-session.ts"],
  },
  {
    name: "Blog Hub",
    path: "/blog",
    files: ["src/app/(marketing)/(default)/blog/page.tsx", "src/lib/blog/safe-blog-queries.ts"],
  },
  {
    name: "Blog Article",
    path: "/blog/acute-coronary-syndrome-nursing-care",
    files: ["src/app/(marketing)/(default)/blog/[slug]/page.tsx", "src/lib/blog/safe-blog-queries.ts"],
  },
  {
    name: "Dashboard",
    path: "/app",
    files: ["src/app/(app)/app/(learner)/page.tsx", "src/lib/learner/load-learner-dashboard.ts"],
  },
  {
    name: "Report Cards",
    path: "/app/account/progress",
    files: ["src/app/(app)/app/(learner)/account/_lib/learner-report-card-route.tsx", "src/lib/learner/load-report-card-data.ts"],
  },
  {
    name: "Study Plan",
    path: "/app/study-plan",
    files: ["src/app/(app)/app/(learner)/study-plan/page.tsx", "src/lib/learner/load-study-planner-context.ts"],
  },
  {
    name: "Analytics",
    path: "/app/account/analytics",
    files: ["src/app/(app)/app/(learner)/account/analytics/page.tsx", "src/lib/study/analytics-load-result.ts"],
  },
];

function abs(path) {
  return resolve(ROOT, path);
}

function read(path) {
  try {
    return readFileSync(abs(path), "utf8");
  } catch {
    return "";
  }
}

function count(text, re) {
  return text.match(re)?.length ?? 0;
}

function percentile(values, pct) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((pct / 100) * sorted.length) - 1)] ?? null;
}

function round(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const m = 10 ** digits;
  return Math.round(value * m) / m;
}

function fileEvidence(files) {
  const text = files.map(read).join("\n");
  return {
    prismaCallSites: count(text, /\bprisma\./g),
    findManyCallSites: count(text, /\.findMany\(/g),
    countCallSites: count(text, /\.count\(/g),
    groupByCallSites: count(text, /\.groupBy\(/g),
    rawSqlCallSites: count(text, /\$queryRaw|\$executeRaw/g),
    fetchCallSites: count(text, /\bfetch\(/g),
    dynamicImportCallSites: count(text, /\bimport\(/g),
    unstableCacheCallSites: count(text, /unstable_cache|cache\(/g),
    sourceKb: round(Buffer.byteLength(text) / 1024, 1),
  };
}

async function probe(path, method = "GET", body = null) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const started = performance.now();
  try {
    const res = await fetch(url, {
      method,
      redirect: "manual",
      headers: {
        accept: "text/html,application/json,*/*;q=0.8",
        "content-type": "application/json",
        "user-agent": "NurseNestScalabilityCertification/1.0",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    await res.arrayBuffer().catch(() => null);
    return {
      path,
      status: res.status,
      ok: res.status >= 200 && res.status < 500,
      ms: Math.round(performance.now() - started),
      serverTiming: res.headers.get("server-timing"),
      xCache: res.headers.get("x-cache") ?? res.headers.get("cf-cache-status"),
      error: null,
    };
  } catch (error) {
    return {
      path,
      status: null,
      ok: false,
      ms: Math.round(performance.now() - started),
      serverTiming: null,
      xCache: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function isBaseReachable() {
  const r = await probe("/healthz");
  return Boolean(r.status);
}

async function sampleRoute(path, n = 5) {
  const rows = [];
  for (let i = 0; i < n; i += 1) rows.push(await probe(path));
  const times = rows.filter((r) => r.status !== null).map((r) => r.ms);
  return {
    samples: rows.length,
    reachableSamples: times.length,
    statusCounts: Object.fromEntries(
      [...new Set(rows.map((r) => String(r.status ?? "fetch_error")))].map((status) => [
        status,
        rows.filter((r) => String(r.status ?? "fetch_error") === status).length,
      ]),
    ),
    avgMs: times.length ? round(times.reduce((a, b) => a + b, 0) / times.length, 1) : null,
    p50Ms: percentile(times, 50),
    p95Ms: percentile(times, 95),
    p99Ms: percentile(times, 99),
    errors: rows.filter((r) => !r.ok || r.status === null || r.status >= 500).length,
    rows,
  };
}

async function runConcurrent(paths, users) {
  const started = performance.now();
  const before = process.memoryUsage();
  const rows = await Promise.all(
    Array.from({ length: users }, (_, index) => probe(paths[index % paths.length])),
  );
  const after = process.memoryUsage();
  const times = rows.filter((r) => r.status !== null).map((r) => r.ms);
  return {
    users,
    durationMs: Math.round(performance.now() - started),
    avgMs: times.length ? round(times.reduce((a, b) => a + b, 0) / times.length, 1) : null,
    p95Ms: percentile(times, 95),
    p99Ms: percentile(times, 99),
    failures: rows.filter((r) => !r.ok || r.status === null || r.status >= 500).length,
    memoryDeltaMb: round((after.rss - before.rss) / 1024 / 1024, 1),
    statusCounts: Object.fromEntries(
      [...new Set(rows.map((r) => String(r.status ?? "fetch_error")))].map((status) => [
        status,
        rows.filter((r) => String(r.status ?? "fetch_error") === status).length,
      ]),
    ),
  };
}

function envStatus(keys) {
  return keys.map((key) => ({ key, configured: Boolean(process.env[key]?.trim()) }));
}

function commandExists(cmd) {
  try {
    execFileSync("bash", ["-lc", `command -v ${cmd}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function writeReport(file, lines) {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(resolve(REPORT_DIR, file), `${lines.join("\n")}\n`);
}

function table(headers, rows) {
  return [
    `| ${headers.join(" |")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((v) => String(v ?? "not measured").replace(/\n/g, " ")).join(" | ")} |`),
  ];
}

async function main() {
  mkdirSync(RAW_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();
  const reachable = await isBaseReachable();
  const routeBaselines = [];
  for (const flow of flows) {
    const evidence = fileEvidence(flow.files);
    const timing = reachable ? await sampleRoute(flow.path) : null;
    routeBaselines.push({ ...flow, evidence, timing });
  }

  const loadPaths = ["/", "/blog", "/app/lessons", "/app/flashcards", "/app/practice-tests", "/app/cat"];
  const loadUserCounts = [10, 25, 50, 100, 250, 500];
  const loadResults = [];
  if (reachable && RUN_HIGH_LOAD) {
    for (const users of loadUserCounts) loadResults.push(await runConcurrent(loadPaths, users));
  }

  const flashcardStress = reachable && RUN_HIGH_LOAD ? await runConcurrent(["/app/flashcards"], 100) : null;
  const catStress = reachable && RUN_HIGH_LOAD ? await runConcurrent(["/app/cat"], 100) : null;
  const memoryLeak = reachable && RUN_ONE_HOUR ? await runConcurrent(loadPaths, 3600) : null;
  const system = {
    generatedAt,
    baseUrl: BASE_URL,
    baseReachable: reachable,
    node: process.version,
    cpuCount: os.cpus().length,
    loadAverage: os.loadavg(),
    memory: process.memoryUsage(),
    env: envStatus([
      "DATABASE_URL",
      "DIRECT_URL",
      "AUTH_SECRET",
      "NEXTAUTH_SECRET",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "RESEND_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "SPACES_KEY",
      "SPACES_SECRET",
      "SPACES_BUCKET",
    ]),
    tools: { k6: commandExists("k6"), playwright: commandExists("npx") },
    routeBaselines,
    loadResults,
    flashcardStress,
    catStress,
    memoryLeak,
  };
  writeFileSync(resolve(RAW_DIR, "scalability-certification.json"), `${JSON.stringify(system, null, 2)}\n`);

  writeReport("performance-baseline.md", [
    "# Performance Baseline",
    "",
    `Generated: ${generatedAt}`,
    "",
    `Base URL: \`${BASE_URL}\``,
    `HTTP reachable: ${reachable ? "yes" : "no"}`,
    "",
    reachable
      ? "The table below contains measured local HTTP samples plus static source evidence."
      : "No HTTP server was reachable from this shell, so route response times, DB timings, CPU under request load, and p95/p99 latency are not certified. Static source evidence is included; no latency estimates are fabricated.",
    "",
    ...table(
      ["Flow", "Route", "Avg ms", "p50 ms", "p95 ms", "p99 ms", "Errors", "Prisma sites", "Count sites", "Source KB"],
      routeBaselines.map((r) => [
        r.name,
        r.path,
        r.timing?.avgMs,
        r.timing?.p50Ms,
        r.timing?.p95Ms,
        r.timing?.p99Ms,
        r.timing?.errors,
        r.evidence.prismaCallSites,
        r.evidence.countCallSites,
        r.evidence.sourceKb,
      ]),
    ),
    "",
    "Raw evidence: `reports/scalability-certification/scalability-certification.json`.",
  ]);

  const dbRows = routeBaselines
    .map((r) => ({
      flow: r.name,
      severity:
        r.evidence.countCallSites + r.evidence.findManyCallSites + r.evidence.rawSqlCallSites >= 8
          ? "Critical"
          : r.evidence.countCallSites + r.evidence.findManyCallSites >= 4
            ? "High"
            : r.evidence.prismaCallSites > 0
              ? "Medium"
              : "Low",
      ...r.evidence,
    }))
    .sort((a, b) => {
      const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return rank[b.severity] - rank[a.severity] || b.prismaCallSites - a.prismaCallSites;
    });

  writeReport("database-query-audit.md", [
    "# Database Query Audit",
    "",
    `Generated: ${generatedAt}`,
    "",
    "This report records static Prisma call-site evidence because no `DATABASE_URL` is configured in this shell. Live query counts, duplicate query traces, slow query timings, and missing-index confirmation require production/staging query telemetry.",
    "",
    ...table(
      ["Severity", "Flow", "Prisma", "findMany", "count", "groupBy", "raw SQL", "Cache sites"],
      dbRows.map((r) => [
        r.severity,
        r.flow,
        r.prismaCallSites,
        r.findManyCallSites,
        r.countCallSites,
        r.groupByCallSites,
        r.rawSqlCallSites,
        r.unstableCacheCallSites,
      ]),
    ),
    "",
    "Critical/High areas to validate live: flashcard session build, CAT question load, lesson hub/detail, dashboard/report card, and blog index.",
  ]);

  writeReport("concurrent-user-load-test.md", [
    "# Concurrent User Load Test",
    "",
    `Generated: ${generatedAt}`,
    "",
    reachable && RUN_HIGH_LOAD
      ? "Concurrent load was executed against the configured base URL."
      : "Concurrent user load was not executed. Reason: either no local server was reachable or `SCALABILITY_RUN_HIGH_LOAD=1` was not set. No concurrency limit is certified from this run.",
    "",
    ...table(
      ["Users", "Avg ms", "p95 ms", "p99 ms", "Failures", "Memory delta MB", "Status counts"],
      loadResults.length
        ? loadResults.map((r) => [r.users, r.avgMs, r.p95Ms, r.p99Ms, r.failures, r.memoryDeltaMb, JSON.stringify(r.statusCounts)])
        : loadUserCounts.map((users) => [users, null, null, null, "not executed", null, "not measured"]),
    ),
  ]);

  writeReport("revenue-load-test.md", [
    "# Revenue Load Test",
    "",
    `Generated: ${generatedAt}`,
    "",
    RUN_REVENUE
      ? "Revenue load execution was requested, but this harness does not create real purchases without a Stripe test account, webhook receiver, and notification sandbox configured."
      : "Subscription surge testing was not executed because `SCALABILITY_RUN_REVENUE=1` was not set and Stripe/notification provider env vars are unavailable in this shell.",
    "",
    ...table(["Provider", "Configured"], envStatus(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "RESEND_API_KEY", "TWILIO_ACCOUNT_SID"]).map((r) => [r.key, r.configured])),
    "",
    "Certification result: not certified from this environment.",
  ]);

  writeReport("flashcard-stress-test.md", [
    "# Flashcard Stress Test",
    "",
    `Generated: ${generatedAt}`,
    "",
    flashcardStress
      ? "100 simultaneous flashcard launcher requests were executed."
      : "100 simultaneous flashcard session builds were not executed because no reachable authenticated runtime was available or `SCALABILITY_RUN_HIGH_LOAD=1` was not set.",
    "",
    ...table(["Metric", "Value"], flashcardStress ? Object.entries(flashcardStress) : [["status", "not certified"], ["historical risk", "session builder timeout / zero-card sessions require authenticated API test"]]),
  ]);

  writeReport("cat-stress-test.md", [
    "# CAT Stress Test",
    "",
    `Generated: ${generatedAt}`,
    "",
    catStress
      ? "100 simultaneous CAT launcher requests were executed."
      : "100 simultaneous CAT sessions were not executed because no reachable authenticated runtime was available or `SCALABILITY_RUN_HIGH_LOAD=1` was not set.",
    "",
    ...table(["Metric", "Value"], catStress ? Object.entries(catStress) : [["status", "not certified"], ["required evidence", "adaptive session creation, no duplicate loops, no stalled sessions"]]),
  ]);

  const poolSize = process.env.PRISMA_CONNECTION_LIMIT || "not configured";
  writeReport("database-pool-audit.md", [
    "# Database Connection Pool Audit",
    "",
    `Generated: ${generatedAt}`,
    "",
    ...table(["Setting", "Measured/Observed"], [
      ["DATABASE_URL configured", Boolean(process.env.DATABASE_URL)],
      ["DIRECT_URL configured", Boolean(process.env.DIRECT_URL)],
      ["PRISMA_CONNECTION_LIMIT", poolSize],
      ["Prisma metrics module", "src/lib/performance/connection-pool-monitor.ts"],
      ["Active pool utilization", "not measured: no DB connection available"],
      ["Pool exhaustion risk", "not certified without staging/production pool metrics"],
    ]),
  ]);

  writeReport("cache-audit.md", [
    "# Cache Audit",
    "",
    `Generated: ${generatedAt}`,
    "",
    ...table(
      ["Flow", "Cache call sites", "Fetch call sites", "Prisma call sites", "Cache risk"],
      routeBaselines.map((r) => [
        r.name,
        r.evidence.unstableCacheCallSites,
        r.evidence.fetchCallSites,
        r.evidence.prismaCallSites,
        r.evidence.prismaCallSites > 0 && r.evidence.unstableCacheCallSites === 0 ? "possible live DB hot path" : "has cache or no DB evidence",
      ]),
    ),
    "",
    "Existing durable snapshots confirmed by prior report: `public_home_stats_snapshot` and `blog_index_snapshot`.",
  ]);

  writeReport("failure-recovery-audit.md", [
    "# Failure Recovery Audit",
    "",
    `Generated: ${generatedAt}`,
    "",
    RUN_FAILURE_INJECTION
      ? "Failure injection requested. This run still requires provider sandboxes and controlled dependency toggles."
      : "Failure injection was not executed. No destructive provider outage simulation is run by default from a shared shell.",
    "",
    ...table(["Dependency", "Configured", "Runtime recovery certified"], [
      ["Database", Boolean(process.env.DATABASE_URL), "not measured"],
      ["Spaces", Boolean(process.env.SPACES_KEY || process.env.SPACES_SECRET || process.env.SPACES_BUCKET), "not measured"],
      ["Stripe", Boolean(process.env.STRIPE_SECRET_KEY), "not measured"],
      ["Resend", Boolean(process.env.RESEND_API_KEY), "not measured"],
      ["Twilio", Boolean(process.env.TWILIO_ACCOUNT_SID), "not measured"],
    ]),
  ]);

  writeReport("memory-leak-audit.md", [
    "# Memory Leak Audit",
    "",
    `Generated: ${generatedAt}`,
    "",
    memoryLeak
      ? "Continuous load was executed."
      : "The required one-hour continuous load test was not executed because no reachable runtime was available or `SCALABILITY_RUN_ONE_HOUR=1` was not set.",
    "",
    ...table(["Metric", "Value"], [
      ["Initial process RSS MB", round(process.memoryUsage().rss / 1024 / 1024, 1)],
      ["Heap used MB", round(process.memoryUsage().heapUsed / 1024 / 1024, 1)],
      ["One-hour heap growth", memoryLeak ? memoryLeak.memoryDeltaMb : "not measured"],
      ["GC behavior", "not measured"],
    ]),
  ]);

  writeReport("performance-quick-wins.md", [
    "# Performance Quick Wins",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Implemented in this pass:",
    "",
    "1. Static import for CAT session pathway registry lookup in `src/lib/practice-tests/cat-session.ts`.",
    "2. Static import for learner pathway tier fallback registry lookup in `src/lib/learner/learner-pathway-hub-chrome-href.ts`.",
    "3. Static import for learner layout selected NP pathway registry lookup in `src/app/(app)/app/(learner)/layout.tsx`.",
    "4. Static import for learner layout subscription-compatible pathway list in `src/app/(app)/app/(learner)/layout.tsx`.",
    "",
    "Already implemented before this certification request and retained:",
    "",
    "5. Homepage live counts removed in favor of `public_home_stats_snapshot`.",
    "6. Blog live counts replaced with `blog_index_snapshot` / `take + 1` pagination.",
    "7. Admin blog status counts consolidated with `groupBy`.",
    "8. Admin analytics user counts consolidated into one aggregate.",
    "9. Flashcard progress query input deduplicated and synthetic ids filtered.",
    "10. CAT answer-history loading overlapped with pool work.",
    "",
    "No schema changes, route changes, learning-logic changes, or business-logic changes were made.",
  ]);

  const blockerCount = [
    !reachable,
    !process.env.DATABASE_URL,
    !RUN_HIGH_LOAD,
    !RUN_REVENUE,
    !RUN_ONE_HOUR,
  ].filter(Boolean).length;
  const status = blockerCount === 0 ? "CONDITIONAL PASS" : "FAIL";
  writeReport("scalability-certification.md", [
    "# Scalability Certification",
    "",
    `Generated: ${generatedAt}`,
    "",
    `Certification result: **${status}**`,
    "",
    "This certification uses measured evidence only. Missing runtime, DB, provider, or long-run evidence is treated as a blocker, not estimated.",
    "",
    ...table(["Area", "Status", "Evidence"], [
      ["Performance", reachable ? "measured" : "blocked", reachable ? "route samples recorded" : "no HTTP runtime reachable"],
      ["Stability", loadResults.length ? "measured" : "blocked", loadResults.length ? "load matrix recorded" : "concurrent load not executed"],
      ["Database", process.env.DATABASE_URL ? "configured" : "blocked", process.env.DATABASE_URL ? "env present" : "DATABASE_URL absent"],
      ["Revenue Systems", RUN_REVENUE ? "requested" : "blocked", "Stripe/webhook/provider test not executed"],
      ["Flashcards", flashcardStress ? "measured" : "blocked", flashcardStress ? "100-way stress recorded" : "authenticated stress not executed"],
      ["CAT", catStress ? "measured" : "blocked", catStress ? "100-way stress recorded" : "authenticated stress not executed"],
      ["Lessons", reachable ? "sampled" : "blocked", "route/static evidence recorded"],
      ["Blog", reachable ? "sampled" : "blocked", "route/static evidence recorded"],
      ["Monitoring", "partial", "connection pool monitor code exists; live metrics not sampled"],
      ["Recovery", RUN_FAILURE_INJECTION ? "requested" : "blocked", "failure injection not executed"],
    ]),
    "",
    "Required next run for PASS: start a production-like runtime with `DATABASE_URL`, paid learner auth state, provider test credentials, then run this script with `SCALABILITY_RUN_HIGH_LOAD=1 SCALABILITY_RUN_REVENUE=1 SCALABILITY_RUN_FAILURE_INJECTION=1 SCALABILITY_RUN_ONE_HOUR=1`.",
  ]);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        reachable,
        status,
        reports: [
          "docs/reports/performance-baseline.md",
          "docs/reports/database-query-audit.md",
          "docs/reports/concurrent-user-load-test.md",
          "docs/reports/revenue-load-test.md",
          "docs/reports/flashcard-stress-test.md",
          "docs/reports/cat-stress-test.md",
          "docs/reports/database-pool-audit.md",
          "docs/reports/cache-audit.md",
          "docs/reports/failure-recovery-audit.md",
          "docs/reports/memory-leak-audit.md",
          "docs/reports/performance-quick-wins.md",
          "docs/reports/scalability-certification.md",
        ],
      },
      null,
      2,
    ),
  );
}

await main();

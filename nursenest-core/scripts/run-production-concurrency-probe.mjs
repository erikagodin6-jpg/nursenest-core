#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const reportDir = `${root}/reports`;
const baseUrl = (process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const concurrency = Math.max(1, Number.parseInt(process.env.NN_PROBE_CONCURRENCY ?? "8", 10));
const rounds = Math.max(1, Number.parseInt(process.env.NN_PROBE_ROUNDS ?? "3", 10));
const strict = process.argv.includes("--strict");
const ttfbWarnMs = Math.max(100, Number.parseInt(process.env.NN_PROBE_TTFB_WARN_MS ?? "2500", 10));

const routes = [
  { path: "/pricing", group: "public" },
  { path: "/blog", group: "public" },
  { path: "/canada/rn/nclex-rn", group: "public" },
  { path: "/canada/np/cnple", group: "public" },
  { path: "/canada/rpn/rex-pn", group: "public" },
  { path: "/login", group: "auth" },
  { path: "/app/flashcards", group: "learner" },
  { path: "/app/practice-tests", group: "learner" },
  { path: "/app/practice-tests/cat-launch", group: "learner" },
];

function rel(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function percentile(values, pct) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((pct / 100) * sorted.length) - 1));
  return sorted[idx];
}

async function requestOnce(route) {
  const url = `${baseUrl}${route.path}`;
  const t0 = performance.now();
  try {
    const res = await fetch(url, {
      headers: {
        accept: "text/html,*/*;q=0.8",
        "x-nn-traffic-source": "synthetic",
      },
      redirect: "manual",
    });
    const ttfbMs = Math.round(performance.now() - t0);
    await res.arrayBuffer().catch(() => null);
    return {
      ...route,
      status: res.status,
      ok: res.status < 500,
      ttfbMs,
      cache: res.headers.get("x-cache") || res.headers.get("cf-cache-status") || null,
    };
  } catch (error) {
    return {
      ...route,
      status: 0,
      ok: false,
      ttfbMs: Math.round(performance.now() - t0),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runPool(tasks, size) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const current = tasks[i++];
      out.push(await current());
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, tasks.length) }, worker));
  return out;
}

const tasks = [];
for (let round = 0; round < rounds; round += 1) {
  for (const route of routes) {
    tasks.push(() => requestOnce(route));
  }
}

const startedAt = new Date().toISOString();
const results = await runPool(tasks, concurrency);
const byPath = {};
for (const row of results) {
  byPath[row.path] ??= [];
  byPath[row.path].push(row);
}

const summary = Object.entries(byPath).map(([path, rows]) => {
  const ttfb = rows.map((r) => r.ttfbMs);
  return {
    path,
    group: rows[0]?.group ?? "unknown",
    requests: rows.length,
    failures: rows.filter((r) => !r.ok).length,
    p50TtfbMs: percentile(ttfb, 50),
    p95TtfbMs: percentile(ttfb, 95),
    maxTtfbMs: Math.max(...ttfb),
    statuses: [...new Set(rows.map((r) => r.status))].sort((a, b) => a - b),
  };
});

const failed = summary.filter((row) => row.failures > 0);
const slow = summary.filter((row) => row.p95TtfbMs > ttfbWarnMs);
const payload = {
  startedAt,
  baseUrl,
  concurrency,
  rounds,
  ttfbWarnMs,
  failedCount: failed.length,
  slowCount: slow.length,
  summary,
};

mkdirSync(reportDir, { recursive: true });
const jsonPath = `${reportDir}/production-concurrency-probe.json`;
const mdPath = `${reportDir}/production-concurrency-probe.md`;
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);

const lines = [
  "# Production Concurrency Probe",
  "",
  `Started: ${startedAt}`,
  `Base URL: ${baseUrl}`,
  `Concurrency: ${concurrency}`,
  `Rounds: ${rounds}`,
  "",
  "| Path | Group | Requests | Failures | p50 TTFB | p95 TTFB | Max TTFB | Statuses |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
];
for (const row of summary) {
  lines.push(
    `| ${row.path} | ${row.group} | ${row.requests} | ${row.failures} | ${row.p50TtfbMs} | ${row.p95TtfbMs} | ${row.maxTtfbMs} | ${row.statuses.join(", ")} |`,
  );
}
writeFileSync(mdPath, `${lines.join("\n")}\n`);

console.log(`[concurrency-probe] wrote ${rel(jsonPath)} and ${rel(mdPath)}`);
console.log(`[concurrency-probe] failures=${failed.length} slow=${slow.length} warn=${ttfbWarnMs}ms`);

if (strict && failed.length > 0) {
  console.error(`[concurrency-probe] strict failure: ${failed.length} routes had 5xx/network failures`);
  process.exit(1);
}

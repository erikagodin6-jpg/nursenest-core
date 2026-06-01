#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(pkgRoot, "..");
const baseUrl = String(process.env.GOOGLEBOT_BASE_URL || process.env.BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);
const sizes = parseList(process.env.GOOGLEBOT_LOAD_SIZES || "100,500,1000,2000");
const concurrencies = parseList(process.env.GOOGLEBOT_LOAD_CONCURRENCIES || "4,8,12,16,24");
const timeoutMs = Math.max(1_000, Number(process.env.GOOGLEBOT_LOAD_TIMEOUT_MS || "30000"));
const childSitemapLimit = Math.max(1, Number(process.env.GOOGLEBOT_LOAD_CHILD_SITEMAP_LIMIT || "40"));
const reportDir = resolve(workspaceRoot, "docs", "reports");
const rawDir = resolve(workspaceRoot, "reports", "googlebot-load-analysis");
const googlebotUA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) NurseNestCapacityAudit/1.0";

function parseList(raw) {
  return String(raw)
    .split(",")
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((value) => Number.isFinite(value) && value > 0);
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1]?.trim()).filter(Boolean);
}

function percentile(values, pct) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((pct / 100) * sorted.length) - 1));
  return sorted[index] ?? 0;
}

async function getText(url) {
  const res = await fetch(url, {
    headers: {
      accept: "application/xml,text/xml,text/plain,*/*;q=0.7",
      "user-agent": googlebotUA,
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  return await res.text();
}

async function discoverUrls() {
  const urls = new Set();
  const sitemapIndex = await getText(`${baseUrl}/sitemap.xml`);
  const toBaseUrl = (loc) => {
    try {
      const parsed = new URL(loc);
      return `${baseUrl}${parsed.pathname}${parsed.search}`;
    } catch {
      return loc.startsWith("/") ? `${baseUrl}${loc}` : null;
    }
  };
  const children = xmlLocs(sitemapIndex).map(toBaseUrl).filter(Boolean).slice(0, childSitemapLimit);

  for (const child of children) {
    try {
      const xml = await getText(child);
      for (const loc of xmlLocs(xml)) {
        const url = toBaseUrl(loc);
        if (url) urls.add(url);
      }
    } catch (error) {
      console.error(`[googlebot-load] child sitemap failed ${child}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (!urls.size) {
    for (const path of ["/", "/blog", "/lessons", "/question-bank", "/flashcards", "/sitemap.xml"]) {
      urls.add(`${baseUrl}${path}`);
    }
  }

  return [...urls];
}

async function probe(url) {
  const started = performance.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "user-agent": googlebotUA,
        "x-nn-traffic-source": "googlebot-load-analysis",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    await res.arrayBuffer().catch(() => null);
    return {
      url,
      status: res.status,
      ok: res.ok,
      ms: Math.round(performance.now() - started),
      xDoFailureCode: res.headers.get("x-do-failure-code"),
      xDoFailureMsg: res.headers.get("x-do-failure-msg"),
      xDoOrigStatus: res.headers.get("x-do-orig-status"),
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: null,
      ok: false,
      ms: Math.round(performance.now() - started),
      xDoFailureCode: null,
      xDoFailureMsg: null,
      xDoOrigStatus: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function pool(items, limit, fn) {
  const out = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = items[index++];
      out.push(await fn(current));
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

function appProcesses() {
  const ownPid = process.pid;
  let rows = "";
  try {
    rows = execFileSync("ps", ["-eo", "pid=,ppid=,pcpu=,rss=,cmd="], { encoding: "utf8" });
  } catch {
    return [];
  }

  return rows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(\d+)\s+([\d.]+)\s+(\d+)\s+(.+)$/);
      if (!match) return null;
      return {
        pid: Number(match[1]),
        ppid: Number(match[2]),
        cpuPct: Number(match[3]),
        rssKb: Number(match[4]),
        cmd: match[5],
      };
    })
    .filter(Boolean)
    .filter((row) => row.pid !== ownPid)
    .filter((row) => {
      const cmd = row.cmd;
      return (
        !cmd.includes("googlebot-load-analysis.mjs") &&
        (cmd.includes("start-standalone.mjs") ||
          cmd.includes("start-standalone-runtime.cjs") ||
          cmd.includes("next-server") ||
          cmd.includes(".next/standalone/server.js") ||
          cmd.includes("server.js") ||
          cmd.includes("next/dist"))
      );
    });
}

function resourceSnapshot() {
  const processes = appProcesses();
  return {
    at: new Date().toISOString(),
    processCount: processes.length,
    pids: processes.map((row) => row.pid),
    cpuPct: round(processes.reduce((sum, row) => sum + row.cpuPct, 0), 1),
    rssMb: round(processes.reduce((sum, row) => sum + row.rssKb, 0) / 1024, 1),
  };
}

function round(value, digits = 0) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

async function readinessSnapshot() {
  const [healthz, readyz] = await Promise.all([probe(`${baseUrl}/healthz`), probe(`${baseUrl}/readyz`)]);
  return { at: new Date().toISOString(), healthz, readyz };
}

function createMonitor() {
  const resources = [];
  const readiness = [];
  const startedPids = new Set();
  const seenPids = new Set();
  const disappearedPids = new Set();
  let stopped = false;

  async function tick() {
    const resource = resourceSnapshot();
    resources.push(resource);
    for (const pid of resource.pids) seenPids.add(pid);
    if (!startedPids.size) {
      for (const pid of resource.pids) startedPids.add(pid);
    } else {
      for (const pid of startedPids) {
        if (!resource.pids.includes(pid)) disappearedPids.add(pid);
      }
    }
    readiness.push(await readinessSnapshot());
  }

  const loop = (async () => {
    while (!stopped) {
      await tick().catch(() => null);
      await new Promise((resolveSleep) => setTimeout(resolveSleep, 1_000));
    }
  })();

  return {
    async stop() {
      stopped = true;
      await loop.catch(() => null);
      await tick().catch(() => null);
      return {
        resources,
        readiness,
        restartEvents: disappearedPids.size,
      };
    },
  };
}

function sampleUrls(urls, size) {
  return Array.from({ length: size }, (_, index) => urls[index % urls.length]);
}

function summarizeRows(rows, requested, concurrency, startedAt, durationMs, monitor) {
  const timings = rows.map((row) => row.ms);
  const statusCounts = {};
  for (const row of rows) {
    const key = row.status === null ? "fetch_error" : String(row.status);
    statusCounts[key] = (statusCounts[key] ?? 0) + 1;
  }
  const resources = monitor.resources;
  const readiness = monitor.readiness;
  const failures = rows.filter((row) => !row.ok || row.status === null || row.status >= 500);
  return {
    requested,
    audited: rows.length,
    concurrency,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs,
    statusCounts,
    errorCount: failures.length,
    fetchErrors: rows.filter((row) => row.status === null).length,
    upstreamFailures: rows.filter((row) => row.xDoFailureCode === "UH" || /no_healthy_upstream/i.test(row.xDoFailureMsg ?? "")).length,
    avgMs: Math.round(timings.reduce((sum, ms) => sum + ms, 0) / Math.max(1, timings.length)),
    p50Ms: percentile(timings, 50),
    p95Ms: percentile(timings, 95),
    p99Ms: percentile(timings, 99),
    maxMs: timings.length ? Math.max(...timings) : 0,
    slowest: [...rows].sort((a, b) => b.ms - a.ms).slice(0, 10),
    memory: {
      maxRssMb: resources.length ? Math.max(...resources.map((row) => row.rssMb)) : 0,
      avgRssMb: resources.length ? round(resources.reduce((sum, row) => sum + row.rssMb, 0) / resources.length, 1) : 0,
    },
    cpu: {
      maxPct: resources.length ? Math.max(...resources.map((row) => row.cpuPct)) : 0,
      avgPct: resources.length ? round(resources.reduce((sum, row) => sum + row.cpuPct, 0) / resources.length, 1) : 0,
    },
    restartEvents: monitor.restartEvents,
    readiness: {
      samples: readiness.length,
      readyzNon200: readiness.filter((row) => row.readyz.status !== 200).length,
      healthzNon200: readiness.filter((row) => row.healthz.status !== 200).length,
      before: readiness[0] ?? null,
      after: readiness[readiness.length - 1] ?? null,
    },
  };
}

function csv(rows) {
  const header = ["url", "status", "ok", "ms", "x_do_failure_code", "x_do_failure_msg", "x_do_orig_status", "error"];
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    header.join(","),
    ...rows.map((row) =>
      [row.url, row.status ?? "", row.ok, row.ms, row.xDoFailureCode, row.xDoFailureMsg, row.xDoOrigStatus, row.error]
        .map(escape)
        .join(","),
    ),
  ].join("\n");
}

function failed(summary) {
  return (
    summary.errorCount > 0 ||
    summary.upstreamFailures > 0 ||
    summary.restartEvents > 0 ||
    summary.readiness.readyzNon200 > 0 ||
    summary.readiness.healthzNon200 > 0
  );
}

function determineThreshold(summaries) {
  const firstFailure = summaries.find(failed);
  if (!firstFailure) {
    const max = summaries.at(-1);
    return `No failure observed through ${max.requested} URLs at concurrency ${max.concurrency}.`;
  }
  return `First observed failure at ${firstFailure.requested} URLs with concurrency ${firstFailure.concurrency}.`;
}

function renderMarkdown({ discoveredCount, summaries }) {
  const threshold = determineThreshold(summaries);
  const rows = summaries
    .map((s) =>
      [
        s.requested,
        s.concurrency,
        s.statusCounts["200"] ?? 0,
        s.errorCount,
        s.upstreamFailures,
        s.avgMs,
        s.p50Ms,
        s.p95Ms,
        s.p99Ms,
        s.maxMs,
        s.memory.maxRssMb,
        s.cpu.maxPct,
        s.restartEvents,
        s.readiness.readyzNon200,
      ].join(" | "),
    )
    .map((line) => `| ${line} |`)
    .join("\n");

  const slowest = summaries
    .flatMap((summary) =>
      summary.slowest.slice(0, 3).map((row) => ({
        size: summary.requested,
        concurrency: summary.concurrency,
        ...row,
      })),
    )
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 15)
    .map((row) => `| ${row.size} | ${row.concurrency} | ${row.status ?? "ERR"} | ${row.ms} | ${row.url} |`)
    .join("\n");

  return `# Googlebot Load Analysis

Date: ${new Date().toISOString().slice(0, 10)}

## Scope

- Base URL: ${baseUrl}
- User agent: \`${googlebotUA}\`
- Discovered URL inventory: ${discoveredCount}
- URL batch sizes: ${sizes.join(", ")}
- Concurrency levels: ${concurrencies.join(", ")}
- Request timeout: ${timeoutMs} ms

## Failure Threshold

${threshold}

## Results

| URLs | Concurrency | 200s | Errors | Upstream Failures | Avg ms | p50 ms | p95 ms | p99 ms | Max ms | Max RSS MB | Max CPU % | Restarts | readyz Non-200 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}

## Slowest Requests

| URLs | Concurrency | Status | ms | URL |
| ---: | ---: | ---: | ---: | --- |
${slowest || "| n/a | n/a | n/a | n/a | n/a |"}

## Interpretation

- A failure is counted when any crawl request returns a fetch error or HTTP 5xx, any DigitalOcean upstream failure header appears, a monitored app process exits during a batch, or \`/readyz\`/\`/healthz\` returns non-200 during monitoring.
- CPU and memory are sampled from local Node/Next standalone processes on the same host as the crawl.
- Restart events are local process disappearances, not DigitalOcean container restart counters.

## Raw Artifacts

Raw JSON and CSV outputs are in \`reports/googlebot-load-analysis/\`.
`;
}

mkdirSync(reportDir, { recursive: true });
mkdirSync(rawDir, { recursive: true });

const discovered = await discoverUrls();
writeFileSync(resolve(rawDir, "discovered-urls.json"), `${JSON.stringify({ baseUrl, count: discovered.length, urls: discovered }, null, 2)}\n`);

const summaries = [];
for (const concurrency of concurrencies) {
  for (const size of sizes) {
    const sample = sampleUrls(discovered, size);
    const startedAt = new Date().toISOString();
    const startedMs = performance.now();
    const monitor = createMonitor();
    const rows = await pool(sample, concurrency, probe);
    const monitorResult = await monitor.stop();
    const summary = summarizeRows(rows, size, concurrency, startedAt, Math.round(performance.now() - startedMs), monitorResult);
    summaries.push(summary);
    const slug = `urls-${size}-concurrency-${concurrency}`;
    writeFileSync(resolve(rawDir, `${slug}.json`), `${JSON.stringify({ summary, rows, monitor: monitorResult }, null, 2)}\n`);
    writeFileSync(resolve(rawDir, `${slug}.csv`), `${csv(rows)}\n`);
    console.log(
      `[googlebot-load] urls=${size} concurrency=${concurrency} errors=${summary.errorCount} upstream=${summary.upstreamFailures} p95=${summary.p95Ms}ms readyzNon200=${summary.readiness.readyzNon200} maxRss=${summary.memory.maxRssMb}MB`,
    );
  }
}

writeFileSync(resolve(rawDir, "summary.json"), `${JSON.stringify({ baseUrl, discoveredCount: discovered.length, summaries }, null, 2)}\n`);
writeFileSync(resolve(reportDir, "googlebot-load-analysis.md"), renderMarkdown({ discoveredCount: discovered.length, summaries }));

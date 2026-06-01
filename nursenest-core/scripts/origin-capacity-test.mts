import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type ProbeRow = {
  url: string;
  status: number | null;
  ms: number;
  xDoFailureCode: string | null;
  xDoFailureMsg: string | null;
  xDoOrigStatus: string | null;
  error: string | null;
};

type BatchSummary = {
  requested: number;
  audited: number;
  concurrency: number;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  statusCounts: Record<string, number>;
  upstreamFailures: number;
  fetchErrors: number;
  p50Ms: number;
  p95Ms: number;
  maxMs: number;
  healthBefore: ProbeRow[];
  healthAfter: ProbeRow[];
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = (process.env.ORIGIN_BASE_URL || process.env.BASE_URL || "https://nursenest.ca").replace(/\/$/, "");
const outDir = resolve(root, "reports", "origin-capacity-test");
const sizes = (process.env.ORIGIN_CAPACITY_SIZES || "100,500,1000,2000")
  .split(",")
  .map((part) => Number.parseInt(part.trim(), 10))
  .filter((value) => Number.isFinite(value) && value > 0);
const concurrency = Math.max(1, Number.parseInt(process.env.ORIGIN_CAPACITY_CONCURRENCY || "12", 10));
const timeoutMs = Math.max(1_000, Number.parseInt(process.env.ORIGIN_CAPACITY_TIMEOUT_MS || "20000", 10));
const childSitemapLimit = Math.max(1, Number.parseInt(process.env.ORIGIN_CAPACITY_CHILD_SITEMAP_LIMIT || "30", 10));

function xmlLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1]?.trim()).filter(Boolean) as string[];
}

function percentile(values: number[], pct: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((pct / 100) * sorted.length) - 1));
  return sorted[index] ?? 0;
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { accept: "application/xml,text/xml,text/plain,*/*;q=0.7", "user-agent": "NurseNest-OriginCapacityAudit/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  return await res.text();
}

async function discoverUrls(): Promise<string[]> {
  const sitemapIndex = await getText(`${origin}/sitemap.xml`);
  const children = xmlLocs(sitemapIndex).filter((url) => url.startsWith(origin)).slice(0, childSitemapLimit);
  const urls = new Set<string>();
  for (const child of children) {
    try {
      const xml = await getText(child);
      for (const loc of xmlLocs(xml)) {
        if (loc.startsWith(origin)) urls.add(loc);
      }
    } catch (error) {
      console.error(`[origin-capacity] child sitemap failed ${child}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return [...urls];
}

async function probe(url: string): Promise<ProbeRow> {
  const started = performance.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.7",
        "user-agent": "NurseNest-OriginCapacityAudit/1.0",
        "x-nn-traffic-source": "origin-capacity-audit",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    await res.arrayBuffer().catch(() => null);
    return {
      url,
      status: res.status,
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
      ms: Math.round(performance.now() - started),
      xDoFailureCode: null,
      xDoFailureMsg: null,
      xDoOrigStatus: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
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

async function healthSnapshot(): Promise<ProbeRow[]> {
  return await pool([`${origin}/healthz`, `${origin}/readyz`], 2, probe);
}

function summarize(rows: ProbeRow[], requested: number, startedAt: string, startedMs: number, healthBefore: ProbeRow[], healthAfter: ProbeRow[]): BatchSummary {
  const statusCounts: Record<string, number> = {};
  for (const row of rows) {
    const key = row.status === null ? "fetch_error" : String(row.status);
    statusCounts[key] = (statusCounts[key] ?? 0) + 1;
  }
  const timings = rows.map((row) => row.ms);
  return {
    requested,
    audited: rows.length,
    concurrency,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Math.round(performance.now() - startedMs),
    statusCounts,
    upstreamFailures: rows.filter((row) => row.xDoFailureCode === "UH" || /no_healthy_upstream/i.test(row.xDoFailureMsg ?? "")).length,
    fetchErrors: rows.filter((row) => row.status === null).length,
    p50Ms: percentile(timings, 50),
    p95Ms: percentile(timings, 95),
    maxMs: timings.length ? Math.max(...timings) : 0,
    healthBefore,
    healthAfter,
  };
}

function csv(rows: ProbeRow[]): string {
  const header = ["url", "status", "ms", "x_do_failure_code", "x_do_failure_msg", "x_do_orig_status", "error"];
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    header.join(","),
    ...rows.map((row) =>
      [
        row.url,
        row.status ?? "",
        row.ms,
        row.xDoFailureCode ?? "",
        row.xDoFailureMsg ?? "",
        row.xDoOrigStatus ?? "",
        row.error ?? "",
      ]
        .map(escape)
        .join(","),
    ),
  ].join("\n");
}

mkdirSync(outDir, { recursive: true });
const discovered = await discoverUrls();
writeFileSync(resolve(outDir, "discovered-urls.json"), `${JSON.stringify({ origin, count: discovered.length, urls: discovered }, null, 2)}\n`);

const summaries: BatchSummary[] = [];
for (const size of sizes) {
  const sample = discovered.slice(0, size);
  const healthBefore = await healthSnapshot();
  const startedAt = new Date().toISOString();
  const startedMs = performance.now();
  const rows = await pool(sample, concurrency, probe);
  const healthAfter = await healthSnapshot();
  const summary = summarize(rows, size, startedAt, startedMs, healthBefore, healthAfter);
  summaries.push(summary);
  writeFileSync(resolve(outDir, `batch-${size}.json`), `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeFileSync(resolve(outDir, `batch-${size}.csv`), `${csv(rows)}\n`);
  console.log(`[origin-capacity] size=${size} audited=${rows.length} upstreamFailures=${summary.upstreamFailures} statuses=${JSON.stringify(summary.statusCounts)} p95=${summary.p95Ms}ms`);
}

writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify({ origin, timeoutMs, childSitemapLimit, discoveredCount: discovered.length, summaries }, null, 2)}\n`);

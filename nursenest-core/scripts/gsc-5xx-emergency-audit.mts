import { mkdirSync, writeFileSync } from "node:fs";

type AuditRow = {
  url: string;
  source: string;
  family: string;
  status: number | null;
  responseTimeMs: number;
  redirectChain: string;
  renderingSuccess: boolean;
  timeout: boolean;
  contentType: string;
  cacheStatus: string;
  upstreamStatus: string;
  failureCode: string;
  failureMessage: string;
  rootCause: string;
  error: string;
};

const ORIGIN = "https://nursenest.ca";
const TIMEOUT_MS = Number.parseInt(process.env.GSC_5XX_TIMEOUT_MS ?? "15000", 10);
const CONCURRENCY = Number.parseInt(process.env.GSC_5XX_CONCURRENCY ?? "32", 10);
const OUT_DIR = "reports/gsc-5xx-emergency";
const DOC_DIR = "docs/reports";
const SITEMAPS = [
  "/sitemap.xml",
  "/sitemap-blog.xml",
  "/sitemap-lessons.xml",
  "/sitemap-pathways.xml",
  "/sitemap-localized.xml",
];
const LOCALE_PREFIXES = [
  "/fr",
  "/es",
  "/hi",
  "/pt",
  "/ar",
  "/de",
  "/ja",
  "/ko",
  "/zh",
  "/zh-tw",
  "/tr",
  "/id",
];

function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function csv<T extends Record<string, unknown>>(rows: T[], columns: (keyof T)[]): string {
  return [columns.map(String).join(","), ...rows.map((row) => columns.map((key) => csvEscape(row[key])).join(","))].join("\n") + "\n";
}

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1]?.trim() ?? "").filter(Boolean);
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ac.signal, redirect: "manual" });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetchWithTimeout(url, { headers: { "user-agent": "NurseNestGSC5xxAudit/1.0" } });
  return await res.text();
}

function routeFamily(url: string): string {
  const path = new URL(url).pathname;
  if (path.startsWith("/blog")) return "blog";
  if (path.includes("/lessons/") || path === "/lessons") return "lessons";
  if (path.startsWith("/questions") || path.includes("/question")) return "questions";
  if (path.includes("/np") || path.includes("cnple") || path.includes("fnp") || path.includes("agpcnp")) return "NP";
  if (path.includes("/rn/") || path.includes("nclex-rn") || path.includes("nclex")) return "RN";
  if (path.includes("/rpn/") || path.includes("rex-pn") || path.includes("pn")) return "RPN";
  if (path.includes("ecg")) return "ECG";
  if (path.includes("signup") || path.includes("sign-up") || path.includes("login")) return "signup";
  if (/^\/(fr|es|hi|pt|ar|de|ja|ko|zh|zh-tw|tr|id)(\/|$)/.test(path)) return "localized routes";
  return "other";
}

function inferRootCause(row: Omit<AuditRow, "rootCause">): string {
  if (row.timeout) return "timeout";
  if (row.failureCode === "UH" || /no_healthy_upstream/i.test(row.failureMessage)) return "origin_no_healthy_upstream";
  if (row.upstreamStatus === "503") return "origin_unhealthy_or_runtime_crash";
  if (row.status === 504) return "gateway_timeout_or_route_render_timeout";
  if (row.status === 503) return "service_unavailable";
  if (row.status === 500) return "server_exception_or_rendering_failure";
  if (row.status === 502) return "bad_gateway";
  if (row.status === 404) return "missing_content";
  return row.status && row.status >= 500 ? "unknown_5xx" : "";
}

async function auditUrl(url: string, source: string): Promise<AuditRow> {
  const started = Date.now();
  const chain: string[] = [];
  let current = url;
  try {
    for (let hop = 0; hop < 6; hop += 1) {
      const res = await fetchWithTimeout(current, { headers: { "user-agent": "NurseNestGSC5xxAudit/1.0" } });
      chain.push(`${current} [${res.status}]`);
      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        current = new URL(location, current).toString();
        await res.body?.cancel();
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";
      let error = "";
      if (res.status >= 500) {
        try {
          error = (await res.text()).replace(/\s+/g, " ").slice(0, 300);
        } catch {
          error = "";
        }
      } else {
        await res.body?.cancel();
      }
      const base = {
        url,
        source,
        family: routeFamily(url),
        status: res.status,
        responseTimeMs: Date.now() - started,
        redirectChain: chain.join(" -> "),
        renderingSuccess: res.status >= 200 && res.status < 500,
        timeout: false,
        contentType,
        cacheStatus: res.headers.get("cf-cache-status") ?? res.headers.get("x-cache") ?? "",
        upstreamStatus: res.headers.get("x-do-orig-status") ?? "",
        failureCode: res.headers.get("x-do-failure-code") ?? "",
        failureMessage: res.headers.get("x-do-failure-msg") ?? "",
        error,
      };
      return { ...base, rootCause: inferRootCause(base) };
    }
    const base = {
      url,
      source,
      family: routeFamily(url),
      status: null,
      responseTimeMs: Date.now() - started,
      redirectChain: chain.join(" -> "),
      renderingSuccess: false,
      timeout: false,
      contentType: "",
      cacheStatus: "",
      upstreamStatus: "",
      failureCode: "",
      failureMessage: "",
      error: "redirect_chain_exceeded",
    };
    return { ...base, rootCause: "redirect_failure" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const base = {
      url,
      source,
      family: routeFamily(url),
      status: null,
      responseTimeMs: Date.now() - started,
      redirectChain: chain.join(" -> "),
      renderingSuccess: false,
      timeout: /abort|timeout/i.test(message),
      contentType: "",
      cacheStatus: "",
      upstreamStatus: "",
      failureCode: "",
      failureMessage: "",
      error: message,
    };
    return { ...base, rootCause: inferRootCause(base) };
  }
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        out[index] = await worker(items[index]!, index);
      }
    }),
  );
  return out;
}

function countBy<T>(rows: T[], key: (row: T) => string): Array<{ key: string; count: number }> {
  const map = new Map<string, number>();
  for (const row of rows) map.set(key(row), (map.get(key(row)) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count }));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(DOC_DIR, { recursive: true });

  const sourceEntries = new Map<string, Set<string>>();
  for (const sitemap of SITEMAPS) {
    const sitemapUrl = absolute(sitemap);
    const xml = await fetchText(sitemapUrl);
    for (const loc of extractLocs(xml)) {
      const set = sourceEntries.get(loc) ?? new Set<string>();
      set.add(sitemap.replace(/^\//, ""));
      sourceEntries.set(loc, set);
    }
  }

  const localeUrls = LOCALE_PREFIXES.map(absolute);
  for (const loc of localeUrls) {
    const set = sourceEntries.get(loc) ?? new Set<string>();
    set.add("locale-prefix-probe");
    sourceEntries.set(loc, set);
  }

  const entries = [...sourceEntries.entries()]
    .filter(([url]) => !url.endsWith(".xml"))
    .map(([url, sources]) => ({ url, source: [...sources].sort().join("|") }))
    .sort((a, b) => a.url.localeCompare(b.url));

  const rows = await mapLimit(entries, CONCURRENCY, (entry) => auditUrl(entry.url, entry.source));
  const fiveXx = rows.filter((row) => row.status != null && row.status >= 500);
  const localeRows = rows.filter((row) => row.source.includes("locale-prefix-probe"));

  const columns: (keyof AuditRow)[] = [
    "url",
    "source",
    "family",
    "status",
    "responseTimeMs",
    "redirectChain",
    "renderingSuccess",
    "timeout",
    "contentType",
    "cacheStatus",
    "upstreamStatus",
    "failureCode",
    "failureMessage",
    "rootCause",
    "error",
  ];
  writeFileSync(`${OUT_DIR}/results.csv`, csv(rows, columns));
  writeFileSync(`${OUT_DIR}/5xx-urls.csv`, csv(fiveXx, columns));
  writeFileSync(`${OUT_DIR}/locale-route-health.csv`, csv(localeRows, columns));
  writeFileSync(`${OUT_DIR}/results.json`, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));

  const statusCounts = countBy(rows, (row) => String(row.status ?? "fetch_error"));
  const familyCounts = countBy(fiveXx, (row) => row.family);
  const causeCounts = countBy(fiveXx, (row) => row.rootCause || "none");

  const statusTable = statusCounts.map((row) => `| ${row.key} | ${row.count} |`).join("\n");
  const familyTable = familyCounts.map((row) => `| ${row.key} | ${row.count} |`).join("\n");
  const causeTable = causeCounts.map((row) => `| ${row.key} | ${row.count} |`).join("\n");
  const localeTable = localeRows
    .map((row) => `| ${new URL(row.url).pathname} | ${row.status ?? "ERR"} | ${row.responseTimeMs} | ${row.renderingSuccess ? "yes" : "no"} | ${row.rootCause || "-"} |`)
    .join("\n");

  writeFileSync(
    `${DOC_DIR}/gsc-5xx-truth-audit.md`,
    `# GSC 5XX Truth Audit\n\nGenerated: ${new Date().toISOString()}\n\nScope: live production URLs discovered in \`${SITEMAPS.join("`, `")}\` plus locale prefix probes.\n\n| Metric | Count |\n| --- | ---: |\n| URLs audited | ${rows.length} |\n| 5xx URLs | ${fiveXx.length} |\n| Timeouts | ${rows.filter((row) => row.timeout).length} |\n| Rendering success | ${rows.filter((row) => row.renderingSuccess).length} |\n\n## Status Breakdown\n\n| Status | Count |\n| --- | ---: |\n${statusTable}\n\nCSV: \`${OUT_DIR}/5xx-urls.csv\`\n`,
  );

  writeFileSync(
    `${DOC_DIR}/5xx-root-cause-analysis.md`,
    `# 5XX Root Cause Analysis\n\nGenerated: ${new Date().toISOString()}\n\n## Failures By Route Family\n\n| Family | 5xx count |\n| --- | ---: |\n${familyTable || "| none | 0 |"}\n\n## Failures By Inferred Root Cause\n\n| Root cause | Count |\n| --- | ---: |\n${causeTable || "| none | 0 |"}\n\n## Interpretation\n\n- \`origin_no_healthy_upstream\` / \`origin_unhealthy_or_runtime_crash\` means DigitalOcean/Cloudflare did not have a healthy app response. Route-level SEO metadata changes cannot fix those until deployment/runtime health is stable.\n- \`gateway_timeout_or_route_render_timeout\` means the request reached the edge but the page did not complete in time or the upstream returned timeout HTML.\n- \`server_exception_or_rendering_failure\` should be traced by route family and fixed with static fallbacks or guarded loaders.\n\nCSV: \`${OUT_DIR}/5xx-urls.csv\`\n`,
  );

  writeFileSync(
    `${DOC_DIR}/locale-route-health-report.md`,
    `# Locale Route Health Report\n\nGenerated: ${new Date().toISOString()}\n\n| Locale route | Status | Response time ms | Renders | Root cause |\n| --- | ---: | ---: | --- | --- |\n${localeTable}\n\nCSV: \`${OUT_DIR}/locale-route-health.csv\`\n`,
  );

  const previous = 8120;
  const reduction = previous > 0 ? (((previous - fiveXx.length) / previous) * 100).toFixed(1) : "0.0";
  writeFileSync(
    `${DOC_DIR}/gsc-recovery-verification.md`,
    `# GSC Recovery Verification\n\nGenerated: ${new Date().toISOString()}\n\n| Metric | Count |\n| --- | ---: |\n| Previous GSC 5xx count | ${previous}+ |\n| Current audited 5xx count | ${fiveXx.length} |\n| Reduction percentage vs 8,120 baseline | ${reduction}% |\n| Crawl success rate | ${rows.length > 0 ? (((rows.length - fiveXx.length) / rows.length) * 100).toFixed(1) : "0.0"}% |\n\nGoal: reduce GSC 5xx URLs from 8,120+ to under 50.\n\nVerdict: ${fiveXx.length < 50 ? "target met in this live audit scope" : "target not met"}.\n`,
  );

  console.log(JSON.stringify({ audited: rows.length, fiveXx: fiveXx.length, statusCounts, familyCounts, causeCounts }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

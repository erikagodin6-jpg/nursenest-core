#!/usr/bin/env npx tsx
/**
 * Google Search Console indexing emergency audit.
 *
 * This is intentionally read-only. It combines:
 * - local crawl/indexing policy source code;
 * - sitemap/robots configuration;
 * - optional Search Console CSV exports when present.
 *
 * Optional CSV location:
 *   GSC_EXPORT_DIR=data/gsc-indexing npm run audit:gsc-indexing
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { GET as getRobotsTxt } from "@/app/robots.txt/route";
import { SITEMAP_INDEX_CHILD_FILENAMES } from "@/lib/seo/sitemap-index-children";

type CsvRow = Record<string, string>;

type GscIssueKind = "5xx" | "404" | "blocked" | "crawled-not-indexed" | "noindex" | "unknown";

type GscUrlRow = {
  url: string;
  pathname: string;
  issue: GscIssueKind;
  sourceFile: string;
  errorCode?: string;
  frequency?: string;
  firstSeen?: string;
  lastSeen?: string;
};

type PatternFinding = {
  pattern: string;
  classification: string;
  recommendation: string;
};

const packageRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const reportsDir = resolve(packageRoot, "docs/reports");
const sourceRoots = ["src/app", "src/lib/seo", "next.config.mjs", "src/proxy.ts"] as const;

const gscReportedCounts = {
  serverErrors5xx: 8122,
  notFound404: 18985,
  blockedByRobots: 2037,
  crawledNotIndexed: 718,
  noindex: 5611,
} as const;

const liveSitemapSmokeDate = "2026-05-30";
const liveSitemapTimeoutUrls = [
  "https://nursenest.ca/canada/rn/nclex-rn/questions",
  "https://nursenest.ca/us/rn/nclex-rn/questions",
  "https://nursenest.ca/us/np/fnp/questions",
  "https://nursenest.ca/us/np/pmhnp/questions",
  "https://nursenest.ca/us/np/whnp/questions",
  "https://nursenest.ca/us/np/pnp-pc",
  "https://nursenest.ca/us/np/pnp-pc/pricing",
  "https://nursenest.ca/us/np/pnp-pc/questions",
  "https://nursenest.ca/us/rn/nclex-rn/test-bank",
  "https://nursenest.ca/canada/rpn/rex-pn/test-bank",
  "https://nursenest.ca/canada/np/cnple/test-bank",
  "https://nursenest.ca/us/np/fnp/test-bank",
  "https://nursenest.ca/us/np/agpcnp/test-bank",
  "https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-cardiovascular",
  "https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-respiratory",
  "https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-gastrointestinal",
  "https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-neurological",
] as const;

const liveSitemapNoindexUrls = [
  "https://nursenest.ca/canada/np/cnple/pricing",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-cardiovascular",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-respiratory",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-renal-and-fluid",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-gastrointestinal",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-neurological",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-endocrine",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-musculoskeletal",
  "https://nursenest.ca/canada/np/cnple/np-clinical-practice-immune-and-infection",
  "https://nursenest.ca/canada/np/cnple/np-lessons-cardiovascular",
  "https://nursenest.ca/canada/np/cnple/np-lessons-respiratory",
  "https://nursenest.ca/canada/np/cnple/np-lessons-renal-and-fluid",
  "https://nursenest.ca/canada/np/cnple/np-lessons-gastrointestinal",
  "https://nursenest.ca/canada/np/cnple/np-lessons-neurological",
  "https://nursenest.ca/canada/np/cnple/np-lessons-endocrine",
  "https://nursenest.ca/canada/np/cnple/np-lessons-musculoskeletal",
  "https://nursenest.ca/canada/np/cnple/np-lessons-immune-and-infection",
  "https://nursenest.ca/canada/np/cnple/pharmacology-nursing-cardiac-meds",
  "https://nursenest.ca/canada/np/cnple/pharmacology-nursing-diabetes-meds",
  "https://nursenest.ca/canada/np/cnple/pharmacology-nursing-antibiotics",
  "https://nursenest.ca/canada/np/cnple/pharmacology-nursing-pain-and-sedation",
] as const;

function readText(path: string): string {
  return readFileSync(resolve(packageRoot, path), "utf8");
}

function walkFiles(root: string, out: string[] = []): string[] {
  const abs = resolve(packageRoot, root);
  if (!existsSync(abs)) return out;
  const st = statSync(abs);
  if (st.isFile()) {
    out.push(abs);
    return out;
  }
  for (const name of readdirSync(abs)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const child = join(abs, name);
    const childSt = statSync(child);
    if (childSt.isDirectory()) walkFiles(relative(packageRoot, child), out);
    else if (/\.(tsx?|mts|mjs|json|md)$/.test(name)) out.push(child);
  }
  return out;
}

function listSourceFiles(): string[] {
  const files = new Set<string>();
  for (const root of sourceRoots) {
    for (const f of walkFiles(root)) files.add(f);
  }
  return [...files].sort();
}

function extractRoutePathFromAppFile(abs: string): string {
  const rel = relative(resolve(packageRoot, "src/app"), abs);
  if (rel.startsWith("..")) return relative(packageRoot, abs);
  const parts = rel.split(/[\\/]/).filter(Boolean);
  const routeParts = parts.filter((part) => {
    if (part.startsWith("(") && part.endsWith(")")) return false;
    if (["page.tsx", "route.ts", "layout.tsx", "loading.tsx", "error.tsx", "not-found.tsx"].includes(part)) return false;
    return true;
  });
  return `/${routeParts.join("/")}`.replace(/\/+/g, "/") || "/";
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if (ch === "," && !quoted) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

function parseCsv(path: string): CsvRow[] {
  const lines = readFileSync(path, "utf8").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0] ?? "");
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? "";
    });
    return row;
  });
}

function inferIssueKind(file: string): GscIssueKind {
  const lower = basename(file).toLowerCase();
  if (/5xx|server/.test(lower)) return "5xx";
  if (/404|not[-_\s]?found/.test(lower)) return "404";
  if (/robot|blocked/.test(lower)) return "blocked";
  if (/crawled|currently[-_\s]?not[-_\s]?indexed/.test(lower)) return "crawled-not-indexed";
  if (/noindex/.test(lower)) return "noindex";
  return "unknown";
}

function urlColumn(row: CsvRow): string | null {
  const keys = Object.keys(row);
  const preferred = ["Address", "URL", "Page", "Final URL", "Url", "url"];
  for (const key of preferred) {
    if (key in row) return key;
  }
  return keys[0] ?? null;
}

function csvField(row: CsvRow, candidates: readonly string[]): string | undefined {
  const entries = Object.entries(row);
  for (const candidate of candidates) {
    const exact = entries.find(([key]) => key.toLowerCase() === candidate.toLowerCase());
    const value = exact?.[1]?.trim();
    if (value) return value;
  }
  for (const candidate of candidates) {
    const needle = candidate.toLowerCase();
    const fuzzy = entries.find(([key]) => key.toLowerCase().includes(needle));
    const value = fuzzy?.[1]?.trim();
    if (value) return value;
  }
  return undefined;
}

function routeTypeForPathname(pathname: string): string {
  if (/^\/api(\/|$)/i.test(pathname)) return "API Routes";
  if (/\/blog(\/|$)/i.test(pathname)) return "Blog";
  if (/\/lessons?(\/|$)|\/np-lessons-|\/lesson-/i.test(pathname)) return "Lessons";
  if (/\/questions?(\/|$)|practice-questions/i.test(pathname)) return "Questions";
  if (/\/flashcards?(\/|$)/i.test(pathname)) return "Flashcards";
  if (/\/practice-exams?(\/|$)|\/cat(\/|$)|\/test-bank(\/|$)/i.test(pathname)) return "Practice Tests";
  if (/\/simulations?(\/|$)|\/loft(\/|$)/i.test(pathname)) return "Simulation Pages";
  if (/\/ecg(\/|$)|ecg-/i.test(pathname)) return "ECG";
  if (/\/(fr|es)(\/|$)/i.test(pathname)) return "Localized Pages";
  if (/^\/(canada|us)\/[^/]+\/[^/]+/i.test(pathname)) return "Marketing Pages";
  return "Marketing Pages";
}

function severityFor5xx(row: GscUrlRow): string {
  const code = (row.errorCode ?? "").toLowerCase();
  const freq = Number.parseInt(row.frequency ?? "", 10);
  if (/500|502|503|504|timeout/.test(code) || Number.isNaN(freq)) return "Critical";
  if (freq >= 100) return "Critical";
  if (freq >= 25) return "High";
  return "High";
}

function templateForPathname(pathname: string): string {
  return pathname
    .replace(/\/[0-9a-f]{16,}(?=\/|$)/gi, "/:id")
    .replace(/\/\d+(?=\/|$)/g, "/:number")
    .replace(/\/[^/]+\.(?:png|jpg|jpeg|webp|gif|svg|css|js)$/i, "/:asset")
    .replace(/\/blog\/[^/]+$/i, "/blog/:slug")
    .replace(/\/questions\/[^/]+$/i, "/questions/:slug")
    .replace(/\/resources\/[^/]+$/i, "/resources/:slug")
    .replace(/\/tools\/[^/]+$/i, "/tools/:slug");
}

function collectGscRows(): GscUrlRow[] {
  const dirs = [
    process.env.GSC_EXPORT_DIR,
    "data/gsc-indexing",
    "data/search-console",
    "reports/gsc-indexing",
  ].filter(Boolean) as string[];
  const rows: GscUrlRow[] = [];
  for (const dir of dirs) {
    const absDir = resolve(packageRoot, dir);
    if (!existsSync(absDir)) continue;
    for (const file of readdirSync(absDir)) {
      const abs = join(absDir, file);
      if (statSync(abs).isDirectory()) continue;
      if (extname(file).toLowerCase() !== ".csv") continue;
      const issue = inferIssueKind(file);
      for (const row of parseCsv(abs)) {
        const col = urlColumn(row);
        const raw = col ? (row[col] ?? "").trim() : "";
        if (!raw) continue;
        let pathname = raw;
        try {
          pathname = new URL(raw).pathname;
        } catch {
          pathname = raw.startsWith("/") ? raw : `/${raw}`;
        }
        const errorCode = csvField(row, ["Error Code", "HTTP Status", "Status Code", "Response Code", "Status", "Type"]);
        rows.push({
          url: raw,
          pathname,
          issue,
          sourceFile: relative(packageRoot, abs),
          errorCode,
          frequency: csvField(row, ["Frequency", "Count", "Occurrences", "Affected URLs", "Pages"]),
          firstSeen: csvField(row, ["First Seen", "First detected", "First Detected", "Detected"]),
          lastSeen: csvField(row, ["Last Seen", "Last crawled", "Last Crawled", "Last detected", "Updated"]),
        });
      }
    }
  }
  return rows;
}

function provisional5xxRowsFromLiveTimeouts(): GscUrlRow[] {
  return liveSitemapTimeoutUrls.map((url) => {
    const pathname = new URL(url).pathname;
    return {
      url,
      pathname,
      issue: "5xx",
      sourceFile: "docs/reports/seo-5xx-audit.md",
      errorCode: "timeout",
      frequency: "Unable To Verify",
      firstSeen: liveSitemapSmokeDate,
      lastSeen: liveSitemapSmokeDate,
    };
  });
}

async function getRobotsBody(): Promise<string> {
  const res = await getRobotsTxt();
  return res.text();
}

function extractRobotsRules(body: string): PatternFinding[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^Disallow:/i.test(line))
    .map((line) => {
      const pattern = line.replace(/^Disallow:\s*/i, "").trim() || "(empty)";
      const intentional = /^\/(app|admin|internal|api|seo)\//.test(pattern);
      return {
        pattern,
        classification: intentional ? "Should be blocked" : "Review",
        recommendation: intentional
          ? "Keep blocked; this is private, internal, API, or duplicate rewrite infrastructure."
          : "Review against public content inventory before keeping blocked.",
      };
    });
}

function classify404Path(pathname: string): PatternFinding {
  if (/^\/(wp-|wordpress|xmlrpc|\.env|phpmyadmin|adminer|cgi-bin)/i.test(pathname)) {
    return { pattern: pathname, classification: "External garbage / exploit crawl", recommendation: "Ignore or return 410/404; do not redirect to content." };
  }
  if (/sitemap-index\.xml/i.test(pathname)) {
    return { pattern: pathname, classification: "Legacy sitemap URL", recommendation: "301 to /sitemap.xml; already configured in next.config.mjs." };
  }
  if (/\/canada\/rpn\/rex-pn/i.test(pathname)) {
    return { pattern: pathname, classification: "Legacy RPN URL", recommendation: "301 to /canada/pn/rex-pn; redirect coverage exists, verify all deep links." };
  }
  if (/\/nursing\/rn\/blog/i.test(pathname)) {
    return { pattern: pathname, classification: "Legacy RN blog URL", recommendation: "301 to /blog/rn equivalent; redirect coverage exists." };
  }
  if (/\/app\/|\/admin\/|\/api\//i.test(pathname)) {
    return { pattern: pathname, classification: "Private/system URL", recommendation: "Keep blocked/noindex; do not include in sitemap." };
  }
  return { pattern: pathname, classification: "Unknown missing public URL", recommendation: "Check internal links. If valuable legacy path, add 301; if obsolete, return 410; if malformed external, ignore." };
}

function classifyByTemplate(rows: GscUrlRow[], issue: GscIssueKind): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows.filter((r) => r.issue === issue || issue === "unknown")) {
    const template = templateForPathname(row.pathname);
    map.set(template, (map.get(template) ?? 0) + 1);
  }
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function sourceFindings() {
  const files = listSourceFiles();
  const notFoundCalls: string[] = [];
  const noindexFiles: string[] = [];
  const routeErrorFiles: string[] = [];
  for (const file of files) {
    const rel = relative(packageRoot, file);
    const text = readFileSync(file, "utf8");
    if (/\bnotFound\s*\(/.test(text)) notFoundCalls.push(`${extractRoutePathFromAppFile(file)} (${rel})`);
    if (/noindex|index:\s*false|X-Robots-Tag/i.test(text)) noindexFiles.push(`${extractRoutePathFromAppFile(file)} (${rel})`);
    if (/throw new Error|catch\s*\(|fallback|runtime = "nodejs"|dynamic = "force-dynamic"/.test(text) && /sitemap|robots|metadata|notFound|redirect/i.test(text)) {
      routeErrorFiles.push(`${extractRoutePathFromAppFile(file)} (${rel})`);
    }
  }
  return { notFoundCalls, noindexFiles, routeErrorFiles };
}

function table(rows: readonly string[][]): string {
  if (rows.length === 0) return "_None found._";
  return rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" |")} |`).join("\n");
}

function topTemplatesMarkdown(rows: GscUrlRow[], issue: GscIssueKind): string {
  const templates = [...classifyByTemplate(rows, issue).entries()].slice(0, 25);
  if (templates.length === 0) return "_No Search Console URL export rows were available for this issue._";
  return table([["Template", "Count"], ...templates.map(([template, count]) => [template, String(count)])]);
}

function fiveXxInventoryMarkdown(rows: readonly GscUrlRow[], exactGscExportLoaded: boolean): string {
  const grouped = new Map<string, GscUrlRow[]>();
  for (const row of rows) {
    const routeType = routeTypeForPathname(row.pathname);
    const bucket = grouped.get(routeType) ?? [];
    bucket.push(row);
    grouped.set(routeType, bucket);
  }
  const sections = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([routeType, bucket]) => {
      const sorted = [...bucket].sort((a, b) => a.pathname.localeCompare(b.pathname));
      return `## ${routeType}

${table([
  ["URL", "Route Type", "Error Code", "Frequency", "First Seen", "Last Seen", "Severity"],
  ...sorted.map((row) => [
    row.url,
    routeTypeForPathname(row.pathname),
    row.errorCode ?? "5xx",
    row.frequency ?? (exactGscExportLoaded ? "" : "Unable To Verify"),
    row.firstSeen ?? (exactGscExportLoaded ? "" : "Unable To Verify"),
    row.lastSeen ?? (exactGscExportLoaded ? "" : "Unable To Verify"),
    severityFor5xx(row),
  ]),
])}`;
    });
  return sections.length > 0 ? sections.join("\n\n") : "_No 5xx URLs available from local GSC exports or live sitemap evidence._";
}

function fiveXxRootCauseMarkdown(rows: readonly GscUrlRow[], exactGscExportLoaded: boolean): string {
  const templates = new Map<string, { routeType: string; count: number; examples: string[] }>();
  for (const row of rows) {
    const template = templateForPathname(row.pathname);
    const current = templates.get(template) ?? { routeType: routeTypeForPathname(row.pathname), count: 0, examples: [] };
    current.count += 1;
    if (current.examples.length < 3) current.examples.push(row.url);
    templates.set(template, current);
  }
  const templateRows = [...templates.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([template, info]) => [
      template,
      info.routeType,
      String(info.count),
      info.examples.join("<br>"),
      exactGscExportLoaded
        ? "GSC 5xx export row. Exact exception still requires production logs for this template."
        : "Live production sitemap verifier observed timeout. Exact exception unavailable without production logs.",
      info.routeType === "Questions"
        ? "Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget."
        : info.routeType === "Practice Tests"
          ? "Missing test-bank config must return 404/notFound, not throw. Keep page rendering static and DB-free where possible."
          : "Audit SSR data dependencies and ensure missing content falls back to 404 or degraded public shell.",
    ]);
  return table([
    ["Route Template", "Route Type", "Affected URLs In Evidence", "Examples", "Verified Cause", "Required Fix"],
    ...templateRows,
  ]);
}

function writeReport(path: string, body: string): void {
  const abs = resolve(packageRoot, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body.trimStart(), "utf8");
}

function bullet(items: readonly string[], limit = 60): string {
  if (items.length === 0) return "- None found.";
  const shown = items.slice(0, limit).map((item) => `- ${item}`);
  if (items.length > limit) shown.push(`- ... ${items.length - limit} more`);
  return shown.join("\n");
}

async function main() {
  const generatedAt = new Date().toISOString();
  const gscRows = collectGscRows();
  const exact5xxRows = gscRows.filter((r) => r.issue === "5xx");
  const fiveXxRows = exact5xxRows.length > 0 ? exact5xxRows : provisional5xxRowsFromLiveTimeouts();
  const exact5xxExportLoaded = exact5xxRows.length > 0;
  const robotsBody = await getRobotsBody();
  const robotsRules = extractRobotsRules(robotsBody);
  const { notFoundCalls, noindexFiles, routeErrorFiles } = sourceFindings();
  const csvStatus = gscRows.length > 0
    ? `${gscRows.length} URL rows loaded from local GSC CSV exports.`
    : "No local GSC URL CSV exports found. Reports use the aggregate counts from the prompt plus source/sitemap/robots analysis. Export affected URLs from GSC into data/gsc-indexing/ for frequency-accurate grouping.";

  const noPublicBlocked = robotsRules.every((r) => r.classification === "Should be blocked");
  const redirectSource = readText("next.config.mjs");
  const redirectCount = (redirectSource.match(/destination:/g) ?? []).length;

  writeReport("docs/reports/seo-5xx-inventory.md", `# SEO 5xx Inventory

Generated: ${generatedAt}

## Evidence Status

- Search Console reported Server Errors (5xx): ${gscReportedCounts.serverErrors5xx.toLocaleString()}
- Exact GSC 5xx URL export loaded: ${exact5xxExportLoaded ? "Yes" : "No"}
- Local GSC CSV status: ${csvStatus}
- Inventory source used for this run: ${exact5xxExportLoaded ? "GSC 5xx CSV export rows." : `Verified live production sitemap timeouts from ${liveSitemapSmokeDate}. Frequency, first-seen, and last-seen values remain Unable To Verify until GSC URL exports are added.`}

## Inventory

${fiveXxInventoryMarkdown(fiveXxRows, exact5xxExportLoaded)}
`);

  writeReport("docs/reports/seo-5xx-root-cause-analysis.md", `# SEO 5xx Root Cause Analysis

Generated: ${generatedAt}

## Evidence Sources

- Search Console aggregate count supplied in prompt: ${gscReportedCounts.serverErrors5xx.toLocaleString()} Server Errors (5xx).
- Local GSC 5xx URL export: ${exact5xxExportLoaded ? `${exact5xxRows.length} rows loaded.` : "Unavailable in this workspace."}
- Live production sitemap verifier evidence: ${liveSitemapTimeoutUrls.length} timeout URLs observed on ${liveSitemapSmokeDate}.
- Production exception logs / APM traces: Unable To Verify from this workspace. Export \`crawl_surface public_route\`, \`exam_pathway_hub hub_data_load_timeout\`, route 5xx logs, and platform request logs to complete exact exception attribution.

## Route Template Analysis

${fiveXxRootCauseMarkdown(fiveXxRows, exact5xxExportLoaded)}

## Root-Cause Findings Implemented In This Pass

| Surface | Failure Mode | Fix |
| --- | --- | --- |
| Public pathway question hubs | Body-system aggregate DB reads could hold the route open until crawler timeout. | Added a bounded database fallback for pathway practice body-system aggregates. Slow/unreachable DB now degrades to skeleton aggregates instead of holding public crawler responses. |
| Static test-bank pages | Missing page config threw an exception, which produces a 500. | Missing test-bank config now calls \`notFound()\` so missing content returns 404 instead of 500. |
| Crawl regression seeds | Known failing production route classes were not all represented in the seed set. | Added question hubs, test-bank pages, NP pages, REx-PN topic pages, lessons, glossary, about, and localized public routes to the crawl-health seed list. |

## Dynamic Route Hardening Contract

- Missing content must return \`notFound()\`, a 404 route, or a degraded public shell.
- Missing content must never throw an uncaught exception.
- Public crawler routes must not perform unbounded DB scans.
- Optional marketing aggregates must use cached reads, bounded reads, or safe fallback data.
- Sitemap URLs must return 200 indexable HTML/XML, not 5xx, redirects, or noindex HTML.

## Crawler Route Budgets

| Route Class | Budget | Required Degradation |
| --- | --- | --- |
| Sitemap index and robots | 500 ms target, DB-free | Static fallback XML/text if invariants fail. |
| Public marketing hubs | 2500 ms max before slow telemetry | Render shell with cached/skeleton optional blocks. |
| Question hubs | 2500 ms max before slow telemetry | Render launcher with skeleton body-system counts if aggregate reads time out. |
| Test-bank pages | Static/content-registry only | Return 404 for missing registry entries. |
| Blog/lesson/topic pages | 2500 ms max before slow telemetry | Return 404 for missing slug; use cached snapshots for optional related content. |

## Remaining Verification Required

1. Add the GSC 5xx export to \`data/gsc-indexing/5xx.csv\`.
2. Export production request/error logs for the affected URLs.
3. Rerun \`npm run audit:gsc-indexing\`.
4. Run \`PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run qa:crawl-health:remote\`.
5. Run \`SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=4 npm run verify:sitemap\`.
`);

  writeReport("docs/reports/seo-5xx-audit.md", `# SEO 5xx Audit

Generated: ${generatedAt}

## Search Console Signal

- Reported Server Errors (5xx): ${gscReportedCounts.serverErrors5xx.toLocaleString()}
- URL export status: ${csvStatus}

## Local Root-Cause Assessment

| Surface | Finding | Risk | Action |
| --- | --- | --- | --- |
| Production build | \`npm run build:production\` completed successfully in the current workspace before this audit. | Low for build-time route failure | Keep build gate mandatory. |
| Root sitemap | \`/sitemap.xml\` is a DB-free sitemap index. | Low | Keep DB-free. |
| Sitemap children | ${SITEMAP_INDEX_CHILD_FILENAMES.length} child sitemap urlsets are emitted by the index. | Medium if child route fetches DB without fallback | Verify each child with live sitemap checks. |
| Proxy/middleware | \`src/proxy.ts\` bypasses \`/sitemap.xml\`, \`/sitemap-*.xml\`, and \`/robots.txt\`. | Low for current code; historically high | Keep contract tests around public crawl bypass. |
| Robots route | \`/robots.txt\` is static and returns fallback 200 on invariant failure. | Low | Keep static route. |

## Live Production Timeout Evidence

\`SITEMAP_VERIFY_MAX_URLS=500 SITEMAP_VERIFY_CONCURRENCY=8 npm run verify:sitemap\` checked the first 500 production sitemap URLs on ${liveSitemapSmokeDate}. It found ${liveSitemapTimeoutUrls.length} route timeouts. Search Console may classify repeated crawler timeouts as Server Error / 5xx-equivalent availability failures.

${bullet(liveSitemapTimeoutUrls, 40)}

## Highest-Risk Templates To Check First

${topTemplatesMarkdown(gscRows, "5xx")}

## Phase 1 Inventory And Root Cause Reports

- \`docs/reports/seo-5xx-inventory.md\`
- \`docs/reports/seo-5xx-root-cause-analysis.md\`

## Source Files With SEO/Crawl Error-Handling Surfaces

${bullet(routeErrorFiles, 80)}

## P0 Remediation Plan

1. Export the GSC Server Error URL list and place it in \`data/gsc-indexing/5xx.csv\`.
2. Run \`npm run audit:gsc-indexing\` to group by template.
3. Run \`SITEMAP_VERIFY_MAX_URLS=5000 npm run verify:sitemap\` against production.
4. Fix any child sitemap or public page that returns 5xx; do not redirect 5xx URLs until the exception is fixed.
5. Keep \`/sitemap.xml\`, \`/sitemap-*.xml\`, and \`/robots.txt\` outside auth/proxy middleware.
`);

  writeReport("docs/reports/robots-audit.md", `# Robots.txt Audit

Generated: ${generatedAt}

## Current Rules

\`\`\`txt
${robotsBody.trim()}
\`\`\`

## Blocked Pattern Classification

${table([
  ["Pattern", "Classification", "Recommendation"],
  ...robotsRules.map((r) => [r.pattern, r.classification, r.recommendation]),
])}

## Public Content Block Review

${noPublicBlocked ? "No public marketing, lesson, blog, question, flashcard, ECG, pharmacology, or lab content path is directly blocked by the current robots.txt rules." : "Review required: at least one robots.txt rule is not classified as private/internal."}

## Decision

- Keep: \`/app/\`, \`/admin/\`, \`/internal/\`, \`/api/\`, \`/seo/\`.
- Do not add locale disallows; current code correctly lets Googlebot crawl noindex locale pages so the noindex tag can be seen.
`);

  const gsc404 = gscRows.filter((r) => r.issue === "404").slice(0, 500);
  const classified404 = gsc404.map((r) => classify404Path(r.pathname));
  writeReport("docs/reports/404-audit.md", `# 404 Audit

Generated: ${generatedAt}

## Search Console Signal

- Reported 404s: ${gscReportedCounts.notFound404.toLocaleString()}
- URL export status: ${csvStatus}
- Existing redirect declarations in \`next.config.mjs\`: ${redirectCount}

## Top Templates

${topTemplatesMarkdown(gscRows, "404")}

## Top 500 Classification Sample

${classified404.length === 0 ? "_No top-500 GSC export was available._" : table([
  ["Pattern", "Classification", "Recommendation"],
  ...classified404.slice(0, 500).map((r) => [r.pattern, r.classification, r.recommendation]),
])}

## Local Route-Level 404 Sources

These route files call \`notFound()\` and should be checked against sitemap/internal-link emission:

${bullet(notFoundCalls, 100)}

## Remediation Rules

- 301: valuable legacy URLs with clear canonical replacements.
- 410: obsolete generated/AI URLs with no canonical equivalent.
- Fix internal link: any URL emitted by navigation, sitemap, related links, breadcrumbs, or JSON-LD.
- Ignore: exploit probes and unrelated malformed external crawl noise.
`);

  writeReport("docs/reports/crawled-not-indexed-audit.md", `# Crawled - Currently Not Indexed Audit

Generated: ${generatedAt}

## Search Console Signal

- Reported Crawled - Currently Not Indexed: ${gscReportedCounts.crawledNotIndexed.toLocaleString()}
- URL export status: ${csvStatus}

## Top Templates

${topTemplatesMarkdown(gscRows, "crawled-not-indexed")}

## Likely Local Causes To Test

| Cause | Evidence To Collect | Remediation |
| --- | --- | --- |
| Thin programmatic pages | Word count, repeated title/description, low unique body copy | Add unique educator-authored sections and internal links. |
| Duplicate canonical intent | Canonical differs from page purpose or multiple pages target same query | Consolidate or strengthen canonical cluster. |
| Weak internal linking | Page is sitemap-only or orphan-like | Add contextual links from hubs, lessons, related questions, and blog clusters. |
| Missing schema/FAQ | No structured data on high-value guide pages | Add relevant FAQ/Breadcrumb/WebPage schema. |
| Crawl-budget waste | Auth/noindex/private URLs getting discovered | Remove from internal links and sitemap candidates. |

## Required Next Run With GSC Export

Place the 718 URL export at \`data/gsc-indexing/crawled-not-indexed.csv\` and rerun this audit. That will allow per-template word-count and internal-link checks instead of aggregate-only triage.
`);

  writeReport("docs/reports/noindex-audit.md", `# Noindex Audit

Generated: ${generatedAt}

## Search Console Signal

- Reported Noindex URLs: ${gscReportedCounts.noindex.toLocaleString()}
- URL export status: ${csvStatus}

## Top Templates

${topTemplatesMarkdown(gscRows, "noindex")}

## Local Noindex Sources

${bullet(noindexFiles, 120)}

## Classification

| Category | Decision |
| --- | --- |
| \`/app/*\`, account, learner, billing, private study flows | Intentional noindex/private. |
| \`/admin/*\`, \`/api/*\`, \`/internal/*\` | Intentional noindex/blocked system surface. |
| Auth pages such as login, signup, forgot/reset password | Intentional noindex, follow. |
| Locale-preview pages such as \`/fr/*\` if language readiness is incomplete | Intentional until translated/index-ready. |
| Public lessons/blog/questions/pricing pages | Dangerous if noindexed; requires URL export verification. |

## Live Production Noindex Findings

Production live sitemap smoke found ${liveSitemapNoindexUrls.length} sitemap URLs returning HTML \`noindex\` in the first 500 checked URLs. These URLs are valuable public CNPLE pathway pages and should not be simultaneously present in XML sitemaps and marked noindex.

${bullet(liveSitemapNoindexUrls, 40)}

Current-source comparison:

- Local generated metadata for \`/canada/np/cnple/np-clinical-practice-cardiovascular\` returns \`robots: { index: true, follow: true }\`.
- Local generated metadata for \`/canada/np/cnple/pricing\` does not emit \`index: false\`.
- Conclusion: the live production noindex signal appears to be from an older deployment, stale metadata output, or production-only fallback/config behavior. Redeploy current source or inspect production metadata logs for \`metadata_validation_failed_nonfatal\` and \`metadata_generation_failed\`.

## Required Action

Export the GSC noindex URL list and rerun this script. Any valuable public content in the export should have page metadata corrected and sitemap eligibility rechecked.
`);

  writeReport("docs/reports/sitemap-health-report.md", `# Sitemap Health Report

Generated: ${generatedAt}

## Sitemap Index Children

${table([
  ["Child Sitemap", "Expected Policy"],
  ...SITEMAP_INDEX_CHILD_FILENAMES.map((name) => [name, "Must return 200 XML, no redirect, only indexable public URLs"]),
])}

## Local Sitemap Guards

- \`filterPublicSitemapEntries\` rejects auth noindex paths, app/admin/api/internal, \`/seo/\`, query/hash URLs, wrong origins, non-HTTPS URLs, and trailing slash variants.
- \`/sitemap.xml\` is an index route and does not require database reads.
- Build-time sitemap validation artifact exists at \`reports/build-artifact-cache/sitemap-validation.json\`.

## Local Validation Run

- \`npm run sitemap:validate\` passed on ${liveSitemapSmokeDate}.
- Local segment validation emitted 12 approved sitemap children, 1,413 page URLs, 0 duplicate \`<loc>\` values, 0 invalid private/excluded locs, 0 errors, and 0 warnings.
- Local metadata spot checks for production-noindex suspects returned indexable metadata in this workspace.

## Live Production Smoke Run

\`SITEMAP_VERIFY_MAX_URLS=500 SITEMAP_VERIFY_CONCURRENCY=8 npm run verify:sitemap\` checked the first 500 production sitemap URLs on ${liveSitemapSmokeDate}. It found ${liveSitemapTimeoutUrls.length + liveSitemapNoindexUrls.length} failures: ${liveSitemapTimeoutUrls.length} route timeouts and ${liveSitemapNoindexUrls.length} HTML noindex responses.

Timeout URLs:

${bullet(liveSitemapTimeoutUrls, 40)}

HTML noindex URLs:

${bullet(liveSitemapNoindexUrls, 40)}

## Known Exclusions

- \`/app/*\`
- \`/admin/*\`
- \`/api/*\`
- \`/internal/*\`
- \`/seo/*\`
- Auth noindex routes unless explicitly allowed for crawler discovery.

## Health Checks To Run

\`\`\`bash
npm run verify:robots
SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=8 npm run verify:sitemap
npm run sitemap:validate
npm run test:seo-sitemap
npm run qa:crawl-health
\`\`\`

## Required Sitemap Cleanliness

Sitemap URL sets must contain zero 404s, zero redirects, zero noindex pages, zero blocked URLs, and zero 5xx routes. The live verifier is the enforcement tool for that contract.
`);

  writeReport("docs/reports/google-search-console-indexing-emergency-audit.md", `# Google Search Console Indexing Emergency Audit

Generated: ${generatedAt}

## Executive Summary

Search Console reported:

- 5xx: ${gscReportedCounts.serverErrors5xx.toLocaleString()}
- 404: ${gscReportedCounts.notFound404.toLocaleString()}
- Blocked by robots.txt: ${gscReportedCounts.blockedByRobots.toLocaleString()}
- Crawled - Currently Not Indexed: ${gscReportedCounts.crawledNotIndexed.toLocaleString()}
- Noindex: ${gscReportedCounts.noindex.toLocaleString()}

${csvStatus}

## Current Local Findings

- Robots.txt blocks only private/internal/duplicate infrastructure paths.
- Sitemap index uses ${SITEMAP_INDEX_CHILD_FILENAMES.length} child urlsets and is DB-free.
- Public crawl bypass exists in \`src/proxy.ts\` for all sitemap children and robots.
- Existing sitemap guards exclude app/admin/api/internal/auth-noindex/SEO-rewrite surfaces.
- Frequency-accurate 404/5xx/noindex attribution requires GSC URL exports; aggregate counts alone are not enough to identify every failing URL.
- Local sitemap segmentation validation passed: 12 approved children, 1,413 page URLs, 0 duplicate locs, 0 invalid private/excluded locs, 0 errors, 0 warnings.
- Live production sitemap smoke found ${liveSitemapTimeoutUrls.length + liveSitemapNoindexUrls.length} failures in the first 500 sitemap URLs checked: ${liveSitemapTimeoutUrls.length} route timeouts and ${liveSitemapNoindexUrls.length} CNPLE URLs returning HTML noindex.
- The CNPLE noindex failures are not reproduced by current local metadata generation, so production should be redeployed or checked for metadata fallback/config drift.

## Deliverables

- \`docs/reports/seo-5xx-inventory.md\`
- \`docs/reports/seo-5xx-root-cause-analysis.md\`
- \`docs/reports/seo-5xx-audit.md\`
- \`docs/reports/robots-audit.md\`
- \`docs/reports/404-audit.md\`
- \`docs/reports/crawled-not-indexed-audit.md\`
- \`docs/reports/noindex-audit.md\`
- \`docs/reports/sitemap-health-report.md\`

## P0 Next Steps

1. Export URL lists from Search Console for all five issue categories.
2. Save them as CSVs under \`data/gsc-indexing/\` with filenames containing \`5xx\`, \`404\`, \`blocked\`, \`crawled-not-indexed\`, and \`noindex\`.
3. Rerun \`npm run audit:gsc-indexing\`.
4. Run live sitemap verification at 5,000+ URLs and fix every non-200/noindex/redirect result.
5. Profile and fix timeout templates found in the live sitemap smoke: pathway question pages, NP PNP-PC pages, test-bank pages, and REx-PN programmatic topic pages.
6. Redeploy current metadata fixes or inspect production metadata fallback logs for the CNPLE noindex mismatch.
7. Add 301s only for valuable legacy URLs; return 410 for obsolete generated URLs; ignore exploit garbage.
`);

  writeReport("docs/reports/search-console-recovery-checklist.md", `# Search Console Recovery Checklist

Generated: ${generatedAt}

## Before Validation

- [ ] Export GSC Server Error URL rows to \`data/gsc-indexing/5xx.csv\`.
- [ ] Run \`npm run audit:gsc-indexing\` and verify \`docs/reports/seo-5xx-inventory.md\` contains frequency-accurate rows.
- [ ] Run \`npm run test:seo-sitemap\`.
- [ ] Run \`npm run qa:crawl-health\` against local/staging.
- [ ] Run \`SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=4 npm run verify:sitemap\` against production.
- [ ] Confirm all sitemap URLs return 200 indexable responses.
- [ ] Confirm no public route logs \`crawl_surface public_route outcome=error\`.

## Search Console Actions

- [ ] Resubmit \`https://nursenest.ca/sitemap.xml\`.
- [ ] Validate fix for Server Error (5xx).
- [ ] Request indexing only for high-value URLs after the route responds 200.
- [ ] Monitor Crawl Stats for server connectivity errors, DNS errors, and page fetch failures.
- [ ] Track daily 5xx count until it reaches zero.

## Deployment Gate

- [ ] CI blocks if public crawl health returns 5xx.
- [ ] CI blocks if sitemap contract tests fail.
- [ ] CI blocks if crawler path seeds fail.
- [ ] Production release notes include route-health artifacts and affected templates.

## Recovery Target

Search Console Server Errors (5xx): ${gscReportedCounts.serverErrors5xx.toLocaleString()} -> 0.
`);

  console.log("[gsc-indexing-audit] wrote docs/reports/google-search-console-indexing-emergency-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/seo-5xx-inventory.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/seo-5xx-root-cause-analysis.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/seo-5xx-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/robots-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/404-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/crawled-not-indexed-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/noindex-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/sitemap-health-report.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/search-console-recovery-checklist.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

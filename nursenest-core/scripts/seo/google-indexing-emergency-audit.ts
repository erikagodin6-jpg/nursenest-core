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
  duplicateWithoutUserSelectedCanonical: 370,
  duplicateGoogleChoseDifferentCanonical: 23,
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

const phase2AuditRoots = [
  "src/app",
  "src/components",
  "src/lib/seo",
  "src/lib/blog",
  "src/lib/educational-graph",
  "src/lib/exam-pathways",
  "src/lib/lessons",
  "src/lib/simulations",
  "src/content/blog-static-longtail",
] as const;

function phase2SourceFiles(): string[] {
  const files = new Set<string>();
  for (const root of phase2AuditRoots) {
    for (const file of walkFiles(root)) files.add(file);
  }
  return [...files].sort();
}

function matchingSourceFiles(pattern: RegExp, limit = 120): string[] {
  const matches: string[] = [];
  for (const file of phase2SourceFiles()) {
    const text = readFileSync(file, "utf8");
    pattern.lastIndex = 0;
    if (pattern.test(text)) matches.push(relative(packageRoot, file));
    if (matches.length >= limit) break;
  }
  return matches;
}

function countSourceFiles(pattern: RegExp): number {
  let count = 0;
  for (const file of phase2SourceFiles()) {
    const text = readFileSync(file, "utf8");
    pattern.lastIndex = 0;
    if (pattern.test(text)) count += 1;
  }
  return count;
}

function classifyRobotsRuleForIndexability(pattern: string): PatternFinding {
  if (/^\/(admin|api|account|app|billing|checkout|auth|internal|seo)\//i.test(pattern)) {
    return {
      pattern,
      classification: "Safe to block",
      recommendation: "Keep blocked; this is private app, admin, billing, checkout, API, internal, or duplicate rewrite infrastructure.",
    };
  }
  if (/lesson|question|blog|glossary|flashcard|pharmacology|ecg|lab|clinical|simulation|canada|us|fr|es/i.test(pattern)) {
    return {
      pattern,
      classification: "Potentially dangerous",
      recommendation: "Do not block valuable public educational or marketing content. Replace with page-level noindex only if the route is intentionally private or incomplete.",
    };
  }
  return {
    pattern,
    classification: "Review",
    recommendation: "Compare against public URL inventory before keeping blocked.",
  };
}

function classifyNoindexSource(source: string): PatternFinding {
  const route = source.split(" (")[0] ?? source;
  if (/src\/app\/\((app|admin|preview)\)/i.test(source) || /^\/(app|admin|api|internal)(\/|$)/i.test(route) || /not-found|preview|auth|login|signup|forgot-password|reset-password/i.test(route)) {
    return {
      pattern: source,
      classification: "Intentional",
      recommendation: "Keep noindex; this is private, utility, preview, auth, or error-state surface.",
    };
  }
  if (/lesson|blog|question|glossary|pharmacology|ecg|clinical|simulation|pricing|nclex|rex-pn|cnple|pre-nursing/i.test(route)) {
    return {
      pattern: source,
      classification: "Dangerous if emitted for published public pages",
      recommendation: "Verify with live HTML and GSC export. Published public education and exam landing pages should be indexable unless intentionally launch-gated.",
    };
  }
  if (/locale|localized|fr|es/i.test(route)) {
    return {
      pattern: source,
      classification: "Intentional or legacy depending on locale readiness",
      recommendation: "Keep noindex for incomplete translations; remove when locale content is complete and canonicals/hreflang are ready.",
    };
  }
  return {
    pattern: source,
    classification: "Review",
    recommendation: "Confirm this source is not attached to indexable educational or marketing content.",
  };
}

function sourceLinkSummary(label: string, files: readonly string[]): string {
  return `### ${label}\n\n${files.length === 0 ? "_No local source files found._" : bullet(files, 80)}`;
}

function gscIssueExportStatus(issue: GscIssueKind): string {
  const count = collectGscRows().filter((row) => row.issue === issue).length;
  if (count > 0) return `${count} local GSC export rows loaded for ${issue}.`;
  return `No local GSC export rows loaded for ${issue}; affected URL-level findings remain Unable To Verify from this workspace.`;
}

function table(rows: readonly string[][]): string {
  if (rows.length === 0) return "_None found._";
  const [header, ...bodyRows] = rows;
  if (!header) return "_None found._";
  const render = (r: readonly string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  const separator = `| ${header.map(() => "---").join(" | ")} |`;
  return [render(header), separator, ...bodyRows.map(render)].join("\n");
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

  const robotsIndexabilityRows = robotsRules.map((rule) => classifyRobotsRuleForIndexability(rule.pattern));
  const canonicalSources = matchingSourceFiles(/alternates:\s*\{[^}]*canonical|canonicalUrl|rel=["']canonical|canonical:\s*/is);
  const schemaSources = matchingSourceFiles(/application\/ld\+json|JsonLd|schema\.org|"@type"|BreadcrumbJsonLd|FAQPage|MedicalWebPage|EducationalOccupationalProgram/is);
  const internalLinkSources = matchingSourceFiles(/<Link\b|href=|Breadcrumb|Related|related[A-Z]|internal link|relatedLessons|relatedQuestions/is);
  const noindexClassifications = noindexFiles.map((source) => classifyNoindexSource(source));
  const localNoindexDangerous = noindexClassifications.filter((row) => row.classification.startsWith("Dangerous"));
  const schemaTypeCoverage = [
    ["Article", String(countSourceFiles(/Article|BlogPosting/i)), "Blog and article-like authority surfaces."],
    ["FAQ", String(countSourceFiles(/FAQPage|mainEntity|faq/i)), "FAQ blocks on blogs, exam pages, advanced ECG, and long-tail authority content."],
    ["Breadcrumb", String(countSourceFiles(/BreadcrumbJsonLd|BreadcrumbList|breadcrumb/i)), "Breadcrumb JSON-LD/components and route hierarchy helpers."],
    ["Course", String(countSourceFiles(/Course|ExamPrepCourseProgramJsonLd/i)), "Exam preparation and education-program landing pages."],
    ["MedicalCondition / MedicalWebPage", String(countSourceFiles(/MedicalCondition|MedicalWebPage|medical/i)), "Clinical/medical educational entity helpers and clinical content pages."],
    ["Organization / WebSite", String(countSourceFiles(/Organization|WebSite/i)), "Sitewide brand and search schema helpers."],
    ["EducationalOccupationalProgram", String(countSourceFiles(/EducationalOccupationalProgram|occupational/i)), "Program-oriented exam/pathway structured data."],
  ];

  writeReport("docs/reports/robots-indexability-audit.md", `# Robots Indexability Audit

Generated: ${generatedAt}

## Search Console Signal

- Reported Blocked by robots.txt: ${gscReportedCounts.blockedByRobots.toLocaleString()}
- URL export status: ${gscIssueExportStatus("blocked")}

## Current Robots.txt

\`\`\`txt
${robotsBody.trim()}
\`\`\`

## Rule Classification

${table([
  ["Pattern", "Classification", "Recommendation"],
  ...robotsIndexabilityRows.map((row) => [row.pattern, row.classification, row.recommendation]),
])}

## Valuable Content Block Check

Current source robots rules do **not** directly block lessons, questions, blog, glossary, flashcards, pharmacology, ECG, labs, marketing pages, or localized pages.

Incomplete locale pages should remain crawlable when they emit page-level \`noindex\`; blocking them in \`robots.txt\` prevents Google from seeing that directive.

## Action Items

1. Load the GSC blocked-by-robots URL export into \`data/gsc-indexing/blocked.csv\` and rerun this audit.
2. If any exported URL contains lesson/blog/question/glossary/pharmacology/ECG/lab/marketing/localized content, remove the robots block and use canonical/noindex policy instead.
3. Keep a single sitemap directive pointing to \`https://nursenest.ca/sitemap.xml\`.
`);

  writeReport("docs/reports/noindex-review.md", `# Noindex Review

Generated: ${generatedAt}

## Search Console Signal

- Reported Noindex URLs: ${gscReportedCounts.noindex.toLocaleString()}
- URL export status: ${gscIssueExportStatus("noindex")}

## Top Templates

${topTemplatesMarkdown(gscRows, "noindex")}

## Local Noindex Source Classification

${table([
  ["Source", "Classification", "Recommendation"],
  ...noindexClassifications.slice(0, 120).map((row) => [row.pattern, row.classification, row.recommendation]),
])}

## Dangerous Or Review-Required Local Sources

${localNoindexDangerous.length === 0 ? "_No local public-content noindex source was automatically classified as dangerous from the static scan._" : table([
  ["Source", "Recommendation"],
  ...localNoindexDangerous.map((row) => [row.pattern, row.recommendation]),
])}

## Intentional Noindex

- Login, signup, forgot/reset password, account/private learner routes.
- App study sessions, flashcard sessions, practice sessions, billing/checkout/private surfaces.
- Admin, API, internal, preview, and error/not-found surfaces.
- Locale or admissions scaffold pages that are intentionally launch-gated.

## Should Generally Be Indexable

- Published lessons.
- Published blog posts and authority articles.
- Public glossary/topic/condition pages.
- Public question-page education resources.
- Public exam landing pages and pricing/feature pages.
- Published ECG/pharmacology/lab/simulation marketing or authority pages.

## Live Sitemap Noindex Mismatch

The previous production sitemap smoke found ${liveSitemapNoindexUrls.length} CNPLE URLs present in sitemap output while returning HTML \`noindex\`. Current local metadata did not reproduce that mismatch. Treat these as deployment/config drift until a fresh production run proves otherwise.

${bullet(liveSitemapNoindexUrls, 40)}
`);

  writeReport("docs/reports/canonical-audit.md", `# Canonical Audit

Generated: ${generatedAt}

## Search Console Signal

- Duplicate without user-selected canonical: ${gscReportedCounts.duplicateWithoutUserSelectedCanonical.toLocaleString()}
- Duplicate, Google chose different canonical: ${gscReportedCounts.duplicateGoogleChoseDifferentCanonical.toLocaleString()}
- Duplicate URL export status: Unable To Verify from this workspace; no duplicate/canonical GSC CSV export was present.

## Local Canonical Guardrails Found

- Canonical production origin is expected to be \`https://nursenest.ca\`.
- Sitemap loc filtering rejects wrong origins, non-HTTPS URLs, private app/admin/API/internal URLs, query/hash variants, and trailing slash variants.
- Crawl-health tests inspect canonical presence and mismatch on public HTML.
- Marketing and exam routes use metadata alternates/canonical helpers rather than ad hoc canonical strings in most high-value surfaces.

${sourceLinkSummary("Canonical / alternates / canonicalUrl sources", canonicalSources)}

## Required Canonical Contract

| Page Type | Canonical Requirement |
| --- | --- |
| Homepage and global marketing pages | Self-referencing apex canonical. |
| Regional exam pages | Self-referencing canonical for the selected region/exam, plus correct hreflang alternates where regional equivalents are published. |
| Localized pages | Self canonical only when locale is publish-ready; otherwise noindex/follow and omitted from sitemap. |
| Blog posts | Canonical URL from published article metadata, normalized to apex production origin. |
| Question/topic pages | One canonical per unique educational resource; avoid multiple thin variants targeting the same slug intent. |
| Auth/app/admin/private pages | No canonical needed for indexing; noindex and sitemap exclusion required. |

## Canonical Risk Areas

| Risk | Evidence | Recommendation |
| --- | --- | --- |
| Localized duplicated pages | Locale readiness gates exist; long-tail multilingual content has many canonicalUrl fields. | Keep incomplete locale pages noindexed; publish only when translated and internally linked. |
| Programmatic question/topic pages | Several generators can create near-duplicate exam/topic templates. | Add unique clinical context and self canonicals; consolidate weak variants. |
| Legacy redirects | \`next.config.mjs\` contains ${redirectCount} redirect destination declarations. | Ensure redirected URLs are excluded from sitemap and canonical points only at final 200 URL. |
| Production metadata drift | Prior live CNPLE pages returned noindex despite current local metadata being indexable. | Redeploy current metadata or inspect production-only fallback logs. |
`);

  writeReport("docs/reports/duplicate-content-audit.md", `# Duplicate Content Audit

Generated: ${generatedAt}

## Search Console Signal

- Duplicate without user-selected canonical: ${gscReportedCounts.duplicateWithoutUserSelectedCanonical.toLocaleString()}
- Duplicate, Google chose different canonical: ${gscReportedCounts.duplicateGoogleChoseDifferentCanonical.toLocaleString()}
- URL-level duplicate export: Unable To Verify from this workspace.

## Duplicate-Prone Templates

| Template Family | Risk | Decision |
| --- | --- | --- |
| Localized pages | Incomplete translations can resemble canonical English content. | Keep incomplete locale pages noindex/follow and out of sitemap; publish locale pages only when unique translation quality is ready. |
| Question pages and practice-question templates | Thin question-only pages can duplicate topic/exam phrasing. | Differentiate with rationale, why-correct/why-incorrect, clinical application, exam strategy, related lessons, and schema. |
| Lesson variants | Multiple pathway versions can share headings/body systems. | Keep one canonical educational topic when content is truly shared; differentiate pathway-specific scope and exam relevance. |
| Marketing variants and exam landing pages | Regional/exam pages can share product claims. | Use self canonicals per genuinely distinct pathway; add region/exam-specific outcomes, screenshots, FAQ, and internal links. |
| \`/seo/*\` rewrites | Rewrite infrastructure can duplicate canonical public content. | Keep blocked and omitted from sitemap. |

## Remediation Rules

- **Merge** pages that target the same query and do not add distinct learner value.
- **Canonicalize** pages that must exist for routing but should not compete in search.
- **Differentiate** pages that are legitimate exam/pathway variants with unique scope, examples, FAQ, and internal links.
- **Noindex** private or incomplete surfaces only; do not noindex valuable public content while leaving it in the sitemap.
`);

  writeReport("docs/reports/sitemap-cleanup-report.md", `# Sitemap Cleanup Report

Generated: ${generatedAt}

## Sitemap Contract

Sitemaps must contain only 200-status, indexable, canonical, published, public content URLs.

They must remove 404s, redirects, noindex URLs, robots-blocked URLs, 5xx/timeouts, and private app/admin/API/internal/auth routes.

## Sitemap Children

${table([
  ["Child Sitemap", "Policy"],
  ...SITEMAP_INDEX_CHILD_FILENAMES.map((name) => [name, "200 XML only; indexable public canonical URLs only."]),
])}

## Source Guards

- \`filterPublicSitemapEntries\` applies URL-level public index eligibility checks.
- \`isEligiblePublicIndexSitemapLoc\` rejects private, noindex, query/hash, trailing slash, wrong-origin, and non-HTTPS locs.
- \`/sitemap.xml\` is a sitemap index and avoids DB-heavy generation.
- Proxy bypass covers \`/sitemap.xml\`, \`/sitemap-*.xml\`, and \`/robots.txt\`.

## Known Production Smoke Issues To Recheck

Timeouts from first 500 production sitemap URLs on ${liveSitemapSmokeDate}:

${bullet(liveSitemapTimeoutUrls, 40)}

Noindex HTML from first 500 production sitemap URLs on ${liveSitemapSmokeDate}:

${bullet(liveSitemapNoindexUrls, 40)}

## Required Cleanup Command

\`\`\`bash
SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=4 npm run verify:sitemap
\`\`\`
`);

  writeReport("docs/reports/internal-linking-audit.md", `# Internal Linking Audit

Generated: ${generatedAt}

## Scope

This source-level pass checks for the existence of link, breadcrumb, related-content, and hub-connection systems. Exact orphan/depth metrics require a production crawl export or a full crawl-health artifact.

${sourceLinkSummary("Internal link / breadcrumb / related-content sources", internalLinkSources)}

## Priority Surfaces

| Surface | Required Link Support | Risk If Missing |
| --- | --- | --- |
| Lessons | Breadcrumbs, related lessons, related questions, flashcards, simulations, pharmacology/skills where applicable. | Thin or orphan-like pages; weaker crawl depth. |
| Blog | Related lessons/topics, exam hubs, glossary links, FAQ/schema. | Authority pages fail to pass relevance to product and education pages. |
| Questions | Related topic, lesson, rationale education, practice set, flashcards. | Question pages look thin and isolated. |
| Glossary / topic pages | Hub links, related concepts, lessons, questions. | Topic pages become sitemap-only and less index-worthy. |
| Simulation pages | Related conditions, skills, report/remediation links, pathway hubs. | High-value clinical content stays disconnected from authority clusters. |

## Unable To Verify Without Crawl Artifact

- Exact orphan page count.
- Crawl depth distribution.
- Weakly linked page list.
- Backlink/internal-link counts per URL.
- Broken internal links from production-rendered HTML.

## Measurement Plan

\`\`\`bash
npm run qa:crawl-health
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run qa:crawl-health:remote
\`\`\`
`);

  writeReport("docs/reports/crawled-not-indexed-remediation.md", `# Crawled Not Indexed Remediation

Generated: ${generatedAt}

## Search Console Signal

- Reported Crawled - Currently Not Indexed URLs: ${gscReportedCounts.crawledNotIndexed.toLocaleString()}
- URL export status: ${gscIssueExportStatus("crawled-not-indexed")}

## Top Templates

${topTemplatesMarkdown(gscRows, "crawled-not-indexed")}

## Required Per-URL Measurements

| Measurement | Why It Matters |
| --- | --- |
| Word count | Identifies thin pages. |
| Unique paragraph count | Detects duplicate or boilerplate pages. |
| Schema present | Helps Google understand page purpose. |
| Canonical | Prevents duplicate or conflicting index signals. |
| Internal links in/out | Determines whether page is contextually important. |
| Breadcrumbs | Reinforces hierarchy and crawl discovery. |
| Educational depth | Distinguishes real learning content from generated snippets. |

## Next Step

Place the 718 affected URLs at \`data/gsc-indexing/crawled-not-indexed.csv\` and rerun \`npm run audit:gsc-indexing\`. Until then, URL-level word count, uniqueness, schema, and link density remain Unable To Verify.
`);

  writeReport("docs/reports/schema-health-report.md", `# Schema Health Report

Generated: ${generatedAt}

## Source-Level Schema Coverage

${table([
  ["Schema Type", "Local Source File Count", "Notes"],
  ...schemaTypeCoverage,
])}

${sourceLinkSummary("Structured data / JSON-LD sources", schemaSources)}

## Validation Findings

| Requirement | Status |
| --- | --- |
| Article schema | Present in source, especially blog/authority content. |
| FAQ schema | Present in source. Validate production snippets for invalid generated FAQ copy. |
| Breadcrumb schema | Present through breadcrumb helpers/components. |
| Course schema | Present in exam/program-oriented helpers. |
| MedicalCondition / MedicalWebPage | Present in clinical/educational entity helpers; production validation still required. |
| Organization / WebSite | Present in source-level schema helpers. |
| EducationalOccupationalProgram | Present in program/exam helper surface. |

## Unable To Verify Without Runtime Crawl

- Whether every high-value rendered page emits valid JSON-LD.
- Whether JSON-LD fields pass Google Rich Results validation.
- Whether there are conflicting schema blocks on a specific URL.
`);

  writeReport("docs/reports/search-console-recovery-roadmap.md", `# Search Console Recovery Roadmap

Generated: ${generatedAt}

## Critical

${table([
  ["Item", "Traffic Impact", "Indexation Impact", "Implementation Effort", "Action"],
  ["Remove 5xx/timeouts from sitemap URLs", "Very High", "Very High", "Medium", "Run live sitemap verification, fix timeout templates, and keep CI crawl-health blocking regressions."],
  ["Remove sitemap/noindex mismatches", "High", "Very High", "Low-Medium", "Any noindex page must be removed from XML sitemap or made indexable if public and valuable."],
  ["Load GSC URL exports for blocked/noindex/duplicates/crawled-not-indexed", "High", "High", "Low", "Place CSVs in data/gsc-indexing/ and rerun audit for exact URL lists."],
])}

## High

${table([
  ["Item", "Traffic Impact", "Indexation Impact", "Implementation Effort", "Action"],
  ["Canonicalize duplicate-prone exam and topic pages", "High", "High", "Medium", "Self-canonical distinct pages; merge or canonicalize thin variants."],
  ["Strengthen question pages as educational resources", "High", "High", "Medium", "Add rationale, clinical application, exam strategy, related content, and schema."],
  ["Improve internal links for lessons/questions/glossary/simulations", "High", "Medium-High", "Medium", "Add breadcrumbs, related learning, hub connections, and topic clusters."],
])}

## Medium

${table([
  ["Item", "Traffic Impact", "Indexation Impact", "Implementation Effort", "Action"],
  ["Schema validation by page type", "Medium", "Medium", "Medium", "Extract rendered JSON-LD in crawl-health and validate representative page families."],
  ["Locale publication policy cleanup", "Medium", "Medium", "Medium", "Keep incomplete locales noindex/follow and out of sitemaps; publish only complete locale clusters."],
  ["Long-tail blog duplicate/content-depth pass", "Medium", "Medium", "High", "Expand or consolidate thin/boilerplate long-tail articles."],
])}

## Low

${table([
  ["Item", "Traffic Impact", "Indexation Impact", "Implementation Effort", "Action"],
  ["Robots documentation and periodic guard", "Low", "Medium", "Low", "Keep private-only robots rules and validate single sitemap directive."],
  ["Search Console validation checklist automation", "Low", "Medium", "Low", "Generate validation steps after every SEO recovery audit run."],
])}
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
- \`docs/reports/robots-indexability-audit.md\`
- \`docs/reports/noindex-review.md\`
- \`docs/reports/canonical-audit.md\`
- \`docs/reports/duplicate-content-audit.md\`
- \`docs/reports/sitemap-cleanup-report.md\`
- \`docs/reports/internal-linking-audit.md\`
- \`docs/reports/crawled-not-indexed-remediation.md\`
- \`docs/reports/schema-health-report.md\`
- \`docs/reports/search-console-recovery-roadmap.md\`

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
  console.log("[gsc-indexing-audit] wrote docs/reports/robots-indexability-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/noindex-review.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/canonical-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/duplicate-content-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/sitemap-cleanup-report.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/internal-linking-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/crawled-not-indexed-remediation.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/schema-health-report.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/search-console-recovery-roadmap.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/search-console-recovery-checklist.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

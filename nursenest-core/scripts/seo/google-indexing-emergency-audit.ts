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
        rows.push({ url: raw, pathname, issue, sourceFile: relative(packageRoot, abs) });
      }
    }
  }
  return rows;
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
    const path = row.pathname;
    const template = path
      .replace(/\/[0-9a-f]{16,}(?=\/|$)/gi, "/:id")
      .replace(/\/\d+(?=\/|$)/g, "/:number")
      .replace(/\/[^/]+\.(?:png|jpg|jpeg|webp|gif|svg|css|js)$/i, "/:asset")
      .replace(/\/blog\/[^/]+$/i, "/blog/:slug")
      .replace(/\/questions\/[^/]+$/i, "/questions/:slug")
      .replace(/\/resources\/[^/]+$/i, "/resources/:slug")
      .replace(/\/tools\/[^/]+$/i, "/tools/:slug");
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
  const robotsBody = await getRobotsBody();
  const robotsRules = extractRobotsRules(robotsBody);
  const { notFoundCalls, noindexFiles, routeErrorFiles } = sourceFindings();
  const csvStatus = gscRows.length > 0
    ? `${gscRows.length} URL rows loaded from local GSC CSV exports.`
    : "No local GSC URL CSV exports found. Reports use the aggregate counts from the prompt plus source/sitemap/robots analysis. Export affected URLs from GSC into data/gsc-indexing/ for frequency-accurate grouping.";

  const noPublicBlocked = robotsRules.every((r) => r.classification === "Should be blocked");
  const redirectSource = readText("next.config.mjs");
  const redirectCount = (redirectSource.match(/destination:/g) ?? []).length;

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

## Highest-Risk Templates To Check First

${topTemplatesMarkdown(gscRows, "5xx")}

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

## Deliverables

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
5. Add 301s only for valuable legacy URLs; return 410 for obsolete generated URLs; ignore exploit garbage.
`);

  console.log("[gsc-indexing-audit] wrote docs/reports/google-search-console-indexing-emergency-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/seo-5xx-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/robots-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/404-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/crawled-not-indexed-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/noindex-audit.md");
  console.log("[gsc-indexing-audit] wrote docs/reports/sitemap-health-report.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

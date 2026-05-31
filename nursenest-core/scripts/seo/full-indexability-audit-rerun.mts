#!/usr/bin/env npx tsx
import { promises as fs } from "node:fs";
import path from "node:path";

type PreviousResult = {
  url: string;
  pathname: string;
  source: string;
  lastmod?: string | null;
};

type AuditResult = PreviousResult & {
  inSitemap: boolean;
  httpStatus: number | null;
  redirected: boolean;
  redirectLocation: string | null;
  robotsBlocked: boolean;
  noindex: boolean;
  canonical: string | null;
  canonicalSelf: boolean;
  internalLinked: boolean;
  hubLinked: boolean;
  contentType: string | null;
  error: string | null;
  issues: string[];
};

const origin = (process.env.INDEXABILITY_AUDIT_ORIGIN ?? "https://nursenest.ca").replace(/\/+$/, "");
const previousPath = process.env.INDEXABILITY_AUDIT_PREVIOUS ?? "reports/full-indexability-audit/results.json";
const outDir = process.env.INDEXABILITY_AUDIT_OUT_DIR ?? "reports/full-indexability-audit-rerun";
const reportPath = process.env.INDEXABILITY_AUDIT_REPORT ?? "docs/reports/full-indexability-audit-rerun.md";
const concurrency = Math.min(16, Math.max(1, Number(process.env.INDEXABILITY_AUDIT_CONCURRENCY ?? "8") || 8));

function parseLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const loc = m[1]?.trim();
    if (loc) out.push(loc);
  }
  return out;
}

function extractCanonical(html: string): string | null {
  return html.slice(0, 250_000).match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]?.trim() ?? null;
}

function declaresNoindex(html: string): boolean {
  const head = html.slice(0, 250_000);
  return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head) || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(head);
}

function comparable(raw: string): string {
  const u = new URL(raw, origin);
  u.hash = "";
  u.search = "";
  if (u.pathname !== "/") u.pathname = u.pathname.replace(/\/+$/, "");
  return u.toString();
}

function hrefSet(html: string): Set<string> {
  const out = new Set<string>();
  const re = /<a[^>]+href=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1]?.trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    try {
      out.add(comparable(href));
    } catch {
      // Ignore malformed links during indexing audit.
    }
  }
  return out;
}

async function fetchText(url: string, accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"): Promise<{ status: number; headers: Headers; text: string; redirected: boolean; redirectLocation: string | null }> {
  const res = await fetch(url, {
    redirect: "manual",
    headers: {
      accept,
      "user-agent": "NurseNest-FullIndexabilityAudit/1.0",
    },
    signal: AbortSignal.timeout(25_000),
  });
  const text = await res.text().catch(() => "");
  return {
    status: res.status,
    headers: res.headers,
    text,
    redirected: res.status >= 300 && res.status < 400,
    redirectLocation: res.headers.get("location"),
  };
}

async function collectCurrentBlogSitemap(): Promise<Set<string>> {
  const sitemap = await fetchText(`${origin}/sitemap-blog.xml`, "application/xml,text/xml,*/*");
  if (sitemap.status !== 200) return new Set();
  return new Set(parseLocs(sitemap.text).map(comparable));
}

async function collectVisibleLinks(): Promise<{ internalLinks: Set<string>; hubLinks: Set<string> }> {
  const internalLinks = new Set<string>();
  const hubLinks = new Set<string>();
  const pages = ["/", "/blog"];
  for (const page of pages) {
    const fetched = await fetchText(`${origin}${page}`).catch(() => null);
    if (!fetched || fetched.status !== 200) continue;
    const links = hrefSet(fetched.text);
    for (const link of links) internalLinks.add(link);
    if (page === "/blog") {
      for (const link of links) hubLinks.add(link);
    }
  }
  return { internalLinks, hubLinks };
}

async function poolMap<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function run() {
    for (;;) {
      const index = cursor++;
      if (index >= items.length) return;
      out[index] = await worker(items[index]!);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return out;
}

function summarize(results: AuditResult[]) {
  const countIssue = (issue: string) => results.filter((row) => row.issues.includes(issue)).length;
  const httpIssues = results.filter((row) => row.httpStatus !== 200).length;
  return {
    generatedAt: new Date().toISOString(),
    origin,
    auditedUrlCount: results.length,
    indexableUrlCount: results.filter((row) => row.issues.length === 0).length,
    nonIndexableUrlCount: results.filter((row) => row.issues.length > 0).length,
    orphanedUrlCount: countIssue("not_internally_linked"),
    canonicalIssues: results.filter((row) => row.issues.some((issue) => issue.startsWith("canonical"))).length,
    redirectIssues: results.filter((row) => row.redirected).length,
    httpIssues,
    http504Count: countIssue("http_504"),
    robotsBlocked: countIssue("robots_blocked"),
    noindexCount: countIssue("noindex"),
    missingFromSitemapCount: countIssue("missing_from_sitemap"),
    notInternallyLinkedCount: countIssue("not_internally_linked"),
    notHubLinkedCount: countIssue("not_linked_from_hub"),
  };
}

function issueCounts(results: AuditResult[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of results) {
    for (const issue of row.issues) out[issue] = (out[issue] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort((a, b) => b[1] - a[1]));
}

function csvEscape(value: unknown): string {
  const raw = value == null ? "" : String(value);
  if (!/[",\n]/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

async function main() {
  const previousRaw = JSON.parse(await fs.readFile(previousPath, "utf8"));
  const previous: PreviousResult[] = previousRaw.results.map((row: PreviousResult) => ({
    url: row.url.replace(/^https:\/\/www\.nursenest\.ca/i, origin),
    pathname: row.pathname,
    source: row.source,
    lastmod: row.lastmod ?? null,
  }));
  const [currentSitemapUrls, links] = await Promise.all([collectCurrentBlogSitemap(), collectVisibleLinks()]);

  const results = await poolMap(previous, concurrency, async (row): Promise<AuditResult> => {
    const normalizedUrl = comparable(row.url);
    const issues: string[] = [];
    let httpStatus: number | null = null;
    let redirected = false;
    let redirectLocation: string | null = null;
    let noindex = false;
    let canonical: string | null = null;
    let canonicalSelf = false;
    let contentType: string | null = null;
    let error: string | null = null;
    try {
      const fetched = await fetchText(normalizedUrl);
      httpStatus = fetched.status;
      redirected = fetched.redirected;
      redirectLocation = fetched.redirectLocation;
      contentType = fetched.headers.get("content-type");
      if (httpStatus !== 200) issues.push(`http_${httpStatus}`);
      if (redirected) issues.push("redirect");
      if ((contentType ?? "").toLowerCase().includes("text/html")) {
        noindex = declaresNoindex(fetched.text);
        canonical = extractCanonical(fetched.text);
        canonicalSelf = canonical ? comparable(canonical) === normalizedUrl : false;
        if (noindex) issues.push("noindex");
        if (!canonical) issues.push("canonical_missing");
        else if (!canonicalSelf) issues.push("canonical_not_self");
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      issues.push("fetch_error");
    }

    const inSitemap = currentSitemapUrls.has(normalizedUrl);
    const internalLinked = links.internalLinks.has(normalizedUrl);
    const hubLinked = links.hubLinks.has(normalizedUrl);
    if (!inSitemap) issues.push("missing_from_sitemap");
    if (!internalLinked) issues.push("not_internally_linked");
    if (!hubLinked) issues.push("not_linked_from_hub");

    return {
      ...row,
      url: normalizedUrl,
      inSitemap,
      httpStatus,
      redirected,
      redirectLocation,
      robotsBlocked: false,
      noindex,
      canonical,
      canonicalSelf,
      internalLinked,
      hubLinked,
      contentType,
      error,
      issues,
    };
  });

  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  const summary = summarize(results);
  const counts = issueCounts(results);
  const failures = results.filter((row) => row.issues.length > 0);
  await fs.writeFile(path.join(outDir, "results.json"), JSON.stringify({ summary, issueCounts: counts, results }, null, 2), "utf8");
  await fs.writeFile(
    path.join(outDir, "failures.csv"),
    [
      "url,source,httpStatus,redirected,redirectLocation,robotsBlocked,noindex,canonical,canonicalSelf,inSitemap,internalLinked,hubLinked,issues,error",
      ...failures.map((row) =>
        [
          row.url,
          row.source,
          row.httpStatus ?? "",
          row.redirected,
          row.redirectLocation ?? "",
          row.robotsBlocked,
          row.noindex,
          row.canonical ?? "",
          row.canonicalSelf,
          row.inSitemap,
          row.internalLinked,
          row.hubLinked,
          row.issues.join("|"),
          row.error ?? "",
        ]
          .map(csvEscape)
          .join(","),
      ),
    ].join("\n"),
    "utf8",
  );

  const issueRows = Object.entries(counts).map(([issue, count]) => `| ${issue} | ${count.toLocaleString()} |`).join("\n");
  const sampleRows = failures
    .slice(0, 25)
    .map((row) => `| ${row.url} | ${row.httpStatus ?? "error"} | ${row.issues.join(", ")} |`)
    .join("\n");
  await fs.writeFile(
    reportPath,
    `# Full Indexability Audit Rerun

Generated: ${summary.generatedAt}

## Summary

| Metric | Count |
|---|---:|
| Audited URLs | ${summary.auditedUrlCount.toLocaleString()} |
| Fully indexable URLs | ${summary.indexableUrlCount.toLocaleString()} |
| Non-indexable / failing URLs | ${summary.nonIndexableUrlCount.toLocaleString()} |
| HTTP issues | ${summary.httpIssues.toLocaleString()} |
| HTTP 504 count | ${summary.http504Count.toLocaleString()} |
| Canonical issues | ${summary.canonicalIssues.toLocaleString()} |
| Noindex URLs | ${summary.noindexCount.toLocaleString()} |
| Missing from sitemap | ${summary.missingFromSitemapCount.toLocaleString()} |
| Not internally linked | ${summary.notInternallyLinkedCount.toLocaleString()} |
| Not linked from blog hub | ${summary.notHubLinkedCount.toLocaleString()} |

## Issue Breakdown

| Issue | Count |
|---|---:|
${issueRows || "| (none) | 0 |"}

## Failure Export

- JSON: \`${path.join(outDir, "results.json")}\`
- CSV: \`${path.join(outDir, "failures.csv")}\`

## First Failure Samples

| URL | HTTP | Issues |
|---|---:|---|
${sampleRows || "| (none) | 200 | (none) |"}
`,
    "utf8",
  );

  console.log(`[full-indexability-audit-rerun] wrote ${reportPath}`);
  console.log(`[full-indexability-audit-rerun] HTTP 504 count=${summary.http504Count}`);
  console.log(`[full-indexability-audit-rerun] HTTP issue count=${summary.httpIssues}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

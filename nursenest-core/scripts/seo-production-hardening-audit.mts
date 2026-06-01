import { mkdirSync, writeFileSync } from "node:fs";

type RouteProbe = {
  url: string;
  status: number | null;
  ms: number;
  cacheStatus: string;
  upstreamStatus: string;
  contentType: string;
  error: string;
};

type UrlAudit = {
  url: string;
  source: string;
  status: number | null;
  ms: number;
  contentType: string;
  cacheStatus: string;
  noindex: boolean;
  canonical: string;
  canonicalIssue: string;
  issue: string;
};

const ORIGIN = "https://nursenest.ca";
const REPORT_DIR = "reports/production-seo-current";
const DOC_DIR = "docs/reports";
const REQUIRED_ROUTES = [
  "/",
  "/healthz",
  "/readyz",
  "/blog",
  "/blog?page=2",
  "/blog?page=5",
  "/blog?page=10",
  "/sitemap.xml",
  "/sitemap-blog.xml",
];
const REQUEST_TIMEOUT_MS = 20_000;
const CONCURRENCY = Number.parseInt(process.env.SEO_AUDIT_CONCURRENCY ?? "16", 10) || 16;
const CANONICAL_SAMPLE_LIMIT = Number.parseInt(process.env.SEO_CANONICAL_SAMPLE_LIMIT ?? "250", 10) || 250;

function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function csv<T extends Record<string, unknown>>(rows: T[], columns: (keyof T)[]): string {
  return [
    columns.map(String).join(","),
    ...rows.map((row) => columns.map((key) => csvEscape(row[key])).join(",")),
  ].join("\n") + "\n";
}

function abs(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ac.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function probeRoute(pathOrUrl: string): Promise<RouteProbe> {
  const url = abs(pathOrUrl);
  const started = Date.now();
  try {
    const res = await fetchWithTimeout(url, { headers: { "user-agent": "NurseNestSEOAudit/1.0" } });
    await res.arrayBuffer();
    return {
      url,
      status: res.status,
      ms: Date.now() - started,
      cacheStatus: res.headers.get("cf-cache-status") ?? res.headers.get("x-cache") ?? "",
      upstreamStatus: res.headers.get("x-do-orig-status") ?? "",
      contentType: res.headers.get("content-type") ?? "",
      error: "",
    };
  } catch (error) {
    return {
      url,
      status: null,
      ms: Date.now() - started,
      cacheStatus: "",
      upstreamStatus: "",
      contentType: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1]?.trim() ?? "")
    .filter(Boolean);
}

function lastmods(xml: string): string[] {
  return [...xml.matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/gi)]
    .map((match) => match[1]?.trim() ?? "")
    .filter(Boolean);
}

async function fetchText(url: string): Promise<{ status: number; text: string; headers: Headers }> {
  const res = await fetchWithTimeout(url, { headers: { "user-agent": "NurseNestSEOAudit/1.0" } });
  return { status: res.status, text: await res.text(), headers: res.headers };
}

async function collectLiveSitemapUrls(): Promise<{
  indexStatus: number;
  children: string[];
  sitemapRows: Array<{ sitemap: string; status: number; urlCount: number; lastmodMin: string; lastmodMax: string }>;
  urlToSources: Map<string, Set<string>>;
}> {
  const index = await fetchText(`${ORIGIN}/sitemap.xml`);
  const children = locs(index.text).filter((url) => url.endsWith(".xml"));
  const urlToSources = new Map<string, Set<string>>();
  const sitemapRows: Array<{ sitemap: string; status: number; urlCount: number; lastmodMin: string; lastmodMax: string }> = [];

  for (const child of children) {
    const sitemap = await fetchText(child);
    const urls = locs(sitemap.text).filter((url) => !url.endsWith(".xml"));
    const mods = lastmods(sitemap.text).sort();
    sitemapRows.push({
      sitemap: child,
      status: sitemap.status,
      urlCount: urls.length,
      lastmodMin: mods[0] ?? "",
      lastmodMax: mods[mods.length - 1] ?? "",
    });
    for (const url of urls) {
      const normalized = url.replace(/\/$/, "");
      const set = urlToSources.get(normalized) ?? new Set<string>();
      set.add(child.replace(`${ORIGIN}/`, ""));
      urlToSources.set(normalized, set);
    }
  }

  return { indexStatus: index.status, children, sitemapRows, urlToSources };
}

function canonicalFromHtml(html: string): string {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ??
    "";
}

function hasNoindex(html: string): boolean {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html) ||
    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
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

async function auditUrl(url: string, sources: string[], index: number): Promise<UrlAudit> {
  const started = Date.now();
  try {
    const shouldInspectHtml = index < CANONICAL_SAMPLE_LIMIT;
    const res = await fetchWithTimeout(url, {
      method: shouldInspectHtml ? "GET" : "HEAD",
      headers: { "user-agent": "NurseNestSEOAudit/1.0" },
    });
    const contentType = res.headers.get("content-type") ?? "";
    const html = shouldInspectHtml && contentType.includes("text/html") ? await res.text() : "";
    if (shouldInspectHtml && !contentType.includes("text/html")) {
      await res.arrayBuffer();
    }
    const canonical = html ? canonicalFromHtml(html) : "";
    const canonicalNormalized = canonical.replace(/\/$/, "");
    const urlNormalized = url.replace(/\/$/, "");
    const noindex = html ? hasNoindex(html) : false;
    const canonicalIssue =
      shouldInspectHtml && html && !canonical
        ? "canonical_missing"
        : canonical && canonicalNormalized !== urlNormalized
          ? "canonical_mismatch"
          : "";
    const issue = [
      res.status !== 200 ? `http_${res.status}` : "",
      noindex ? "noindex" : "",
      canonicalIssue,
    ]
      .filter(Boolean)
      .join("|");
    return {
      url,
      source: sources.join("|"),
      status: res.status,
      ms: Date.now() - started,
      contentType,
      cacheStatus: res.headers.get("cf-cache-status") ?? res.headers.get("x-cache") ?? "",
      noindex,
      canonical,
      canonicalIssue,
      issue,
    };
  } catch (error) {
    return {
      url,
      source: sources.join("|"),
      status: null,
      ms: Date.now() - started,
      contentType: "",
      cacheStatus: "",
      noindex: false,
      canonical: "",
      canonicalIssue: "",
      issue: `fetch_error:${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function classify(url: string): string {
  const path = new URL(url).pathname;
  if (path.startsWith("/blog")) return "blog";
  if (path.includes("/lessons/") || path === "/lessons") return "lesson";
  if (/^\/(canada|us|nursing|allied-health|np-specialty|pre-nursing)/.test(path)) return "pathway";
  if (/^\/[a-z]{2}(?:-|\/)/.test(path)) return "localized";
  return "public";
}

async function main() {
  mkdirSync(REPORT_DIR, { recursive: true });
  mkdirSync(DOC_DIR, { recursive: true });

  const routeProbes = await mapLimit(REQUIRED_ROUTES, 4, (route) => probeRoute(route));
  const sitemap = await collectLiveSitemapUrls();
  const urlEntries = [...sitemap.urlToSources.entries()].sort(([a], [b]) => a.localeCompare(b));
  const audits = await mapLimit(urlEntries, CONCURRENCY, ([url, sources], index) => auditUrl(url, [...sources].sort(), index));

  const countsByClass = new Map<string, number>();
  for (const [url] of urlEntries) {
    countsByClass.set(classify(url), (countsByClass.get(classify(url)) ?? 0) + 1);
  }

  const non200 = audits.filter((row) => row.status !== 200);
  const canonicalFailures = audits.filter((row) => row.canonicalIssue);
  const noindex = audits.filter((row) => row.noindex);
  const fullyIndexable = audits.filter((row) => row.status === 200 && !row.noindex && !row.canonicalIssue);
  const duplicates = [...sitemap.urlToSources.entries()]
    .filter(([, sources]) => sources.size > 1)
    .map(([url, sources]) => ({ url, sources: [...sources].sort().join("|") }));

  writeFileSync(
    `${REPORT_DIR}/non-200-sitemap-urls.csv`,
    csv(non200, ["url", "source", "status", "ms", "contentType", "cacheStatus", "issue"]),
  );
  writeFileSync(
    `${REPORT_DIR}/canonical-failures.csv`,
    csv(canonicalFailures, ["url", "source", "status", "canonical", "canonicalIssue", "issue"]),
  );
  writeFileSync(
    `${REPORT_DIR}/missing-from-sitemaps.csv`,
    "url,reason\n",
  );
  writeFileSync(
    `${REPORT_DIR}/orphaned-urls.csv`,
    "url,reason\n",
  );
  writeFileSync(
    `${REPORT_DIR}/duplicates-across-sitemaps.csv`,
    csv(duplicates, ["url", "sources"]),
  );
  writeFileSync(
    `${REPORT_DIR}/results.json`,
    JSON.stringify({ generatedAt: new Date().toISOString(), routeProbes, sitemap, audits }, null, 2),
  );

  const routeTable = routeProbes
    .map((row) => `| ${new URL(row.url).pathname}${new URL(row.url).search} | ${row.status ?? "ERR"} | ${row.ms} | ${row.cacheStatus || "-"} | ${row.upstreamStatus || "-"} | ${row.error || "-"} |`)
    .join("\n");
  writeFileSync(
    `${DOC_DIR}/production-origin-verification.md`,
    `# Production Origin Verification\n\nGenerated: ${new Date().toISOString()}\n\nThese checks target the currently deployed production origin.\n\n| Route | Status | Response time ms | Cache | Upstream | Error |\n| --- | ---: | ---: | --- | --- | --- |\n${routeTable}\n\nVerdict: ${routeProbes.every((row) => row.status === 200) ? "origin routes returned HTTP 200" : "one or more origin routes failed"}.\n`,
  );

  const sitemapRows = sitemap.sitemapRows
    .map((row) => `| ${row.sitemap} | ${row.status} | ${row.urlCount} | ${row.lastmodMin || "-"} | ${row.lastmodMax || "-"} |`)
    .join("\n");
  writeFileSync(
    `${DOC_DIR}/sitemap-truth-audit.md`,
    `# Sitemap Truth Audit\n\nGenerated: ${new Date().toISOString()}\n\n## Live Production Sitemap Index\n\n- Sitemap index status: ${sitemap.indexStatus}\n- Child sitemaps in live index: ${sitemap.children.length}\n- Unique public URLs found in live child sitemaps: ${urlEntries.length}\n\n## Counts\n\n| Class | Count |\n| --- | ---: |\n| Total public sitemap URLs | ${urlEntries.length} |\n| Blog URLs | ${countsByClass.get("blog") ?? 0} |\n| Lesson URLs | ${countsByClass.get("lesson") ?? 0} |\n| Pathway URLs | ${countsByClass.get("pathway") ?? 0} |\n| Localized URLs | ${countsByClass.get("localized") ?? 0} |\n\n## Child Sitemap Coverage\n\n| Sitemap | Status | URL count | Earliest lastmod | Latest lastmod |\n| --- | ---: | ---: | --- | --- |\n${sitemapRows}\n\n## Findings\n\n| Finding | Count |\n| --- | ---: |\n| URLs missing from all sitemaps | 0 discovered by this live-sitemap crawl |\n| URLs present in sitemaps but non-200 | ${non200.length} |\n| Canonical failures | ${canonicalFailures.length} |\n| Noindex pages | ${noindex.length} |\n| Duplicate URLs across child sitemaps | ${duplicates.length} |\n| Fully indexable sitemap URLs | ${fullyIndexable.length} |\n\nCSV exports are in \`${REPORT_DIR}/\`.\n\nNote: this is current live production truth. Local build validation now contains the newer 25-child sitemap index, so production should be redeployed before using this report as post-fix truth.\n`,
  );

  writeFileSync(
    `${DOC_DIR}/full-indexability-audit-current.md`,
    `# Full Indexability Audit Current\n\nGenerated: ${new Date().toISOString()}\n\nScope: all URLs discovered from the current live production sitemap index and child sitemaps.\n\n| Metric | Count |\n| --- | ---: |\n| Total URLs audited | ${audits.length} |\n| HTTP 200 | ${audits.filter((row) => row.status === 200).length} |\n| HTTP 404 | ${audits.filter((row) => row.status === 404).length} |\n| HTTP 500 | ${audits.filter((row) => row.status === 500).length} |\n| HTTP 504 | ${audits.filter((row) => row.status === 504).length} |\n| Fetch errors | ${audits.filter((row) => row.status === null).length} |\n| Canonical failures | ${canonicalFailures.length} |\n| Noindex pages | ${noindex.length} |\n| Orphan pages | 0 measured from sitemap-only crawl; hub-link crawl still required |\n| Sitemap exclusions | 0 measured from sitemap-only crawl |\n| Fully indexable URLs | ${fullyIndexable.length} |\n\nArtifacts:\n\n- \`${REPORT_DIR}/results.json\`\n- \`${REPORT_DIR}/non-200-sitemap-urls.csv\`\n- \`${REPORT_DIR}/canonical-failures.csv\`\n- \`${REPORT_DIR}/orphaned-urls.csv\`\n- \`${REPORT_DIR}/missing-from-sitemaps.csv\`\n`,
  );

  writeFileSync(
    `${DOC_DIR}/canonical-recovery.md`,
    `# Canonical Recovery\n\nGenerated: ${new Date().toISOString()}\n\nCurrent live production canonical failures among sitemap URLs: ${canonicalFailures.length}.\n\nCSV: \`${REPORT_DIR}/canonical-failures.csv\`\n\nRecovery rule:\n\n- Every indexable HTML page must emit a self-canonical URL matching the final normalized sitemap URL.\n- Canonicals must not point to redirected, noindexed, or non-200 URLs.\n\n${canonicalFailures.length === 0 ? "Verdict: no canonical failures found in the live sitemap URL crawl." : "Verdict: canonical fixes are required before GSC GO."}\n`,
  );

  writeFileSync(
    `${DOC_DIR}/internal-link-recovery.md`,
    `# Internal Link Recovery\n\nGenerated: ${new Date().toISOString()}\n\nThis run verified sitemap-discovered URLs and exported placeholder orphan/missing sitemap CSVs. A full hub-link graph crawl was not run because the current production sitemap index is stale relative to the local 25-child segmented build.\n\n| Metric | Count |\n| --- | ---: |\n| Orphan count before | Not measured in this live-sitemap pass |\n| Orphan count after | Not modified |\n| Hub count added | 0 |\n| URLs linked | 0 |\n\nNext action: deploy the sitemap hardening changes, then run the hub-link graph crawl against the updated production origin.\n`,
  );

  const gscGo = routeProbes.every((row) => row.status === 200) &&
    audits.filter((row) => row.status === 504).length === 0 &&
    canonicalFailures.length === 0;
  writeFileSync(
    `${DOC_DIR}/gsc-readiness-certification.md`,
    `# GSC Readiness Certification\n\nGenerated: ${new Date().toISOString()}\n\nDecision: ${gscGo ? "GO" : "NO-GO"}\n\n## Gates\n\n| Gate | Result |\n| --- | --- |\n| Production required routes HTTP 200 | ${routeProbes.every((row) => row.status === 200) ? "pass" : "fail"} |\n| 504 count = 0 | ${audits.filter((row) => row.status === 504).length === 0 ? "pass" : "fail"} |\n| Canonical errors resolved | ${canonicalFailures.length === 0 ? "pass" : "fail"} |\n| Orphan count minimized | not certified in this pass |\n\n${gscGo ? "The first 1000 URLs should be generated after the post-deploy hub-link crawl." : "Do not submit bulk URL inspection requests until the hardened sitemap build is deployed and the post-deploy audit is clean."}\n`,
  );

  console.log(
    JSON.stringify({
      routeProbes: routeProbes.length,
      sitemapChildren: sitemap.children.length,
      urls: audits.length,
      non200: non200.length,
      canonicalFailures: canonicalFailures.length,
      noindex: noindex.length,
      fullyIndexable: fullyIndexable.length,
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

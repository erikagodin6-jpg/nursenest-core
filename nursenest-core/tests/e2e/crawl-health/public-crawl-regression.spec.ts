/**
 * Strict public crawl regression — unauthenticated HTTP fetches (no browser), bounded for production.
 *
 * @see tests/e2e/crawl-health/README.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import {
  crawlConcurrency,
  crawlLinkSampleHtmlPages,
  crawlMaxInternalLinkChecks,
  crawlMaxRedirectHops,
  crawlMaxSitemapUrls,
} from "./helpers/crawl-limits";
import { fetchWithRedirectTrace } from "./helpers/fetch-with-redirects";
import { extractInternalPathnames, parseHtmlSeo, urlsSeoMatch } from "./helpers/parse-html-seo";
import { CRAWL_SEED_PATHNAMES } from "./helpers/seed-urls";
import { isExpectedNoindexLocalizedMarketingPath } from "./helpers/locale-noindex-policy";
import { fetchSitemapLocs } from "./helpers/sitemap-locs";

const MAX_FETCH_ROUNDS = 20;

type PageRow = {
  requestedUrl: string;
  finalUrl: string;
  chain: string[];
  redirectHops: number;
  status: number;
  contentType: string;
  canonicalHref: string | null;
  canonicalMismatch: boolean;
  robotsMeta: string | null;
  jsonLdSnippet: string | null;
  fromSitemap: boolean;
  noindexOnSitemap: boolean;
  obviousBroken: boolean;
  error?: string;
};

const AUTH_PATHNAME_RE = /^\/(login|signup|forgot-password|reset-password)(\/|$)/i;

test.describe.configure({ mode: "serial" });

test("public crawl — sitemap + seeds (status, redirects, canonical, robots, links)", async ({ request }, testInfo) => {
  const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
  let origin: string;
  try {
    origin = new URL(baseURL).origin;
  } catch {
    throw new Error(`Invalid BASE_URL: ${baseURL}`);
  }

  const maxRedirectHopsAllowed = crawlMaxRedirectHops();
  const sitemapUrl = new URL("/sitemap.xml", origin).href;
  const sitemapLocs = await fetchSitemapLocs(request, sitemapUrl, crawlMaxSitemapUrls());
  const seedUrls = CRAWL_SEED_PATHNAMES.map((p) => new URL(p, origin).href);
  const allUrls = [...new Set([...seedUrls, ...sitemapLocs])];
  const fromSitemapSet = new Set(sitemapLocs);

  const rows: PageRow[] = [];
  const broken: { url: string; status: number; detail?: string }[] = [];
  const canonicalMismatch: { requestedUrl: string; finalUrl: string; canonical: string }[] = [];
  const noindexMismatch: { url: string; robots: string | null }[] = [];
  const sitemapAuthPollution: { url: string }[] = [];
  const redirectFailures: { url: string; chain: string[]; hops: number }[] = [];

  async function auditOne(requestedUrl: string, fromSitemap: boolean) {
    try {
      const { chain, response, finalUrl } = await fetchWithRedirectTrace(request, requestedUrl, MAX_FETCH_ROUNDS);
      const redirectHops = Math.max(0, chain.length - 1);
      if (redirectHops > maxRedirectHopsAllowed) {
        redirectFailures.push({ url: requestedUrl, chain, hops: redirectHops });
      }

      const status = response.status();
      const contentType = response.headers()["content-type"] ?? "";

      let body = "";
      try {
        body = await response.text();
      } catch {
        broken.push({ url: requestedUrl, status, detail: "body_read_failed" });
        rows.push({
          requestedUrl,
          finalUrl,
          chain,
          redirectHops,
          status,
          contentType,
          canonicalHref: null,
          canonicalMismatch: false,
          robotsMeta: null,
          jsonLdSnippet: null,
          fromSitemap,
          noindexOnSitemap: false,
          obviousBroken: true,
        });
        return;
      }

      const isHtml = contentType.includes("text/html");
      let canonicalHref: string | null = null;
      let robotsMeta: string | null = null;
      let jsonLdSnippet: string | null = null;
      let canonicalMismatchFlag = false;
      let noindexOnSitemap = false;
      let obviousBroken = false;

      if (isHtml && status === 200) {
        const parsed = parseHtmlSeo(body);
        canonicalHref = parsed.canonicalHref;
        robotsMeta = parsed.robotsContent;
        jsonLdSnippet = parsed.jsonLdSnippet;
        if (canonicalHref) {
          const absCanon = new URL(canonicalHref, finalUrl).href;
          if (!urlsSeoMatch(absCanon, finalUrl)) {
            canonicalMismatchFlag = true;
            canonicalMismatch.push({ requestedUrl, finalUrl, canonical: absCanon });
          }
        }
        const bl = body.toLowerCase();
        if (
          bl.includes("page not found") ||
          (bl.includes("404") && /<title[^>]*>[^<]*\b404\b/i.test(body))
        ) {
          obviousBroken = true;
        }
        if (fromSitemap && robotsMeta && robotsMeta.includes("noindex")) {
          let p = "";
          try {
            p = new URL(finalUrl).pathname;
          } catch {
            p = "";
          }
          if (!isExpectedNoindexLocalizedMarketingPath(p)) {
            noindexOnSitemap = true;
            noindexMismatch.push({ url: requestedUrl, robots: robotsMeta });
          }
        }
      }

      if (fromSitemap) {
        let p = "";
        try {
          p = new URL(finalUrl).pathname;
        } catch {
          /* ignore */
        }
        if (AUTH_PATHNAME_RE.test(p)) {
          sitemapAuthPollution.push({ url: requestedUrl });
        }
      }

      rows.push({
        requestedUrl,
        finalUrl,
        chain,
        redirectHops,
        status,
        contentType,
        canonicalHref,
        canonicalMismatch: canonicalMismatchFlag,
        robotsMeta,
        jsonLdSnippet,
        fromSitemap,
        noindexOnSitemap,
        obviousBroken,
      });

      if (status >= 400) {
        broken.push({ url: requestedUrl, status, detail: `http_${status}` });
      }
      if (fromSitemap && status !== 200) {
        broken.push({ url: requestedUrl, status, detail: "sitemap_url_not_200" });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      rows.push({
        requestedUrl,
        finalUrl: requestedUrl,
        chain: [requestedUrl],
        redirectHops: 0,
        status: 0,
        contentType: "",
        canonicalHref: null,
        canonicalMismatch: false,
        robotsMeta: null,
        jsonLdSnippet: null,
        fromSitemap,
        noindexOnSitemap: false,
        obviousBroken: true,
        error: msg,
      });
      broken.push({ url: requestedUrl, status: 0, detail: msg.slice(0, 240) });
    }
  }

  const concurrency = crawlConcurrency();
  for (let i = 0; i < allUrls.length; i += concurrency) {
    const batch = allUrls.slice(i, i + concurrency);
    await Promise.all(batch.map((u) => auditOne(u, fromSitemapSet.has(u))));
  }

  /** Redirect chains worth reviewing (informational artifact) — any URL with 2+ hops. */
  const redirectChainsReport = rows
    .filter((r) => r.chain.length > 2)
    .map((r) => ({ requestedUrl: r.requestedUrl, chain: r.chain, hops: r.redirectHops }));

  const brokenLinks: { path: string; status: number; finalUrl: string }[] = [];
  const htmlOk = rows.filter((r) => r.status === 200 && r.contentType.includes("text/html"));
  const samplePages = htmlOk.slice(0, crawlLinkSampleHtmlPages());
  const internalPaths = new Set<string>();
  outer: for (const r of samplePages) {
    const res = await request.get(r.finalUrl, { timeout: 60_000 });
    if (!res.ok()) continue;
    const html = await res.text();
    for (const p of extractInternalPathnames(html, 100, origin)) {
      internalPaths.add(p);
      if (internalPaths.size >= crawlMaxInternalLinkChecks()) break outer;
    }
  }

  const pathsToCheck = [...internalPaths].slice(0, crawlMaxInternalLinkChecks());
  for (let i = 0; i < pathsToCheck.length; i += concurrency) {
    const chunk = pathsToCheck.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (path) => {
        const url = new URL(path, origin).href;
        try {
          const { response, finalUrl } = await fetchWithRedirectTrace(request, url, MAX_FETCH_ROUNDS);
          const st = response.status();
          if (st >= 400) {
            brokenLinks.push({ path, status: st, finalUrl });
          }
        } catch {
          brokenLinks.push({ path, status: 0, finalUrl: url });
        }
      }),
    );
  }

  const obviousBrokenRows = rows.filter((r) => r.obviousBroken);

  const outDir = join(testInfo.outputDir, "crawl-health-artifacts");
  mkdirSync(outDir, { recursive: true });
  const meta = {
    generatedAt: new Date().toISOString(),
    baseURL,
    origin,
    limits: {
      maxSitemapUrls: crawlMaxSitemapUrls(),
      maxRedirectHops: maxRedirectHopsAllowed,
      maxInternalLinkChecks: crawlMaxInternalLinkChecks(),
      linkSampleHtmlPages: crawlLinkSampleHtmlPages(),
      concurrency,
    },
    totals: {
      urlsCrawled: rows.length,
      sitemapUrlsInBatch: sitemapLocs.length,
      seedCount: seedUrls.length,
      uniqueUrls: allUrls.length,
      internalLinksChecked: pathsToCheck.length,
    },
  };

  writeFileSync(join(outDir, "crawl-health-report.json"), JSON.stringify({ meta, rows }, null, 2));
  writeFileSync(join(outDir, "broken-urls.json"), JSON.stringify(broken, null, 2));
  writeFileSync(join(outDir, "redirect-chains.json"), JSON.stringify(redirectChainsReport, null, 2));
  writeFileSync(join(outDir, "redirect-failures.json"), JSON.stringify(redirectFailures, null, 2));
  writeFileSync(join(outDir, "canonical-mismatches.json"), JSON.stringify(canonicalMismatch, null, 2));
  writeFileSync(join(outDir, "noindex-index-mismatches.json"), JSON.stringify(noindexMismatch, null, 2));
  writeFileSync(join(outDir, "sitemap-auth-pollution.json"), JSON.stringify(sitemapAuthPollution, null, 2));
  writeFileSync(join(outDir, "broken-internal-links.json"), JSON.stringify(brokenLinks, null, 2));
  writeFileSync(join(outDir, "obvious-broken-html.json"), JSON.stringify(obviousBrokenRows, null, 2));

  await testInfo.attach("crawl-health-report", {
    path: join(outDir, "crawl-health-report.json"),
    contentType: "application/json",
  });

  const summaryParts = [
    broken.length && `broken:${broken.length}`,
    redirectFailures.length && `redirect_hops_exceeded:${redirectFailures.length}`,
    canonicalMismatch.length && `canonical:${canonicalMismatch.length}`,
    noindexMismatch.length && `noindex_sitemap:${noindexMismatch.length}`,
    sitemapAuthPollution.length && `sitemap_auth:${sitemapAuthPollution.length}`,
    brokenLinks.length && `broken_links:${brokenLinks.length}`,
    obviousBrokenRows.length && `obvious_broken:${obviousBrokenRows.length}`,
  ].filter(Boolean);

  const failed =
    broken.length > 0 ||
    redirectFailures.length > 0 ||
    canonicalMismatch.length > 0 ||
    noindexMismatch.length > 0 ||
    sitemapAuthPollution.length > 0 ||
    brokenLinks.length > 0 ||
    obviousBrokenRows.length > 0;

  expect(rows.length).toBeGreaterThan(0);
  if (failed) {
    throw new Error(
      `crawl_health_failed: ${summaryParts.join("; ") || "unknown"} — see ${outDir}`,
    );
  }
});

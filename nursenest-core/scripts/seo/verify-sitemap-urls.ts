#!/usr/bin/env npx tsx
/**
 * Deep sitemap verification: fetch `/sitemap.xml`, recurse through sitemap index children, then GET each page URL
 * (bounded concurrency).
 *
 * Env:
 * - `SITEMAP_VERIFY_BASE` | `BASE_URL` | `SITEMAP_VALIDATE_URL` — origin (default `https://nursenest.ca`)
 * - `SITEMAP_VERIFY_MAX_URLS` — cap URLs checked (default 5000; set lower in CI)
 * - `SITEMAP_VERIFY_CONCURRENCY` — parallel fetches (default 6)
 *
 * Exits non-zero if any sitemap child or page URL redirects, returns non-200, declares noindex, or points canonical
 * away from itself.
 */
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";

const baseRaw = (
  process.env.SITEMAP_VERIFY_BASE ||
  process.env.SITEMAP_VALIDATE_URL ||
  process.env.BASE_URL ||
  CANONICAL_PRODUCTION_ORIGIN
).trim();
const base = baseRaw.replace(/\/+$/, "");
const maxUrls = Math.min(50_000, Math.max(1, Number(process.env.SITEMAP_VERIFY_MAX_URLS || "5000") || 5000));
const concurrency = Math.min(32, Math.max(1, Number(process.env.SITEMAP_VERIFY_CONCURRENCY || "6") || 6));

function parseLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1]?.trim();
    if (loc) out.push(loc);
  }
  return out;
}

function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml.slice(0, 10_000));
}

function isUrlset(xml: string): boolean {
  return /<urlset[\s>]/i.test(xml.slice(0, 10_000));
}

function normalizeComparableUrl(raw: string): string {
  const u = new URL(raw);
  u.hash = "";
  u.search = "";
  if (u.pathname !== "/") u.pathname = u.pathname.replace(/\/+$/, "");
  return u.toString();
}

function htmlDeclaresNoindex(html: string): boolean {
  const slice = html.slice(0, 200_000).toLowerCase();
  return (
    /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(slice) ||
    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(slice)
  );
}

function extractCanonical(html: string): string | null {
  const m = html.slice(0, 200_000).match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return m?.[1]?.trim() ?? null;
}

async function fetchXml(url: string): Promise<{ xml?: string; error?: string }> {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(60_000),
    });
    if (res.status >= 300 && res.status < 400) {
      return { error: `${url} → sitemap redirect HTTP ${res.status}` };
    }
    if (res.status !== 200) {
      return { error: `${url} → sitemap HTTP ${res.status}` };
    }
    const ct = res.headers.get("content-type") || "";
    if (!/xml/i.test(ct)) {
      return { error: `${url} → sitemap content-type not XML: ${ct || "(missing)"}` };
    }
    const xml = await res.text();
    if (!isSitemapIndex(xml) && !isUrlset(xml)) {
      return { error: `${url} → sitemap XML missing sitemapindex/urlset root` };
    }
    return { xml };
  } catch (e) {
    return { error: `${url} → sitemap fetch ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function collectPageLocsFromSitemapIndex(sitemapUrl: string): Promise<{ locs: string[]; failures: string[] }> {
  const root = await fetchXml(sitemapUrl);
  if (root.error) return { locs: [], failures: [root.error] };
  const xml = root.xml ?? "";
  const directLocs = parseLocs(xml);
  if (isUrlset(xml)) return { locs: directLocs, failures: [] };

  const failures: string[] = [];
  const allPageLocs: string[] = [];
  const childSitemaps = directLocs.filter((loc) => /\.xml(?:$|[?#])/i.test(loc));
  for (const child of childSitemaps) {
    const fetched = await fetchXml(child);
    if (fetched.error) {
      failures.push(fetched.error);
      continue;
    }
    const childXml = fetched.xml ?? "";
    if (isSitemapIndex(childXml)) {
      const nested = await collectPageLocsFromSitemapIndex(child);
      failures.push(...nested.failures);
      allPageLocs.push(...nested.locs);
      continue;
    }
    allPageLocs.push(...parseLocs(childXml));
  }
  return { locs: [...new Set(allPageLocs)], failures };
}

async function checkPageUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(25_000),
    });
    if (res.status >= 300 && res.status < 400) {
      return `${url} → redirect HTTP ${res.status}`;
    }
    if (res.status !== 200) {
      return `${url} → HTTP ${res.status}`;
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.toLowerCase().includes("text/html")) {
      const html = await res.text();
      if (htmlDeclaresNoindex(html)) {
        return `${url} → HTML declares noindex`;
      }
      const canon = extractCanonical(html);
      if (canon) {
        try {
          const c = new URL(canon);
          const allowed = new Set([new URL(CANONICAL_PRODUCTION_ORIGIN).origin, new URL(base).origin]);
          if (!allowed.has(c.origin)) {
            return `${url} → canonical origin unexpected: ${canon}`;
          }
          if (normalizeComparableUrl(c.toString()) !== normalizeComparableUrl(url)) {
            return `${url} → canonical is not self-referential: ${canon}`;
          }
        } catch {
          return `${url} → invalid canonical URL: ${canon}`;
        }
      }
    }
    return null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return `${url} → ${msg}`;
  }
}

async function poolMap<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    for (;;) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx]!);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function main() {
  const sitemapUrl = `${base}/sitemap.xml`;
  const collected = await collectPageLocsFromSitemapIndex(sitemapUrl);
  let locs = collected.locs;
  if (locs.length === 0) {
    console.error("[verify:sitemap] no <loc> entries found");
    for (const f of collected.failures.slice(0, 200)) console.error(`  - ${f}`);
    process.exit(1);
  }
  if (locs.length > maxUrls) {
    console.warn(`[verify:sitemap] truncating checks from ${locs.length} to ${maxUrls}`);
    locs = locs.slice(0, maxUrls);
  }

  const failures = [
    ...collected.failures,
    ...(await poolMap(locs, concurrency, checkPageUrl)).filter((x): x is string => Boolean(x)),
  ];

  if (failures.length) {
    console.error(`[verify:sitemap] ${failures.length} failure(s):`);
    for (const f of failures.slice(0, 200)) console.error(`  - ${f}`);
    if (failures.length > 200) console.error(`  … and ${failures.length - 200} more`);
    process.exit(1);
  }
  console.log(`[verify:sitemap] OK ${locs.length} URLs (${sitemapUrl})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

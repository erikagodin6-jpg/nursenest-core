#!/usr/bin/env npx tsx
/**
 * Crawl seed marketing pages and verify same-origin `<a href>` links return 200 or 301/308 to same host.
 *
 * Env:
 * - `PUBLIC_LINKS_BASE` | `BASE_URL` (default `https://nursenest.ca`)
 * - `PUBLIC_LINKS_MAX_PAGES` (default 120)
 * - `PUBLIC_LINKS_MAX_DEPTH` (default 2)
 */
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";

const base = (process.env.PUBLIC_LINKS_BASE || process.env.BASE_URL || CANONICAL_PRODUCTION_ORIGIN).replace(/\/+$/, "");
const origin = new URL(base).origin;
const maxPages = Math.min(500, Math.max(5, Number(process.env.PUBLIC_LINKS_MAX_PAGES || "120") || 120));
const maxDepth = Math.min(4, Math.max(0, Number(process.env.PUBLIC_LINKS_MAX_DEPTH || "2") || 2));

const SEEDS = [
  "/",
  "/pricing",
  "/blog",
  "/question-bank",
  "/practice-exams",
  "/lessons",
  "/us/rn/nclex-rn",
  "/us/rn/nclex-rn/lessons",
  "/canada/rn/nclex-rn",
  "/flashcards",
];

function sameOrigin(href: string): boolean {
  try {
    const u = new URL(href, base);
    return u.origin === origin;
  } catch {
    return false;
  }
}

function extractSameOriginHrefs(html: string, pageUrl: string): string[] {
  const baseUrl = new URL(pageUrl);
  const out: string[] = [];
  const re = /<a\s+[^>]*href=["']([^"'#]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1]?.trim();
    if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) continue;
    try {
      const abs = new URL(raw, baseUrl);
      if (abs.origin !== origin) continue;
      const path = abs.pathname + (abs.search || "");
      if (path.startsWith("/app") || path.startsWith("/admin") || path.startsWith("/api")) continue;
      out.push(abs.origin + path.replace(/\/+$/, "") || abs.origin + "/");
    } catch {
      /* skip */
    }
  }
  return [...new Set(out)];
}

async function checkUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(25_000) });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return `${url} → ${res.status} without Location`;
      const next = new URL(loc, url);
      if (next.origin !== origin) return `${url} → ${res.status} external ${loc}`;
      const r2 = await fetch(next.toString(), { redirect: "manual", signal: AbortSignal.timeout(25_000) });
      if (r2.status !== 200) return `${url} → chain ${res.status} → ${r2.status}`;
      return null;
    }
    if (res.status !== 200) return `${url} → HTTP ${res.status}`;
    return null;
  } catch (e) {
    return `${url} → ${e instanceof Error ? e.message : String(e)}`;
  }
}

async function main() {
  const queue: { url: string; depth: number }[] = SEEDS.map((p) => ({ url: `${base}${p}`, depth: 0 }));
  const visited = new Set<string>();
  const failures: string[] = [];

  while (queue.length && visited.size < maxPages) {
    const { url, depth } = queue.shift()!;
    const norm = url.replace(/\/+$/, "") || `${origin}/`;
    if (visited.has(norm)) continue;
    visited.add(norm);

    const err = await checkUrl(norm);
    if (err) failures.push(err);

    if (depth >= maxDepth || visited.size >= maxPages) continue;

    try {
      const res = await fetch(norm, { signal: AbortSignal.timeout(25_000) });
      if (res.status !== 200 || !res.headers.get("content-type")?.toLowerCase().includes("text/html")) continue;
      const html = await res.text();
      for (const h of extractSameOriginHrefs(html, norm)) {
        if (!visited.has(h) && queue.length + visited.size < maxPages * 2) {
          queue.push({ url: h, depth: depth + 1 });
        }
      }
    } catch {
      /* already counted in checkUrl when seed fails */
    }
  }

  if (failures.length) {
    console.error(`[verify:public-links] ${failures.length} failure(s):`);
    for (const f of failures.slice(0, 100)) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`[verify:public-links] OK checked ${visited.size} pages from ${SEEDS.length} seeds`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env npx tsx
/**
 * Fetch `/robots.txt` and assert core crawl policy invariants (no DB).
 *
 * Env: `ROBOTS_VERIFY_BASE` | `BASE_URL` (default `https://www.nursenest.ca`)
 */
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";

const base = (process.env.ROBOTS_VERIFY_BASE || process.env.BASE_URL || CANONICAL_PRODUCTION_ORIGIN).replace(/\/+$/, "");

async function main() {
  const url = `${base}/robots.txt`;
  const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
  if (res.status !== 200) {
    console.error(`[verify:robots] expected 200, got ${res.status} for ${url}`);
    process.exit(1);
  }
  const body = await res.text();
  const lines = body.split(/\r?\n/).map((l) => l.trim());
  const failures: string[] = [];
  if (!lines.some((l) => /^User-agent:\s*\*/i.test(l))) failures.push("missing User-agent: *");
  if (!lines.some((l) => /^Allow:\s*\/\s*$/i.test(l))) failures.push("missing Allow: /");
  if (!lines.some((l) => /^Disallow:\s*\/app\/\s*$/i.test(l))) failures.push("missing Disallow: /app/");
  if (!lines.some((l) => /^Disallow:\s*\/admin\/\s*$/i.test(l))) failures.push("missing Disallow: /admin/");
  if (!lines.some((l) => /^Disallow:\s*\/api\/\s*$/i.test(l))) failures.push("missing Disallow: /api/");
  const sitemapLines = lines.filter((l) => /^\s*Sitemap:\s*/i.test(l));
  if (sitemapLines.length !== 1) failures.push(`expected exactly one Sitemap line, got ${sitemapLines.length}`);

  const blocked = ["/pricing", "/blog", "/lessons", "/us/", "/canada/"];
  for (const p of blocked) {
    const bad = new RegExp(`^Disallow:\\s*${p.replace("/", "\\/")}`, "im");
    if (bad.test(body)) failures.push(`must not blanket-disallow public marketing path ${p}`);
  }

  if (failures.length) {
    console.error(`[verify:robots] ${url}`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`[verify:robots] OK ${url}`);
}

await main();

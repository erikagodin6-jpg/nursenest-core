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
  if (sitemapLines.length !== 3) failures.push(`expected exactly three Sitemap lines, got ${sitemapLines.length}`);
  const expectedLocs = new Set([
    `${base}/sitemap.xml`,
    `${base}/sitemap-allied.xml`,
    `${base}/sitemap-new-grad.xml`,
  ]);
  const seenLocs = new Set<string>();
  for (const sl of sitemapLines) {
    if (/\bhttp:\/\//i.test(sl)) failures.push(`Sitemap line must be HTTPS-only, got: ${sl}`);
    if (/allied\.nursenest\.ca/i.test(sl)) failures.push(`Sitemap line must not use allied.nursenest.ca: ${sl}`);
    const m = sl.match(/^\s*Sitemap:\s*(.+?)\s*$/i);
    const loc = m?.[1]?.trim() ?? "";
    if (!loc.startsWith("https://")) failures.push(`Sitemap URL must use https://, got: ${sl}`);
    if (!expectedLocs.has(loc)) failures.push(`unexpected Sitemap URL (want main + allied + new-grad on same host): ${loc}`);
    seenLocs.add(loc);
  }
  for (const loc of expectedLocs) {
    if (!seenLocs.has(loc)) failures.push(`missing expected Sitemap URL: ${loc}`);
  }

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Validates GET /sitemap.xml over HTTP (run against `next dev` or `next start` on the target port).
 *
 * Env:
 * - `SITEMAP_VALIDATE_URL` — full base URL (default `http://127.0.0.1:3000`)
 * - `BASE_URL` — used if `SITEMAP_VALIDATE_URL` is unset
 */
const baseRaw = (process.env.SITEMAP_VALIDATE_URL || process.env.BASE_URL || "http://127.0.0.1:3000").trim();
const base = baseRaw.replace(/\/+$/, "");
const url = `${base}/sitemap.xml`;

async function main() {
  let res;
  try {
    res = await fetch(url, { redirect: "manual" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[validate:sitemap] fetch failed for ${url}: ${msg}`);
    console.error("[validate:sitemap] Start the app (e.g. npm run dev) or set SITEMAP_VALIDATE_URL / BASE_URL.");
    process.exit(1);
  }

  const ct = res.headers.get("content-type") || "";
  const body = await res.text();

  const failures = [];
  if (res.status !== 200) failures.push(`expected HTTP 200, got ${res.status}`);
  if (!ct.toLowerCase().includes("xml")) failures.push(`expected Content-Type to contain "xml", got "${ct}"`);

  const trimmed = body.trim();
  const lower = body.toLowerCase();
  if (!trimmed.startsWith("<?xml") && !trimmed.startsWith("<urlset")) {
    failures.push('body should start with "<?xml" or "<urlset"');
  }
  if (lower.includes("<html")) failures.push("body must not contain '<html'");
  if (lower.includes("just a moment")) failures.push('body must not contain "Just a moment"');
  if (lower.includes("application error")) failures.push('body must not contain "Application error"');
  if (body.includes("503")) failures.push('body must not contain "503"');

  if (failures.length) {
    console.error(`[validate:sitemap] ${url}`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log(`[validate:sitemap] OK ${url} (${body.length} bytes, ${ct})`);
}

await main();

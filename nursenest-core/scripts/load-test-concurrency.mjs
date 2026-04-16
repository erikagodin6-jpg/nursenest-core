#!/usr/bin/env node
/**
 * Smoke load test: concurrent GETs to health + a public API path.
 * Usage: BASE_URL=https://your-app.ondigitalocean.app node scripts/load-test-concurrency.mjs
 *
 * Expect: 0 non-2xx on /healthz; tune concurrency for your environment (default 80).
 */
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const concurrency = Math.min(200, Math.max(1, Number(process.env.CONCURRENCY ?? "80")));
const timeoutMs = Number(process.env.TIMEOUT_MS ?? "5000");

async function one(i) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const paths = [`${base}/healthz`, `${base}/api/health`];
    const path = paths[i % paths.length];
    const started = Date.now();
    const res = await fetch(path, { signal: ctrl.signal });
    const ms = Date.now() - started;
    return { ok: res.ok, status: res.status, ms, path };
  } catch (e) {
    return { ok: false, status: 0, ms: timeoutMs, err: String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const tasks = Array.from({ length: concurrency }, (_, i) => one(i));
  const results = await Promise.all(tasks);
  const bad = results.filter((r) => !r.ok || r.status >= 400);
  const slow = results.filter((r) => r.ms > 5000);
  console.log(
    JSON.stringify({
      base,
      concurrency,
      timeoutMs,
      failures: bad.length,
      slowOver5s: slow.length,
      sample: results.slice(0, 3),
    }),
  );
  if (bad.length > 0) {
    console.error("load-test failures:", bad.slice(0, 10));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

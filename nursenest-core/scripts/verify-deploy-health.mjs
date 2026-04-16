#!/usr/bin/env node
/**
 * HTTP checks for a deployed (or local) app — no Playwright.
 * Use after deploy or in CI against a preview URL.
 *
 *   BASE_URL=https://www.example.com node scripts/verify-deploy-health.mjs
 *   BASE_URL=http://127.0.0.1:3000 node scripts/verify-deploy-health.mjs
 *
 * Optional:
 *   VERIFY_READINESS=1  — also GET /api/health/ready (Postgres; may 503 if DB down)
 *   VERIFY_HTTP_TIMEOUT_MS=15000 — per-request timeout
 *
 * Exit: 0 = all checks passed, non-zero = failure.
 */
const baseRaw = process.env.BASE_URL?.trim();
if (!baseRaw) {
  console.error("verify-deploy-health: set BASE_URL (e.g. https://www.example.com or http://127.0.0.1:3000)");
  process.exit(2);
}

const base = baseRaw.replace(/\/$/, "");
const timeoutMs = Math.min(120_000, Math.max(3_000, Number(process.env.VERIFY_HTTP_TIMEOUT_MS ?? 15_000) || 15_000));
const wantReady = process.env.VERIFY_READINESS === "1" || process.env.VERIFY_READINESS === "true";

const paths = ["/healthz", "/api/health"];
if (wantReady) paths.push("/api/health/ready");

async function get(path) {
  const url = `${base}${path}`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: ac.signal,
      headers: { Accept: "application/json" },
    });
    return { path, url, status: res.status, ok: res.ok };
  } finally {
    clearTimeout(t);
  }
}

let failed = false;
for (const path of paths) {
  try {
    const r = await get(path);
    const pass = r.status >= 200 && r.status < 300;
    console.log(`${pass ? "OK" : "FAIL"} ${r.status} ${path}`);
    if (!pass) failed = true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`FAIL ${path}: ${msg}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nverify-deploy-health: one or more checks failed.");
  process.exit(1);
}
console.log("\nverify-deploy-health: all checks passed.");
process.exit(0);

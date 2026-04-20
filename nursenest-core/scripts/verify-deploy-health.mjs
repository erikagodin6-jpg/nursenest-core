#!/usr/bin/env node
/**
 * HTTP checks for a deployed (or local) app — no Playwright.
 * Use after deploy or in CI against a preview URL.
 *
 *   BASE_URL=https://www.example.com node scripts/verify-deploy-health.mjs
 *   BASE_URL=http://127.0.0.1:3000 node scripts/verify-deploy-health.mjs
 *
 * Optional second origin (e.g. DigitalOcean *.ondigitalocean.app default hostname):
 *   ORIGIN_BASE_URL=https://your-app.ondigitalocean.app
 *
 * Optional:
 *   VERIFY_READINESS=1  — also GET /api/health/ready (Postgres; may 503 if DB down)
 *   VERIFY_HTTP_TIMEOUT_MS=15000 — per-request timeout for probe paths
 *   VERIFY_CANONICAL_HOME=1 — also GET / (follow up to 10 redirects); uses VERIFY_HOME_TIMEOUT_MS (default 45000)
 *
 * Output is grouped into tiers (per BASE_URL / ORIGIN_BASE_URL):
 *   Tier 1 — platform liveness + routing readiness (/healthz, /readyz)
 *   Tier 2 — canonical homepage (GET /) when VERIFY_CANONICAL_HOME=1
 *   Tier 3 — deeper API health (/api/health, optional /api/health/ready)
 *
 * Exit: 0 = all checks passed, non-zero = failure.
 */
const baseRaw = process.env.BASE_URL?.trim();
if (!baseRaw) {
  console.error("verify-deploy-health: set BASE_URL (e.g. https://www.example.com or http://127.0.0.1:3000)");
  process.exit(2);
}

const originRaw = process.env.ORIGIN_BASE_URL?.trim();
const bases = [baseRaw.replace(/\/$/, "")];
if (originRaw) {
  const o = originRaw.replace(/\/$/, "");
  if (o !== bases[0]) bases.push(o);
}

const timeoutMs = Math.min(120_000, Math.max(3_000, Number(process.env.VERIFY_HTTP_TIMEOUT_MS ?? 15_000) || 15_000));
const homeTimeoutMs = Math.min(120_000, Math.max(5_000, Number(process.env.VERIFY_HOME_TIMEOUT_MS ?? 45_000) || 45_000));
const wantReady = process.env.VERIFY_READINESS === "1" || process.env.VERIFY_READINESS === "true";
const wantHome = process.env.VERIFY_CANONICAL_HOME === "1" || process.env.VERIFY_CANONICAL_HOME === "true";

const tier1Paths = ["/healthz", "/readyz"];
const tier3Paths = ["/api/health"];
if (wantReady) tier3Paths.push("/api/health/ready");

async function get(base, path) {
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

/** GET / with manual redirect follow (max 10) — catches document stall and redirect loops. */
async function getHome(base) {
  let current = `${base}/`;
  let redirects = 0;
  const maxRedirects = 10;
  while (redirects <= maxRedirects) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), homeTimeoutMs);
    try {
      const res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: ac.signal,
        headers: { Accept: "text/html,*/*;q=0.8" },
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) {
          return { ok: false, status: res.status, url: current, err: "redirect without Location" };
        }
        if (redirects >= maxRedirects) {
          return { ok: false, status: res.status, url: current, err: "too many redirects" };
        }
        redirects += 1;
        current = new URL(loc, current).href;
        continue;
      }
      const ok = res.status >= 200 && res.status < 400;
      return { ok, status: res.status, url: current, redirects };
    } finally {
      clearTimeout(t);
    }
  }
  return { ok: false, status: 0, url: current, err: "redirect loop cap" };
}

/** @typedef {{ base: string, tier1Failed: boolean, tier2State: "skip" | "pass" | "fail", tier3Failed: boolean }} TierSummary */

/** @type {TierSummary[]} */
const summaries = [];

let anyFailed = false;

for (const base of bases) {
  /** @type {TierSummary} */
  const summary = {
    base,
    tier1Failed: false,
    tier2State: "skip",
    tier3Failed: false,
  };

  console.log(`\n${"=".repeat(72)}\n  Base: ${base}\n${"=".repeat(72)}`);

  console.log("\n[Tier 1] Platform liveness + routing readiness");
  for (const path of tier1Paths) {
    try {
      const r = await get(base, path);
      const pass = r.status >= 200 && r.status < 300;
      console.log(`${pass ? "OK" : "FAIL"} [Tier 1] ${r.status} ${path}`);
      if (!pass) {
        summary.tier1Failed = true;
        anyFailed = true;
        console.error(`verify-deploy-health: Tier 1 FAILED — ${path} returned HTTP ${r.status} (expected 2xx).`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`FAIL [Tier 1] ${path}: ${msg}`);
      summary.tier1Failed = true;
      anyFailed = true;
      console.error(`verify-deploy-health: Tier 1 FAILED — ${path}: ${msg}`);
    }
  }

  if (wantHome) {
    summary.tier2State = "fail";
    console.log("\n[Tier 2] Canonical homepage (GET /, redirects bounded)");
    try {
      const h = await getHome(base);
      if (h.ok) {
        console.log(`OK [Tier 2] ${h.status} / (redirects: ${h.redirects ?? 0})`);
        summary.tier2State = "pass";
      } else {
        summary.tier2State = "fail";
        anyFailed = true;
        console.error(
          `FAIL [Tier 2] / — HTTP ${h.status} ${h.err ?? ""} (final URL: ${h.url})`,
        );
        console.error(
          `verify-deploy-health: Tier 2 FAILED — public homepage or edge path did not return success (see URL / redirects).`,
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`FAIL [Tier 2] /: ${msg}`);
      summary.tier2State = "fail";
      anyFailed = true;
      console.error(`verify-deploy-health: Tier 2 FAILED — GET /: ${msg}`);
    }
  } else {
    console.log("\n[Tier 2] Canonical homepage — skipped (set VERIFY_CANONICAL_HOME=1 to enable GET /)");
  }

  console.log("\n[Tier 3] Deeper API health (JSON routes; may be slower than Tier 1)");
  for (const path of tier3Paths) {
    try {
      const r = await get(base, path);
      const pass = r.status >= 200 && r.status < 300;
      console.log(`${pass ? "OK" : "FAIL"} [Tier 3] ${r.status} ${path}`);
      if (!pass) {
        summary.tier3Failed = true;
        anyFailed = true;
        console.error(
          `verify-deploy-health: Tier 3 FAILED — ${path} returned HTTP ${r.status} (expected 2xx).`,
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`FAIL [Tier 3] ${path}: ${msg}`);
      summary.tier3Failed = true;
      anyFailed = true;
      console.error(`verify-deploy-health: Tier 3 FAILED — ${path}: ${msg}`);
    }
  }

  summaries.push(summary);
}

if (anyFailed) {
  console.error("\n" + "=".repeat(72));
  console.error("verify-deploy-health: SUMMARY — one or more tiers failed.");
  for (const s of summaries) {
    const t1 = s.tier1Failed ? "FAIL" : "OK";
    const t2 =
      s.tier2State === "skip" ? "SKIP" : s.tier2State === "pass" ? "OK" : "FAIL";
    const t3 = s.tier3Failed ? "FAIL" : "OK";
    console.error(`  ${s.base} → Tier 1: ${t1} | Tier 2: ${t2} | Tier 3: ${t3}`);
  }

  for (const s of summaries) {
    const tier2OkOrSkipped = s.tier2State === "skip" || s.tier2State === "pass";
    if (s.tier3Failed && !s.tier1Failed && tier2OkOrSkipped) {
      console.error(
        "\nverify-deploy-health: NOTE — Tier 1 (and Tier 2 if enabled) passed, but Tier 3 failed.",
      );
      console.error(
        "  This pattern means: platform/readiness and (if checked) public homepage look OK, but /api/health or /api/health/ready did not succeed in time.",
      );
      console.error(
        "  Investigate: origin latency or stalls on API routes, WAF/rate limits on /api/*, Postgres from app, or raise VERIFY_HTTP_TIMEOUT_MS for slow cold paths.",
      );
    }
  }

  console.error("=".repeat(72));
  process.exit(1);
}

console.log("\nverify-deploy-health: all tiers passed for all bases.");
process.exit(0);

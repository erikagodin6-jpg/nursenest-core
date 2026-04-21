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
 *   VERIFY_NEXT_STATIC=1 — after Tier 1, fetch `/` (redirects followed), extract first `/_next/static/….(js|css)`,
 *     then GET with `Range: bytes=0-0` and cancel the body; fails if status is not 2xx or `Content-Type` is `text/html`
 *     (typical when standalone is missing `.next/static` and the app returns HTML for asset URLs)
 *   VERIFY_MARKETING_SENTINELS=1 — GET `/`, `/pricing`, `/login`, `/us/rn/nclex-rn` (HTML); fail on placeholder pricing copy,
 *     obvious stub strings, duplicate public headers, or missing `<html lang="en"` (default marketing root).
 *
 * Output is grouped into tiers (per BASE_URL / ORIGIN_BASE_URL):
 *   Tier 1 — platform liveness + routing readiness (/healthz, /readyz)
 *   Tier 1b — Next static asset MIME probe when VERIFY_NEXT_STATIC=1
 *   Tier 2 — canonical homepage (GET /) when VERIFY_CANONICAL_HOME=1
 *   Tier 3 — deeper API health (/api/health, optional /api/health/ready)
 *   Tier 4 — marketing HTML sentinels (/, /pricing, /login, /us/rn/nclex-rn) when VERIFY_MARKETING_SENTINELS=1
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
const wantNextStatic =
  process.env.VERIFY_NEXT_STATIC === "1" || process.env.VERIFY_NEXT_STATIC === "true";
const wantMarketingSentinels =
  process.env.VERIFY_MARKETING_SENTINELS === "1" || process.env.VERIFY_MARKETING_SENTINELS === "true";

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

/** Core marketing HTML + primary US RN exam hub (SSR path that must stay non-fatal under DB noise). */
const MARKETING_SENTINEL_PATHS = ["/", "/pricing", "/login", "/us/rn/nclex-rn"];

const MARKETING_SENTINEL_FORBIDDEN = [
  "Loading pricing...",
  "Loading pricing…",
  "Lorem ipsum",
  "<<stub",
  "tbd —",
  "[missing:",
  "{{missing",
];

/**
 * @param {string} base
 * @returns {Promise<{ ok: boolean; detail: string }>}
 */
async function verifyMarketingSentinels(base) {
  for (const p of MARKETING_SENTINEL_PATHS) {
    const url = `${base}${p === "/" ? "/" : p}`;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), homeTimeoutMs);
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: ac.signal,
        headers: { Accept: "text/html,*/*;q=0.8" },
      });
      if (!res.ok || res.status >= 400) {
        return { ok: false, detail: `${p} → HTTP ${res.status}` };
      }
      const html = await res.text();
      const head = html.slice(0, 12_000);
      if (!/<html[\s>]/i.test(head)) {
        return { ok: false, detail: `${p} — response does not look like HTML document` };
      }
      if (!/<html[^>]*\blang="en"/i.test(head)) {
        return { ok: false, detail: `${p} — expected root <html lang="en"…> for default marketing HTML` };
      }
      const lower = html.toLowerCase();
      for (const bad of MARKETING_SENTINEL_FORBIDDEN) {
        if (lower.includes(bad.toLowerCase())) {
          return { ok: false, detail: `${p} — forbidden substring in HTML: ${bad}` };
        }
      }
      const headerMatches = html.match(/<header[^>]*\bnn-header-animate-in\b/gi) ?? [];
      if (headerMatches.length > 1) {
        return {
          ok: false,
          detail: `${p} — duplicate marketing headers (${headerMatches.length}× nn-header-animate-in)`,
        };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, detail: `${p}: ${msg}` };
    } finally {
      clearTimeout(t);
    }
  }
  return { ok: true, detail: "marketing HTML sentinels OK for /, /pricing, /login, /us/rn/nclex-rn" };
}

/** @typedef {{ base: string, tier1Failed: boolean, tier2State: "skip" | "pass" | "fail", tier2bState: "skip" | "pass" | "fail", tier3Failed: boolean, tier4State: "skip" | "pass" | "fail" }} TierSummary */

/** @type {TierSummary[]} */
const summaries = [];

/** First fingerprinted chunk or CSS path from HTML, or null. */
function extractNextStaticAssetPath(html) {
  const m = html.match(/\/_next\/static\/(?:chunks|css)\/[^"'>\s]+\.(?:js|css)/);
  return m ? m[0] : null;
}

/**
 * @param {string} base
 * @returns {Promise<{ ok: boolean; detail: string }>}
 */
async function verifyNextStaticDelivery(base) {
  const url = `${base}/`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), homeTimeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ac.signal,
      headers: { Accept: "text/html,*/*;q=0.8" },
    });
    if (!res.ok) {
      return { ok: false, detail: `GET / returned ${res.status}` };
    }
    const html = await res.text();
    const path = extractNextStaticAssetPath(html);
    if (!path) {
      return { ok: false, detail: "no /_next/static/*.js|.css reference found in HTML" };
    }
    const assetUrl = `${base}${path}`;
    const ac2 = new AbortController();
    const t2 = setTimeout(() => ac2.abort(), timeoutMs);
    try {
      const assetRes = await fetch(assetUrl, {
        method: "GET",
        redirect: "manual",
        signal: ac2.signal,
        headers: { Range: "bytes=0-0" },
      });
      const status = assetRes.status;
      const ct = (assetRes.headers.get("content-type") || "").toLowerCase();
      try {
        await assetRes.body?.cancel();
      } catch {
        /* ignore */
      }
      if (status < 200 || status >= 300) {
        return { ok: false, detail: `GET ${path} → ${status}` };
      }
      if (ct.includes("text/html")) {
        return {
          ok: false,
          detail: `GET ${path} returned text/html (expected JS/CSS — standalone .next/static likely missing)`,
        };
      }
      return { ok: true, detail: `${path} → ${status} ${ct || "(no content-type)"}` };
    } finally {
      clearTimeout(t2);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, detail: msg };
  } finally {
    clearTimeout(t);
  }
}

let anyFailed = false;

for (const base of bases) {
  /** @type {TierSummary} */
  const summary = {
    base,
    tier1Failed: false,
    tier2State: "skip",
    tier2bState: "skip",
    tier3Failed: false,
    tier4State: "skip",
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

  if (wantNextStatic) {
    summary.tier2bState = "fail";
    console.log("\n[Tier 1b] Next.js static bundle (/_next/static/* must not be served as HTML)");
    try {
      const r = await verifyNextStaticDelivery(base);
      if (r.ok) {
        console.log(`OK [Tier 1b] ${r.detail}`);
        summary.tier2bState = "pass";
      } else {
        anyFailed = true;
        console.error(`FAIL [Tier 1b] ${r.detail}`);
        console.error(`verify-deploy-health: Tier 1b FAILED — ${r.detail}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      anyFailed = true;
      console.error(`FAIL [Tier 1b]: ${msg}`);
      console.error(`verify-deploy-health: Tier 1b FAILED — ${msg}`);
    }
  } else {
    console.log("\n[Tier 1b] Next static asset probe — skipped (set VERIFY_NEXT_STATIC=1)");
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

  if (wantMarketingSentinels) {
    summary.tier4State = "fail";
    console.log("\n[Tier 4] Marketing HTML sentinels (/, /pricing, /login, /us/rn/nclex-rn)");
    try {
      const r = await verifyMarketingSentinels(base);
      if (r.ok) {
        console.log(`OK [Tier 4] ${r.detail}`);
        summary.tier4State = "pass";
      } else {
        anyFailed = true;
        console.error(`FAIL [Tier 4] ${r.detail}`);
        console.error(`verify-deploy-health: Tier 4 FAILED — ${r.detail}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      anyFailed = true;
      summary.tier4State = "fail";
      console.error(`FAIL [Tier 4]: ${msg}`);
      console.error(`verify-deploy-health: Tier 4 FAILED — ${msg}`);
    }
  } else {
    console.log("\n[Tier 4] Marketing HTML sentinels — skipped (set VERIFY_MARKETING_SENTINELS=1)");
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
    const t2b =
      s.tier2bState === "skip" ? "SKIP" : s.tier2bState === "pass" ? "OK" : "FAIL";
    const t3 = s.tier3Failed ? "FAIL" : "OK";
    const t4 =
      s.tier4State === "skip" ? "SKIP" : s.tier4State === "pass" ? "OK" : "FAIL";
    console.error(`  ${s.base} → Tier 1: ${t1} | Tier 1b: ${t2b} | Tier 2: ${t2} | Tier 3: ${t3} | Tier 4: ${t4}`);
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

#!/usr/bin/env node
/**
 * Cloudflare cache verification script for NurseNest.
 *
 * Checks:
 *   1. CF-Cache-Status header on SEO routes (should be HIT after warm-up)
 *   2. Cache-Control header on all routes (must match expected policy)
 *   3. Auth bypass: session-cookie requests must receive BYPASS/DYNAMIC
 *   4. TTFB measurement per URL (warm vs cold)
 *   5. No private learner/admin content is cacheable
 *
 * Usage:
 *   BASE_URL=https://nursenest.ca node scripts/verify-cloudflare-cache.mjs
 *   BASE_URL=https://nursenest.ca node scripts/verify-cloudflare-cache.mjs --warm-only
 *   BASE_URL=https://nursenest.ca node scripts/verify-cloudflare-cache.mjs --cold-only
 *   BASE_URL=https://nursenest.ca node scripts/verify-cloudflare-cache.mjs --lighthouse
 *
 * Environment:
 *   BASE_URL — production or staging domain (default: https://nursenest.ca)
 *   CF_ZONE_ID — Cloudflare zone ID (required for purge-and-verify mode)
 *   CF_API_TOKEN — Cloudflare API token with Cache Purge permission
 *   VERIFY_SESSION_COOKIE — value of a real session-token cookie for auth bypass test
 */

import { performance } from "node:perf_hooks";
import { execSync } from "node:child_process";

const BASE_URL = (process.env.BASE_URL ?? "https://nursenest.ca").replace(/\/$/, "");
const WARM_ONLY = process.argv.includes("--warm-only");
const COLD_ONLY = process.argv.includes("--cold-only");
const RUN_LIGHTHOUSE = process.argv.includes("--lighthouse");
const SESSION_COOKIE = process.env.VERIFY_SESSION_COOKIE ?? "";

// ── Route definitions ────────────────────────────────────────────────────────

/** Public SEO routes that MUST be edge-cacheable. */
const CACHE_ELIGIBLE_ROUTES = [
  { path: "/advanced-ecg-nursing", expectHit: true, label: "ECG pillar" },
  { path: "/ecg/stemi-localization", expectHit: true, label: "ECG cluster — STEMI" },
  { path: "/ecg/heart-block-interpretation", expectHit: true, label: "ECG cluster — heart blocks" },
  { path: "/ecg/ventricular-tachycardia", expectHit: true, label: "ECG cluster — VT" },
  { path: "/clinical-modules", expectHit: true, label: "Clinical modules hub" },
  { path: "/ecg-interpretation", expectHit: true, label: "ECG interpretation" },
  { path: "/ecg-telemetry-mastery", expectHit: true, label: "ECG telemetry mastery" },
  { path: "/cnple-practice-questions", expectHit: true, label: "CNPLE practice Qs" },
  { path: "/cnple-flashcards", expectHit: true, label: "CNPLE flashcards" },
  { path: "/blog/ecg-interpretation-nursing-foundations-rhythm-recognition", expectHit: true, label: "ECG blog post" },
];

/** Auth-gated routes that must NEVER be cached. */
const BYPASS_REQUIRED_ROUTES = [
  { path: "/app", label: "Learner shell root" },
  { path: "/app/dashboard", label: "Learner dashboard" },
  { path: "/admin", label: "Admin root" },
  { path: "/admin/blog", label: "Admin blog" },
  { path: "/account/billing", label: "Account billing" },
  { path: "/login", label: "Login page" },
  { path: "/signup", label: "Sign-up page" },
  { path: "/modules/ecg", label: "ECG learner module (gated)" },
  { path: "/api/pricing/options", label: "Pricing API" },
];

/** Auth cookie names — any of these present means bypass required. */
const AUTH_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

// ── HTTP fetch helpers ────────────────────────────────────────────────────────

async function fetchWithTiming(url, options = {}) {
  const t0 = performance.now();
  let res;
  try {
    res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      ...options,
    });
  } catch (err) {
    return { ok: false, error: String(err), ttfbMs: Math.round(performance.now() - t0) };
  }
  const ttfbMs = Math.round(performance.now() - t0);
  return { ok: true, res, ttfbMs };
}

function getHeader(res, name) {
  return res.headers.get(name.toLowerCase()) ?? null;
}

function cfCacheStatus(res) {
  return getHeader(res, "cf-cache-status") ?? "ABSENT";
}

function cacheControlHeader(res) {
  return getHeader(res, "cache-control") ?? "ABSENT";
}

function cdnCacheControl(res) {
  return getHeader(res, "cdn-cache-control") ?? getHeader(res, "cloudflare-cdn-cache-control") ?? null;
}

// ── Test runners ─────────────────────────────────────────────────────────────

const results = [];

function pass(label, message) {
  results.push({ status: "PASS", label, message });
  console.log(`  ✅ PASS  ${label}: ${message}`);
}

function fail(label, message) {
  results.push({ status: "FAIL", label, message });
  console.error(`  ❌ FAIL  ${label}: ${message}`);
}

function warn(label, message) {
  results.push({ status: "WARN", label, message });
  console.warn(`  ⚠️  WARN  ${label}: ${message}`);
}

function info(message) {
  console.log(`  ℹ️  ${message}`);
}

// ── Test: Cache-eligible routes ───────────────────────────────────────────────

async function testCacheEligibleRoutes() {
  console.log("\n━━━━ Cache-eligible SEO routes ━━━━");

  for (const route of CACHE_ELIGIBLE_ROUTES) {
    const url = `${BASE_URL}${route.path}`;

    if (!WARM_ONLY) {
      // Cold request (may be MISS or HIT depending on current state)
      const cold = await fetchWithTiming(url, {
        headers: { "Cache-Control": "no-cache", "x-verify-cache": "cold" },
      });
      if (!cold.ok) {
        fail(route.label, `cold fetch failed — ${cold.error}`);
        continue;
      }
      const coldStatus = cfCacheStatus(cold.res);
      const coldCacheControl = cacheControlHeader(cold.res);
      info(`${route.label} [COLD] CF-Cache-Status=${coldStatus} TTFB=${cold.ttfbMs}ms CC="${coldCacheControl}"`);

      if (coldCacheControl.includes("no-store") || coldCacheControl.includes("private")) {
        // Next.js force-dynamic layouts set Cache-Control:private on child pages regardless of
        // page-level revalidate. The Cloudflare Cache Rule for these routes uses "Override origin TTL"
        // so it caches even when origin sends private. After deploying next.config.mjs changes the
        // origin should send public/s-maxage, but the Override-TTL rule means this is non-blocking.
        if (coldStatus === "ABSENT") {
          warn(
            route.label,
            `COLD: Cache-Control is "${coldCacheControl}" but Cloudflare Override-TTL rule will cache anyway. ` +
            `Deploy next.config.mjs for origin to send public/s-maxage.`,
          );
        } else if (coldStatus === "HIT") {
          // Cloudflare Override-TTL is working even though origin says private
          pass(route.label, `COLD: CF-Cache-Status=HIT despite origin sending private (Override-TTL working) ✓`);
        } else {
          warn(
            route.label,
            `COLD: Cache-Control is uncacheable ("${coldCacheControl}"). ` +
            `Ensure Cloudflare Cache Rule 3 uses "Override origin TTL" (not "Respect origin headers"). ` +
            `Deploy next.config.mjs to fix origin headers.`,
          );
        }
        // Continue to warm test — Cloudflare may still cache via Override-TTL
      }
    }

    if (!COLD_ONLY) {
      // Warm request — second hit should be HIT
      await new Promise((r) => setTimeout(r, 200)); // brief wait
      const warm = await fetchWithTiming(url);
      if (!warm.ok) {
        fail(route.label, `warm fetch failed — ${warm.error}`);
        continue;
      }
      const warmStatus = cfCacheStatus(warm.res);
      const warmCacheControl = cacheControlHeader(warm.res);
      const warmTtfb = warm.ttfbMs;
      info(`${route.label} [WARM] CF-Cache-Status=${warmStatus} TTFB=${warmTtfb}ms CC="${warmCacheControl}"`);

      if (warmStatus === "ABSENT") {
        warn(route.label, "No CF-Cache-Status header — Cloudflare not in front of origin (expected during pre-rollout)");
      } else if (warmStatus === "HIT") {
        pass(route.label, `CF-Cache-Status=HIT TTFB=${warmTtfb}ms ✓`);
      } else if (warmStatus === "MISS") {
        warn(route.label, `CF-Cache-Status=MISS (first hit for this PoP, should be HIT on next request)`);
      } else if (warmStatus === "BYPASS") {
        fail(route.label, `CF-Cache-Status=BYPASS — check Cloudflare Cache Rule is not bypassing this route`);
      } else if (warmStatus === "DYNAMIC") {
        fail(route.label, `CF-Cache-Status=DYNAMIC — page is not eligible for edge caching; check Cache-Control on origin`);
      } else {
        warn(route.label, `CF-Cache-Status=${warmStatus}`);
      }

      // Validate Cache-Control origin header
      if (!warmCacheControl.includes("s-maxage") && !warmCacheControl.includes("max-age")) {
        fail(route.label, `Cache-Control has no max-age/s-maxage: "${warmCacheControl}"`);
      } else {
        pass(`${route.label} (Cache-Control)`, `origin sends "${warmCacheControl}"`);
      }
    }
  }
}

// ── Test: Bypass-required routes ─────────────────────────────────────────────

async function testBypassRequiredRoutes() {
  console.log("\n━━━━ Bypass-required routes (must NEVER be cached) ━━━━");

  for (const route of BYPASS_REQUIRED_ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    const result = await fetchWithTiming(url);

    if (!result.ok) {
      // 404s and redirects are fine — they won't leak private content
      info(`${route.label}: fetch error (may be expected for protected routes)`);
      continue;
    }

    const cc = cacheControlHeader(result.res);
    const cfStatus = cfCacheStatus(result.res);
    const cdnCc = cdnCacheControl(result.res);

    info(`${route.label} CC="${cc}" CF-Status=${cfStatus} CDN-CC="${cdnCc ?? "—"}"`);

    // Check Cache-Control from origin
    const isBypassedByOrigin =
      cc.includes("private") ||
      cc.includes("no-store") ||
      cc.includes("no-cache");

    if (!isBypassedByOrigin) {
      fail(route.label, `Origin Cache-Control does NOT prevent caching: "${cc}" — private content could be edge-cached`);
    } else {
      pass(route.label, `Origin Cache-Control is private/no-store ✓`);
    }

    // Check Cloudflare status (only meaningful if Cloudflare is active)
    if (cfStatus !== "ABSENT") {
      if (cfStatus === "HIT") {
        fail(route.label, `CF-Cache-Status=HIT — private route is being served from cache! Immediate cache purge required.`);
      } else if (cfStatus === "BYPASS" || cfStatus === "DYNAMIC" || cfStatus === "MISS") {
        pass(route.label, `CF-Cache-Status=${cfStatus} — not cached at edge ✓`);
      }
    }
  }
}

// ── Test: Auth cookie bypass ──────────────────────────────────────────────────

async function testAuthCookieBypass() {
  console.log("\n━━━━ Auth cookie bypass verification ━━━━");

  if (!SESSION_COOKIE) {
    warn("Cookie bypass test", "No VERIFY_SESSION_COOKIE set — skipping live bypass test");
    info("To test: VERIFY_SESSION_COOKIE='<token-value>' node scripts/verify-cloudflare-cache.mjs");
    info("Expected: requests with auth cookies return CF-Cache-Status=BYPASS");
    return;
  }

  // Test each cookie name to ensure any one of them triggers bypass
  for (const cookieName of AUTH_COOKIES) {
    const url = `${BASE_URL}/advanced-ecg-nursing`;
    const result = await fetchWithTiming(url, {
      headers: { Cookie: `${cookieName}=${SESSION_COOKIE}` },
    });

    if (!result.ok) {
      fail(`Cookie bypass (${cookieName})`, `fetch failed: ${result.error}`);
      continue;
    }

    const cfStatus = cfCacheStatus(result.res);
    info(`Cookie bypass with ${cookieName}: CF-Cache-Status=${cfStatus} TTFB=${result.ttfbMs}ms`);

    if (cfStatus === "ABSENT") {
      warn(`Cookie bypass (${cookieName})`, "CF-Cache-Status absent — Cloudflare may not be active");
    } else if (cfStatus === "BYPASS" || cfStatus === "DYNAMIC") {
      pass(`Cookie bypass (${cookieName})`, `CF-Cache-Status=${cfStatus} — session cookie correctly bypasses cache ✓`);
    } else if (cfStatus === "HIT") {
      fail(`Cookie bypass (${cookieName})`, `CF-Cache-Status=HIT — authenticated request served from cache! This is a critical security issue.`);
    } else {
      warn(`Cookie bypass (${cookieName})`, `CF-Cache-Status=${cfStatus} — verify Cloudflare bypass rule matches this cookie name`);
    }
  }
}

// ── Test: TTFB comparison ────────────────────────────────────────────────────

async function measureTtfb() {
  console.log("\n━━━━ TTFB measurements (3 requests per route) ━━━━");

  const routes = [
    { path: "/", label: "Homepage (always dynamic)" },
    ...CACHE_ELIGIBLE_ROUTES.slice(0, 5).map((r) => ({ path: r.path, label: r.label })),
  ];

  console.log(`\n  ${"Route".padEnd(42)} ${"1st".padStart(7)} ${"2nd".padStart(7)} ${"3rd".padStart(7)} ${"CF Status"}`);
  console.log(`  ${"─".repeat(42)} ${"─".repeat(7)} ${"─".repeat(7)} ${"─".repeat(7)} ${"─".repeat(12)}`);

  for (const route of routes) {
    const url = `${BASE_URL}${route.path}`;
    const ttfbs = [];
    let cfStatus = "—";

    for (let i = 0; i < 3; i++) {
      const r = await fetchWithTiming(url);
      if (r.ok) {
        ttfbs.push(r.ttfbMs);
        if (i === 2) cfStatus = cfCacheStatus(r.res);
      } else {
        ttfbs.push(-1);
      }
      await new Promise((res) => setTimeout(res, 300));
    }

    const label = route.label.slice(0, 40).padEnd(42);
    const t = ttfbs.map((ms) => (ms < 0 ? "ERR" : `${ms}ms`).padStart(7)).join(" ");
    const hitMark = cfStatus === "HIT" ? " 🚀" : cfStatus === "BYPASS" ? " 🔒" : "";
    console.log(`  ${label} ${t} ${cfStatus}${hitMark}`);
  }
}

// ── Lighthouse runner (optional) ──────────────────────────────────────────────

async function runLighthouse() {
  console.log("\n━━━━ Lighthouse mobile runs ━━━━");
  const routes = [
    "/",
    "/advanced-ecg-nursing",
    "/clinical-modules",
    "/ecg/stemi-localization",
  ];

  let lighthousePath = null;
  try {
    lighthousePath = execSync("which lighthouse 2>/dev/null || npx --yes lighthouse --version 2>/dev/null", {
      encoding: "utf8",
    }).trim();
  } catch {
    warn("Lighthouse", "lighthouse CLI not found — install with: npm i -g lighthouse");
    return;
  }

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    console.log(`\n  Running Lighthouse on ${url}...`);
    try {
      execSync(
        `lighthouse "${url}" --only-categories=performance --output=json --output-path=stdout --chrome-flags="--headless --no-sandbox" --emulated-form-factor=mobile --quiet 2>/dev/null | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));const c=d.categories;console.log('  Score:', Math.round(c.performance.score*100),'LCP:', d.audits['largest-contentful-paint'].displayValue,'TBT:', d.audits['total-blocking-time'].displayValue,'CLS:', d.audits['cumulative-layout-shift'].displayValue)"`,
        { stdio: "inherit" },
      );
    } catch {
      console.log(`  Lighthouse failed for ${url} (may need Chromium)`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`║    NurseNest Cloudflare Cache Verification           ║`);
  console.log(`╚══════════════════════════════════════════════════════╝`);
  console.log(`\n  Origin: ${BASE_URL}`);
  console.log(`  Time:   ${new Date().toISOString()}\n`);

  await testCacheEligibleRoutes();
  await testBypassRequiredRoutes();
  await testAuthCookieBypass();
  await measureTtfb();

  if (RUN_LIGHTHOUSE) {
    await runLighthouse();
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const passes = results.filter((r) => r.status === "PASS").length;
  const fails = results.filter((r) => r.status === "FAIL").length;
  const warns = results.filter((r) => r.status === "WARN").length;

  console.log("\n━━━━ Summary ━━━━");
  console.log(`  ✅ PASS: ${passes}`);
  if (warns > 0) console.log(`  ⚠️  WARN: ${warns} (expected pre-Cloudflare or first-hit)`);
  if (fails > 0) {
    console.error(`  ❌ FAIL: ${fails}`);
    console.error("\n  FAILED checks:");
    results.filter((r) => r.status === "FAIL").forEach((r) => console.error(`    • ${r.label}: ${r.message}`));
  }

  const cfCacheStatusHeaders = results.filter((r) =>
    r.message?.includes("CF-Cache-Status=HIT") ||
    r.message?.includes("CF-Cache-Status=BYPASS") ||
    r.message?.includes("CF-Cache-Status=MISS"),
  );
  const isCloudflareActive = cfCacheStatusHeaders.length > 0;

  if (!isCloudflareActive) {
    console.log("\n  ℹ️  CF-Cache-Status headers are ABSENT — Cloudflare is not yet proxying traffic.");
    console.log("     Expected state before DNS cutover to orange-cloud proxy.");
    console.log("     Re-run after enabling Cloudflare proxy to verify HIT/BYPASS behavior.");
  } else {
    console.log("\n  ℹ️  Cloudflare IS proxying traffic (CF-Cache-Status headers present).");
    if (results.some((r) => r.message?.includes("no-store") || r.message?.includes("private"))) {
      console.log("  ℹ️  Some SEO routes return Cache-Control:private from origin.");
      console.log("     Ensure Cloudflare Cache Rule 3 uses 'Override origin TTL' (not 'Respect origin headers').");
      console.log("     This allows Cloudflare to cache even when origin sends private/no-store headers.");
      console.log("     Run: npm run do:deploy:execute   to deploy next.config.mjs with public/s-maxage headers.");
    }
  }

  process.exit(fails > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

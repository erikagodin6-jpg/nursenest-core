#!/usr/bin/env node
/**
 * HTTP readiness probes for local/staging Next.js before Playwright or CI gates.
 *
 * ## Modes (`APP_READY_MODE`)
 * - **guest** (default): public paths must return **HTTP 200**. Paths under protected prefixes
 *   (default `/app`) may return **302/303/307/308** when `Location` points at sign-in (`/login`,
 *   `signin`, `/api/auth`, etc.) — not treated as failure.
 * - **authenticated**: same paths must return **200**; send cookies from `APP_READY_AUTH_COOKIE`
 *   or `APP_READY_STORAGE_STATE` (Playwright storageState JSON). Optional session JSON check via
 *   `GET /api/auth/session` (expects a non-null `user` when `APP_READY_SESSION_PROBE` is not `0`).
 *
 * Legacy: `strictHttp200: false` in `waitForAppReady({...})` keeps transport-only acceptance
 * (2xx–5xx) for paths; prefer explicit `mode: "guest"` for new callers.
 *
 * Usage:
 *   node scripts/qa/wait-for-app-ready.mjs
 *   APP_READY_MODE=authenticated APP_READY_STORAGE_STATE=playwright/.auth/learner-paid.json \\
 *     PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 node scripts/qa/wait-for-app-ready.mjs
 *
 * Env:
 *   PLAYWRIGHT_BASE_URL   preferred base (Playwright convention)
 *   SCREENSHOT_BASE_URL   second choice (screenshot tooling)
 *   APP_READY_BASE_URL    explicit override for this script
 *   APP_READY_PATHS       comma-separated paths (defaults below)
 *   APP_READY_MODE        `guest` | `authenticated` (default: guest)
 *   APP_READY_PROTECTED_PREFIXES  comma-separated path prefixes treated as learner-protected in guest mode (default: /app)
 *   APP_READY_AUTH_COOKIE raw `Cookie` header value for authenticated mode
 *   APP_READY_STORAGE_STATE path to Playwright `storageState` JSON (cookies merged for authenticated mode)
 *   APP_READY_SESSION_PROBE  set to `0` to skip GET /api/auth/session user check in authenticated mode
 *   APP_READY_ENTITLEMENT_URL  optional extra GET (e.g. `/api/debug/me`) after main paths; guest+authenticated both supported
 *   APP_READY_CHECK_REDIRECT_LOOPS  set to `1` to follow redirect chains on protected guest paths and fail on loops / max hops
 *   APP_READY_REDIRECT_MAX_HOPS   max hops for loop trace (default: 10)
 *   APP_READY_TIMEOUT_MS  total wait budget (default: 300000)
 *   APP_READY_POLL_MS     interval between rounds (default: 2500)
 *   APP_READY_REQUEST_TIMEOUT_MS per-request cap (default: 5000)
 *   APP_READY_AUTH_CSRF   when not "0", also require GET /api/auth/csrf → 200 (default: 1)
 */
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

function trimBase(url) {
  return String(url ?? "")
    .trim()
    .replace(/\/$/, "");
}

const DEFAULT_BASE = trimBase(
  process.env.APP_READY_BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    process.env.SCREENSHOT_BASE_URL ||
    "http://127.0.0.1:3000",
);

const DEFAULT_PATHS_STRICT = "/,/login,/app,/pre-nursing";
const DEFAULT_PATHS_LEGACY = "/,/login,/practice-exams,/app";

const PATHS_RAW = process.env.APP_READY_PATHS?.trim();

function resolvePaths(strictHttp200) {
  const raw = PATHS_RAW || (strictHttp200 ? DEFAULT_PATHS_STRICT : DEFAULT_PATHS_LEGACY);
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const MAX_MS = Number(process.env.APP_READY_TIMEOUT_MS || "300000");
const POLL_MS = Number(process.env.APP_READY_POLL_MS || "2500");
const REQUEST_TIMEOUT_MS = Number(process.env.APP_READY_REQUEST_TIMEOUT_MS || "5000");
const REQUIRE_CSRF = process.env.APP_READY_AUTH_CSRF !== "0";
const CHECK_REDIRECT_LOOPS = process.env.APP_READY_CHECK_REDIRECT_LOOPS === "1";
const REDIRECT_MAX_HOPS = Math.max(2, Math.min(30, Number(process.env.APP_READY_REDIRECT_MAX_HOPS || "10")));
const SESSION_PROBE = process.env.APP_READY_SESSION_PROBE !== "0";

const OVERLAY_MARKERS = [
  "Failed to compile",
  "Unhandled Runtime Error",
  "missing required error components",
  "restarting dev server",
  "ChunkLoadError",
  "Next.js is compiling",
  "webpack building",
  "Application error: a client-side exception has occurred",
  "NO_SECRET",
  "NEXTAUTH_SECRET",
  "MissingSecret",
];

function statusAcceptable(code, strictHttp200) {
  if (code == null || code <= 0) return false;
  if (strictHttp200) return code === 200;
  return code >= 200 && code < 600;
}

function resolveProtectedPrefixes() {
  const raw = process.env.APP_READY_PROTECTED_PREFIXES?.trim();
  const parts = (raw || "/app")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.map((p) => (p.startsWith("/") ? p : `/${p}`));
}

/**
 * @param {string} path
 * @param {string[]} prefixes
 */
function isProtectedPath(path, prefixes) {
  const p = path.startsWith("/") ? path : `/${path}`;
  for (const pref of prefixes) {
    if (p === pref || p.startsWith(`${pref}/`)) return true;
  }
  return false;
}

function looksLikeAuthRedirectLocation(location) {
  if (!location) return false;
  const u = location.toLowerCase();
  return (
    u.includes("/login") ||
    u.includes("signin") ||
    u.includes("sign-in") ||
    u.includes("/api/auth") ||
    u.includes("/register") ||
    u.includes("callbackurl")
  );
}

/**
 * @param {string} storagePath
 * @param {string} baseOrigin
 */
function cookieHeaderFromStorageState(storagePath, baseOrigin) {
  let raw;
  try {
    raw = fs.readFileSync(storagePath, "utf8");
  } catch (e) {
    throw new Error(`APP_READY_STORAGE_STATE read failed: ${storagePath} (${e instanceof Error ? e.message : e})`);
  }
  let j;
  try {
    j = JSON.parse(raw);
  } catch {
    throw new Error(`APP_READY_STORAGE_STATE: invalid JSON: ${storagePath}`);
  }
  const origin = new URL(baseOrigin);
  const host = origin.hostname;
  /** @type {{name:string;value:string;domain:string;path:string}[]} */
  const list = Array.isArray(j.cookies) ? j.cookies : [];
  const parts = [];
  for (const c of list) {
    if (!c?.name) continue;
    const dom = String(c.domain || "").replace(/^\./, "");
    if (!dom) continue;
    if (host !== dom && !host.endsWith(`.${dom}`) && dom !== host) continue;
    parts.push(`${encodeURIComponent(c.name)}=${encodeURIComponent(String(c.value ?? ""))}`);
  }
  return parts.join("; ");
}

function resolveAuthHeaders(base) {
  const cookieRaw = process.env.APP_READY_AUTH_COOKIE?.trim();
  const storage = process.env.APP_READY_STORAGE_STATE?.trim();
  let cookie = cookieRaw || "";
  if (storage) {
    const fromFile = cookieHeaderFromStorageState(storage, base);
    if (fromFile) cookie = cookie ? `${cookie}; ${fromFile}` : fromFile;
  }
  if (!cookie) return {};
  return { Cookie: cookie };
}

/**
 * @param {string} url
 * @param {{ captureBody?: boolean; timeoutMs?: number; headers?: Record<string, string>; maxBody?: number }} [opts]
 */
function probeOnce(url, { captureBody = false, timeoutMs = REQUEST_TIMEOUT_MS, headers = {}, maxBody = 16_384 } = {}) {
  return new Promise((resolvePromise) => {
    let finished = false;
    const done = (result) => {
      if (finished) return;
      finished = true;
      resolvePromise(result);
    };
    try {
      const lib = new URL(url).protocol === "https:" ? https : http;
      const chunks = [];
      const hdrs = { Accept: "text/html,application/json;q=0.9,*/*;q=0.8", ...headers };
      const req = lib.request(
        url,
        { method: "GET", timeout: timeoutMs, headers: hdrs },
        (res) => {
          const status = res.statusCode ?? 0;
          const location = res.headers?.location ? String(res.headers.location) : "";
          if (!captureBody) {
            res.resume();
            done({ status, bodySnippet: "", error: null, errnoCode: "", location });
            return;
          }
          res.on("data", (chunk) => {
            if (chunks.length < 48) chunks.push(chunk);
          });
          res.on("end", () => {
            const bodySnippet = Buffer.concat(chunks).toString("utf8").slice(0, maxBody);
            done({ status, bodySnippet, error: null, errnoCode: "", location });
          });
        },
      );
      req.on("error", (e) => {
        const err = e instanceof Error ? e : new Error(String(e));
        const code = "code" in err && typeof err.code === "string" ? err.code : "";
        done({ status: 0, bodySnippet: "", error: err.message, errnoCode: code, location: "" });
      });
      req.on("timeout", () => {
        req.destroy();
        done({ status: 0, bodySnippet: "", error: "request_timeout", errnoCode: "", location: "" });
      });
      req.end();
    } catch (e) {
      done({
        status: 0,
        bodySnippet: "",
        error: e instanceof Error ? e.message : String(e),
        errnoCode: "",
        location: "",
      });
    }
  });
}

/**
 * Follow redirects; fail on repeated normalized URLs (loop).
 * @param {string} startUrl
 * @param {{ headers?: Record<string, string>; timeoutMs?: number; maxHops?: number }} opts
 */
async function traceRedirectChain(startUrl, opts = {}) {
  const maxHops = opts.maxHops ?? REDIRECT_MAX_HOPS;
  const headers = opts.headers ?? {};
  const timeoutMs = opts.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const chain = [];
  const seen = new Set();
  let url = startUrl;
  for (let hop = 0; hop < maxHops; hop++) {
    const r = await probeOnce(url, { captureBody: false, timeoutMs, headers });
    if (r.error) return { ok: false, chain, reason: r.error };
    chain.push({ url, status: r.status, location: r.location || "" });
    if (r.status === 200) return { ok: true, chain };
    if (![301, 302, 303, 307, 308].includes(r.status)) {
      return { ok: false, chain, reason: `unexpected_status_${r.status}` };
    }
    if (!r.location) return { ok: false, chain, reason: "missing_location" };
    let next;
    try {
      next = new URL(r.location, url).href;
    } catch {
      return { ok: false, chain, reason: "bad_location" };
    }
    const key = next;
    if (seen.has(key)) return { ok: false, chain, reason: `redirect_loop:${key}` };
    seen.add(key);
    url = next;
  }
  return { ok: false, chain, reason: "max_hops_exceeded" };
}

function classifyBodyFailure(bodySnippet) {
  if (!bodySnippet) return null;
  for (const m of OVERLAY_MARKERS) {
    if (bodySnippet.includes(m)) return `html_marker:${m}`;
  }
  return null;
}

function guestPathResult(path, r, protectedPrefixes) {
  const protectedPath = isProtectedPath(path, protectedPrefixes);
  if (r.error) {
    return { ok: false, detail: r.error + (r.errnoCode ? ` (${r.errnoCode})` : "") };
  }
  if (!protectedPath) {
    if (r.status !== 200) return { ok: false, detail: `HTTP ${r.status} (public path needs 200)` };
    const bf = classifyBodyFailure(r.bodySnippet || "");
    if (bf) return { ok: false, detail: bf };
    return { ok: true };
  }
  // Protected + guest
  if (r.status === 200) {
    const bf = classifyBodyFailure(r.bodySnippet || "");
    if (bf) return { ok: false, detail: bf };
    return { ok: true };
  }
  if ([301, 302, 303, 307, 308].includes(r.status)) {
    if (looksLikeAuthRedirectLocation(r.location || "")) return { ok: true };
    return { ok: false, detail: `HTTP ${r.status} Location=${r.location || "(none)"} (not an auth redirect)` };
  }
  return { ok: false, detail: `HTTP ${r.status}` };
}

async function probeCsrf(base, strictHttp200, timeoutMs, extraHeaders) {
  const url = `${base}/api/auth/csrf`;
  const r = await probeOnce(url, { captureBody: strictHttp200, timeoutMs, headers: extraHeaders });
  if (r.error) return { ok: false, detail: r.error + (r.errnoCode ? ` (${r.errnoCode})` : "") };
  if (!statusAcceptable(r.status, strictHttp200)) {
    return { ok: false, detail: `HTTP ${r.status}` };
  }
  if (strictHttp200) {
    const bf = classifyBodyFailure(r.bodySnippet || "");
    if (bf) return { ok: false, detail: bf };
  }
  return { ok: true };
}

async function probeAuthSessionJson(base, headers, timeoutMs) {
  const url = `${base}/api/auth/session`;
  const r = await probeOnce(url, { captureBody: true, timeoutMs, headers, maxBody: 32_768 });
  if (r.error) return { ok: false, detail: r.error };
  if (r.status !== 200) return { ok: false, detail: `HTTP ${r.status}` };
  try {
    const j = JSON.parse(r.bodySnippet || "{}");
    if (j && typeof j === "object" && j.user != null) return { ok: true };
    return { ok: false, detail: "stale_or_invalid_session (JSON has no user)" };
  } catch {
    return { ok: false, detail: "session_response_not_json" };
  }
}

async function probeOptionalEntitlementUrl(base, rel, headers, timeoutMs) {
  const path = rel.startsWith("/") ? rel : `/${rel}`;
  const url = `${base}${path}`;
  const r = await probeOnce(url, { captureBody: true, timeoutMs, headers, maxBody: 8192 });
  if (r.error) return { ok: false, detail: `${path}: ${r.error}` };
  if (r.status !== 200) return { ok: false, detail: `${path}: HTTP ${r.status}` };
  return { ok: true };
}

/**
 * @param {{ baseUrl?: string; log?: (msg: string) => void; strictHttp200?: boolean; mode?: "guest" | "authenticated" }} [opts]
 * @returns {Promise<void>}
 */
export async function waitForAppReady(opts = {}) {
  const envMode = process.env.APP_READY_MODE?.trim().toLowerCase();
  const mode =
    opts.mode ?? (envMode === "authenticated" ? "authenticated" : envMode === "guest" ? "guest" : "guest");
  const strictLegacy = opts.strictHttp200 === false;
  const strictHttp200 = strictLegacy ? false : true;
  const base = trimBase(opts.baseUrl || DEFAULT_BASE);
  const log = opts.log ?? ((m) => console.log(m));
  const paths = resolvePaths(!strictLegacy);
  const protectedPrefixes = resolveProtectedPrefixes();
  const extraHeaders =
    mode === "authenticated" ? resolveAuthHeaders(base) : {};

  if (mode === "authenticated" && !extraHeaders.Cookie) {
    throw new Error(
      "APP_READY_MODE=authenticated requires APP_READY_AUTH_COOKIE and/or APP_READY_STORAGE_STATE (Playwright storage JSON with cookies).",
    );
  }

  const pathsForLog = PATHS_RAW || (!strictLegacy ? DEFAULT_PATHS_STRICT : DEFAULT_PATHS_LEGACY);
  log(`[wait-for-app-ready] base=${base}`);
  log(`[wait-for-app-ready] mode=${mode}`);
  log(`[wait-for-app-ready] paths=${pathsForLog} (resolved: ${paths.join(",")})`);
  log(`[wait-for-app-ready] strictLegacyTransportOnly=${strictLegacy}`);
  log(`[wait-for-app-ready] protectedPrefixes(guest)=${protectedPrefixes.join(",")}`);
  log(`[wait-for-app-ready] timeoutMs=${MAX_MS}; pollMs=${POLL_MS}; requestTimeoutMs=${REQUEST_TIMEOUT_MS}`);
  if (REQUIRE_CSRF) log("[wait-for-app-ready] also requiring GET /api/auth/csrf → 200");
  if (CHECK_REDIRECT_LOOPS) log(`[wait-for-app-ready] redirect loop trace enabled (maxHops=${REDIRECT_MAX_HOPS})`);
  if (mode === "authenticated" && SESSION_PROBE) log("[wait-for-app-ready] will verify GET /api/auth/session JSON user");

  const entitlementExtra = process.env.APP_READY_ENTITLEMENT_URL?.trim();

  const started = Date.now();
  const failures = [];

  while (Date.now() - started < MAX_MS) {
    failures.length = 0;
    let allOk = true;

    for (const p of paths) {
      const remaining = MAX_MS - (Date.now() - started);
      if (remaining <= 0) {
        allOk = false;
        failures.push(`${p}: skipped (overall timeout budget exhausted)`);
        break;
      }
      const path = p.startsWith("/") ? p : `/${p}`;
      const url = `${base}${path}`;
      // When not legacy, always capture a small body slice so protected /app 200s still catch compile overlays.
      const capBody = !strictLegacy;
      const r = await probeOnce(url, {
        captureBody: capBody,
        timeoutMs: Math.max(250, Math.min(REQUEST_TIMEOUT_MS, remaining)),
        headers: extraHeaders,
      });
      if (strictLegacy) {
        if (r.error) {
          allOk = false;
          failures.push(`${path}: ${r.error}`);
          continue;
        }
        if (!statusAcceptable(r.status, false)) {
          allOk = false;
          failures.push(`${path}: HTTP ${r.status}`);
        }
        continue;
      }

      if (mode === "guest") {
        const gr = guestPathResult(path, r, protectedPrefixes);
        if (!gr.ok) {
          allOk = false;
          failures.push(`${path}: ${gr.detail}`);
        } else if (CHECK_REDIRECT_LOOPS && isProtectedPath(path, protectedPrefixes) && [301, 302, 303, 307, 308].includes(r.status)) {
          const trace = await traceRedirectChain(url, { headers: extraHeaders, maxHops: REDIRECT_MAX_HOPS });
          if (!trace.ok) {
            allOk = false;
            failures.push(`${path}: redirect_trace:${trace.reason}`);
          }
        }
        continue;
      }

      // authenticated
      if (r.error) {
        allOk = false;
        const conn =
          r.errnoCode === "ECONNREFUSED"
            ? "ECONNREFUSED (nothing listening — wrong port or server not started)"
            : r.errnoCode === "ENOTFOUND"
              ? "ENOTFOUND (bad hostname)"
              : r.error;
        failures.push(`${path}: ${conn}`);
        continue;
      }
      if (r.status !== 200) {
        allOk = false;
        failures.push(`${path}: HTTP ${r.status} (authenticated mode expects 200)`);
        continue;
      }
      const bf = classifyBodyFailure(r.bodySnippet || "");
      if (bf) {
        allOk = false;
        failures.push(`${path}: ${bf}`);
      }
    }

    if (!strictLegacy && REQUIRE_CSRF) {
      const remaining = MAX_MS - (Date.now() - started);
      const csrf =
        remaining <= 0
          ? { ok: false, detail: "skipped (overall timeout budget exhausted)" }
          : await probeCsrf(base, true, Math.max(250, Math.min(REQUEST_TIMEOUT_MS, remaining)), extraHeaders);
      if (!csrf.ok) {
        allOk = false;
        failures.push(`/api/auth/csrf: ${csrf.detail ?? "not ready"}`);
      }
    }

    if (!strictLegacy && mode === "authenticated" && SESSION_PROBE) {
      const remaining = MAX_MS - (Date.now() - started);
      const sr = await probeAuthSessionJson(
        base,
        extraHeaders,
        Math.max(250, Math.min(REQUEST_TIMEOUT_MS, remaining)),
      );
      if (!sr.ok) {
        allOk = false;
        failures.push(`/api/auth/session: ${sr.detail}`);
      }
    }

    if (!strictLegacy && entitlementExtra) {
      const remaining = MAX_MS - (Date.now() - started);
      const er = await probeOptionalEntitlementUrl(
        base,
        entitlementExtra,
        extraHeaders,
        Math.max(250, Math.min(REQUEST_TIMEOUT_MS, remaining)),
      );
      if (!er.ok) {
        allOk = false;
        failures.push(er.detail || "entitlement_url_failed");
      }
    }

    if (allOk) {
      log(`[wait-for-app-ready] OK in ${Date.now() - started}ms`);
      return;
    }

    log(`[wait-for-app-ready] not ready yet (${Date.now() - started}ms): ${failures.join(" | ")}`);
    await new Promise((r) => setTimeout(r, POLL_MS));
  }

  const failureBlob = failures.join(" | ");
  console.error("[wait-for-app-ready] TIMEOUT — common causes:");
  console.error("  • Wrong base URL — set PLAYWRIGHT_BASE_URL or SCREENSHOT_BASE_URL or APP_READY_BASE_URL.");
  console.error("  • Port clash / duplicate Next — ECONNREFUSED can mean nothing listening; two `next dev` on one port → EADDRINUSE in the server terminal. Prefer one process + PLAYWRIGHT_SKIP_WEB_SERVER=1.");
  console.error("  • Next dev still compiling — wait longer or raise APP_READY_TIMEOUT_MS (targeted bump, not global test timeouts).");
  console.error("  • Guest mode: use APP_READY_CHECK_REDIRECT_LOOPS=1 if a protected path redirect chain loops.");
  console.error("  • Authenticated mode: missing/invalid cookies — refresh APP_READY_STORAGE_STATE or APP_READY_AUTH_COOKIE.");
  console.error("  • AUTH_SECRET / NEXTAUTH_SECRET missing — use npm run dev:next (not raw next without assert) or assert-local-auth-secret.");
  console.error("  • Env validation failed during boot — inspect the Next server terminal.");
  console.error(`Last probe failures: ${failureBlob}`);
  /** Triage hints derived from last round (not a substitute for reading server logs). */
  const triage = [];
  if (/html_marker:.*(compil|webpack|Next\.js is compiling)/i.test(failureBlob)) {
    triage.push("classification=ssr_cold_or_compile — first-hit compile; pre-warm / or wait for overlay to clear.");
  }
  if (/NEXTAUTH_SECRET|NO_SECRET|MissingSecret|missing required secret/i.test(failureBlob)) {
    triage.push("classification=env_missing_secret — align secrets with dev:next / Playwright webServer env.");
  }
  if (/\/api\/auth\/csrf/i.test(failureBlob) && !/MissingSecret/i.test(failureBlob)) {
    triage.push("classification=auth_bootstrap — CSRF not 200; check AUTH_URL/NEXTAUTH_URL match PLAYWRIGHT_BASE_URL origin.");
  }
  if (/ECONNREFUSED|ENOTFOUND/.test(failureBlob)) {
    triage.push("classification=runtime_transport — server down, wrong host, or IPv4/localhost mismatch.");
  }
  if (/redirect_loop|max_hops_exceeded/.test(failureBlob)) {
    triage.push("classification=redirect_loop — middleware/session conflict; compare with Playwright redirect-loop guard.");
  }
  if (triage.length) {
    console.error("[wait-for-app-ready] Triage:", triage.join(" "));
  }
  throw new Error("wait-for-app-ready: timeout");
}

function printEnvHints() {
  console.error(`
See docs/runtime/local-runtime-modes.md, docs/runtime/playwright-local-workflow.md, and docs/environment-reference.md.
`);
}

const isMain =
  Boolean(process.argv[1]) && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const envMode = process.env.APP_READY_MODE?.trim().toLowerCase();
  const mode = envMode === "authenticated" ? "authenticated" : "guest";
  waitForAppReady({ mode })
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e instanceof Error ? e.message : e);
      printEnvHints();
      process.exit(1);
    });
}

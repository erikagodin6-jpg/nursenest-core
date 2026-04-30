#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveStandaloneServerPath } from "./verify-standalone-artifact.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const nextOutDir = path.join(packageRoot, ".next");

function ensureBuildCacheVersionEnv() {
  if (String(process.env.BUILD_CACHE_VERSION ?? "").trim()) return;

  const fromGit =
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.GITHUB_SHA?.trim() ||
    process.env.CI_COMMIT_SHA?.trim() ||
    process.env.CI_COMMIT_SHORT_SHA?.trim() ||
    process.env.SOURCE_VERSION?.trim() ||
    "";

  process.env.BUILD_CACHE_VERSION = fromGit || `local-${Date.now()}`;

  console.log(
    "[next-prod-build] build_cache_version=" +
      JSON.stringify(process.env.BUILD_CACHE_VERSION.slice(0, 20)),
  );
}

function removeNextOutputDir() {
  if (!existsSync(nextOutDir)) {
    console.log("[next-prod-build] clean_dot_next=skip");
    return;
  }

  rmSync(nextOutDir, { recursive: true, force: true });
  console.log("[next-prod-build] clean_dot_next=ok");
}

function enforceMarketingSkipDbForCompile() {
  process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD = "1";
}

const BUNDLER_ENV_KEYS = ["TURBOPACK", "IS_TURBOPACK_TEST", "NEXT_RSPACK", "NEXT_TEST_USE_RSPACK"];

for (const key of BUNDLER_ENV_KEYS) {
  delete process.env[key];
}

let nextBin;

try {
  const nextPkg = require.resolve("next/package.json");
  nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
} catch {
  console.error("[next-prod-build] FATAL: could not resolve next");
  process.exit(1);
}

if (!existsSync(nextBin)) {
  console.error("[next-prod-build] FATAL: Next CLI missing");
  process.exit(1);
}

const ensureMemScript = path.join(packageRoot, "scripts", "ensure-node-memory.mjs");
const memGuard = spawnSync(process.execPath, [ensureMemScript], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
if ((memGuard.status ?? 1) !== 0) {
  process.exit(memGuard.status ?? 1);
}

ensureBuildCacheVersionEnv();
enforceMarketingSkipDbForCompile();
removeNextOutputDir();

/**
 * `npm run build` sets heap via `run-buildpack-build.mjs`, but `node scripts/run-next-prod-build.mjs`
 * may be invoked directly (e.g. `build:compile`). Without `--max-old-space-size`, Node defaults to
 * ~2GiB and large apps OOM during `next build`.
 */
function ensureNodeHeapOption() {
  const raw = String(process.env.NODE_OPTIONS ?? "");
  if (/--max-old-space-size=\d+/.test(raw)) return;
  const heapRaw = process.env.BUILD_NODE_MAX_OLD_SPACE_SIZE_MB;
  const heapMb = heapRaw != null && String(heapRaw).trim() !== "" ? String(heapRaw).trim() : "4096";
  const flag = `--max-old-space-size=${heapMb}`;
  process.env.NODE_OPTIONS = raw.trim() ? `${raw} ${flag}` : flag;
  console.log(`[next-prod-build] applied default NODE_OPTIONS ${flag} (set BUILD_NODE_MAX_OLD_SPACE_SIZE_MB to override)`);
}

/**
 * On hosts where NODE_OPTIONS requests a heap larger than ~half of physical RAM, V8 + webpack
 * native allocations can exceed total memory and the kernel sends SIGKILL (spawnSync status null,
 * next exits 137). Cap heap so `next build` can finish on typical 8GiB CI / droplets.
 */
function capV8HeapForPhysicalRam() {
  const totalMb = Math.max(512, Math.floor(os.totalmem() / 1024 / 1024));
  const safeCapMb = Math.max(2048, Math.min(6144, Math.floor(totalMb * 0.55)));
  const raw = String(process.env.NODE_OPTIONS ?? "");
  const m = raw.match(/--max-old-space-size=(\d+)/);
  if (!m) return;
  const requested = Number.parseInt(m[1], 10);
  if (!Number.isFinite(requested) || requested <= safeCapMb) return;
  process.env.NODE_OPTIONS = raw.replace(/--max-old-space-size=\d+/, `--max-old-space-size=${safeCapMb}`);
  console.warn(
    `[next-prod-build] capped NODE_OPTIONS heap ${requested}MiB -> ${safeCapMb}MiB (physical RAM ~${totalMb}MiB) to avoid OOM during next build`,
  );
}

ensureNodeHeapOption();
capV8HeapForPhysicalRam();

function envTruthy(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? "").trim());
}
function envExplicitlyFalse(name) {
  const v = String(process.env[name] ?? "").trim();
  return v === "0" || /^false$/i.test(v);
}
const totalRamMb = Math.max(512, Math.floor(os.totalmem() / 1024 / 1024));
const autoLowMemoryHost = totalRamMb <= 9216;
const lowMemoryHeuristic =
  !envExplicitlyFalse("NN_LOW_MEMORY_BUILD") &&
  (envTruthy("NN_LOW_MEMORY_BUILD") ||
    envTruthy("CI") ||
    process.env.GITHUB_ACTIONS === "true" ||
    envTruthy("NN_APP_PLATFORM_BUILD") ||
    autoLowMemoryHost);
console.log(
  "[next-prod-build] compile_profile",
  JSON.stringify({
    lowMemoryHeuristic,
    totalRamMb,
    NN_LOW_MEMORY_BUILD: process.env.NN_LOW_MEMORY_BUILD ?? null,
    CI: process.env.CI ?? null,
    GITHUB_ACTIONS: process.env.GITHUB_ACTIONS ?? null,
    NN_APP_PLATFORM_BUILD: process.env.NN_APP_PLATFORM_BUILD ?? null,
    NODE_OPTIONS_has_heap: /--max-old-space-size=\d+/.test(String(process.env.NODE_OPTIONS ?? "")),
  }),
);

/** Site-wide production gates (marketing JSON, route manifest, theme chrome, forbidden copy). */
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
console.log("[next-prod-build] validate:production-surface_start");
const validateSurface = spawnSync(npmCmd, ["run", "validate:production-surface"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
if ((validateSurface.status ?? 1) !== 0) {
  console.error("[next-prod-build] FATAL: validate:production-surface failed");
  process.exit(validateSurface.status ?? 1);
}
console.log("[next-prod-build] validate:production-surface_ok");

const lessonIndexesForBuild = path.join(packageRoot, "scripts", "run-lesson-indexes-for-build.mjs");
const lessonIndexes = spawnSync(process.execPath, [lessonIndexesForBuild], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
if ((lessonIndexes.status ?? 1) !== 0) {
  console.error("[next-prod-build] FATAL: pathway lesson index build/verify failed (see [lesson-indexes] logs)");
  process.exit(lessonIndexes.status ?? 1);
}

/**
 * 🔥 CRITICAL FIX:
 * REMOVE "--webpack"
 */
console.log(`[next-prod-build] next_cli_invocation_start pid=${process.pid}`);
const r = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
console.log(
  `[next-prod-build] next_cli_invocation_end status=${r.status ?? "null"} signal=${r.signal ?? "null"}`,
);

if (r.error) {
  console.error("[next-prod-build] FATAL: failed to spawn `next build`", r.error);
  process.exit(1);
}
if (r.signal != null) {
  console.error(
    `[next-prod-build] FATAL: next build process was terminated by signal ${r.signal} (common causes: OOM killer, container memory limit, manual interrupt).`,
  );
  process.exit(1);
}
if (r.status !== 0) {
  process.exit(r.status ?? 1);
}

function assertNonEmptyDir(label, dir, filter) {
  if (!existsSync(dir)) {
    console.error(`[next-prod-build] FATAL: next build reported success but ${label} is missing: ${dir}`);
    process.exit(1);
  }
  let names;
  try {
    names = readdirSync(dir).filter(filter);
  } catch (e) {
    console.error(`[next-prod-build] FATAL: could not read ${label} dir ${dir}`, e);
    process.exit(1);
  }
  if (names.length === 0) {
    console.error(`[next-prod-build] FATAL: next build reported success but ${label} is empty: ${dir}`);
    process.exit(1);
  }
}

const staticRoot = path.join(nextOutDir, "static");
const standaloneRoot = path.join(nextOutDir, "standalone");
if (!existsSync(staticRoot)) {
  console.error(
    `[next-prod-build] FATAL: next build exited 0 but ${staticRoot} is missing — build output incomplete (check prior Next logs for silent/font/network failures).`,
  );
  process.exit(1);
}
if (!existsSync(standaloneRoot)) {
  console.error(
    `[next-prod-build] FATAL: next build exited 0 but ${standaloneRoot} is missing — output: "standalone" requires a full production compile.`,
  );
  process.exit(1);
}
assertNonEmptyDir("static/css", path.join(staticRoot, "css"), (n) => n.endsWith(".css"));
assertNonEmptyDir("static/chunks", path.join(staticRoot, "chunks"), (n) => n.endsWith(".js"));
const standaloneServer = resolveStandaloneServerPath(packageRoot);
if (!standaloneServer) {
  console.error(
    "[next-prod-build] FATAL: next build exited 0 but no server.js was found under .next/standalone.",
  );
  process.exit(1);
}
console.log(`[next-prod-build] next_build_artifacts_ok=1 standalone_server=${standaloneServer}`);

/** Every `output: "standalone"` build must sync `.next/static` next to `server.js` before `npm run start` or smoke tests (idempotent). */
const ensureStandaloneStatic = path.join(packageRoot, "scripts", "ensure-standalone-static.mjs");
const sync = spawnSync(process.execPath, [ensureStandaloneStatic], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
if (sync.status !== 0) {
  process.exit(sync.status ?? 1);
}
console.log("[next-prod-build] ensure_standalone_static_ok=1");

const verifyStandaloneScript = path.join(packageRoot, "scripts", "verify-standalone-artifact.mjs");
const verifyStandalone = spawnSync(process.execPath, [verifyStandaloneScript], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
if ((verifyStandalone.status ?? 1) !== 0) {
  console.error("[next-prod-build] FATAL: verify-standalone-artifact failed");
  process.exit(verifyStandalone.status ?? 1);
}
console.log("[next-prod-build] verify_standalone_artifact_ok=1");

process.exit(0);
#!/usr/bin/env node
/**
 * Runs `next build --webpack` with a clean bundler environment.
 *
 * Next.js 16 defaults to **Turbopack** when no bundler is selected (`next/dist/lib/bundler.js`).
 * If the host sets `TURBOPACK` (or related test flags), `parseBundlerArgs` can select Turbopack **even when**
 * the intent is webpack — or it can error when both conflict. Turbopack production builds use
 * `turbopackBuild` and do **not** populate `.next/cache/webpack` the same way webpack does.
 *
 * This wrapper deletes bundler-selection env keys, normalizes **`NODE_OPTIONS` `--max-old-space-size`**
 * against **`BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`** (so a global 6144-style heap cannot leak into the Next child), then
 * spawns the Next CLI. **`package.json` `build:compile`** sets `NODE_OPTIONS=--max-old-space-size=…` from
 * `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` only (does not inherit `${NODE_OPTIONS:-…}`) so the **wrapper** Node process
 * is not started with a platform-wide 6144 MB heap. App Platform: set `NODE_OPTIONS` + `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`
 * to the same value under **BUILD_TIME** in `.do/app-nursenest-core-next.yaml`. Runtime behavior of the app is unchanged.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const nextOutDir = path.join(packageRoot, ".next");

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

/** Per-compile cache key segment for Next `unstable_cache` (see `cacheDeploymentRevision`). */
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
      JSON.stringify(process.env.BUILD_CACHE_VERSION.slice(0, 20)) +
      (fromGit ? " source=git_sha" : " source=ephemeral_timestamp"),
  );
}

/**
 * Heroku/DO historically restored `package.json` `cacheDirectories` including `.next/cache`, which could
 * reuse webpack/swc entries across deploys. We always remove `.next` before `next build` so the compile
 * tree and Data Cache filestore for this slug are fresh for this workspace.
 */
function removeNextOutputDir() {
  if (!existsSync(nextOutDir)) {
    console.log("[next-prod-build] clean_dot_next=skip missing");
    return;
  }
  rmSync(nextOutDir, { recursive: true, force: true });
  console.log("[next-prod-build] clean_dot_next=ok removed=" + nextOutDir);
}

function enforceMarketingSkipDbForCompile() {
  const raw = String(process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD ?? "").trim().toLowerCase();
  if (raw === "false" || raw === "0") {
    console.log("[next-prod-build] marketing_blog_skip_db_for_build=0 (explicit false; blog may query DB during SSG)");
    return;
  }
  process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD = "1";
  console.log("[next-prod-build] marketing_blog_skip_db_for_build=1 (default for production compile)");
}

function runPublicContentPipelineProbeIfConfigured() {
  if (truthyEnv("NN_SKIP_PUBLIC_CONTENT_PIPELINE_PROBE")) {
    console.log("[next-prod-build] public_content_probe=skip NN_SKIP_PUBLIC_CONTENT_PIPELINE_PROBE=1");
    return 0;
  }
  if (!String(process.env.DATABASE_URL ?? "").trim()) {
    console.log("[next-prod-build] public_content_probe=skip no_database_url");
    return 0;
  }
  console.log("[next-prod-build] public_content_probe=run strict");
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const r = spawnSync(npmCmd, ["run", "data:public-content-pipeline-probe:strict"], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  });
  return r.status === 0 ? 0 : r.status ?? 1;
}

function logEffectiveHeapMb(label) {
  const m = String(process.env.NODE_OPTIONS ?? "").match(/--max-old-space-size=(\d+)/);
  console.log(
    "[next-prod-build] " +
      label +
      " max_old_space_size_mb=" +
      (m ? m[1] : "(none)") +
      " build_node_max_mb_env=" +
      JSON.stringify(process.env.BUILD_NODE_MAX_OLD_SPACE_SIZE_MB ?? ""),
  );
}

const BUNDLER_ENV_KEYS = ["TURBOPACK", "IS_TURBOPACK_TEST", "NEXT_RSPACK", "NEXT_TEST_USE_RSPACK"];

const stripped = [];
for (const key of BUNDLER_ENV_KEYS) {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    stripped.push(`${key}=${String(process.env[key])}`);
    delete process.env[key];
  }
}
if (stripped.length > 0) {
  console.log(
    "[next-prod-build] stripped_bundler_env=" +
      JSON.stringify(stripped) +
      " note=host-injected Turbopack/Rspack flags would skip webpack filesystem cache (.next/cache/webpack)",
  );
} else {
  console.log("[next-prod-build] stripped_bundler_env=[] note=webpack disk cache path should populate under .next/cache/webpack");
}

logEffectiveHeapMb("build_start_parent_process");

/** Prefer `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` for the Next child; strip any inherited heap flags (e.g. UI 6144). */
const heapMbRaw = String(process.env.BUILD_NODE_MAX_OLD_SPACE_SIZE_MB ?? "4096").trim();
const heapMb = /^\d+$/.test(heapMbRaw) ? heapMbRaw : "4096";
let nodeOpts = String(process.env.NODE_OPTIONS ?? "");
const beforeHeap = nodeOpts;
nodeOpts = nodeOpts
  .replace(/\s*--max-old-space-size=\d+\s*/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const heapFlag = `--max-old-space-size=${heapMb}`;
process.env.NODE_OPTIONS = nodeOpts ? `${nodeOpts} ${heapFlag}` : heapFlag;
if (beforeHeap.includes("max-old-space-size") && !beforeHeap.includes(`--max-old-space-size=${heapMb}`)) {
  console.log(
    "[next-prod-build] normalized_node_heap_mb=" +
      heapMb +
      " note=replaced or appended NODE_OPTIONS heap for next build child (BUILD_NODE_MAX_OLD_SPACE_SIZE_MB)",
  );
}

logEffectiveHeapMb("before_spawn_next_child");

/** One-line snapshot for DO build triage (hypothesis: env drift vs next.config). No secrets — flags/short strings only. */
const diag = (k) => String(process.env[k] ?? "");
const diagB = (k) => (diag(k).trim() ? "1" : "0");
console.log(
  "[build-diagnostic] " +
    [
      `sentry=${diag("SENTRY_ENABLED") || "unset"}`,
      `heavyTasks=${diag("RUN_HEAVY_BUILD_TASKS") || "unset"}`,
      `skipI18n=${diag("SKIP_I18N_PREBUILD") || "unset"}`,
      `forceSingle=${diagB("NN_FORCE_SINGLE_BUILD_WORKER")}`,
      `nnAppPlatform=${diagB("NN_APP_PLATFORM_BUILD")}`,
      `lowMemGen=${diagB("BUILD_LOW_MEMORY_STATIC_GENERATION")}`,
      `allowMulti=${diagB("NN_ALLOW_MULTI_BUILD_WORKERS")}`,
      `webpackPar=${diag("BUILD_WEBPACK_PARALLELISM") || "unset"}`,
      `heapMbEnv=${diag("BUILD_NODE_MAX_OLD_SPACE_SIZE_MB") || "unset"}`,
      `doId=${diagB("DIGITALOCEAN_APP_ID")}`,
    ].join(" "),
);

let nextBin;
try {
  const nextPkg = require.resolve("next/package.json");
  nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
} catch {
  console.error("[next-prod-build] FATAL: could not resolve next/package.json (run npm ci from nursenest-core)");
  process.exit(1);
}

if (!existsSync(nextBin)) {
  console.error(`[next-prod-build] FATAL: Next CLI missing at ${nextBin}`);
  process.exit(1);
}

ensureBuildCacheVersionEnv();
enforceMarketingSkipDbForCompile();
removeNextOutputDir();

const r = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

if (r.status !== 0) {
  process.exit(r.status ?? 1);
}

const probeStatus = runPublicContentPipelineProbeIfConfigured();
process.exit(probeStatus === 0 ? 0 : probeStatus ?? 1);

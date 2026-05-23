#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveStandaloneServerPath } from "./verify-standalone-artifact.mjs";
import { acquireExclusiveNextBuildLock, releaseExclusiveNextBuildLock } from "./next-build-exclusive.mjs";
import {
  createBuildMetricsRun,
  finishBuildMetricsRun,
  persistBuildMetricsRun,
  recordBuildPhase,
} from "./build-runtime-metrics.mjs";
import { collectBuildGraphIsolationSnapshot } from "./build-graph-isolation-metrics.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const nextOutDir = path.join(packageRoot, ".next");
const metricsRun = createBuildMetricsRun({ kind: "next-prod-build" });

/** Structured timing + RSS-ish heap for CI log parsers (`phase_ms` stays grep-friendly). */
function logPhaseMs(name, durationMs) {
  const m = process.memoryUsage();
  recordBuildPhase(metricsRun, name, durationMs, {
    heapUsedMb: Math.round(m.heapUsed / (1024 * 1024)),
    rssMb: Math.round(m.rss / (1024 * 1024)),
  });
  console.error(
    `[next-prod-build] phase_ms ${JSON.stringify({
      name,
      durationMs,
      heapUsedMb: Math.round(m.heapUsed / (1024 * 1024)),
      rssMb: Math.round(m.rss / (1024 * 1024)),
    })}`,
  );
}

function readProcFile(pathname) {
  try {
    return readFileSync(pathname, "utf8");
  } catch {
    return "";
  }
}

function rssMbForPid(pid) {
  const status = readProcFile(`/proc/${pid}/status`);
  const match = status.match(/^VmRSS:\s+(\d+)\s+kB/m);
  if (!match) return 0;
  return Math.round(Number(match[1]) / 1024);
}

function childPidsForPid(pid) {
  const raw = readProcFile(`/proc/${pid}/task/${pid}/children`).trim();
  if (!raw) return [];
  return raw
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value) && value > 0);
}

function processTreeRssMb(rootPid) {
  const seen = new Set();
  const stack = [rootPid];
  let total = 0;
  while (stack.length) {
    const pid = stack.pop();
    if (!pid || seen.has(pid)) continue;
    seen.add(pid);
    total += rssMbForPid(pid);
    stack.push(...childPidsForPid(pid));
  }
  return { rssMb: total, processCount: seen.size };
}

function runNextBuildWithMemorySampling(nextArgs = ["build"]) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [nextBin, ...nextArgs], {
      cwd: packageRoot,
      stdio: "inherit",
      env: process.env,
    });
    const startedAt = Date.now();
    let peakRssMb = 0;
    let peakProcessCount = 0;
    let lastLogAt = 0;

    const sample = () => {
      if (!child.pid) return;
      const sample = processTreeRssMb(child.pid);
      if (sample.rssMb > peakRssMb) {
        peakRssMb = sample.rssMb;
        peakProcessCount = sample.processCount;
      }
      const now = Date.now();
      if (now - lastLogAt >= 30_000) {
        lastLogAt = now;
        console.error(
          `[next-prod-build] next_build_memory_sample ${JSON.stringify({
            elapsedMs: now - startedAt,
            rssMb: sample.rssMb,
            processCount: sample.processCount,
            peakRssMb,
            peakProcessCount,
          })}`,
        );
      }
    };

    const interval = setInterval(sample, 1000);
    sample();

    child.on("error", (error) => {
      clearInterval(interval);
      resolve({ status: null, signal: null, error, peakRssMb, peakProcessCount });
    });
    child.on("exit", (status, signal) => {
      sample();
      clearInterval(interval);
      console.error(
        `[next-prod-build] next_build_memory_peak ${JSON.stringify({
          peakRssMb,
          peakProcessCount,
          durationMs: Date.now() - startedAt,
          status,
          signal,
        })}`,
      );
      resolve({ status, signal, error: null, peakRssMb, peakProcessCount });
    });
  });
}

function runNextBuild(nextArgs = ["build"]) {
  if (envTruthy("NN_SAMPLE_NEXT_BUILD_MEMORY")) {
    return runNextBuildWithMemorySampling(nextArgs);
  }

  const child = spawnSync(process.execPath, [nextBin, ...nextArgs], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  });

  return Promise.resolve({
    status: child.status,
    signal: child.signal,
    error: child.error ?? null,
    peakRssMb: 0,
    peakProcessCount: 0,
  });
}

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

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      rmSync(nextOutDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
      console.log(`[next-prod-build] clean_dot_next=ok attempt=${attempt}`);
      return;
    } catch (e) {
      if (attempt === 3) {
        console.error(
          `[next-prod-build] FATAL: clean_dot_next failed after retries ${JSON.stringify({
            code: e?.code ?? null,
            path: e?.path ?? nextOutDir,
            message: e?.message ?? String(e),
          })}`,
        );
        process.exit(1);
      }
      console.warn(
        `[next-prod-build] clean_dot_next_retry ${JSON.stringify({
          attempt,
          code: e?.code ?? null,
          path: e?.path ?? nextOutDir,
        })}`,
      );
    }
  }
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
  const heapMb = heapRaw != null && String(heapRaw).trim() !== "" ? String(heapRaw).trim() : "2816";
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

if (envTruthy("NN_APPLY_NEXT_BUILD_HEAP_LIMIT")) {
  ensureNodeHeapOption();
  capV8HeapForPhysicalRam();
} else {
  const rawNodeOptions = String(process.env.NODE_OPTIONS ?? "");
  process.env.NODE_OPTIONS = rawNodeOptions.replace(/--max-old-space-size=\d+/, "").replace(/\s+/g, " ").trim();
  console.log("[next-prod-build] node_heap_limit=none");
}

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
    preferredBundler: !envExplicitlyFalse("NN_FORCE_WEBPACK_BUILD") &&
      (envTruthy("NN_FORCE_WEBPACK_BUILD") || lowMemoryHeuristic)
      ? "webpack"
      : "turbopack",
  }),
);

const useWebpackBuild =
  !envExplicitlyFalse("NN_FORCE_WEBPACK_BUILD") &&
  (envTruthy("NN_FORCE_WEBPACK_BUILD") || lowMemoryHeuristic);

if (useWebpackBuild) {
  process.env.NEXT_DISABLE_TURBOPACK = "1";
}

if (!String(process.env.NEXT_TELEMETRY_DISABLED ?? "").trim()) {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
}
if (!String(process.env.NN_FORCE_SINGLE_BUILD_WORKER ?? "").trim()) {
  process.env.NN_FORCE_SINGLE_BUILD_WORKER = "true";
}

const graphIsolationSnapshot = collectBuildGraphIsolationSnapshot({ packageRoot });
metricsRun.graphIsolation = graphIsolationSnapshot;
Object.assign(metricsRun.counts, {
  routeCount: graphIsolationSnapshot.routeCount,
  layoutCount: graphIsolationSnapshot.layoutCount,
  pageCount: graphIsolationSnapshot.pageCount,
  sourceModuleCount: graphIsolationSnapshot.sourceModuleCount,
  appSourceModuleCount: graphIsolationSnapshot.appSourceModuleCount,
  importedRegistryCounts: graphIsolationSnapshot.importedRegistryCounts,
});
console.log("[next-prod-build] compile_graph_snapshot", JSON.stringify(graphIsolationSnapshot));

let buildLockHeld = false;
try {
  acquireExclusiveNextBuildLock(packageRoot);
  buildLockHeld = true;
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e.code === "ELOCKED") {
    console.error(String(e.message ?? e));
    process.exit(1);
  }
  throw e;
}

console.error(
  `[next-prod-build] phase_start ${JSON.stringify({
    phase: "next_build",
    pid: process.pid,
    bundler: useWebpackBuild ? "webpack" : "turbopack",
  })}`,
);
const nextBuildArgs = [
  "build",
  ...(useWebpackBuild ? ["--webpack"] : []),
  ...(envExplicitlyFalse("NN_NEXT_BUILD_DEBUG") ? [] : ["--debug"]),
];
console.log(
  `[next-prod-build] next_cli_invocation_start pid=${process.pid} bundler=${useWebpackBuild ? "webpack" : "turbopack"} args=${JSON.stringify(nextBuildArgs)}`,
);
const tNext = Date.now();
const memoryLogInterval = setInterval(() => {
  try {
    const m = process.memoryUsage();
    console.log("[mem]", {
      rss: Math.round(m.rss / 1024 / 1024),
      heapUsed: Math.round(m.heapUsed / 1024 / 1024),
    });
  } catch (error) {
    console.error("[mem] sampling_failed", error);
  }
}, 30000);
let r;
try {
  r = await runNextBuild(nextBuildArgs);
} finally {
  clearInterval(memoryLogInterval);
  if (buildLockHeld) {
    releaseExclusiveNextBuildLock(packageRoot);
    buildLockHeld = false;
  }
}
const nextBuildMs = Date.now() - tNext;
metricsRun.memory.peakRssMb = r.peakRssMb;
metricsRun.memory.peakProcessCount = r.peakProcessCount;
console.log(
  `[next-prod-build] next_cli_invocation_end status=${r.status ?? "null"} signal=${r.signal ?? "null"}`,
);
logPhaseMs("next_build", nextBuildMs);
console.error(`[next-prod-build] phase_end ${JSON.stringify({ phase: "next_build", durationMs: nextBuildMs })}`);

if (r.error) {
  console.error("[next-prod-build] FATAL: failed to spawn `next build`", r.error);
  finishBuildMetricsRun(metricsRun, { counts: { failedPhase: "next_build" } });
  persistBuildMetricsRun(metricsRun);
  process.exit(1);
}
if (r.signal != null) {
  console.error(
    `[next-prod-build] FATAL: next build process was terminated by signal ${r.signal} (common causes: OOM killer, container memory limit, manual interrupt).`,
  );
  finishBuildMetricsRun(metricsRun, { counts: { failedPhase: "next_build", signal: r.signal } });
  persistBuildMetricsRun(metricsRun);
  process.exit(1);
}
if (r.status !== 0) {
  finishBuildMetricsRun(metricsRun, { counts: { failedPhase: "next_build", exitCode: r.status } });
  persistBuildMetricsRun(metricsRun);
  process.exit(r.status ?? 1);
}

function listFilesRecursive(dir, predicate, out = []) {
  if (!existsSync(dir)) {
    return out;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFilesRecursive(fullPath, predicate, out);
      continue;
    }
    if (predicate(entry.name, fullPath)) {
      out.push(fullPath);
    }
  }
  return out;
}

function assertNonEmptyCssOutput(staticRoot) {
  const cssFiles = listFilesRecursive(staticRoot, (name) => name.endsWith(".css"));
  if (cssFiles.length === 0) {
    console.error(
      `[next-prod-build] FATAL: next build reported success but no CSS assets were found under ${staticRoot}`,
    );
    process.exit(1);
  }
}

function assertNonEmptyDir(label, dir, filter) {
  if (!existsSync(dir)) {
    console.error(`[next-prod-build] FATAL: next build reported success but ${label} is missing: ${dir}`);
    process.exit(1);
  }
  let matches;
  try {
    matches = listFilesRecursive(dir, (name) => filter(name));
  } catch (e) {
    console.error(`[next-prod-build] FATAL: could not scan ${label} dir ${dir}`, e);
    process.exit(1);
  }
  if (matches.length === 0) {
    console.error(
      `[next-prod-build] FATAL: next build reported success but ${label} has no matching files under ${dir}`,
    );
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
assertNonEmptyCssOutput(staticRoot);
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
const tStand = Date.now();
const sync = spawnSync(process.execPath, [ensureStandaloneStatic], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
const ensureStandaloneMs = Date.now() - tStand;
if (sync.status !== 0) {
  process.exit(sync.status ?? 1);
}
console.log("[next-prod-build] ensure_standalone_static_ok=1");
logPhaseMs("ensure_standalone_static", ensureStandaloneMs);

const verifyStandaloneScript = path.join(packageRoot, "scripts", "verify-standalone-artifact.mjs");
const tVerify = Date.now();
const verifyStandalone = spawnSync(process.execPath, [verifyStandaloneScript], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
const verifyStandaloneMs = Date.now() - tVerify;
if ((verifyStandalone.status ?? 1) !== 0) {
  console.error("[next-prod-build] FATAL: verify-standalone-artifact failed");
  process.exit(verifyStandalone.status ?? 1);
}
console.log("[next-prod-build] verify_standalone_artifact_ok=1");
logPhaseMs("verify_standalone_artifact", verifyStandaloneMs);

finishBuildMetricsRun(metricsRun, {
  counts: {
    staticAssetFiles: listFilesRecursive(staticRoot, () => true).length,
    standaloneFiles: listFilesRecursive(standaloneRoot, () => true).length,
    peakNextProcessCount: r.peakProcessCount,
  },
  memory: {
    peakRssMb: r.peakRssMb,
    peakProcessCount: r.peakProcessCount,
  },
});
persistBuildMetricsRun(metricsRun);

process.exit(0);

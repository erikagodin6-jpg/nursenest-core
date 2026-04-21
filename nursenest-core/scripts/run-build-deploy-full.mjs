#!/usr/bin/env node
/**
 * Production `build:deploy:full` orchestrator.
 *
 * - **DigitalOcean App Platform (typical):** `next build` runs in `heroku-postbuild` (before cache snapshot);
 *   App Platform `build_command` uses `npm run build:deploy` → post-compile steps only. Use this script for
 *   **one-shot** `build:deploy:full` (droplet/CI): skips `build:compile` when `DIGITALOCEAN_APP_ID` is set and
 *   `.next/BUILD_ID` already exists — duplicate_build_guard.
 * - **Other hosts / CI:** runs `npm run build:compile` when no prior artifact is present.
 *
 * Set `NN_FORCE_NEXT_COMPILE=1` to always run `next build` here (debug / recovery).
 *
 * Set `NN_TIMED_INCLUDE_NPM_PRUNE=1` to run `npm prune --omit=dev` as the final timed step.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const buildIdPath = path.join(packageRoot, ".next", "BUILD_ID");
const nextCachePath = path.join(packageRoot, ".next", "cache");

function onDigitalOceanAppPlatform() {
  return Boolean(String(process.env.DIGITALOCEAN_APP_ID ?? "").trim());
}

function shouldSkipNextCompileAfterBuildpack() {
  if (truthyEnv("NN_FORCE_NEXT_COMPILE")) return false;
  if (!onDigitalOceanAppPlatform()) return false;
  return existsSync(buildIdPath);
}

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? ""));
}

function logTiming(label, ms) {
  console.log(`[build-deploy-full] ${label} duration_ms=${ms}`);
}

function npmRun(script) {
  const r = spawnSync(npm, ["run", script], { cwd: packageRoot, stdio: "inherit" });
  return r.status ?? 1;
}

function nodeScript(relFromPackageRoot) {
  const scriptPath = path.join(packageRoot, relFromPackageRoot);
  const r = spawnSync(process.execPath, [scriptPath], { cwd: packageRoot, stdio: "inherit" });
  return r.status ?? 1;
}

function runStep(label, fn) {
  const t0 = Date.now();
  const status = fn();
  logTiming(label, Date.now() - t0);
  if (status !== 0) {
    process.exit(status ?? 1);
  }
}

const tPipeline = Date.now();

console.log(
  `[build-deploy-full] pipeline_start ts_iso=${new Date().toISOString()} package_root=${packageRoot}`,
);
console.log(
  "[build-deploy-full] cache_note=Heroku/DO Node buildpack restores cacheDirectories (node_modules + .next/cache) before install; npm run build must run next build before cache snapshot.",
);
console.log(
  `[build-deploy-full] pre_step dot_next_cache_present=${existsSync(nextCachePath) ? "1" : "0"} BUILD_ID_present=${existsSync(buildIdPath) ? "1" : "0"} digitalocean=${onDigitalOceanAppPlatform() ? "1" : "0"}`,
);

runStep("verify:bootstrap-probe-pathname", () => npmRun("verify:bootstrap-probe-pathname"));
runStep("validate-marketing-production-surface", () =>
  nodeScript(path.join("scripts", "validate-marketing-production-surface.mjs")),
);

if (shouldSkipNextCompileAfterBuildpack()) {
  console.log(
    "[build-deploy-full] duplicate_build_guard=skip_next_compile (BUILD_ID present after buildpack npm run build; next_compile_count_this_script=0)",
  );
} else {
  if (onDigitalOceanAppPlatform() && !existsSync(buildIdPath)) {
    console.log(
      "[build-deploy-full] duplicate_build_guard=compile_required (DO build but no BUILD_ID — buildpack build may have been skipped; running next build here)",
    );
  } else {
    console.log("[build-deploy-full] duplicate_build_guard=run_next_compile (next_compile_count_this_script=1)");
  }
  runStep("npm_run_build_compile", () => npmRun("build:compile"));
}
runStep("verify_standalone_artifact", () => npmRun("verify:standalone-artifact"));
runStep("ensure_standalone_static", () => nodeScript(path.join("scripts", "ensure-standalone-static.mjs")));
runStep("post_build_prune", () => nodeScript(path.join("scripts", "post-build-prune.mjs")));

if (truthyEnv("NN_TIMED_INCLUDE_NPM_PRUNE")) {
  runStep("npm_prune", () => {
    const r = spawnSync(npm, ["prune", "--omit=dev", "--no-fund", "--no-audit"], {
      cwd: packageRoot,
      stdio: "inherit",
    });
    return r.status === 0 ? 0 : r.status ?? 1;
  });
}

console.log(
  `[build-deploy-full] post_pipeline dot_next_cache_present=${existsSync(nextCachePath) ? "1" : "0"} BUILD_ID_present=${existsSync(buildIdPath) ? "1" : "0"}`,
);
logTiming("build_deploy_full_total", Date.now() - tPipeline);

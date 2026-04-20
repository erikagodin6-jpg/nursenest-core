#!/usr/bin/env node
/**
 * Production `build:deploy:full` orchestrator (single `next build` via `npm run build`).
 * Logs wall-clock ms per blocking step for App Platform / CI visibility.
 *
 * Set `NN_TIMED_INCLUDE_NPM_PRUNE=1` to run `npm prune --omit=dev` as the final timed step
 * (use instead of a separate `npm prune` in `build_command` so prune duration appears in logs).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

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

runStep("verify:bootstrap-probe-pathname", () => npmRun("verify:bootstrap-probe-pathname"));
runStep("validate-marketing-production-surface", () =>
  nodeScript(path.join("scripts", "validate-marketing-production-surface.mjs")),
);
runStep("npm_run_build", () => npmRun("build"));
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

logTiming("build_deploy_full_total", Date.now() - tPipeline);

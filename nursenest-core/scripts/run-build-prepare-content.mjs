#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createBuildMetricsRun,
  finishBuildMetricsRun,
  persistBuildMetricsRun,
  recordBuildPhase,
} from "./build-runtime-metrics.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const repoRoot = path.join(packageRoot, "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const metricsRun = createBuildMetricsRun({ kind: "build-prepare-content" });

function runStep({ name, command, args, cwd = packageRoot }) {
  console.error(`[build:prepare-content] stage_start ${JSON.stringify({ name, command, args })}`);
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  const durationMs = Date.now() - startedAt;
  recordBuildPhase(metricsRun, name, durationMs);
  console.error(`[build:prepare-content] stage_end ${JSON.stringify({ name, durationMs, status: result.status ?? 1 })}`);
  if ((result.status ?? 1) !== 0) {
    finishBuildMetricsRun(metricsRun, {
      counts: {
        failedPhase: name,
      },
    });
    persistBuildMetricsRun(metricsRun);
    process.exit(result.status ?? 1);
  }
}

runStep({ name: "typecheck_critical", command: npmCmd, args: ["run", "typecheck:critical"] });
runStep({ name: "i18n_compile", command: npmCmd, args: ["run", "i18n:compile"] });
runStep({
  name: "i18n_validate_production",
  command: process.execPath,
  args: [path.join(repoRoot, "scripts", "root-prebuild-i18n-validate.mjs")],
  cwd: repoRoot,
});
runStep({
  name: "lesson_indexes",
  command: process.execPath,
  args: [path.join(packageRoot, "scripts", "run-lesson-indexes-for-build.mjs")],
});
runStep({
  name: "sitemap_validate_if_changed",
  command: process.execPath,
  args: [path.join(packageRoot, "scripts", "run-sitemap-validate-if-changed.mjs")],
});
runStep({
  name: "write_build_git_meta",
  command: process.execPath,
  args: [path.join(packageRoot, "scripts", "write-build-git-meta.mjs")],
});

finishBuildMetricsRun(metricsRun);
persistBuildMetricsRun(metricsRun);

console.log("[build:prepare-content] OK");

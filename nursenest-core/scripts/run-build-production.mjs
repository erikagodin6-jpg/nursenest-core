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

const metricsRun = createBuildMetricsRun({ kind: "build-production" });

function runStep({ name, command, args, cwd = packageRoot }) {
  console.error(`[build:production] stage_start ${JSON.stringify({ name, command, args })}`);
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  const durationMs = Date.now() - startedAt;
  recordBuildPhase(metricsRun, name, durationMs);
  console.error(`[build:production] stage_end ${JSON.stringify({ name, durationMs, status: result.status ?? 1 })}`);
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

runStep({ name: "content_prep", command: npmCmd, args: ["run", "build:prepare-content"] });
runStep({ name: "next_build", command: npmCmd, args: ["run", "build:next"] });
runStep({
  name: "verify_dist_artifacts",
  command: process.execPath,
  args: [path.join(repoRoot, "scripts", "verify-dist-artifacts.mjs")],
  cwd: packageRoot,
});

finishBuildMetricsRun(metricsRun);
persistBuildMetricsRun(metricsRun);

console.log("[build:production] OK");

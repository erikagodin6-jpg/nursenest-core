#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import os from "node:os";
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

function truthyEnv(name) {
  return /^(1|true|yes)$/i.test(String(process.env[name] ?? "").trim());
}

function explicitlyFalseEnv(name) {
  const value = String(process.env[name] ?? "").trim();
  return value === "0" || /^false$/i.test(value);
}

function resolveBuildStepNodeOptions() {
  const totalRamMb = Math.max(512, Math.floor(os.totalmem() / 1024 / 1024));
  const safeCapMb = Math.max(2048, Math.min(6144, Math.floor(totalRamMb * 0.55)));
  const rawNodeOptions = String(process.env.NODE_OPTIONS ?? "").trim();
  const withoutHeap = rawNodeOptions.replace(/--max-old-space-size=\d+/, "").replace(/\s+/g, " ").trim();
  const inheritedHeap = rawNodeOptions.match(/--max-old-space-size=(\d+)/)?.[1];
  const requestedHeapRaw =
    String(process.env.BUILD_NODE_MAX_OLD_SPACE_SIZE_MB ?? "").trim() || inheritedHeap || String(safeCapMb);
  const requestedHeapMb = Number.parseInt(requestedHeapRaw, 10);
  const effectiveHeapMb =
    Number.isFinite(requestedHeapMb) && requestedHeapMb > 0
      ? Math.min(requestedHeapMb, safeCapMb)
      : safeCapMb;
  const heapFlag = `--max-old-space-size=${effectiveHeapMb}`;

  return {
    nodeOptions: [withoutHeap, heapFlag].filter(Boolean).join(" ").trim(),
    totalRamMb,
    safeCapMb,
    requestedHeapMb: Number.isFinite(requestedHeapMb) ? requestedHeapMb : null,
    effectiveHeapMb,
  };
}

function buildStepChildEnv() {
  const tmpdirRaw = String(process.env.TMPDIR ?? "").trim();
  const heap = resolveBuildStepNodeOptions();
  return {
    env: {
      ...process.env,
      TMPDIR: tmpdirRaw || "/tmp",
      NODE_ENV: process.env.NODE_ENV ?? "production",
      NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED ?? "1",
      RUN_HEAVY_BUILD_TASKS: process.env.RUN_HEAVY_BUILD_TASKS ?? "false",
      SKIP_I18N_PREBUILD: process.env.SKIP_I18N_PREBUILD ?? "1",
      NN_FORCE_SINGLE_BUILD_WORKER: process.env.NN_FORCE_SINGLE_BUILD_WORKER ?? "true",
      NODE_OPTIONS: heap.nodeOptions,
    },
    heap,
  };
}

function shouldSkipNonessentialBuildAudits() {
  if (truthyEnv("NN_SKIP_NONESSENTIAL_BUILD_AUDITS")) return true;
  if (explicitlyFalseEnv("NN_SKIP_NONESSENTIAL_BUILD_AUDITS")) return false;

  return (
    truthyEnv("NN_LOW_MEMORY_BUILD") ||
    truthyEnv("NN_APP_PLATFORM_BUILD") ||
    truthyEnv("CI")
  );
}

function runStep({ name, command, args, cwd = packageRoot }) {
  console.error(`[build:prepare-content] stage_start ${JSON.stringify({ name, command, args })}`);
  const startedAt = Date.now();
  const childEnv = buildStepChildEnv();
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: childEnv.env,
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

const childEnv = buildStepChildEnv();
console.error(
  `[build:prepare-content] memory_profile ${JSON.stringify({
    totalRamMb: childEnv.heap.totalRamMb,
    requestedHeapMb: childEnv.heap.requestedHeapMb,
    safeCapMb: childEnv.heap.safeCapMb,
    effectiveHeapMb: childEnv.heap.effectiveHeapMb,
    skipNonessentialBuildAudits: shouldSkipNonessentialBuildAudits(),
  })}`,
);

runStep({ name: "typecheck_critical", command: npmCmd, args: ["run", "typecheck:critical"] });
runStep({
  name: "client_server_boundary_phase11",
  command: process.execPath,
  args: [path.join(packageRoot, "scripts", "validate-client-server-boundaries.mjs"), "--scope=phase11"],
});
runStep({
  name: "admin_content_audit_route_contracts",
  command: process.execPath,
  args: [
    "--import",
    "tsx",
    "--test",
    path.join(packageRoot, "src/app/api/admin/content-audit/high-end-completeness/route.contract.test.ts"),
  ],
});
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
if (shouldSkipNonessentialBuildAudits()) {
  console.error(
    '[build:prepare-content] stage_skip {"name":"sitemap_validate_if_changed","reason":"nonessential_low_memory_build"}',
  );
  recordBuildPhase(metricsRun, "sitemap_validate_if_changed", 0, {
    skipped: "nonessential_low_memory_build",
  });
} else {
  runStep({
    name: "sitemap_validate_if_changed",
    command: process.execPath,
    args: [path.join(packageRoot, "scripts", "run-sitemap-validate-if-changed.mjs")],
  });
}
runStep({
  name: "write_build_git_meta",
  command: process.execPath,
  args: [path.join(packageRoot, "scripts", "write-build-git-meta.mjs")],
});

finishBuildMetricsRun(metricsRun);
persistBuildMetricsRun(metricsRun);

console.log("[build:prepare-content] OK");

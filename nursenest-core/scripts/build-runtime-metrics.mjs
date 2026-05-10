import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
export const buildRuntimeMetricsPath = path.join(packageRoot, "reports", "build-runtime-metrics.json");

function readExistingMetrics(metricsPath = buildRuntimeMetricsPath) {
  if (!existsSync(metricsPath)) {
    return {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      runs: [],
    };
  }
  try {
    const parsed = JSON.parse(readFileSync(metricsPath, "utf8"));
    if (parsed?.schemaVersion === 1 && Array.isArray(parsed.runs)) {
      return parsed;
    }
  } catch {
    // Replace corrupt local metrics; this file is an artifact, not source of truth.
  }
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    runs: [],
  };
}

export function createBuildMetricsRun({
  kind,
  env = process.env,
  startedAt = new Date(),
} = {}) {
  return {
    id: `${startedAt.toISOString()}-${process.pid}`,
    kind: kind ?? "build",
    startedAt: startedAt.toISOString(),
    finishedAt: null,
    host: {
      platform: process.platform,
      arch: process.arch,
      node: process.version,
      cpuCount: os.cpus().length,
      totalRamMb: Math.round(os.totalmem() / 1024 / 1024),
    },
    config: {
      NODE_ENV: env.NODE_ENV ?? null,
      NODE_OPTIONS: env.NODE_OPTIONS ?? null,
      NN_LOW_MEMORY_BUILD: env.NN_LOW_MEMORY_BUILD ?? null,
      NN_FORCE_SINGLE_BUILD_WORKER: env.NN_FORCE_SINGLE_BUILD_WORKER ?? null,
      BUILD_WEBPACK_PARALLELISM: env.BUILD_WEBPACK_PARALLELISM ?? null,
      BUILD_NODE_MAX_OLD_SPACE_SIZE_MB: env.BUILD_NODE_MAX_OLD_SPACE_SIZE_MB ?? null,
      NN_APP_PLATFORM_BUILD: env.NN_APP_PLATFORM_BUILD ?? null,
    },
    phases: [],
    memory: {
      peakRssMb: null,
      peakProcessCount: null,
      heapUsedMbAtFinish: null,
      rssMbAtFinish: null,
    },
    counts: {},
  };
}

export function recordBuildPhase(run, name, durationMs, extra = {}) {
  run.phases.push({
    name,
    durationMs,
    ...extra,
  });
}

export function finishBuildMetricsRun(run, extra = {}) {
  const memory = process.memoryUsage();
  run.finishedAt = new Date().toISOString();
  run.memory.heapUsedMbAtFinish = Math.round(memory.heapUsed / 1024 / 1024);
  run.memory.rssMbAtFinish = Math.round(memory.rss / 1024 / 1024);
  Object.assign(run.counts, extra.counts ?? {});
  if (extra.memory) {
    Object.assign(run.memory, extra.memory);
  }
  return run;
}

function latestQuestionInventoryReport(reportsDir = path.join(packageRoot, "reports")) {
  if (!existsSync(reportsDir)) return null;
  const matches = readdirSync(reportsDir)
    .filter((name) => /^question-inventory-.+\.json$/.test(name))
    .map((name) => {
      const filePath = path.join(reportsDir, name);
      try {
        const parsed = JSON.parse(readFileSync(filePath, "utf8"));
        return {
          file: path.relative(packageRoot, filePath),
          generatedAt: parsed.generatedAt ?? null,
          pathwayId: parsed.pathwayId ?? null,
          buckets: parsed.buckets ?? null,
          exclusions: parsed.exclusions ?? null,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.generatedAt ?? "").localeCompare(String(a.generatedAt ?? "")));
  return matches[0] ?? null;
}

export function persistBuildMetricsRun(run, { metricsPath = buildRuntimeMetricsPath } = {}) {
  const metrics = readExistingMetrics(metricsPath);
  metrics.generatedAt = new Date().toISOString();
  const inventory = latestQuestionInventoryReport(path.dirname(metricsPath));
  if (inventory) {
    run.inventoryDiagnostics = inventory;
  }
  metrics.runs = [...metrics.runs.slice(-19), run];
  mkdirSync(path.dirname(metricsPath), { recursive: true });
  writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`, "utf8");
  console.error(`[build-metrics] wrote ${metricsPath}`);
}

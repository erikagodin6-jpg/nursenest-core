#!/usr/bin/env node
/**
 * Production gate: materialize optional pathway lesson JSON indexes before `next build`.
 * Skipped when NN_SKIP_LESSON_INDEX_BUILD is truthy (escape hatch for constrained builders).
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createBuildMetricsRun,
  finishBuildMetricsRun,
  persistBuildMetricsRun,
  recordBuildPhase,
} from "./build-runtime-metrics.mjs";
import { getLessonVerifyMode } from "./lesson-index-verify-mode.mjs";
import {
  logArtifactCacheDecision,
  prepareArtifactCacheDecision,
  writeArtifactCache,
} from "../../scripts/build-artifact-cache.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const scriptPath = fileURLToPath(import.meta.url);

/** Exported for ensure-standalone-static / verify-standalone-artifact (same env semantics). */
export function isNNSkipLessonIndexBuild() {
  return /^(1|true|yes)$/i.test(String(process.env.NN_SKIP_LESSON_INDEX_BUILD ?? "").trim());
}

const indexDir = path.join(packageRoot, "src", "content", "pathway-lessons", "generated-indexes");
const lessonIndexCachePath = path.join(packageRoot, "reports", "build-artifact-cache", "lesson-indexes.json");
const lessonIndexManifestPath = path.join(indexDir, "manifest.json");

function runLessonIndexesForBuild() {
  const metricsRun = createBuildMetricsRun({ kind: "lesson-index-gate" });
  mkdirSync(indexDir, { recursive: true });

  if (isNNSkipLessonIndexBuild()) {
    console.error(
      "[lesson-indexes] WARN: NN_SKIP_LESSON_INDEX_BUILD is set — skipping generated-indexes " +
        "(us-allied-core.json / ca-allied-core.json will not be produced). " +
        "Full builds expect these files unless you deploy precomputed indexes separately.",
    );
    console.log("[lesson-indexes] skipped reason=NN_SKIP_LESSON_INDEX_BUILD");
    finishBuildMetricsRun(metricsRun, { counts: { skipped: "NN_SKIP_LESSON_INDEX_BUILD" } });
    persistBuildMetricsRun(metricsRun);
    return 0;
  }

  console.log(`[lesson-indexes] indexDir=${indexDir}`);
  const verifyModeLabel = getLessonVerifyMode(process.env);
  const cacheDecision = prepareArtifactCacheDecision({
    stepName: "lesson_indexes",
    cwd: packageRoot,
    cachePath: lessonIndexCachePath,
    inputs: [
      {
        path: "src/content/pathway-lessons",
        extensions: [".json", ".md", ".mdx", ".ts", ".tsx"],
        excludePathSubstrings: ["generated-indexes"],
      },
      { path: "src/lib/lessons", extensions: [".ts", ".tsx", ".mts", ".mjs", ".json"] },
      { path: "src/lib/allied", extensions: [".ts", ".tsx", ".mts", ".mjs", ".json"] },
      { path: "scripts/build-normalized-lesson-indexes.mjs", extensions: [".mjs"] },
      { path: "scripts/build-normalized-lesson-indexes.runner.mts", extensions: [".mts"] },
      { path: "scripts/verify-normalized-lesson-indexes.mjs", extensions: [".mjs"] },
      { path: "scripts/verify-normalized-lesson-indexes.runner.mts", extensions: [".mts"] },
      { path: "scripts/run-lesson-indexes-for-build.mjs", extensions: [".mjs"] },
    ],
    outputs: [path.relative(packageRoot, indexDir), path.relative(packageRoot, lessonIndexManifestPath)],
  });
  if (cacheDecision.action === "reuse") {
    logArtifactCacheDecision(cacheDecision, { verifyMode: verifyModeLabel });
    console.log("[lesson-indexes] reused verified generated indexes");
    finishBuildMetricsRun(metricsRun, {
      counts: {
        skipped: "fingerprint_match",
        verifyMode: verifyModeLabel,
      },
    });
    persistBuildMetricsRun(metricsRun);
    return 0;
  }
  logArtifactCacheDecision(cacheDecision, { verifyMode: verifyModeLabel });
  console.error(
    `[lesson-indexes] phase_start ${JSON.stringify({ phase: "lesson_index_generation", verifyMode: verifyModeLabel })}`,
  );
  console.log("[lesson-indexes] generating");
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const genStarted = Date.now();
  const gen = spawnSync(npmCmd, ["run", "build:lesson-indexes"], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  });
  const genMs = Date.now() - genStarted;
  recordBuildPhase(metricsRun, "lesson_index_generation", genMs);
  if ((gen.status ?? 1) !== 0) {
    console.error("[lesson-indexes] FATAL: build:lesson-indexes failed");
    finishBuildMetricsRun(metricsRun, { counts: { failedPhase: "lesson_index_generation" } });
    persistBuildMetricsRun(metricsRun);
    return gen.status ?? 1;
  }
  console.error(
    `[nursenest-core] lesson_indexes gate_build_lesson_indexes_ms ${JSON.stringify({ durationMs: genMs, ok: true })}`,
  );
  console.error(
    `[lesson-indexes] phase_end ${JSON.stringify({ phase: "lesson_index_generation", durationMs: genMs, verifyMode: verifyModeLabel })}`,
  );

  console.error(
    `[lesson-indexes] phase_start ${JSON.stringify({ phase: "lesson_index_verification", verifyMode: verifyModeLabel })}`,
  );
  console.log("[lesson-indexes] verifying");
  const verStarted = Date.now();
  const ver = spawnSync(npmCmd, ["run", "verify:lesson-indexes"], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  });
  const verMs = Date.now() - verStarted;
  recordBuildPhase(metricsRun, "lesson_index_verification", verMs, {
    verifyMode: verifyModeLabel,
  });
  if ((ver.status ?? 1) !== 0) {
    console.error("[lesson-indexes] FATAL: verify:lesson-indexes failed");
    finishBuildMetricsRun(metricsRun, { counts: { failedPhase: "lesson_index_verification" } });
    persistBuildMetricsRun(metricsRun);
    return ver.status ?? 1;
  }
  console.error(
    `[nursenest-core] lesson_indexes gate_verify_lesson_indexes_ms ${JSON.stringify({ durationMs: verMs, ok: true })}`,
  );
  console.error(
    `[lesson-indexes] phase_end ${JSON.stringify({ phase: "lesson_index_verification", durationMs: verMs, verifyMode: verifyModeLabel })}`,
  );

  console.log("[lesson-indexes] ready");

  if (/^(1|true|yes)$/i.test(String(process.env.BUILD_LOG_MEMORY_USAGE ?? "").trim())) {
    const m = process.memoryUsage();
    console.error(
      `[nursenest-core] build_memory lesson_index_gate ${JSON.stringify({
        rss: m.rss,
        heapTotal: m.heapTotal,
        heapUsed: m.heapUsed,
        external: m.external,
      })}`,
    );
  }

  const heapMb = Math.round(process.memoryUsage().heapUsed / (1024 * 1024));
  console.error(
    `[nursenest-core] lesson_indexes_gate_summary\n${JSON.stringify(
      {
        buildLessonIndexesMs: genMs,
        verifyLessonIndexesMs: verMs,
        totalGateMs: genMs + verMs,
        heapUsedMb: heapMb,
      },
      null,
      2,
    )}`,
  );
  finishBuildMetricsRun(metricsRun, {
    counts: {
      buildLessonIndexesMs: genMs,
      verifyLessonIndexesMs: verMs,
      totalGateMs: genMs + verMs,
    },
  });
  persistBuildMetricsRun(metricsRun);
  writeArtifactCache({
    cachePath: lessonIndexCachePath,
    stepName: "lesson_indexes",
    fingerprint: cacheDecision.fingerprint,
    files: cacheDecision.files,
    outputs: [indexDir, lessonIndexManifestPath],
    metadata: {
      verifyMode: verifyModeLabel,
      buildLessonIndexesMs: genMs,
      verifyLessonIndexesMs: verMs,
    },
  });

  return 0;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(scriptPath);

if (isMain) {
  process.exit(runLessonIndexesForBuild());
}

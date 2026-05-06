#!/usr/bin/env node
/**
 * Production gate: materialize optional pathway lesson JSON indexes before `next build`.
 * Skipped when NN_SKIP_LESSON_INDEX_BUILD is truthy (escape hatch for constrained builders).
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const scriptPath = fileURLToPath(import.meta.url);

/** Exported for ensure-standalone-static / verify-standalone-artifact (same env semantics). */
export function isNNSkipLessonIndexBuild() {
  return /^(1|true|yes)$/i.test(String(process.env.NN_SKIP_LESSON_INDEX_BUILD ?? "").trim());
}

const indexDir = path.join(packageRoot, "src", "content", "pathway-lessons", "generated-indexes");

function runLessonIndexesForBuild() {
  mkdirSync(indexDir, { recursive: true });

  if (isNNSkipLessonIndexBuild()) {
    console.log("[lesson-indexes] skipped reason=NN_SKIP_LESSON_INDEX_BUILD");
    return 0;
  }

  console.log("[lesson-indexes] generating");
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const gen = spawnSync(npmCmd, ["run", "build:lesson-indexes"], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  });
  if ((gen.status ?? 1) !== 0) {
    console.error("[lesson-indexes] FATAL: build:lesson-indexes failed");
    return gen.status ?? 1;
  }

  console.log("[lesson-indexes] verifying");
  const ver = spawnSync(npmCmd, ["run", "verify:lesson-indexes"], {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  });
  if ((ver.status ?? 1) !== 0) {
    console.error("[lesson-indexes] FATAL: verify:lesson-indexes failed");
    return ver.status ?? 1;
  }

  console.log("[lesson-indexes] ready");
  return 0;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(scriptPath);

if (isMain) {
  process.exit(runLessonIndexesForBuild());
}

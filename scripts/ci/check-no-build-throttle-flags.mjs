#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const TOKENS = [
  "NN_FORCE_SINGLE_BUILD_WORKER",
  "NN_LOW_MEMORY_BUILD",
  "BUILD_WEBPACK_PARALLELISM",
  "NN_FORCE_WEBPACK_BUILD",
  "NEXT_DISABLE_TURBOPACK",
];

let trackedFiles = [];
try {
  const raw = execSync("git ls-files", { encoding: "utf8" }).trim();
  trackedFiles = raw ? raw.split(/\r?\n/) : [];
} catch (error) {
  console.error("[check-no-build-throttle-flags] Failed to list tracked files", error);
  process.exit(1);
}

if (trackedFiles.length === 0) {
  console.log("[check-no-build-throttle-flags] No tracked files detected; skipping");
  process.exit(0);
}

const offenders = [];

for (const filePath of trackedFiles) {
  if (!filePath) continue;
  let content;
  try {
    content = readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`[check-no-build-throttle-flags] Failed to read ${filePath}`, error);
    process.exit(1);
  }
  if (!TOKENS.some((token) => content.includes(token))) continue;

  const ext = path.extname(filePath).toLowerCase();
  const isYaml = ext === ".yml" || ext === ".yaml";
  const isShellScript = ext === ".sh";
  const baseName = path.basename(filePath).toLowerCase();
  const isDockerfile = baseName === "dockerfile";
  const isWorkflow = filePath.startsWith(".github/workflows/");
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!TOKENS.some((token) => line.includes(token))) continue;
    const targetedContext = /(--build-arg|build-args|ARG\s|ENV\s|export\s)/.test(line);
    if (isYaml || isShellScript || isDockerfile || isWorkflow || targetedContext) {
      offenders.push({
        filePath,
        lineNumber: index + 1,
        line: line.trim(),
      });
    }
  }
}

if (offenders.length > 0) {
  console.error("[check-no-build-throttle-flags] Throttling flags detected in disallowed contexts:");
  for (const offender of offenders) {
    console.error(`  ${offender.filePath}:${offender.lineNumber}: ${offender.line}`);
  }
  console.error(
    "Remove the flagged usage or update scripts/ci/check-no-build-throttle-flags.mjs if this context should remain allowed.",
  );
  process.exit(1);
}

console.log("[check-no-build-throttle-flags] OK");

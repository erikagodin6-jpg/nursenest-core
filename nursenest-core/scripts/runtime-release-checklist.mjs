#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const optionalChecksEnabled =
  process.env.RUN_OPTIONAL_RUNTIME_RELEASE_CHECKS === "1" ||
  process.env.RUN_OPTIONAL_RUNTIME_RELEASE_CHECKS === "true";

const requiredSteps = [
  ["run", "typecheck:critical"],
  ["run", "verify:do-runtime"],
  ["run", "list:stripe-runtime-env-keys"],
];

const optionalSteps = [
  ["run", "verify:sitemap"],
  ["run", "test:homepage"],
];

function runStep(args, label) {
  console.log(`[runtime-release-checklist] ${label}`);
  const result = spawnSync(npmCommand, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

for (const step of requiredSteps) {
  runStep(step, step.join(" "));
}

if (optionalChecksEnabled) {
  for (const step of optionalSteps) {
    runStep(step, `${step.join(" ")} (optional enabled)`);
  }
} else {
  console.log(
    "[runtime-release-checklist] Optional sitemap/homepage checks skipped. Set RUN_OPTIONAL_RUNTIME_RELEASE_CHECKS=1 to enable them.",
  );
}

console.log("[runtime-release-checklist] PASS");

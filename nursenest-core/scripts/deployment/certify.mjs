#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("../..", import.meta.url).pathname);
const reportDir = path.join(repoRoot, "reports", "deployment-reliability");
const reportPath = path.join(reportDir, "deployment-certification.json");

const steps = [
  { name: "runtime-config", command: process.execPath, args: ["scripts/deployment/validate-runtime-config.mjs"] },
  { name: "build-artifacts", command: process.execPath, args: ["scripts/deployment/verify-build-artifacts.mjs"] },
];

if (process.env.BASE_URL?.trim() || process.env.DEPLOYMENT_BASE_URL?.trim()) {
  steps.push({ name: "production-smoke", command: process.execPath, args: ["scripts/deployment/smoke-certify.mjs"] });
} else {
  console.warn("[deploy:certify] production-smoke skipped because BASE_URL/DEPLOYMENT_BASE_URL is unset.");
}

const results = [];
for (const step of steps) {
  const started = Date.now();
  console.log(`[deploy:certify] step_start ${step.name}`);
  const child = spawnSync(step.command, step.args, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  });
  const result = {
    name: step.name,
    status: child.status === 0 ? "pass" : "fail",
    exitCode: child.status ?? 1,
    durationMs: Date.now() - started,
  };
  results.push(result);
  console.log(`[deploy:certify] step_end ${step.name} status=${result.status} durationMs=${result.durationMs}`);
  if (child.status !== 0) break;
}

const failed = results.filter((result) => result.status !== "pass");
const report = {
  generatedAt: new Date().toISOString(),
  status: failed.length === 0 ? "pass" : "fail",
  promotion: failed.length === 0 ? "allowed" : "blocked",
  rollback: failed.length === 0 ? "not_required" : "required",
  results,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`[deploy:certify] report=${path.relative(repoRoot, reportPath)}`);

if (failed.length > 0) {
  process.exit(1);
}

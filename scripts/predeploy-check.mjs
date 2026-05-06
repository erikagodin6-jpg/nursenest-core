#!/usr/bin/env node
/**
 * Predeploy gate: typecheck, build, release-gate E2E, mobile E2E (monorepo root relative).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const nn = join(root, "nursenest-core");

const steps = [
  { label: "typecheck", cmd: "npm", args: ["run", "typecheck"], cwd: nn },
  { label: "build", cmd: "npm", args: ["run", "build"], cwd: nn },
  { label: "qa:release-gate", cmd: "npm", args: ["run", "qa:release-gate"], cwd: nn },
  { label: "test:e2e:mobile", cmd: "npm", args: ["run", "test:e2e:mobile"], cwd: nn },
];

for (const s of steps) {
  console.log("\n[predeploy-check] step: " + s.label + " (cwd=" + s.cwd + ")\n");
  const r = spawnSync(s.cmd, s.args, { cwd: s.cwd, stdio: "inherit", env: process.env });
  const code = r.status === null ? 1 : r.status;
  if (code !== 0) {
    console.error("\n[predeploy-check] FAILED: " + s.label + " exit=" + code + "\n");
    process.exit(code);
  }
}

console.log("\n[predeploy-check] all steps passed\n");
process.exit(0);

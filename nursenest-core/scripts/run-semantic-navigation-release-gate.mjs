#!/usr/bin/env node
/**
 * Semantic navigation release gate — static checks then Playwright (when BASE_URL set).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

console.error("\n[semantic-navigation-gate] Static governance\n");
const staticRun = spawnSync(
  "node",
  ["--import", "tsx", "src/lib/breadcrumbs/governance/semantic-navigation-release-gate.ts"],
  { cwd: ROOT, stdio: "inherit", env: { ...process.env, SEMANTIC_GATE_WRITE_ARTIFACTS: "1" } },
);

if (staticRun.status !== 0) {
  console.error("[semantic-navigation-gate] FAILED static gate");
  process.exit(staticRun.status ?? 1);
}

const skipPlaywright = process.env.SEMANTIC_GATE_STATIC_ONLY === "1";
if (skipPlaywright) {
  console.error("[semantic-navigation-gate] OK (static only)");
  process.exit(0);
}

console.error("\n[semantic-navigation-gate] Playwright runtime\n");
const pw = spawnSync(
  "npx",
  ["playwright", "test", "-c", "playwright.semantic-navigation-gate.config.ts", "--project=semantic-navigation-governance"],
  { cwd: ROOT, stdio: "inherit", shell: true },
);

if (pw.status !== 0) {
  console.error("[semantic-navigation-gate] FAILED Playwright — see test-results/semantic-navigation-gate/");
  process.exit(pw.status ?? 1);
}

console.error("[semantic-navigation-gate] OK");
process.exit(0);

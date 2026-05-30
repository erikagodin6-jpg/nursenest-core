#!/usr/bin/env node
/**
 * Marketing screenshot refresh orchestrator (Phase 9).
 *
 * Runs capture → homepage sync → validation in one command so marketing assets
 * stay current after major UI changes.
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=https://nursenest.ca \
 *   PLAYWRIGHT_RN_EMAIL=... PLAYWRIGHT_RN_PASSWORD=... \
 *   npm run marketing:screenshots:refresh
 *
 * Options (env):
 *   MARKETING_SCREENSHOT_TIERS=core,marketing,rn   (default: core,marketing)
 *   MARKETING_SCREENSHOT_THEMES=ocean              (default: ocean)
 *   MARKETING_SCREENSHOT_SKIP_CAPTURE=1            (sync + validate only)
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");

function run(label, cmd, args, extraEnv = {}) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: APP_ROOT,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
}

const tiers = process.env.MARKETING_SCREENSHOT_TIERS ?? "core,marketing";
const themes = process.env.MARKETING_SCREENSHOT_THEMES ?? "ocean";
const skipCapture = process.env.MARKETING_SCREENSHOT_SKIP_CAPTURE === "1";

console.log("NurseNest — marketing screenshot refresh");
console.log(`  tiers: ${tiers}`);
console.log(`  themes: ${themes}`);
console.log(`  skip capture: ${skipCapture}`);

if (!skipCapture) {
  run(
    "Playwright capture",
    "npm",
    ["run", "generate:marketing-screenshots", "--", `--tier=${tiers}`, `--theme=${themes}`],
  );
}

run("Homepage slot sync", "node", ["scripts/sync-homepage-screenshot-variants.mjs"]);
run("Validate marketing screenshots", "npm", ["run", "validate:marketing-screenshots"]);

console.log("\n✓ Marketing screenshot refresh complete");

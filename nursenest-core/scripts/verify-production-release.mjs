#!/usr/bin/env node
/**
 * Run post-deploy health + core Playwright smoke against an already-deployed URL.
 * Does not start the Next dev server.
 *
 * Usage:
 *   BASE_URL=https://www.nursenest.ca ./scripts/verify-production-release.mjs
 *
 * Exit codes: 0 = pass, non-zero = failure (Playwright / npm exit code).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(root, "..");

const base = process.env.BASE_URL?.trim();
if (!base) {
  console.error("verify-production-release: set BASE_URL (e.g. https://www.nursenest.ca)");
  process.exit(2);
}

const env = {
  ...process.env,
  BASE_URL: base,
  PLAYWRIGHT_SKIP_WEB_SERVER: "1",
};

function run(label, args) {
  console.log(`\n======== ${label} ========\n`);
  const r = spawnSync("npx", ["playwright", "test", ...args], {
    cwd: pkgRoot,
    env,
    stdio: "inherit",
    shell: false,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

run("1/2 Post-deploy — health + marketing home", ["-c", "playwright.postdeploy.config.ts"]);
run("2/2 Core journeys — smoke bundle", ["-c", "playwright.verify-production.config.ts"]);

console.log("\n======== VERIFY OK ========\n");

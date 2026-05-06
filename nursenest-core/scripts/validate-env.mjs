#!/usr/bin/env node
/**
 * Entry point for `npm run env:validate` — delegates to tsx so validation can reuse TypeScript modules.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const cli = join(__dirname, "validate-env-cli.mts");
const forwarded = process.argv.slice(2);

const result = spawnSync("npx", ["tsx", cli, ...forwarded], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status === 0 ? 0 : result.status ?? 1);

#!/usr/bin/env node
/**
 * Compatibility alias — canonical implementation lives in `scripts/runtime/start-standalone.mjs`.
 *
 * Usage (from nursenest-core package root):
 *   node scripts/helpers/run-standalone-node-server.mjs
 *
 * Prefer npm script:
 *   npm run runtime:standalone:start
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "..", "..");
const target = join(__dirname, "..", "runtime", "start-standalone.mjs");

const child = spawn(process.execPath, [target], {
  cwd: appRoot,
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});

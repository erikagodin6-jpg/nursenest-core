#!/usr/bin/env node
/**
 * Build and verify the Next standalone artifact for local runtime testing.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildForwardedRuntimeEnv } from "../lib/runtime-env-contract.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function exitCodeFromSignal(signal) {
  if (signal === "SIGTERM") return 143;
  if (signal === "SIGINT") return 130;
  return 1;
}

function run(label, command, args) {
  console.log(`[standalone-build] ${label}: ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: appRoot,
    env: buildForwardedRuntimeEnv(process.env),
    stdio: "inherit",
  });
  if (result.signal) {
    console.error(`[standalone-build] ${label} exited on ${result.signal}`);
    process.exit(exitCodeFromSignal(result.signal));
  }
  if (result.status !== 0) {
    console.error(`[standalone-build] ${label} failed with exit ${result.status ?? 1}`);
    process.exit(result.status ?? 1);
  }
}

run("next build", "npm", ["run", "build"]);
run("sync standalone static assets", process.execPath, ["scripts/ensure-standalone-static.mjs"]);
run("verify standalone artifact", process.execPath, ["scripts/verify-standalone-artifact.mjs"]);

console.log("[standalone-build] standalone artifact ready.");

#!/usr/bin/env node
/**
 * Start the raw Next standalone server.js for local reproduction.
 *
 * This intentionally does not use `next start`. For production-style bootstrap
 * probes use `npm start`; for raw standalone parity use this helper.
 */
import { spawnSync, spawn } from "node:child_process";
import { dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  verifyStandaloneArtifact,
  verifyStandaloneStaticAssetsPresent,
} from "../verify-standalone-artifact.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function log(message) {
  console.log(`[standalone-start] ${message}`);
}

function error(message) {
  console.error(`[standalone-start] ${message}`);
}

function exitCodeFromSignal(signal) {
  if (signal === "SIGTERM") return 143;
  if (signal === "SIGINT") return 130;
  return 1;
}

const validate = spawnSync(process.execPath, ["scripts/runtime/validate-local-env.mjs", "--check-port"], {
  cwd: appRoot,
  env: { ...process.env },
  stdio: "inherit",
});
if (validate.signal) {
  process.exit(exitCodeFromSignal(validate.signal));
}
if (validate.status !== 0) {
  error(`runtime env validation failed with exit ${validate.status ?? 1}`);
  process.exit(validate.status ?? 1);
}

let serverPath;
try {
  serverPath = verifyStandaloneArtifact(appRoot);
  verifyStandaloneStaticAssetsPresent(appRoot);
} catch (e) {
  error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}

const standaloneCwd = dirname(serverPath);
const commandForHumans = `node ${relative(appRoot, serverPath)}`;
const port = process.env.PORT?.trim() || "3000";
const hostname = process.env.HOSTNAME?.trim() || "127.0.0.1";
const env = {
  ...process.env,
  NODE_ENV: "production",
  PORT: port,
  HOSTNAME: hostname,
};

log(`command=${commandForHumans}`);
log(`cwd=${standaloneCwd}`);
log(`PORT=${port} HOSTNAME=${hostname}`);

const child = spawn(process.execPath, ["server.js"], {
  cwd: standaloneCwd,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    error(`server.js exited on ${signal}`);
    process.exit(exitCodeFromSignal(signal));
  }
  process.exit(code ?? 1);
});

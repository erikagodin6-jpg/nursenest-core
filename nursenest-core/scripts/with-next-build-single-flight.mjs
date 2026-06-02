#!/usr/bin/env node
/**
 * Runs `next build` (default) under a repo-local exclusive lock (see next-build-exclusive.mjs).
 * Usage: node scripts/with-next-build-single-flight.mjs [next-cli-args...]
 * Default argv: "build"
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { acquireExclusiveNextBuildLock, releaseExclusiveNextBuildLock } from "./next-build-exclusive.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

let nextBin;
try {
  const nextPkg = require.resolve("next/package.json");
  nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
} catch {
  console.error("[nn-next-single-flight] FATAL: could not resolve next");
  process.exit(1);
}
if (!existsSync(nextBin)) {
  console.error("[nn-next-single-flight] FATAL: Next CLI missing");
  process.exit(1);
}

const nextArgs = process.argv.slice(2).length ? process.argv.slice(2) : ["build"];

let acquired = false;
function cleanup() {
  if (acquired) releaseExclusiveNextBuildLock(packageRoot);
}
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

try {
  acquireExclusiveNextBuildLock(packageRoot);
  acquired = true;
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e.code === "ELOCKED") {
    console.error(String(e.message ?? e));
    process.exit(1);
  }
  throw e;
}

if (!String(process.env.NEXT_TELEMETRY_DISABLED ?? "").trim()) {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
}
if (!String(process.env.NN_FORCE_SINGLE_BUILD_WORKER ?? "").trim()) {
  process.env.NN_FORCE_SINGLE_BUILD_WORKER = "true";
}

const r = spawnSync(process.execPath, [nextBin, ...nextArgs], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

cleanup();
acquired = false;

if (r.error) {
  console.error("[nn-next-single-flight] FATAL: spawn failed", r.error);
  process.exit(1);
}
if (r.signal) process.exit(1);
process.exit(r.status ?? 1);

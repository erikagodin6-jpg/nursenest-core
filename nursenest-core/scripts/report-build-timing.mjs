#!/usr/bin/env node
/**
 * Optional: run `next build` with wall-clock timing (does **not** replace `npm run build`).
 * Does not run prebuild / lesson indexes — use for isolating Next compile duration:
 *   npm --prefix nursenest-core run build:next:timed
 *
 * For full production parity timing, use `/usr/bin/time -v npm run build` at package root.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const ensureMem = path.join(packageRoot, "scripts", "ensure-node-memory.mjs");

const mem = spawnSync(process.execPath, [ensureMem], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});
if ((mem.status ?? 1) !== 0) {
  process.exit(mem.status ?? 1);
}

const started = Date.now();
const next = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "build"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});
const durationMs = Date.now() - started;

console.error(
  `[build-timing] ${JSON.stringify({
    event: "next_build_wall_clock",
    durationMs,
    exitCode: next.status,
    signal: next.signal,
    cwd: packageRoot,
  })}`,
);

if (next.status === null) {
  console.error("[build-timing] FATAL: next build terminated (possible SIGKILL/OOM)");
  process.exit(1);
}
process.exit(next.status === 0 ? 0 : next.status ?? 1);

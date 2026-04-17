#!/usr/bin/env node
/**
 * Production entry: run the Next.js **standalone** server (see `output: "standalone"` in next.config.ts).
 * Do **not** use `next start` with standalone output — it logs a warning and is not the supported path.
 *
 * Resolves the traced `server.js` (layout varies slightly by Next version / monorepo tracing).
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  join(pkgRoot, ".next", "standalone", "nursenest-core", "server.js"),
  join(pkgRoot, ".next", "standalone", "server.js"),
];

const entry = candidates.find((p) => existsSync(p));

if (!entry) {
  console.error(
    "[nursenest-core] FATAL: standalone server.js not found. Expected one of:\n" +
      candidates.map((p) => `  - ${p}`).join("\n") +
      "\n  Run `npm run build` from this package first.",
  );
  process.exit(1);
}

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_ENV = "production";
}

const memMb = process.env.NODE_MAX_OLD_SPACE_SIZE_MB ?? "512";
const base = (process.env.NODE_OPTIONS ?? "").trim();
const withHeap = base.includes("--max-old-space-size")
  ? base
  : `${base} --max-old-space-size=${memMb}`.trim();
process.env.NODE_OPTIONS = withHeap;

const child = spawn(process.execPath, [entry], {
  stdio: "inherit",
  cwd: pkgRoot,
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

#!/usr/bin/env node
/**
 * Reliability unit suite: all `*.test.ts` files under `src/lib/reliability` (recursive).
 *
 * `npm run` uses POSIX `sh`, which does not expand recursive globs; a bare
 * `tsx --test` with a `**` pattern would pass a literal path to tsx.
 * This runner matches recursive `*.test.ts` discovery without bash globstar.
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reliabilityDir = join(root, "src", "lib", "reliability");
const tsxBin = join(root, "node_modules", ".bin", "tsx");

function collectTestFiles(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...collectTestFiles(p));
    else if (ent.isFile() && ent.name.endsWith(".test.ts")) out.push(p);
  }
  return out;
}

let files;
try {
  files = collectTestFiles(reliabilityDir);
} catch (err) {
  console.error("run-reliability-tests: could not read", reliabilityDir, err);
  process.exit(1);
}

if (files.length === 0) {
  console.error("run-reliability-tests: no *.test.ts files under src/lib/reliability");
  process.exit(1);
}

files.sort();
const result = spawnSync(tsxBin, ["--test", ...files], {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});
process.exit(result.status === null ? 1 : result.status);

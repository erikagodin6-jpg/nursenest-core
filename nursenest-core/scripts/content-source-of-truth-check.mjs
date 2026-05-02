#!/usr/bin/env node
/**
 * CI guard: registry presence + content-source-of-truth contract tests.
 * Does not require lesson index coverage JSON (unlike content:source-of-truth:verify).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryTs = path.join(coreRoot, "src/lib/content-source-of-truth/content-registry.ts");
const testFile = path.join(coreRoot, "src/lib/content-source-of-truth/content-source-of-truth.contract.test.ts");

function fail(msg) {
  console.error(`[content:source-of-truth:check] FATAL: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(registryTs)) fail(`missing registry ${registryTs}`);
if (!fs.existsSync(testFile)) fail(`missing contract test ${testFile}`);

const r = spawnSync(process.execPath, ["--import", "tsx", "--test", testFile], {
  cwd: coreRoot,
  encoding: "utf8",
  stdio: "pipe",
  env: { ...process.env },
});
if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
if (r.status !== 0) fail("content-source-of-truth.contract.test.ts failed");

console.info("[content:source-of-truth:check] ok");

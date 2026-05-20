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
const orphanScript = path.join(coreRoot, "scripts", "audit-content-orphans.mjs");
const catStudyPlanTest = path.join(coreRoot, "src/lib/content-source-of-truth/cat-study-plan-canonical-sot.contract.test.ts");
const blogDupTest = path.join(coreRoot, "src/lib/blog/blog-pipeline-duplicate-guard.contract.test.ts");
const parityTest = path.join(coreRoot, "src/lib/content-source-of-truth/verified-content-write-read-parity.e2e.test.ts");
const osceE2eTest = path.join(coreRoot, "src/lib/content-source-of-truth/osce-source-of-truth.e2e.test.ts");

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

if (!fs.existsSync(orphanScript)) fail(`missing orphan audit ${orphanScript}`);
const orphan = spawnSync(process.execPath, [orphanScript], {
  cwd: coreRoot,
  encoding: "utf8",
  stdio: "pipe",
  env: { ...process.env },
});
if (orphan.stdout) process.stdout.write(orphan.stdout);
if (orphan.stderr) process.stderr.write(orphan.stderr);
if (orphan.status !== 0) fail("audit-content-orphans.mjs failed");

const extraTests = [catStudyPlanTest, blogDupTest, parityTest, osceE2eTest];
for (const tf of extraTests) {
  if (!fs.existsSync(tf)) fail(`missing test ${tf}`);
  const tr = spawnSync(process.execPath, ["--import", "tsx", "--test", tf], {
    cwd: coreRoot,
    encoding: "utf8",
    stdio: "pipe",
    env: { ...process.env },
  });
  if (tr.stdout) process.stdout.write(tr.stdout);
  if (tr.stderr) process.stderr.write(tr.stderr);
  if (tr.status !== 0) fail(`failed: ${path.relative(coreRoot, tf)}`);
}

console.info("[content:source-of-truth:check] ok");

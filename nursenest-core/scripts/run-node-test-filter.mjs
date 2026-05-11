#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2).filter(Boolean);
const testFilePattern = /\.(?:test|contract)\.(?:[cm]?js|[cm]?ts|tsx)$/;
const searchRoots = ["scripts", "src", "tests"].map((dir) => path.join(root, dir));

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry === "test-results") continue;
    const full = path.join(dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      walk(full, out);
    } else if (testFilePattern.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const nodeArgs = ["--test"];
if (args.length > 0) {
  const allTests = searchRoots.flatMap((dir) => walk(dir));
  const matches = allTests.filter((file) => args.some((arg) => path.basename(file).includes(arg) || file.includes(arg)));
  if (matches.length === 0) {
    console.error(`[node-test-filter] no test files matched: ${args.join(", ")}`);
    process.exit(1);
  }
  nodeArgs.push(...matches);
}

const result = spawnSync(process.execPath, nodeArgs, {
  cwd: root,
  env: { ...process.env },
  stdio: "inherit",
});

if (result.signal) {
  process.kill(process.pid, result.signal);
} else {
  process.exit(result.status ?? 1);
}

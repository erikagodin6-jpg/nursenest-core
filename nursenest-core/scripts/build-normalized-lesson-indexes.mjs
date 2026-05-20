#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = path.join(coreRoot, "scripts", "build-normalized-lesson-indexes.runner.mts");
const tsx = process.platform === "win32" ? "npx.cmd" : "npx";
const r = spawnSync(tsx, ["tsx", runner], {
  stdio: "inherit",
  cwd: coreRoot,
  env: process.env,
  shell: process.platform === "win32",
});
process.exit(r.status === null ? 1 : r.status ?? 0);

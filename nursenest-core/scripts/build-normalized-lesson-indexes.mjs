#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = path.join(coreRoot, "scripts", "build-normalized-lesson-indexes.runner.mts");
const r = spawnSync(process.execPath, ["--import", "tsx", runner], {
  stdio: "inherit",
  cwd: coreRoot,
  env: process.env,
});
process.exit(r.status === null ? 1 : r.status ?? 0);

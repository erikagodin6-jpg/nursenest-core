#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const child = spawnSync(
  process.execPath,
  ["--require", "./scripts/stub-server-only.cjs", "--import", "tsx", "./scripts/run-blog-batch.ts", ...args],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  },
);

process.exit(typeof child.status === "number" ? child.status : 1);

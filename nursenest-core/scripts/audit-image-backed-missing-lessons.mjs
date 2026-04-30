#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const child = spawnSync(
  process.execPath,
  ["--require", join(packageRoot, "scripts/stub-server-only.cjs"), "--import", "tsx", join(packageRoot, "scripts/audit-image-backed-missing-lessons.ts"), ...args],
  { cwd: packageRoot, stdio: "inherit", env: process.env },
);

process.exit(typeof child.status === "number" ? child.status : 1);

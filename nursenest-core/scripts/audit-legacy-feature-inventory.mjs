#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "..");
const runner = join(appRoot, "src/lib/legacy-feature-inventory/audit-legacy-feature-inventory.mjs");
const r = spawnSync(process.execPath, [runner], { cwd: appRoot, stdio: "inherit" });
process.exit(r.status ?? 1);

#!/usr/bin/env node
/** @deprecated Use `npm run validate:editor-stability` — thin wrapper for backwards compatibility. */
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = spawnSync(process.execPath, [join(root, "scripts", "validate-editor-stability.mjs")], {
  stdio: "inherit",
  env: process.env,
});
process.exit(r.status ?? 1);

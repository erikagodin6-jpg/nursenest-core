#!/usr/bin/env node
/**
 * Wrapper — run from repo root:
 *   DATABASE_URL=… node scripts/seed-screenshot-demo-user.ts
 *
 * Delegates to nursenest-core/scripts/seed-screenshot-demo-user.ts
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "../nursenest-core");
const script = join(appRoot, "scripts/seed-screenshot-demo-user.ts");

const result = spawnSync("npx", ["tsx", script, ...process.argv.slice(2)], {
  cwd: appRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);

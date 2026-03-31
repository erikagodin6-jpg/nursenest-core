#!/usr/bin/env npx tsx
/**
 * Thin launcher: Prisma client lives under `nursenest-core/`. Delegates to that package script.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ncRoot = path.resolve(__dirname, "..", "nursenest-core");
const target = path.join(ncRoot, "scripts", "import-replit-data.ts");

const r = spawnSync("npx", ["tsx", target, ...process.argv.slice(2)], {
  cwd: ncRoot,
  stdio: "inherit",
  env: { ...process.env },
});
process.exit(r.status ?? 1);

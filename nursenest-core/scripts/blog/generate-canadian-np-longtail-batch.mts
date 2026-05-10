#!/usr/bin/env npx tsx
/**
 * Thin wrapper: deterministic Canadian NP long-tail batch is implemented in Python
 * for reliable large-file generation. Run from `nursenest-core/`:
 *
 *   npx tsx scripts/blog/generate-canadian-np-longtail-batch.mts
 *
 * Equivalent: `python3 scripts/blog/generate-canadian-np-longtail-batch.py`
 */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "..", "..");
const script = join(__dirname, "generate-canadian-np-longtail-batch.py");

const r = spawnSync("python3", [script], { cwd: appRoot, stdio: "inherit" });
if (r.error) throw r.error;
process.exit(r.status ?? 1);

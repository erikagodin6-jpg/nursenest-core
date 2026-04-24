/**
 * **Maintenance / CLI scripts** (`tsx scripts/…`): load env files **without overriding** keys already
 * set in `process.env`, then run `env-bootstrap` URL tuning for Prisma.
 *
 * - If **`DOTENV_CONFIG_PATH`** is set (relative to `process.cwd()` or absolute), that file is loaded first.
 * - Otherwise loads **`.env.local`** from `process.cwd()` (run scripts from `nursenest-core/`).
 * - Never logs secret values — only booleans for whether `DATABASE_URL` / `DIRECT_URL` are set.
 *
 * Uses `createRequire` so `dotenv.config()` runs **before** `env-bootstrap` side effects (ESM import hoisting
 * would otherwise apply `env-bootstrap` first).
 *
 * ```ts
 * import "../../src/lib/db/script-env-bootstrap";
 * ```
 */
import { createRequire } from "node:module";
import path from "node:path";
import { config } from "dotenv";

const require = createRequire(import.meta.url);

const cwd = process.cwd();
const explicit = process.env.DOTENV_CONFIG_PATH?.trim();
const dotenvPath = explicit
  ? path.isAbsolute(explicit)
    ? explicit
    : path.resolve(cwd, explicit)
  : path.join(cwd, ".env.local");

config({ path: dotenvPath, override: false, quiet: true });

if (process.env.NN_LOG_DIRECT_URL === undefined) {
  process.env.NN_LOG_DIRECT_URL = "0";
}

require("./env-bootstrap.ts");

console.log("[script-env-bootstrap] DATABASE_URL present:", Boolean(process.env.DATABASE_URL?.trim()));
console.log("[script-env-bootstrap] DIRECT_URL present:", Boolean(process.env.DIRECT_URL?.trim()));

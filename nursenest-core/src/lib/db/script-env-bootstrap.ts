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

import {
  requireDatabaseEnv,
  type DatabaseUrlContractSource,
} from "../env/require-database-env";

const require = createRequire(import.meta.url);

const cwd = process.cwd();
const explicit = process.env.DOTENV_CONFIG_PATH?.trim();
const dotenvPath = explicit
  ? path.isAbsolute(explicit)
    ? explicit
    : path.resolve(cwd, explicit)
  : path.join(cwd, ".env.local");

const databaseUrlFromShellBeforeDotenv = Boolean(process.env.DATABASE_URL?.trim());
config({ path: dotenvPath, override: false, quiet: true });
const databaseUrlAfterDotenv = Boolean(process.env.DATABASE_URL?.trim());

/** `override: false` — if DATABASE_URL was already in the shell, dotenv does not replace it. */
let urlSource: DatabaseUrlContractSource = "unknown";
if (databaseUrlFromShellBeforeDotenv && databaseUrlAfterDotenv) {
  urlSource = "process_env";
} else if (!databaseUrlFromShellBeforeDotenv && databaseUrlAfterDotenv) {
  urlSource = "dotenv";
}

if (process.env.NN_LOG_DIRECT_URL === undefined) {
  process.env.NN_LOG_DIRECT_URL = "0";
}

requireDatabaseEnv({ context: "script-env-bootstrap", urlSource });

require("./env-bootstrap.ts");

console.log("[script-env-bootstrap] DATABASE_URL present:", Boolean(process.env.DATABASE_URL?.trim()));
console.log("[script-env-bootstrap] DIRECT_URL present:", Boolean(process.env.DIRECT_URL?.trim()));

/**
 * Exit 0 if DATABASE_URL and DIRECT_URL are both non-empty after the same env pipeline as Prisma CLI.
 * Used by `prisma-cli-contract.test.mts` with DATABASE_URL / DIRECT_URL / DATABASE_DIRECT_URL **unset**
 * in `process.env` so resolution must come from dotenv files + env-bootstrap (not shell exports).
 */
import "./load-dotenv-for-cli.mts";
import "../src/lib/db/env-bootstrap";
import { requireDatabaseEnv } from "../src/lib/env/require-database-env";

requireDatabaseEnv({ context: "probe-prisma-cli-env", urlSource: "dotenv" });

const direct = process.env.DIRECT_URL?.trim();
if (!direct) {
  console.error("[probe-prisma-cli-env] DIRECT_URL unset after dotenv + env-bootstrap (expected derived from DATABASE_URL)");
  process.exit(11);
}
process.exit(0);

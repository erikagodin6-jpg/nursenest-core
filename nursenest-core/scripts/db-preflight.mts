/**
 * Fail-fast check before DB scripts: env files loaded from nursenest-core (not shell cwd),
 * DATABASE_URL present (never prints secret), host/port/database echo.
 *
 * Run: npm run db:preflight
 */
import "./load-dotenv-for-cli.mts";
import { cliDotenvTelemetry } from "./load-dotenv-for-cli.mts";
import { parsePostgresUrlTargetSafe } from "./cli-db-url-snapshot.mts";
import "../src/lib/db/script-env-bootstrap";
import { databaseUrlSource } from "../src/lib/db/env-bootstrap";

const PREFIX = "[db-preflight]";

const raw = process.env.DATABASE_URL!.trim();
const t = parsePostgresUrlTargetSafe(raw);
console.log(`${PREFIX} OK: databaseUrlSource=${databaseUrlSource}`);
console.log(`${PREFIX} cwd=${process.cwd()} (informational; env files are resolved from package root)`);
console.log(`${PREFIX} packageRoot=${cliDotenvTelemetry.packageRoot}`);
console.log(`${PREFIX} DATABASE_URL inferred from: ${cliDotenvTelemetry.sourceDatabaseUrl}`);
if (t) {
  console.log(`${PREFIX} target (no credentials): host=${t.hostname} port=${t.port} database=${t.database}`);
} else {
  console.log(`${PREFIX} target: could not parse URL (non-fatal)`);
}

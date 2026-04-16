/**
 * Fail-fast check before DB scripts / Prisma: env files loaded from nursenest-core (not shell cwd),
 * DATABASE_URL present (never prints secret), optional host/port/db echo.
 *
 * Run: npm run db:preflight
 */
import "./load-dotenv-for-cli.mts";
import { cliDotenvTelemetry } from "./load-dotenv-for-cli.mts";
import { parsePostgresUrlTargetSafe } from "./cli-db-url-snapshot.mts";
import { databaseUrlSource } from "../src/lib/db/env-bootstrap";

const PREFIX = "[db-preflight]";

if (!process.env.DATABASE_URL?.trim()) {
  console.error(`${PREFIX} FAILED: DATABASE_URL is not set after loading env files from the app package.`);
  console.error(`${PREFIX} packageRoot=${cliDotenvTelemetry.packageRoot}`);
  console.error(
    `${PREFIX} Put the Postgres URI in (gitignored) .env.local next to nursenest-core/package.json, or export DATABASE_URL in the shell.`,
  );
  console.error(`${PREFIX} Inferred last attempt for DATABASE_URL: ${cliDotenvTelemetry.sourceDatabaseUrl}`);
  console.error(`${PREFIX} See docs/database-environment.md`);
  process.exit(1);
}

const raw = process.env.DATABASE_URL.trim();
const t = parsePostgresUrlTargetSafe(raw);
console.log(`${PREFIX} OK: databaseUrlSource=${databaseUrlSource}`);
console.log(`${PREFIX} DATABASE_URL inferred from: ${cliDotenvTelemetry.sourceDatabaseUrl}`);
if (t) {
  console.log(`${PREFIX} target (no credentials): host=${t.hostname} port=${t.port} database=${t.database}`);
} else {
  console.log(`${PREFIX} target: could not parse URL (non-fatal)`);
}

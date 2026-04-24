/**
 * Shared database URL checks for CLI entrypoints (after dotenv + env-bootstrap).
 * Never prints credentials — only package root, context, and inferred dotenv source.
 */
import {
  requireDatabaseEnv,
  type DatabaseUrlContractSource,
} from "../../src/lib/env/require-database-env.ts";
import { cliDotenvTelemetry } from "../load-dotenv-for-cli.mts";

function databaseUrlContractSourceFromCliTelemetry(): DatabaseUrlContractSource {
  if (cliDotenvTelemetry.preDotenv.DATABASE_URL) return "process_env";
  if (cliDotenvTelemetry.afterDotenv.DATABASE_URL) return "dotenv";
  return "unknown";
}

/**
 * Validates `DATABASE_URL` (strict: missing or localhost placeholder throws / exits).
 * Call after `import "../load-dotenv-for-cli.mts"` and
 * `import "../src/lib/db/env-bootstrap"` (or `script-env-bootstrap`
 * for strict DATABASE_URL + dotenv from cwd).
 *
 * Legacy `PROD_DATABASE_URL` is surfaced only by `env-bootstrap.ts` (never merged).
 */
export function assertDatabaseUrlPresentOrExit(context: string): void {
  try {
    requireDatabaseEnv({
      context: `database-env-assert:${context}`,
      urlSource: databaseUrlContractSourceFromCliTelemetry(),
    });
  } catch (err) {
    console.error(`[db-env] ${context}`);
    console.error(err instanceof Error ? err.message : String(err));
    console.error(
      `[db-env] Add DATABASE_URL to ${cliDotenvTelemetry.packageRoot}/.env.local (gitignored) or your host secret store — never commit credentials.`,
    );
    console.error(`[db-env] Expected env files: .env.local → .env.playwright.local → .env`);
    console.error(
      `[db-env] Inferred dotenv source for DATABASE_URL: ${cliDotenvTelemetry.sourceDatabaseUrl}`,
    );
    console.error("[db-env] Documentation: docs/database-environment.md");
    process.exit(1);
  }
}

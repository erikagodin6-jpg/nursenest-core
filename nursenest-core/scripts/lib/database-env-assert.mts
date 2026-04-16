/**
 * Shared database URL checks for CLI entrypoints (after dotenv + env-bootstrap).
 * Never prints credentials — only package root, context, and inferred dotenv source.
 */
import { cliDotenvTelemetry } from "../load-dotenv-for-cli.mts";

/**
 * Exit with a clear message if `DATABASE_URL` is missing. Call after:
 * `import "../load-dotenv-for-cli.mts"` and `import "../src/lib/db/env-bootstrap"` (or equivalent).
 *
 * Legacy `PROD_DATABASE_URL` is surfaced only by `env-bootstrap.ts` (never merged).
 */
export function assertDatabaseUrlPresentOrExit(context: string): void {
  if (process.env.DATABASE_URL?.trim()) return;

  console.error(`[db-env] ${context}`);
  console.error(
    `[db-env] DATABASE_URL is not set. Add it to ${cliDotenvTelemetry.packageRoot}/.env.local (gitignored), or your host secret store — never commit credentials.`,
  );
  console.error(`[db-env] Expected env files relative to package root: .env.local → .env.playwright.local → .env`);
  console.error(`[db-env] Inferred dotenv source for DATABASE_URL: ${cliDotenvTelemetry.sourceDatabaseUrl}`);
  console.error("[db-env] Documentation: docs/database-environment.md");
  process.exit(1);
}

/**
 * Simple runtime check for DATABASE_URL for CLI / Prisma scripts.
 * Avoids broken imports from require-database-env.
 */

import { cliDotenvTelemetry } from "../load-dotenv-for-cli.mts";

export function assertDatabaseUrlPresentOrExit(context: string): void {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    console.error(`[db-env] ${context}`);
    console.error("[db-env] DATABASE_URL is missing.");
    console.error(
      `[db-env] Add DATABASE_URL to ${cliDotenvTelemetry.packageRoot}/.env.local or your host secret store.`,
    );
    console.error("[db-env] Expected env files: .env.local → .env.playwright.local → .env");
    process.exit(1);
  }

  // 🔒 prevent accidental localhost prod usage
  if (url.includes("127.0.0.1:5432") || url.includes("postgres:postgres@")) {
    console.error(`[db-env] ${context}`);
    console.error("[db-env] DATABASE_URL is pointing to a local/placeholder database.");
    process.exit(1);
  }
}
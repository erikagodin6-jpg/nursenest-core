/**
 * Database URL guard for CLI / Prisma scripts.
 * Allows codegen stub during Docker build, blocks bad runtime values.
 */

import { cliDotenvTelemetry } from "../load-dotenv-for-cli.mts";

function isAllowedCodegenStub(url: string): boolean {
  return (
    url.includes("127.0.0.1:65432") &&
    url.includes("nn_prisma_codegen")
  );
}

export function assertDatabaseUrlPresentOrExit(context: string): void {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    console.error(`[db-env] ${context}`);
    console.error("[db-env] DATABASE_URL is missing.");
    process.exit(1);
  }

  // ✅ allow prisma generate stub
  if (isAllowedCodegenStub(url)) {
    return;
  }

  // ❌ block real bad cases
  if (
    url.includes("127.0.0.1:5432") ||
    url.includes("postgres:postgres@127.0.0.1")
  ) {
    console.error(`[db-env] ${context}`);
    console.error("[db-env] DATABASE_URL is pointing to a local/placeholder database.");
    process.exit(1);
  }
}
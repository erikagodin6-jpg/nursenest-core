#!/usr/bin/env npx tsx
/**
 * Deployment / CI: emit a single JSON line describing DATABASE_URL / DIRECT_URL
 * contract status. Never prints credentials or the full connection string.
 */
import {
  isRejectedRuntimePlaceholderDatabaseUrl,
  maskDatabaseUrlHostForLog,
} from "../src/lib/env/require-database-env";

function main(): void {
  const databaseUrlPresent = Boolean(process.env.DATABASE_URL?.trim());
  const directUrlPresent = Boolean(process.env.DIRECT_URL?.trim());
  const raw = process.env.DATABASE_URL?.trim() ?? "";

  let databaseHostMasked = "(none)";
  if (raw) {
    const { host, port } = maskDatabaseUrlHostForLog(raw);
    databaseHostMasked = `${host}:${port}`;
  }

  const rejectsPlaceholder = raw.length > 0 && isRejectedRuntimePlaceholderDatabaseUrl(raw);
  const ok = databaseUrlPresent && !rejectsPlaceholder;

  console.log(
    JSON.stringify({
      databaseUrlPresent,
      directUrlPresent,
      databaseHostMasked,
      rejectsPlaceholder,
      ok,
    }),
  );
}

main();

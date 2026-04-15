/**
 * Live import scripts must call this when `--dry-run` is not set.
 * Parses/normalize-only runs should use `--dry-run` and skip this check.
 */
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";

export function requireDatabaseUrlForLiveImport(scriptLabel: string): void {
  if (isDatabaseUrlConfigured()) return;
  console.error("");
  console.error(`[${scriptLabel}] ABORTED: DATABASE_URL is not set.`);
  console.error("  • For a safe parse without writing to the database, add:  --dry-run");
  console.error("  • For a live import, set DATABASE_URL (e.g. from your secrets manager or .env).");
  console.error("");
  process.exit(1);
}

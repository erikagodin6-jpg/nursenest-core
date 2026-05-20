/**
 * Guardrails for scripts that mutate production-like databases.
 * - Live runs require explicit acknowledgement (flag or env).
 * - Hostname-based extra gate for known managed DB providers (opt-out with IMPORT_ALLOW_PRODUCTION_DATABASE=1).
 */
import { requireDatabaseUrlForLiveImport } from "./require-database-for-live-import.mts";

function databaseHostname(databaseUrl: string): string | null {
  const raw = databaseUrl.trim();
  try {
    return new URL(raw).hostname;
  } catch {
    try {
      const asHttp = raw.replace(/^postgresql(\+[a-z]+)?:\/\//i, "http://").replace(/^postgres:\/\//i, "http://");
      return new URL(asHttp).hostname;
    } catch {
      return null;
    }
  }
}

/**
 * When the DATABASE_URL host looks like a cloud production cluster, require an extra env ack.
 * Does not run in dry-run mode.
 */
export function assertProductionishDatabaseAck(dryRun: boolean, scriptLabel: string): void {
  if (dryRun) return;
  const url = process.env.DATABASE_URL ?? "";
  const host = databaseHostname(url);
  if (!host) return;

  const forceAllow = process.env.IMPORT_ALLOW_PRODUCTION_DATABASE === "1";
  if (forceAllow) return;

  const risky =
    /\.neon\.tech$/i.test(host) ||
    /\.supabase\.co$/i.test(host) ||
    /\.pooler\.supabase\.com$/i.test(host) ||
    /amazonaws\.com$/i.test(host) ||
    /\.azure\.com$/i.test(host);

  if (!risky) return;

  if (process.env.IMPORT_ACK_PRODUCTIONISH_DATABASE !== "I_UNDERSTAND") {
    console.error("");
    console.error(`[${scriptLabel}] Refusing to write: DATABASE_URL host looks like a managed/cloud database:`);
    console.error(`  ${host}`);
    console.error("  • If this is intentional, set IMPORT_ACK_PRODUCTIONISH_DATABASE=I_UNDERSTAND");
    console.error("  • Or set IMPORT_ALLOW_PRODUCTION_DATABASE=1 to bypass this check (use sparingly).");
    console.error("  • Dry-run only: add --dry-run");
    console.error("");
    process.exit(1);
  }
}

export type LiveImportGateOptions = {
  dryRun: boolean;
  argv: string[];
  scriptLabel: string;
};

/**
 * Full precondition gate for live imports (mutating DB).
 * 1) DATABASE_URL set
 * 2) --confirm-write or IMPORT_CONFIRM_WRITE=1
 * 3) productionish host acknowledgement when applicable
 */
export function assertLiveImportPreconditions(opts: LiveImportGateOptions): void {
  const { dryRun, argv, scriptLabel } = opts;
  if (dryRun) return;

  requireDatabaseUrlForLiveImport(scriptLabel);

  const hasFlag = argv.includes("--confirm-write");
  const envOk = process.env.IMPORT_CONFIRM_WRITE === "1";
  if (!hasFlag && !envOk) {
    console.error("");
    console.error(`[${scriptLabel}] Live import blocked: missing acknowledgement.`);
    console.error("  Add:  --confirm-write");
    console.error("  Or:   IMPORT_CONFIRM_WRITE=1");
    console.error("  Parse-only / no writes:  --dry-run");
    console.error("");
    process.exit(1);
  }

  assertProductionishDatabaseAck(false, scriptLabel);
}

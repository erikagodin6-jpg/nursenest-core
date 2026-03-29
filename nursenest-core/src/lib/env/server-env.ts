/**
 * Typed env access for server runtime. Never log raw secrets.
 */
import { maskDatabaseUrl } from "@/lib/db/database-env";

export function optionalEnv(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;
}

/** Use for paths that must exist at runtime (returns undefined if missing — caller decides 500 vs degrade). */
export function requireEnv(name: string): string | undefined {
  return optionalEnv(name);
}

/** Safe one-line for logs: host + db name only. */
export function maskConnectionStringHost(url: string): string {
  return maskDatabaseUrl(url);
}

let startupLogged = false;

/**
 * Node production only — no `process.cwd` (Edge/instrumentation must stay compatible).
 */
export function logStartupContext(): void {
  if (startupLogged) return;
  startupLogged = true;
  if (process.env.NODE_ENV !== "production") return;

  const db = process.env.DATABASE_URL?.trim();
  const port = process.env.PORT ?? "(unset)";
  console.error(
    `[nursenest-core] startup: NODE_ENV=${process.env.NODE_ENV ?? "(unset)"} PORT=${port} bind=0.0.0.0 (next start) databaseUrl=${db ? `configured masked=${maskDatabaseUrl(db)}` : "missing"}`,
  );
}

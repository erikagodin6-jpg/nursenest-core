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
  const nodeEnv = process.env.NODE_ENV?.trim();
  if (!nodeEnv) {
    console.error("[nursenest-core] startup_env_warning NODE_ENV is unset; production deploys must set NODE_ENV=production");
  }
  if (nodeEnv !== "production") return;

  const db = process.env.DATABASE_URL?.trim();
  const port = process.env.PORT ?? "(unset)";
  const argv1 = (process.argv[1] ?? "").replace(/\\/g, "/");
  const serverLabel =
    argv1.includes(".next/standalone/") && argv1.endsWith("/server.js")
      ? "standalone server.js"
      : argv1.endsWith("/scripts/start-standalone.mjs")
        ? "start-standalone.mjs → standalone"
        : "node";
  console.error(
    `[nursenest-core] startup: NODE_ENV=${nodeEnv ?? "(unset)"} PORT=${port} bind=0.0.0.0 (${serverLabel}) databaseUrl=${db ? `configured masked=${maskDatabaseUrl(db)}` : "missing"}`,
  );
}

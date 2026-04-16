/**
 * Safe, secret-free helpers for CLI DB connection diagnostics.
 */
import { readFileSync, existsSync } from "node:fs";

export type DbEnvPresence = {
  DATABASE_URL: boolean;
  DATABASE_DIRECT_URL: boolean;
};

export function dbEnvPresence(): DbEnvPresence {
  return {
    DATABASE_URL: Boolean(process.env.DATABASE_URL?.trim()),
    DATABASE_DIRECT_URL: Boolean(process.env.DATABASE_DIRECT_URL?.trim()),
  };
}

/** True if the file exists and contains `KEY=` (value not read). */
export function envFileDeclaresKeySync(filePath: string, key: string): boolean {
  if (!existsSync(filePath)) return false;
  try {
    const raw = readFileSync(filePath, "utf8");
    const re = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=`, "m");
    return re.test(raw);
  } catch {
    return false;
  }
}

export type ParsedPgTarget = {
  hostname: string;
  port: string;
  database: string;
};

/**
 * Host, port, database name only — never username/password.
 * Uses authority splitting (last `@` before host) so passwords may contain `@`.
 */
export function parsePostgresUrlTargetSafe(rawUrl: string): ParsedPgTarget | null {
  const s = rawUrl.trim().split("?")[0] ?? "";
  if (!s) return null;
  const scheme = s.match(/^postgres(ql)?:\/\//i);
  if (!scheme) return null;
  const rest = s.slice(scheme[0].length);
  const slash = rest.indexOf("/");
  if (slash < 0) return null;
  const authority = rest.slice(0, slash);
  const database = rest.slice(slash + 1).split("/")[0] || "(empty)";
  const hostPort = authority.includes("@")
    ? authority.slice(authority.lastIndexOf("@") + 1)
    : authority;
  const colon = hostPort.lastIndexOf(":");
  if (colon > 0 && /^\d+$/.test(hostPort.slice(colon + 1))) {
    return {
      hostname: hostPort.slice(0, colon) || "(empty)",
      port: hostPort.slice(colon + 1),
      database,
    };
  }
  return { hostname: hostPort || "(empty)", port: "5432", database };
}

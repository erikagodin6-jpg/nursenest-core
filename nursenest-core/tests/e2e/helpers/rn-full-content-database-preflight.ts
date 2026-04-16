/**
 * Node-side DATABASE_URL connectivity check for RN full-content (Playwright worker).
 * Never logs passwords or full connection strings.
 */
import pg from "pg";

import type { DatabasePreflightClassification } from "./rn-full-content-phase0-classification";

export type RnDatabasePreflightResult = {
  attempted: boolean;
  /** True when DATABASE_URL was non-empty and a TCP connect was attempted. */
  connectAttempted: boolean;
  classification: DatabasePreflightClassification;
  /** Safe one-line summary (no secrets). */
  safeSummary: string;
  /** Parsed for operator context — never includes password. */
  redactedTarget?: { host: string; port: string; database: string; user: string };
};

function redactConnectionTarget(rawUrl: string): { host: string; port: string; database: string; user: string } | undefined {
  try {
    const u = new URL(rawUrl);
    const path = u.pathname.replace(/^\//, "") || "(default)";
    return {
      host: u.hostname || "(unknown-host)",
      port: u.port || "5432",
      database: path.split("/")[0] || "(default)",
      user: decodeURIComponent(u.username || "(unknown-user)"),
    };
  } catch {
    return undefined;
  }
}

function classifyPgErrorMessage(msg: string): DatabasePreflightClassification {
  const m = msg.toLowerCase();
  if (/password authentication failed|must provide a password|authentication failed.*password/i.test(msg)) {
    return "DB_AUTH_FAILURE";
  }
  if (/econnrefused|connection refused/i.test(m)) return "CONNECTION_REFUSED";
  if (/timeout|etimedout/i.test(m)) return "TIMEOUT";
  if (/enotfound|getaddrinfo|eai_again/i.test(m)) return "DNS_OR_NETWORK";
  return "OTHER";
}

/**
 * Attempts a short `pg` connect using `process.env.DATABASE_URL`.
 * If DATABASE_URL is missing, returns SKIPPED (suite still runs — app may use other config).
 */
export async function probeDatabaseUrlFromEnv(): Promise<RnDatabasePreflightResult> {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    return {
      attempted: false,
      connectAttempted: false,
      classification: "SKIPPED_NO_DATABASE_URL",
      safeSummary: "DATABASE_URL not set in Playwright process — preflight skipped (set it to match the dev server for definitive DB classification).",
    };
  }

  const redactedTarget = redactConnectionTarget(raw);
  const client = new pg.Client({
    connectionString: raw,
    connectionTimeoutMillis: 8000,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end().catch(() => {});
    return {
      attempted: true,
      connectAttempted: true,
      classification: "OK",
      safeSummary: "DATABASE_URL accepted by Postgres (SELECT 1 ok).",
      redactedTarget,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const classification = classifyPgErrorMessage(msg);
    await client.end().catch(() => {});
    const safeSummary =
      classification === "DB_AUTH_FAILURE"
        ? "Postgres rejected DATABASE_URL credentials (password authentication failed — fix DB role password / URL, not QA web password)."
        : `Postgres connect/query failed [${classification}]: ${msg.slice(0, 200)}`;
    return {
      attempted: true,
      connectAttempted: true,
      classification,
      safeSummary,
      redactedTarget,
    };
  }
}

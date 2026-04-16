import "server-only";

/**
 * Operator-safe DB error buckets for health checks and RN E2E artifacts.
 * Never expose raw connection strings or passwords.
 */
export type DatabaseHealthClassification =
  | "OK"
  | "DATABASE_URL_NOT_CONFIGURED"
  | "DB_AUTH_FAILURE"
  | "DB_TIMEOUT"
  | "DB_UNREACHABLE"
  | "DB_OTHER";

const AUTH_FAIL_RE =
  /password authentication failed|authentication failed for user|invalid_authorization_specification|SASL|28P01/i;
const TIMEOUT_RE = /database_probe_timeout|timeout|timed out|ETIMEDOUT/i;
const REFUSED_RE = /ECONNREFUSED|connection refused|ENOTFOUND|getaddrinfo/i;

export function classifyDatabaseErrorMessage(message: string): Exclude<DatabaseHealthClassification, "OK" | "DATABASE_URL_NOT_CONFIGURED"> {
  const m = message.slice(0, 500);
  if (AUTH_FAIL_RE.test(m)) return "DB_AUTH_FAILURE";
  if (TIMEOUT_RE.test(m)) return "DB_TIMEOUT";
  if (REFUSED_RE.test(m)) return "DB_UNREACHABLE";
  return "DB_OTHER";
}

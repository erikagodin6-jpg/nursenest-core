/**
 * Redact secrets and credential-bearing strings before logs or telemetry.
 * Prefer structured fields; never pass raw Authorization cookies to console.
 */
import { maskDatabaseUrl } from "@/lib/db/database-env";

const SENSITIVE_KEY_SUBSTRINGS = [
  "secret",
  "password",
  "token",
  "authorization",
  "cookie",
  "apikey",
  "api_key",
  "bearer",
  "credential",
  "stripe",
  "payment",
  "cardnumber",
  "card_number",
] as const;

/** True if key looks like it may hold a secret (shallow key scan). */
export function isLikelySensitiveKey(key: string): boolean {
  const k = key.toLowerCase();
  // Truncated opaque ids for logs (eventIdPrefix, tokenHashPrefix, …) — not credential material.
  if (/(^|_)(id|hash|key)prefix$/i.test(k)) return false;
  return SENSITIVE_KEY_SUBSTRINGS.some((s) => k.includes(s));
}

/** Mask userinfo in postgres/mysql-style URLs; passthrough for non-URLs. */
export function redactConnectionString(url: string): string {
  return maskDatabaseUrl(url);
}

/** Truncate bearer tokens and opaque secrets for one-line logs. */
export function redactOpaqueSecret(value: string | undefined | null, visibleTail = 4): string {
  if (value == null || value === "") return "";
  const t = String(value).trim();
  if (t.length <= visibleTail) return "***";
  return `***${t.slice(-visibleTail)}`;
}

/**
 * Redact `Authorization` header values for logs (Bearer, Basic, etc.).
 * Pass the full header value, not the key name.
 */
export function redactAuthorizationHeaderValue(value: string | undefined | null): string {
  if (value == null || value === "") return "";
  const t = String(value).trim();
  const m = /^Bearer\s+(\S+)/i.exec(t);
  if (m) return `Bearer ${redactOpaqueSecret(m[1])}`;
  if (/^Basic\s+/i.test(t)) return "Basic ***";
  return redactOpaqueSecret(t);
}

/**
 * Shallow sanitize: redacts values whose keys look sensitive; truncates long strings.
 * Does not recurse — nest plain objects only when you control shape.
 */
export function redactMetaForLog(meta: Record<string, unknown>, maxStringLen = 500): Record<string, string | number | boolean | undefined> {
  const out: Record<string, string | number | boolean | undefined> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (isLikelySensitiveKey(k)) {
      if (typeof v === "string") {
        out[k] = redactOpaqueSecret(v);
      } else {
        out[k] = "[redacted]";
      }
      continue;
    }
    if (typeof v === "string") {
      let s = v;
      if (s.startsWith("postgresql://") || s.startsWith("postgres://") || s.includes("://") && s.includes("@")) {
        s = redactConnectionString(s);
      }
      out[k] = s.length > maxStringLen ? `${s.slice(0, maxStringLen)}…` : s;
    } else if (typeof v === "number" || typeof v === "boolean" || v === undefined) {
      out[k] = v as number | boolean | undefined;
    } else if (v === null) {
      out[k] = undefined;
    } else {
      out[k] = "[object]";
    }
  }
  return out;
}

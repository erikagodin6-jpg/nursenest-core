/**
 * Defensive helpers so malformed translation payloads (wrong types, nested JSON, huge keys)
 * never propagate to string operations that could throw at runtime.
 *
 * Callers should normalize bundles once at load / provider boundaries; {@link formatMarketingMessage}
 * also coerces lookups as a second line of defense.
 */

export const MAX_MARKETING_MESSAGE_KEY_LEN = 512;

/** Flat bundle: string values only (JSON cannot preserve real nested objects as leaf strings). */
export type NormalizedMarketingMessages = Record<string, string>;

export function safeMessageKey(key: unknown): string {
  if (key === null || key === undefined) return "";
  const s = String(key);
  return s.length > MAX_MARKETING_MESSAGE_KEY_LEN ? s.slice(0, MAX_MARKETING_MESSAGE_KEY_LEN) : s;
}

/**
 * Coerces a single JSON leaf to a display string, or `undefined` if unusable.
 * Objects/arrays are rejected (prevents `[object Object]` or runtime errors downstream).
 */
export function coerceFlatMessageValue(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string") return v.trim() === "" ? undefined : v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return undefined;
}

/**
 * Parses an unknown JSON root into a flat string map; drops invalid entries.
 * Never throws.
 */
export function normalizeMarketingMessagesRecord(raw: unknown): NormalizedMarketingMessages {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: NormalizedMarketingMessages = {};
  for (const [k0, v] of Object.entries(raw as Record<string, unknown>)) {
    const k = k0.length > MAX_MARKETING_MESSAGE_KEY_LEN ? k0.slice(0, MAX_MARKETING_MESSAGE_KEY_LEN) : k0;
    const coerced = coerceFlatMessageValue(v);
    if (coerced === undefined) continue;
    out[k] = coerced;
  }
  return out;
}

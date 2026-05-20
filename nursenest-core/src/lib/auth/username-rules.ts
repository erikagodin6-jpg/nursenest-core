/**
 * Username rules for signup and login (normalized handle is lowercase).
 * 3–30 chars; letters, digits, underscore, single dots (no leading/trailing/dot runs).
 */

const RESERVED = new Set([
  "about",
  "account",
  "admin",
  "api",
  "app",
  "auth",
  "billing",
  "contact",
  "dashboard",
  "help",
  "login",
  "logout",
  "mail",
  "me",
  "oauth",
  "register",
  "root",
  "settings",
  "signup",
  "support",
  "system",
  "www",
  "nursenest",
  "nurse-nest",
]);

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export type UsernameValidation =
  | { ok: true; normalized: string }
  | { ok: false; reason: "empty" | "length" | "chars" | "dots" | "reserved" };

export function validateUsernameForSignup(raw: string): UsernameValidation {
  const normalized = normalizeUsername(raw);
  if (!normalized) return { ok: false, reason: "empty" };
  if (normalized.length < 3 || normalized.length > 30) {
    return { ok: false, reason: "length" };
  }
  if (!/^[a-z0-9_.]+$/.test(normalized)) {
    return { ok: false, reason: "chars" };
  }
  if (normalized.startsWith(".") || normalized.endsWith(".") || normalized.includes("..")) {
    return { ok: false, reason: "dots" };
  }
  if (RESERVED.has(normalized)) {
    return { ok: false, reason: "reserved" };
  }
  return { ok: true, normalized };
}

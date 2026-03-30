import type { CountryCode } from "@prisma/client";

/**
 * Returns a valid Prisma `CountryCode` only for known CA/US values.
 * Any other value (null, empty, unexpected string) becomes null so callers
 * deny region-scoped access instead of matching the wrong country.
 */
export function normalizeCountryCodeForEntitlement(value: unknown): CountryCode | null {
  if (value === "CA" || value === "US") return value;
  if (typeof value !== "string") return null;
  const u = value.trim().toUpperCase();
  if (u === "CA" || u === "US") return u as CountryCode;
  return null;
}

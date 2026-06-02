/**
 * Cursor-first pagination contract for list APIs (aligns with lessons cursor mode).
 * Offset limits for legacy routes live in {@link "@/lib/api/api-pagination-limits"}.
 */

/** Default page size for learner-facing list UIs. */
export const DEFAULT_PAGE_LIMIT = 20;

/** Hard cap for any single list request (items returned in one round-trip). */
export const MAX_PAGE_LIMIT = 100;

export type CursorPage<T> = {
  items: T[];
  /** Opaque cursor for the next page, or null when done. */
  nextCursor: string | null;
};

/**
 * Safe integer limit for APIs: clamps to [1, maxLimit], defaulting when missing/invalid.
 */
export function getSafeLimit(
  requested: number | string | null | undefined,
  defaultLimit: number = DEFAULT_PAGE_LIMIT,
  maxLimit: number = MAX_PAGE_LIMIT,
): number {
  const d = Math.max(1, Math.floor(defaultLimit));
  const m = Math.max(1, Math.floor(maxLimit));
  if (requested === null || requested === undefined || requested === "") return Math.min(d, m);
  const n = typeof requested === "string" ? Number(requested.trim()) : requested;
  if (!Number.isFinite(n) || !Number.isInteger(n)) return Math.min(d, m);
  return Math.min(Math.max(n, 1), m);
}

/**
 * Encode an opaque cursor (base64url JSON). Prefer domain-specific cursors where order matters.
 */
export function buildCursorToken(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function parseCursorToken<T extends Record<string, unknown>>(raw: string | null): T | null {
  if (raw == null || raw.trim() === "") return null;
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

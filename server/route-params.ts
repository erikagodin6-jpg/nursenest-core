/** Express 5 types `req.params.*` as `string | string[]` — normalize for string-only APIs. */
export function routeParamString(p: string | string[] | undefined): string {
  if (p === undefined) return "";
  return Array.isArray(p) ? (p[0] ?? "") : p;
}

/** First query value when Express types `req.query.*` as `string | string[] | undefined`. */
export function queryParamString(q: string | string[] | undefined): string | undefined {
  if (q === undefined) return undefined;
  const s = Array.isArray(q) ? q[0] : q;
  if (s === undefined || s === "") return undefined;
  return String(s);
}

/**
 * After normalization, empty route params often mean a bad client request — use for required IDs/slugs.
 */
export function nonEmptyRouteParamString(p: string | string[] | undefined): string | undefined {
  const s = routeParamString(p).trim();
  return s === "" ? undefined : s;
}

/**
 * Parse a base-10 integer from query. Non-numeric, negative, NaN, and Infinity yield `fallback`.
 * When `max` is set, values above it clamp to `max`.
 */
export function queryParamNonNegativeInt(
  q: string | string[] | undefined,
  fallback: number,
  max?: number,
): number {
  const raw = queryParamString(q);
  if (raw === undefined) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  if (typeof max === "number" && n > max) return max;
  return n;
}

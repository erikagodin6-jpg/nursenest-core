/**
 * Shared auth for internal reliability HTTP endpoints.
 * Wrong/missing secret → callers should respond with **404** (not 401) to avoid probing signal.
 */

export const RELIABILITY_SECRET_HEADER = "x-nursenest-reliability-secret" as const;

export function readReliabilitySecretFromEnv(): string | undefined {
  const raw = process.env.NURSENEST_RELIABILITY_SECRET;
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}

export function isReliabilityRequestAuthorized(request: Request): boolean {
  const expected = readReliabilitySecretFromEnv();
  if (!expected) return false;
  const presented = request.headers.get(RELIABILITY_SECRET_HEADER)?.trim();
  return presented === expected;
}

/**
 * Paid seeded test account (premium entitlements, no Stripe in routine E2E).
 *
 * **Do not commit real credentials.** Provide via environment variables:
 *
 * 1. **Preferred:** `E2E_PAID_EMAIL` and `E2E_PAID_PASSWORD`
 * 2. **Alternative:** `PLAYWRIGHT_TEST_EMAIL` and `PLAYWRIGHT_TEST_PASSWORD` (same semantics)
 *
 * Optional: `PLAYWRIGHT_PAID_AUTH_STATE` overrides the saved storage JSON path (see `auth-state-paths.ts`).
 */
export type PaidTestCredentials = { email: string; password: string };

export function getPaidTestCredentials(): PaidTestCredentials | null {
  const a = process.env.E2E_PAID_EMAIL?.trim();
  const b = process.env.E2E_PAID_PASSWORD;
  if (a && b) {
    return { email: a, password: b };
  }
  const c = process.env.PLAYWRIGHT_TEST_EMAIL?.trim();
  const d = process.env.PLAYWRIGHT_TEST_PASSWORD;
  if (c && d) {
    return { email: c, password: d };
  }
  return null;
}

export function hasPaidTestCredentials(): boolean {
  return getPaidTestCredentials() !== null;
}

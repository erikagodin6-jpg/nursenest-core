/**
 * Public absolute origin for Stripe return URLs and billing redirects.
 * In **production**, missing `NEXT_PUBLIC_APP_URL` is unsafe (localhost fallbacks);
 * callers should treat `null` as misconfiguration.
 */
export function publicAppOriginForBilling(): string | null {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }
  return null;
}

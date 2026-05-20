/**
 * DSN resolution — never hardcode secrets.
 * - Server/Edge: prefer `SENTRY_DSN`, fall back to `NEXT_PUBLIC_SENTRY_DSN` (e.g. single env in some hosts).
 * - Browser: only `NEXT_PUBLIC_SENTRY_DSN` is available at runtime; set it to the same project DSN as the server.
 */
export function getSentryDsnServer(): string | undefined {
  const d = process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  return d || undefined;
}

export function getSentryDsnClient(): string | undefined {
  const d = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  return d || undefined;
}

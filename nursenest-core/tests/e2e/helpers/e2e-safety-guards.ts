/**
 * Guards so Stripe + signup E2E never targets production billing by accident.
 */

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

function parseHost(baseURL: string): string | null {
  try {
    return new URL(baseURL).hostname;
  } catch {
    return null;
  }
}

/**
 * Throws if BASE_URL is not explicitly allowed for destructive / billing-adjacent E2E.
 *
 * Allowed by default: localhost / 127.0.0.1.
 * Optional: comma-separated hostnames in `E2E_ALLOWED_HOSTS` (e.g. staging preview host).
 */
export function assertSafeSubscriberJourneyBaseUrl(baseURL: string): void {
  const host = parseHost(baseURL);
  if (!host) {
    throw new Error(`Invalid BASE_URL for E2E: ${baseURL}`);
  }
  if (LOCAL_HOSTS.has(host)) return;

  const extra = process.env.E2E_ALLOWED_HOSTS?.split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (extra?.includes(host.toLowerCase())) return;

  throw new Error(
    [
      `Unsafe BASE_URL for subscriber journey E2E: ${baseURL}`,
      "Use http://127.0.0.1:<port> or localhost, or add the hostname to E2E_ALLOWED_HOSTS.",
      "Do not point this at production.",
    ].join(" "),
  );
}

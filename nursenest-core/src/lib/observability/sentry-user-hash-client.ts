/** Browser-safe SHA-256 prefix for Sentry user context (matches server anonymization intent). */
export async function sentryUserHashClient(userId: string): Promise<string> {
  const enc = new TextEncoder().encode(userId);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 8);
}

/**
 * Best-effort client IP for rate limiting behind proxies (Vercel, Cloudflare, nginx).
 * Not a security boundary; treat as abuse-signal only.
 */
export function getTrustedClientIp(req: { headers: Headers }): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const trueClient = req.headers.get("true-client-ip")?.trim();
  if (trueClient) return trueClient;
  return "unknown";
}

export function ipRateLimitKey(ip: string, route: string): string {
  const safe = ip.replace(/[^a-zA-Z0-9.:_-]/g, "_").slice(0, 128);
  return `api:ip:${safe}:${route}`;
}

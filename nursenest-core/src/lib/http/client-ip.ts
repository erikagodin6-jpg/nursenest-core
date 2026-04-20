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

/**
 * When {@link getTrustedClientIp} is `unknown`, every client would otherwise share one global bucket
 * (`…:ip:unknown`) and hit 429 together. Spread unknown clients using coarse request hints (not a
 * stable identity — abuse-only partitioning).
 */
export function rateLimitClientPartition(req: { headers: Headers }, ip: string): string {
  if (ip !== "unknown") return ip;
  const ua = req.headers.get("user-agent") ?? "";
  const al = req.headers.get("accept-language") ?? "";
  const seed = `${ua.slice(0, 160)}|${al.slice(0, 48)}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const part = (h >>> 0).toString(36).slice(0, 10);
  return `unknown:${part}`;
}

export function ipRateLimitKey(ip: string, route: string): string {
  const safe = ip.replace(/[^a-zA-Z0-9.:_-]/g, "_").slice(0, 128);
  return `api:ip:${safe}:${route}`;
}

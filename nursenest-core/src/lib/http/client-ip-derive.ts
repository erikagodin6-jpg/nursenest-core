/**
 * Derives a best-effort client IP for rate limiting behind reverse proxies (DO App Platform, nginx, Cloudflare).
 * Not a security boundary — abuse signal only.
 */

export type TrustedClientIpSource =
  | "cf-connecting-ip"
  | "true-client-ip"
  | "x-real-ip"
  | "x-forwarded-for"
  | "unknown";

export type TrustedClientIpDerivation = {
  ip: string;
  source: TrustedClientIpSource;
  /** Which header supplied the chosen IP (for structured logs). */
  headerName: TrustedClientIpSource | null;
};

function trimHeader(h: Headers, name: string): string | null {
  const v = h.get(name)?.trim();
  return v && v.length > 0 ? v : null;
}

function parseIpv4Octets(s: string): [number, number, number, number] | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(s);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const c = Number(m[3]);
  const d = Number(m[4]);
  if (![a, b, c, d].every((n) => n >= 0 && n <= 255)) return null;
  return [a, b, c, d];
}

/** True for RFC1918, loopback, link-local, CGNAT — not a stable end-user identity for RL. */
export function isNonRoutableOrPrivateIpv4(octets: [number, number, number, number]): boolean {
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateOrNonRoutableIp(raw: string): boolean {
  const s = raw.trim();
  if (!s) return true;
  const lower = s.toLowerCase();
  if (lower === "unknown") return true;
  if (lower === "::1") return true;
  if (lower.startsWith("fe80:")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  const v4 = s.startsWith("::ffff:") ? s.slice("::ffff:".length) : s;
  const o = parseIpv4Octets(v4);
  if (o) return isNonRoutableOrPrivateIpv4(o);
  return false;
}

function firstPublicFromForwardedList(parts: string[]): string | null {
  for (const p of parts) {
    const ip = p.trim();
    if (!ip) continue;
    if (!isPrivateOrNonRoutableIp(ip)) return ip;
  }
  return null;
}

/**
 * Parses `x-forwarded-for` safely: returns the first **public** client hop.
 * If every value is private/link-local (LB chains), returns `null` so callers fall back to
 * `unknown` + coarse header partitioning instead of pinning everyone to one internal proxy IP.
 */
export function pickClientIpFromXForwardedFor(forwarded: string): string | null {
  const parts = forwarded.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  return firstPublicFromForwardedList(parts);
}

export function deriveTrustedClientIp(req: { headers: Headers }): TrustedClientIpDerivation {
  const h = req.headers;
  const cf = trimHeader(h, "cf-connecting-ip");
  if (cf && !isPrivateOrNonRoutableIp(cf)) {
    return { ip: cf, source: "cf-connecting-ip", headerName: "cf-connecting-ip" };
  }
  const trueClient = trimHeader(h, "true-client-ip");
  if (trueClient && !isPrivateOrNonRoutableIp(trueClient)) {
    return { ip: trueClient, source: "true-client-ip", headerName: "true-client-ip" };
  }
  const real = trimHeader(h, "x-real-ip");
  if (real && !isPrivateOrNonRoutableIp(real)) {
    return { ip: real, source: "x-real-ip", headerName: "x-real-ip" };
  }
  const xffRaw = h.get("x-forwarded-for");
  if (xffRaw) {
    const picked = pickClientIpFromXForwardedFor(xffRaw);
    if (picked) {
      return { ip: picked, source: "x-forwarded-for", headerName: "x-forwarded-for" };
    }
  }
  if (cf) return { ip: cf, source: "cf-connecting-ip", headerName: "cf-connecting-ip" };
  if (trueClient) return { ip: trueClient, source: "true-client-ip", headerName: "true-client-ip" };
  if (real) return { ip: real, source: "x-real-ip", headerName: "x-real-ip" };
  return { ip: "unknown", source: "unknown", headerName: null };
}

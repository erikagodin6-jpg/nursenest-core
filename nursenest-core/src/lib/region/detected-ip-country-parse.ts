type HeaderGetter = (name: string) => string | null;

/** ISO 3166-1 alpha-2 when present (Vercel / Cloudflare / common proxies). */
export function parseDetectedIpCountryFromHeaderGet(headerGet: HeaderGetter): string | null {
  const raw =
    headerGet("x-vercel-ip-country") ??
    headerGet("cf-ipcountry") ??
    headerGet("CF-IPCountry");
  const v = (raw ?? "").trim().toUpperCase();
  return v.length === 2 ? v : null;
}

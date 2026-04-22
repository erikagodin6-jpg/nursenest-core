import "server-only";

import { parseDetectedIpCountryFromHeaderGet } from "@/lib/region/detected-ip-country-parse";

/** ISO 3166-1 alpha-2 when present (Vercel / Cloudflare / common proxies). */
export function detectedIpCountryFromHeaders(headerList: Headers): string | null {
  return parseDetectedIpCountryFromHeaderGet(headerList.get.bind(headerList));
}

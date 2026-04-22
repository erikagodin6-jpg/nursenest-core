/**
 * Stable query string for passing Next.js `searchParams` from RSC into client pricing/checkout flows
 * without `useSearchParams()` (avoids CSR bailout + outer Suspense skeleton on `/pricing`).
 */
export function serializeMarketingPageSearchParams(
  sp: Record<string, string | string[] | undefined> | undefined | null,
): string {
  if (!sp || typeof sp !== "object") return "";
  const u = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== null) u.append(key, String(v));
      }
    } else {
      u.set(key, String(value));
    }
  }
  return u.toString();
}

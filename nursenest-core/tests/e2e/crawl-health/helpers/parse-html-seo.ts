/** Compare absolute URLs for canonical audit (origin + path + search; slash-normalize path). */
export function urlsSeoMatch(a: string, b: string): boolean {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    if (ua.origin !== ub.origin) return false;
    const pa = ua.pathname.replace(/\/$/, "") || "/";
    const pb = ub.pathname.replace(/\/$/, "") || "/";
    if (pa !== pb) return false;
    return ua.search === ub.search;
  } catch {
    return false;
  }
}

export type ParsedHtmlSeo = {
  canonicalHref: string | null;
  robotsContent: string | null;
  /** Truncated first JSON-LD block for debugging (not validated). */
  jsonLdSnippet: string | null;
};

/**
 * Regex-only parse — tolerant of attribute order and quote style.
 */
export function parseHtmlSeo(html: string): ParsedHtmlSeo {
  const canon =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const robots =
    html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i) ??
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']robots["'][^>]*>/i);
  let jsonLdSnippet: string | null = null;
  const ldMatch = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]{0,8000}?)<\/script>/i,
  );
  if (ldMatch?.[1]) {
    const t = ldMatch[1].trim().replace(/\s+/g, " ");
    jsonLdSnippet = t.length > 600 ? `${t.slice(0, 600)}…` : t;
  }
  return {
    canonicalHref: canon?.[1]?.trim() ?? null,
    robotsContent: robots?.[1]?.trim().toLowerCase() ?? null,
    jsonLdSnippet,
  };
}

const SKIP_INTERNAL_PREFIXES = /^\/(_next|api|app|admin)(\/|$)/i;

/** Same-origin marketing paths only — locale-agnostic (`/fr/...` allowed). */
export function extractInternalPathnames(html: string, limit: number, pageOrigin?: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const re = /<a[^>]+href=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null && out.length < limit) {
    const raw = m[1]?.trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("javascript:")) continue;
    if (raw.startsWith("//")) continue;
    let pathname: string;
    try {
      if (raw.startsWith("/")) {
        pathname = raw.split("?")[0]?.split("#")[0] ?? raw;
      } else if (/^https?:\/\//i.test(raw)) {
        const u = new URL(raw);
        if (pageOrigin && u.origin !== pageOrigin) continue;
        pathname = u.pathname;
      } else {
        continue;
      }
    } catch {
      continue;
    }
    if (!pathname.startsWith("/")) continue;
    if (SKIP_INTERNAL_PREFIXES.test(pathname)) continue;
    if (seen.has(pathname)) continue;
    seen.add(pathname);
    out.push(pathname);
  }
  return out;
}

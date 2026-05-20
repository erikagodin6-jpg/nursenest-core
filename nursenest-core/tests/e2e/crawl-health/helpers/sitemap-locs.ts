import type { APIRequestContext } from "@playwright/test";

/**
 * Fetch `/sitemap.xml` and extract `<loc>` URLs (no full XML parser — sufficient for urlsets).
 */
export async function fetchSitemapLocs(request: APIRequestContext, sitemapUrl: string, max: number): Promise<string[]> {
  const res = await request.get(sitemapUrl, { timeout: 60_000 });
  if (!res.ok()) {
    return [];
  }
  const xml = await res.text();
  const out: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null && out.length < max) {
    const loc = m[1]?.trim();
    if (loc) out.push(loc);
  }
  return [...new Set(out)];
}

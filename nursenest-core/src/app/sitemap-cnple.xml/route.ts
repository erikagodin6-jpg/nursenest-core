import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { CNPLE_SITEMAP_PATHS } from "@/lib/seo/cnple-seo-cluster";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * CNPLE SEO cluster urlset — all secondary pillar, uncertainty-capture, domain, and population
 * pages for the Canadian NP licensure exam content lane.
 *
 * Static: no DB I/O. All paths are known at build time from {@link CNPLE_SITEMAP_PATHS}.
 * Revalidates on standard ISR cadence (Next.js force-static).
 */
export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  const entries: SitemapUrlEntry[] = CNPLE_SITEMAP_PATHS.map((path) => ({
    loc: `${origin}${path}`,
    changefreq: "weekly" as const,
    priority: path === "/cnple-practice-questions" || path === "/canada-np-exam-prep" ? "0.9" : "0.8",
  }));

  const filtered = filterPublicSitemapEntries(entries, origin);

  const seen = new Set<string>();
  const unique = filtered.filter((e) => {
    if (!e.loc || seen.has(e.loc)) return false;
    seen.add(e.loc);
    return true;
  });

  const xml = buildSitemapUrlsetFromAbsoluteUrls(
    unique.length > 0 ? unique : [{ loc: `${origin}/cnple-practice-questions` }],
  );

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}

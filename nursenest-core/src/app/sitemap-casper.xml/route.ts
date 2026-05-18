import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { CASPER_SITEMAP_PATHS } from "@/lib/seo/casper-seo-cluster";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { buildSitemapUrlsetFromAbsoluteUrls, normalizeOrigin, type SitemapUrlEntry } from "@/lib/seo/sitemap-static-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  const entries: SitemapUrlEntry[] = CASPER_SITEMAP_PATHS.map((path) => ({
    loc: `${origin}${path}`,
    changefreq: "weekly" as const,
    priority: path === "/casper" || path === "/casper/practice-test" ? "0.9" : "0.8",
  }));

  const filtered = filterPublicSitemapEntries(entries, origin);
  const xml = buildSitemapUrlsetFromAbsoluteUrls(filtered.length > 0 ? filtered : [{ loc: `${origin}/casper` }]);

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) return new Response(null, { status: 304, headers });
  return new Response(xml, { status: 200, headers });
}

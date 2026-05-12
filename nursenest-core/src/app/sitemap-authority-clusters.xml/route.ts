import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { listAuthorityClusterPaths } from "@/lib/seo/authority-cluster-pages";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());
  const entries: SitemapUrlEntry[] = listAuthorityClusterPaths().map((path) => ({ loc: `${origin}${path}` }));
  const filtered = filterPublicSitemapEntries(entries, origin);
  const seen = new Set<string>();
  const unique = filtered.filter((entry) => {
    if (!entry.loc || seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });

  const xml = buildSitemapUrlsetFromAbsoluteUrls(unique.length > 0 ? unique : [{ loc: `${origin}/canada/np/cnple` }]);
  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}

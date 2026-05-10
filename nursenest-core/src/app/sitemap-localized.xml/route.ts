import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { SITEMAP_FALLBACK_LOCALIZED_PATHS } from "@/lib/seo/sitemap-index-children";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectLocalizedMarketingSegmentUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Tier-full (`MarketingLanguageTier === "full"`) localized marketing URLs only — same eligibility as
 * {@link getSitemapIncludedLocales} / {@link collectLocaleMarketingSitemapSafeUrls}. Partial/incomplete locales are omitted.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  let xml: string;

  try {
    const localizedStrings = collectLocalizedMarketingSegmentUrls(origin);
    const entries: SitemapUrlEntry[] = localizedStrings.map((loc) => ({ loc }));
    const filtered = filterPublicSitemapEntries(entries, origin);

    const seen = new Set<string>();
    const unique = filtered.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(
      unique.length > 0 ? unique : [{ loc: `${origin}/es` }],
    );
  } catch {
    const fallbackEntries: SitemapUrlEntry[] = SITEMAP_FALLBACK_LOCALIZED_PATHS.map((path) => ({
      loc: `${origin}${path === "/" ? "" : path}`,
    }));
    const filteredFallback = filterPublicSitemapEntries(fallbackEntries, origin);
    xml = buildSitemapUrlsetFromAbsoluteUrls(
      filteredFallback.length > 0 ? filteredFallback : [{ loc: `${origin}/es` }],
    );
  }

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}

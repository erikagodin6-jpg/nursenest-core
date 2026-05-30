import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { collectClinicalModulesSitemapUrls } from "@/lib/seo/clinical-modules-sitemap-urls";
import { SITEMAP_FALLBACK_CLINICAL_MODULES_PATHS } from "@/lib/seo/sitemap-index-children";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Public clinical readiness marketing urlset: `/tools/*` clinical teasers + pathway `…/osce` and `…/clinical-scenarios`
 * when {@link isOsceScenariosPubliclyEnabled} / {@link isClinicalScenariosPubliclyEnabled} allow.
 * Does not list learner `/app/*` or gated `/modules/ecg|lab-values` shells.
 */
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  let xml: string;

  try {
    const rawStrings = collectClinicalModulesSitemapUrls(origin);
    const entries: SitemapUrlEntry[] = rawStrings.map((loc) => ({ loc }));
    const filtered = filterPublicSitemapEntries(entries, origin);

    const seen = new Set<string>();
    const unique = filtered.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(
      unique.length > 0 ? unique : [{ loc: `${origin}/tools/lab-values` }],
    );
  } catch {
    const fallbackEntries: SitemapUrlEntry[] = SITEMAP_FALLBACK_CLINICAL_MODULES_PATHS.map((path) => ({
      loc: `${origin}${path}`,
    }));
    const filteredFallback = filterPublicSitemapEntries(fallbackEntries, origin);
    xml = buildSitemapUrlsetFromAbsoluteUrls(
      filteredFallback.length > 0 ? filteredFallback : [{ loc: `${origin}/tools/lab-values` }],
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

import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import {
  buildSitemapUrlsetFromAbsoluteUrls,
  collectPathwayLessonSeoUrls,
  normalizeOrigin,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-static-xml";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Public sitemap merging static paths, live blog posts, and verified lesson pages.
 * DB failures fall back to static URLs only — never 503s.
 * Origin follows {@link resolveCanonicalSiteOrigin}. Always returns valid application/xml (200 or 304).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATIC_SITEMAP_PATHS = [
  "/",
  "/pricing",
  "/login",
  "/blog",
  "/us/rn/nclex-rn",
  "/us/rn/nclex-rn/lessons",
  "/us/pn/nclex-pn",
  "/us/pn/nclex-pn/lessons",
  "/us/np/fnp",
  "/us/np/fnp/lessons",
  "/canada/rn/nclex-rn",
  "/canada/rn/nclex-rn/lessons",
  "/canada/pn/rex-pn",
  "/canada/pn/rex-pn/lessons",
  "/canada/np/cnple",
  "/canada/np/cnple/lessons",
] as const;

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Strip whitespace and line breaks so URLs are safe for XML loc elements. */
function normalizeSitemapUrl(url: string): string {
  return url.trim().replace(/[\r\n]+/g, "");
}

function buildStaticFallbackXml(origin: string): string {
  const o = normalizeOrigin(origin);
  const urls = STATIC_SITEMAP_PATHS.map((path) => {
    const loc = `${o}${path === "/" ? "" : path}`;
    return `  <url><loc>${xmlEscape(loc)}</loc></url>`;
  }).join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export async function GET(request: Request): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());

  const staticEntries: SitemapUrlEntry[] = STATIC_SITEMAP_PATHS.map((path) => ({
    loc: `${origin}${path === "/" ? "" : path}`,
  }));

  let xml: string;

  try {
    const { listBlogSitemapEntriesSafe } = await import("@/lib/seo/sitemap-blog-xml");

    const [blogEntries, lessonUrls] = await Promise.all([
      listBlogSitemapEntriesSafe(),
      collectPathwayLessonSeoUrls(origin),
    ]);

    const allEntries: SitemapUrlEntry[] = [
      ...staticEntries,
      ...blogEntries.map((e) => ({ ...e, loc: normalizeSitemapUrl(e.loc) })),
      ...lessonUrls.map((u) => ({ loc: normalizeSitemapUrl(u) })),
    ];

    const seen = new Set<string>();
    const unique = allEntries.filter((e) => {
      if (!e.loc || seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    xml = buildSitemapUrlsetFromAbsoluteUrls(unique);
  } catch {
    xml = buildStaticFallbackXml(origin);
  }

  const etag = buildPublicResponseEtag(xml);
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}

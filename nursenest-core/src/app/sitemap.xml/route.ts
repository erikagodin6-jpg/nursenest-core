import { buildPublicResponseEtag, requestMatchesEtag } from "@/lib/http/public-response-cache";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

/**
 * Lightweight public sitemap.
 *
 * No Prisma, Stripe, auth/session, external fetches, or lesson/blog inventories. Origin follows
 * {@link resolveCanonicalSiteOrigin}. Always returns valid `application/xml` (200 or 304).
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

function buildStaticSitemapXml(origin: string): string {
  const urls = STATIC_SITEMAP_PATHS.map((path) => {
    const loc = `${origin}${path === "/" ? "" : path}`;
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

export function GET(request: Request): Response {
  const origin = resolveCanonicalSiteOrigin();
  const xml = buildStaticSitemapXml(origin);
  const etag = buildPublicResponseEtag(xml);

  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);

  if (requestMatchesEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { status: 200, headers });
}
